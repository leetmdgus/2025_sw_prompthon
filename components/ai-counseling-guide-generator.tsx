"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Target, MessageCircle, AlertTriangle, TrendingUp, Clock } from "lucide-react"

interface CounselingSession {
  id: number
  sessionDate: string
  sessionGoals: string[]
  emotionalState: {
    depression: number
    anxiety: number
    loneliness: number
    anger: number
    mood: string
  }
  summary: string
  observations: string
}

interface AIRoadmap {
  goals: string[]
  activities: string[]
  riskLevel: string
  nextFocus: string
}

interface AIGuideRecommendation {
  sessionGoals: string[]
  conversationTopics: string[]
  emotionalCheckQuestions: string[]
  carePoints: string[]
  recommendedActivities: string[]
  riskAssessment: string
  urgencyLevel: "low" | "medium" | "high"
  estimatedDuration: string
}

export default function AICounselingGuideGenerator({ clientId, clientName }: { clientId: number; clientName: string }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiGuide, setAiGuide] = useState<AIGuideRecommendation | null>(null)
  const [pastSessions, setPastSessions] = useState<CounselingSession[]>([])
  const [currentRoadmap, setCurrentRoadmap] = useState<AIRoadmap | null>(null)

  useEffect(() => {
    // 실제 구현에서는 API 호출로 데이터를 가져옴
    const mockPastSessions: CounselingSession[] = [
      {
        id: 1,
        sessionDate: "2024-12-15",
        sessionGoals: ["초기 라포 형성", "현재 생활 상황 파악", "주요 어려움 탐색"],
        emotionalState: { depression: 6, anxiety: 7, loneliness: 8, anger: 3, mood: "불안" },
        summary: "어르신께서 현재 겪고 계신 기억력 문제와 가족 관계의 어려움을 이해할 수 있었습니다.",
        observations:
          "초기 면담에서 경계심이 있었으나 점차 마음을 열기 시작함. 최근 기억력 저하로 인한 불안감과 가족과의 소통 부족으로 인한 외로움 호소.",
      },
      {
        id: 2,
        sessionDate: "2024-12-22",
        sessionGoals: ["일상 관리 전략 수립", "가족 소통 개선", "정서적 지지 제공"],
        emotionalState: { depression: 5, anxiety: 6, loneliness: 7, anger: 2, mood: "우울" },
        summary: "약 복용 알림 시스템 도입과 간단한 일기 작성을 제안했습니다.",
        observations:
          "지난 회기 대비 라포가 형성되어 더 개방적으로 이야기함. 일상에서 약 복용을 잊어버리는 일이 빈번하며, 이로 인한 자책감 표현.",
      },
      {
        id: 3,
        sessionDate: "2024-12-29",
        sessionGoals: ["감정 표현 증진", "자존감 향상", "사회적 연결 강화"],
        emotionalState: { depression: 4, anxiety: 5, loneliness: 6, anger: 2, mood: "보통" },
        summary: "감정 표현이 향상되고 가족과의 소통에 진전이 있었습니다.",
        observations: "일기 작성을 통해 자신의 감정을 객관적으로 바라보기 시작함. 딸과의 통화에서 긍정적인 변화 보고.",
      },
      {
        id: 4,
        sessionDate: "2025-01-05",
        sessionGoals: ["새해 목표 설정", "사회 활동 계획", "지속적 관리 방안"],
        emotionalState: { depression: 3, anxiety: 4, loneliness: 4, anger: 1, mood: "긍정적" },
        summary: "가족과의 관계 개선과 정서적 안정감 증가를 확인했습니다.",
        observations: "연휴 기간 가족과 함께 보낸 시간에 대해 긍정적으로 표현. 손자와의 시간이 특히 즐거웠다고 함.",
      },
    ]

    const mockRoadmap: AIRoadmap = {
      goals: ["사회적 연결 확대", "새해 목표 설정", "지속적 정서 관리"],
      activities: ["복지관 서예 교실 참여", "월간 가족 모임 계획", "감정 일기 지속"],
      riskLevel: "낮음",
      nextFocus: "새해 계획 수립 및 사회 활동 참여 지원",
    }

    setPastSessions(mockPastSessions)
    setCurrentRoadmap(mockRoadmap)
  }, [clientId])

  const generateAIGuide = async () => {
    setIsGenerating(true)

    // 실제 구현에서는 RAG 기반 AI 모델 호출
    await new Promise((resolve) => setTimeout(resolve, 2000)) // 시뮬레이션

    // 과거 세션 분석
    const latestSession = pastSessions[pastSessions.length - 1]
    const emotionalTrend = analyzeEmotionalTrend(pastSessions)
    const progressAnalysis = analyzeProgress(pastSessions)

    // AI 가이드 생성
    const generatedGuide: AIGuideRecommendation = {
      sessionGoals: generateSessionGoals(latestSession, currentRoadmap, progressAnalysis),
      conversationTopics: generateConversationTopics(latestSession, emotionalTrend),
      emotionalCheckQuestions: generateEmotionalQuestions(emotionalTrend),
      carePoints: generateCarePoints(latestSession, progressAnalysis),
      recommendedActivities: generateRecommendedActivities(currentRoadmap, progressAnalysis),
      riskAssessment: assessRisk(latestSession, emotionalTrend),
      urgencyLevel: determineUrgency(latestSession, emotionalTrend),
      estimatedDuration: "60분",
    }

    setAiGuide(generatedGuide)
    setIsGenerating(false)
  }

  const analyzeEmotionalTrend = (sessions: CounselingSession[]) => {
    const trends = {
      depression: sessions.map((s) => s.emotionalState.depression),
      anxiety: sessions.map((s) => s.emotionalState.anxiety),
      loneliness: sessions.map((s) => s.emotionalState.loneliness),
      anger: sessions.map((s) => s.emotionalState.anger),
    }

    return {
      depression: trends.depression[trends.depression.length - 1] - trends.depression[0],
      anxiety: trends.anxiety[trends.anxiety.length - 1] - trends.anxiety[0],
      loneliness: trends.loneliness[trends.loneliness.length - 1] - trends.loneliness[0],
      anger: trends.anger[trends.anger.length - 1] - trends.anger[0],
      overallImprovement:
        trends.depression[0] +
        trends.anxiety[0] +
        trends.loneliness[0] -
        (trends.depression[trends.depression.length - 1] +
          trends.anxiety[trends.anxiety.length - 1] +
          trends.loneliness[trends.loneliness.length - 1]),
    }
  }

  const analyzeProgress = (sessions: CounselingSession[]) => {
    const recentSessions = sessions.slice(-2)
    const improvements = []
    const concerns = []

    if (recentSessions.length >= 2) {
      const prev = recentSessions[0].emotionalState
      const current = recentSessions[1].emotionalState

      if (current.depression < prev.depression) improvements.push("우울감 감소")
      if (current.anxiety < prev.anxiety) improvements.push("불안감 완화")
      if (current.loneliness < prev.loneliness) improvements.push("외로움 개선")

      if (current.depression > prev.depression) concerns.push("우울감 증가")
      if (current.anxiety > prev.anxiety) concerns.push("불안감 상승")
      if (current.loneliness > prev.loneliness) concerns.push("외로움 심화")
    }

    return { improvements, concerns }
  }

  const generateSessionGoals = (latestSession: CounselingSession, roadmap: AIRoadmap | null, progress: any) => {
    const goals = []

    if (progress.improvements.length > 0) {
      goals.push("긍정적 변화 강화 및 유지")
    }

    if (roadmap) {
      goals.push(...roadmap.goals.slice(0, 2))
    }

    if (progress.concerns.length > 0) {
      goals.push("우려 사항 해결 방안 모색")
    }

    return goals.slice(0, 3)
  }

  const generateConversationTopics = (latestSession: CounselingSession, trend: any) => {
    const topics = []

    if (trend.overallImprovement > 0) {
      topics.push("최근 기분이 좋아진 순간들에 대해 이야기해보세요")
      topics.push("가족이나 지인과의 긍정적인 경험을 나눠주세요")
    }

    if (latestSession.emotionalState.loneliness > 5) {
      topics.push("혼자 있을 때 어떤 활동을 하시는지 궁금합니다")
      topics.push("사람들과 함께 하고 싶은 활동이 있으신가요?")
    }

    topics.push("새해를 맞아 어떤 계획이나 소망이 있으신지요?")

    return topics
  }

  const generateEmotionalQuestions = (trend: any) => {
    return [
      "오늘 아침에 일어나셨을 때 기분은 어떠셨나요?",
      "지난 일주일 중 가장 힘들었던 순간은 언제였나요?",
      "요즘 밤에 잠들기 전에 어떤 생각을 하시나요?",
      "가족이나 지인과 대화할 때 어떤 감정을 느끼시나요?",
    ]
  }

  const generateCarePoints = (latestSession: CounselingSession, progress: any) => {
    const points = []

    if (latestSession.emotionalState.depression > 6) {
      points.push("우울감이 높으므로 자살 위험성 평가 필요")
    }

    if (progress.improvements.length > 0) {
      points.push("긍정적 변화에 대한 충분한 인정과 격려 제공")
    }

    points.push("어르신의 속도에 맞춰 천천히 대화 진행")
    points.push("비언어적 표현(표정, 몸짓)에도 주의 깊게 관찰")

    return points
  }

  const generateRecommendedActivities = (roadmap: AIRoadmap | null, progress: any) => {
    const activities = []

    if (roadmap) {
      activities.push(...roadmap.activities.slice(0, 2))
    }

    activities.push("감정 일기 작성 (주 3회)")
    activities.push("가족과의 정기 통화 (주 2회)")

    return activities
  }

  const assessRisk = (latestSession: CounselingSession, trend: any) => {
    const { depression, anxiety, loneliness } = latestSession.emotionalState
    const totalScore = depression + anxiety + loneliness

    if (totalScore > 20 || depression > 7) {
      return "고위험 - 즉시 전문의 상담 및 집중 관리 필요"
    } else if (totalScore > 15 || trend.overallImprovement < -3) {
      return "중위험 - 주의 깊은 모니터링 및 추가 지원 필요"
    } else {
      return "저위험 - 현재 상담 계획 유지 및 정기 점검"
    }
  }

  const determineUrgency = (latestSession: CounselingSession, trend: any): "low" | "medium" | "high" => {
    const { depression, anxiety } = latestSession.emotionalState

    if (depression > 7 || anxiety > 8) return "high"
    if (depression > 5 || anxiety > 6 || trend.overallImprovement < -2) return "medium"
    return "low"
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-600" />
            {clientName} 어르신 AI 상담 가이드 생성
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">과거 상담 회기</h4>
                <p className="text-2xl font-bold text-emerald-600">{pastSessions.length}회</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">최근 감정 상태</h4>
                <p className="text-lg font-medium">
                  {pastSessions.length > 0 ? pastSessions[pastSessions.length - 1].emotionalState.mood : "데이터 없음"}
                </p>
              </div>
            </div>

            <Button
              onClick={generateAIGuide}
              disabled={isGenerating}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  AI 가이드 생성 중...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  이번 회기 상담 가이드 생성
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {aiGuide && (
        <div className="space-y-4">
          {/* 긴급도 및 위험도 평가 */}
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
                  <Badge className={getUrgencyColor(aiGuide.urgencyLevel)}>
                    {getUrgencyText(aiGuide.urgencyLevel)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">예상 상담 시간: {aiGuide.estimatedDuration}</span>
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
                {aiGuide.sessionGoals.map((goal, index) => (
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
                    {aiGuide.conversationTopics.map((topic, index) => (
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
                    {aiGuide.emotionalCheckQuestions.map((question, index) => (
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
                {aiGuide.carePoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 추천 활동 */}
          <Card>
            <CardHeader>
              <CardTitle>다음 회기까지 추천 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiGuide.recommendedActivities.map((activity, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm">{activity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
