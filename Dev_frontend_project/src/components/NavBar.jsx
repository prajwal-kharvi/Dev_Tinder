import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {removeUser} from "../utils/userSlice.js";

const NavBar=()=>{
    const user=useSelector((store)=>store.user)
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const handleLogout=async ()=>{
        try{
            await axios.post(BASE_URL+"/logout",{},{withCredentials:true})
            dispatch(removeUser())
             navigate("/login")


        }catch (err){
            console.log(err)
        }
    }

    return(
        <div className="navbar bg-slate-950 shadow-sm text-slate-200">
            <div className="flex-1">
                <Link to="/"  className="btn btn-ghost text-xl"> 🧑‍💻 DevTinder</Link>
            </div>
            {user&&(
                <div className="flex items-center gap-4 m-4">
                    <div className="text-slate-300 font-medium">
                        Welcome, <span className="text-slate-100">{user.firstName}</span>
                    </div>

                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full ring ring-slate-600 ring-offset-2 ring-offset-slate-950">
                                <img
                                    alt="User Photo"
                                    src={user.photoUrl}
                                />
                            </div>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 w-52 rounded-xl bg-slate-800 border border-slate-700 shadow-xl"
                        >
                            <li>
                                <Link to="/profile">
                                    Profile
                                    <span className="badge badge-primary">New</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/connection
                                ">Connection</Link>
                            </li>
                            <li>
                                <Link to="/request
                                ">Request</Link>
                            </li>

                            <li>
                                <a onClick={handleLogout} className="text-error">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )

}

export default NavBar
