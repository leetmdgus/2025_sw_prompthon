"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Brain, Target, MessageCircle, AlertTriangle, TrendingUp, FileText, ArrowLeft } from "lucide-react"
import { CounselingRAGSystem, type CounselingRecord } from "@/lib/langchain-rag"
import ComprehensiveFirstVisitAssessment from "./comprehensive-first-visit-assessment"

interface ClientInfo {
  id: number
  name: string
  age: number
  background: string
  visitCount: number
}

interface VisitBasedCounselingSystemProps {
  clientId: number
  clientName: string
  visitNumber: number
  onBack: () => void
}

export function VisitBasedCounselingSystem({
  clientId,
  clientName,
  visitNumber,
  onBack,
}: VisitBasedCounselingSystemProps) {
  const client: ClientInfo = {
    id: clientId,
    name: clientName,
    age: 75, // Default age, could be passed as prop if needed
    background: "일반적인 어르신", // Default background
    visitCount: visitNumber - 1, // Convert to zero-based count for existing logic
  }

  const [ragSystem] = useState(() => new CounselingRAGSystem())
  const [currentStep, setCurrentStep] = useState<"assessment" | "guide" | "session">("assessment")
  const [isGenerating, setIsGenerating] = useState(false)

  // 첫 방문 체크리스트
  const [checklist, setChecklist] = useState<string[]>([])
  const [checklistItems] = useState([
    "기본 건강 상태 확인",
    "복용 중인 약물 파악",
    "가족 관계 현황 파악",
    "경제적 상황 확인",
    "사회적 지지체계 평가",
    "일상생활 수행능력 평가",
    "인지기능 간단 평가",
    "자살 위험성 평가",
  ])

  // 감정 상태
  const [emotionalState, setEmotionalState] = useState({
    depression: [5],
    anxiety: [5],
    loneliness: [5],
    anger: [5],
    mood: "보통",
  })

  // 특이사항 메모
  const [specialNotes, setSpecialNotes] = useState("")

  // AI 생성 결과
  const [aiGuide, setAiGuide] = useState<any>(null)
  const [aiRoadmap, setAiRoadmap] = useState<any>(null)

  // 과거 기록 (실제로는 DB에서 가져옴)
  const [pastRecords, setPastRecords] = useState<CounselingRecord[]>([])

  useEffect(() => {
    // 과거 상담 기록 로드 (2회차 이상인 경우)
    if (client.visitCount > 0) {
      loadPastRecords()
    }
  }, [client.visitCount])

  const loadPastRecords = async () => {
    // 실제 구현에서는 API 호출
    const mockRecords: CounselingRecord[] = [
      {
        id: 1,
        clientId: client.id,
        sessionNumber: 1,
        date: "2024-12-15",
        emotionalState: { depression: 6, anxiety: 7, loneliness: 8, anger: 3, mood: "불안" },
        checklist: ["기본 건강 상태 확인", "가족 관계 현황 파악", "자살 위험성 평가"],
        specialNotes: "초기 면담에서 경계심 있음. 기억력 저하 불안감 호소",
        summary: "어르신의 현재 상황과 주요 어려움을 파악함",
        aiRoadmap: ["라포 형성", "일상 관리 전략", "가족 소통 개선"],
      },
    ]

    setPastRecords(mockRecords)
    await ragSystem.initializeVectorStore(mockRecords)
  }

  const handleChecklistChange = (item: string, checked: boolean) => {
    if (checked) {
      setChecklist([...checklist, item])
    } else {
      setChecklist(checklist.filter((i) => i !== item))
    }
  }

  const generateFirstVisitGuide = async () => {
    setIsGenerating(true)

    try {
      const roadmap = await ragSystem.generateFirstVisitGuide(
        { name: client.name, age: client.age, background: client.background },
        checklist,
        {
          depression: emotionalState.depression[0],
          anxiety: emotionalState.anxiety[0],
          loneliness: emotionalState.loneliness[0],
          anger: emotionalState.anger[0],
          mood: emotionalState.mood,
        },
        specialNotes,
      )

      setAiRoadmap(roadmap)
      setCurrentStep("guide")
    } catch (error) {
      console.error("AI 가이드 생성 실패:", error)
      // 실제 환경에서는 fallback 로직 구현
      generateMockFirstVisitGuide()
    }

    setIsGenerating(false)
  }

  const generateFollowUpGuide = async () => {
    setIsGenerating(true)

    try {
      const guide = await ragSystem.generateFollowUpGuide(
        {
          pastSessions: pastRecords,
          currentRoadmap: aiRoadmap?.shortTermGoals || [],
          visitNumber: client.visitCount + 1,
        },
        {
          depression: emotionalState.depression[0],
          anxiety: emotionalState.anxiety[0],
          loneliness: emotionalState.loneliness[0],
          anger: emotionalState.anger[0],
          mood: emotionalState.mood,
        },
        specialNotes,
      )

      setAiGuide(guide)
      setCurrentStep("guide")
    } catch (error) {
      console.error("후속 가이드 생성 실패:", error)
      generateMockFollowUpGuide()
    }

    setIsGenerating(false)
  }

  // Mock 함수들 (실제 AI 호출 실패시 fallback)
  const generateMockFirstVisitGuide = () => {
    setAiRoadmap({
      shortTermGoals: ["라포 형성 및 신뢰 관계 구축", "현재 생활 패턴 파악", "즉시 필요한 지원 확인"],
      mediumTermGoals: ["정서적 안정감 증진", "사회적 연결 강화", "일상 관리 능력 향상"],
      longTermGoals: ["삶의 질 개선", "자립적 생활 유지", "가족 관계 개선"],
      immediateInterventions: ["안전 확인", "기본 욕구 충족 여부 점검"],
      recommendedActivities: ["규칙적인 산책", "일기 작성", "가족과의 정기 연락"],
      riskLevel: "보통",
      nextFocus: "라포 형성과 기본 욕구 파악",
    })
    setCurrentStep("guide")
  }

  const generateMockFollowUpGuide = () => {
    setAiGuide({
      sessionGoals: ["이전 회기 진전 확인", "현재 감정 상태 점검", "다음 단계 계획 수립"],
      conversationTopics: ["지난 주 어떻게 지내셨는지", "가족과의 연락은 어떠셨는지", "새로운 활동 시도해보신 것"],
      emotionalCheckQuestions: ["오늘 기분은 어떠신가요?", "지난 주 가장 힘들었던 순간은?", "기뻤던 일이 있으셨나요?"],
      carePoints: ["어르신의 속도에 맞춰 대화", "긍정적 변화 인정하기", "비언어적 표현 관찰"],
      recommendedActivities: ["감정 일기 지속", "주 2회 가족 통화", "복지관 프로그램 참여"],
      riskAssessment: "현재 안정적 상태, 지속적 모니터링 필요",
      urgencyLevel: "보통",
      progressNotes: ["라포 형성 양호", "감정 표현 증가"],
      precautions: ["갑작스러운 감정 변화 주의", "신체 증상 동반시 의료진 연계"],
    })
    setCurrentStep("guide")
  }

  const getMoodOptions = () => ["매우 좋음", "좋음", "보통", "나쁨", "매우 나쁨", "불안", "우울", "화남", "외로움"]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                {clientName} 어르신 - {visitNumber}회차 상담
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">AI 가이드 상담 진행</p>
            </div>
          </div>
          <Brain className="h-6 w-6 text-primary" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-600" />
                {client.name} 어르신 - {client.visitCount + 1}회차 상담
              </CardTitle>
            </CardHeader>
          </Card>

          {/* 평가 단계 */}
          {currentStep === "assessment" && (
            <div className="space-y-6">
              {/* 첫 방문 체크리스트 (1회차만) */}
              {client.visitCount === 0 ? (
                <ComprehensiveFirstVisitAssessment
                  clientName={client.name}
                  onComplete={(data) => {
                    console.log("[v0] Comprehensive assessment completed:", data)
                    // Convert comprehensive data to simple format for existing logic
                    const simpleChecklist = [
                      ...data.medicalHistory.chronicConditions,
                      ...data.functionalAssessment.safetyRisks,
                      ...data.psychosocialFactors.copingStrategies.slice(0, 3),
                    ]
                    setChecklist(simpleChecklist)

                    setEmotionalState({
                      depression: [Math.min(10, Math.round(data.mentalHealthScreening.depressionScore / 2.7))],
                      anxiety: [Math.min(10, Math.round(data.mentalHealthScreening.anxietyScore / 2.1))],
                      loneliness: [data.mentalHealthScreening.lonelinessScore],
                      anger: [Math.round(Math.random() * 5)], // Placeholder
                      mood:
                        data.mentalHealthScreening.depressionScore > 15
                          ? "우울"
                          : data.mentalHealthScreening.anxietyScore > 15
                            ? "불안"
                            : "보통",
                    })

                    setSpecialNotes(
                      `
                      의료이력: ${data.medicalHistory.cognitiveIssues}
                      사회적지지: 가족연락 ${data.socialSupport.familyContact}, 지역사회참여 ${data.socialSupport.communityInvolvement}
                      기능평가: ADL ${data.functionalAssessment.adlScore}/10, IADL ${data.functionalAssessment.iadlScore}/10
                      심리사회: ${data.psychosocialFactors.recentLosses}
                      목표: ${data.goalsAndExpectations.clientGoals.join(", ")}
                    `.trim(),
                    )

                    // Auto-generate guide after comprehensive assessment
                    setTimeout(() => {
                      generateFirstVisitGuide()
                    }, 1000)
                  }}
                />
              ) : (
                // Existing simple assessment for follow-up visits
                <>
                  {/* 정서 상태 기록 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-600" />
                        정서 상태 기록
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium mb-2 block">우울감 (0-10)</label>
                            <Slider
                              value={emotionalState.depression}
                              onValueChange={(value) => setEmotionalState({ ...emotionalState, depression: value })}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-gray-500 mt-1">{emotionalState.depression[0]}</div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">불안감 (0-10)</label>
                            <Slider
                              value={emotionalState.anxiety}
                              onValueChange={(value) => setEmotionalState({ ...emotionalState, anxiety: value })}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-gray-500 mt-1">{emotionalState.anxiety[0]}</div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">외로움 (0-10)</label>
                            <Slider
                              value={emotionalState.loneliness}
                              onValueChange={(value) => setEmotionalState({ ...emotionalState, loneliness: value })}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-gray-500 mt-1">{emotionalState.loneliness[0]}</div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">분노 (0-10)</label>
                            <Slider
                              value={emotionalState.anger}
                              onValueChange={(value) => setEmotionalState({ ...emotionalState, anger: value })}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-gray-500 mt-1">{emotionalState.anger[0]}</div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">전반적 기분</label>
                          <div className="flex flex-wrap gap-2">
                            {getMoodOptions().map((mood) => (
                              <Button
                                key={mood}
                                variant={emotionalState.mood === mood ? "default" : "outline"}
                                size="sm"
                                onClick={() => setEmotionalState({ ...emotionalState, mood })}
                                className="text-xs"
                              >
                                {mood}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 특이사항 메모 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        특이사항 및 관찰 메모
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="어르신의 특이사항, 관찰된 행동, 중요한 발언 등을 기록해주세요..."
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        rows={4}
                      />
                    </CardContent>
                  </Card>

                  {/* 가이드 생성 버튼 */}
                  <Card>
                    <CardContent className="pt-6">
                      <Button
                        onClick={generateFollowUpGuide}
                        disabled={isGenerating}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            AI 가이드 생성 중...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4 mr-2" />
                            {`${client.visitCount + 1}회차 상담 가이드 생성`}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* 가이드 표시 단계 */}
          {currentStep === "guide" && (
            <div className="space-y-4">
              {/* 첫 방문 로드맵 */}
              {client.visitCount === 0 && aiRoadmap && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        AI 생성 상담 로드맵
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">단기 목표 (1-2주)</h4>
                          <ul className="space-y-1">
                            {aiRoadmap.shortTermGoals.map((goal: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="text-sm">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">중기 목표 (1-2개월)</h4>
                          <ul className="space-y-1">
                            {aiRoadmap.mediumTermGoals.map((goal: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">장기 목표 (3-6개월)</h4>
                          <ul className="space-y-1">
                            {aiRoadmap.longTermGoals.map((goal: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                <span className="text-sm">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        즉시 개입 및 위험도 평가
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">즉시 필요한 개입</h4>
                          <ul className="space-y-1">
                            {aiRoadmap.immediateInterventions.map((intervention: string, index: number) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                <span className="text-sm">{intervention}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">위험도 평가</span>
                          <Badge
                            className={
                              aiRoadmap.riskLevel === "높음"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : aiRoadmap.riskLevel === "보통"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {aiRoadmap.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 후속 방문 가이드 */}
              {client.visitCount > 0 && aiGuide && (
                <div className="space-y-4">
                  {/* 위험도 및 긴급도 평가 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        위험도 평가 및 긴급도
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">긴급도</span>
                          <Badge
                            className={
                              aiGuide.urgencyLevel === "높음"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : aiGuide.urgencyLevel === "보통"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {aiGuide.urgencyLevel}
                          </Badge>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-800">{aiGuide.riskAssessment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 상담 목표 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        이번 회기 상담 목표
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {aiGuide.sessionGoals.map((goal: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* 대화 주제 및 질문 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        대화 주제 및 감정 체크 질문
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">추천 대화 주제</h4>
                          <ul className="space-y-1">
                            {aiGuide.conversationTopics.map((topic: string, index: number) => (
                              <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-green-200">
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">감정 체크 질문</h4>
                          <ul className="space-y-1">
                            {aiGuide.emotionalCheckQuestions.map((question: string, index: number) => (
                              <li key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-blue-200">
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 케어 포인트 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        주의사항 및 케어 포인트
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {aiGuide.carePoints.map((point: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* 진전 사항 및 주의사항 */}
                  {aiGuide.progressNotes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>진전 사항 및 주의사항</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">진전 사항</h4>
                            <ul className="space-y-1">
                              {aiGuide.progressNotes.map((note: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                  <span className="text-sm">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-medium text-sm text-gray-700 mb-2">주의사항</h4>
                            <ul className="space-y-1">
                              {aiGuide.precautions.map((precaution: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                  <span className="text-sm">{precaution}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* 상담 시작 버튼 */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={() => setCurrentStep("session")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    상담 시작하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 상담 진행 단계 */}
          {currentStep === "session" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                  상담 진행 중
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600 mb-4">
                    {client.name} 어르신과의 {client.visitCount + 1}회차 상담이 진행 중입니다.
                  </p>
                  <p className="text-sm text-gray-500">생성된 AI 가이드를 참고하여 상담을 진행해주세요.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default VisitBasedCounselingSystem
