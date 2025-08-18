"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertTriangle, TrendingUp, Calendar } from "lucide-react"
import Image from "next/image"

interface CounselingCompletionSummaryProps {
  clientName: string
  sessionNumber: number
  duration: string
  onSave: () => void
  onBack: () => void
}

export default function CounselingCompletionSummary({
  clientName,
  sessionNumber,
  duration,
  onSave,
  onBack,
}: CounselingCompletionSummaryProps) {
  const [sessionSummary, setSessionSummary] = useState("")
  const [nextSessionPlan, setNextSessionPlan] = useState("")
  const [overallEffectiveness, setOverallEffectiveness] = useState("")
  const [riskLevel, setRiskLevel] = useState("중간")

  const emotionalProgress = {
    depression: { before: 4, after: 3, trend: "개선" },
    anxiety: { before: 3, after: 2, trend: "개선" },
    loneliness: { before: 5, after: 4, trend: "개선" },
    anger: { before: 2, after: 1, trend: "개선" },
  }

  const aiRecommendations = [
    "다음 2주 동안 가족과의 전화 통화 주 2회 권장",
    "산책이나 가벼운 운동 주 3회 실시",
    "감정 일기 작성을 통한 자기 성찰 시간 확보",
    "지역 복지관 프로그램 참여 검토",
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Image src="/images/s-lab-logo.png" alt="S-LAB Logo" width={100} height={50} />
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          상담 완료
        </Badge>
      </div>

      {/* Session Summary Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {clientName} 어르신 상담 완료 ({sessionNumber}회기)
              </h2>
              <p className="text-gray-600">
                상담 시간: {duration} | 완료 시각: {new Date().toLocaleString("ko-KR")}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">완료</div>
              <div className="text-sm text-gray-500">세션 저장 준비</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Emotional Progress */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                감정 상태 변화
              </h3>
              <div className="space-y-4">
                {Object.entries(emotionalProgress).map(([emotion, data]) => (
                  <div key={emotion} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">
                      {emotion === "depression"
                        ? "우울감"
                        : emotion === "anxiety"
                          ? "불안감"
                          : emotion === "loneliness"
                            ? "외로움"
                            : "분노"}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{data.before}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-bold text-emerald-600">{data.after}</span>
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                        {data.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">상담 세션 요약</h3>
              <Textarea
                value={sessionSummary}
                onChange={(e) => setSessionSummary(e.target.value)}
                placeholder="오늘 상담의 주요 내용, 어르신의 반응, 중요한 발견사항 등을 요약해주세요..."
                className="min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                위험도 평가
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">전체적인 위험 수준</label>
                  <Select value={riskLevel} onValueChange={setRiskLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="낮음">낮음 - 안정적</SelectItem>
                      <SelectItem value="중간">중간 - 주의 관찰</SelectItem>
                      <SelectItem value="높음">높음 - 집중 관리</SelectItem>
                      <SelectItem value="매우높음">매우 높음 - 즉시 개입</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>주의사항:</strong> 외로움 지수가 여전히 높습니다. 가족 연락 빈도 증가와 사회활동 참여를
                    권장합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Recommendations */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-emerald-700">AI 맞춤형 케어 플랜</h3>
              <div className="space-y-3">
                {aiRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm text-emerald-800">{recommendation}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 text-emerald-700 border-emerald-300 bg-transparent">
                상세 케어 플랜 생성
              </Button>
            </CardContent>
          </Card>

          {/* Next Session Planning */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                다음 회기 계획
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">상담 효과성 평가</label>
                  <Select value={overallEffectiveness} onValueChange={setOverallEffectiveness}>
                    <SelectTrigger>
                      <SelectValue placeholder="효과성을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="매우효과적">매우 효과적</SelectItem>
                      <SelectItem value="효과적">효과적</SelectItem>
                      <SelectItem value="보통">보통</SelectItem>
                      <SelectItem value="부족">부족</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">다음 회기 목표 및 계획</label>
                  <Textarea
                    value={nextSessionPlan}
                    onChange={(e) => setNextSessionPlan(e.target.value)}
                    placeholder="다음 상담에서 중점적으로 다룰 내용, 목표, 준비사항 등을 작성해주세요..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">빠른 작업</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  다음 상담 일정 예약
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  가족에게 상담 결과 공유
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  월간 진행 보고서 생성
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-center space-x-4 mt-6">
        <Button variant="outline" onClick={onBack} className="px-8 bg-transparent">
          수정하기
        </Button>
        <Button onClick={onSave} className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          상담 기록 저장
        </Button>
      </div>
    </div>
  )
}
