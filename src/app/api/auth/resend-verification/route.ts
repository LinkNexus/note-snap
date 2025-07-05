import { EmailVerificationService } from '@/lib/email-verification'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const token = await EmailVerificationService.resendVerification(email)
    await EmailVerificationService.sendVerificationEmail(email, token)

    return NextResponse.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}
