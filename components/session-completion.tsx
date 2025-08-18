"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, TrendingUp, FileText, Calendar } from "lucide-react"

interface SessionCompletionProps {
  clientName: string
  sessionNumber: number
  sessionDuration: string
  onSaveSession: () => void
  onScheduleNext: () => void
}

export default function SessionCompletion({
  clientName,
  sessionNumber,
  sessionDuration,
  onSaveSession,
  onScheduleNext,
}: SessionCompletionProps) {
  const [sessionSummary, setSessionSummary] = useState("")
  const [nextSessionGoals, setNextSessionGoals] = useState("")
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low")

  const sessionStats = {
    completedTopics: ["라포 형성", "감정 표현 유도", "대처 전략 제안"],
    emotionalProgress: {
      depression: { before: 4, after: 3 },
      anxiety: { before: 3, after: 2 },
      loneliness: { before: 4, after: 3 },
      anger: { before: 2, after: 1 },
    },
  }

  const aiRecommendations = [
    "다음 상담에서는 가족과의 연락 빈도를 늘리는 구체적인 방법을 논의해보세요.",
    "산책이나 가벼운 운동을 일상에 포함시키는 방안을 제안해보세요.",
    "지역 사회 활동 참여에 대한 관심도를 확인해보세요.",
    "우울감 완화를 위한 취미 활동 발굴을 도와주세요.",
  ]

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {clientName} 어르신 {sessionNumber}회기 상담 완료
              </h1>
              <p className="text-muted-foreground">
                상담 시간: {sessionDuration} • 완료 시각: {new Date().toLocaleTimeString("ko-KR")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 상담 요약 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  상담 요약 작성
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="오늘 상담의 주요 내용과 어르신의 반응을 요약해주세요..."
                  value={sessionSummary}
                  onChange={(e) => setSessionSummary(e.target.value)}
                  className="min-h-[150px] resize-none mb-4"
                />

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">위험도 평가</label>
                    <div className="flex gap-2">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <Button
                          key={level}
                          variant={riskLevel === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => setRiskLevel(level)}
                          className={
                            level === "low"
                              ? "border-emerald-200 text-emerald-700"
                              : level === "medium"
                                ? "border-yellow-200 text-yellow-700"
                                : "border-red-200 text-red-700"
                          }
                        >
                          {level === "low" ? "낮음" : level === "medium" ? "보통" : "높음"}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>다음 회기 목표 설정</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="다음 상담에서 중점적으로 다룰 내용을 작성해주세요..."
                  value={nextSessionGoals}
                  onChange={(e) => setNextSessionGoals(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* 상담 결과 및 통계 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  감정 상태 변화
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(sessionStats.emotionalProgress).map(([emotion, progress]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {emotion === "depression"
                          ? "우울감"
                          : emotion === "anxiety"
                            ? "불안감"
                            : emotion === "loneliness"
                              ? "외로움"
                              : "분노"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{progress.before}</span>
                        <span className="text-sm">→</span>
                        <span className="text-sm font-medium">{progress.after}</span>
                        <Badge variant={progress.after < progress.before ? "default" : "secondary"} className="text-xs">
                          {progress.after < progress.before ? "개선" : "유지"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>완료된 상담 주제</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessionStats.completedTopics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI 추천 사항</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 justify-end">
          <Button variant="outline" onClick={onScheduleNext} className="flex items-center gap-2 bg-transparent">
            <Calendar className="w-4 h-4" />
            다음 상담 예약
          </Button>
          <Button onClick={onSaveSession} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            상담 기록 저장
          </Button>
        </div>
      </div>
    </div>
  )
}
