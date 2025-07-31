'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPassword } from '@/hooks/use-api'
import { resetPasswordSchema } from '@/lib/validations'
import { ArrowLeft, CheckCircle, Eye, EyeOff, Lock, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { z } from 'zod'

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [validToken, setValidToken] = useState<boolean | null>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const resetPasswordMutation = useResetPassword()

    useEffect(() => {
        // Verify token on mount
        if (token) {
            verifyToken(token)
        } else {
            setValidToken(false)
        }
    }, [token])

    const verifyToken = async (token: string) => {
        try {
            const response = await fetch('/api/auth/reset-password/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token })
            })

            if (response.ok) {
                setValidToken(true)
            } else {
                setValidToken(false)
            }
        } catch (error) {
            setValidToken(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!token) {
            setError('Invalid or missing token')
            return
        }

        // Validate form data with zod
        try {
            resetPasswordSchema.parse({
                token,
                password,
                confirmPassword,
            })
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.errors[0]
                if (firstError.path[0] !== 'token') {
                    setError(firstError.message)
                }
            }
            return
        }

        // Use React Query mutation
        resetPasswordMutation.mutate(
            { token, password, confirmPassword },
            {
                onSuccess: () => {
                    setSuccess(true)
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                },
                onError: (error) => {
                    setError(error.message)
                },
            }
        )
    }

    if (validToken === null) {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
                <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                    <CardContent className="flex items-center justify-center p-8">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 font-mono text-sm">VALIDATING_TOKEN...</span>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (validToken === false) {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

                <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-destructive flex items-center justify-center relative">
                                <Shield className="w-6 h-6 text-destructive-foreground" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold font-mono tracking-wider text-destructive">
                            INVALID_TOKEN
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-mono text-sm">
                            {'>'} ACCESS_DENIED.exe
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-sm font-mono text-foreground">
                                The password reset token is invalid or has expired.
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">
                                Please request a new password reset link.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button asChild className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect">
                                <Link href="/forgot-password">
                                    <Shield className="w-4 h-4 mr-2" />
                                    REQUEST_NEW_RESET
                                </Link>
                            </Button>

                            <Button asChild variant="outline" className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent">
                                <Link href="/login">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    RETURN_TO_LOGIN
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

                <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-green-500 flex items-center justify-center relative">
                                <CheckCircle className="w-6 h-6 text-white" />
                                <div className="absolute inset-0 bg-green-500 opacity-20 animate-pulse"></div>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold font-mono tracking-wider text-green-500">
                            PASSWORD_RESET
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-mono text-sm">
                            {'>'} SUCCESS.exe
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-sm font-mono text-foreground">
                                Your password has been successfully reset.
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">
                                Redirecting to login...
                            </p>
                        </div>

                        <div className="w-full bg-background/50 border border-border/70 rounded-md p-3">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-mono text-muted-foreground">REDIRECT_IN_PROGRESS</span>
                            </div>
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
                            <Lock className="w-6 h-6 text-primary-foreground" />
                            <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
                        RESET_PASSWORD
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                        {'>'} SECURE_UPDATE.exe
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-mono text-foreground">
                            Enter your new password to complete the reset process.
                        </p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                            <AlertDescription className="font-mono text-sm">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-mono text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                NEW_PASSWORD
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="font-mono text-sm bg-background/50 border-border/70 focus:border-primary pr-10"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-mono text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                CONFIRM_PASSWORD
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="font-mono text-sm bg-background/50 border-border/70 focus:border-primary pr-10"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect"
                            disabled={resetPasswordMutation.isPending}
                        >
                            {resetPasswordMutation.isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                    UPDATING_PASSWORD...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    UPDATE_PASSWORD
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
