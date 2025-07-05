'use client'

import { useEmailVerification } from '@/components/email-verification-banner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail, Shield } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

interface VerificationRequiredProps {
  children: React.ReactNode
  feature?: string
  fallback?: React.ReactNode
}

export function VerificationRequired({
  children,
  feature = "this feature",
  fallback
}: VerificationRequiredProps) {
  const { isVerified, requiresVerification } = useEmailVerification()
  const { update } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await update()
    } finally {
      setIsRefreshing(false)
    }
  }

  if (!requiresVerification) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border-amber-200 dark:border-amber-800">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-amber-600 flex items-center justify-center relative">
              <Lock className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-amber-600 opacity-20 animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-xl font-bold font-mono tracking-wider text-amber-600">
            VERIFICATION_REQUIRED
          </CardTitle>
          <CardDescription className="text-muted-foreground font-mono text-sm">
            {'>'} ACCESS_DENIED.exe
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <div className="space-y-2">
            <p className="text-sm font-mono text-foreground">
              You need to verify your email address to access {feature}.
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Check your email for the verification link.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full font-mono bg-primary hover:bg-primary/90">
              <Link href="/resend-verification">
                <Mail className="w-4 h-4 mr-2" />
                RESEND_VERIFICATION
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50"
            >
              {isRefreshing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                  REFRESHING...
                </div>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  REFRESH_STATUS
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for conditional rendering based on verification status
export function useVerificationGate() {
  const { isVerified, requiresVerification } = useEmailVerification()

  return {
    canAccess: isVerified,
    needsVerification: requiresVerification,
    renderIfVerified: (component: React.ReactNode) =>
      isVerified ? component : null,
    renderIfNotVerified: (component: React.ReactNode) =>
      requiresVerification ? component : null
  }
}
