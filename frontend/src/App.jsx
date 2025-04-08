import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="
         flex flex-col gap-5 items-center 
         mx-auto  rounded-2xl
         bg-gray-400 p-5
        ">
        <div className="
            rounded-2xl
            text-5xl bg-amber-200
            p-10 mt-5
          ">
          Hello from chat app with socket.io
        </div>
        <div className='flex flex-col gap-7 mt-5'>
          <div className="text-2xl font-light">Daisy UI</div>
          <div className='flex justify-center gap-7'>
            <button className="btn">Button</button>
            <button className="btn btn-primary">Button</button>
            <button className="btn btn-secondary">Button</button>
            <button className="btn btn-accent">Button</button>
            <button className="btn btn-link">Button</button>
          </div>
          <div className='mb-5'>
            <div className="card bg-base-100 w-96 shadow-sm">
              <figure>
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="Shoes" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Card Title</h2>
                <p>A card component has a figure, a body part</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
