import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useDispatch, useSelector} from "react-redux";
import {addFeed} from "../utils/feedSlice.js";
import {useEffect} from "react";
import UserCard from "./UserCard.jsx";

const Feed=()=>{
    const feed=useSelector((store)=>store.feed)
    const dispatch=useDispatch()

    const getFeed=async ()=>{

        if(feed)return
        try{
            const res=await axios(BASE_URL+"/feed",{
                withCredentials:true
            })
            dispatch(addFeed(res?.data))

        }catch (err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        getFeed()
    },[])

    if(!feed)return

    if (feed.length<=0)return <h1 className="flex justify-center text-white text-2xl my-10">NO New User Found!!!</h1>

    return(
        feed &&(
            <div className="flex justify-center my-10">
                <UserCard user={feed[0]}/>
            </div>
        )

    )
}

export default Feed