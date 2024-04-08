import React, { useState , useContext } from 'react'
import { Link } from 'react-router-dom'
import bb from '../wallpaper/bb.jpg'
import 'C:/Users/sandeep cahskar/Desktop/Blog/client/src/index.css'
import { FaBars } from "react-icons/fa";
import {AiOutlineClose} from "react-icons/ai";
import {UserContext} from  '../context/UserContext.js'
const Header = () => {
  const[isNavShowing , setIsNavShowing] = useState(window.innerWidth > 800 ? true: false)
  const{currentUser} = useContext(UserContext)

  return (
    <nav>
      <div className='container nav__container'>
        <Link to="/" className='nav__logo'  >
          <img className='logo' src={bb} alt='Navbar Logo'/>
        </Link>
       { currentUser?.id && isNavShowing &&  <ul className='nav__menu'>
          <li><Link to={`/profile/${currentUser.id}`}   >{currentUser?.name} </Link></li>
          <li>  <Link to="/create">Create  Posts </Link></li>
            <li><Link to="/authors">Authors </Link></li>
            <li style={{ marginRight: '20px' }}><Link to="/logout">Logout</Link></li>
        </ul> } 

        {!currentUser?.id && isNavShowing &&  <ul className='nav__menu'>
            <li><Link to="/authors"    >Authors</Link></li>
            <li><Link to="/login"   >Login</Link></li>
        </ul> } 
        <button className='nav__toggle-btn' onClick={() => setIsNavShowing(!isNavShowing)}>
          { isNavShowing ? <AiOutlineClose/> : <FaBars/>}
        </button>
      </div>
    </nav>
  )
}

export default Header