import NavBar from "./NavBar.jsx";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.jsx";

const Body=()=>{
    return(
        <div>
            <NavBar/>
            <Outlet/>
            <Footer/>
        </div>
    )
}

export default Body