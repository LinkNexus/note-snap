'use client'

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, Clock, FileText, LogOut, Shield, Sparkles, Target, Users, Zap } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }
  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center relative">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
              <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
            </div>
            <span className="text-lg sm:text-2xl font-bold font-mono tracking-wider text-primary">NOTE_SNAP</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm">
              FEATURES
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-secondary transition-colors font-medium text-sm"
            >
              PROCESS
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-accent transition-colors font-medium text-sm">
              PRICING
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <>
                <Button variant="ghost" asChild className="font-mono text-xs sm:text-sm px-2 sm:px-4">
                  <Link href="/dashboard">DASHBOARD</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="font-mono text-xs sm:text-sm px-2 sm:px-4 border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">SIGN_OUT</span>
                  <span className="sm:hidden">OUT</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="font-mono text-xs sm:text-sm px-2 sm:px-4">
                  <Link href="/login">SIGN_IN</Link>
                </Button>
                <Button asChild className="font-mono bg-primary hover:bg-primary/90 glow-effect text-xs sm:text-sm px-3 sm:px-4">
                  <Link href="/dashboard">INITIALIZE</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5"></div>
        <div className="max-w-5xl mx-auto relative">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="text-xs sm:text-sm font-mono text-primary bg-primary/10 px-3 sm:px-4 py-2 border border-primary/20">
              {">"} NEURAL_NETWORK_ACTIVE
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 font-mono tracking-tight leading-tight">
            <span className="text-primary">TRANSFORM</span>
            <br />
            <span className="text-secondary">YOUR_NOTES</span>
            <br />
            <span className="text-accent">INTO_POWER</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto font-mono leading-relaxed px-4 sm:px-0">
            Stop drowning in endless documentation. Our AI-powered neural network creates precision summaries that
            maximize learning efficiency and eliminate cognitive overload.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 sm:px-0">
            <Button size="lg" className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-4 font-mono bg-primary hover:bg-primary/90 glow-effect">
              <Link href={session ? "/dashboard" : "/signup"} className="flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                {session ? "OPEN_DASHBOARD" : "ENGAGE_SYSTEM"}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-sm sm:text-lg px-6 sm:px-10 py-3 sm:py-4 font-mono border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              VIEW_DEMO
            </Button>
          </div>
          <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground font-mono px-4 sm:px-0">
            {">"} NO_CREDIT_CARD_REQUIRED • UNLIMITED_ACCESS_TIER_AVAILABLE
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="text-xs sm:text-sm font-mono text-secondary bg-secondary/10 px-3 sm:px-4 py-2 border border-secondary/20">
              {">"} SYSTEM_CAPABILITIES
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-mono">ENHANCED_FEATURES</h2>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto font-mono px-4 sm:px-0">
            Advanced neural processing designed for maximum cognitive efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="border-primary/20 bg-card hover:bg-primary/5 transition-all duration-300 hover:border-primary/40">
            <CardHeader>
              <div className="w-14 h-14 bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="font-mono text-primary">AI_NEURAL_CORE</CardTitle>
              <CardDescription className="font-mono text-sm">
                Advanced artificial intelligence processes your data with military-grade precision and contextual
                understanding
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/20 bg-card hover:bg-secondary/5 transition-all duration-300 hover:border-secondary/40">
            <CardHeader>
              <div className="w-14 h-14 bg-secondary/20 flex items-center justify-center mb-4 border border-secondary/30">
                <FileText className="w-7 h-7 text-secondary" />
              </div>
              <CardTitle className="font-mono text-secondary">MULTI_FORMAT_PARSER</CardTitle>
              <CardDescription className="font-mono text-sm">
                Processes PDFs, images, text files, and URLs with seamless data extraction protocols
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-accent/20 bg-card hover:bg-accent/5 transition-all duration-300 hover:border-accent/40">
            <CardHeader>
              <div className="w-14 h-14 bg-accent/20 flex items-center justify-center mb-4 border border-accent/30">
                <Clock className="w-7 h-7 text-accent" />
              </div>
              <CardTitle className="font-mono text-accent">TIME_OPTIMIZATION</CardTitle>
              <CardDescription className="font-mono text-sm">
                Reduce study time by 70% through intelligent content compression and priority mapping
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20 bg-card hover:bg-primary/5 transition-all duration-300 hover:border-primary/40">
            <CardHeader>
              <div className="w-14 h-14 bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="font-mono text-primary">ADAPTIVE_STYLING</CardTitle>
              <CardDescription className="font-mono text-sm">
                Multiple output formats: bullet points, concept maps, flashcards, and neural pathways
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/20 bg-card hover:bg-secondary/5 transition-all duration-300 hover:border-secondary/40">
            <CardHeader>
              <div className="w-14 h-14 bg-secondary/20 flex items-center justify-center mb-4 border border-secondary/30">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <CardTitle className="font-mono text-secondary">NETWORK_PROTOCOL</CardTitle>
              <CardDescription className="font-mono text-sm">
                Share summaries with team members and establish collaborative learning networks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-accent/20 bg-card hover:bg-accent/5 transition-all duration-300 hover:border-accent/40">
            <CardHeader>
              <div className="w-14 h-14 bg-accent/20 flex items-center justify-center mb-4 border border-accent/30">
                <Target className="w-7 h-7 text-accent" />
              </div>
              <CardTitle className="font-mono text-accent">SMART_INDEXING</CardTitle>
              <CardDescription className="font-mono text-sm">
                Automatic organization by subject, priority level, and cognitive importance metrics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/30 py-12 sm:py-16 lg:py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-3 sm:mb-4">
              <div className="text-xs sm:text-sm font-mono text-accent bg-accent/10 px-3 sm:px-4 py-2 border border-accent/20">
                {">"} EXECUTION_PROTOCOL
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-mono">THREE_STEP_PROCESS</h2>
            <p className="text-sm sm:text-base lg:text-xl text-muted-foreground font-mono">Streamlined workflow for maximum efficiency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary border-2 border-primary/50 flex items-center justify-center text-primary-foreground text-xl sm:text-3xl font-bold font-mono mx-auto mb-4 sm:mb-6 relative">
                01
                <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 font-mono text-primary">DATA_UPLOAD</h3>
              <p className="text-sm sm:text-base text-muted-foreground font-mono px-2 sm:px-0">
                Upload PDFs, images, or paste text directly into the neural processing interface
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary border-2 border-secondary/50 flex items-center justify-center text-secondary-foreground text-xl sm:text-3xl font-bold font-mono mx-auto mb-4 sm:mb-6 relative">
                02
                <div className="absolute inset-0 bg-secondary/20 animate-pulse"></div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 font-mono text-secondary">AI_PROCESSING</h3>
              <p className="text-sm sm:text-base text-muted-foreground font-mono px-2 sm:px-0">
                Advanced algorithms analyze content and generate optimized summary protocols
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent border-2 border-accent/50 flex items-center justify-center text-accent-foreground text-xl sm:text-3xl font-bold font-mono mx-auto mb-4 sm:mb-6 relative">
                03
                <div className="absolute inset-0 bg-accent/20 animate-pulse"></div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4 font-mono text-accent">KNOWLEDGE_DEPLOY</h3>
              <p className="text-sm sm:text-base text-muted-foreground font-mono px-2 sm:px-0">
                Access your enhanced summaries and dominate your academic objectives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="max-w-3xl mx-auto relative">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="text-xs sm:text-sm font-mono text-primary bg-primary/10 px-3 sm:px-4 py-2 border border-primary/20">
              {">"} SYSTEM_READY
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-mono">INITIALIZE_YOUR_ADVANTAGE</h2>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mb-8 sm:mb-10 font-mono px-4 sm:px-0">
            Join the neural network. Thousands of users already optimizing their cognitive performance.
          </p>
          <Button size="lg" className="text-base sm:text-xl px-8 sm:px-12 py-4 sm:py-6 font-mono bg-primary hover:bg-primary/90 glow-effect">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              ENGAGE_NOW
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center">
                  <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-2xl font-bold font-mono text-primary">NOTE_SNAP</span>
              </div>
              <p className="text-muted-foreground font-mono text-xs sm:text-sm max-w-sm">
                Optimizing cognitive performance through advanced neural processing.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 font-mono text-primary text-sm sm:text-base">SYSTEM</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground font-mono text-xs sm:text-sm">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 font-mono text-secondary text-sm sm:text-base">SUPPORT</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground font-mono text-xs sm:text-sm">
                <li>
                  <Link href="#" className="hover:text-secondary transition-colors">
                    Help_Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-secondary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-secondary transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 font-mono text-accent text-sm sm:text-base">NETWORK</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground font-mono text-xs sm:text-sm">
                <li>
                  <Link href="#" className="hover:text-accent transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-muted-foreground font-mono text-xs sm:text-sm">
              {">"} &copy; 2024 NOTE_SNAP_SYSTEMS. ALL_RIGHTS_RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
