import Signin from './pages/signin/Signin'
import Signup from './pages/signup/Signup'
import Home from './pages/home/Home'
import VerifiedAccount from './pages/verifiedAccount/VerifiedAccount'
import ResetPassword from './pages/reset-password/ResetPassword'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'

function App() {
  const { authUser } = useAuthContext()

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/signin" />} />
        <Route path='/signin' element={authUser ? <Navigate to="/" /> : <Signin />} />
        <Route path='/signup' element={authUser ? <Navigate to="/" /> : <Signup />} />
        <Route path='/verify-account' element={authUser ? <VerifiedAccount /> : <Navigate to="/signin" />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
