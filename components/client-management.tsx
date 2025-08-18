"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Search,
  Phone,
  MapPin,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageCircle,
  Brain,
  BarChart3,
} from "lucide-react"
import { AICounselingGuide } from "./ai-counseling-guide"
import { EmotionalStateTracking } from "./emotional-state-tracking"

interface Client {
  id: string
  name: string
  photo?: string
  birthDate: string
  age: number
  phone: string
  address: string
  guardian: {
    name: string
    phone: string
    relationship: string
  }
  lastVisit: string
  emotionalState: {
    current: "좋음" | "보통" | "주의" | "위험"
    trend: "개선" | "유지" | "악화"
    summary: string
  }
  priority: "높음" | "보통" | "낮음"
  totalSessions: number
}

interface CounselingRecord {
  id: string
  date: string
  type: "정기" | "긴급" | "초기"
  duration: number
  emotionalScores: {
    depression: number
    anxiety: number
    loneliness: number
    anger: number
  }
  notes: string
  aiSummary: string
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "김순애",
    birthDate: "1945-03-15",
    age: 79,
    phone: "010-1234-5678",
    address: "서울시 종로구 청운동 123-45",
    guardian: {
      name: "김영수",
      phone: "010-9876-5432",
      relationship: "아들",
    },
    lastVisit: "2024-01-10",
    emotionalState: {
      current: "주의",
      trend: "악화",
      summary: "최근 외로움이 심화되고 있으며, 사회적 교류 필요",
    },
    priority: "높음",
    totalSessions: 12,
  },
  {
    id: "2",
    name: "박철수",
    birthDate: "1940-07-22",
    age: 84,
    phone: "010-2345-6789",
    address: "서울시 중구 명동 67-89",
    guardian: {
      name: "박미영",
      phone: "010-8765-4321",
      relationship: "딸",
    },
    lastVisit: "2024-01-12",
    emotionalState: {
      current: "위험",
      trend: "악화",
      summary: "분노 조절 어려움, 긴급 개입 필요",
    },
    priority: "높음",
    totalSessions: 8,
  },
  {
    id: "3",
    name: "이영희",
    birthDate: "1948-11-08",
    age: 76,
    phone: "010-3456-7890",
    address: "서울시 강남구 역삼동 234-56",
    guardian: {
      name: "이준호",
      phone: "010-7654-3210",
      relationship: "아들",
    },
    lastVisit: "2024-01-08",
    emotionalState: {
      current: "보통",
      trend: "개선",
      summary: "우울감이 점진적으로 개선되고 있음",
    },
    priority: "보통",
    totalSessions: 15,
  },
  {
    id: "4",
    name: "최민수",
    birthDate: "1942-05-30",
    age: 82,
    phone: "010-4567-8901",
    address: "서울시 마포구 합정동 345-67",
    guardian: {
      name: "최은정",
      phone: "010-6543-2109",
      relationship: "딸",
    },
    lastVisit: "2024-01-05",
    emotionalState: {
      current: "좋음",
      trend: "유지",
      summary: "안정적인 정서 상태 유지 중",
    },
    priority: "낮음",
    totalSessions: 6,
  },
]

const mockCounselingRecords: Record<string, CounselingRecord[]> = {
  "1": [
    {
      id: "r1",
      date: "2024-01-10",
      type: "정기",
      duration: 45,
      emotionalScores: {
        depression: 6,
        anxiety: 4,
        loneliness: 8,
        anger: 3,
      },
      notes: "외로움 호소, 가족과의 연락 빈도 감소",
      aiSummary: "외로움 지수가 높아졌으며, 사회적 지지 체계 강화 필요",
    },
    {
      id: "r2",
      date: "2024-01-03",
      type: "정기",
      duration: 40,
      emotionalScores: {
        depression: 5,
        anxiety: 4,
        loneliness: 7,
        anger: 2,
      },
      notes: "새해 계획에 대한 이야기, 긍정적 반응",
      aiSummary: "전반적으로 안정적이나 외로움에 대한 지속적 관찰 필요",
    },
  ],
}

export function ClientManagement({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [filterPriority, setFilterPriority] = useState<"전체" | "높음" | "보통" | "낮음">("전체")
  const [showAIGuide, setShowAIGuide] = useState(false)
  const [showEmotionalTracking, setShowEmotionalTracking] = useState(false)

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "전체" || client.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const getEmotionalStateColor = (state: string) => {
    switch (state) {
      case "좋음":
        return "text-green-600 bg-green-50"
      case "보통":
        return "text-blue-600 bg-blue-50"
      case "주의":
        return "text-orange-600 bg-orange-50"
      case "위험":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "개선":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "악화":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "유지":
        return <Minus className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  if (showEmotionalTracking && selectedClient) {
    return <EmotionalStateTracking client={selectedClient} onBack={() => setShowEmotionalTracking(false)} />
  }

  if (showAIGuide && selectedClient) {
    return (
      <AICounselingGuide
        client={selectedClient}
        onBack={() => setShowAIGuide(false)}
        onStartSession={(guide) => {
          console.log("Starting session with guide:", guide)
          setShowAIGuide(false)
        }}
      />
    )
  }

  if (selectedClient) {
    const clientRecords = mockCounselingRecords[selectedClient.id] || []

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSelectedClient(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">{selectedClient.name} 어르신</h1>
                <p className="text-sm text-muted-foreground">상담 기록 및 정서 분석</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEmotionalTracking(true)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                정서 추적
              </Button>
              <Button className="flex items-center gap-2" onClick={() => setShowAIGuide(true)}>
                <Brain className="h-4 w-4" />
                AI 가이드 생성
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Client Profile */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedClient.photo || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{selectedClient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedClient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedClient.age}세 ({selectedClient.birthDate})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        보호자: {selectedClient.guardian.name} ({selectedClient.guardian.relationship})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedClient.guardian.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>현재 정서 상태</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">상태</span>
                    <Badge className={getEmotionalStateColor(selectedClient.emotionalState.current)}>
                      {selectedClient.emotionalState.current}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">변화 추이</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(selectedClient.emotionalState.trend)}
                      <span className="text-sm">{selectedClient.emotionalState.trend}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedClient.emotionalState.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{selectedClient.totalSessions}</p>
                      <p className="text-xs text-muted-foreground">총 상담 횟수</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">{selectedClient.lastVisit}</p>
                      <p className="text-xs text-muted-foreground">최근 방문</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Counseling Records */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    상담 기록
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientRecords.map((record) => (
                      <div key={record.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant={record.type === "긴급" ? "destructive" : "default"}>{record.type}</Badge>
                            <span className="font-medium">{record.date}</span>
                            <span className="text-sm text-muted-foreground">{record.duration}분</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">우울</p>
                            <p className="text-lg font-semibold text-blue-600">{record.emotionalScores.depression}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">불안</p>
                            <p className="text-lg font-semibold text-orange-600">{record.emotionalScores.anxiety}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">외로움</p>
                            <p className="text-lg font-semibold text-purple-600">{record.emotionalScores.loneliness}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">분노</p>
                            <p className="text-lg font-semibold text-red-600">{record.emotionalScores.anger}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">상담 내용</p>
                            <p className="text-sm">{record.notes}</p>
                          </div>
                          <div className="p-3 bg-primary/5 rounded-lg">
                            <p className="text-sm font-medium text-primary mb-1">AI 분석</p>
                            <p className="text-sm">{record.aiSummary}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>맞춤형 정서 가이드</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">AI 추천 상담 전략</h4>
                    <p className="text-sm mb-3">
                      {selectedClient.name} 어르신은 최근 외로움이 심해졌습니다. 이번 상담에서는 가족과의 추억 대화를
                      유도하고, 산책을 제안해보세요.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">가족 사진 보며 추억 이야기하기</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">주 2회 이상 산책 계획 세우기</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">이웃과의 소통 기회 만들기</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">새로운 상담 시작</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

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
              <h1 className="text-2xl font-bold text-primary">상담하기</h1>
              <p className="text-sm text-muted-foreground">어르신 리스트 및 AI 가이드</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="어르신 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["전체", "높음", "보통", "낮음"].map((priority) => (
              <Button
                key={priority}
                variant={filterPriority === priority ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority(priority as any)}
              >
                {priority}
              </Button>
            ))}
          </div>
        </div>

        {/* Client Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={client.photo || "/placeholder.svg"} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.age}세</p>
                  </div>
                  <Badge variant={client.priority === "높음" ? "destructive" : "default"} className="text-xs">
                    {client.priority}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">보호자: {client.guardian.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">최근 방문: {client.lastVisit}</span>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">정서 상태</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(client.emotionalState.trend)}
                      <Badge className={`text-xs ${getEmotionalStateColor(client.emotionalState.current)}`}>
                        {client.emotionalState.current}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{client.emotionalState.summary}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
