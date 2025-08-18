"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Brain,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  Heart,
  MessageSquare,
} from "lucide-react"
import { VisitBasedCounselingSystem } from "./visit-based-counseling-system"

interface Client {
  id: number
  name: string
  age: number
  lastVisit: string
  visitCount: number
  riskLevel: "low" | "medium" | "high"
  emotionalState: string
  nextAppointment?: string
}

interface SessionRecord {
  sessionNumber: number
  date: string
  duration: number
  emotionalScores: {
    depression: number
    anxiety: number
    loneliness: number
    anger: number
  }
  mainIssues: string[]
  interventions: string[]
  aiRecommendations: string[]
  notes: string
  riskLevel: "low" | "medium" | "high"
}

interface IntegratedCounselingFlowProps {
  onBack: () => void
}

export function IntegratedCounselingFlow({ onBack }: IntegratedCounselingFlowProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showSessionHistory, setShowSessionHistory] = useState(false)
  const [showCounselingSystem, setShowCounselingSystem] = useState(false)

  // 더미 데이터
  const clients: Client[] = [
    {
      id: 1,
      name: "김순애",
      age: 78,
      lastVisit: "2025-01-15",
      visitCount: 4,
      riskLevel: "medium",
      emotionalState: "외로움, 우울감",
      nextAppointment: "2025-01-22",
    },
    {
      id: 2,
      name: "박철수",
      age: 82,
      lastVisit: "2025-01-10",
      visitCount: 2,
      riskLevel: "high",
      emotionalState: "분노, 불안",
      nextAppointment: "2025-01-20",
    },
    {
      id: 3,
      name: "이영희",
      age: 75,
      lastVisit: "2025-01-12",
      visitCount: 6,
      riskLevel: "low",
      emotionalState: "안정적",
      nextAppointment: "2025-01-25",
    },
    {
      id: 4,
      name: "정민수",
      age: 80,
      lastVisit: "2025-01-08",
      visitCount: 1,
      riskLevel: "medium",
      emotionalState: "적응 어려움",
      nextAppointment: "2025-01-21",
    },
  ]

  const getSessionHistory = (clientId: number): SessionRecord[] => {
    const histories: Record<number, SessionRecord[]> = {
      1: [
        // 김순애 어르신
        {
          sessionNumber: 1,
          date: "2024-12-20",
          duration: 45,
          emotionalScores: { depression: 7, anxiety: 6, loneliness: 8, anger: 3 },
          mainIssues: ["가족과의 소통 부족", "외로움", "건강 걱정"],
          interventions: ["경청", "공감적 대화", "가족 연락 격려"],
          aiRecommendations: ["주 2회 가족 통화 권장", "산책 활동 제안", "일기 쓰기 권유"],
          notes: "첫 상담에서 많은 눈물을 보이셨음. 가족에 대한 그리움이 매우 큼.",
          riskLevel: "high",
        },
        {
          sessionNumber: 2,
          date: "2025-01-02",
          duration: 50,
          emotionalScores: { depression: 6, anxiety: 5, loneliness: 7, anger: 2 },
          mainIssues: ["수면 문제", "식욕 부진", "사회적 고립"],
          interventions: ["수면 위생 교육", "영양 상담", "사회 활동 참여 격려"],
          aiRecommendations: ["규칙적인 수면 패턴 유지", "복지관 프로그램 참여", "이웃과의 교류 증진"],
          notes: "이전 회기보다 안정적. 가족과 통화 후 기분이 좋아졌다고 함.",
          riskLevel: "medium",
        },
        {
          sessionNumber: 3,
          date: "2025-01-08",
          duration: 40,
          emotionalScores: { depression: 5, anxiety: 4, loneliness: 6, anger: 2 },
          mainIssues: ["신체 건강 염려", "미래에 대한 불안"],
          interventions: ["인지 재구성", "현실적 계획 수립", "강점 발견"],
          aiRecommendations: ["정기 건강검진 일정 관리", "취미 활동 개발", "긍정적 사고 연습"],
          notes: "점진적 호전 보임. 복지관 프로그램에 참여하기 시작함.",
          riskLevel: "medium",
        },
        {
          sessionNumber: 4,
          date: "2025-01-15",
          duration: 35,
          emotionalScores: { depression: 4, anxiety: 3, loneliness: 5, anger: 1 },
          mainIssues: ["계절성 우울감", "에너지 부족"],
          interventions: ["활동 계획 수립", "사회적 지지 강화", "자기 돌봄 교육"],
          aiRecommendations: ["실내 운동 프로그램", "비타민 D 보충", "친구들과의 정기 모임"],
          notes: "전반적으로 많이 호전됨. 웃음도 많아지고 적극적인 모습 보임.",
          riskLevel: "low",
        },
      ],
      2: [
        // 박철수 어르신
        {
          sessionNumber: 1,
          date: "2024-12-28",
          duration: 60,
          emotionalScores: { depression: 5, anxiety: 8, loneliness: 4, anger: 9 },
          mainIssues: ["분노 조절 어려움", "대인관계 갈등", "스트레스 관리"],
          interventions: ["분노 관리 기법", "호흡법 교육", "갈등 해결 방법"],
          aiRecommendations: ["분노 일지 작성", "이완 기법 연습", "운동을 통한 스트레스 해소"],
          notes: "상담 초기 매우 흥분한 상태. 점진적으로 진정됨.",
          riskLevel: "high",
        },
        {
          sessionNumber: 2,
          date: "2025-01-10",
          duration: 45,
          emotionalScores: { depression: 4, anxiety: 7, loneliness: 3, anger: 7 },
          mainIssues: ["수면 장애", "집중력 저하", "사회적 위축"],
          interventions: ["수면 개선 방법", "주의력 훈련", "점진적 사회 참여"],
          aiRecommendations: ["명상 앱 사용", "규칙적인 운동", "소규모 모임 참여"],
          notes: "분노 조절에 약간의 진전. 하지만 여전히 예민한 상태.",
          riskLevel: "high",
        },
      ],
    }
    return histories[clientId] || []
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "default"
    }
  }

  const getVisitTypeText = (visitCount: number) => {
    if (visitCount === 0) return "첫 방문"
    if (visitCount === 1) return "2회차"
    if (visitCount === 2) return "3회차"
    return `${visitCount + 1}회차`
  }

  const getEmotionalTrend = (sessions: SessionRecord[], emotion: keyof SessionRecord["emotionalScores"]) => {
    if (sessions.length < 2) return "stable"
    const latest = sessions[sessions.length - 1].emotionalScores[emotion]
    const previous = sessions[sessions.length - 2].emotionalScores[emotion]
    if (latest < previous) return "improving"
    if (latest > previous) return "worsening"
    return "stable"
  }

  const handleStartCounseling = (client: Client) => {
    setSelectedClient(client)
    if (client.visitCount > 0) {
      setShowSessionHistory(true)
    } else {
      setShowCounselingSystem(true)
    }
  }

  const handleProceedToCounseling = () => {
    setShowSessionHistory(false)
    setShowCounselingSystem(true)
  }

  if (showCounselingSystem && selectedClient) {
    return (
      <VisitBasedCounselingSystem
        clientId={selectedClient.id}
        clientName={selectedClient.name}
        visitNumber={selectedClient.visitCount + 1}
        onBack={() => {
          setShowCounselingSystem(false)
          setShowSessionHistory(false)
          setSelectedClient(null)
        }}
      />
    )
  }

  if (showSessionHistory && selectedClient) {
    const sessionHistory = getSessionHistory(selectedClient.id)

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setShowSessionHistory(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">{selectedClient.name} 어르신 상담 기록</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  이전 상담 내용을 확인하고 {getVisitTypeText(selectedClient.visitCount)} 상담을 시작하세요
                </p>
              </div>
            </div>
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* 전체 진행 상황 요약 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                전체 진행 상황 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sessionHistory.length > 0 && (
                  <>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {sessionHistory[sessionHistory.length - 1].emotionalScores.depression}/10
                      </div>
                      <div className="text-sm text-muted-foreground">우울감</div>
                      <div className="text-xs text-blue-600">
                        {getEmotionalTrend(sessionHistory, "depression") === "improving"
                          ? "↓ 개선"
                          : getEmotionalTrend(sessionHistory, "depression") === "worsening"
                            ? "↑ 악화"
                            : "→ 유지"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {sessionHistory[sessionHistory.length - 1].emotionalScores.anxiety}/10
                      </div>
                      <div className="text-sm text-muted-foreground">불안감</div>
                      <div className="text-xs text-orange-600">
                        {getEmotionalTrend(sessionHistory, "anxiety") === "improving"
                          ? "↓ 개선"
                          : getEmotionalTrend(sessionHistory, "anxiety") === "worsening"
                            ? "↑ 악화"
                            : "→ 유지"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {sessionHistory[sessionHistory.length - 1].emotionalScores.loneliness}/10
                      </div>
                      <div className="text-sm text-muted-foreground">외로움</div>
                      <div className="text-xs text-purple-600">
                        {getEmotionalTrend(sessionHistory, "loneliness") === "improving"
                          ? "↓ 개선"
                          : getEmotionalTrend(sessionHistory, "loneliness") === "worsening"
                            ? "↑ 악화"
                            : "→ 유지"}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {sessionHistory[sessionHistory.length - 1].emotionalScores.anger}/10
                      </div>
                      <div className="text-sm text-muted-foreground">분노</div>
                      <div className="text-xs text-red-600">
                        {getEmotionalTrend(sessionHistory, "anger") === "improving"
                          ? "↓ 개선"
                          : getEmotionalTrend(sessionHistory, "anger") === "worsening"
                            ? "↑ 악화"
                            : "→ 유지"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 회차별 상담 기록 */}
          <div className="space-y-4 mb-6">
            {sessionHistory.map((session) => (
              <Card key={session.sessionNumber}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      {session.sessionNumber}회차 상담 ({session.date})
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRiskBadgeColor(session.riskLevel)}>
                        {session.riskLevel === "high" ? "긴급" : session.riskLevel === "medium" ? "주의" : "안정"}
                      </Badge>
                      <Badge variant="outline">{session.duration}분</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          감정 상태 점수
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            우울감: <span className="font-semibold">{session.emotionalScores.depression}/10</span>
                          </div>
                          <div>
                            불안감: <span className="font-semibold">{session.emotionalScores.anxiety}/10</span>
                          </div>
                          <div>
                            외로움: <span className="font-semibold">{session.emotionalScores.loneliness}/10</span>
                          </div>
                          <div>
                            분노: <span className="font-semibold">{session.emotionalScores.anger}/10</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">주요 이슈</h4>
                        <div className="flex flex-wrap gap-1">
                          {session.mainIssues.map((issue, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">적용된 개입</h4>
                        <div className="flex flex-wrap gap-1">
                          {session.interventions.map((intervention, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {intervention}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4 text-emerald-600" />
                          AI 권장사항
                        </h4>
                        <ul className="text-sm space-y-1">
                          {session.aiRecommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-emerald-600 mt-1">•</span>
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">상담사 메모</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{session.notes}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 상담 시작 버튼 */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">
                  {getVisitTypeText(selectedClient.visitCount)} 상담을 시작하시겠습니까?
                </h3>
                <p className="text-sm text-muted-foreground">
                  위 기록을 바탕으로 AI가 개인화된 상담 가이드를 생성합니다.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setShowSessionHistory(false)}>
                    뒤로 가기
                  </Button>
                  <Button onClick={handleProceedToCounseling} className="px-8">
                    <Brain className="h-4 w-4 mr-2" />
                    AI 가이드 상담 시작
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">상담하기</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                어르신을 선택하고 AI 가이드와 함께 상담을 시작하세요
              </p>
            </div>
          </div>
          <Brain className="h-6 w-6 text-primary" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* 상담 대상 선택 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              상담 대상 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{client.name} 어르신</h3>
                      <Badge variant={getRiskBadgeColor(client.riskLevel)}>
                        {client.riskLevel === "high" ? "긴급" : client.riskLevel === "medium" ? "주의" : "안정"}
                      </Badge>
                      <Badge variant="outline">{getVisitTypeText(client.visitCount)}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        마지막 상담: {client.lastVisit}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />총 {client.visitCount}회 상담
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {client.emotionalState}
                      </div>
                    </div>
                    {client.nextAppointment && (
                      <div className="text-sm text-primary">다음 예정: {client.nextAppointment}</div>
                    )}
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <Button
                      onClick={() => handleStartCounseling(client)}
                      className="w-full sm:w-auto"
                      variant={client.riskLevel === "high" ? "destructive" : "default"}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      AI 가이드 상담 시작
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 상담 프로세스 안내 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-600" />
              AI 가이드 상담 프로세스
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">첫 방문</h4>
                <p className="text-sm text-muted-foreground">체크리스트 + 정서 상태 기록 → AI 로드맵 생성</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">2회차 방문</h4>
                <p className="text-sm text-muted-foreground">기본 상태 체크 + AI 가이드 기반 상담</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 font-bold">3+</span>
                </div>
                <h4 className="font-semibold mb-2">3회차 이후</h4>
                <p className="text-sm text-muted-foreground">AI 가이드 + 과거 기록 분석 기반 상담</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
