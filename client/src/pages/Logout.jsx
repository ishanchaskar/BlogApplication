import React, {useEffect , useState , useContext} from 'react'
import {useNavigate } from 'react-router-dom'
import {UserContext} from  '../context/UserContext.js'
const Logout = () => {
  const{setUser} = useContext(UserContext)
  const navigate = useNavigate('');
  setUser(null);
  navigate('/login')
  return (
    <>
    </>
  )
}

export default Logout
