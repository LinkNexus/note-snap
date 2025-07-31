'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPassword } from '@/hooks/use-api'
import { forgotPasswordSchema } from '@/lib/validations'
import { ArrowLeft, Mail, RotateCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export default function ForgotPasswordPage() {
    const { data: session, status } = useSession()
    const [email, setEmail] = useState('')
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter()

    const forgotPasswordMutation = useForgotPassword()

    // Redirect if already authenticated
    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    const validateForm = (data: { email: string }) => {
        try {
            forgotPasswordSchema.parse(data)
            setValidationErrors({})
            return true
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message
                    }
                })
                setValidationErrors(errors)
            }
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm({ email })) {
            return
        }

        forgotPasswordMutation.mutate(
            { email },
            {
                onSuccess: () => {
                    setIsSubmitted(true)
                },
                onError: (error: any) => {
                    if (error.message?.includes('details')) {
                        // Handle zod validation errors from server
                        try {
                            const errorData = JSON.parse(error.message)
                            if (errorData.details) {
                                const errors: Record<string, string> = {}
                                errorData.details.forEach((err: any) => {
                                    if (err.path[0]) {
                                        errors[err.path[0] as string] = err.message
                                    }
                                })
                                setValidationErrors(errors)
                            }
                        } catch {
                            // If parsing fails, just show the error message
                        }
                    }
                }
            }
        )
    }

    // Show loading while checking session
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    // Redirect if already authenticated
    if (session) {
        router.push('/dashboard')
        return null
    }

    // Show success message after submission
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

                <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-green-600 flex items-center justify-center relative">
                                <Mail className="w-6 h-6 text-white" />
                                <div className="absolute inset-0 bg-green-600 opacity-20 animate-pulse"></div>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold font-mono tracking-wider text-green-600">
                            EMAIL_SENT
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-mono text-sm">
                            {'>'} PASSWORD_RESET.exe
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-sm font-mono text-foreground">
                                Password reset instructions have been sent to your email.
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">
                                Please check your inbox and follow the link to reset your password.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button asChild className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect">
                                <Link href="/login">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    RETURN_TO_LOGIN
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setIsSubmitted(false)}
                                className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                SEND_AGAIN
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

            <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center relative">
                            <Mail className="w-6 h-6 text-primary-foreground" />
                            <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
                        FORGOT_PASSWORD
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                        {'>'} RESET_REQUEST.exe
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm font-mono text-foreground">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    </div>

                    {forgotPasswordMutation.isError && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md font-mono">
                            {'>'} ERROR: {forgotPasswordMutation.error?.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-mono text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                EMAIL_ADDRESS
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@notepad.sys"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="font-mono text-sm bg-background/50 border-border/70 focus:border-primary"
                                required
                            />
                            {validationErrors.email && (
                                <p className="text-xs font-mono text-destructive">
                                    {'>'} {validationErrors.email}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect"
                            disabled={forgotPasswordMutation.isPending}
                        >
                            {forgotPasswordMutation.isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                    SENDING...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    SEND_RESET_LINK
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        <span className="font-mono">REMEMBER_PASSWORD? </span>
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary/80 font-mono underline-offset-4 hover:underline"
                        >
                            ACCESS_TERMINAL
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
