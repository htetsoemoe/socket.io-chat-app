import React from 'react'
import useConversation from '../../zustand/useConversation'
import { useSocketContext } from '../../context/SocketContext'

const Conversation = ({ conversation, lastIdx, emoji }) => {
    const { setSelectedConversation, selectedConversation } = useConversation()

    // decide if the conversation is selected or not
    const isSelected = selectedConversation?._id === conversation._id

    // we need socket.io for user online status
    const { onlineUsers } = useSocketContext()
    const isOnline = onlineUsers.includes(conversation._id) // check if the user is online or not with the help of socket.io

    return (
        <>
            <div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
                ${isSelected ? "bg-sky-500" : ""}
            `}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
                    <div className='w-12 rounded-full'>
                        <img
                            src={conversation.profilePic}
                            alt='user profile'
                        />
                    </div>
                </div>

                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p className='font-bold text-gray-200'>{conversation.name}</p>
                        <span className='text-xl'>{emoji}</span>
                    </div>
                </div>
            </div>

            {!lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
    )
}

export default Conversation
