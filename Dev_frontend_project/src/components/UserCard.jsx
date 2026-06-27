import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useDispatch} from "react-redux";
import {removeUserFromFeed} from "../utils/feedSlice.js";

const UserCard=({user})=>{
    const {_id,firstName,lastName,age,gender,photoUrl,about} =user
    const dispatch=useDispatch()

    const handleSendRequest=async (status,userId)=>{
        try{
            const res=await axios.post(BASE_URL+"/request/send/"+status+"/"+userId,{},{withCredentials:true})
            dispatch(removeUserFromFeed(userId))
        }catch (err){
            console.log(err.message)
        }
    }
    const genderBadgeColor= gender?.toLowerCase() === "male" ? "bg-indigo-500"
            : gender?.toLowerCase() === "female" ? "bg-pink-500" : "bg-purple-500"


    return (
        <div className="flex justify-center">
            <div className="card w-[400px] h-[720px] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl text-slate-200 overflow-hidden transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/20">

                <figure>
                    <img
                        className="w-full h-80 object-cover"
                        src={photoUrl}
                        alt="Profile"
                    />
                </figure>

                <div className="card-body flex flex-col">

                    <h2 className="text-2xl font-bold text-white">
                        {firstName} {lastName}
                    </h2>

                    {age && gender && (
                        <div className={`badge ${genderBadgeColor} text-white border-none w-fit mt-1`}>
                            {age} , {gender}
                        </div>
                    )}

                    <p className="text-slate-400 mt-4 leading-7 flex-grow overflow-auto">
                        {about}
                    </p>

                    <div className="divider divider-slate"></div>

                    <div className="card-actions justify-between mt-2">

                        <button
                            className="btn btn-outline border-red-500 text-red-400 hover:bg-red-400 hover:text-white rounded-xl w-[47%] transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                            onClick={() => handleSendRequest("ignore", _id)}
                        >
                            ❌ Ignore
                        </button>

                        <button
                            className="btn bg-indigo-500 hover:bg-indigo-600 border-none text-white rounded-xl w-[47%] transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                            onClick={() => handleSendRequest("interested", _id)}
                        >
                            ❤️ Interested
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default UserCard