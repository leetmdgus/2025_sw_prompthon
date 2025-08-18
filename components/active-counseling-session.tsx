"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, Pause, Square, AlertCircle, Heart, Brain, CheckCircle } from "lucide-react"
import Image from "next/image"

interface ActiveCounselingSessionProps {
  clientName: string
  sessionNumber: number
  onComplete: () => void
  onPause: () => void
}

// React.memo로 컴포넌트 최적화 (무한 로딩 방지)
const ActiveCounselingSession = memo(function ActiveCounselingSession({
  clientName,
  sessionNumber,
  onComplete,
  onPause,
}: ActiveCounselingSessionProps) {
  const [isRunning, setIsRunning] = useState(true)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [notes, setNotes] = useState("")
  const [showCompletionModal, setShowCompletionModal] = useState(false)
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

  // 타이머 useEffect 최적화 (무한 로딩 방지)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          // 최대 시간 제한으로 무한 증가 방지
          const maxTime = phases.reduce((sum, phase) => sum + phase.duration, 0) * 60
          return prev >= maxTime ? maxTime : prev + 1
        })
      }, 1000)
    }
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }
  }, [isRunning, phases])

  // ESC 키로 모달 닫기 (무한 로딩 방지)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCompletionModal) {
        setShowCompletionModal(false)
      }
    }

    if (showCompletionModal) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showCompletionModal])

  // 시간 포맷팅 함수 메모이제이션 (무한 로딩 방지)
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // 진행률 계산 메모이제이션 (무한 로딩 방지)
  const { totalDuration, progress } = useMemo(() => {
    const total = phases.reduce((sum, phase) => sum + phase.duration, 0) * 60
    const prog = total > 0 ? (timeElapsed / total) * 100 : 0
    return { totalDuration: total, progress: prog }
  }, [phases, timeElapsed])

  // 상담 완료 핸들러 메모이제이션 (무한 로딩 방지)
  const handleCompleteSession = useCallback(() => {
    setShowCompletionModal(true)
  }, [])

  const handleConfirmCompletion = useCallback(() => {
    setShowCompletionModal(false)
    onComplete()
  }, [onComplete])

  // 일시정지/재개 핸들러 메모이제이션 (무한 로딩 방지)
  const handlePlayPause = useCallback(() => {
    setIsRunning(prev => !prev)
  }, [])

  // 단계 변경 핸들러 메모이제이션 (무한 로딩 방지)
  const handleNextPhase = useCallback(() => {
    setCurrentPhase(prev => Math.min(prev + 1, phases.length - 1))
  }, [phases.length])

  const handlePrevPhase = useCallback(() => {
    setCurrentPhase(prev => Math.max(prev - 1, 0))
  }, [])

  // 감정 체크 핸들러 메모이제이션 (무한 로딩 방지)
  const handleEmotionalCheck = useCallback((emotion: string, level: number) => {
    setEmotionalChecks(prev => ({
      ...prev,
      [emotion]: level,
    }))
  }, [])

  // 메모 변경 핸들러 메모이제이션 (무한 로딩 방지)
  const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }, [])

  // 모달 닫기 핸들러 메모이제이션 (무한 로딩 방지)
  const handleModalClose = useCallback(() => {
    setShowCompletionModal(false)
  }, [])

  // 현재 단계 정보 메모이제이션 (무한 로딩 방지)
  const currentPhaseInfo = useMemo(() => {
    return phases[currentPhase] || phases[0]
  }, [phases, currentPhase])

  // 포맷된 시간 메모이제이션 (무한 로딩 방지)
  const formattedTime = useMemo(() => formatTime(timeElapsed), [formatTime, timeElapsed])
  const formattedProgress = useMemo(() => Math.round(progress), [progress])

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
              <p className="text-gray-600">진행 시간: {formattedTime}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-2xl font-mono">{formattedTime}</span>
            </div>
          </div>
          <Progress value={formattedProgress} className="mt-4" />
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
                onClick={handleNextPhase}
                className="w-full"
                disabled={currentPhase === phases.length - 1}
              >
                다음 단계로
              </Button>
              <Button
                variant="outline"
                onClick={handlePrevPhase}
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
              onChange={handleNotesChange}
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
                            handleEmotionalCheck(emotion, num)
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
        <Button variant="outline" onClick={handlePlayPause} className="px-8">
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? "일시정지" : "재개"}
        </Button>
        <Button onClick={handleCompleteSession} className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
          <Square className="w-4 h-4 mr-2" />
          상담 완료
        </Button>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <Card 
            className="p-8 text-center max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">상담 완료!</h3>
              <p className="text-gray-600 leading-relaxed">
                {clientName} 어르신의 {sessionNumber}회기 상담이 성공적으로 완료되었습니다.
              </p>
            </div>
            
            <div className="space-y-3 mb-6 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>상담 시간:</span>
                <span className="font-medium">{formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>진행률:</span>
                <span className="font-medium">{formattedProgress}%</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button 
                onClick={handleConfirmCompletion}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
              >
                확인
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
})

export default ActiveCounselingSession
