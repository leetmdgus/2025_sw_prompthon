"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import ActiveCounselingSession from "./active-counseling-session"
import CounselingCompletionSummary from "./counseling-completion-summary"

export default function CounselingSessionForm() {
  const [sessionPhase, setSessionPhase] = useState<"preparation" | "active" | "completed">("preparation")
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)

  const handleStartSession = () => {
    setSessionStartTime(new Date())
    setSessionPhase("active")
  }

  const handleCompleteSession = () => {
    setSessionPhase("completed")
  }

  const handleBackToPreparation = () => {
    setSessionPhase("preparation")
  }

  const handleSaveSession = () => {
    // Save session logic here
    alert("상담 기록이 저장되었습니다.")
    setSessionPhase("preparation")
    setSessionStartTime(null)
  }

  const getSessionDuration = () => {
    if (!sessionStartTime) return "00:00"
    const now = new Date()
    const diff = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000)
    const mins = Math.floor(diff / 60)
    const secs = diff % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (sessionPhase === "active") {
    return (
      <ActiveCounselingSession
        clientName="김순애"
        sessionNumber={4}
        onComplete={handleCompleteSession}
        onPause={handleBackToPreparation}
      />
    )
  }

  if (sessionPhase === "completed") {
    return (
      <CounselingCompletionSummary
        clientName="김순애"
        sessionNumber={4}
        duration={getSessionDuration()}
        onSave={handleSaveSession}
        onBack={handleBackToPreparation}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Image src="/images/s-lab-logo.png" alt="S-LAB Logo" width={100} height={50} />
        <Button variant="outline" className="text-sm bg-transparent">
          상담 일지 기록
        </Button>
      </div>

      {/* Title */}
      <div className="bg-white border border-gray-300 rounded p-4 text-center font-medium mb-6">
        상담 일지 기록 (회기) (4회기)
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* 상담 목표 확인 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">상담 목표 확인</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="goal1" />
                    <label htmlFor="goal1" className="text-sm">
                      정서적 지지 강화
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="goal2" />
                    <label htmlFor="goal2" className="text-sm">
                      가족관계 속 외로움 완화
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="goal3" />
                    <label htmlFor="goal3" className="text-sm">
                      단기 기억 저하로 인한 혼란 완화
                    </label>
                  </div>
                </div>
              </div>

              {/* 상담 전행 요약 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">상담 전행 요약</div>
                <Textarea className="min-h-[80px] resize-none" placeholder="상담 내용을 입력하세요..." />
              </div>

              {/* 관찰 내용 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">관찰 내용</div>
                <Textarea className="min-h-[80px] resize-none" placeholder="관찰된 내용을 입력하세요..." />
              </div>

              {/* 상담 효과 및 향후 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">상담 효과 및 향후</div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="보통" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">매우 좋음</SelectItem>
                    <SelectItem value="good">좋음</SelectItem>
                    <SelectItem value="normal">보통</SelectItem>
                    <SelectItem value="poor">부족</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 근거 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">근거</div>
                <Textarea className="min-h-[60px] resize-none" placeholder="상담지 의견 및 다음 회기 협의사항" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* 라포 형성 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">라포 형성</div>
                <Textarea
                  className="min-h-[60px] resize-none"
                  placeholder="지난 상담 이후 기억 관리에 어려움이 있었나요?"
                />
              </div>

              {/* 감정 표현 유도 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">감정 표현 유도</div>
                <Textarea
                  className="min-h-[60px] resize-none"
                  placeholder="가족과 함께한 순간 중 어떤 감정을 느끼셨나요?"
                />
              </div>

              {/* 대처 전략 제안 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">대처 전략 제안</div>
                <div className="space-y-2 text-sm">
                  <div>감정 일기 쓰기</div>
                  <div>짧은 산책, 호흡법</div>
                </div>
              </div>

              {/* 가족 연계 */}
              <div>
                <div className="bg-gray-100 p-3 font-medium mb-3 border">가족 연계</div>
                <Textarea
                  className="min-h-[60px] resize-none"
                  placeholder="가족에게 대한한 마음을 표현해보면 어떤 말을 하고 싶으세요?"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">다시 생성 추천</Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">수정 후 저장</Button>
                <Button onClick={handleStartSession} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  상담 시작하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <Button variant="outline" className="px-8 bg-transparent">
          저장
        </Button>
        <Button className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white">임시 저장</Button>
      </div>

      {/* Footer Note */}
      <div className="text-right text-xs text-gray-500 mt-4">(1 S-LAB 가이드</div>
    </div>
  )
}
