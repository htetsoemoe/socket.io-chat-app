import React, { useEffect } from 'react'
import LogoutButton from './LogoutButton'
import SearchInput from './SearchInput'
import Conversations from './Conversations'
import { useAuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useGetAuthUserData from '../../hooks/useGetAuthUserData'

const Sidebar = () => {
    // const { authUser } = useAuthContext();

    const navigate = useNavigate();
    const { getUserData, userData } = useGetAuthUserData();

    useEffect(() => {
        getUserData();
    }, [])
    console.log(`authUser: ${JSON.stringify(userData)}`);

    // When we click on the link, it will navigate to the `/verify-account` route.
    // We need to /send-verify-otp route to send the otp to the user's email.
    const handleVerifiedAccount = async (event) => {
        event.preventDefault();
        const res = await fetch('/api/v1/auth/send-verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const data = await res.json();
        console.log(`send-verify-otp: ${JSON.stringify(data)}`);

        if (data.error) {
            throw new Error(data.error)   
        }

        if (data?.success) {
            navigate('/verify-account');
            toast.success(data.message);
        }  
    }

    return (
        <div className='border-r border-slate-500 p-4 flex flex-col'>
            <SearchInput />
            <div className='divider px-3'></div>
            <Conversations />
            <div className='flex items-center justify-between mt-auto'>
                <LogoutButton />
                {
                    !userData?.isAccountVerified ?
                        (
                            <button
                                onClick={handleVerifiedAccount}
                                className='
                                        text-xs text-center 
                                        bg-red-700 py-2 px-2 rounded-2xl
                                        hover:cursor-pointer
                                    '
                            >
                                Verify Account
                            </button>
                        )
                        :
                        (
                            <button className='
                                text-xs text-center 
                                bg-green-700 py-2 px-2 rounded-2xl
                            '>
                                Verified Account
                            </button>
                        )
                }
            </div>
        </div>
    )
}

export default Sidebar
