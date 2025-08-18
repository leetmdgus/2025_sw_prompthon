export default async function handler(req, res) {
  console.log('Simple test API 호출됨:', req.method, req.url)
  
  try {
    // 간단한 응답
    return res.status(200).json({ 
      message: 'Simple test API 성공!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    })
  } catch (error) {
    console.error('Simple test API 오류:', error)
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    })
  }
}
