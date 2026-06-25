import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addConnection} from "../utils/connectionSlice.js";
import ConnectionCard from "./Card.jsx";

const connection=()=>{
    const connections=useSelector((store)=>store.connection)
    const dispatch=useDispatch()

    const fetchConnection=async ()=> {
        try {
            const res = await axios(BASE_URL + "/user/connection", {withCredentials: true})
            dispatch(addConnection(res?.data?.data))
        } catch (err) {
            console.log(err.message)
        }
    }
useEffect(()=>{
    fetchConnection()
},[])

    if(!connections) return ;

    if(connections.length===0) return <h1>No Connection Found</h1>


    return(
        <div>
            <h1 className="text-3xl font-bold text-center text-white my-6">Connection</h1>

            <div className="flex flex-col items-center gap-4">
                {connections.map((connection) => (
                    <ConnectionCard
                        key={connection._id}
                        data={connection}
                    />
                ))}
            </div>
        </div>
    )
}

export default connection