import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addRequests, removeRequests} from "../utils/requestSlice.js";
import Card from "./Card.jsx";
import EmptyState from "./EmptyState.jsx";

const Request=()=>{
    const requests=useSelector((store)=>store.request)
    const dispatch=useDispatch()

    const reviewRequest=async (status,_id)=>{
        try {
            await axios.post(BASE_URL+"/request/review/"+status+"/"+_id,{},{withCredentials:true})
            dispatch(removeRequests(_id))

        }catch (err){
            console.log(err.message)
        }

    }

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

    if(requests.length===0)return (<EmptyState   icon="📨" title="No Pending Requests" message="You're all caught up. New connection requests will appear here."/>)

    return(
        <div>
            <h1 className="text-4xl font-bold text-center text-white my-8">📨 Connection Requests</h1>

            <div className="flex flex-col items-center gap-4">
                {requests.map((request) => (
                    <Card
                        key={request._id}
                        data={request.fromUserId}
                        showRequestButton={true}
                        onAccept={()=>reviewRequest("accepted",request._id)}
                        onReject={()=>reviewRequest("rejected",request._id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Request