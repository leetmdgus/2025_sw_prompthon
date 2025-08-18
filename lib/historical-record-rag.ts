process.env.LANGCHAIN_TRACING_V2 = "false"
process.env.LANGCHAIN_API_KEY = ""

import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { OpenAIEmbeddings } from "@langchain/openai"
import { Document } from "@langchain/core/documents"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"

interface HistoricalCounselingRecord {
  id: number
  clientId: number
  clientName: string
  sessionNumber: number
  date: string
  duration: number
  emotionalState: {
    depression: number
    anxiety: number
    loneliness: number
    anger: number
    mood: string
  }
  interventions: string[]
  outcomes: string[]
  techniques: string[]
  challenges: string[]
  breakthroughs: string[]
  specialNotes: string
  summary: string
  followUpActions: string[]
  riskLevel: "low" | "medium" | "high"
  effectiveness: number // 1-10 scale
}

interface SearchFilters {
  emotionalStateRange?: {
    depression?: [number, number]
    anxiety?: [number, number]
    loneliness?: [number, number]
    anger?: [number, number]
  }
  interventions?: string[]
  outcomes?: string[]
  riskLevel?: ("low" | "medium" | "high")[]
  effectivenessRange?: [number, number]
  dateRange?: [string, string]
  sessionNumberRange?: [number, number]
}

interface SimilarCase {
  record: HistoricalCounselingRecord
  similarity: number
  matchingFactors: string[]
  relevantInsights: string[]
}

interface PatternAnalysis {
  commonPatterns: string[]
  successfulInterventions: string[]
  riskFactors: string[]
  predictiveInsights: string[]
  recommendations: string[]
}

class HistoricalRecordRAGSystem {
  private vectorStore: MemoryVectorStore | null = null
  private embeddings: OpenAIEmbeddings
  private llm: ChatOpenAI
  private records: HistoricalCounselingRecord[] = []
  private indexedDimensions: Map<string, MemoryVectorStore> = new Map()

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      configuration: {
        baseOptions: {
          headers: {
            "User-Agent": "labchain-counseling-app",
          },
        },
      },
    })

    this.llm = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.2,
      configuration: {
        baseOptions: {
          headers: {
            "User-Agent": "labchain-counseling-app",
          },
        },
      },
    })
  }

  async initializeHistoricalRecords(records: HistoricalCounselingRecord[]) {
    this.records = records

    // Create main vector store with comprehensive content
    const mainDocuments = records.map((record) => {
      const content = this.createComprehensiveContent(record)
      return new Document({
        pageContent: content,
        metadata: {
          id: record.id,
          clientId: record.clientId,
          sessionNumber: record.sessionNumber,
          date: record.date,
          emotionalState: record.emotionalState,
          riskLevel: record.riskLevel,
          effectiveness: record.effectiveness,
        },
      })
    })

    this.vectorStore = await MemoryVectorStore.fromDocuments(mainDocuments, this.embeddings)

    // Create specialized vector stores for different dimensions
    await this.createDimensionalIndexes(records)
  }

  private createComprehensiveContent(record: HistoricalCounselingRecord): string {
    return `
      클라이언트: ${record.clientName}
      회기: ${record.sessionNumber}회차
      날짜: ${record.date}
      지속시간: ${record.duration}분
      
      감정 상태:
      - 우울: ${record.emotionalState.depression}/10
      - 불안: ${record.emotionalState.anxiety}/10
      - 외로움: ${record.emotionalState.loneliness}/10
      - 분노: ${record.emotionalState.anger}/10
      - 전반적 기분: ${record.emotionalState.mood}
      
      적용된 개입:
      ${record.interventions.join(", ")}
      
      사용된 기법:
      ${record.techniques.join(", ")}
      
      성과 및 결과:
      ${record.outcomes.join(", ")}
      
      도전 과제:
      ${record.challenges.join(", ")}
      
      돌파구/성과:
      ${record.breakthroughs.join(", ")}
      
      특이사항: ${record.specialNotes}
      
      세션 요약: ${record.summary}
      
      후속 조치: ${record.followUpActions.join(", ")}
      
      위험도: ${record.riskLevel}
      효과성: ${record.effectiveness}/10
    `.trim()
  }

  private async createDimensionalIndexes(records: HistoricalCounselingRecord[]) {
    // Emotional state focused index
    const emotionalDocs = records.map((record) => {
      const content = `
        감정 프로필: 우울 ${record.emotionalState.depression}, 불안 ${record.emotionalState.anxiety}, 외로움 ${record.emotionalState.loneliness}, 분노 ${record.emotionalState.anger}
        기분: ${record.emotionalState.mood}
        적용 개입: ${record.interventions.join(", ")}
        결과: ${record.outcomes.join(", ")}
        효과성: ${record.effectiveness}/10
      `
      return new Document({
        pageContent: content,
        metadata: { id: record.id, type: "emotional" },
      })
    })
    this.indexedDimensions.set("emotional", await MemoryVectorStore.fromDocuments(emotionalDocs, this.embeddings))

    // Intervention focused index
    const interventionDocs = records.map((record) => {
      const content = `
        개입 전략: ${record.interventions.join(", ")}
        사용 기법: ${record.techniques.join(", ")}
        대상 문제: ${record.challenges.join(", ")}
        달성 성과: ${record.outcomes.join(", ")}
        돌파구: ${record.breakthroughs.join(", ")}
        효과성: ${record.effectiveness}/10
      `
      return new Document({
        pageContent: content,
        metadata: { id: record.id, type: "intervention" },
      })
    })
    this.indexedDimensions.set("intervention", await MemoryVectorStore.fromDocuments(interventionDocs, this.embeddings))

    // Outcome focused index
    const outcomeDocs = records.map((record) => {
      const content = `
        달성 결과: ${record.outcomes.join(", ")}
        성공 요인: ${record.breakthroughs.join(", ")}
        극복 과제: ${record.challenges.join(", ")}
        위험도 변화: ${record.riskLevel}
        전체 효과성: ${record.effectiveness}/10
        후속 계획: ${record.followUpActions.join(", ")}
      `
      return new Document({
        pageContent: content,
        metadata: { id: record.id, type: "outcome" },
      })
    })
    this.indexedDimensions.set("outcome", await MemoryVectorStore.fromDocuments(outcomeDocs, this.embeddings))
  }

  async findSimilarCases(
    currentCase: {
      emotionalState: any
      challenges: string[]
      interventions?: string[]
      clientProfile?: string
    },
    limit = 5,
    filters?: SearchFilters,
  ): Promise<SimilarCase[]> {
    if (!this.vectorStore) {
      throw new Error("Historical records not initialized")
    }

    // Create search query based on current case
    const searchQuery = `
      감정 상태: 우울 ${currentCase.emotionalState.depression}, 불안 ${currentCase.emotionalState.anxiety}, 외로움 ${currentCase.emotionalState.loneliness}
      기분: ${currentCase.emotionalState.mood}
      주요 과제: ${currentCase.challenges.join(", ")}
      ${currentCase.interventions ? `시도된 개입: ${currentCase.interventions.join(", ")}` : ""}
      ${currentCase.clientProfile ? `클라이언트 특성: ${currentCase.clientProfile}` : ""}
    `

    // Perform similarity search
    const similarDocs = await this.vectorStore.similaritySearchWithScore(searchQuery, limit * 2)

    // Filter and rank results
    const filteredResults = similarDocs
      .filter(([doc, score]) => this.matchesFilters(doc.metadata, filters))
      .slice(0, limit)

    // Convert to SimilarCase objects with detailed analysis
    const similarCases: SimilarCase[] = []

    for (const [doc, similarity] of filteredResults) {
      const record = this.records.find((r) => r.id === doc.metadata.id)
      if (record) {
        const matchingFactors = this.analyzeMatchingFactors(currentCase, record)
        const relevantInsights = await this.extractRelevantInsights(currentCase, record)

        similarCases.push({
          record,
          similarity: 1 - similarity, // Convert distance to similarity
          matchingFactors,
          relevantInsights,
        })
      }
    }

    return similarCases.sort((a, b) => b.similarity - a.similarity)
  }

  async searchByDimension(
    dimension: "emotional" | "intervention" | "outcome",
    query: string,
    limit = 10,
  ): Promise<HistoricalCounselingRecord[]> {
    const dimensionStore = this.indexedDimensions.get(dimension)
    if (!dimensionStore) {
      throw new Error(`Dimension ${dimension} not indexed`)
    }

    const results = await dimensionStore.similaritySearch(query, limit)
    return results
      .map((doc) => this.records.find((r) => r.id === doc.metadata.id))
      .filter((record) => record !== undefined) as HistoricalCounselingRecord[]
  }

  async analyzePatterns(
    focusArea: "interventions" | "outcomes" | "emotional_trends" | "risk_factors",
    timeRange?: [string, string],
  ): Promise<PatternAnalysis> {
    let relevantRecords = this.records

    if (timeRange) {
      relevantRecords = this.records.filter((record) => record.date >= timeRange[0] && record.date <= timeRange[1])
    }

    const analysisPrompt = PromptTemplate.fromTemplate(`
      당신은 상담 기록 분석 전문가입니다. 다음 상담 기록들을 분석하여 {focusArea}에 대한 패턴을 찾아주세요.

      분석할 기록들:
      {records}

      다음 형식으로 분석 결과를 제공해주세요:

      1. 공통 패턴:
      - [패턴 1]
      - [패턴 2]
      - [패턴 3]

      2. 성공적인 개입:
      - [개입 1]: [성공 사례와 이유]
      - [개입 2]: [성공 사례와 이유]
      - [개입 3]: [성공 사례와 이유]

      3. 위험 요소:
      - [위험 요소 1]: [발생 빈도와 영향]
      - [위험 요소 2]: [발생 빈도와 영향]
      - [위험 요소 3]: [발생 빈도와 영향]

      4. 예측적 통찰:
      - [통찰 1]
      - [통찰 2]
      - [통찰 3]

      5. 권장사항:
      - [권장사항 1]
      - [권장사항 2]
      - [권장사항 3]
    `)

    const recordsText = relevantRecords.map((record) => this.createComprehensiveContent(record)).join("\n\n---\n\n")

    const chain = RunnableSequence.from([analysisPrompt, this.llm, new StringOutputParser()])

    const result = await chain.invoke({
      focusArea: this.translateFocusArea(focusArea),
      records: recordsText,
    })

    return this.parsePatternAnalysis(result)
  }

  async generateInsightsForCase(currentCase: {
    emotionalState: any
    challenges: string[]
    sessionNumber: number
    clientProfile?: string
  }): Promise<{
    historicalInsights: string[]
    recommendedInterventions: string[]
    riskPredictions: string[]
    successProbability: number
  }> {
    // Find similar cases
    const similarCases = await this.findSimilarCases(currentCase, 5)

    // Analyze patterns from similar cases
    const insightPrompt = PromptTemplate.fromTemplate(`
      당신은 상담 전문가입니다. 현재 사례와 유사한 과거 사례들을 분석하여 통찰과 권장사항을 제공해주세요.

      현재 사례:
      - 회기: {sessionNumber}회차
      - 감정 상태: 우울 {depression}, 불안 {anxiety}, 외로움 {loneliness}
      - 주요 과제: {challenges}
      {clientProfile}

      유사한 과거 사례들:
      {similarCases}

      다음 형식으로 분석해주세요:

      1. 역사적 통찰:
      - [통찰 1]
      - [통찰 2]
      - [통찰 3]

      2. 추천 개입:
      - [개입 1]: [근거와 기대 효과]
      - [개입 2]: [근거와 기대 효과]
      - [개입 3]: [근거와 기대 효과]

      3. 위험 예측:
      - [위험 1]: [발생 가능성과 대응 방안]
      - [위험 2]: [발생 가능성과 대응 방안]

      4. 성공 확률: [1-10 점수와 근거]
    `)

    const similarCasesText = similarCases
      .map(
        (sc) => `
        유사도: ${(sc.similarity * 100).toFixed(1)}%
        매칭 요소: ${sc.matchingFactors.join(", ")}
        ${this.createComprehensiveContent(sc.record)}
        관련 통찰: ${sc.relevantInsights.join(", ")}
      `,
      )
      .join("\n\n---\n\n")

    const chain = RunnableSequence.from([insightPrompt, this.llm, new StringOutputParser()])

    const result = await chain.invoke({
      sessionNumber: currentCase.sessionNumber,
      depression: currentCase.emotionalState.depression,
      anxiety: currentCase.emotionalState.anxiety,
      loneliness: currentCase.emotionalState.loneliness,
      challenges: currentCase.challenges.join(", "),
      clientProfile: currentCase.clientProfile ? `클라이언트 특성: ${currentCase.clientProfile}` : "",
      similarCases: similarCasesText,
    })

    return this.parseInsightAnalysis(result)
  }

  private matchesFilters(metadata: any, filters?: SearchFilters): boolean {
    if (!filters) return true

    const record = this.records.find((r) => r.id === metadata.id)
    if (!record) return false

    // Check emotional state ranges
    if (filters.emotionalStateRange) {
      const { depression, anxiety, loneliness, anger } = filters.emotionalStateRange
      if (
        depression &&
        (record.emotionalState.depression < depression[0] || record.emotionalState.depression > depression[1])
      )
        return false
      if (anxiety && (record.emotionalState.anxiety < anxiety[0] || record.emotionalState.anxiety > anxiety[1]))
        return false
      if (
        loneliness &&
        (record.emotionalState.loneliness < loneliness[0] || record.emotionalState.loneliness > loneliness[1])
      )
        return false
      if (anger && (record.emotionalState.anger < anger[0] || record.emotionalState.anger > anger[1])) return false
    }

    // Check other filters
    if (filters.riskLevel && !filters.riskLevel.includes(record.riskLevel)) return false
    if (
      filters.effectivenessRange &&
      (record.effectiveness < filters.effectivenessRange[0] || record.effectiveness > filters.effectivenessRange[1])
    )
      return false
    if (filters.dateRange && (record.date < filters.dateRange[0] || record.date > filters.dateRange[1])) return false
    if (
      filters.sessionNumberRange &&
      (record.sessionNumber < filters.sessionNumberRange[0] || record.sessionNumber > filters.sessionNumberRange[1])
    )
      return false

    return true
  }

  private analyzeMatchingFactors(currentCase: any, record: HistoricalCounselingRecord): string[] {
    const factors = []

    // Emotional state similarity
    const emotionalDiff =
      Math.abs(currentCase.emotionalState.depression - record.emotionalState.depression) +
      Math.abs(currentCase.emotionalState.anxiety - record.emotionalState.anxiety) +
      Math.abs(currentCase.emotionalState.loneliness - record.emotionalState.loneliness)

    if (emotionalDiff < 6) factors.push("유사한 감정 상태")
    if (currentCase.emotionalState.mood === record.emotionalState.mood) factors.push("동일한 기분 상태")

    // Challenge similarity
    const commonChallenges = currentCase.challenges.filter((challenge: string) =>
      record.challenges.some(
        (rc) =>
          rc.toLowerCase().includes(challenge.toLowerCase()) || challenge.toLowerCase().includes(rc.toLowerCase()),
      ),
    )
    if (commonChallenges.length > 0) factors.push(`공통 과제: ${commonChallenges.join(", ")}`)

    // Risk level
    if (record.riskLevel === "high") factors.push("고위험 사례")
    if (record.effectiveness >= 8) factors.push("높은 효과성")

    return factors
  }

  private async extractRelevantInsights(currentCase: any, record: HistoricalCounselingRecord): Promise<string[]> {
    const insights = []

    // Add insights based on successful outcomes
    if (record.effectiveness >= 7) {
      insights.push(`효과적인 개입: ${record.interventions.slice(0, 2).join(", ")}`)
    }

    // Add insights from breakthroughs
    if (record.breakthroughs.length > 0) {
      insights.push(`성공 요인: ${record.breakthroughs[0]}`)
    }

    // Add risk management insights
    if (record.riskLevel === "high" && record.effectiveness >= 6) {
      insights.push("고위험 상황에서의 효과적 관리 사례")
    }

    return insights
  }

  private translateFocusArea(focusArea: string): string {
    const translations = {
      interventions: "개입 전략",
      outcomes: "치료 결과",
      emotional_trends: "감정 변화 추이",
      risk_factors: "위험 요소",
    }
    return translations[focusArea as keyof typeof translations] || focusArea
  }

  private parsePatternAnalysis(result: string): PatternAnalysis {
    return {
      commonPatterns: this.extractListItems(result, "공통 패턴"),
      successfulInterventions: this.extractListItems(result, "성공적인 개입"),
      riskFactors: this.extractListItems(result, "위험 요소"),
      predictiveInsights: this.extractListItems(result, "예측적 통찰"),
      recommendations: this.extractListItems(result, "권장사항"),
    }
  }

  private parseInsightAnalysis(result: string): {
    historicalInsights: string[]
    recommendedInterventions: string[]
    riskPredictions: string[]
    successProbability: number
  } {
    return {
      historicalInsights: this.extractListItems(result, "역사적 통찰"),
      recommendedInterventions: this.extractListItems(result, "추천 개입"),
      riskPredictions: this.extractListItems(result, "위험 예측"),
      successProbability: this.extractSuccessProbability(result),
    }
  }

  private extractListItems(text: string, section: string): string[] {
    const lines = text.split("\n")
    const sectionIndex = lines.findIndex((line) => line.includes(section))
    if (sectionIndex === -1) return []

    const items = []
    for (let i = sectionIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
        items.push(line.replace(/^[-*•]\s/, "").replace(/^\d+\.\s/, ""))
      } else if (line && !line.includes(":") && items.length > 0) {
        break
      }
    }
    return items
  }

  private extractSuccessProbability(text: string): number {
    const match = text.match(/성공 확률[:\s]*(\d+)/i)
    return match ? Number.parseInt(match[1]) : 5
  }
}

export {
  HistoricalRecordRAGSystem,
  type HistoricalCounselingRecord,
  type SearchFilters,
  type SimilarCase,
  type PatternAnalysis,
}
