import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../images/okoutsompolis_logo.png'
import {FaBars} from 'react-icons/fa'
import {AiOutlineClose} from 'react-icons/ai'
import '../css/Header.css'
import '../index.css'
import { UserContext } from '../context/userContext'

const Header = () => {

    const [isNavShowing, setisNavShowing] = useState(window.innerWidth > 800 ? true : false)

    const {currentUser} = useContext(UserContext);


    const closeNavHandler = () => {
        if(window.innerWidth < 800){
            setisNavShowing(false);
        }
        else{
            setisNavShowing(true);
        }
    }

  return (
    <nav>
        <div className="container nav__container">
            <Link to="/" className='nav__logo'>
                <img src={logo} alt="Logo" />
            </Link>
            {currentUser?.userId && isNavShowing && <ul className="nav__menu">
                <li><Link to="/profile/tester" onClick={closeNavHandler}>{currentUser?.name}</Link></li>
                <li><Link to="/create" onClick={closeNavHandler}>Create Post</Link></li>
                <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
                <li><Link to="/logout" onClick={closeNavHandler}>Logout</Link></li>
            </ul>}
            {!currentUser?.userId && isNavShowing && <ul className="nav__menu">
                <li><Link to="/login" onClick={closeNavHandler}>Login</Link></li>
            </ul>}
            <button className="nav__toggle-btn" onClick={()=> setisNavShowing(!isNavShowing)}>
                {isNavShowing ? <AiOutlineClose/> : <FaBars/>}
            </button>
        </div>
    </nav>
  )
}

export default Header