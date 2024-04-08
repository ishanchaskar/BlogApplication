import React, { useState , useContext} from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios';
import {UserContext} from  '../context/UserContext.js'

const Login = () => {
  const [userData ,  setuserData] = useState({
    email : '',
    password : '',
  })

  const changeInputHandler = (e) =>{
    setuserData(prevState =>{
      return {...prevState , [e.target.name]: e.target.value}
    })
  }
  const [error , setError] = useState('');
  const navigate = useNavigate();
  const{setUser} = useContext(UserContext)

  const loginUser = async (e) => {
    e.preventDefault();
    setError('')
    try {
      const response = await axios.post(`http://localhost:5000/api/user/login`, userData)   
      const user = await response.data;
      setUser(user);
      navigate('/')

    } catch (err) {
      setError(err.response.data.message);
    }
  }
  return (
    <section className="register">
      <div className="container">
        <h2 style={{textAlign:"center"}}>Sign In</h2>
        <form  className="form register__form" onSubmit={loginUser}>
          {error && <p className="form__error-message">
            {error}
          </p>}
          <input type="text" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler}  autoFocus/>
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler}  autoFocus/>
          <button className="btn primary" type='submit'>Login</button>
        </form>
        <small>Dont have an account <Link to="/register">Sign Up</Link></small>
      </div>
    </section>
  )
}

export default Login
