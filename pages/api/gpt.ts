import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { prompt, max_tokens = 500, temperature = 0.7 } = req.body

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

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
            content: '당신은 노인 상담 전문가입니다. 한국어로 자연스럽고 따뜻하게 응답해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens,
        temperature,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패')
    }

    const data = await response.json()
    
    return res.status(200).json(data)
  } catch (error) {
    console.error('GPT API 오류:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
