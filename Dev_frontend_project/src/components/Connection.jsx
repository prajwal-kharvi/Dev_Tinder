import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addConnection} from "../utils/connectionSlice.js";
import Card from "./Card.jsx";
import EmptyState from "./EmptyState.jsx";

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

    if(connections.length===0) return (<EmptyState icon="🤝" title="No Connections Yet" message="Start connecting with developers to grow your network."/>)


    return(
        <div>
            <h1 className="text-4xl font-bold text-center text-white my-8">🤝 My Connections</h1>

            <div className="flex flex-col items-center gap-4">
                {connections.map((connection) => (
                    <Card
                        key={connection._id}
                        data={connection}
                    />
                ))}
            </div>
        </div>
    )
}

export default connection