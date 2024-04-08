import React, { useEffect, useState } from 'react'
import PostItem from '../Components/PostItem'
import Loader from '../Components/Loader';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AuthorPosts = () => {
  const {id} = useParams()
  const [posts, setPosts] = useState([]);
  const[isLoading , setisLoading] = useState(false)
  useEffect(() =>{
    const fetchPosts = async  () =>{
      setisLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/users/${id}`)   
        setPosts(response?.data)
        console.log(response?.data)
      } catch (err) {
        console.log(err)
      }
      setisLoading(false);
    }
    fetchPosts();
  },[id])
  if(isLoading){
    return <Loader/>
  }
  return (
    <section className="posts">
     {posts.length > 0 ?  <div className="container posts__container">
        {posts.map(({_id: id, thumbnail, category, title, description, creator , createdAt }) => (
          <PostItem
            key={id}
            title={title}
            thumbnail={thumbnail}
            category={category}
            desc={description}
            authorId={creator} // changed it to ._id 
            postId={id}
            createdAt = {createdAt}
          />
        ))}
      </div> : <h2 className="center">No post found</h2> }
    </section>
  );
}

export default AuthorPosts
