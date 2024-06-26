import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";

import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


const PostAuthor = ({authorId , createdAt}) => {
  const[author , setAuthor] = useState({})
  useEffect(()=>{
    const getAuthor = async () =>{
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${authorId}`);
        setAuthor(response?.data)

      } catch (error) {
        console.log(error);
      }
    }
    getAuthor();
  },[authorId])
  return (
   <Link to={`/posts/users/${authorId}`} className="post__author">
    <div className="post__author-avatar">
    <img src={`http://localhost:5000/uploads/${author?.avatar}`} alt={"title"} />
    </div>
    <div className="post__author-details">
      <h5>{author?.name}</h5>
      <small><ReactTimeAgo locale='en-US' date={new Date(createdAt)}/></small> 
    </div>
   </Link>
  )
}

export default PostAuthor