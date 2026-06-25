import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addRequests} from "../utils/requestSlice.js";
import ConnectionCard from "./Card.jsx";

const Request=()=>{
    const requests=useSelector((store)=>store.request)
    const dispatch=useDispatch()

    const fetchRequest=async ()=>{

        try{
            const res=await axios.get(BASE_URL+"/user/requests/received",{withCredentials:true})
            dispatch(addRequests(res?.data?.connectionRequest))

        }catch (err){
            console.log(err.message)
        }
    }

    useEffect(()=>{
        fetchRequest()
    },[])

    if(!requests)return ;

    if(requests.length===0)return <h1>No Request Found</h1>

    return(
        <div>
            <h1 className="text-3xl font-bold text-center text-white my-6">Request</h1>

            <div className="flex flex-col items-center gap-4">
                {requests.map((request) => (
                    <ConnectionCard
                        key={request._id}
                        data={request.fromUserId}
                        showRequestButton={true}
                    />
                ))}
            </div>
        </div>
    )
}

export default Request