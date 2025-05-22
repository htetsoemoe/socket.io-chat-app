import React, { useRef } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useGetAuthUserData from '../../hooks/useGetAuthUserData';

const VerifiedAccount = () => {
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { getUserData } = useGetAuthUserData();

    // Function to focus on the next input field when the current one is filled
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }

    // Function to focus on the previous input field when the backspace is pressed
    const handleBackspace = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
            inputRefs.current[index - 1].focus();
        }
    }

    // Function to paste OTP code from clipboard
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const otpArray = paste.split('').slice(0, 6);
        otpArray.forEach((otp, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = otp;
            }
        })
    }

    // Function to send OTP code to the server
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const otpArray = inputRefs.current.map(input => input.value);
            const optData = otpArray.join('');

            const res = await fetch('/api/v1/auth/verify-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ otp: optData }),
            })
            const data = await res.json();
            console.log(`verify-account: ${JSON.stringify(data)}`);

            if (data.error) {
                throw new Error(data.error);
            }

            if (data?.success) {
                getUserData();
                navigate('/');
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className="backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center text-black mb-5">
                    <span className="text-black">Account Verify OTP</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className='flex items-center justify-center mb-1'>
                        <div className="label p-2 pl-0 mb-1 flex items-start">
                            <span className="text-base text-red-900">Enter 6-digits code send to your email.</span>
                        </div>
                    </div>

                    <div
                        onPaste={handlePaste}
                        className="flex items-center justify-center gap-3 mb-5"
                    >
                        {Array(6).fill(0).map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                required
                                className="
                                    w-12 h-12 text-center text-xl 
                                    border border-gray-300 rounded-md 
                                    focus:outline-none focus:border-blue-900
                                "
                                ref={e => inputRefs.current[index] = e}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleBackspace(e, index)}
                            />
                        ))}
                    </div>

                    <div>
                        <button className="btn btn-primary btn-block mt-5">
                            Verify OTP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VerifiedAccount
