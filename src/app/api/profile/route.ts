import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updatePasswordSchema, updatePreferencesSchema, updateProfileSchema } from '@/lib/validations'
import { compare, hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                website: true,
                github: true,
                emailNotifications: true,
                publicProfile: true,
                shareAnalytics: true,
                createdAt: true,
                updatedAt: true,
                emailVerified: true,
                accounts: {
                    select: {
                        provider: true,
                        type: true,
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            user: {
                ...user,
                bio: user.bio || '',
                website: user.website || '',
                github: user.github || '',
            }
        })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { type, ...data } = body

        if (type === 'profile') {
            const validatedData = updateProfileSchema.parse(data)

            const updatedUser = await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    name: validatedData.name,
                    bio: validatedData.bio,
                    website: validatedData.website,
                    github: validatedData.github,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    bio: true,
                    website: true,
                    github: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                    accounts: {
                        select: {
                            provider: true,
                            type: true,
                        }
                    }
                }
            })

            return NextResponse.json({
                message: 'Profile updated successfully',
                user: updatedUser
            })
        } else if (type === 'password') {
            const validatedData = updatePasswordSchema.parse(data)

            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { password: true }
            })

            if (!user?.password) {
                return NextResponse.json({
                    error: 'Account uses social login. Password change not available.'
                }, { status: 400 })
            }

            const isValidPassword = await compare(validatedData.currentPassword, user.password)
            if (!isValidPassword) {
                return NextResponse.json({
                    error: 'Current password is incorrect'
                }, { status: 400 })
            }

            const hashedNewPassword = await hash(validatedData.newPassword, 12)

            await prisma.user.update({
                where: { id: session.user.id },
                data: { password: hashedNewPassword }
            })

            return NextResponse.json({
                message: 'Password updated successfully'
            })
        } else if (type === 'preferences') {
            const validatedData = updatePreferencesSchema.parse(data)

            const updatedUser = await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    emailNotifications: validatedData.emailNotifications,
                    publicProfile: validatedData.publicProfile,
                    shareAnalytics: validatedData.shareAnalytics,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    bio: true,
                    website: true,
                    github: true,
                    emailNotifications: true,
                    publicProfile: true,
                    shareAnalytics: true,
                    createdAt: true,
                    updatedAt: true,
                    emailVerified: true,
                    accounts: {
                        select: {
                            provider: true,
                            type: true,
                        }
                    }
                }
            })

            return NextResponse.json({
                message: 'Preferences updated successfully',
                user: updatedUser
            })
        } else {
            return NextResponse.json({ error: 'Invalid update type' }, { status: 400 })
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.errors
            }, { status: 400 })
        }

        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE() {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Delete user and all related data (cascading deletes should handle this)
        await prisma.user.delete({
            where: { id: session.user.id }
        })

        return NextResponse.json({
            message: 'Account deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting account:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
