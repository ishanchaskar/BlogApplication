import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'
const Register = () => {
  const [userData ,  setuserData] = useState({
    name: '',
    email : '',
    password : '',
    password2: '',
  })

  const changeInputHandler = (e) =>{
    setuserData(prevState =>{
      return {...prevState , [e.target.name]: e.target.value}
    })
  }
  const [error , setError] = useState('');
  const navigate = useNavigate();

const registerUser = async (e) => {
  e.preventDefault()
  setError('')
  try {
    const response = await axios.post(`http://localhost:5000/api/user/register`, userData)
    const newUser  = await response.data;
    if(~newUser){
      setError("Couldn't register user. Please try again.")
    }
    navigate("/login")
  } catch (err) {
    setError(err.response.data.message);
  }
}

  return (
    <section className="register">
      <div className="container">
        <h2 style={{textAlign: "center"}}>Sign up</h2>
        <form  className="form register__form" onSubmit={registerUser}>
         {error && <p className="form__error-message">{error}</p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler}  autoFocus/>
          <input type="text" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler}  autoFocus/>
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler}  autoFocus/>
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange={changeInputHandler}  autoFocus/>
          <button className="btn primary" type='submit'>Register</button>
        </form>
        <small>Already have an account <Link to="/login">Sign In</Link></small>
      </div>
    </section>
  )
}

export default Register
