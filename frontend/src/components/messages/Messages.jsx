import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import MessageSkeleton from '../skeletons/MessageSkeleton'
import useGetMessages from '../../hooks/useGetMessages'
import useListenMessages from '../../hooks/useListenMessages'
import { useSocketContext } from "../../context/SocketContext.jsx"
import useConversation from "../../zustand/useConversation.js"
import notificationSound from "../../assets/sounds/notification.mp3";

const Messages = () => {
    const { socket } = useSocketContext()
    const { messages: initialMessages, loading } = useGetMessages()
    const [messages, setMessages] = useState([])
    const lastMessageRef = useRef()
    useListenMessages()

    const { selectedConversation } = useConversation()
    // console.log(`selectedConversation: ${JSON.stringify(selectedConversation)}`)

    // Set initial messages from useGetMessages
    useEffect(() => {
       if (!loading) {
            setMessages(initialMessages)
        }
    }, [initialMessages, loading])

    useEffect(() => {
        // Listen for deleteMessage event from socket
        const handleDeleteMessage = (msgId) => {
            console.log(`msgId: ${msgId}`)
            setMessages((prevMessages) =>
                prevMessages.filter((message) => message._id !== msgId)
            )
        }
        socket.on("deleteMessage", handleDeleteMessage)

        // Listen for updateMessage event from socket
        const getAllMessages = async () => {
            const response = await fetch(`http://localhost:3500/api/v1/messages/userId/${selectedConversation?._id}`, {
                method: "GET",
                credentials: "include",// <-- This is crucial for sending cookies
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            setMessages(data.data)
        }
        socket.on("updateMessage", () => {
            getAllMessages();
            const sound = new Audio(notificationSound);
            sound.play();
        }); // When a message is updated, get all messages again

        return () => {
            socket.off("deleteMessage", handleDeleteMessage);
            socket.off("updateMessage", getAllMessages);
        }
    }, [socket])
    // console.log(messages)

    // Scroll to the last message when new messages are added
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }, [messages]) 

    return (
        <div className='px-4 py-5 flex-1 overflow-auto'> {/* py-5 for messages  */}
            {loading && [...Array(3)].map((_, idx) => (
                <MessageSkeleton key={idx} />
            ))}
            {!loading &&
                messages.length > 0 &&
                messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef}>
                        <Message message={message} />
                    </div>
                ))
            }
            {!loading && messages.length === 0 && (
                <p className="text-center">Send a message to start the conversation.</p>
            )}
        </div>
    )
}

export default Messages
