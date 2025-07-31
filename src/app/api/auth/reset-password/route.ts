import { prisma } from '@/lib/db'
import { resetPasswordSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate request body with zod
        const validatedData = resetPasswordSchema.parse(body)

        // Find the reset token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token: validatedData.token }
        })

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 400 }
            )
        }

        // Check if token is expired
        if (resetToken.expires < new Date()) {
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { token: validatedData.token }
            })
            return NextResponse.json(
                { error: 'Token has expired' },
                { status: 400 }
            )
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12)

        // Update the user's password
        await prisma.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword }
        })

        // Delete the used token
        await prisma.passwordResetToken.delete({
            where: { token: validatedData.token }
        })

        return NextResponse.json(
            { message: 'Password has been reset successfully' },
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

        console.error('Password reset error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
