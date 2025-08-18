export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 간단한 테스트 응답
    return res.status(200).json({ 
      message: 'API 테스트 성공',
      timestamp: new Date().toISOString(),
      status: 'working'
    })
  } catch (error) {
    console.error('테스트 API 오류:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
