import React, { useState, useRef } from 'react'

const ResetPassword = () => {
    const inputRefs = useRef([]);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEmailSent, setIsEmailSent] = useState('');
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            {/* Enter your email address form. */}
            {!isEmailSent &&
                <div className="backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg max-w-md w-full">
                    <form >
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
                    <form >
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
                    <form >
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
