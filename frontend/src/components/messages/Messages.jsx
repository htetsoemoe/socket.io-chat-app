import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import MessageSkeleton from '../skeletons/MessageSkeleton'
import useGetMessages from '../../hooks/useGetMessages'
import useListenMessages from '../../hooks/useListenMessages'
import { useSocketContext } from "../../context/SocketContext.jsx"

const Messages = () => {
    const { socket } = useSocketContext()
    const { messages: initialMessages, loading } = useGetMessages()
    const [messages, setMessages] = useState([])
    const lastMessageRef = useRef()
    useListenMessages()

    // Set initial messages from useGetMessages
    useEffect(() => {
       if (!loading) {
            setMessages(initialMessages)
        }
    }, [initialMessages, loading])

    // Listen for deleteMessage event from socket
    useEffect(() => {
        const handleDeleteMessage = (msgId) => {
            console.log(`msgId: ${msgId}`)
            setMessages((prevMessages) =>
                prevMessages.filter((message) => message._id !== msgId)
            )
        }

        socket.on("deleteMessage", handleDeleteMessage)

        return () => {
            socket.off("deleteMessage", handleDeleteMessage)
        }
    }, [socket])

    // Scroll to the last message when new messages are added
    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }, [messages]) 

    return (
        <div className='px-4 flex-1 overflow-auto'>
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
