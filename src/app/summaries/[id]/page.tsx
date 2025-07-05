"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationRequired } from "@/components/verification-required"
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  Brain,
  Clock,
  Download,
  Edit,
  FileText,
  Lightbulb,
  Share2,
  Star,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SummaryView() {
  const [isStarred, setIsStarred] = useState(false)

  const summaryData = {
    title: "Introduction to Psychology - Chapter 3: Memory",
    subject: "Psychology",
    createdAt: "2 hours ago",
    originalWordCount: 5000,
    summaryWordCount: 1250,
    readingTime: "5 min read",
    compressionRatio: "75%",
  }

  const keyPoints = [
    "Memory is the process of encoding, storing, and retrieving information",
    "Three main types of memory: sensory, short-term, and long-term",
    "Working memory has limited capacity (7±2 items)",
    "Long-term memory is divided into explicit and implicit memory",
    "Forgetting occurs due to decay, interference, and retrieval failure",
    "Memory can be improved through rehearsal, organization, and mnemonics",
  ]

  const flashcards = [
    {
      question: "What are the three main types of memory?",
      answer: "Sensory memory, short-term memory, and long-term memory",
    },
    {
      question: "What is the capacity of working memory?",
      answer: "Approximately 7±2 items (Miller's Magic Number)",
    },
    {
      question: "What are the two types of long-term memory?",
      answer: "Explicit (declarative) memory and implicit (procedural) memory",
    },
  ]

  return (
    <VerificationRequired feature="summary details">
      <div className="min-h-screen bg-zinc-900 text-zinc-100 font-mono">
        {/* Header */}
        <header className="bg-zinc-800 border-b border-zinc-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="rounded-none hover:bg-zinc-700">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 text-green-500" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-lime-500 rounded-none flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-zinc-900" />
                </div>
                <span className="text-xl font-bold text-green-500">Note Snap</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsStarred(!isStarred)}
                className="rounded-none hover:bg-zinc-700"
              >
                <Star className={`w-4 h-4 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-none hover:bg-zinc-700">
                <Share2 className="w-4 h-4 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-none hover:bg-zinc-700">
                <Edit className="w-4 h-4 text-green-500" />
              </Button>
              <Button
                variant="outline"
                className="rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-zinc-900 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Summary Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-zinc-700 border-zinc-600 text-lime-400">
                    {summaryData.subject}
                  </Badge>
                  <span className="text-sm text-zinc-500">{summaryData.createdAt}</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-lime-500">{summaryData.title}</h1>
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-500" />
                    {summaryData.readingTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-green-500" />
                    {summaryData.summaryWordCount} words
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-green-500" />
                    {summaryData.compressionRatio} compression
                  </div>
                </div>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary" className="rounded-none data-[state=active]:bg-zinc-700 text-lime-400">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="key-points" className="rounded-none data-[state=active]:bg-zinc-700 text-lime-400">
                    Key Points
                  </TabsTrigger>
                  <TabsTrigger value="flashcards" className="rounded-none data-[state=active]:bg-zinc-700 text-lime-400">
                    Flashcards
                  </TabsTrigger>
                  <TabsTrigger value="original" className="rounded-none data-[state=active]:bg-zinc-700 text-lime-400">
                    Original
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-6">
                  <Card className="bg-zinc-800 border-zinc-700 rounded-none">
                    <CardContent className="pt-6">
                      <div className="prose max-w-none text-zinc-300">
                        <h2 className="text-xl font-bold text-lime-500">// SUMMARY::Memory_Foundation</h2>
                        <p>
                          Memory is a fundamental cognitive process that involves three key stages: encoding, storage, and
                          retrieval. Understanding how memory works is crucial for effective learning and academic
                          success.
                        </p>

                        <h3 className="text-lg font-semibold text-green-500">// MEMORY_TYPES::Systems</h3>
                        <p>
                          The human memory system consists of three interconnected components.{" "}
                          <strong className="text-lime-400">Sensory memory</strong> briefly holds incoming sensory
                          information for a few seconds. <strong className="text-lime-400">Short-term memory</strong>{" "}
                          (also called working memory) can hold approximately 7±2 items for 15-30 seconds without
                          rehearsal. <strong className="text-lime-400">Long-term memory</strong> has virtually unlimited
                          capacity and can store information indefinitely.
                        </p>

                        <h3 className="text-lg font-semibold text-green-500">// LONG_TERM::Categories</h3>
                        <p>
                          Long-term memory is divided into two main categories.{" "}
                          <strong className="text-lime-400">Explicit (declarative) memory</strong> includes facts and
                          events that we can consciously recall, such as historical dates or personal experiences.
                          <strong className="text-lime-400">Implicit (procedural) memory</strong> involves skills and
                          habits that we perform automatically, like riding a bicycle or typing.
                        </p>

                        <h3 className="text-lg font-semibold text-green-500">// FORGETTING::Reasons</h3>
                        <p>
                          Forgetting occurs through several mechanisms.{" "}
                          <strong className="text-lime-400">Decay theory</strong> suggests that memories fade over time
                          without use. <strong className="text-lime-400">Interference theory</strong> proposes that new
                          information can disrupt the retrieval of old information (retroactive interference) or old
                          information can interfere with new learning (proactive interference).
                          <strong className="text-lime-400">Retrieval failure</strong> occurs when information is stored
                          but cannot be accessed due to inadequate cues.
                        </p>

                        <h3 className="text-lg font-semibold text-green-500">// MEMORY::Enhancement</h3>
                        <p>
                          Several techniques can improve memory performance.{" "}
                          <strong className="text-lime-400">Rehearsal</strong> involves repeating information to maintain
                          it in working memory. <strong className="text-lime-400">Organization</strong> helps by grouping
                          related information together.
                          <strong className="text-lime-400">Mnemonics</strong> use associations, acronyms, or visual
                          imagery to make information more memorable.
                          <strong className="text-lime-400">Elaborative processing</strong> connects new information to
                          existing knowledge, creating stronger memory traces.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="key-points" className="mt-6">
                  <Card className="bg-zinc-800 border-zinc-700 rounded-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lime-500">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        // KEY_POINTS::Essential
                      </CardTitle>
                      <CardDescription className="text-zinc-400">Essential concepts from your notes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-zinc-700 border border-zinc-600 rounded-none flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-lime-500">{index + 1}</span>
                            </div>
                            <span className="text-zinc-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="flashcards" className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold flex items-center gap-2 text-lime-500">
                        <BookMarked className="w-5 h-5 text-yellow-500" />
                        // FLASHCARDS::Study
                      </h2>
                      <Button
                        variant="outline"
                        className="rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-zinc-900 bg-transparent"
                      >
                        Study Mode
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      {flashcards.map((card, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-md transition-shadow bg-zinc-800 border-zinc-700 rounded-none"
                        >
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-blue-600 mb-2">// QUESTION::</h4>
                                <p className="text-zinc-300">{card.question}</p>
                              </div>
                              <Separator className="bg-zinc-600" />
                              <div>
                                <h4 className="font-semibold text-green-600 mb-2">// ANSWER::</h4>
                                <p className="text-zinc-300">{card.answer}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="original" className="mt-6">
                  <Card className="bg-zinc-800 border-zinc-700 rounded-none">
                    <CardHeader>
                      <CardTitle className="text-lime-500">// ORIGINAL::Notes</CardTitle>
                      <CardDescription className="text-zinc-400">Your source material</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-zinc-400 bg-zinc-700 p-4 rounded-none">
                        <p className="italic">Original content would be displayed here...</p>
                        <p className="mt-2">Word count: {summaryData.originalWordCount} words</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card className="bg-zinc-800 border-zinc-700 rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg text-lime-500">// SUMMARY::Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">Original</span>
                    <span className="font-semibold text-zinc-300">{summaryData.originalWordCount} words</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">Summary</span>
                    <span className="font-semibold text-zinc-300">{summaryData.summaryWordCount} words</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">Compression</span>
                    <span className="font-semibold text-green-600">{summaryData.compressionRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-500">Reading Time</span>
                    <span className="font-semibold text-zinc-300">{summaryData.readingTime}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Study Tools */}
              <Card className="bg-zinc-800 border-zinc-700 rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg text-lime-500">// STUDY::Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-zinc-900"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Quiz Mode
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-zinc-900"
                  >
                    <BookMarked className="w-4 h-4 mr-2" />
                    Flashcard Review
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent rounded-none border-green-500 text-green-500 hover:bg-green-500 hover:text-zinc-900"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Practice Test
                  </Button>
                </CardContent>
              </Card>

              {/* Related Summaries */}
              <Card className="bg-zinc-800 border-zinc-700 rounded-none">
                <CardHeader>
                  <CardTitle className="text-lg text-lime-500">// RELATED::Summaries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <Link href="#" className="font-medium hover:text-blue-600 text-zinc-300">
                      Psychology Ch. 2: Learning
                    </Link>
                    <p className="text-zinc-500">3 days ago</p>
                  </div>
                  <div className="text-sm">
                    <Link href="#" className="font-medium hover:text-blue-600 text-zinc-300">
                      Psychology Ch. 4: Cognition
                    </Link>
                    <p className="text-zinc-500">1 week ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </VerificationRequired>
  )
}
