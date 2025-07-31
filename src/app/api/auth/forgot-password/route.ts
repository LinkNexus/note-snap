import { prisma } from '@/lib/db'
import { EmailVerificationService } from '@/lib/email-verification'
import { forgotPasswordSchema } from '@/lib/validations'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate request body with zod
        const validatedData = forgotPasswordSchema.parse(body)

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: validatedData.email }
        })

        if (!user) {
            // Return success even if user doesn't exist for security
            return NextResponse.json(
                { message: 'If an account with that email exists, a password reset link has been sent.' },
                { status: 200 }
            )
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        // Store reset token in database
        await prisma.passwordResetToken.upsert({
            where: { email: validatedData.email },
            update: {
                token: resetToken,
                expires: resetTokenExpiry
            },
            create: {
                email: validatedData.email,
                token: resetToken,
                expires: resetTokenExpiry
            }
        })

        // Send password reset email
        await EmailVerificationService.sendPasswordResetEmail(validatedData.email, resetToken)

        return NextResponse.json(
            { message: 'If an account with that email exists, a password reset link has been sent.' },
            { status: 200 }
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

        console.error('Password reset request error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
