'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Application error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-destructive/5"></div>

            <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-sm border-destructive/50">
                <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-destructive flex items-center justify-center relative">
                            <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
                            <div className="absolute inset-0 bg-destructive opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold font-mono tracking-wider text-destructive">
                        SYSTEM_ERROR
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-mono text-sm">
                        {'>'} APPLICATION_FAULT.exe
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 text-center">
                    <div className="space-y-2">
                        <p className="text-sm font-mono text-foreground">
                            An unexpected error occurred while processing your request.
                        </p>
                        <p className="text-xs font-mono text-muted-foreground">
                            Error: {error.message || 'Unknown error'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={reset}
                            className="w-full font-mono bg-primary hover:bg-primary/90 glow-effect"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            RETRY_OPERATION
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/'}
                            className="w-full font-mono bg-background/50 border-border/70 hover:bg-accent/50 hover:border-accent"
                        >
                            RETURN_TO_HOME
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
