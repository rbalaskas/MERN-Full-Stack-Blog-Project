import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Register.css'
import '../index.css'
const Register = () => {

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const changeInputHandler = (e) =>{
    setUserData(prevState =>{
      return {...prevState, [e.target.name]: e.target.value }
    })
  }


  return (
    <section className="register" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      <div className="container">
        <h2>Sign up</h2>
        <form className="form register__form">
          <p className="form__error-message">Something went wrong!</p>
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange=
          {changeInputHandler} autoFocus/>
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange=
          {changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange=
          {changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange=
          {changeInputHandler} />
          <button type="submit" className='btn primary'>Sign up</button>
        </form>
        <small>Already have an account? <Link to='/login'>Sign in</Link></small>
      </div>
    </section>
  )
}

export default Register