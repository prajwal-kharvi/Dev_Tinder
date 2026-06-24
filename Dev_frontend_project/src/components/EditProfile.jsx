import {useState} from "react";
import UserCard from "./UserCard.jsx";
import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useDispatch} from "react-redux";
import {addUser} from "../utils/userSlice.js";

const EditProfile=({user})=>{
    const [firstName,setFirstName]=useState(user.firstName)
    const[lastName,setLastName]=useState(user.lastName)
    const[age,setAge]=useState(user.age)
    const[gender,setGender]=useState(user.gender)
    const[photoUrl,setPhotoUrl]=useState(user.photoUrl)
    const[about,setAbout]=useState(user.about)
    const[error,setError]=useState("")
    const[showToast,setShowToast]=useState(false)
   const dispatch=useDispatch()

    const saveProfile=async ()=>{
        try{
            const res=await axios.patch(BASE_URL+"/profile/edit",
                {firstName,lastName,age,gender,photoUrl,about},
                {withCredentials:true})
                dispatch(addUser(res?.data?.data))
                setShowToast(true)
            setTimeout(()=>{
                setShowToast(false)
            },3000)


        }catch (err){
            setError(err?.response?.data?.message)
        }
    }
    return(
        <>
            <div className="flex justify-center gap-10 my-10 items-start">
                <div >
                    <div className="card w-96 h-[720px] bg-slate-900 border border-slate-700 shadow-2xl">
                        <div className="card-body">
                            <h2 className="card-title justify-center text-slate-100 text-3xl mb-4">Edit Profile</h2>
                            <div>
                                <label className="label my-2 text-slate-300">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    className="input"
                                    onChange={(e)=>setFirstName(e.target.value)}
                                />
                                <label className="label my-2 text-slate-300">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    className="input"
                                    onChange={(e)=>setLastName(e.target.value)}
                                />
                                <label className="label my-2 text-slate-300">Photo Url</label>
                                <input
                                    type="text"
                                    value={photoUrl}
                                    className="input"
                                    onChange={(e)=>setPhotoUrl(e.target.value)}
                                />
                                <label className="label my-2 text-slate-300">Age</label>
                                <input
                                    type="number"
                                    min="18"
                                    max="100"
                                    placeholder="Enter your age"
                                    className="input"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                                <label className="label my-2 text-slate-300">Gender</label>
                                <select
                                    className="select "
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <label className="label my-2 text-slate-300">About</label>
                                <textarea
                                    className="textarea"
                                    placeholder="Tell other developers about yourself..."
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                ></textarea>
                            </div>
                            <p className="text-red-500">{error}</p>
                            <div className="card-actions justify-center mt-6">
                                <button className="btn btn-primary w-full" onClick={saveProfile}>Save Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
                <UserCard user={{firstName,lastName,age,gender,photoUrl,about}}/>
            </div>
            {showToast&&(
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Profile saved successfully.</span>
                    </div>
                </div>
            )}
        </>

    )
}

export default EditProfile