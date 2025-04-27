import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import MessageContainer from '../../components/messages/MessageContainer'

const Home = () => {
  return (
    <div className='flex sm:h-[450px] md:h-[600px] backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg'>
      <Sidebar />
      <MessageContainer />
    </div>
  )
}

export default Home
