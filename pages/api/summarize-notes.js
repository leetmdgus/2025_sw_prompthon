export default async function handler(req, res) {
  console.log('API 호출됨:', req.method, req.url)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { notes, clientName, sessionNumber, date } = req.body
    console.log('요청 데이터:', { clientName, sessionNumber, date, notesLength: notes?.length })

    if (!notes) {
      return res.status(400).json({ message: 'Notes are required' })
    }

    // GPT API 프롬프트 구성
    const prompt = `당신은 노인 상담 전문가입니다. 다음 상담 기록을 분석하여 100줄로 요약해주세요.

상담 정보:
- 클라이언트: ${clientName} 어르신
- ${sessionNumber}회차 상담
- 날짜: ${date}

상담 기록:
${notes}

요구사항:
1. 핵심 내용을 100줄로 요약
2. 감정 상태, 주요 이슈, 대화 내용, 개선점 등을 포함
3. 구조화된 형태로 정리 (제목, 소제목, 내용)
4. 한국어로 자연스럽게 작성
5. 각 줄은 의미있는 단위로 구분

100줄 요약:`

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
            content: '당신은 노인 상담 전문가입니다. 상담 기록을 분석하여 구조화된 100줄 요약을 생성해주세요. 한국어로 자연스럽고 전문적으로 응답해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패')
    }

    const data = await response.json()
    const summary = data.choices[0].message.content
    
    return res.status(200).json({
      summary: summary,
      lineCount: summary.split('\n').filter(line => line.trim().length > 0).length
    })
  } catch (error) {
    console.error('상담 기록 요약 오류:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
