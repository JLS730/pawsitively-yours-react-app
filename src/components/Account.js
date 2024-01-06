import React from 'react'
import { useState, useEffect, useRef } from 'react'

import { firebaseConfig } from '../scripts/firebase'
import { initializeApp } from "firebase/app";

import { getAuth, onAuthStateChanged, deleteUser } from "firebase/auth";

import { useNavigate, Link } from 'react-router-dom';


import { doc, getFirestore, getDoc, getDocs, setDoc, deleteDoc, collection } from "firebase/firestore";

import '../styles/account.css'

import adoptPlaceholder from '../images/adopt-placeholder.avif'

const Account = () => {
  const [settingsPageToggle, setSettingsPageToggle] = useState(false) 
  const [favoritesPageToggle, setFavoritesPageToggle] = useState(true) 
  const [currentUserInformation, setCurrentUserInformation] = useState({})

  const [currentFavorites, setCurrentFavorites] = useState([])

  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const phoneNumberRef = useRef(null)
  const birthDateRef = useRef(null)
  const countryRef = useRef(null)
  const addressOneRef = useRef(null)
  const addressTwoRef = useRef(null)
  const cityRef = useRef(null)
  const stateRef = useRef(null)
  const zipCodeRef = useRef(null)
  
  const morningRef = useRef(null)
  const afternoonRef = useRef(null)
  const nightRef = useRef(null)

  const mondayRef = useRef(null)
  const tuesdayRef = useRef(null)
  const wednesdayRef = useRef(null)
  const thursdayRef = useRef(null)
  const fridayRef = useRef(null)
  const saturdayRef = useRef(null)
  const sundayRef = useRef(null)

  const navigate = useNavigate()

  const app = initializeApp(firebaseConfig);
  const firestoreDB = getFirestore(app)

  const auth = getAuth();
  const loggedInUser = auth.currentUser

  useEffect(() => {
    handleCurrentUserLoggedIn()

    if(currentUserInformation.uid !== undefined) {
      handleGetFavoritesInformation()
    }
  }, [currentUserInformation])

  function handleRefreshPage() {
    navigate(0)
  }

  async function handleFavoriteDeletion(dogName) {
    await deleteDoc(doc(firestoreDB, currentUserInformation.uid, 'Favorites', "Dogs", dogName));
  }

  async function handleGetUserInformation() {
    const docRef = doc(firestoreDB, currentUserInformation.uid, 'Information')
    const docSnap = await getDoc(docRef)

    if(docSnap.data()) {
      firstNameRef.current.value = docSnap.data().first
      lastNameRef.current.value = docSnap.data().last
      phoneNumberRef.current.value = docSnap.data().phone
      birthDateRef.current.value = docSnap.data().born
      countryRef.current.value = docSnap.data().country
      addressOneRef.current.value = docSnap.data().address1
      addressTwoRef.current.value = docSnap.data().address2
      cityRef.current.value = docSnap.data().city
      stateRef.current.value = docSnap.data().state
      zipCodeRef.current.value = docSnap.data().zip
      
      morningRef.current.checked = docSnap.data().available.time.morning
      afternoonRef.current.checked = docSnap.data().available.time.afternoon
      nightRef.current.checked = docSnap.data().available.time.night

      mondayRef.current.checked = docSnap.data().available.day.monday
      tuesdayRef.current.checked = docSnap.data().available.day.tuesday
      wednesdayRef.current.checked = docSnap.data().available.day.wednesday
      thursdayRef.current.checked = docSnap.data().available.day.thursday
      fridayRef.current.checked = docSnap.data().available.day.friday
      saturdayRef.current.checked = docSnap.data().available.day.saturday
      sundayRef.current.checked = docSnap.data().available.day.sunday
    }
  }
  
  async function handleGetFavoritesInformation() {
    const querySnapshot = await getDocs(collection(firestoreDB, currentUserInformation.uid, 'Favorites', "Dogs"));
    
    querySnapshot.forEach((doc) => {
      setCurrentFavorites((oldArray) => [...oldArray, doc.data()])
    });
  }

  function handleCurrentUserLoggedIn() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user;

        setCurrentUserInformation(user)
        console.log(uid)
      } else {
        navigate('/Signin')
      }
    });
  }

  function handleDeleteUser() {
    const result = window.confirm("Are you sure you want to delete your account?")

    if(result == true) {
      deleteUser(loggedInUser).then(() => {

        navigate('/Signin')
      }).catch((error) => {

      });
    } else {

    }
  }

  function handleUserSubmittedInformation() {
    setDoc(doc(firestoreDB, currentUserInformation.uid, 'Information'), {
      first: firstNameRef.current.value,
      last: lastNameRef.current.value,
      phone: phoneNumberRef.current.value,
      born: birthDateRef.current.value,
      country: countryRef.current.value,
      address1: addressOneRef.current.value,
      address2: addressTwoRef.current.value,
      city: cityRef.current.value,
      state: stateRef.current.value,
      zip: zipCodeRef.current.value,
      available: {
        time: {
          morning: morningRef.current.checked,
          afternoon: afternoonRef.current.checked,
          night: nightRef.current.checked
        },
        day: {
          monday: mondayRef.current.checked,
          tuesday: tuesdayRef.current.checked,
          wednesday: wednesdayRef.current.checked,
          thursday: thursdayRef.current.checked,
          friday: fridayRef.current.checked,
          saturday: saturdayRef.current.checked,
          sunday: sundayRef.current.checked,
        }
      }
    });
  }

  function FavoritesPage() {
    return (
      <div className="favorite-pet-page">
        {currentFavorites.length === 0 ? null : currentFavorites.map((dog, x) => {
            return (
              <div className={`adoption-photo-container-${x} adoption-photo-containers`}>
                  <div className="adoption-delete-button-container" onClick={(event) => {

                    handleFavoriteDeletion(dog.name)
                    event.target.parentElement.parentElement.remove()

                    setTimeout(() => {
                      
                      handleRefreshPage()
                    }, 300)
                  }}>
                    <i class="fa-sharp fa-solid fa-circle-xmark fa-2xl"></i>
                  </div>
                  <Link to={`/Dog-Information/${dog.id}`} className={`adoption-photo-container-${x} adoption-photo-containers`} key={`${dog.id}`} state={{ from: dog.name }}>
                    <img src={dog.image === null ? adoptPlaceholder : dog.image.full} alt="d" />
                  </Link>
                  <div className="adoption-photo-box-shadow"></div>
                  <div className="adoption-photo-information-container">
                      <p className="adoption-photo-name">{dog.name}</p>
                      <p className="adoption-photo-sex-and-id">{dog.gender} &#x2022; {dog.id}</p>
                  </div>
                </div>
              )
            })}
      </div>
    )
  }

  function SettingsPage() {
    return (
      <div className="settings-page">
            <div className="settings-about-you-container">
              <h2 className="about-you-title-text">About You</h2>

              <div className="about-you-container">
                <div className="about-you-first-name-container">
                  <p className="first-name-text">First Name</p>
                  <input type="text" placeholder='First Name' className="first-name-input" ref={firstNameRef} />
                </div>
                <div className="about-you-last-name-container">
                  <p className="last-name-text">Last Name</p>
                  <input type="text" placeholder='Last Name' className="last-name-input" ref={lastNameRef}/>
                </div>
                <div className="about-you-phone-container">
                  <p className="phone-text">Phone Number</p>
                  <input type="tel" placeholder='XXX-XXX-XXXX' pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" maxLength="12" className="phone-input" ref={phoneNumberRef} required />
                </div>
                <div className="about-you-birthdate-container">
                  <p className="birthdate-text">Birthdate</p>
                  <input type="date"  className="birthdate-input" ref={birthDateRef} />
                </div>
              </div>
            </div>
            <div className="settings-availability-container">
              <h2 className="contact-availability-title-text">Contact Availability</h2>
              <div className="contact-time-container">
                <h3 className="contact-time-text">Best time(s) to contact you:</h3>
                <p className="contact-time-instruction-text">Check all that apply</p>
                <div className="times-container">
                  <div className="morning-container">
                    <input type="checkbox" className="morning-checkbox" id="morning-checkbox"value='Morning' ref={morningRef} onClick={(event) => console.log(event.target.checked)} />
                    <label htmlFor="morning-checkbox">Morning</label>
                  </div>
                  <div className="afternoon-container">
                    <input type="checkbox" className="afternoon-checkbox" id="afternoon-checkbox"value='Afternoon' ref={afternoonRef} />
                    <label htmlFor="afternoon-checkbox">Afternoon</label>
                  </div>
                  <div className="night-container">
                    <input type="checkbox" className="night-checkbox" id="night-checkbox"value='Night' ref={nightRef} />
                    <label htmlFor="night-checkbox">Night</label>
                  </div>
                </div>
              </div>
              <div className="contact-day-container">
                <h3 className="contact-day-text">Best day(s) to contact you:</h3>
                <p className="contact-day-instruction-text">Check all that apply</p>
                <div className="days-container">
                  <div className="monday-container">
                    <input type="checkbox" className="monday-checkbox" id="monday-checkbox"value='Monday' ref={mondayRef} />
                    <label htmlFor="monday-checkbox">Monday</label>
                  </div>
                  <div className="tuesday-container">
                    <input type="checkbox" className="tuesday-checkbox" id="tuesday-checkbox"value='Tuesday' ref={tuesdayRef} />
                    <label htmlFor="tuesday-checkbox">Tuesday</label>
                  </div>
                  <div className="wednesday-container">
                    <input type="checkbox" className="wednesday-checkbox" id="wednesday-checkbox"value='Wednesday' ref={wednesdayRef} />
                    <label htmlFor="wednesday-checkbox">Wednesday</label>
                  </div>
                  <div className="thursday-container">
                    <input type="checkbox" className="thursday-checkbox" id="thursday-checkbox"value='Thursday' ref={thursdayRef} />
                    <label htmlFor="thursday-checkbox">Thursday</label>
                  </div>
                  <div className="friday-container">
                    <input type="checkbox" className="friday-checkbox" id="friday-checkbox"value='Friday' ref={fridayRef} />
                    <label htmlFor="friday-checkbox">Friday</label>
                  </div>
                  <div className="saturday-container">
                    <input type="checkbox" className="saturday-checkbox" id="saturday-checkbox"value='Saturday' ref={saturdayRef} />
                    <label htmlFor="saturday-checkbox">Saturday</label>
                  </div>
                  <div className="sunday-container">
                    <input type="checkbox" className="sunday-checkbox" id="sunday-checkbox"value='Sunday' ref={sundayRef} />
                    <label htmlFor="sunday-checkbox">Sunday</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-address-container">
              <h2 className="address-title-text">Address</h2>

              <div className="address-container">
                <div className="address-country-container">
                  <p className="country-text">Country</p>
                  <input type="text" placeholder='United States' className="country-input" ref={countryRef}/>
                </div>
                <div className="address-line-1-container">
                  <p className="address-line-1-text">Address line 1</p>
                  <input type="text" placeholder='Street address, P.O Box' className="address-line-1-input" ref={addressOneRef} />
                </div>
                <div className="address-line-2-container">
                  <p className="address-line-2-text">Address line 2</p>
                  <input type="text" placeholder='Apt, suite, unit, building, floor, etc.' className="address-line-2-input" ref={addressTwoRef} />
                </div>
                <div className="city-container">
                  <p className="city-text">City</p>
                  <input type="text" placeholder='' className="city-input" ref={cityRef}/>
                </div>
                <div className="state-container">
                  <p className="state-text">State</p>
                  <input type="text" placeholder='' className="state-input" ref={stateRef} />
                </div>
                <div className="zip-code-container">
                  <p className="zip-code-text">ZIP Code</p>
                  <input type="text" placeholder='' className="zip-code-input" pattern='[0-9]{3}' ref={zipCodeRef} required />
                </div>
                
              </div>
            </div>
            <button onClick={() => handleUserSubmittedInformation()}>Save Information</button>
            {loggedInUser.email === 'jlstest001' || loggedInUser.email === 'jlstest002' ? null : <button onClick={() => handleDeleteUser()}>Delete Account</button>}
          </div>
    )
  }

  return (
    <section className="account-section">
      <div className="account-container">
        <div className="account-navigation-bar-container">
          <div className="account-navigation-favorite-pets-container" onClick={() => {
            setSettingsPageToggle(false)
            setFavoritesPageToggle(true)
          }}>
            <p className="favorite-pets-text">Favorite Pets</p>
            {favoritesPageToggle === false ? null : <div className="account-navigation-container-selected"></div>}
          </div>
          <div className="account-navigation-settings-container" onClick={() => {
            handleGetUserInformation()

            setSettingsPageToggle(true)
            setFavoritesPageToggle(false)
          }}>
            <p className="settings-text">Settings</p>
            {settingsPageToggle === false ? null : <div className="account-navigation-container-selected"></div>}
          </div>
        </div>
        <div className="account-page-container">
          {favoritesPageToggle === false ? null : <FavoritesPage />}
          {settingsPageToggle === false ? null : <SettingsPage />}
        </div>
      </div>
    </section>
  )
}

export default Account