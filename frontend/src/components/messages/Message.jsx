import React, { useEffect, useState, useRef } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import useConversation from '../../zustand/useConversation'
import { extractTime } from '../../utils/extractTime.js'
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useSocketContext } from "../../context/SocketContext.jsx"

const Message = ({ message }) => {
    const { authUser } = useAuthContext()
    const { selectedConversation } = useConversation()

    const { socket } = useSocketContext()

    // This is a message from me or not
    const fromMe = message.senderId === authUser._id
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";
    const formattedTime = extractTime(message.createdAt);
    const [isLikedTrue, setIsLikeTrue] = useState(message.isLike);

    // This code for `RightClickMenu`
    const [menuPosition, setMenuPosition] = useState({
        x: 0,
        y: 0,
    })
    const [isVisible, setIsVisible] = useState(false);
    const menuRef = useRef(null);

    const [isEdit, setIsEdit] = useState(false);
    const [editMsg, setEditMsg] = useState(message.message);
    const editMsgRef = useRef(null);

    useEffect(() => {
        socket.on("receiveLoveReaction", ({ isLike, senderId, receiverId, msgId, }) => {
            console.log(`receiveLoveReaction: ${isLike}, ${senderId}, ${receiverId}, ${msgId}`);
            if (msgId === message._id) {
                setIsLikeTrue(isLike);
            }
        });

        document.addEventListener("click", handleClickOutside);
        // document.addEventListener("click", handleClickOutsideEditMsg);

        // clean up the event listener when the component unmounts
        return () => {
            socket.off("receiveLoveReaction");
            document.removeEventListener("click", handleClickOutside);
           // document.removeEventListener("click", handleClickOutsideEditMsg);
        }
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

    // This is for `RightClickContextMenu`
    const handleContextMenu = (event) => {
        event.preventDefault(); // captures the right-click and prevents the browser default context menu.
        setMenuPosition({ x: event.pageX, y: event.pageY }); // This is line is not used, x and y used as hard-code in CSS
        setIsVisible(true);
    };

    // This is for `Close RightClickMenu when click outside`
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    // const handleClickOutsideEditMsg = (event) => {
    //     if (editMsgRef.current && !editMsgRef.current.contains(event.target)) {
    //         setIsEdit(false);
    //     }
    // };

    // This is a handler for the delete button
    const handleDeleteMsg = async () => {
        console.log(`delete message ID: ${message._id}, isLike: ${message.isLike}`);
        
        const res = await fetch(`http://localhost:3500/api/v1/messages/${message._id}`, {
            method: "DELETE",
            credentials: "include",// <-- This is crucial for sending cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                isLike: message?.isLike,
            }),
        });
        const data = await res.json();
        console.log(data);
        setIsVisible(false);
    }

    const handleCloseEditMsg = (event) => {
        event.preventDefault();
        setEditMsg(message.message);
        setIsEdit(false);
    }

    const handleEditMsg = () => {
        console.log(`edit message ID: ${message._id}, isLike: ${message.isLike}`);
        setIsEdit(true);
    }

    const handleSaveEditMsg = async (event) => {
        event.preventDefault();
        console.log(`save edit message ID: ${message._id}, msg: ${editMsg}`); 

        const res = await fetch(`http://localhost:3500/api/v1/messages/${message._id}`, {
            method: "PUT",
            credentials: "include",// <-- This is crucial for sending cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: editMsg,
            }),
        });
        setIsEdit(false);
    }
    // console.log(message);

    return (
        <div
            onContextMenu={handleContextMenu}
            className='relative'
        >
            <div
                className={`chat ${chatClassName}`}
            >
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

            {/* User can click right click menu on only the right side of the chat bubble */}
            {isVisible && chatClassName === "chat-end" && (
               <div className="flex items-center justify-between gap-3">
                    <div
                        onClick={handleEditMsg}
                        className={`absolute bg-yellow-900 text-white
                        p-2 rounded-full shadow-md z-30 hover:bg-yellow-700 hover:cursor-pointer
                        top-[-13px] left-[320px]
                    `}
                        // top-[-7px] left-[320px] is important to make the menu appear at the right position of the chat bubble
                        // style={{ top: menuPosition.y, left: menuPosition.x }} top-[13px] left-[130px]
                        ref={menuRef}
                    >
                        <FaPencil />
                    </div>

                    <div
                        onClick={handleDeleteMsg}
                        className={`absolute bg-red-700 text-white
                        p-2 rounded-full shadow-md z-30 hover:bg-red-900 hover:cursor-pointer
                        top-[-13px] left-[280px]
                    `}
                        // top-[-7px] left-[320px] is important to make the menu appear at the right position of the chat bubble
                        // style={{ top: menuPosition.y, left: menuPosition.x }} top-[13px] left-[130px]
                        ref={menuRef}
                    >
                        <FaTrash />
                    </div>
               </div>
            )}

            {isEdit && (
                <div > {/* ref={editMsgRef} */}
                    <form>
                        <textarea 
                            className={`absolute bg-blue-200 text-black
                            w-64 h-20 p-2 rounded shadow-md z-30
                            top-[-13px] left-[100px]
                        `}
                        name='editMsg' id='editMsg'
                        value={editMsg}
                        onChange={(e) => setEditMsg(e.target.value)}
                        />
                        <span
                            className={`absolute bg-red-900 text-white
                                px-2 rounded-full shadow-md z-30 hover:bg-red-700 hover:cursor-pointer
                                top-[-25px] left-[340px]
                            `}
                            onClick={handleCloseEditMsg}
                        >
                            x
                        </span>
                        <button
                            className={`absolute bg-blue-900 text-white
                                px-4 rounded shadow-md z-30 hover:bg-blue-700 hover:cursor-pointer
                                top-[67px] left-[297px]
                            `}
                            onClick={handleSaveEditMsg}
                        >
                            Edit
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Message
