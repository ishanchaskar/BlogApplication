import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext';
import { Link, useNavigate , useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
const DeletePost = ({postId: id}) => {
  const{currentUser} = useContext(UserContext)
  const token = currentUser?.token;
  const [loading, isLoading] = useState(false);
  const navigate = useNavigate()
  // const{id} = useParams()
  const location = useLocation()
  // redirect to login page for every user who isnt logged in 
  useEffect(() => {
    if(!token){
      navigate("/login")
    }
  } , [])
  const removePost = async () => {
    isLoading(true)
    try {
      const response = await axios.delete(`http://localhost:5000/api/posts/${id}`,{withCredentials:true ,
       headers: {Authorization: `Bearer ${token}`}});
       if (response.status === 200) {
        if(location.pathname === `/myposts/${currentUser.id}`){
          navigate(0)
        }
        else{
          navigate("/")
        }
       }
      isLoading(false)
    } catch (error) {
      console.log(error);
    }
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <Link className="btn sm danger" onClick={removePost}>DELETE</Link>
    </div>
  )
}

export default DeletePost
