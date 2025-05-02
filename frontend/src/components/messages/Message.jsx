import React, { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation'
import { extractTime } from '../../utils/extractTime.js'
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";

const Message = ({ message }) => {
    const { authUser } = useAuthContext()
    const { selectedConversation } = useConversation()

    const fromMe = message.senderId === authUser._id
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
    const formattedTime = extractTime(message.createdAt);

    const handleHeartClick = () => {
        console.log("heart clicked")
    }

    console.log(message)
    return (
        <div className=''>
            <div className={`chat ${chatClassName}`}>
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt='chat bubble component'
                            src={profilePic}
                        />
                    </div>
                </div>
                <div className={`chat-bubble text-white pb-2 ${bubbleBgColor}`}>{message.message}</div>
                <div className='chat-footer opacity-90 text-sm flex gap-1 items-center '>
                    <div className='flex justify-between items-center mt-1'>
                        <div className='mr-3'>{formattedTime}</div>
                        <div className=''>
                            {message?.isLike ? (
                                <IoIosHeart
                                    className="text-xl cursor-pointer"
                                />
                            ) : (
                                <IoIosHeartEmpty
                                    className="text-xl cursor-pointer"
                                    onClick={handleHeartClick}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message
