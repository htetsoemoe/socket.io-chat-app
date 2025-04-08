import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="
         flex items-center justify-center 
         mx-auto h-[100vh] rounded-2xl
         bg-gray-500
    ">
      <div className="
        rounded-2xl
        text-5xl bg-amber-200
        p-10
      ">
        Hello from chat app with socket.io
      </div>
    </div>
  )
}

export default App
