import React from 'react'
import { useRef, useState, useEffect } from 'react';

import '../styles/signin.css'
import { Link, useNavigate } from 'react-router-dom'

import { getAuth, signInWithEmailAndPassword,  onAuthStateChanged, signOut} from "firebase/auth";

const Signin = () => {
    const auth = getAuth()

    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)

    const [passwordIncorrectToggle, setPasswordIncorrectToggle] = useState(false)
    const [userLoggedIn, setUserLoggedIn] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        handleUserCheck()
    }, [userLoggedIn])
    
    function handleUserSignIn(email, password) {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

            const user = userCredential.user;

            console.log('signed in')

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            setPasswordIncorrectToggle(true)
            console.log('Hit')
        });
    }

    function handleUserCheck() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;
              const currentUser = user;

              if(user) {
                navigate('/')
                }

              console.log(currentUser)
              console.log(uid)
            } else {

            }
        });
    }

  return (
    <div className="login-container">
        <div className="login-credentials-container">
            <div className="login-credentials-intro-container">
                <div className="login-credentials-user-container">
                    <i className="fa-solid fa-user fa-2xl"></i>
                </div>
                <p className="login-credentials-intro-text">Have an account?</p>
            </div>
            <div className="login-credentials-input-container">
                <input type="text" className="login-credentials-input-email" placeholder='Email Address' ref={emailInputRef}/>
                <input type="password" className="login-credentials-input-password" placeholder='Password' ref={passwordInputRef}/>
                <div className="login-credentials-help-container">
                    <div className="login-credentials-remember-me-container">
                        <input type="checkbox" id="remember-me" name="remember-me" value="Bike" />
                        <label for="remember-me">Remember Me</label>
                    </div>
                    <Link><p className="login-credentials-forgrot-password">Forgot Password?</p></Link>
                </div>
                {passwordIncorrectToggle === false ? null : <h2 className='login-credentials-incorrect-text'>Email and/or Password Incorrect</h2>}
                <div className="login-credentials-sign-in-btn-container">
                    <button className="login-credentials-sign-in-btn" onClick={() => {
                        handleUserSignIn(emailInputRef.current.value, passwordInputRef.current.value)

                        emailInputRef.current.value = ''
                        passwordInputRef.current.value = ''
                    }}>Sign-in</button>
                </div>
                <Link to={'/CreateAccount'} style={{textDecoration: 'none'}}><p className="login-credentials-create-account">Create An Account?</p></Link>
            </div>
        </div>
    </div>
  )
}

export default Signin