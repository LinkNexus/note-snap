'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useResendVerification, useVerifyEmail } from '@/hooks/use-api'
import { ArrowLeft, CheckCircle, Mail, RotateCcw, XCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { data: session, update } = useSession()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const verifyEmailMutation = useVerifyEmail()
  const resendVerificationMutation = useResendVerification()

  const handleResendVerification = () => {
    // Try to get email from session, otherwise ask user
    const userEmail = session?.user?.email || prompt('Please enter your email address:')
    if (userEmail) {
      resendVerificationMutation.mutate(
        { email: userEmail },
        {
          onError: (error: any) => {
            setError(`Failed to send verification email: ${error.message}`)
          },
        }
      )
    }
  }

  useEffect(() => {
    if (!token) {
      setError('Invalid verification link')
      setIsLoading(false)
      return
    }

    console.log('Attempting to verify email with token:', token)

    // Use React Query mutation to verify email
    verifyEmailMutation.mutate(
      { token },
      {
        onSuccess: (data) => {
          console.log('Verification successful:', data)
          setIsVerified(true)
          setMessage(data.message || 'Email verified successfully!')
          setIsLoading(false)
          // Reload the session to update emailVerified status
          update()
        },
        onError: (error: any) => {
          console.error('Verification failed:', error)
          setError(error.message || 'Email verification failed')
          setIsLoading(false)
        },
      }
    )
  }, [token, verifyEmailMutation.mutate, update])

  if (isLoading) {
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
              VERIFYING_EMAIL
            </CardTitle>
            <CardDescription className="text-muted-foreground font-mono text-sm">
              {'>'} PROCESSING_TOKEN.exe
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-mono text-foreground">Verifying your email...</span>
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
            <div className={`w-12 h-12 flex items-center justify-center relative ${isVerified ? 'bg-green-600' : 'bg-destructive'
              }`}>
              {isVerified ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <XCircle className="w-6 h-6 text-white" />
              )}
              <div className="absolute inset-0 bg-current opacity-20 animate-pulse"></div>
            </div>
          </div>
          <CardTitle className={`text-2xl font-bold font-mono tracking-wider ${isVerified ? 'text-green-600' : 'text-destructive'
            }`}>
            {isVerified ? 'EMAIL_VERIFIED' : 'VERIFICATION_FAILED'}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-mono text-sm">
            {'>'} {isVerified ? 'SUCCESS.exe' : 'ERROR.exe'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-sm font-mono text-foreground">
              {isVerified ? message : error}
            </p>

            {isVerified && (
              <p className="text-xs font-mono text-muted-foreground">
                You can now access all NOTE_SNAP features.
              </p>
            )}

            {resendVerificationMutation.isSuccess && !isVerified && (
              <p className="text-xs font-mono text-green-600">
                ✅ Verification email sent! Please check your inbox.
              </p>
            )}
          </div>

          <div className="space-y-3">
            {isVerified ? (
              <Button asChild className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ACCESS_DASHBOARD
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect">
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    RETURN_TO_LOGIN
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending}
                  className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {resendVerificationMutation.isPending ? 'SENDING...' : 'RESEND_VERIFICATION'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
