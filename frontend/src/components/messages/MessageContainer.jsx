import React, { useEffect } from 'react'
import useConversation from '../../zustand/useConversation';
import { TiMessage } from 'react-icons/ti';
import { useAuthContext } from '../../context/AuthContext';
import Messages from './Messages';
import MessageInput from './MessageInput';
import Notification from '../notification/notification';
import { CgProfile } from "react-icons/cg";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation()
	const { user } = useAuthContext()
	const userId = user?.id

	useEffect(() => {
		// cleanup function
		return () => {
			setSelectedConversation(null)
		}
	}, [setSelectedConversation])

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			<>
				{!selectedConversation ? (
					<NoChatSelected />
				) : (
					<div className='flex flex-col h-full ml-1'>
						{/* Header */}
						<div className='bg-slate-500 px-4 py-2 mb-2 flex items-center justify-between'>
							<div className="">
								<span className='label-text'>To:</span>{" "}
								<span className='text-gray-900 font-bold'>{selectedConversation.name}</span>
							</div>

							<div className="flex items-center justify-between gap-5">
								<Notification userId={userId} />
								<CgProfile className='text-2xl text-gray-100 hover:cursor-pointer' />
							</div>
						</div>
						<Messages />
						<MessageInput />
					</div>
				)}
			</>
		</div>
	);
}

const NoChatSelected = () => {
	const { authUser } = useAuthContext() // get authUser from context
	return (
		<div className="flex items-center justify-center w-full h-full">
			<div className="flex flex-col items-center gap-2 px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold">
				<p className="">Welcome 👋 {authUser.name} </p>
				<p>Select a chat to start messaging.</p>
				<TiMessage className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	)
}

export default MessageContainer
