'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { loginSchema } from '@/lib/validations'
import { Eye, EyeOff, Github, Lock, LogOut, Mail, Shield, Terminal } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaDiscord, FaGoogle } from 'react-icons/fa'
import { z } from 'zod'

export default function LoginPage() {
    const { data: session, status } = useSession()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' })
    }

    const validateForm = (data: typeof formData) => {
        try {
            loginSchema.parse(data)
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
                                You are already signed in to NOTE_SNAP.
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
        setError('')

        try {
            // Validate form data with Zod schema
            await loginSchema.parseAsync(formData)

            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid credentials')
            } else {
                router.push('/dashboard')
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle Zod validation errors
                setError(error.errors.map(err => err.message).join(', '))
            } else {
                setError('An error occurred. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = async (provider: string) => {
        setIsLoading(true)
        try {
            await signIn(provider, { callbackUrl: '/dashboard' })
        } catch (error) {
            console.error('Social login error:', error)
            setError('Social login is not available in development mode.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

            <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
                <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-primary flex items-center justify-center relative">
                            <Terminal className="w-6 h-6 text-primary-foreground" />
                            <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
                        ACCESS_TERMINAL
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                        {'>'} AUTHENTICATE_USER.exe
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md font-mono">
                            {'>'} ERROR: {error}
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
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="font-mono text-sm bg-background/50 border-border/70 focus:border-primary"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-mono text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                PASSWORD_HASH
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="font-mono text-sm bg-background/50 border-border/70 focus:border-primary pr-10"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
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

                        <div className="flex items-center justify-between text-sm">
                            <Link
                                href="/forgot-password"
                                className="text-primary hover:text-primary/80 font-mono underline-offset-4 hover:underline"
                            >
                                RECOVER_ACCESS?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                    AUTHENTICATING...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    INITIALIZE_SESSION
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground font-mono">
                                OR_CONNECT_VIA
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <Button
                            variant="outline"
                            onClick={() => handleSocialLogin('google')}
                            className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent"
                            disabled={isLoading}
                        >
                            <FaGoogle className="w-4 h-4 mr-2" />
                            GOOGLE_AUTH
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleSocialLogin('github')}
                            className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent"
                            disabled={isLoading}
                        >
                            <Github className="w-4 h-4 mr-2" />
                            GITHUB_AUTH
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleSocialLogin('discord')}
                            className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent"
                            disabled={isLoading}
                        >
                            <FaDiscord className="w-4 h-4 mr-2" />
                            DISCORD_AUTH
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        <span className="font-mono">NEW_USER? </span>
                        <Link
                            href="/signup"
                            className="text-primary hover:text-primary/80 font-mono underline-offset-4 hover:underline"
                        >
                            CREATE_ACCOUNT
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
