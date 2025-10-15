import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-page text-text-primary text-2xl font-bold gap-8 p-8">
      <h1>Tailwind + Vite + React + TypeScript ✅</h1>

      {/* 버튼 */}
      <button className="bg-primary text-white hover:bg-primary-light rounded-lg px-4 py-2">
        로그인
      </button>

      {/* 카드 */}
      <div className="bg-bg-card text-text-primary shadow-base p-4 rounded-xl">
        카드 콘텐츠
      </div>

      {/* 경고 메시지 */}
      <div className="bg-warning text-white px-3 py-2 rounded">
        결제 기한이 곧 만료됩니다.
      </div>
    </div>
  )
}

export default App