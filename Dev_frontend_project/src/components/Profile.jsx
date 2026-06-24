import EditProfile from "./EditProfile.jsx";
import {useSelector} from "react-redux";

const Profile=()=>{
    const user=useSelector((store)=>store.user)
    return(
       user&&(
           <EditProfile user={user}/>
       )
    )
}

export default Profile