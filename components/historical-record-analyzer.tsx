"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Search, TrendingUp, Users, AlertTriangle, Lightbulb, History, BarChart3 } from "lucide-react"
import {
  HistoricalRecordRAGSystem,
  type HistoricalCounselingRecord,
  type SimilarCase,
  type PatternAnalysis,
} from "@/lib/historical-record-rag"

interface AnalyzerProps {
  currentCase: {
    emotionalState: {
      depression: number
      anxiety: number
      loneliness: number
      anger: number
      mood: string
    }
    challenges: string[]
    sessionNumber: number
    clientProfile?: string
  }
}

export default function HistoricalRecordAnalyzer({ currentCase }: AnalyzerProps) {
  const [ragSystem] = useState(() => new HistoricalRecordRAGSystem())
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Analysis results
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([])
  const [patternAnalysis, setPatternAnalysis] = useState<PatternAnalysis | null>(null)
  const [insights, setInsights] = useState<any>(null)

  // Search parameters
  const [searchQuery, setSearchQuery] = useState("")
  const [searchDimension, setSearchDimension] = useState<"emotional" | "intervention" | "outcome">("emotional")
  const [analysisType, setAnalysisType] = useState<"interventions" | "outcomes" | "emotional_trends" | "risk_factors">(
    "interventions",
  )

  useEffect(() => {
    initializeSystem()
  }, [])

  const initializeSystem = async () => {
    setIsLoading(true)

    // Mock historical records - in real implementation, fetch from database
    const mockRecords: HistoricalCounselingRecord[] = [
      {
        id: 1,
        clientId: 1,
        clientName: "김순애",
        sessionNumber: 4,
        date: "2024-12-01",
        duration: 60,
        emotionalState: { depression: 3, anxiety: 4, loneliness: 4, anger: 1, mood: "긍정적" },
        interventions: ["인지행동치료", "감정 표현 훈련", "사회적 연결 강화"],
        outcomes: ["가족과의 관계 개선", "정서적 안정감 증가", "자존감 향상"],
        techniques: ["경청", "공감", "인지 재구성", "행동 활성화"],
        challenges: ["기억력 저하 불안", "가족과의 소통 부족"],
        breakthroughs: ["딸과의 관계 개선", "자신감 회복"],
        specialNotes: "연휴 기간 가족과 함께 보낸 시간에 대해 긍정적으로 표현",
        summary: "가족과의 관계 개선과 정서적 안정감 증가를 확인",
        followUpActions: ["월간 가족 모임 계획", "감정 일기 지속", "복지관 활동 참여"],
        riskLevel: "low",
        effectiveness: 8,
      },
      {
        id: 2,
        clientId: 2,
        clientName: "이미자",
        sessionNumber: 3,
        date: "2024-11-28",
        duration: 50,
        emotionalState: { depression: 5, anxiety: 6, loneliness: 7, anger: 2, mood: "우울" },
        interventions: ["지지적 상담", "일상 구조화", "사회적 지지 활용"],
        outcomes: ["일상 루틴 개선", "외로움 부분적 완화"],
        techniques: ["경청", "공감", "문제 해결 기법"],
        challenges: ["사회적 고립", "건강 악화 불안"],
        breakthroughs: ["이웃과의 관계 개선"],
        specialNotes: "건강에 대한 과도한 걱정으로 인한 불안감 지속",
        summary: "사회적 연결 개선에 진전이 있으나 건강 불안 지속",
        followUpActions: ["정기 건강 검진", "이웃과의 교류 증진", "불안 관리 기법 연습"],
        riskLevel: "medium",
        effectiveness: 6,
      },
      {
        id: 3,
        clientId: 3,
        clientName: "박철수",
        sessionNumber: 2,
        date: "2024-11-25",
        duration: 45,
        emotionalState: { depression: 7, anxiety: 8, loneliness: 6, anger: 4, mood: "불안" },
        interventions: ["위기 개입", "안전 계획 수립", "즉시 지지 제공"],
        outcomes: ["즉시 위험 완화", "안전 계획 수립"],
        techniques: ["위기 상담", "안전 평가", "자원 연결"],
        challenges: ["자살 사고", "경제적 어려움", "사회적 고립"],
        breakthroughs: ["전문 서비스 연결 동의"],
        specialNotes: "자살 위험성 높아 즉시 개입 필요했음",
        summary: "위기 상황 안정화 및 전문 서비스 연결",
        followUpActions: ["정신건강의학과 연계", "경제적 지원 신청", "일일 안전 확인"],
        riskLevel: "high",
        effectiveness: 7,
      },
      {
        id: 4,
        clientId: 1,
        clientName: "김순애",
        sessionNumber: 1,
        date: "2024-10-15",
        duration: 70,
        emotionalState: { depression: 6, anxiety: 7, loneliness: 8, anger: 3, mood: "불안" },
        interventions: ["초기 평가", "라포 형성", "기본 욕구 파악"],
        outcomes: ["신뢰 관계 구축", "주요 문제 파악"],
        techniques: ["경청", "공감", "개방형 질문"],
        challenges: ["기억력 저하", "가족과의 거리감", "외로움"],
        breakthroughs: ["상담에 대한 개방적 태도"],
        specialNotes: "초기 면담에서 경계심이 있었으나 점차 마음을 열기 시작",
        summary: "어르신의 현재 상황과 주요 어려움을 파악",
        followUpActions: ["약 복용 알림 시스템 도입", "일기 작성 제안", "가족 소통 개선"],
        riskLevel: "medium",
        effectiveness: 7,
      },
      {
        id: 5,
        clientId: 4,
        clientName: "정영희",
        sessionNumber: 5,
        date: "2024-12-10",
        duration: 55,
        emotionalState: { depression: 2, anxiety: 3, loneliness: 3, anger: 1, mood: "매우 좋음" },
        interventions: ["유지 상담", "재발 방지", "자립성 강화"],
        outcomes: ["완전한 회복", "자립적 문제 해결", "사회적 연결 확대"],
        techniques: ["강점 강화", "자원 활용", "미래 계획"],
        challenges: ["변화 유지", "새로운 도전"],
        breakthroughs: ["완전한 독립성 달성", "지역사회 리더 역할"],
        specialNotes: "상담 목표를 모두 달성하여 종료 준비 단계",
        summary: "성공적인 상담 완료 및 자립적 생활 확립",
        followUpActions: ["월 1회 점검", "지역사회 활동 지속", "멘토 역할 수행"],
        riskLevel: "low",
        effectiveness: 10,
      },
    ]

    try {
      await ragSystem.initializeHistoricalRecords(mockRecords)
      setIsInitialized(true)
    } catch (error) {
      console.error("Historical RAG system initialization failed:", error)
    }

    setIsLoading(false)
  }

  const findSimilarCases = async () => {
    if (!isInitialized) return

    setIsLoading(true)
    try {
      const cases = await ragSystem.findSimilarCases(currentCase, 5)
      setSimilarCases(cases)
    } catch (error) {
      console.error("Similar cases search failed:", error)
    }
    setIsLoading(false)
  }

  const analyzePatterns = async () => {
    if (!isInitialized) return

    setIsLoading(true)
    try {
      const analysis = await ragSystem.analyzePatterns(analysisType)
      setPatternAnalysis(analysis)
    } catch (error) {
      console.error("Pattern analysis failed:", error)
    }
    setIsLoading(false)
  }

  const generateInsights = async () => {
    if (!isInitialized) return

    setIsLoading(true)
    try {
      const caseInsights = await ragSystem.generateInsightsForCase(currentCase)
      setInsights(caseInsights)
    } catch (error) {
      console.error("Insights generation failed:", error)
    }
    setIsLoading(false)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case "high":
        return "높음"
      case "medium":
        return "보통"
      case "low":
        return "낮음"
      default:
        return "미정"
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-600" />
            과거 기록 기반 AI 분석
          </CardTitle>
          <div className="text-sm text-gray-600">
            현재 사례: {currentCase.sessionNumber}회차, 우울 {currentCase.emotionalState.depression}/10, 불안{" "}
            {currentCase.emotionalState.anxiety}/10, 외로움 {currentCase.emotionalState.loneliness}/10
          </div>
        </CardHeader>
      </Card>

      {/* 분석 도구 */}
      <Tabs defaultValue="similar-cases" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="similar-cases" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            유사 사례
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            패턴 분석
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            AI 통찰
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-1">
            <Search className="h-3 w-3" />
            기록 검색
          </TabsTrigger>
        </TabsList>

        {/* 유사 사례 분석 */}
        <TabsContent value="similar-cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                유사 사례 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={findSimilarCases} disabled={!isInitialized || isLoading} className="mb-4">
                {isLoading ? "분석 중..." : "유사 사례 찾기"}
              </Button>

              {similarCases.length > 0 && (
                <div className="space-y-4">
                  {similarCases.map((similarCase, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">
                              {similarCase.record.clientName} - {similarCase.record.sessionNumber}회차
                            </h4>
                            <p className="text-sm text-gray-600">{similarCase.record.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="mb-1">유사도 {(similarCase.similarity * 100).toFixed(1)}%</Badge>
                            <Badge className={getRiskLevelColor(similarCase.record.riskLevel)}>
                              {getRiskLevelText(similarCase.record.riskLevel)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium mb-1">감정 상태</h5>
                            <p>우울: {similarCase.record.emotionalState.depression}/10</p>
                            <p>불안: {similarCase.record.emotionalState.anxiety}/10</p>
                            <p>외로움: {similarCase.record.emotionalState.loneliness}/10</p>
                          </div>
                          <div>
                            <h5 className="font-medium mb-1">효과성</h5>
                            <Progress value={similarCase.record.effectiveness * 10} className="mb-1" />
                            <p>{similarCase.record.effectiveness}/10</p>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="space-y-2 text-sm">
                          <div>
                            <h5 className="font-medium">매칭 요소</h5>
                            <p className="text-gray-600">{similarCase.matchingFactors.join(", ")}</p>
                          </div>
                          <div>
                            <h5 className="font-medium">적용된 개입</h5>
                            <p className="text-gray-600">{similarCase.record.interventions.join(", ")}</p>
                          </div>
                          <div>
                            <h5 className="font-medium">달성 성과</h5>
                            <p className="text-gray-600">{similarCase.record.outcomes.join(", ")}</p>
                          </div>
                          {similarCase.relevantInsights.length > 0 && (
                            <div>
                              <h5 className="font-medium">관련 통찰</h5>
                              <p className="text-gray-600">{similarCase.relevantInsights.join(", ")}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 패턴 분석 */}
        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                패턴 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interventions">개입 전략</SelectItem>
                    <SelectItem value="outcomes">치료 결과</SelectItem>
                    <SelectItem value="emotional_trends">감정 변화 추이</SelectItem>
                    <SelectItem value="risk_factors">위험 요소</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={analyzePatterns} disabled={!isInitialized || isLoading}>
                  {isLoading ? "분석 중..." : "패턴 분석"}
                </Button>
              </div>

              {patternAnalysis && (
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">공통 패턴</h4>
                      <ul className="space-y-1 text-sm">
                        {patternAnalysis.commonPatterns.map((pattern, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">성공적인 개입</h4>
                      <ul className="space-y-1 text-sm">
                        {patternAnalysis.successfulInterventions.map((intervention, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            {intervention}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">위험 요소</h4>
                      <ul className="space-y-1 text-sm">
                        {patternAnalysis.riskFactors.map((risk, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">권장사항</h4>
                      <ul className="space-y-1 text-sm">
                        {patternAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI 통찰 */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                AI 통찰 및 예측
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={generateInsights} disabled={!isInitialized || isLoading} className="mb-4">
                {isLoading ? "분석 중..." : "AI 통찰 생성"}
              </Button>

              {insights && (
                <div className="space-y-4">
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">성공 확률 예측</h4>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600">{insights.successProbability}/10</div>
                          <Progress value={insights.successProbability * 10} className="w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">역사적 통찰</h4>
                      <ul className="space-y-1 text-sm">
                        {insights.historicalInsights.map((insight: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">추천 개입</h4>
                      <ul className="space-y-1 text-sm">
                        {insights.recommendedInterventions.map((intervention: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                            {intervention}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <h4 className="font-medium mb-2">위험 예측</h4>
                      <ul className="space-y-1 text-sm">
                        {insights.riskPredictions.map((risk: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 기록 검색 */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-600" />
                기록 검색
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select value={searchDimension} onValueChange={(value: any) => setSearchDimension(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emotional">감정 상태</SelectItem>
                      <SelectItem value="intervention">개입 전략</SelectItem>
                      <SelectItem value="outcome">치료 결과</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button disabled={!isInitialized || isLoading || !searchQuery}>검색</Button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    <strong>검색 예시:</strong>
                  </p>
                  <p>• 감정 상태: "우울감 높음", "불안 증상", "외로움"</p>
                  <p>• 개입 전략: "인지행동치료", "사회적 지지", "위기 개입"</p>
                  <p>• 치료 결과: "관계 개선", "정서 안정", "자존감 향상"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
