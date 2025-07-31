import { prisma } from '@/lib/db'
import { EmailVerificationService } from '@/lib/email-verification'
import { signupSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body with zod
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    // Generate and send verification email
    try {
      const verificationToken = await EmailVerificationService.generateVerificationToken(validatedData.email)
      await EmailVerificationService.sendVerificationEmail(validatedData.email, verificationToken)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email sending fails
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(
      {
        ...userWithoutPassword,
        message: 'Registration successful. Please check your email for verification link.'
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
