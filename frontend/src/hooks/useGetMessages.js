import { useState, useEffect } from "react"
import useConversation from "../zustand/useConversation"
import toast from "react-hot-toast"

const useGetMessages = () => {
    const [loading, setLoading] = useState(false)
    const { selectedConversation, messages, setMessages } = useConversation()

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            try {
                console.log(`selectedConversation?._id: ${selectedConversation?._id}`)
                const res = await fetch(`/api/v1/messages/userId/${selectedConversation?._id}`)
                const data = await res.json()
                if (data.error) {
                    throw new Error(data.error)
                }
                // console.log(data.data)
                setMessages(data.data)
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (selectedConversation?._id) {
            getMessages()
        }
    }, [selectedConversation?._id, setMessages])

    return { messages, loading }
}

export default useGetMessages
