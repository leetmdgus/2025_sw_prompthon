"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarIcon, Clock, User, Bell, ChevronLeft, ChevronRight } from "lucide-react"

interface Appointment {
  id: string
  clientName: string
  time: string
  type: "정기" | "긴급" | "초기"
  status: "예정" | "완료" | "취소"
  notes: string
  priority: "높음" | "보통" | "낮음"
}

const mockAppointments: Record<string, Appointment[]> = {
  "2024-01-15": [
    {
      id: "1",
      clientName: "김순애",
      time: "10:00",
      type: "정기",
      status: "예정",
      notes: "외로움 관리 상담",
      priority: "보통",
    },
    {
      id: "2",
      clientName: "박철수",
      time: "14:00",
      type: "긴급",
      status: "예정",
      notes: "분노 관리 긴급 상담",
      priority: "높음",
    },
    {
      id: "3",
      clientName: "이영희",
      time: "16:30",
      type: "정기",
      status: "예정",
      notes: "우울감 개선 상담",
      priority: "보통",
    },
  ],
  "2024-01-16": [
    {
      id: "4",
      clientName: "최민수",
      time: "09:30",
      type: "초기",
      status: "예정",
      notes: "첫 상담 - 기본 상태 파악",
      priority: "보통",
    },
  ],
}

export function CalendarPage({ onBack }: { onBack: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Generate calendar days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getAppointmentsForDate = (day: number) => {
    const dateKey = formatDateKey(currentYear, currentMonth, day)
    return mockAppointments[dateKey] || []
  }

  const selectedDateAppointments = selectedDate ? mockAppointments[selectedDate] || [] : []

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">달력</h1>
              <p className="text-sm text-muted-foreground">상담 일정 관리</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              월간
            </Button>
            <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
              주간
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    {currentYear}년 {monthNames[currentMonth]}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "month" && (
                  <div className="grid grid-cols-7 gap-1">
                    {/* Week day headers */}
                    {weekDays.map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}

                    {/* Calendar days */}
                    {calendarDays.map((day, index) => {
                      if (day === null) {
                        return <div key={index} className="p-2 h-20" />
                      }

                      const dateKey = formatDateKey(currentYear, currentMonth, day)
                      const appointments = getAppointmentsForDate(day)
                      const isToday =
                        today.getDate() === day &&
                        today.getMonth() === currentMonth &&
                        today.getFullYear() === currentYear
                      const isSelected = selectedDate === dateKey

                      return (
                        <div
                          key={day}
                          className={`p-2 h-20 border border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                            isToday ? "bg-primary/10 border-primary" : ""
                          } ${isSelected ? "bg-accent/20 border-accent" : ""}`}
                          onClick={() => setSelectedDate(dateKey)}
                        >
                          <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
                          <div className="space-y-1">
                            {appointments.slice(0, 2).map((apt) => (
                              <div
                                key={apt.id}
                                className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                                  apt.priority === "높음"
                                    ? "bg-destructive"
                                    : apt.type === "긴급"
                                      ? "bg-orange-500"
                                      : "bg-primary"
                                }`}
                              >
                                {apt.time} {apt.clientName}
                              </div>
                            ))}
                            {appointments.length > 2 && (
                              <div className="text-xs text-muted-foreground">+{appointments.length - 2}개 더</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointment Details */}
          <div className="space-y-6">
            {/* Today's Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" />
                  오늘의 알림
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">김순애 어르신</p>
                      <p className="text-xs text-muted-foreground">30분 후 상담 예정</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                    <Bell className="h-4 w-4 text-destructive" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">박철수 어르신</p>
                      <p className="text-xs text-muted-foreground">긴급 상담 - 우선 처리</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {selectedDate} 상담 일정
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">예정된 상담이 없습니다</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedDateAppointments.map((appointment) => (
                        <div key={appointment.id} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{appointment.clientName} 어르신</h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  appointment.priority === "높음"
                                    ? "destructive"
                                    : appointment.type === "긴급"
                                      ? "secondary"
                                      : "default"
                                }
                              >
                                {appointment.type}
                              </Badge>
                              <Badge variant="outline">{appointment.priority}</Badge>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {appointment.time}
                            </div>
                            <p>{appointment.notes}</p>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline">
                              상담 시작
                            </Button>
                            <Button size="sm" variant="ghost">
                              일정 변경
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  새 상담 예약
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  일정 가져오기
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  알림 설정
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
