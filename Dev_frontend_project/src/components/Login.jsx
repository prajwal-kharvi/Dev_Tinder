import {useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {addUser} from "../utils/userSlice.js";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../utils/constants.js";

const Login=()=>{
    const [emailId,setEmailId]=useState("")
    const[password,setPassword]=useState("")
    const[firstName,setFirstName]=useState("")
    const[lastName,setLastName]=useState("")
    const[isLoginForm,setLoginForm]=useState(true)
    const[error,setError]=useState("")
    const dispatch=useDispatch()
    const navigate=useNavigate()


    const handlerLogin=async ()=>{
        try{
            const res=await axios.post(BASE_URL+"/login",{
                emailId,password
            },{
                withCredentials:true,
            })
            dispatch(addUser(res.data))
            return navigate("/")
        }catch(err){
                setError(err?.response?.data || "something went wrong!!!")
        }
    }

    const handlerSignUp=async ()=>{
        try{
            const res=await axios.post(BASE_URL+"/signup",
                {firstName,lastName,emailId,password},{withCredentials:true})
            console.log(res.data)
            dispatch(addUser(res?.data?.data))
            return navigate("/profile")
        }catch (err){
            setError(err?.response?.data || "something went wrong!!!")
        }

    }

    const handlerFromToggle=()=>{
        setLoginForm((value) => !value)
        setError("")
        setEmailId("")
        setPassword("")
        setFirstName("")
        setLastName("")
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 ">
            <div className="card w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
                <div className="card-body p-8">

                    {/* Logo */}
                    <div className="text-center text-5xl mb-2">
                        🧑‍💻
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-white">
                            {isLoginForm ? "Welcome Back 👋" : "Create Account 🚀"}
                        </h2>

                        <p className="text-slate-400 mt-2">
                            {isLoginForm
                                ? "Login to your DevTinder account"
                                : "Join thousands of developers"}
                        </p>
                    </div>

                    <div>
                        {!isLoginForm && (
                            <>
                                <label className="label mt-3 mb-2 font-medium text-slate-300">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="input w-full bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                                />

                                <label className="label mt-4 mb-2 font-medium text-slate-300">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="input w-full bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                                />
                            </>
                        )}

                        <label className="label mt-4 mb-2 font-medium text-slate-300">
                            Email ID
                        </label>

                        <input
                            type="email"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            className="input w-full bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                        />

                        <label className="label mt-4 mb-2 font-medium text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input w-full bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center mt-4">
                            {error}
                        </p>
                    )}

                    <div className="card-actions mt-6">
                        <button
                            className="btn w-full bg-indigo-500 hover:bg-indigo-600 border-none text-white"
                            onClick={isLoginForm ? handlerLogin : handlerSignUp}
                        >
                            {isLoginForm ? "Login" : "Create Account"}
                        </button>
                    </div>

                    <p className="text-center mt-5 text-slate-400">
                        {isLoginForm
                            ? "Don't have an account? "
                            : "Already have an account? "}

                        <span
                            className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                            onClick={handlerFromToggle}
                        >
            {isLoginForm ? "Sign Up" : "Login"}
          </span>
                    </p>
                </div>
            </div>
        </div>
    );
}


export default Login