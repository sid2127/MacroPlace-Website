import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import useGetCurrentUser from './hooks/useGetCurrentUser'

function App() {

  useGetCurrentUser();

  const userData = useSelector(state => state.user.userData)
  
  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={"/"}/>} />
      <Route path='/login' element={!userData ? <Login /> : <Navigate to={"/"}/>} />
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/login"}/>} />

    </Routes>
  )
   
}

export default App
