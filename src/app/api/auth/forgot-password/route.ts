import { prisma } from '@/lib/db'
import { EmailVerificationService } from '@/lib/email-verification'
import crypto from 'crypto'
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

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
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
            where: { email },
            update: {
                token: resetToken,
                expires: resetTokenExpiry
            },
            create: {
                email,
                token: resetToken,
                expires: resetTokenExpiry
            }
        })

        // Send password reset email
        await EmailVerificationService.sendPasswordResetEmail(email, resetToken)

        return NextResponse.json(
            { message: 'If an account with that email exists, a password reset link has been sent.' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Password reset request error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
