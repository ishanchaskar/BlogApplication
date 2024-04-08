import React from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'

const PostItem = ({ postId , desc , thumbnail , authorId , category , title , createdAt }) => {
  const shortDescription = desc.length > 40 ?  desc.substr(0, 40) + '...' : desc;
  const shortTitle = title.length > 30 ?  title.substr(0, 30) + '...' : title;
  return (
    <article className='post'>
        <div className='post__thumbnail'>
        <Link to={`/posts/${postId}`}> 
            <img src={`http://localhost:5000/uploads/${thumbnail}`} alt={title} />
            </Link>
        </div>
        <div className='post__content'>
        <Link to={`/posts/${postId}`}> 
        <h3>{shortTitle}</h3>
        <p dangerouslySetInnerHTML={{__html : shortDescription}}/>
        </Link>
        <div className='post__footer'>
            <PostAuthor authorId=  {authorId} createdAt = {createdAt} />
            <Link to={`/posts/categories/${category}`} className='btn primary'>{category}</Link>
        </div>
        </div>
    </article>
  )
}
export default PostItem