import {useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {addUser} from "../utils/userSlice.js";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../utils/constants.js";
import validator from "daisyui/components/validator/index.js";

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
    return(
       <div className="flex justify-center m-10">
           <div className="card bg-slate-900 border border-slate-700 w-96 shadow-2xl">
               <div className="card-body">
                   <h2 className="card-title justify-center text-slate-300 ">{isLoginForm ? "Login" :"Sign Up"}</h2>
                   <div>
                       {!isLoginForm && (<>
                           <label className="label my-3 text-slate-300">First Name</label>
                           <input
                           type="text"
                           value={firstName}
                       className="input"
                       onChange={(e) => setFirstName(e.target.value)}
                   />
                   <label className="label my-3 text-slate-300">Last Name</label>
                   <input
                       type="text"
                       value={lastName}
                       className="input"
                       onChange={(e) => setLastName(e.target.value)}
                   />
                       </>)}
                       <label className="label my-3 text-slate-300">Email ID</label>
                       <input
                           type="text"
                           value={emailId}
                           className="input"
                           onChange={(e)=>setEmailId(e.target.value)}
                       />
                       <label className="label my-3 text-slate-300">Password</label>
                       <input
                           type="text"
                           value={password}
                           className="input"
                           onChange={(e)=>setPassword(e.target.value)}
                       />
                   </div>
                   <p className="text-red-500">{error}</p>
                   <div className="card-actions justify-center m-3">
                       <button className="btn btn-primary" onClick={isLoginForm ? handlerLogin :handlerSignUp}>{isLoginForm ? "Login":"Sign Up"}</button>
                   </div>
                   <p className=" m-auto py-2 cursor-pointer text-white " onClick={()=>setLoginForm((value)=>!value)}>
                       {isLoginForm ?"New User? SignUp Here" :"Existing User ? Login Here"}
                   </p>
               </div>
           </div>
       </div>
    )
}


export default Login