import { EmailVerificationService } from '@/lib/email-verification'
import { resendVerificationSchema } from '@/lib/validations'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = resendVerificationSchema.parse(body)

    const token = await EmailVerificationService.resendVerification(email)
    await EmailVerificationService.sendVerificationEmail(email, token)

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email'

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
