process.env.LANGCHAIN_TRACING_V2 = "false"
process.env.LANGCHAIN_API_KEY = ""

import { OpenAI } from "openai"

interface CounselingRecord {
  id: number
  clientId: number
  sessionNumber: number
  date: string
  emotionalState: {
    depression: number
    anxiety: number
    loneliness: number
    anger: number
    mood: string
  }
  checklist?: string[]
  specialNotes: string
  summary: string
  aiRoadmap?: string[]
}

interface RAGContext {
  pastSessions: CounselingRecord[]
  currentRoadmap: string[]
  visitNumber: number
}

interface VisitStrategy {
  visitNumber: number
  primaryFocus: string[]
  interventionApproach: string
  expectedOutcomes: string[]
  riskFactors: string[]
  specialConsiderations: string[]
}

class CounselingRAGSystem {
  private visitStrategies: Map<number, VisitStrategy>
  private counselingRecords: CounselingRecord[] = []
  private openai: OpenAI | null

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey && apiKey.trim() !== "") {
      this.openai = new OpenAI({
        apiKey: apiKey,
      })
    } else {
      this.openai = null
      console.log("[v0] OpenAI API key not provided - using template-based responses")
    }

    this.visitStrategies = new Map([
      [
        1,
        {
          visitNumber: 1,
          primaryFocus: ["라포 형성", "초기 평가", "안전성 확보", "기본 욕구 파악"],
          interventionApproach: "지지적이고 비침습적인 접근, 신뢰 관계 구축 우선",
          expectedOutcomes: ["기본 정보 수집", "위험도 평가", "초기 치료 계획 수립"],
          riskFactors: ["초기 저항", "정보 제공 거부", "과도한 기대"],
          specialConsiderations: ["충분한 시간 확보", "편안한 환경 조성", "경청과 공감 우선"],
        },
      ],
      [
        2,
        {
          visitNumber: 2,
          primaryFocus: ["관계 심화", "문제 탐색", "목표 설정", "초기 개입"],
          interventionApproach: "구조화된 탐색과 목표 지향적 접근",
          expectedOutcomes: ["구체적 문제 파악", "치료 목표 합의", "초기 변화 시작"],
          riskFactors: ["성급한 변화 시도", "목표 설정의 어려움"],
          specialConsiderations: ["현실적 목표 설정", "작은 성공 경험 제공"],
        },
      ],
      [
        3,
        {
          visitNumber: 3,
          primaryFocus: ["개입 강화", "기술 습득", "변화 촉진", "진전 평가"],
          interventionApproach: "적극적 개입과 기술 교육 중심",
          expectedOutcomes: ["구체적 기술 습득", "행동 변화 시작", "자신감 증진"],
          riskFactors: ["변화에 대한 저항", "기술 적용의 어려움"],
          specialConsiderations: ["단계적 기술 교육", "실제 적용 연습"],
        },
      ],
      [
        4,
        {
          visitNumber: 4,
          primaryFocus: ["변화 유지", "문제 해결", "자립성 증진", "재발 방지"],
          interventionApproach: "자립적 문제 해결 능력 강화",
          expectedOutcomes: ["독립적 문제 해결", "변화 유지 전략", "자신감 공고화"],
          riskFactors: ["의존성", "변화 유지의 어려움"],
          specialConsiderations: ["점진적 독립성 증진", "지지체계 활용"],
        },
      ],
    ])
  }

  async initializeVectorStore(counselingRecords: CounselingRecord[]) {
    this.counselingRecords = counselingRecords
  }

  async generateFirstVisitGuide(
    clientInfo: { name: string; age: number; background: string },
    checklist: string[],
    emotionalState: any,
    specialNotes: string,
  ) {
    const strategy = this.visitStrategies.get(1)!

    const riskLevel = this.assessRiskLevel(emotionalState)
    const priorities = this.determinePriorities(emotionalState, checklist)

    return {
      shortTermGoals: [
        `${clientInfo.name} 어르신과의 신뢰 관계 구축`,
        "기본적인 안전성 및 욕구 확인",
        "정서적 안정감 제공",
      ],
      mediumTermGoals: [
        "주요 문제 영역 파악 및 탐색",
        "사회적 지지체계 활용 방안 모색",
        "일상생활 기능 향상 계획 수립",
      ],
      longTermGoals: ["삶의 질 전반적 향상", "자립적 생활 능력 강화", "사회적 연결성 증진"],
      immediateInterventions: priorities,
      recommendedActivities: this.getRecommendedActivities(emotionalState),
      riskLevel: riskLevel,
      nextFocus: "2회차에서는 관계 심화 및 구체적 문제 탐색에 집중",
    }
  }

  async generateVisitSpecificGuide(context: RAGContext, currentEmotionalState: any, currentNotes: string) {
    const visitNumber = context.visitNumber
    const strategy = this.visitStrategies.get(visitNumber) || this.visitStrategies.get(4)!

    const progressAnalysis = this.analyzeProgressTrend(context.pastSessions)
    const emotionalTrend = this.analyzeEmotionalTrend(context.pastSessions, currentEmotionalState)
    const relevantSessions = this.findRelevantSessions(context.pastSessions, currentEmotionalState)

    return {
      sessionGoals: this.generateSessionGoals(visitNumber, currentEmotionalState, progressAnalysis),
      conversationTopics: this.generateConversationTopics(visitNumber, currentEmotionalState, relevantSessions),
      emotionalCheckQuestions: this.generateEmotionalQuestions(currentEmotionalState),
      carePoints: this.generateCarePoints(currentEmotionalState, progressAnalysis),
      recommendedActivities: this.getRecommendedActivities(currentEmotionalState),
      riskAssessment: this.assessRiskLevel(currentEmotionalState),
      urgencyLevel: this.assessUrgencyLevel(currentEmotionalState, progressAnalysis),
      progressNotes: progressAnalysis.improvements,
      precautions: this.generatePrecautions(currentEmotionalState),
      sessionStructure: this.generateSessionStructure(visitNumber),
      interventionStrategies: strategy.primaryFocus,
      homeworkAssignments: this.generateHomework(visitNumber, currentEmotionalState),
      nextSessionPrep: [`${visitNumber + 1}회차 준비: ${strategy.expectedOutcomes[0]}`],
    }
  }

  private assessRiskLevel(emotionalState: any): string {
    const totalScore =
      emotionalState.depression + emotionalState.anxiety + emotionalState.loneliness + emotionalState.anger
    if (totalScore >= 32) return "높음 - 즉시 개입 필요"
    if (totalScore >= 24) return "보통 - 주의 깊은 관찰 필요"
    return "낮음 - 정기적 모니터링"
  }

  private determinePriorities(emotionalState: any, checklist: string[]): string[] {
    const priorities = []

    if (emotionalState.depression >= 8) priorities.push("우울감 집중 관리")
    if (emotionalState.anxiety >= 8) priorities.push("불안감 완화 기법 적용")
    if (emotionalState.loneliness >= 8) priorities.push("사회적 연결 강화")
    if (emotionalState.anger >= 8) priorities.push("분노 조절 지원")

    if (priorities.length === 0) priorities.push("전반적 정서 안정화")

    return priorities
  }

  private getRecommendedActivities(emotionalState: any): string[] {
    const activities = []

    if (emotionalState.depression >= 6) activities.push("가벼운 산책", "일광욕")
    if (emotionalState.anxiety >= 6) activities.push("심호흡 연습", "명상")
    if (emotionalState.loneliness >= 6) activities.push("가족 통화", "이웃과 인사")
    if (emotionalState.anger >= 6) activities.push("감정 일기 쓰기", "음악 감상")

    activities.push("규칙적인 생활 패턴 유지")

    return activities
  }

  private generateSessionGoals(visitNumber: number, emotionalState: any, progressAnalysis: any): string[] {
    const goals = []

    if (visitNumber === 1) {
      goals.push("신뢰 관계 형성", "기본 정보 수집", "안전성 평가")
    } else if (visitNumber === 2) {
      goals.push("문제 영역 탐색", "목표 설정", "초기 개입 시작")
    } else {
      goals.push("진전 상황 점검", "기술 연습", "변화 유지 전략")
    }

    return goals
  }

  private generateConversationTopics(
    visitNumber: number,
    emotionalState: any,
    relevantSessions: CounselingRecord[],
  ): string[] {
    const topics = []

    if (emotionalState.depression >= 6) topics.push("최근 기분 변화", "즐거웠던 기억")
    if (emotionalState.anxiety >= 6) topics.push("걱정거리", "안전감을 주는 것들")
    if (emotionalState.loneliness >= 6) topics.push("가족과의 관계", "사회적 활동")

    topics.push("일상생활 패턴", "건강 상태")

    return topics
  }

  private generateEmotionalQuestions(emotionalState: any): string[] {
    return [
      "오늘 기분은 어떠신가요?",
      "지난 주와 비교해서 어떤 변화가 있으셨나요?",
      "가장 힘든 시간은 언제인가요?",
      "기분이 좋아지는 일이 있다면 무엇인가요?",
    ]
  }

  private generateCarePoints(emotionalState: any, progressAnalysis: any): string[] {
    const points = []

    if (emotionalState.depression >= 8) points.push("자살 사고 여부 확인")
    if (emotionalState.anxiety >= 8) points.push("공황 증상 모니터링")
    if (progressAnalysis.trajectory === "declining") points.push("악화 요인 파악")

    points.push("약물 복용 상태 확인", "수면 패턴 점검")

    return points
  }

  private generatePrecautions(emotionalState: any): string[] {
    const precautions = []

    if (emotionalState.depression >= 8) precautions.push("자해 위험 주의")
    if (emotionalState.anger >= 8) precautions.push("감정 폭발 가능성 주의")

    precautions.push("과도한 자극 피하기", "충분한 휴식 시간 확보")

    return precautions
  }

  private generateSessionStructure(visitNumber: number): string[] {
    if (visitNumber === 1) {
      return [
        "인사 및 소개 (5분)",
        "편안한 분위기 조성 (10분)",
        "기본 정보 수집 (20분)",
        "정서 상태 평가 (15분)",
        "다음 회기 안내 (10분)",
      ]
    } else {
      return [
        "안부 인사 및 근황 확인 (10분)",
        "지난 회기 이후 변화 탐색 (15분)",
        "주요 이슈 다루기 (25분)",
        "과제 점검 및 새 과제 제시 (10분)",
      ]
    }
  }

  private generateHomework(visitNumber: number, emotionalState: any): string[] {
    const homework = []

    if (visitNumber === 1) {
      homework.push("하루 한 번 기분 체크하기", "규칙적인 식사 시간 지키기")
    } else {
      if (emotionalState.depression >= 6) homework.push("매일 10분 산책하기")
      if (emotionalState.anxiety >= 6) homework.push("심호흡 연습 하루 3회")
      homework.push("감정 일기 작성하기")
    }

    return homework
  }

  private assessUrgencyLevel(emotionalState: any, progressAnalysis: any): string {
    const criticalScore = emotionalState.depression + emotionalState.anxiety

    if (criticalScore >= 18 || progressAnalysis.trajectory === "declining") return "높음"
    if (criticalScore >= 12) return "보통"
    return "낮음"
  }

  private findRelevantSessions(pastSessions: CounselingRecord[], currentState: any): CounselingRecord[] {
    return pastSessions
      .filter((session) => {
        const stateDiff =
          Math.abs(session.emotionalState.depression - currentState.depression) +
          Math.abs(session.emotionalState.anxiety - currentState.anxiety)
        return stateDiff <= 4
      })
      .slice(-2)
  }

  private analyzeProgressTrend(sessions: CounselingRecord[]) {
    if (sessions.length < 2) {
      return {
        overallProgress: "초기 단계로 진전 평가 불가",
        improvements: [],
        concerns: [],
        trajectory: "baseline",
      }
    }

    const first = sessions[0]
    const latest = sessions[sessions.length - 1]

    const depressionChange = first.emotionalState.depression - latest.emotionalState.depression
    const anxietyChange = first.emotionalState.anxiety - latest.emotionalState.anxiety
    const lonelinessChange = first.emotionalState.loneliness - latest.emotionalState.loneliness

    const improvements = []
    const concerns = []

    if (depressionChange > 1) improvements.push("우울감 현저한 개선")
    else if (depressionChange < -1) concerns.push("우울감 악화")

    if (anxietyChange > 1) improvements.push("불안감 현저한 완화")
    else if (anxietyChange < -1) concerns.push("불안감 증가")

    if (lonelinessChange > 1) improvements.push("외로움 현저한 감소")
    else if (lonelinessChange < -1) concerns.push("외로움 심화")

    const overallChange = depressionChange + anxietyChange + lonelinessChange
    let overallProgress = ""

    if (overallChange > 3) overallProgress = "전반적으로 뚜렷한 개선"
    else if (overallChange > 1) overallProgress = "전반적으로 점진적 개선"
    else if (overallChange > -1) overallProgress = "현상 유지"
    else if (overallChange > -3) overallProgress = "전반적으로 약간 악화"
    else overallProgress = "전반적으로 상당한 악화"

    return {
      overallProgress,
      improvements,
      concerns,
      trajectory: overallChange > 1 ? "improving" : overallChange < -1 ? "declining" : "stable",
    }
  }

  private analyzeEmotionalTrend(pastSessions: CounselingRecord[], currentState: any) {
    if (pastSessions.length === 0) {
      return {
        summary: "초기 평가 단계",
        patterns: [],
        recommendations: [],
      }
    }

    const trends = pastSessions.map((session) => ({
      date: session.date,
      depression: session.emotionalState.depression,
      anxiety: session.emotionalState.anxiety,
      loneliness: session.emotionalState.loneliness,
      mood: session.emotionalState.mood,
    }))

    trends.push({
      date: new Date().toISOString().split("T")[0],
      depression: currentState.depression,
      anxiety: currentState.anxiety,
      loneliness: currentState.loneliness,
      mood: currentState.mood,
    })

    const patterns = []
    const recommendations = []

    const depressionTrend = trends.map((t) => t.depression)
    if (this.isIncreasing(depressionTrend)) {
      patterns.push("우울감 증가 추세")
      recommendations.push("우울 증상 집중 관리 필요")
    } else if (this.isDecreasing(depressionTrend)) {
      patterns.push("우울감 개선 추세")
      recommendations.push("현재 접근법 유지 및 강화")
    }

    const anxietyTrend = trends.map((t) => t.anxiety)
    if (this.isIncreasing(anxietyTrend)) {
      patterns.push("불안감 증가 추세")
      recommendations.push("불안 관리 기법 강화 필요")
    } else if (this.isDecreasing(anxietyTrend)) {
      patterns.push("불안감 완화 추세")
      recommendations.push("불안 관리 기법 지속 적용")
    }

    const summary = patterns.length > 0 ? patterns.join(", ") : "안정적 감정 상태 유지"

    return { summary, patterns, recommendations }
  }

  private isIncreasing(values: number[]): boolean {
    if (values.length < 2) return false
    const recent = values.slice(-3)
    return recent.length >= 2 && recent[recent.length - 1] > recent[0]
  }

  private isDecreasing(values: number[]): boolean {
    if (values.length < 2) return false
    const recent = values.slice(-3)
    return recent.length >= 2 && recent[recent.length - 1] < recent[0]
  }

  async generateFollowUpGuide(context: RAGContext, currentEmotionalState: any, currentNotes: string) {
    return this.generateVisitSpecificGuide(context, currentEmotionalState, currentNotes)
  }
}

export { CounselingRAGSystem, type CounselingRecord, type RAGContext }
