import {useState} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {addUser} from "../utils/userSlice.js";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../utils/constants.js";

const Login=()=>{
    const [emailId,setEmailId]=useState("pajju@gmail.com")
    const[password,setPassword]=useState("Pajju@2003")
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
    return(
       <div className="flex justify-center m-10">
           <div className="card bg-base-300 w-96 shadow-sm">
               <div className="card-body">
                   <h2 className="card-title justify-center">Login</h2>
                   <div>
                       <label className="label my-2">Email ID</label>
                       <input
                           type="text"
                           value={emailId}
                           className="input"
                           onChange={(e)=>setEmailId(e.target.value)}
                       />
                       <label className="label my-2">Password</label>
                       <input
                           type="text"
                           value={password}
                           className="input"
                           onChange={(e)=>setPassword(e.target.value)}
                       />
                   </div>
                   <p className="text-red-500">{error}</p>
                   <div className="card-actions justify-center m-3">
                       <button className="btn btn-primary" onClick={handlerLogin}>Login</button>
                   </div>
               </div>
           </div>
       </div>
    )
}


export default Login