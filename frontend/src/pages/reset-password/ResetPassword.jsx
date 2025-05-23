import React, { useState, useRef } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const inputRefs = useRef([]);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState('');
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    const navigate = useNavigate();

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

    // Handler for sending the reset password request
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        /**
        ^ – Start of string.
        [a-zA-Z0-9._%+-]+ – Matches the username part (before @), allowing letters, digits, dots, underscores, etc.
        @ – The required @ symbol.
        [a-zA-Z0-9.-]+ – Matches the domain name.
        \. – The literal dot (.) before the domain extension.
        [a-zA-Z]{2,} – The domain extension (e.g., com, org, io) with at least two letters.
        $ – End of string.
     */
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        try {
            const res = await fetch('/api/v1/auth/send-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            setIsEmailSent(true);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Handler for submitting the OTP code
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        const otpData = otpArray.join('');
        setOtp(otpData);
        setIsOtpSubmitted(true);
    }

    // Handler for submit the new password
    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }
        try {
            const res = await fetch('/api/v1/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if (data.success) {
                toast.success(data.message);
                navigate('/signin');
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            {/* Enter your email address form. */}
            {!isEmailSent &&
                <div className="backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg max-w-md w-full">
                    <form onSubmit={handleEmailSubmit}>
                        <h1 className="text-3xl font-semibold text-center text-black mb-1">
                            <span className="text-black">Reset Password</span>
                        </h1>

                        <div className='flex items-center justify-center mb-7'>
                            <div className="label  pl-0 flex items-start">
                                <span className="text-base text-red-900">Enter your email address.</span>
                            </div>
                        </div>

                        <div
                            className="flex items-center justify-center mb-2"
                        >
                            <input type="text"
                                placeholder='Enter your email'
                                className='w-full h-10 input focus:outline-none'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <button className="btn btn-primary btn-block mt-5">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            }

            {/* Reset password OTP form. */}
            {!isOtpSubmitted && isEmailSent &&
                <div className="backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg max-w-md w-full">
                    <form onSubmit={handleOtpSubmit}>
                        <h1 className="text-3xl font-semibold text-center text-black mb-1">
                            <span className="text-black">Reset Password OTP</span>
                        </h1>

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
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    onInput={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleBackspace(e, index)}
                                />
                            ))}
                        </div>

                        <div>
                            <button className="btn btn-primary btn-block mt-5">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            }

            {/* Enter your new password form. */}
            {isOtpSubmitted && isEmailSent &&
                <div className="backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg max-w-md w-full">
                    <form onSubmit={handleNewPasswordSubmit}>
                        <h1 className="text-3xl font-semibold text-center text-black mb-1">
                            <span className="text-black">New Password</span>
                        </h1>

                        <div className='flex items-center justify-center mb-7'>
                            <div className="label  pl-0 flex items-start">
                                <span className="text-base text-red-900">Enter your new password.</span>
                            </div>
                        </div>

                        <div
                            className="flex items-center justify-center mb-2"
                        >
                            <input type="password"
                                placeholder='Enter your new password'
                                className='w-full h-10 input focus:outline-none'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <button className="btn btn-primary btn-block mt-5">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default ResetPassword
