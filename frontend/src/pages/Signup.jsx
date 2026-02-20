import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';


function SignUp() {
    const primaryColor = "#ff4d2d";
    const hoverColor = "#e64323";
    const bgColor = "#fff9f6";
    const borderColor = "#ddd";
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("User")
    const navigate = useNavigate()
    const [fullname, setfullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();


    const handleSignUp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/signup`, {
                name: fullname, email, password, role
            }, { withCredentials: true })

            console.log(result);

            if (result.data) {
                dispatch(setUserData(result.data.data));
            }
            
            navigate("/login");
            setErr("")
            setLoading(false)


        } catch (error) {
            setErr(error?.response?.data?.message)
            setLoading(false)
        }
    }



    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: bgColor }}>
            <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border `} style={{
                border: `1px solid ${borderColor}`
            }}>
                <h1 className={`text-3xl font-bold mb-2 `} style={{ color: primaryColor }}>MacroPlace</h1>
                <p className='text-gray-600 mb-8'> Create your account to get started with the top products
                </p>

                {/* fullname */}

                <div className='mb-4'>
                    <label htmlFor="fullname" className='block text-gray-700 font-medium mb-1'>Full Name</label>
                    <input type="text" className='w-full border rounded-lg px-3 py-2 focus:outline-none ' placeholder='Enter your Full Name' style={{ border: `1px solid ${borderColor}` }} onChange={(e) => setfullname(e.target.value)} value={fullname} required />
                </div>
                {/* email */}

                <div className='mb-4'>
                    <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none ' placeholder='Enter your Email' style={{ border: `1px solid ${borderColor}` }} onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                {/* mobile*/}

                <div className='mb-4'>
                    <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className='w-full border rounded-lg px-3 py-2 focus:outline-none pr-10' placeholder='Enter your password' style={{ border: `1px solid ${borderColor}` }} onChange={(e) => setPassword(e.target.value)} value={password} required />

                        <button className='absolute right-3 cursor-pointer top-3.5 text-gray-500' onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    </div>
                </div>
                {/* role*/}

                <div className='mb-4'>
                    <label htmlFor="role" className='block text-gray-700 font-medium mb-1'>Role</label>
                    <div className='flex gap-2'>
                        {["user", "admin"].map((r) => (
                            <button
                                className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer'
                                onClick={() => setRole(r)}
                                style={
                                    role == r ?
                                        { backgroundColor: primaryColor, color: "white" }
                                        : { border: `1px solid ${primaryColor}`, color: primaryColor }
                                } key={r}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleSignUp} disabled={loading}>
                    {loading ? <ClipLoader size={20} color='white' /> : "Sign Up"}

                </button>
                {err && <p className='text-red-500 text-center my-2.5'>*{err}</p>}

                <p className='text-center mt-6 cursor-pointer' onClick={() => navigate("/login")}>Already have an account ?  <span className='text-[#ff4d2d]'>Sign In</span></p>
            </div>
        </div>
    )
}

export default SignUp
