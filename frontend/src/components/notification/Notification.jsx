import React, { useState } from 'react'
import { FaBell } from "react-icons/fa";

const Notification = ({ notifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className='relative inline-block text-left'>
            <button
                onClick={toggleDropdown}
                className='relative p-2 rounded-full hover:cursor-pointer transition'
            >
                <FaBell className='w-6 h-6' />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex
                        items-center justify-center px-1.5 py-0.5 text-xs font-bold 
                        leading-none text-white bg-red-600 rounded-full 
                    ">
                        {notifications.length}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-0 mr-1 w-72 bg-white 
                    border border-gray-200
                    rounded-lg shadow-lg z-30
                ">
                    <div className="py-2">
                        {notifications.length === 0 ? (
                            <p className="px-4 py-2 text-sm text-white nth-[odd]:bg-gray-500">
                                No new notifications.
                            </p>
                        ) : (
                            notifications.map((notification, i) => (
                                <div
                                    key={i}
                                    className="px-4 py-2 text-sm text-gray-700 
                                    hover:bg-gray-300 cursor-pointer 
                                    nth-[even]:bg-gray-300"
                                >
                                    {notification.message}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notification
