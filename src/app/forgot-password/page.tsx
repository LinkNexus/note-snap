'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, LogOut, Mail, RotateCcw, Shield, Terminal } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ForgotPasswordPage() {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/forgot-password' })
    }

    // Show loading while checking session
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    // Show already authenticated message
    if (session) {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

                <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-primary flex items-center justify-center relative">
                                <Shield className="w-6 h-6 text-primary-foreground" />
                                <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
                            SESSION_ACTIVE
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-mono text-sm">
                            {'>'} USER_AUTHENTICATED.exe
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-sm font-mono text-foreground">
                                Welcome back, {session.user?.name || 'User'}!
                            </p>
                            <p className="text-xs font-mono text-muted-foreground">
                                You are already signed in. No need to reset your password.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button asChild className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect">
                                <Link href="/dashboard">
                                    <Terminal className="w-4 h-4 mr-2" />
                                    OPEN_DASHBOARD
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleSignOut}
                                className="w-full font-mono bg-background/50 border-border/70 hover:bg-destructive/10 hover:border-destructive text-destructive"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                SWITCH_ACCOUNT
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            // Always show success message for security
            setIsSubmitted(true)
        } catch (error) {
            console.error('Password reset request error:', error)
            // Still show success message for security
            setIsSubmitted(true)
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

                <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-primary flex items-center justify-center relative">
                                <Shield className="w-6 h-6 text-primary-foreground" />
                                <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
                            RECOVERY_SENT
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-mono text-sm">
                            {'>'} CHECK_EMAIL.exe
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 text-center">
                        <div className="space-y-2">
                            <p className="text-sm font-mono text-foreground">
                                PASSWORD_RESET_INSTRUCTIONS have been sent to:
                            </p>
                            <p className="text-sm font-mono text-primary bg-primary/10 px-3 py-2 border border-primary/20">
                                {email}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-mono text-muted-foreground">
                                If you don't receive an email within 5 minutes, check your spam folder or try again.
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
                                RESEND_RECOVERY
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
                            <RotateCcw className="w-6 h-6 text-primary-foreground" />
                            <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
                        RECOVER_ACCESS
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                        {'>'} RESET_PASSWORD.exe
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-mono text-foreground">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

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
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                    SENDING_RECOVERY...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    SEND_RECOVERY_LINK
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
