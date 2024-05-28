import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Register.css'
import '../index.css'

const Login = () => {

  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })

  const changeInputHandler = (e) =>{
    setUserData(prevState =>{
      return {...prevState, [e.target.name]: e.target.value }
    })
  }


  return (
    <section className="login" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      <div className="container">
        <h2>Sign in</h2>
        <form className="form login__form">
          <p className="form__error-message">Something went wrong!</p>
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange=
          {changeInputHandler} autoFocus/>
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange=
          {changeInputHandler} />
          
          <button type="submit" className='btn primary'>Sign in</button>
        </form>
        <small>Don't have an account? <Link to='/register'>Sign up</Link></small>
      </div>
    </section>
  )
}

export default Login