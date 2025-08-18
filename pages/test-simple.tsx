export default function TestSimple() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 간단한 테스트 페이지</h1>
      <p>이 페이지가 제대로 로드되면 기본 렌더링은 정상입니다.</p>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>테스트 항목:</h3>
        <ul>
          <li>✅ 페이지 로딩</li>
          <li>✅ 기본 스타일</li>
          <li>✅ 한글 텍스트</li>
          <li>✅ 이모지 표시</li>
        </ul>
      </div>
      
      <button 
        onClick={() => alert('버튼 클릭 테스트 성공!')}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        클릭 테스트
      </button>
      
      <button 
        onClick={() => {
          localStorage.clear()
          alert('로컬 스토리지가 초기화되었습니다!')
        }}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        캐시 초기화
      </button>
      
      <p style={{ marginTop: '20px', color: '#666' }}>
        현재 시간: {new Date().toLocaleString()}
      </p>
    </div>
  )
}
