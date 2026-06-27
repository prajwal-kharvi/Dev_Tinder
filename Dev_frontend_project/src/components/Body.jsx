import NavBar from "./NavBar.jsx";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import Footer from "./Footer.jsx";
import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useDispatch, useSelector} from "react-redux";
import {addUser} from "../utils/userSlice.js";
import {useEffect} from "react";

const Body=()=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const location=useLocation()
    const userData=useSelector((store)=>store.user)

    const fetchUser=async ()=>{
        if(userData)return
        try{
            const res= await axios(BASE_URL+"/profile/view",{withCredentials:true})
            dispatch(addUser(res.data))
        }catch (err){
            if(err.status===401){
                navigate("/login")
            }

            console.log(err)
        }
    }

    const hideLayout=location.pathname==="/login"

    useEffect(()=>{
        fetchUser()
    },[])

    return(
        <>
            {!hideLayout && <NavBar/>}
            <div className={!hideLayout ?"pt-20 pb-20":""}>
                <Outlet/>
            </div>
            {!hideLayout && <Footer/>}
        </>

    )
}

export default Body