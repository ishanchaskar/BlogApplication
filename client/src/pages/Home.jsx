import React, { useContext, useEffect } from 'react'
import Posts from '../Components/Posts'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const{currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const navigate = useNavigate()
  
  // redirect to login page for every user who isnt logged in 
  useEffect(() => {
    if(!token){
      navigate("/login")
    }
  } , [])

  return (
    <div>
      <Posts/>
    </div>
  )
}

export default Home
