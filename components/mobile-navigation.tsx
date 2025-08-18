"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Calendar, MessageCircle, Brain, BarChart3, Home, Settings } from "lucide-react"

interface MobileNavigationProps {
  onNavigate?: (page: string) => void
  currentPage?: string
}

export default function MobileNavigation({ onNavigate, currentPage = "home" }: MobileNavigationProps) {
  const navItems = [
    {
      title: "상담 하기",
      subtitle: "오늘 3명의 어르신이 예정되어 있습니다.",
      icon: MessageCircle,
      page: "counseling",
      color: "text-accent",
    },
    {
      title: "일정 관리",
      subtitle: "달력 및 예약",
      icon: Calendar,
      page: "calendar",
      color: "text-primary",
    },
    {
      title: "AI 슈퍼비전",
      subtitle: "맞춤형 상담 가이드",
      icon: Brain,
      page: "ai-guide",
      color: "text-secondary",
    },
    {
      title: "정신 상태 분석",
      subtitle: "감정 상태 추적",
      icon: BarChart3,
      page: "analytics",
      color: "text-chart-1",
    },
  ]

  const bottomNavItems = [
    { title: "홈", icon: Home, page: "home" },
    { title: "상담\n기록", icon: MessageCircle, page: "records" },
    { title: "AI\n가이드", icon: Brain, page: "ai-guide" },
    { title: "설정", icon: Settings, page: "settings" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-center mb-2">
          <Image src="/images/s-lab-logo.png" alt="S-LAB Logo" width={80} height={40} />
        </div>
        <div className="text-center font-medium text-foreground mb-1">마음이 따뜻해지는 상담 동행</div>
        <div className="text-center text-sm text-muted-foreground flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
          오늘 3명의 어르신이 예정되어 있습니다.
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {navItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Card
                key={index}
                className="bg-card hover:shadow-md transition-shadow cursor-pointer border-border"
                onClick={() => onNavigate?.(item.page)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <IconComponent className={`h-8 w-8 ${item.color}`} />
                  </div>
                  <div className="font-medium text-sm mb-1 text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{item.subtitle}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-3">빠른 실행</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-12 bg-transparent"
                onClick={() => onNavigate?.("emergency")}
              >
                <MessageCircle className="h-4 w-4 mr-2 text-destructive" />
                긴급 상담 시작
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-12 bg-transparent"
                onClick={() => onNavigate?.("schedule")}
              >
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                오늘 일정 확인
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-3">오늘의 요약</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-xs text-muted-foreground">예정 상담</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">12</p>
                <p className="text-xs text-muted-foreground">이번 주 상담</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="grid grid-cols-4 text-center">
          {bottomNavItems.map((item, index) => {
            const IconComponent = item.icon
            const isActive = currentPage === item.page
            return (
              <Button
                key={index}
                variant="ghost"
                className={`h-16 flex-col gap-1 rounded-none ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
                }`}
                onClick={() => onNavigate?.(item.page)}
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-xs leading-tight whitespace-pre-line">{item.title}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
