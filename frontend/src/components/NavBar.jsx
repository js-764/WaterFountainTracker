import {Link} from "react-router-dom"
import "../css/NavBar.css"

function NavBar() {

    return(<>

        {/* The navbar honestly isn't finished, like when the page gets smaller, I want to have a menu icon for dropdown
        navigation, but I just haven't gotten around to it yet, so navigation only works when the page is bigger right now.
        I'll finish/fix everything eventually :) */}

        <div className="navbar-header">
            <p className="longTitle"><Link to="/">Skyulkill River Trail Water Fountain Tracker</Link></p>
            {/* There are long and short <p> tag titles because the long one shows on bigger screens, and the short one shows on smaller screens
            because I didn't want to clutter the navbar */}
            <p className="shortTitle"><Link to="/">Skyulkill Trail Fountain Tracker</Link></p>
            <Link to="/about" className="btns">About</Link>
            <Link to="/how2use" className="btns">How To Use</Link>
            <Link to="/" className="btns">Home</Link>

            {/* This menu Icon is hidden by default. When the page gets smaller, I show this instead of the links above */}
            <Link to="/" className="menuIcon">Menu ☰</Link>
                        
        </div>
        <div className="separations">

        </div>
    </>)
}
export default NavBar

        // {/* <div className="navbar">
        //     <div className="navebar-brand">
        //         <Link to="/">Skyulkill River Trail Water Fountain Tracker</Link>
        //     </div>
        //     <div className="navebar-liks">
        //         <Link to="/" className="nav-link">Home</Link>
        //         <Link to="/favorites" className="nav-link">About</Link>
        //         <Link to="/favorites" className="nav-link">Statistics</Link>
        //     </div>
        // </div> */}
