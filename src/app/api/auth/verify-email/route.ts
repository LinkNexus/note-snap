import { EmailVerificationService } from '@/lib/email-verification'
import { verifyEmailSchema } from '@/lib/validations'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Verify email request body:', body)

    // Validate request body with zod
    const validatedData = verifyEmailSchema.parse(body)
    console.log('Validated data:', validatedData)

    const result = await EmailVerificationService.verifyEmail(validatedData.token)
    console.log('EmailVerificationService result:', result)

    if (result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      )
    } else {
      console.log('Verification failed with message:', result.message)
      return NextResponse.json(
        { error: result.message || 'Verification failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('Zod validation error:', error.errors)
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
