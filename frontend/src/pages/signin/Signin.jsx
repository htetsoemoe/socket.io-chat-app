import React, { use, useState } from 'react'
import { Link } from 'react-router-dom'
import useSignin from '../../hooks/useSignin.js'

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loading, signin } = useSignin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signin(email, password);
    }

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className="backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center text-black">
                    Chatty<span className="text-black ml-3">Twitty</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className='mb-5'>
                        <div className="label p-2 pl-0 mb-1 flex items-start">
                            <span className="text-base">Email</span>
                        </div>
                        <input type="text"
                            placeholder='Enter your email'
                            className='w-full h-10 input focus:outline-none'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className='mb-5'>
                        <label className="label p-2 pl-0 mb-1 flex items-start">
                            <span className="text-base">Password</span>
                        </label>
                        <input type="password"
                            placeholder='Enter your password'
                            className='w-full h-10 input focus:outline-none'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex items-start">
                        <Link
                            to="/signup"
                            className='text-sm hover:underline hover:text-white'
                        >
                            <span
                                className='text-sm hover:underline hover:text-red-900'
                            >
                                Don't have an account, Sign Up?
                            </span>
                        </Link>
                    </div>

                    <div>
                        <button className="btn btn-primary btn-block mt-5">
                            {loading ? <span className="loading loading-spinner"></span> : "Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signin
