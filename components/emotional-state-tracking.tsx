"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, BarChart3, LineChart, Save, Plus } from "lucide-react"

interface Client {
  id: string
  name: string
  age: number
}

interface EmotionalRecord {
  id: string
  date: string
  depression: number
  anxiety: number
  loneliness: number
  anger: number
  notes: string
  overallScore: number
  sessionType: "정기" | "긴급" | "초기"
}

interface EmotionalTrend {
  metric: "depression" | "anxiety" | "loneliness" | "anger"
  current: number
  previous: number
  change: number
  trend: "개선" | "악화" | "유지"
}

const mockEmotionalHistory: Record<string, EmotionalRecord[]> = {
  "1": [
    {
      id: "e1",
      date: "2024-01-15",
      depression: 6,
      anxiety: 4,
      loneliness: 8,
      anger: 3,
      notes: "외로움 호소, 가족과의 연락 빈도 감소",
      overallScore: 5.25,
      sessionType: "정기",
    },
    {
      id: "e2",
      date: "2024-01-08",
      depression: 5,
      anxiety: 4,
      loneliness: 7,
      anger: 2,
      notes: "새해 계획에 대한 이야기, 긍정적 반응",
      overallScore: 4.5,
      sessionType: "정기",
    },
    {
      id: "e3",
      date: "2024-01-01",
      depression: 4,
      anxiety: 3,
      loneliness: 6,
      anger: 2,
      notes: "연말연시 가족 모임 후 기분 좋아함",
      overallScore: 3.75,
      sessionType: "정기",
    },
    {
      id: "e4",
      date: "2023-12-25",
      depression: 7,
      anxiety: 5,
      loneliness: 9,
      anger: 4,
      notes: "크리스마스 혼자 보내서 우울감 심화",
      overallScore: 6.25,
      sessionType: "긴급",
    },
  ],
  "2": [
    {
      id: "e5",
      date: "2024-01-15",
      depression: 4,
      anxiety: 6,
      loneliness: 3,
      anger: 8,
      notes: "분노 조절 어려움, 작은 일에도 화를 냄",
      overallScore: 5.25,
      sessionType: "긴급",
    },
    {
      id: "e6",
      date: "2024-01-08",
      depression: 3,
      anxiety: 5,
      loneliness: 2,
      anger: 9,
      notes: "이웃과의 갈등으로 인한 분노 증가",
      overallScore: 4.75,
      sessionType: "긴급",
    },
  ],
}

export function EmotionalStateTracking({
  client,
  onBack,
}: {
  client: Client
  onBack: () => void
}) {
  const [currentInput, setCurrentInput] = useState({
    depression: 5,
    anxiety: 5,
    loneliness: 5,
    anger: 5,
    notes: "",
    sessionType: "정기" as "정기" | "긴급" | "초기",
  })

  const [viewMode, setViewMode] = useState<"input" | "history" | "trends">("input")
  const [isSaving, setIsSaving] = useState(false)

  const emotionalHistory = mockEmotionalHistory[client.id] || []

  const calculateTrends = (): EmotionalTrend[] => {
    if (emotionalHistory.length < 2) return []

    const latest = emotionalHistory[0]
    const previous = emotionalHistory[1]

    const metrics: Array<"depression" | "anxiety" | "loneliness" | "anger"> = [
      "depression",
      "anxiety",
      "loneliness",
      "anger",
    ]

    return metrics.map((metric) => {
      const current = latest[metric]
      const prev = previous[metric]
      const change = current - prev

      return {
        metric,
        current,
        previous: prev,
        change,
        trend: change > 0.5 ? "악화" : change < -0.5 ? "개선" : "유지",
      }
    })
  }

  const trends = calculateTrends()

  const handleSaveRecord = async () => {
    setIsSaving(true)
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newRecord: EmotionalRecord = {
      id: `e${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      depression: currentInput.depression,
      anxiety: currentInput.anxiety,
      loneliness: currentInput.loneliness,
      anger: currentInput.anger,
      notes: currentInput.notes,
      overallScore: (currentInput.depression + currentInput.anxiety + currentInput.loneliness + currentInput.anger) / 4,
      sessionType: currentInput.sessionType,
    }

    // In real app, this would save to database
    console.log("Saving emotional record:", newRecord)

    setIsSaving(false)
    setViewMode("history")
  }

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "depression":
        return "text-blue-600 bg-blue-50"
      case "anxiety":
        return "text-orange-600 bg-orange-50"
      case "loneliness":
        return "text-purple-600 bg-purple-50"
      case "anger":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getMetricName = (metric: string) => {
    switch (metric) {
      case "depression":
        return "우울감"
      case "anxiety":
        return "불안감"
      case "loneliness":
        return "외로움"
      case "anger":
        return "분노감"
      default:
        return metric
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "개선":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "악화":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 bg-blue-600 rounded-full" />
    }
  }

  const generatePersonalizedRoadmap = () => {
    const avgDepression =
      emotionalHistory.slice(0, 3).reduce((sum, record) => sum + record.depression, 0) /
      Math.min(3, emotionalHistory.length)
    const avgLoneliness =
      emotionalHistory.slice(0, 3).reduce((sum, record) => sum + record.loneliness, 0) /
      Math.min(3, emotionalHistory.length)
    const avgAnger =
      emotionalHistory.slice(0, 3).reduce((sum, record) => sum + record.anger, 0) / Math.min(3, emotionalHistory.length)

    const roadmap = []

    if (avgLoneliness > 6) {
      roadmap.push("다음 2주 동안 가족과 전화 통화 주 3회 이상")
      roadmap.push("경로당 방문하여 이웃과 대화 주 2회")
    }

    if (avgDepression > 5) {
      roadmap.push("매일 30분 이상 산책하기")
      roadmap.push("좋아하는 음악 듣기 또는 TV 프로그램 시청")
    }

    if (avgAnger > 6) {
      roadmap.push("화가 날 때 10회 심호흡하기")
      roadmap.push("분노 일기 작성하여 패턴 파악하기")
    }

    roadmap.push("다음 상담까지 감정 변화 기록하기")

    return roadmap
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
              <h1 className="text-2xl font-bold text-primary">정서 상태 추적</h1>
              <p className="text-sm text-muted-foreground">{client.name} 어르신 감정 변화 모니터링</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "input" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("input")}
            >
              <Plus className="h-4 w-4 mr-1" />
              입력
            </Button>
            <Button
              variant={viewMode === "history" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("history")}
            >
              <Calendar className="h-4 w-4 mr-1" />
              기록
            </Button>
            <Button
              variant={viewMode === "trends" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("trends")}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              분석
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {viewMode === "input" && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>현재 정서 상태 입력</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">우울감 (1-10)</label>
                      <Slider
                        value={[currentInput.depression]}
                        onValueChange={(value) => setCurrentInput((prev) => ({ ...prev, depression: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>낮음</span>
                        <span className="font-medium">{currentInput.depression}</span>
                        <span>높음</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">불안감 (1-10)</label>
                      <Slider
                        value={[currentInput.anxiety]}
                        onValueChange={(value) => setCurrentInput((prev) => ({ ...prev, anxiety: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>낮음</span>
                        <span className="font-medium">{currentInput.anxiety}</span>
                        <span>높음</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">외로움 (1-10)</label>
                      <Slider
                        value={[currentInput.loneliness]}
                        onValueChange={(value) => setCurrentInput((prev) => ({ ...prev, loneliness: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>낮음</span>
                        <span className="font-medium">{currentInput.loneliness}</span>
                        <span>높음</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">분노감 (1-10)</label>
                      <Slider
                        value={[currentInput.anger]}
                        onValueChange={(value) => setCurrentInput((prev) => ({ ...prev, anger: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>낮음</span>
                        <span className="font-medium">{currentInput.anger}</span>
                        <span>높음</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">상담 유형</label>
                    <div className="flex gap-2">
                      {["정기", "긴급", "초기"].map((type) => (
                        <Button
                          key={type}
                          variant={currentInput.sessionType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentInput((prev) => ({ ...prev, sessionType: type as any }))}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">상담 내용 및 관찰 사항</label>
                    <Textarea
                      placeholder="어르신의 현재 상태, 대화 내용, 특이사항 등을 기록해주세요..."
                      value={currentInput.notes}
                      onChange={(e) => setCurrentInput((prev) => ({ ...prev, notes: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSaveRecord} disabled={isSaving} className="w-full" size="lg">
                    {isSaving ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        정서 상태 기록 저장
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Current Status Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>현재 입력 상태</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{currentInput.depression}</p>
                        <p className="text-xs text-muted-foreground">우울감</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">{currentInput.anxiety}</p>
                        <p className="text-xs text-muted-foreground">불안감</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{currentInput.loneliness}</p>
                        <p className="text-xs text-muted-foreground">외로움</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{currentInput.anger}</p>
                        <p className="text-xs text-muted-foreground">분노감</p>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-3xl font-bold text-primary">
                        {(
                          (currentInput.depression +
                            currentInput.anxiety +
                            currentInput.loneliness +
                            currentInput.anger) /
                          4
                        ).toFixed(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">종합 점수</p>
                    </div>

                    <Badge
                      variant="outline"
                      className={`w-full justify-center ${
                        currentInput.sessionType === "긴급"
                          ? "border-red-200 text-red-600"
                          : currentInput.sessionType === "초기"
                            ? "border-blue-200 text-blue-600"
                            : "border-green-200 text-green-600"
                      }`}
                    >
                      {currentInput.sessionType} 상담
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {emotionalHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>개인별 로드맵</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {generatePersonalizedRoadmap().map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-accent/5 rounded-lg">
                          <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-accent">{index + 1}</span>
                          </div>
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {viewMode === "history" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  정서 상태 기록 히스토리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emotionalHistory.map((record) => (
                    <div key={record.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant={record.sessionType === "긴급" ? "destructive" : "default"}>
                            {record.sessionType}
                          </Badge>
                          <span className="font-medium">{record.date}</span>
                          <Badge variant="outline" className="text-xs">
                            종합 {record.overallScore.toFixed(1)}점
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">우울</p>
                          <p className="text-lg font-semibold text-blue-600">{record.depression}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">불안</p>
                          <p className="text-lg font-semibold text-orange-600">{record.anxiety}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">외로움</p>
                          <p className="text-lg font-semibold text-purple-600">{record.loneliness}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">분노</p>
                          <p className="text-lg font-semibold text-red-600">{record.anger}</p>
                        </div>
                      </div>

                      {record.notes && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === "trends" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  변화 추이 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trends.map((trend) => (
                    <div
                      key={trend.metric}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getMetricColor(trend.metric)}`}>
                          <span className="text-sm font-medium">{getMetricName(trend.metric)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{trend.current}점</p>
                          <p className="text-xs text-muted-foreground">이전: {trend.previous}점</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${
                              trend.change > 0 ? "text-red-600" : trend.change < 0 ? "text-green-600" : "text-blue-600"
                            }`}
                          >
                            {trend.change > 0 ? "+" : ""}
                            {trend.change.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">{trend.trend}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>종합 진행 상황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-3xl font-bold text-primary">
                      {emotionalHistory.length > 0 ? emotionalHistory[0].overallScore.toFixed(1) : "0.0"}
                    </p>
                    <p className="text-sm text-muted-foreground">현재 종합 점수</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xl font-bold text-green-600">
                        {trends.filter((t) => t.trend === "개선").length}
                      </p>
                      <p className="text-xs text-muted-foreground">개선 영역</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-xl font-bold text-red-600">
                        {trends.filter((t) => t.trend === "악화").length}
                      </p>
                      <p className="text-xs text-muted-foreground">주의 영역</p>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-semibold mb-2">AI 분석 요약</h4>
                    <p className="text-sm">
                      {trends.filter((t) => t.trend === "개선").length > trends.filter((t) => t.trend === "악화").length
                        ? "전반적으로 정서 상태가 개선되고 있습니다. 현재 접근 방식을 유지하세요."
                        : trends.filter((t) => t.trend === "악화").length > 0
                          ? "일부 영역에서 주의가 필요합니다. 맞춤형 개입 전략을 고려해보세요."
                          : "안정적인 상태를 유지하고 있습니다. 지속적인 모니터링이 필요합니다."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>맞춤형 개입 권장사항</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-600">강화할 점</h4>
                    {trends
                      .filter((t) => t.trend === "개선")
                      .map((trend) => (
                        <div key={trend.metric} className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium">{getMetricName(trend.metric)} 개선</p>
                          <p className="text-xs text-muted-foreground">
                            현재 접근 방식을 지속하여 더 나은 결과를 기대할 수 있습니다.
                          </p>
                        </div>
                      ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-red-600">집중 관리 영역</h4>
                    {trends
                      .filter((t) => t.trend === "악화")
                      .map((trend) => (
                        <div key={trend.metric} className="p-3 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium">{getMetricName(trend.metric)} 악화</p>
                          <p className="text-xs text-muted-foreground">
                            {trend.metric === "loneliness"
                              ? "사회적 교류 증진 프로그램 참여 권장"
                              : trend.metric === "depression"
                                ? "활동량 증가 및 긍정적 경험 늘리기"
                                : trend.metric === "anger"
                                  ? "분노 관리 기법 연습 및 스트레스 해소"
                                  : "전문적인 개입 및 지속적 모니터링 필요"}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
