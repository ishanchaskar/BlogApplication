import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Loader from '../Components/Loader';
import axios from 'axios';
import DeletePost from './DeletePost';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const token = currentUser?.token;
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/posts/users/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    getPosts();
  }, [id, token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className='dashboard'>
      {posts.length ? (
        <div className='container dashboard__container'>
          {posts.map(post => (
            <article key={post.id} className='dashboard__post'>
              <div className="dashboard__post-info">
                <div className="dashboard__post-info">
                  <div className="dashboard__post-thumbnail">
                    <img src={`http://localhost:5000/uploads/${post.thumbnail}`} alt={post.title} />
                  </div>
                  <h5>{post.title}</h5>
                </div>
              </div>
              <div className="dashboard__post-actions">
                <Link to={`/posts/${post._id}`} className="btn sm">View</Link>
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">Edit</Link>
                <DeletePost postId={post._id}/>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className='center'>You have no posts left</h2>
      )}
    </section>
  );
};

export default Dashboard;
