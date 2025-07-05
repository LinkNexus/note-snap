'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Failed to send verification email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

        <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-green-600 flex items-center justify-center relative">
                <CheckCircle className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-green-600 opacity-20 animate-pulse"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-mono tracking-wider text-green-600">
              EMAIL_SENT
            </CardTitle>
            <CardDescription className="text-muted-foreground font-mono text-sm">
              {'>'} VERIFICATION_DISPATCHED.exe
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-sm font-mono text-foreground">
                Verification email has been sent to:
              </p>
              <p className="text-sm font-mono text-primary bg-primary/10 px-3 py-2 border border-primary/20">
                {email}
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Check your inbox and click the verification link.
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
                onClick={() => setIsSuccess(false)}
                className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent"
              >
                <Send className="w-4 h-4 mr-2" />
                SEND_ANOTHER
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
              <Send className="w-6 h-6 text-primary-foreground" />
              <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-mono tracking-wider text-primary">
            RESEND_VERIFICATION
          </CardTitle>
          <CardDescription className="text-muted-foreground font-mono text-sm">
            {'>'} EMAIL_DISPATCH.exe
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md font-mono">
              {'>'} ERROR: {error}
            </div>
          )}

          <div className="space-y-2 text-center">
            <p className="text-sm font-mono text-foreground">
              Enter your email address to receive a new verification link.
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
                  SENDING_EMAIL...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  SEND_VERIFICATION
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
