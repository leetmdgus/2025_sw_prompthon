"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AiSupervisionReport() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Image src="/images/s-lab-logo.png" alt="S-LAB Logo" width={100} height={50} />
        <Button variant="outline" className="text-sm bg-transparent">
          상담 일지 기록(4회기)
        </Button>
      </div>

      {/* Title */}
      <div className="bg-white border border-gray-300 rounded p-4 text-center font-medium mb-6">
        김순애 어르신 슈퍼비전 (4회기)
      </div>

      <Card className="bg-white mb-6">
        <CardContent className="p-6">
          {/* 상담 목표 */}
          <div className="mb-6">
            <div className="bg-gray-100 p-3 font-medium mb-3 border">상담 목표</div>
            <div className="space-y-1 text-sm">
              <div>1. 정서적 지지 강화</div>
              <div>2. 가족관계 속 외로움 완화</div>
              <div>3. 단기 기억 저하로 인한 혼란 완화</div>
            </div>
          </div>

          {/* 진행 가이드 */}
          <div className="mb-4">
            <div className="bg-gray-100 p-3 font-medium mb-3 border">진행 가이드</div>
          </div>

          {/* Counseling Steps */}
          <div className="space-y-6">
            {/* 1. 라포 형성 */}
            <div className="border-b pb-4">
              <div className="font-medium mb-3">1. 라포 형성</div>
              <div className="bg-gray-50 p-4 rounded mb-3">
                <div className="text-center text-sm mb-2">
                  최근 생활에서 기억 관리가 어렵다고
                  <br />
                  느낀 순간이 있으셨나요?
                </div>
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm">
                  다시 생성 하기
                </Button>
              </div>
            </div>

            {/* 2. 감정 표현 유도 */}
            <div className="border-b pb-4">
              <div className="font-medium mb-3">2. 감정 표현 유도</div>
              <div className="bg-gray-50 p-4 rounded mb-3">
                <div className="text-center text-sm mb-2">
                  가족과 함께할 시간에 어떤 감정을
                  <br />
                  느끼셨나요?
                </div>
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm">
                  다시 생성 하기
                </Button>
              </div>
            </div>

            {/* 3. 대처 전략 제안 */}
            <div className="border-b pb-4">
              <div className="font-medium mb-3">3. 대처 전략 제안</div>
              <div className="bg-gray-50 p-4 rounded mb-3">
                <div className="text-sm space-y-1">
                  <div>1. 감정 일기 쓰기</div>
                  <div>2. 짧은 산책, 호흡법</div>
                </div>
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm">
                  다시 생성 하기
                </Button>
              </div>
            </div>

            {/* 4. 가족 연계 */}
            <div>
              <div className="font-medium mb-3">4. 가족 연계</div>
              <div className="bg-gray-50 p-4 rounded mb-3">
                <div className="text-center text-sm">
                  가족에게 긍정적인 감정을
                  <br />
                  표현해보면 어떤 말을 하고
                  <br />
                  싶으세요?
                </div>
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm">
                  다시 생성 하기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
