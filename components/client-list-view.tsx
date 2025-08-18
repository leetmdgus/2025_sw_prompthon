"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ClientListView() {
  const clients = [
    {
      name: "김순애",
      photo: "/placeholder.svg?height=120&width=120",
      birthDate: "1938.12.05",
      contact: "010-7867-9856",
      address: "경원도 춘천시 석주로 **",
      guardian: "김영희(딸)",
      lastVisit: "2025 - 07 - 11",
      currentStatus: "이전 상담 내용 기반 현 정서 상태",
      aiGuidance: "김순애 어르신의 맞춤형 정서 지원 가이드 (슈퍼비전)",
      description:
        "경미한 단기 기억 저하 와 외로움, 우울감이 있으나 일상생활에는 큰 지장이 없음, 복성 관계에 다소 소극적으로 정서적 지지와 감정 표현 주도 중심의 상담이 필요함",
    },
    {
      name: "이미자",
      photo: "/placeholder.svg?height=120&width=120",
      birthDate: "1938.12.05",
      contact: "010-7867-9856",
      address: "경원도 춘천시 석주로 **",
      guardian: "김영희(딸)",
      lastVisit: "2025 - 07 - 11",
      currentStatus: "이전 상담 내용 기반 현 정서 상태",
      aiGuidance: "이미자 어르신의 맞춤형 정서 지원 가이드 (슈퍼비전)",
      description:
        "경미한 단기 기억 저하 와 외로움, 우울감이 있으나 일상생활에는 큰 지장이 없음, 복성 관계에 다소 소극적으로 정서적 지지와 감정 표현 주도 중심의 상담이 필요함",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <Image src="/images/s-lab-logo.png" alt="S-LAB Logo" width={120} height={60} className="mr-4" />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="bg-white border border-gray-300 rounded p-3 text-center text-gray-600">이름 검색</div>
      </div>

      {/* Client Cards */}
      <div className="space-y-4">
        {clients.map((client, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-0">
              <div className="grid grid-cols-12 gap-0">
                {/* Photo Section */}
                <div className="col-span-3 p-4 flex flex-col items-center justify-center border-r">
                  <div className="w-20 h-20 bg-gray-200 rounded mb-2 overflow-hidden">
                    <Image
                      src={client.photo || "/placeholder.svg"}
                      alt={client.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-lg font-semibold text-center">{client.name}</div>
                </div>

                {/* Info Section */}
                <div className="col-span-5 p-4 border-r">
                  <div className="bg-gray-100 p-2 text-center text-sm font-medium mb-3 border">인적사항</div>
                  <div className="space-y-1 text-sm">
                    <div>생년월일:{client.birthDate}</div>
                    <div>연락처:{client.contact}</div>
                    <div>주소:{client.address}</div>
                    <div>보호자:{client.guardian}</div>
                    <div>최근 방문일: {client.lastVisit}</div>
                  </div>
                  <div className="mt-3 p-2 bg-gray-100 text-xs text-center border">{client.currentStatus}</div>
                  <div className="mt-3 p-3 bg-gray-50 text-xs leading-relaxed">{client.description}</div>
                </div>

                {/* AI Guide Section */}
                <div className="col-span-4 p-4 flex flex-col justify-center">
                  <div className="bg-emerald-100 p-4 rounded text-center">
                    <div className="text-sm font-medium mb-2">{client.name} 어르신의 맞춤형 정서 지원 가이드</div>
                    <div className="text-xs text-gray-600 mb-3">(슈퍼비전)</div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                      가이드 보기
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-8 space-x-2">
        <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
}
