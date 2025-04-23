import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GenderCheckbox from './GenderCheckbox'
import useSignup from '../../hooks/useSignup.js'

const Signup = () => {
  const [inputs, setInputs] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
  })
  const { loading, signup } = useSignup()

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(inputs)
  }

  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
      <div className="backdrop-blur-xs bg-white/0 border border-white/0 p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center text-black">
          Chatty<span className="text-black ml-3">Twitty</span>
        </h1>

        <form onSubmit={ handleSubmit}>
          <div className='mb-5'>
            <div className="label p-2 pl-0 mb-1 flex items-start">
              <span className="text-base">Name</span>
            </div>
            <input type="text"
              placeholder='Enter your name'
              className='w-full h-10 input focus:outline-none'
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />
          </div>

          <div className='mb-5'>
            <div className="label p-2 pl-0 mb-1 flex items-start">
              <span className="text-base">Username</span>
            </div>
            <input type="text"
              placeholder='Enter your username'
              className='w-full h-10 input focus:outline-none'
              value={inputs.username}
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
          </div>

          <div className='mb-5'>
            <label className="label p-2 pl-0 mb-1 flex items-start">
              <span className="text-base">Password</span>
            </label>
            <input type="password"
              placeholder='Enter password'
              className='w-full h-10 input focus:outline-none'
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
          </div>

          <div className='mb-5'>
            <label className="label p-2 pl-0 mb-1 flex items-start">
              <span className="text-base">Confirm Password</span>
            </label>
            <input type="password"
              placeholder='Confirm password'
              className='w-full h-10 input focus:outline-none'
              value={inputs.confirmPassword}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
            />
          </div>

          <GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

          <div className="flex items-start">
            <Link
              to="/signin"
              className='text-sm hover:underline hover:text-white'
            >
              <span className="text-sm hover:underline hover:text-red-900">
                Already have an account, Sign In?
              </span>
            </Link>
          </div>

          <div>
            <button className="btn btn-primary btn-block mt-5">
              {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
