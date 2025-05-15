import React, { useEffect, useState } from 'react'
import { FaBell } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { extractTime } from "../../utils/extractTime.js"
import { useSocketContext } from "../../context/SocketContext.jsx"
import { useAuthContext } from '../../context/AuthContext.jsx';
import navNotiSound from "../../assets/sounds/navNotiSound.wav";

const Notification = ({ userId }) => { // userId is the user who is logged in
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const getAllNotifications = async () => {
            try {
                const res = await fetch(`http://localhost:3500/api/v1/noti/userId/${authUser?._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                const data = await res.json();
                setNotifications(data); // notifications.notifications
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        }
        getAllNotifications();

        socket.on("navNotification", (data) => {
            const sound = new Audio(navNotiSound);
            sound.play();
            getAllNotifications(); // notifications.notifications
            setUnreadCount((prevCount) => prevCount + 1);

            // setNotifications((prevNotifications) => [...prevNotifications, data]);
            // setNotifications([...notifications, data] );
        });

        socket.on("deleteMessage", () => {
            getAllNotifications();
        });

        // Close Dropdown on Outside Click
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            socket.off("navNotification");
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userId]);
    // console.log(`Notifications: ${JSON.stringify(notifications)}`);

    const handleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
        }
        // getAllNotifications();
    }

    return (
        <div className='relative inline-block text-left' ref={dropdownRef}>
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
                        {notifications.notifications.length === 0 ? (
                            <p className="px-4 py-2 text-sm text-white nth-[odd]:bg-gray-500">
                                No new notifications.
                            </p>
                        ) : (
                            notifications.notifications.map((notification, i) => (
                                <div
                                    key={i}
                                    className="px-4 py-2 text-sm text-gray-700 
                                    hover:bg-gray-300 cursor-pointer 
                                    nth-[even]:bg-gray-300"
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <div className={`avatar`}>
                                            <div className='w-12 rounded-full'>
                                                <img
                                                    src={notification.profilePic}
                                                    alt='user profile'
                                                />
                                            </div>
                                        </div>
                                        <div className=''>
                                            {notification.message}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 mt-1 ml-15 text-[11px] font-semibold">
                                        <FiClock color='black' />
                                        {extractTime(notification.createdAt)}
                                    </div>
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
