'use client'

import { EmailVerificationBanner, useEmailVerification } from "@/components/email-verification-banner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Brain,
  Clock,
  FileText,
  Filter,
  Lock,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  TrendingUp,
  User,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function Dashboard() {
  const { data: session } = useSession()
  const { isVerified, requiresVerification } = useEmailVerification()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getUserName = (name?: string | null) => {
    if (!name) return 'USER'
    return name.toUpperCase().replace(' ', '_')
  }

  const recentSummaries = [
    {
      id: 1,
      title: "NEURAL_PSYCHOLOGY_CH03",
      subject: "Psychology",
      createdAt: "2 hours ago",
      wordCount: 1250,
      originalLength: 5000,
      status: "completed",
    },
    {
      id: 2,
      title: "CALCULUS_INTEGRATION_PROTOCOLS",
      subject: "Mathematics",
      createdAt: "1 day ago",
      wordCount: 890,
      originalLength: 3200,
      status: "completed",
    },
    {
      id: 3,
      title: "INDUSTRIAL_REVOLUTION_DATA",
      subject: "History",
      createdAt: "2 days ago",
      wordCount: 1100,
      originalLength: 4500,
      status: "completed",
    },
    {
      id: 4,
      title: "ORGANIC_CHEMISTRY_REACTIONS",
      subject: "Chemistry",
      createdAt: "3 days ago",
      wordCount: 950,
      originalLength: 3800,
      status: "processing",
    },
  ]

  const stats = [
    {
      title: "TOTAL_SUMMARIES",
      value: "24",
      change: "+3 this cycle",
      icon: FileText,
      color: "primary",
    },
    {
      title: "TIME_SAVED",
      value: "18.5h",
      change: "+2.3h efficiency",
      icon: Clock,
      color: "secondary",
    },
    {
      title: "NEURAL_EFFICIENCY",
      value: "73%",
      change: "+5% optimization",
      icon: TrendingUp,
      color: "accent",
    },
  ]

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-2xl font-bold font-mono text-primary">NOTE_SNAP</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              asChild
              className="font-mono bg-primary hover:bg-primary/90 relative text-xs sm:text-sm px-2 sm:px-4"
              disabled={requiresVerification}
            >
              <Link href="/create">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">NEW_SUMMARY</span>
                <span className="sm:hidden">NEW</span>
                {requiresVerification && <Lock className="w-3 h-3 ml-1 text-primary-foreground/70" />}
              </Link>
            </Button>
            
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
                <DropdownMenuItem className="font-mono text-sm">
                  <User className="mr-2 h-4 w-4" />
                  PROFILE_CONFIG
                </DropdownMenuItem>
                <DropdownMenuItem className="font-mono text-sm">
                  <Settings className="mr-2 h-4 w-4" />
                  SYSTEM_SETTINGS
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="font-mono text-sm text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  TERMINATE_SESSION
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Email Verification Banner */}
        <div className="mb-4 sm:mb-6">
          <EmailVerificationBanner />
        </div>

        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="text-xs sm:text-sm font-mono text-primary bg-primary/10 px-3 sm:px-4 py-2 border border-primary/20">
              {">"} SYSTEM_STATUS: ACTIVE
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 font-mono">
            WELCOME_BACK, <span className="text-primary">{getUserName(session?.user?.name)}</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-mono">
            Neural network performance metrics and recent processing history.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:bg-muted/30 transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-mono text-foreground">{stat.title}</CardTitle>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 flex items-center justify-center border border-primary/30">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold font-mono">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card className="cursor-pointer hover:bg-primary/5 transition-all duration-300 border-primary/20 hover:border-primary/40">
            <Link href="/create" className="block">
              <CardHeader className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-primary/30">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-lg font-mono text-primary">CREATE_NEW_SUMMARY</CardTitle>
                <CardDescription className="font-mono text-xs sm:text-sm">
                  Upload data and initialize AI processing
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:bg-secondary/5 transition-all duration-300 border-secondary/20 hover:border-secondary/40">
            <CardHeader className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-secondary/30">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
              </div>
              <CardTitle className="text-sm sm:text-lg font-mono text-secondary">STUDY_MODE</CardTitle>
              <CardDescription className="font-mono text-xs sm:text-sm">Activate neural flashcard protocols</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/5 transition-all duration-300 border-accent/20 hover:border-accent/40 sm:col-span-2 lg:col-span-1">
            <CardHeader className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-accent/30">
                <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-accent" />
              </div>
              <CardTitle className="text-sm sm:text-lg font-mono text-accent">NETWORK_SHARE</CardTitle>
              <CardDescription className="font-mono text-xs sm:text-sm">Collaborate with team members</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Summaries */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-mono text-primary text-lg sm:text-xl">RECENT_SUMMARIES</CardTitle>
                <CardDescription className="font-mono text-sm">Latest neural processing results</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search summaries..."
                    className="pl-10 w-full sm:w-64 font-mono bg-background border-border text-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-border bg-transparent">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentSummaries.map((summary) => (
                <div
                  key={summary.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-border hover:bg-muted/30 transition-colors rounded-lg gap-3 sm:gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold font-mono text-sm sm:text-base truncate">{summary.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1 font-mono">
                        <Badge variant="secondary" className="font-mono text-xs w-fit">
                          {summary.subject}
                        </Badge>
                        <span className="hidden sm:inline">{summary.createdAt}</span>
                        <span className="sm:hidden text-xs">{summary.createdAt}</span>
                        <span className="text-xs">
                          {summary.wordCount} words (from {summary.originalLength})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      {summary.status === "completed" ? (
                        <Badge className="bg-secondary text-secondary-foreground font-mono text-xs">COMPLETE</Badge>
                      ) : (
                        <Badge variant="outline" className="font-mono border-accent text-accent text-xs">
                          PROCESSING
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                            <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="font-mono">
                          <DropdownMenuItem
                            disabled={requiresVerification}
                            className={requiresVerification ? "opacity-50" : ""}
                          >
                            View Summary {requiresVerification && <Lock className="w-3 h-3 ml-1" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={requiresVerification}
                            className={requiresVerification ? "opacity-50" : ""}
                          >
                            Edit {requiresVerification && <Lock className="w-3 h-3 ml-1" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={requiresVerification}
                            className={requiresVerification ? "opacity-50" : ""}
                          >
                            Share {requiresVerification && <Lock className="w-3 h-3 ml-1" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={requiresVerification}
                            className={requiresVerification ? "opacity-50" : ""}
                          >
                            Download {requiresVerification && <Lock className="w-3 h-3 ml-1" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <Button variant="outline" asChild className="font-mono border-border bg-transparent text-sm">
                <Link href="/summaries">VIEW_ALL_SUMMARIES</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
