"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function SessionHistory() {
  const sessions = [
    {
      session: "이전 상담 요약 (1회기)",
      date: "2025년 07월 20일",
      counselor: "조자영/김순애",
      coreKeywords: "우울 / 가족 / 외로움",
      emotionalChange: "4단계 → 3단계",
      riskLevel: "중간 위험",
      summary: "경미한 단기 기억 저하와 정서적 어려움으로 정서적 지지와 감정 표현 유도 중심 상담이 필요함",
    },
    {
      session: "이전 상담 요약 (2회기)",
      date: "2025년 08월 01일",
      counselor: "조자영 / 김순애",
      coreKeywords: "불안 / 우울 / 가족관계",
      emotionalChange: "3단계 → 3단계 유지",
      riskLevel: "중간 위험",
      summary:
        "가족과의 대화 시 불안을 자주 경험하였으며, 외로움 호소. 감정 일기 작성 과제를 통해 스스로 감정을 언어화하려는 노력이 필요함.",
    },
    {
      session: "이전 상담 요약 (3회기)",
      date: "2025년 08월 15일",
      counselor: "조자영 / 김순애",
      coreKeywords: "우울 / 가족 / 외로움",
      emotionalChange: "3단계 → 2단계 (부분적 호전)",
      riskLevel: "중간 위험",
      summary:
        "가족과의 관계에서 긍정적 순간을 일부 경험함. 단기 기억 저하 지속되나, 정서적 안정감 증가. 감정 표현 유도와 가족 연계 중심 상담이 효과적임.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <Image src="/images/s-lab-logo.png" alt="S-LAB Logo" width={120} height={60} />
      </div>

      {/* Title */}
      <div className="bg-white border border-gray-300 rounded p-4 text-center font-medium mb-6">
        김순애 어르신 이전 상담 내역 및 AI 요약
      </div>

      {/* Session Cards */}
      <div className="space-y-4">
        {sessions.map((session, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-0">
              <div className="bg-gray-100 p-3 font-medium border-b">{session.session}</div>
              <div className="p-4 space-y-2 text-sm">
                <div>
                  <strong>{session.date}</strong> / 상담자: {session.counselor}
                </div>
                <div>핵심 키워드: {session.coreKeywords}</div>
                <div>감정 변화: {session.emotionalChange}</div>
                <div>리스크 지표: {session.riskLevel}</div>
                <div className="pt-2 leading-relaxed">주요 내용: {session.summary}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-right text-sm font-medium mt-6">
        (4회기) 슈퍼비전
        <br />
        생성
      </div>
    </div>
  )
}
