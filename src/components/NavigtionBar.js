import React from 'react'

import { useRef, useState, useEffect } from 'react'
import PropTypes from "prop-types";
import { Link } from 'react-router-dom'

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";



import '../styles/navigation-bar.css'

import brandLogo from '../images/Pawsitively Yours Transparent Logo White.png'

const NavigtionBar = () => {
  const [userSignedIn, setUserSignedIn] = useState(false)
  const [outsideClick, setOutsideClick] = useState(false)
  const [signinMenuToggle, setSigninMenuToggle] = useState(false)
  const [signedInMenuToggle, setSignedInMenuToggle] = useState(false)
  const [signinMenuHamburgerToggle, setSigninMenuHamburgerToggle] = useState(false)
  const [signedInMenuHamburgerToggle, setSignedInMenuHamburgerToggle] = useState(false)

  useEffect(() => {
    setSigninMenuToggle(false)
    setSignedInMenuToggle(false)
    handleLoginCheck()
    // console.log(auth)
  }, [userSignedIn])

  // const firebaseApp = initializeApp(firebaseConfig)
  const auth = getAuth()

  function handleLoginCheck() {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        const uid = user.uid

        setUserSignedIn(true)

        // console.log(uid)
        // console.log('Signed in =' + signedInMenuToggle)
        // console.log('user signed in =' + userSignedIn)
      }
    })
  }

  function handleSignOut() {
    signOut(auth).then(() => {
        setUserSignedIn(false)
      }).catch((error) => {
        // An error happened.
      });
    }

  function SignInDropDownMenu() {
    return (
      <OutsideAlerter onClick={() => console.log('Working 2')}>
        <div className="account-drop-down-container">
          <Link to='/Signin' style={{textDecoration: 'none', width: 46}} onClick={() => setSigninMenuToggle(false)}><p>Sign-in</p></Link>
        </div>
      </OutsideAlerter>
    )
  }
  
  function SignedInDropDownMenu() {
    return (
      <OutsideAlerter onClick={() => console.log('Working 3')}>
        <div className="account-drop-down-container-logged-in">
            <Link to='/Account' style={{textDecoration: 'none'}} onClick={() => setSignedInMenuToggle(false)}><p>Account</p></Link>
            <Link to='/' style={{textDecoration: 'none'}} onClick={() => handleSignOut()}><p>Log Out</p></Link>
        </div>
      </OutsideAlerter>
    )
  }
  
  function SignInDropDownHamburgerMenu() {
    return (
      <OutsideAlerter onClick={() => console.log('Working 2')}>
        <div className="account-drop-down-hamburger-container">
          <Link to='/Signin' style={{textDecoration: 'none', width: 46}} onClick={() => setSigninMenuHamburgerToggle(false)}><p>Sign-in</p></Link>
        </div>
      </OutsideAlerter>
    )
  }
  
  function SignedInDropDownHamburgerMenu() {
    return (
      <OutsideAlerter onClick={() => console.log('Working 3')}>
        <div className="account-drop-down-hamburger-container-logged-in">
            <Link to='/Account' style={{textDecoration: 'none'}} onClick={() => setSignedInMenuHamburgerToggle(false)}><p>Account</p></Link>
            <Link to='/' style={{textDecoration: 'none'}} onClick={() => handleSignOut()}><p>Log Out</p></Link>
        </div>
      </OutsideAlerter>
    )
  }

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setSigninMenuToggle(false)
          setSignedInMenuToggle(false)
          setSigninMenuHamburgerToggle(false)
          setSignedInMenuHamburgerToggle(false)
          setOutsideClick(true)
          
          console.log(outsideClick)
        }
      }

        document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  function OutsideAlerter(props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
  
    return <div ref={wrapperRef} onClick={props.onClick}>{props.children}</div>;
  }

  OutsideAlerter.propTypes = {
    children: PropTypes.element.isRequired
  };

  return (
    <div className="navigation-bar-container">
      <div className="navigation-bar-left">
        <Link to='/' style={{textDecoration: 'none'}} onClick={() => setSigninMenuToggle(false)}><img src={brandLogo} alt="" /></Link>
      </div>
      <div className="navigation-bar-right">
        <ul>
          <li><Link style={{textDecoration: 'none', color: 'white'}} onClick={() => console.log('')}>Contact</Link></li>
        </ul>
        <div className="navigation-bar-account-container">
          <i className="fa-solid fa-user fa-xl"></i>
          <i className="fa-solid fa-angle-down account-down-arrow" onMouseOver={() => setOutsideClick(false)} onClick={() => {
            if(userSignedIn === false) {
              if(outsideClick === true) {
                setSigninMenuToggle(false)
                setOutsideClick(false)
                return
              }
  
              signinMenuToggle === true ? setSigninMenuToggle(false) : setSigninMenuToggle(true)

              console.log('user signed out outside')
            }
            
            if(userSignedIn === true) {
              if(outsideClick === true) {
                setSignedInMenuToggle(false)
                setOutsideClick(false)
                return
              }
  
              signedInMenuToggle === true ? setSignedInMenuToggle(false) : setSignedInMenuToggle(true)

              console.log('user signed in outside')
            }
            
            console.log(signinMenuToggle)
            console.log(signedInMenuToggle)
          }}></i>
          {/* Sign-in */}
          {signinMenuToggle === false && userSignedIn === false ? null : signinMenuToggle === false && userSignedIn === true ? null : signinMenuToggle === true && userSignedIn === true ? null : <SignInDropDownMenu />}
          {signinMenuToggle === false && userSignedIn === false ? null : signedInMenuToggle === true && userSignedIn === false ? null : signedInMenuToggle === false && userSignedIn === true ? null : signedInMenuToggle === false && userSignedIn === false ? null : <SignedInDropDownMenu />}
        </div>
        
        <div className="navigation-hamburger-menu-container" onMouseOver={() => setOutsideClick(false)} onClick={() => {
            if(userSignedIn === false) {
              if(outsideClick === true) {
                setSigninMenuHamburgerToggle(false)
                setOutsideClick(false)
                return
              }
  
              signinMenuHamburgerToggle === true ? setSigninMenuHamburgerToggle(false) : setSigninMenuHamburgerToggle(true)

              console.log('user signed out outside')
            }
            
            if(userSignedIn === true) {
              if(outsideClick === true) {
                setSignedInMenuHamburgerToggle(false)
                setOutsideClick(false)
                return
              }
  
              signedInMenuHamburgerToggle === true ? setSignedInMenuHamburgerToggle(false) : setSignedInMenuHamburgerToggle(true)

              console.log('user signed in outside')
            }
            
            console.log(signinMenuToggle)
            console.log(signedInMenuToggle)
          }}>
          <div className="navigation-hamburger-menu"></div>
          {signinMenuHamburgerToggle === false && userSignedIn === false ? null : signinMenuHamburgerToggle === false && userSignedIn === true ? null : signinMenuHamburgerToggle === true && userSignedIn === true ? null : <SignInDropDownHamburgerMenu />}
          {signinMenuHamburgerToggle === false && userSignedIn === false ? null : signedInMenuHamburgerToggle === true && userSignedIn === false ? null : signedInMenuHamburgerToggle === false && userSignedIn === true ? null : signedInMenuHamburgerToggle === false && userSignedIn === false ? null : <SignedInDropDownHamburgerMenu />}
        </div>
      </div>
    </div>
  )
}

export default NavigtionBar