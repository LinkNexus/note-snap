"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
import { ReactNode, useState } from "react"

interface ProvidersProps {
    children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                retry: 1,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                {children}
                <Toaster />
            </SessionProvider>
        </QueryClientProvider>
    )
}
