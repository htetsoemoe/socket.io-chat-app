import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation'

const Message = () => {
    const { authUser } = useAuthContext()
    const { selectedConversation } = useConversation()

    const fromMe = authUser._id
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "";

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img
                        alt='chat bubble component'
                        src={profilePic}
                    />
                </div>
            </div>
            <div className={`chat-bubble text-white pb-2 ${bubbleBgColor}`}>Hello World!</div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>04-27-2025</div>
        </div>
    )
}

export default Message
