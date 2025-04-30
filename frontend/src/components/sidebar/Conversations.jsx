import React from 'react'
import { getRandomEmoji } from "../../utils/emojis.js"
import useGetConversations from '../../hooks/useGetConversations'
import Conversation from './Conversation'

const Conversations = () => {
    const { conversations, loading } = useGetConversations()
    console.log(`conversations: ${JSON.stringify(conversations)}`)

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {conversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === conversations.length - 1}
                    emoji={getRandomEmoji()}
                />
            ))}

        </div>
    )
}

export default Conversations
