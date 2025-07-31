'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { signupSchema } from '@/lib/validations'
import { Eye, EyeOff, Github, Lock, LogOut, Mail, Shield, Terminal, User, UserPlus } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaDiscord, FaGoogle } from 'react-icons/fa'
import { z } from 'zod'

export default function SignupPage() {
    const { data: session, status } = useSession()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (session) {
            router.push('/dashboard')
        }
    }, [session, router])

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/signup' })
    }

    const validateForm = (data: typeof formData) => {
        try {
            signupSchema.parse(data)
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
        setError('')
        setValidationErrors({})

        // Validate form data
        if (!validateForm(formData)) {
            return
        }

        if (!formData.acceptTerms) {
            setError('Please accept the terms and conditions')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (errorData.details) {
                    // Handle zod validation errors from server
                    const errors: Record<string, string> = {}
                    errorData.details.forEach((err: any) => {
                        if (err.path[0]) {
                            errors[err.path[0] as string] = err.message
                        }
                    })
                    setValidationErrors(errors)
                } else {
                    setError(errorData.error || 'Registration failed')
                }
                return
            }

            const data = await response.json()

            // Show success message about email verification
            setError(`✅ ${data.message || 'Registration successful! Please check your email for verification link.'}`)

            // Auto-login after successful registration
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError('Registration successful but login failed. Please try logging in manually.')
            } else {
                // Redirect to dashboard after successful registration
                router.push('/dashboard')
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Registration failed')
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
                            <UserPlus className="w-6 h-6 text-primary-foreground" />
                            <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
                        NEW_USER_INIT
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                        {'>'} CREATE_ACCOUNT.exe
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
                            <Label htmlFor="name" className="text-sm font-mono text-foreground flex items-center gap-2">
                                <User className="w-4 h-4" />
                                USERNAME
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="neural_user"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="font-mono text-sm bg-background/50 border-border/70 focus:border-primary"
                                required
                            />
                            {validationErrors.name && (
                                <p className="text-xs font-mono text-destructive">
                                    {'>'} {validationErrors.name}
                                </p>
                            )}
                        </div>

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
                            {validationErrors.email && (
                                <p className="text-xs font-mono text-destructive">
                                    {'>'} {validationErrors.email}
                                </p>
                            )}
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
                            {validationErrors.password && (
                                <p className="text-xs font-mono text-destructive">
                                    {'>'} {validationErrors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-mono text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                CONFIRM_HASH
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="font-mono text-sm bg-background/50 border-border/70 focus:border-primary pr-10"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-xs font-mono text-destructive">
                                    {'>'} {validationErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.acceptTerms}
                                onCheckedChange={(checked) =>
                                    setFormData(prev => ({ ...prev, acceptTerms: checked === true }))
                                }
                                className="border-border/70"
                            />
                            <Label htmlFor="terms" className="text-sm font-mono text-muted-foreground">
                                ACCEPT{' '}
                                <Link href="/terms" className="text-primary hover:text-primary/80 underline-offset-4 hover:underline">
                                    TERMS_OF_SERVICE
                                </Link>
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                    CREATING_USER...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    REGISTER_USER
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
                        <span className="font-mono">EXISTING_USER? </span>
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
