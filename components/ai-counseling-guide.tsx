"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Brain,
  MessageCircle,
  Target,
  CheckCircle,
  Clock,
  Lightbulb,
  Heart,
  Users,
  Activity,
} from "lucide-react"

interface Client {
  id: string
  name: string
  age: number
  emotionalState: {
    current: "좋음" | "보통" | "주의" | "위험"
    trend: "개선" | "유지" | "악화"
    summary: string
  }
}

interface AIGuide {
  summary: string
  conversationTopics: string[]
  emotionalCheckQuestions: string[]
  carePoints: string[]
  recommendedActivities: string[]
  nextSteps: string[]
  urgencyLevel: "낮음" | "보통" | "높음" | "긴급"
}

interface EmotionalInput {
  depression: number
  anxiety: number
  loneliness: number
  anger: number
  notes: string
}

const generateAIGuide = (client: Client, emotionalInput?: EmotionalInput): AIGuide => {
  // Simulate RAG-based AI analysis
  const guides: Record<string, AIGuide> = {
    김순애: {
      summary:
        "김순애 어르신은 최근 외로움이 심화되고 있으며, 사회적 교류와 가족과의 연결 강화가 필요합니다. 과거 상담 기록을 바탕으로 가족 중심의 대화와 지역사회 활동 참여를 통한 개입이 효과적일 것으로 분석됩니다.",
      conversationTopics: [
        "가족과의 소중한 추억 이야기하기",
        "젊은 시절 취미나 특기에 대해 대화하기",
        "계절 변화와 자연에 대한 감상 나누기",
        "좋아하는 음식이나 요리 경험 이야기하기",
      ],
      emotionalCheckQuestions: [
        "요즘 가족들과 얼마나 자주 연락하고 계신가요?",
        "혼자 계실 때 어떤 기분이 드시나요?",
        "이웃분들과 대화할 기회가 있으신가요?",
        "하루 중 가장 외로움을 느끼는 시간은 언제인가요?",
      ],
      carePoints: [
        "따뜻하고 공감적인 태도로 경청하기",
        "과거의 긍정적 경험을 회상하도록 도움",
        "작은 성취에도 충분한 격려와 인정 표현",
        "신체적 접촉(손 잡기 등)을 통한 위로 제공",
      ],
      recommendedActivities: [
        "주 2회 이상 동네 산책하기",
        "경로당이나 복지관 프로그램 참여",
        "가족 사진 정리하며 추억 되새기기",
        "간단한 원예 활동이나 화분 기르기",
      ],
      nextSteps: [
        "가족과의 정기적 통화 일정 만들기",
        "지역 사회복지사와 연계하여 사회활동 참여 지원",
        "다음 상담까지 일기 작성 권장",
        "2주 후 추적 상담 예약",
      ],
      urgencyLevel: "높음",
    },
    박철수: {
      summary:
        "박철수 어르신은 분노 조절에 어려움을 겪고 있으며, 즉각적인 감정 관리 기법과 스트레스 해소 방법이 필요합니다. 호흡법과 점진적 근육 이완을 통한 신체적 개입과 함께 인지적 재구성이 효과적일 것입니다.",
      conversationTopics: [
        "화가 날 때의 신체 반응과 감정 인식하기",
        "과거 성공적으로 화를 다스린 경험 나누기",
        "평온함을 주는 장소나 활동에 대해 이야기하기",
        "감사한 일들과 긍정적인 면 찾아보기",
      ],
      emotionalCheckQuestions: [
        "어떤 상황에서 가장 화가 나시나요?",
        "화가 날 때 몸에서 어떤 변화를 느끼시나요?",
        "화를 가라앉히기 위해 어떤 방법을 사용하시나요?",
        "화가 난 후 어떤 기분이 드시나요?",
      ],
      carePoints: [
        "침착하고 안정적인 목소리 톤 유지",
        "어르신의 감정을 인정하고 공감 표현",
        "즉각적인 해결책보다는 감정 수용 우선",
        "안전한 환경에서 감정 표현 격려",
      ],
      recommendedActivities: [
        "매일 10분간 심호흡 연습하기",
        "가벼운 운동이나 스트레칭 하기",
        "음악 감상이나 명상 시간 갖기",
        "감정 일기 작성하여 패턴 파악하기",
      ],
      nextSteps: [
        "분노 관리 기법 연습 일정 수립",
        "가족에게 상황 설명 및 협조 요청",
        "정신건강의학과 연계 검토",
        "1주일 후 긴급 추적 상담",
      ],
      urgencyLevel: "긴급",
    },
  }

  return (
    guides[client.name] || {
      summary: "개별 맞춤형 분석을 위해 더 많은 정보가 필요합니다.",
      conversationTopics: ["일반적인 안부 인사", "최근 생활 패턴 확인"],
      emotionalCheckQuestions: ["요즘 기분은 어떠신가요?", "특별히 힘든 일이 있으신가요?"],
      carePoints: ["경청하는 자세", "공감적 반응"],
      recommendedActivities: ["규칙적인 생활 패턴 유지"],
      nextSteps: ["정기 상담 계속"],
      urgencyLevel: "보통",
    }
  )
}

export function AICounselingGuide({
  client,
  onBack,
  onStartSession,
}: {
  client: Client
  onBack: () => void
  onStartSession: (guide: AIGuide) => void
}) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentGuide, setCurrentGuide] = useState<AIGuide | null>(null)
  const [emotionalInput, setEmotionalInput] = useState<EmotionalInput>({
    depression: 5,
    anxiety: 5,
    loneliness: 5,
    anger: 5,
    notes: "",
  })

  const handleGenerateGuide = async () => {
    setIsGenerating(true)
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const guide = generateAIGuide(client, emotionalInput)
    setCurrentGuide(guide)
    setIsGenerating(false)
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "긴급":
        return "text-red-600 bg-red-50 border-red-200"
      case "높음":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "보통":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "낮음":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">AI 상담 가이드</h1>
              <p className="text-sm text-muted-foreground">{client.name} 어르신 맞춤형 분석</p>
            </div>
          </div>
          {currentGuide && (
            <Button onClick={() => onStartSession(currentGuide)} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              상담 시작
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  현재 정서 상태 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">우울감 (1-10)</label>
                  <Slider
                    value={[emotionalInput.depression]}
                    onValueChange={(value) => setEmotionalInput((prev) => ({ ...prev, depression: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>낮음</span>
                    <span className="font-medium">{emotionalInput.depression}</span>
                    <span>높음</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">불안감 (1-10)</label>
                  <Slider
                    value={[emotionalInput.anxiety]}
                    onValueChange={(value) => setEmotionalInput((prev) => ({ ...prev, anxiety: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>낮음</span>
                    <span className="font-medium">{emotionalInput.anxiety}</span>
                    <span>높음</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">외로움 (1-10)</label>
                  <Slider
                    value={[emotionalInput.loneliness]}
                    onValueChange={(value) => setEmotionalInput((prev) => ({ ...prev, loneliness: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>낮음</span>
                    <span className="font-medium">{emotionalInput.loneliness}</span>
                    <span>높음</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">분노감 (1-10)</label>
                  <Slider
                    value={[emotionalInput.anger]}
                    onValueChange={(value) => setEmotionalInput((prev) => ({ ...prev, anger: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>낮음</span>
                    <span className="font-medium">{emotionalInput.anger}</span>
                    <span>높음</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">추가 관찰 사항</label>
                  <Textarea
                    placeholder="어르신의 현재 상태나 특이사항을 입력해주세요..."
                    value={emotionalInput.notes}
                    onChange={(e) => setEmotionalInput((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button onClick={handleGenerateGuide} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      AI 분석 중...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      맞춤형 가이드 생성
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Guide Results */}
          <div className="lg:col-span-2 space-y-6">
            {currentGuide ? (
              <>
                {/* Summary and Urgency */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        AI 종합 분석
                      </CardTitle>
                      <Badge className={`${getUrgencyColor(currentGuide.urgencyLevel)} border`}>
                        {currentGuide.urgencyLevel} 우선순위
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{currentGuide.summary}</p>
                  </CardContent>
                </Card>

                {/* Conversation Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-accent" />
                      추천 대화 주제
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentGuide.conversationTopics.map((topic, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg">
                          <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-accent">{index + 1}</span>
                          </div>
                          <p className="text-sm">{topic}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Emotional Check Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-secondary" />
                      감정 확인 질문
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentGuide.emotionalCheckQuestions.map((question, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-secondary/5 rounded-lg">
                          <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-secondary">Q</span>
                          </div>
                          <p className="text-sm">{question}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Care Points */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-orange-500" />
                      돌봄 포인트
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentGuide.carePoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{point}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      권장 활동
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentGuide.recommendedActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <Target className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      다음 단계
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentGuide.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-blue-700">{index + 1}</span>
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="lg:col-span-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI 상담 가이드 대기 중</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    왼쪽에서 어르신의 현재 정서 상태를 입력하고
                    <br />
                    "맞춤형 가이드 생성" 버튼을 클릭해주세요.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">대화 주제</p>
                      <p className="text-xs text-muted-foreground">맞춤형 추천</p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
                      <p className="text-sm font-medium">감정 체크</p>
                      <p className="text-xs text-muted-foreground">핵심 질문</p>
                    </div>
                    <div className="p-4 bg-secondary/5 rounded-lg">
                      <Lightbulb className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <p className="text-sm font-medium">돌봄 포인트</p>
                      <p className="text-xs text-muted-foreground">주의사항</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">권장 활동</p>
                      <p className="text-xs text-muted-foreground">실천 방안</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
