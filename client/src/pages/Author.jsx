import React, {useEffect ,useState } from 'react'
import Loader from '../Components/Loader';
import { Link } from 'react-router-dom'
import axios from 'axios';
const Author = () => {
  const [authors, setAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const findauthors =async () =>{
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/user/");
      setAuthors(response?.data)
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  }
    findauthors();
  },[])

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="authors">
      {authors.length > 0 ? <div className='container authors__container'>
        {
          authors.map(({_id : id , avatar , name , posts}) => {
            return <Link key={id} to={`/posts/users/${id}`} className='author'>
              <div className="author__avatar">
                <img src={`http://localhost:5000/uploads/${avatar}`} alt={"title"} />
              </div>
              <div className="author__info"> 
                <h4>{name}</h4>
                <p>{posts}</p>
              </div>
            </Link>
          })
        }
        </div> : <h2 className='center'>No user Found</h2>
        }
      
    </section>
  )
}

export default Author
