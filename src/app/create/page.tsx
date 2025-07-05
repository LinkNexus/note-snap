"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { VerificationRequired } from "@/components/verification-required"
import { ArrowLeft, BookOpen, Brain, FileText, ImageIcon, LinkIcon, Settings, Sparkles, Upload } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function CreateSummary() {
  const [step, setStep] = useState(1)
  const [uploadMethod, setUploadMethod] = useState("text")
  const [summaryStyle, setSummaryStyle] = useState("bullet-points")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsProcessing(true)
      // Simulate processing
      setTimeout(() => {
        redirect("/summaries/123")
      }, 3000)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border-primary/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary flex items-center justify-center mx-auto mb-4 relative">
              <Brain className="w-8 h-8 text-primary-foreground animate-pulse" />
              <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
            </div>
            <CardTitle className="font-mono text-primary">NEURAL_PROCESSING_ACTIVE</CardTitle>
            <CardDescription className="font-mono text-muted-foreground">AI_CORE_ANALYZING_DATA...</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={66} className="mb-4 bg-muted" />
            <div className="text-center text-sm text-muted-foreground font-mono">
              <p>{">"} PROCESSING_CONTENT...</p>
              <p className="mt-2">{">"} ETA: 30-60_SECONDS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <VerificationRequired feature="summary creation">
      <div className="min-h-screen bg-background cyber-grid">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 text-primary" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary flex items-center justify-center relative">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                  <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                </div>
                <span className="text-lg sm:text-xl font-bold font-mono text-primary">NOTE_SNAP</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-mono text-muted-foreground">STEP_{step}_OF_3</span>
              <Progress value={(step / 3) * 100} className="w-16 sm:w-24 bg-muted" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
          {step === 1 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 font-mono text-primary">UPLOAD_DATA_SOURCE</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-mono">SELECT_INPUT_METHOD_FOR_NEURAL_PROCESSING</p>
              </div>

              <Tabs value={uploadMethod} onValueChange={setUploadMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted">
                  <TabsTrigger
                    value="text"
                    className="font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    TEXT
                  </TabsTrigger>
                  <TabsTrigger
                    value="file"
                    className="font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    FILE
                  </TabsTrigger>
                  <TabsTrigger
                    value="image"
                    className="font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    IMAGE
                  </TabsTrigger>
                  <TabsTrigger
                    value="url"
                    className="font-mono data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="mt-6">
                  <Card className="bg-card border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono text-primary">
                        <FileText className="w-5 h-5" />
                        TEXT_INPUT_MODE
                      </CardTitle>
                      <CardDescription className="font-mono text-muted-foreground">DIRECT_DATA_INJECTION_PROTOCOL</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title" className="font-mono text-primary">
                            TITLE_DESIGNATION
                          </Label>
                          <Input
                            id="title"
                            placeholder="E.G., PSYCHOLOGY_CHAPTER_3_MEMORY"
                            className="bg-background border-border font-mono"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject" className="font-mono text-primary">
                            SUBJECT_CLASSIFICATION
                          </Label>
                          <Select>
                            <SelectTrigger className="bg-background border-border font-mono">
                              <SelectValue placeholder="SELECT_SUBJECT_DOMAIN" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                              <SelectItem value="psychology" className="font-mono hover:bg-muted">
                                PSYCHOLOGY
                              </SelectItem>
                              <SelectItem value="mathematics" className="font-mono hover:bg-muted">
                                MATHEMATICS
                              </SelectItem>
                              <SelectItem value="history" className="font-mono hover:bg-muted">
                                HISTORY
                              </SelectItem>
                              <SelectItem value="chemistry" className="font-mono hover:bg-muted">
                                CHEMISTRY
                              </SelectItem>
                              <SelectItem value="biology" className="font-mono hover:bg-muted">
                                BIOLOGY
                              </SelectItem>
                              <SelectItem value="physics" className="font-mono hover:bg-muted">
                                PHYSICS
                              </SelectItem>
                              <SelectItem value="other" className="font-mono hover:bg-muted">
                                OTHER
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes" className="font-mono text-primary">
                            DATA_CONTENT
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="INSERT_TEXT_DATA_FOR_PROCESSING..."
                            className="min-h-[200px] sm:min-h-[300px] bg-background border-border font-mono"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="file" className="mt-6">
                  <Card className="bg-card border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono text-primary">
                        <Upload className="w-5 h-5" />
                        FILE_UPLOAD_PROTOCOL
                      </CardTitle>
                      <CardDescription className="font-mono text-muted-foreground">DOCUMENT_INGESTION_SYSTEM</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-border p-8 sm:p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                        <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold mb-2 font-mono text-primary">DRAG_FILES_OR_CLICK_TO_BROWSE</h3>
                        <p className="text-sm text-muted-foreground mb-4 font-mono">SUPPORTS_PDF_DOCX_TXT_UP_TO_10MB</p>
                        <Button
                          variant="outline"
                          className="font-mono border-primary/50 hover:bg-primary/10"
                        >
                          SELECT_FILES
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="image" className="mt-6">
                  <Card className="bg-card border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono text-primary">
                        <ImageIcon className="w-5 h-5" />
                        IMAGE_PROCESSING_MODE
                      </CardTitle>
                      <CardDescription className="font-mono text-muted-foreground">
                        OCR_EXTRACTION_FROM_VISUAL_DATA
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-border p-8 sm:p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                        <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold mb-2 font-mono text-primary">UPLOAD_IMAGE_FILES</h3>
                        <p className="text-sm text-muted-foreground mb-4 font-mono">NEURAL_OCR_TEXT_EXTRACTION</p>
                        <Button
                          variant="outline"
                          className="font-mono border-primary/50 hover:bg-primary/10"
                        >
                          SELECT_IMAGES
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="url" className="mt-6">
                  <Card className="bg-card border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-mono text-primary">
                        <LinkIcon className="w-5 h-5" />
                        URL_IMPORT_PROTOCOL
                      </CardTitle>
                      <CardDescription className="font-mono text-muted-foreground">
                        WEB_CONTENT_EXTRACTION_SYSTEM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="url" className="font-mono text-primary">
                            TARGET_URL
                          </Label>
                          <Input
                            id="url"
                            placeholder="HTTPS://EXAMPLE.COM/ARTICLE"
                            className="bg-background border-border font-mono"
                          />
                        </div>
                        <Button
                          variant="outline"
                          className="w-full font-mono border-primary/50 hover:bg-primary/10"
                        >
                          EXTRACT_CONTENT
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 font-mono text-primary">CONFIGURE_OUTPUT_PARAMETERS</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-mono">OPTIMIZE_NEURAL_PROCESSING_SETTINGS</p>
              </div>

              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-mono text-primary">
                    <Settings className="w-5 h-5" />
                    SUMMARY_FORMAT_PROTOCOL
                  </CardTitle>
                  <CardDescription className="font-mono text-muted-foreground">
                    SELECT_OPTIMAL_OUTPUT_CONFIGURATION
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={summaryStyle} onValueChange={setSummaryStyle} className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 p-3 sm:p-4 border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="bullet-points" id="bullet-points" className="border-primary text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="bullet-points" className="font-medium font-mono text-primary cursor-pointer">
                          BULLET_POINT_FORMAT
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono">STRUCTURED_KEY_POINTS_FOR_RAPID_SCANNING</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 sm:p-4 border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="paragraph" id="paragraph" className="border-primary text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="paragraph" className="font-medium font-mono text-primary cursor-pointer">
                          PARAGRAPH_SYNTHESIS
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono">FLOWING_NARRATIVE_WITH_CONCEPTUAL_CONNECTIONS</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 sm:p-4 border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="outline" id="outline" className="border-primary text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="outline" className="font-medium font-mono text-primary cursor-pointer">
                          HIERARCHICAL_OUTLINE
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono">STRUCTURED_TOPICS_WITH_NESTED_SUBTOPICS</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 sm:p-4 border border-border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="flashcards" id="flashcards" className="border-primary text-primary" />
                      <div className="flex-1">
                        <Label htmlFor="flashcards" className="font-medium font-mono text-primary cursor-pointer">
                          FLASHCARD_PROTOCOL
                        </Label>
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono">QUESTION_ANSWER_FORMAT_FOR_ACTIVE_RECALL</p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card className="bg-card border-primary/20">
                <CardHeader>
                  <CardTitle className="font-mono text-primary">COMPRESSION_RATIO</CardTitle>
                  <CardDescription className="font-mono text-muted-foreground">SPECIFY_OUTPUT_DETAIL_LEVEL</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="medium" className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="short" id="short" className="border-primary text-primary" />
                      <Label htmlFor="short" className="font-mono text-primary cursor-pointer">
                        CONCISE (25%_COMPRESSION)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" className="border-primary text-primary" />
                      <Label htmlFor="medium" className="font-mono text-primary cursor-pointer">
                        BALANCED (40%_COMPRESSION)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="detailed" id="detailed" className="border-primary text-primary" />
                      <Label htmlFor="detailed" className="font-mono text-primary cursor-pointer">
                        COMPREHENSIVE (60%_COMPRESSION)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 font-mono text-primary">SYSTEM_VERIFICATION</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-mono">CONFIRM_PARAMETERS_AND_INITIALIZE_PROCESSING</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card className="bg-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-mono text-primary">INPUT_DATA_ANALYSIS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs sm:text-sm font-mono">
                      <div>
                        <strong className="text-primary">TITLE:</strong> <span className="text-muted-foreground">PSYCHOLOGY_CHAPTER_3_MEMORY</span>
                      </div>
                      <div>
                        <strong className="text-primary">DOMAIN:</strong> <span className="text-muted-foreground">PSYCHOLOGY</span>
                      </div>
                      <div>
                        <strong className="text-primary">SOURCE_TYPE:</strong> <span className="text-muted-foreground">TEXT_INPUT</span>
                      </div>
                      <div>
                        <strong className="text-primary">DATA_SIZE:</strong> <span className="text-muted-foreground">~2,500_WORDS</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-primary/20">
                  <CardHeader>
                    <CardTitle className="font-mono text-primary">PROCESSING_CONFIGURATION</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs sm:text-sm font-mono">
                      <div>
                        <strong className="text-primary">FORMAT:</strong> <span className="text-muted-foreground">BULLET_POINT_FORMAT</span>
                      </div>
                      <div>
                        <strong className="text-primary">COMPRESSION:</strong> <span className="text-muted-foreground">BALANCED_(40%)</span>
                      </div>
                      <div>
                        <strong className="text-primary">OUTPUT_SIZE:</strong> <span className="text-muted-foreground">~1,000_WORDS</span>
                      </div>
                      <div>
                        <strong className="text-primary">ETA:</strong> <span className="text-muted-foreground">~30_SECONDS</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-card to-muted/50 border-primary/20">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary flex items-center justify-center relative">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                      <div className="absolute inset-0 bg-primary opacity-20 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold font-mono text-primary text-sm sm:text-base">NEURAL_PROCESSING_ENGINE</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground font-mono mt-1">
                        ADVANCED_AI_WILL_ANALYZE_CONTENT_AND_GENERATE_OPTIMIZED_SUMMARY_USING_COGNITIVE_ENHANCEMENT_PROTOCOLS
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 sm:pt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="font-mono border-primary/50 hover:bg-primary/10 disabled:opacity-50"
            >
              PREVIOUS_STEP
            </Button>
            <Button
              onClick={handleNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
            >
              {step === 3 ? "INITIALIZE_PROCESSING" : "NEXT_STEP"}
            </Button>
          </div>
        </div>
      </div>
    </VerificationRequired>
  )
}
