"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Pause, Square, AlertCircle, Heart, Brain } from "lucide-react"
import Image from "next/image"

interface ActiveCounselingSessionProps {
  clientName: string
  sessionNumber: number
  onComplete: () => void
  onPause: () => void
}

export default function ActiveCounselingSession({
  clientName,
  sessionNumber,
  onComplete,
  onPause,
}: ActiveCounselingSessionProps) {
  const [isRunning, setIsRunning] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [notes, setNotes] = useState("")
  const [emotionalChecks, setEmotionalChecks] = useState({
    depression: 3,
    anxiety: 2,
    loneliness: 4,
    anger: 1,
  })

  const phases = [
    { name: "라포 형성", duration: 10, color: "bg-blue-500" },
    { name: "감정 탐색", duration: 15, color: "bg-green-500" },
    { name: "대처 방안", duration: 10, color: "bg-yellow-500" },
    { name: "마무리", duration: 5, color: "bg-purple-500" },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0) * 60
  const progress = (timeElapsed / totalDuration) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Image src="/images/s-lab-logo.png" alt="S-LAB Logo" width={100} height={50} />
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            상담 진행 중
          </Badge>
          <Button variant="outline" onClick={onPause}>
            일시 정지
          </Button>
        </div>
      </div>

      {/* Session Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {clientName} 어르신 상담 ({sessionNumber}회기)
              </h2>
              <p className="text-gray-600">진행 시간: {formatTime(timeElapsed)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-2xl font-mono">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Session Progress */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">상담 진행 단계</h3>
            <div className="space-y-3">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index === currentPhase ? "bg-blue-50 border-blue-300" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{phase.name}</span>
                    <span className="text-sm text-gray-500">{phase.duration}분</span>
                  </div>
                  {index === currentPhase && (
                    <div className="mt-2">
                      <div className={`h-2 rounded-full ${phase.color}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Button
                onClick={() => setCurrentPhase(Math.min(currentPhase + 1, phases.length - 1))}
                className="w-full"
                disabled={currentPhase === phases.length - 1}
              >
                다음 단계로
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPhase(Math.max(currentPhase - 1, 0))}
                className="w-full"
                disabled={currentPhase === 0}
              >
                이전 단계로
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Middle Column - Real-time Notes */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">실시간 상담 메모</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="상담 중 중요한 내용을 실시간으로 기록하세요..."
              className="min-h-[300px] resize-none"
            />

            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full text-sm bg-transparent">
                <Heart className="w-4 h-4 mr-2" />
                감정 반응 기록
              </Button>
              <Button variant="outline" className="w-full text-sm bg-transparent">
                <Brain className="w-4 h-4 mr-2" />
                인지 상태 체크
              </Button>
              <Button variant="outline" className="w-full text-sm bg-transparent">
                <AlertCircle className="w-4 h-4 mr-2" />
                주의사항 표시
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - AI Guidance & Emotional Check */}
        <div className="space-y-6">
          {/* AI Real-time Guidance */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 text-emerald-700">AI 실시간 가이드</h3>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm font-medium text-emerald-800">현재 단계 제안</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    "어르신의 목소리 톤이 낮아졌습니다. 가족과의 좋은 추억에 대해 물어보세요."
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">대화 주제 제안</p>
                  <p className="text-sm text-blue-700 mt-1">
                    "최근 손자/손녀와의 만남이나 전화 통화에 대해 이야기해보세요."
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800">주의사항</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    "우울감이 높아 보입니다. 긍정적인 활동 계획을 함께 세워보세요."
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 text-sm bg-transparent">
                새로운 가이드 요청
              </Button>
            </CardContent>
          </Card>

          {/* Emotional State Check */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">현재 감정 상태 체크</h3>
              <div className="space-y-4">
                {Object.entries(emotionalChecks).map(([emotion, level]) => (
                  <div key={emotion}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        {emotion === "depression"
                          ? "우울감"
                          : emotion === "anxiety"
                            ? "불안감"
                            : emotion === "loneliness"
                              ? "외로움"
                              : "분노"}
                      </span>
                      <span className="text-sm text-gray-500">{level}/5</span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() =>
                            setEmotionalChecks((prev) => ({
                              ...prev,
                              [emotion]: num,
                            }))
                          }
                          className={`w-8 h-8 rounded-full border-2 ${
                            num <= level ? "bg-red-500 border-red-500" : "bg-gray-100 border-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <Button variant="outline" onClick={() => setIsRunning(!isRunning)} className="px-8">
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? "일시정지" : "재개"}
        </Button>
        <Button onClick={onComplete} className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Square className="w-4 h-4 mr-2" />
          상담 완료
        </Button>
      </div>
    </div>
  )
}
