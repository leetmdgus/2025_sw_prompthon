"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, Users, Bell, Settings, UserPlus } from "lucide-react"
import { CalendarPage } from "./calendar-page"
import { ClientRegistration } from "./client-registration"
import { IntegratedCounselingFlow } from "./integrated-counseling-flow"

export function MainDashboard() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "calendar" | "registration" | "counseling" | "records">(
    "dashboard",
  )

  const today = new Date()
  const todayString = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  if (currentPage === "calendar") {
    return <CalendarPage onBack={() => setCurrentPage("dashboard")} />
  }

  if (currentPage === "registration") {
    return (
      <ClientRegistration
        onBack={() => setCurrentPage("dashboard")}
        onComplete={(clientData) => {
          console.log("[v0] New client registered:", clientData)
          setCurrentPage("dashboard")
        }}
      />
    )
  }

  if (currentPage === "counseling") {
    return <IntegratedCounselingFlow onBack={() => setCurrentPage("dashboard")} />
  }

  if (currentPage === "records") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">상담 기록</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">과거 상담 기록 조회</p>
            </div>
            <Button variant="outline" onClick={() => setCurrentPage("dashboard")}>
              대시보드로 돌아가기
            </Button>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">상담 기록 조회</h3>
              <p className="text-muted-foreground">과거 상담 기록을 조회하고 분석할 수 있습니다.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">Labchain</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">어르신 정서 가이드 AI</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{todayString}</h2>
            <p className="text-base sm:text-lg text-primary font-medium">오늘도 힘내세요, 사회복지사님 🌸</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">24</p>
              <p className="text-xs sm:text-sm text-muted-foreground">등록 어르신</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">3</p>
              <p className="text-xs sm:text-sm text-muted-foreground">오늘 상담</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">12</p>
              <p className="text-xs sm:text-sm text-muted-foreground">이번 주 상담</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-chart-1 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">85%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">만족도</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Menu Buttons */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg">
                  <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
                어르신 등록하기
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                새로운 어르신을 등록하고 기본 정보를 입력하세요
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>등록 대기</span>
                  <span className="font-medium text-emerald-600">2명</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>이번 달 신규</span>
                  <span className="font-medium text-primary">8명</span>
                </div>
              </div>
              <Button
                className="w-full mt-3 sm:mt-4 h-10 sm:h-9 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setCurrentPage("registration")}
              >
                새 어르신 등록
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                상담하기
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                어르신을 선택하고 AI 가이드와 함께 상담을 진행하세요
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>상담 대상</span>
                  <span className="font-medium text-primary">24명</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>우선 상담</span>
                  <span className="font-medium text-destructive">5명</span>
                </div>
              </div>
              <Button className="w-full mt-3 sm:mt-4 h-10 sm:h-9" onClick={() => setCurrentPage("counseling")}>
                AI 가이드 상담 시작
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                캘린더
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                상담 일정을 관리하고 예약을 확인하세요
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>오늘 일정</span>
                  <span className="font-medium text-blue-600">3건</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>이번 주 일정</span>
                  <span className="font-medium text-primary">12건</span>
                </div>
              </div>
              <Button
                className="w-full mt-3 sm:mt-4 h-10 sm:h-9 bg-blue-600 hover:bg-blue-700"
                onClick={() => setCurrentPage("calendar")}
              >
                일정 관리
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
                <div className="p-2 sm:p-3 bg-accent/10 rounded-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                상담 기록
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                과거 상담 기록을 조회하고 분석하세요
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>총 상담 기록</span>
                  <span className="font-medium text-accent">156건</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>이번 달 상담</span>
                  <span className="font-medium text-primary">28건</span>
                </div>
              </div>
              <Button className="w-full mt-3 sm:mt-4 h-10 sm:h-9" onClick={() => setCurrentPage("records")}>
                기록 조회
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Preview */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              오늘의 일정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-lg gap-2 sm:gap-0">
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">김순애 어르신</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">정기 상담 - 외로움 관리</p>
                </div>
                <div className="flex justify-between sm:block sm:text-right">
                  <p className="text-sm font-medium text-primary">10:00</p>
                  <p className="text-xs text-muted-foreground">30분 전 알림</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-lg gap-2 sm:gap-0">
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">박철수 어르신</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">긴급 상담 - 분노 관리</p>
                </div>
                <div className="flex justify-between sm:block sm:text-right">
                  <p className="text-sm font-medium text-destructive">14:00</p>
                  <p className="text-xs text-muted-foreground">우선 상담</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-muted/50 rounded-lg gap-2 sm:gap-0">
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">이영희 어르신</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">정기 상담 - 우울감 개선</p>
                </div>
                <div className="flex justify-between sm:block sm:text-right">
                  <p className="text-sm font-medium text-primary">16:30</p>
                  <p className="text-xs text-muted-foreground">정기 상담</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
