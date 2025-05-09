import React, { useEffect, useState } from 'react'
import { FaBell } from "react-icons/fa";
import { useSocketContext } from "../../context/SocketContext.jsx"

const Notification = ({ userId }) => { // userId is the user who is logged in
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socket } = useSocketContext();

    useEffect(() => {
        socket.on("navNotification", (data) => {
            setNotifications((prevNotifications) => [...prevNotifications, data]);
            setUnreadCount((prevCount) => prevCount + 1);
        });

        return () => {
            socket.off("navNotification");
        };
    }, [userId]);


    const handleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
        }
    }

    return (
        <div className='relative inline-block text-left'>
            <button
                onClick={handleOpen}
                className='relative p-2 rounded-full hover:cursor-pointer transition'
            >
                <FaBell className='w-6 h-6' />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex
                        items-center justify-center px-1.5 py-0.5 text-xs font-bold 
                        leading-none text-white bg-red-600 rounded-full 
                    ">
                        {unreadCount}
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
                                    nth-[even]:bg-gray-300
                                    flex items-center justify-center gap-3"
                                >
                                    <div className={`avatar`}>
                                        <div className='w-12 rounded-full'>
                                            <img
                                                src={notification.profilePic}
                                                alt='user profile'
                                            />
                                        </div>
                                    </div>
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
