import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation'
import { extractTime } from '../../utils/extractTime.js'
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { useSocketContext } from "../../context/SocketContext.jsx"

const Message = ({ message }) => {
    const { authUser } = useAuthContext()
    const { selectedConversation } = useConversation()

    const { socket } = useSocketContext()

    const fromMe = message.senderId === authUser._id
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
    const formattedTime = extractTime(message.createdAt);
    const [isLikedTrue, setIsLikeTrue] = useState(message.isLike);

    useEffect(() => {
        socket.on("receiveLoveReaction", ({ isLike, senderId, receiverId, msgId, }) => {
            console.log(`receiveLoveReaction: ${isLike}, ${senderId}, ${receiverId}, ${msgId}`);
            if (msgId === message._id) {
                setIsLikeTrue(isLike);
            }
        });

        // clean up the event listener when the component unmounts
        return () => socket.off("receiveLoveReaction");
    }, []);

    const handleHeartClick = async () => {
        console.log(`heart clicked: ${message._id}, ${message.senderId}, ${message.receiverId}, ${message.isLike} `);

        const res = await fetch(`http://localhost:3500/api/v1/noti/msgId/${message._id}`, {
            method: "PUT",
            credentials: "include",// <-- This is crucial for sending cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                isLike: message?.isLike === true ? false : true,
                senderId: message.senderId,
                receiverId: message.receiverId,
            }),
        });

        const data = await res.json();
        console.log(data);
        setIsLikeTrue(data.data.isLike);

        socket.emit("loveReaction", {
            messageId: message._id,
            isLike: data.data.isLike,
            senderId: message.senderId,
            receiverId: message.receiverId,
        })
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
                            {isLikedTrue ? (
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
