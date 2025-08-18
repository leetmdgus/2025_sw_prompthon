import { NextApiRequest, NextApiResponse } from 'next'

interface CounselingRecord {
  id: string
  date: string
  type: string
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

interface ClientInfo {
  name: string
  age: number
  emotionalState: {
    current: string
    trend: string
    summary: string
  }
}

interface QuestionGenerationRequest {
  clientInfo: ClientInfo
  counselingRecords: CounselingRecord[]
  stepNumber: number
  currentEmotionalScores: {
    depression: number
    anxiety: number
    loneliness: number
    anger: number
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { clientInfo, counselingRecords, stepNumber, currentEmotionalScores }: QuestionGenerationRequest = req.body

    if (!clientInfo || !counselingRecords || !stepNumber) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // 상담 기록을 회차별로 정렬 (최신순)
    const sortedRecords = counselingRecords.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // 회차별 가중치 계산 (최신 회차에 더 높은 가중치)
    const weightedAnalysis = sortedRecords.map((record, index) => {
      const weight = Math.pow(0.8, index) // 최신 회차일수록 높은 가중치
      const sessionNumber = sortedRecords.length - index
      
      return {
        sessionNumber,
        weight,
        record
      }
    })

    // 감정 점수 트렌드 분석
    const emotionalTrends = analyzeEmotionalTrends(sortedRecords)
    
    // 주요 키워드 및 주제 추출
    const keyTopics = extractKeyTopics(sortedRecords)
    
    // GPT API 프롬프트 구성
    const prompt = generatePrompt(
      clientInfo, 
      weightedAnalysis, 
      stepNumber, 
      currentEmotionalScores, 
      emotionalTrends, 
      keyTopics
    )

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '당신은 노인 상담 전문가입니다. 상담 기록을 분석하여 개인화된 질문을 생성해주세요. 한국어로 자연스럽고 따뜻하게 응답해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패')
    }

    const data = await response.json()
    
    return res.status(200).json({
      questions: parseQuestions(data.choices[0].message.content),
      analysis: {
        emotionalTrends,
        keyTopics,
        weightedAnalysis: weightedAnalysis.slice(0, 3) // 상위 3개만 반환
      }
    })
  } catch (error) {
    console.error('상담 질문 생성 오류:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// 감정 점수 트렌드 분석
function analyzeEmotionalTrends(records: CounselingRecord[]) {
  const trends = {
    depression: [] as number[],
    anxiety: [] as number[],
    loneliness: [] as number[],
    anger: [] as number[]
  }

  records.forEach(record => {
    trends.depression.push(record.emotionalScores.depression)
    trends.anxiety.push(record.emotionalScores.anxiety)
    trends.loneliness.push(record.emotionalScores.loneliness)
    trends.anger.push(record.emotionalScores.anger)
  })

  return {
    depression: calculateTrend(trends.depression),
    anxiety: calculateTrend(trends.anxiety),
    loneliness: calculateTrend(trends.loneliness),
    anger: calculateTrend(trends.anger)
  }
}

// 트렌드 계산 (개선/악화/유지)
function calculateTrend(scores: number[]): string {
  if (scores.length < 2) return '유지'
  
  const recent = scores.slice(0, 2).reduce((a, b) => a + b, 0) / 2
  const older = scores.slice(-2).reduce((a, b) => a + b, 0) / 2
  
  if (recent < older - 1) return '개선'
  if (recent > older + 1) return '악화'
  return '유지'
}

// 주요 키워드 및 주제 추출
function extractKeyTopics(records: CounselingRecord[]) {
  const topics = new Map<string, number>()
  
  records.forEach((record, index) => {
    const weight = Math.pow(0.8, index)
    const text = record.notes.toLowerCase()
    
    // 주요 키워드 검색
    const keywords = [
      '가족', '손자', '아들', '이웃', '산책', '외로움', '추억', '사진',
      '호흡', '운동', '음악', 'TV', '화분', '마트', '공원', '놀이'
    ]
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        topics.set(keyword, (topics.get(keyword) || 0) + weight)
      }
    })
  })
  
  // 가중치 순으로 정렬하여 상위 5개 반환
  return Array.from(topics.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic)
}

// GPT 프롬프트 생성
function generatePrompt(
  clientInfo: ClientInfo,
  weightedAnalysis: any[],
  stepNumber: number,
  currentEmotionalScores: any,
  emotionalTrends: any,
  keyTopics: string[]
) {
  const stepNames = {
    1: "기본적인 체크리스트",
    2: "기존 상담 데이터 바탕으로 주제 선정",
    3: "감정 표현 유도",
    4: "대처 전략 제안",
    5: "가족 연계"
  }

  const stepDescriptions = {
    1: "기본적인 일상 체크 (기분, 잠, 식사, 건강, 계획)",
    2: "이전 상담 기록을 바탕으로 한 맞춤형 주제 선정",
    3: "감정을 표현하고 인식할 수 있도록 유도",
    4: "구체적이고 실용적인 대처 전략 제안",
    5: "가족과의 관계 및 소통 개선"
  }

  let prompt = `당신은 노인 상담 전문가입니다. 다음 상담 단계에 맞는 구체적이고 개인화된 질문 4개를 생성해주세요.

상담 단계: ${stepNames[stepNumber as keyof typeof stepNames]}
단계 설명: ${stepDescriptions[stepNumber as keyof typeof stepDescriptions]}

클라이언트 정보:
- 이름: ${clientInfo.name} 어르신
- 나이: ${clientInfo.age}세
- 현재 정서 상태: ${clientInfo.emotionalState.current}
- 정서 변화 추이: ${clientInfo.emotionalState.trend}

현재 감정 점수:
- 우울: ${currentEmotionalScores.depression}/10
- 불안: ${currentEmotionalScores.anxiety}/10
- 외로움: ${currentEmotionalScores.loneliness}/10
- 분노: ${currentEmotionalScores.anger}/10

감정 점수 트렌드 (최근 5회차):
- 우울: ${emotionalTrends.depression}
- 불안: ${emotionalTrends.anxiety}
- 외로움: ${emotionalTrends.loneliness}
- 분노: ${emotionalTrends.anger}

주요 관심 주제 (가중치 순): ${keyTopics.join(', ')}

상담 기록 분석 (최신 회차에 높은 가중치):`

  weightedAnalysis.slice(0, 3).forEach(({ sessionNumber, weight, record }) => {
    prompt += `\n\n${sessionNumber}회차 상담 (가중치: ${weight.toFixed(2)}):
- 날짜: ${record.date}
- 감정 점수: 우울(${record.emotionalScores.depression}) 불안(${record.emotionalScores.anxiety}) 외로움(${record.emotionalScores.loneliness}) 분노(${record.emotionalScores.anger})
- 주요 내용: ${record.notes.substring(0, 200)}...`
  })

  prompt += `

요구사항:
1. 이전 상담 기록을 참고하여 개인화된 질문 생성
2. 최신 회차의 내용에 더 많은 가중치를 두어 질문 구성
3. 각 질문은 구체적이고 실용적이어야 함
4. 감정 상태와 개인 상황을 고려한 질문
5. 한국어로 자연스럽게 작성
6. 각 질문은 별도 줄로 구분

생성된 질문들:`

  return prompt
}

// GPT 응답을 질문 배열로 파싱
function parseQuestions(response: string): string[] {
  const lines = response.split('\n').filter(line => line.trim().length > 0)
  const questions: string[] = []
  
  lines.forEach(line => {
    // 번호나 불릿 포인트 제거
    const cleanLine = line.replace(/^[\d•\-\.\s]+/, '').trim()
    if (cleanLine.length > 10 && cleanLine.includes('?')) {
      questions.push(cleanLine)
    }
  })
  
  // 최대 4개 질문 반환
  return questions.slice(0, 4)
}
