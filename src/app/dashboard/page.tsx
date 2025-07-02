import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    BookOpen,
    Brain,
    Clock,
    FileText,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Share2,
    Star,
    TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
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
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold font-mono text-primary">NOTE_SNAP</span>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild className="font-mono bg-primary hover:bg-primary/90">
              <Link href="/create">
                <Plus className="w-4 h-4 mr-2" />
                NEW_SUMMARY
              </Link>
            </Button>
            <Avatar className="border-2 border-primary/30">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-primary text-primary-foreground font-mono">JS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="inline-block mb-4">
            <div className="text-sm font-mono text-primary bg-primary/10 px-4 py-2 border border-primary/20">
              {">"} SYSTEM_STATUS: ACTIVE
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 font-mono">
            WELCOME_BACK, <span className="text-primary">JOHN</span>
          </h1>
          <p className="text-muted-foreground font-mono">
            Neural network performance metrics and recent processing history.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`border-${stat.color}/20 bg-card hover:bg-${stat.color}/5 transition-all duration-300`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-mono text-${stat.color}`}>{stat.title}</CardTitle>
                <div
                  className={`w-10 h-10 bg-${stat.color}/20 flex items-center justify-center border border-${stat.color}/30`}
                >
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono">{stat.value}</div>
                <p className={`text-xs text-${stat.color} mt-1 font-mono`}>{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:bg-primary/5 transition-all duration-300 border-primary/20 hover:border-primary/40"
          >
            <Link href="/create">
              <CardHeader className="text-center py-8">
                <div className="w-14 h-14 bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                  <Plus className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-lg font-mono text-primary">CREATE_NEW_SUMMARY</CardTitle>
                <CardDescription className="font-mono text-sm">
                  Upload data and initialize AI processing
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="cursor-pointer hover:bg-secondary/5 transition-all duration-300 border-secondary/20 hover:border-secondary/40">
            <CardHeader className="text-center py-8">
              <div className="w-14 h-14 bg-secondary/20 flex items-center justify-center mx-auto mb-4 border border-secondary/30">
                <Brain className="w-7 h-7 text-secondary" />
              </div>
              <CardTitle className="text-lg font-mono text-secondary">STUDY_MODE</CardTitle>
              <CardDescription className="font-mono text-sm">Activate neural flashcard protocols</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/5 transition-all duration-300 border-accent/20 hover:border-accent/40">
            <CardHeader className="text-center py-8">
              <div className="w-14 h-14 bg-accent/20 flex items-center justify-center mx-auto mb-4 border border-accent/30">
                <Share2 className="w-7 h-7 text-accent" />
              </div>
              <CardTitle className="text-lg font-mono text-accent">NETWORK_SHARE</CardTitle>
              <CardDescription className="font-mono text-sm">Collaborate with team members</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Summaries */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-mono text-primary">RECENT_SUMMARIES</CardTitle>
                <CardDescription className="font-mono">Latest neural processing results</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search summaries..."
                    className="pl-10 w-64 font-mono bg-background border-border"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-border bg-transparent">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSummaries.map((summary) => (
                <div
                  key={summary.id}
                  className="flex items-center justify-between p-4 border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 flex items-center justify-center border border-primary/30">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold font-mono">{summary.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1 font-mono">
                        <Badge variant="secondary" className="font-mono">
                          {summary.subject}
                        </Badge>
                        <span>{summary.createdAt}</span>
                        <span>
                          {summary.wordCount} words (from {summary.originalLength})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {summary.status === "completed" ? (
                      <Badge className="bg-secondary text-secondary-foreground font-mono">COMPLETE</Badge>
                    ) : (
                      <Badge variant="outline" className="font-mono border-accent text-accent">
                        PROCESSING
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon">
                      <Star className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="font-mono">
                        <DropdownMenuItem>View Summary</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" asChild className="font-mono border-border bg-transparent">
                <Link href="/summaries">VIEW_ALL_SUMMARIES</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
