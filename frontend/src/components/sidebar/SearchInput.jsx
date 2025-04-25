import React, { useState } from 'react'
import { IoSearchSharp } from "react-icons/io5"
import useConversation from '../../zustand/useConversation'
import useGetConversations from '../../hooks/useGetConversations'
import toast from 'react-hot-toast'

const SearchInput = () => {
    const [search, setSearch] = useState('')
    const { setSelectedConversation } = useConversation()
    const { conversations } = useGetConversations() // this hook will return all the conversations for the sidebar

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!search) {
            return
        }
        const conversation = conversations.find(
            (conversation) => conversation.name.toLowerCase().includes(search.toLowerCase())
        )
        // console.log(conversation)

        if (conversation) {
            setSelectedConversation(conversation)
            setSearch('')
        } else {
            toast.error('Conversation not found')
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='flex items-center gap-3'
        >
            <input
                type='text'
                placeholder='Search...'
                className='input input-bordered rounded-full'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                type='submit'
                className='btn btn-circle border-none bg-sky-500 text-white hover:bg-sky-600'
            >
                <IoSearchSharp className='w-6 h-6 outline-none hover:text-blue-300' />
            </button>
        </form>
    )
}

export default SearchInput
