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

    const ringColor=user?.gender?.toLowerCase()==="male" ? "ring-indigo-500"
        :user?.gender?.toLowerCase()==="female" ? "ring-pink-500" : "ring-purple-500"

    return (
        <div className="navbar fixed top-0 left-0 z-50 w-full bg-slate-950 border-b border-slate-800 text-slate-200 px-6 shadow-lg">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-2xl font-bold hover:bg-transparent">
                    🧑‍💻 <span className="text-white">Dev</span>
                    <span className="text-indigo-400">Tinder</span>
                </Link>
            </div>

            {user && (
                <div className="flex items-center gap-5">
                    <div>
                        <span className="text-slate-400">Welcome, </span>
                        <span className="font-semibold text-white">{user.firstName}</span>
                    </div>

                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar hover:bg-slate-800"
                        >
                            <div className={`w-10 rounded-full ring ${ringColor} ring-offset-2 ring-offset-slate-950`}>
                                <img
                                    src={user.photoUrl}
                                    alt="User Profile"
                                />
                            </div>
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl p-2"
                        >
                            <li>
                                <Link to="/profile" className="hover:bg-slate-700 rounded-lg">
                                    Profile
                                    <span className="badge badge-primary">New</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/connection" className="hover:bg-slate-700 rounded-lg">Connection</Link>
                            </li>

                            <li>
                                <Link to="/request" className="hover:bg-slate-700 rounded-lg">Request</Link>
                            </li>

                            <li>
                                <a onClick={handleLogout} className="text-red-400 hover:bg-red-500 hover:text-white rounded-lg">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );

}

export default NavBar
