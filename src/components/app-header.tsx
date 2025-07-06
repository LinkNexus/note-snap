'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, LogOut, Settings, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

interface AppHeaderProps {
    showAuthButtons?: boolean
    className?: string
}

export function AppHeader({ showAuthButtons = true, className = "" }: AppHeaderProps) {
    const { data: session } = useSession()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
    }

    const getUserInitials = (name?: string | null) => {
        if (!name) return 'U'
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }

    return (
        <header className={`border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 ${className}`}>
            <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center relative">
                        <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                        <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                    </div>
                    <Link href="/" className="text-lg sm:text-2xl font-bold font-mono tracking-wider text-primary hover:text-primary/90 transition-colors">
                        NOTE_SNAP
                    </Link>
                </div>

                {showAuthButtons && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        {session ? (
                            <>
                                {/* Dashboard Navigation for authenticated users */}
                                <nav className="hidden md:flex items-center gap-4">
                                    <Link
                                        href="/dashboard"
                                        className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        DASHBOARD
                                    </Link>
                                    <Link
                                        href="/create"
                                        className="text-sm font-mono text-muted-foreground hover:text-secondary transition-colors"
                                    >
                                        CREATE
                                    </Link>
                                    <Link
                                        href="/summaries"
                                        className="text-sm font-mono text-muted-foreground hover:text-accent transition-colors"
                                    >
                                        SUMMARIES
                                    </Link>
                                </nav>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                                            <Avatar className="border-2 border-primary/30 w-8 h-8 sm:w-10 sm:h-10">
                                                <AvatarImage src={session?.user?.image || ""} />
                                                <AvatarFallback className="bg-primary text-primary-foreground font-mono text-xs sm:text-sm">
                                                    {getUserInitials(session?.user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1 leading-none">
                                                {session?.user?.name && (
                                                    <p className="font-mono text-sm text-foreground">{session.user.name}</p>
                                                )}
                                                {session?.user?.email && (
                                                    <p className="font-mono text-xs text-muted-foreground">{session.user.email}</p>
                                                )}
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild className="font-mono text-sm">
                                            <Link href="/dashboard">
                                                <User className="mr-2 h-4 w-4" />
                                                DASHBOARD
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="font-mono text-sm">
                                            <Settings className="mr-2 h-4 w-4" />
                                            SETTINGS
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="font-mono text-sm text-destructive focus:text-destructive"
                                            onClick={handleSignOut}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            SIGN_OUT
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                {/* Authentication buttons for non-authenticated users */}
                                <Button variant="ghost" asChild className="font-mono text-xs sm:text-sm px-2 sm:px-4">
                                    <Link href="/login">SIGN_IN</Link>
                                </Button>
                                <Button asChild className="font-mono bg-primary hover:bg-primary/90 glow-effect text-xs sm:text-sm px-3 sm:px-4">
                                    <Link href="/signup">JOIN_NETWORK</Link>
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}
