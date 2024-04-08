import React, { useState, useEffect, useContext } from 'react';
import PostAuthor from '../Components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import DeletePost from '../pages/DeletePost';
import Loader from '../Components/Loader';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState(null);
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      isLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPosts(response.data);
      } catch (error) {
        setError(error);
      }
      isLoading(false);
    };
    getPost();
  }, [id]); // Add id to the dependency array

  if (loading) {
    return <Loader />;
  }

  return (
    <section className='post-detail'>
      {error && <p className='error'>{error}</p>}
      {posts && (
        <div className='container post-detail__container'>
          <div className='post-detail__header'>
            <PostAuthor authorId={posts.creator} createdAt={posts.createdAt} />
            {currentUser?.id === posts?.creator && (
              <div className='post-detail__buttons'>
                <Link to={`/posts/${posts?._id}/edit`} className='btn.sm primary'>
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{posts.title}</h1>
          <div className='post-detail__thumbnail'>
            <img src={`http://localhost:5000/uploads/${posts.thumbnail}`} alt='' />
          </div>
          <p dangerouslySetInnerHTML={{ __html: posts.description }}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetails;
