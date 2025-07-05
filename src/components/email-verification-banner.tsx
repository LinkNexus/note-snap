'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import '@/types/auth'; // Import type extensions
import { AlertTriangle, Mail, Send, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface EmailVerificationBannerProps {
  onDismiss?: () => void
}

export function EmailVerificationBanner({ onDismiss }: EmailVerificationBannerProps) {
  const { data: session } = useSession()
  const [isResending, setIsResending] = useState(false)
  const [isResent, setIsResent] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show if user is verified or no session
  if (!session?.user?.email || session.user.emailVerified || isDismissed) {
    return null
  }

  const handleResendVerification = async () => {
    setIsResending(true)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user?.email }),
      })

      if (response.ok) {
        setIsResent(true)
        setTimeout(() => setIsResent(false), 5000) // Hide success message after 5 seconds
      }
    } catch (error) {
      console.error('Failed to resend verification:', error)
    } finally {
      setIsResending(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-sm font-mono text-amber-800 dark:text-amber-200">
              EMAIL_VERIFICATION_REQUIRED
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-amber-700 dark:text-amber-300 font-mono text-sm mb-3">
          Please verify your email address to access all NOTE_SNAP features.
        </CardDescription>

        {isResent ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-mono">Verification email sent!</span>
          </div>
        ) : (
          <Button
            onClick={handleResendVerification}
            disabled={isResending}
            size="sm"
            className="font-mono bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isResending ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                SENDING...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-3 h-3" />
                RESEND_VERIFICATION
              </div>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Hook to check if user's email is verified
export function useEmailVerification() {
  const { data: session } = useSession()

  return {
    isVerified: !!session?.user?.emailVerified,
    email: session?.user?.email,
    requiresVerification: !!(session?.user?.email && !session.user.emailVerified)
  }
}
