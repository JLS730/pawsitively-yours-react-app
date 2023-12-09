import React, { Fragment } from 'react'
import { useEffect, useState } from 'react'

import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'

import { firebaseConfig } from '../scripts/firebase'
import { initializeApp } from "firebase/app";
import { doc, getFirestore, getDoc, setDoc } from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import '../styles/dog-information.css'

import adoptPlaceholder from '../images/adopt-placeholder.avif'

import allAdoptionInformation from '../scripts/dog-adoption-info'

const DogInformation = () => {
    const { id } = useParams()

    const [currentDog, setCurrentDog] = useState({})
    const [randomPetsArray, setRandomPetsArray] = useState([])
    const [savePetToggle, setSavePetToggle] = useState(false)
    const [petSavedToggle, setPetSavedToggle] = useState(false)
    const [petCurrentlySavedToggle, setPetCurrentlySavedToggle] = useState(false)
    const [currentUserInformation, setCurrentUserInformation] = useState({})

    const app = initializeApp(firebaseConfig);
    const firestoreDB = getFirestore(app)

    const auth = getAuth();

    const navigate = useNavigate()
    // const { from } = useLocation()

    useEffect(() => {
        setSavePetToggle(false)
        setPetSavedToggle(false)
        setPetCurrentlySavedToggle(false)

        findCurrentDog()
        handlePetRandomizer()
        handleCurrentUserLoggedIn()

        window.scrollTo(0, 0)

        if(currentUserInformation.uid !== undefined) {
            // handleGetUserInformation()
            // console.log('Caught')
        }

        // console.log(from)

        // console.log(currentUserInformation.uid)
        // console.log(currentDog.id)
        // console.log()
    }, [id])

    async function handleGetUserInformation() {
        const docRef = doc(firestoreDB, currentUserInformation.uid, 'Favorites', 'Dogs', currentDog.name)
        const docSnap = await getDoc(docRef)
    
        if(docSnap.data() === undefined) {
            console.log('Not Favorite')
            // setPetSavedToggle(true)
            // return
        } else if(docSnap.data().favorite) {
            setPetSavedToggle(true)
            setSavePetToggle(true)
            console.log('Workking')
        }
    
        // console.log(docSnap.data())
    }

    function handleUserSubmittedInformation() {
        setDoc(doc(firestoreDB, currentUserInformation.uid, 'Favorites', 'Dogs' , currentDog.name), {
          id: currentDog.id,
          name: currentDog.name,
          gender: currentDog.gender,
          image: currentDog.primary_photo_cropped,
          favorite: true
        });
    }

    function handleCurrentUserLoggedIn() {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user;
    
            setCurrentUserInformation(user)

            // handleGetUserInformation()
            // console.log(uid)
          } else {
    
          }
        });
    }

    function findCurrentDog() {
        for(let i = 0; i < allAdoptionInformation.animals.length; i++) {
            if(allAdoptionInformation.animals[i].id == id) {
                setCurrentDog(allAdoptionInformation.animals[i])
                // console.log(currentDog)
            }
        }
    }

    function handlePetRandomizer() {
        for(let i =0; i < 4; i++) {
            setRandomPetsArray(oldArray => [...oldArray, allAdoptionInformation.animals[Math.floor(Math.random() * 60)]])
        }

        
        // console.log(randomPetsArray)
    }
    
    function HandleDogInformation() {

        // handleGetUserInformation()
        console.log('loaded')

        return (
            <Fragment>
                        {/* <button className="test" onClick={() => handleGetUserInformation()}>Test</button>
                        <button className="test" onClick={() => console.log(from)}>Test 2</button>
                        <button className="test" onClick={() => handleUserSubmittedInformation()}>Submit Test</button> */}
                        <div className="current-dog-photos-container">
                            <img src={currentDog.primary_photo_cropped === null ? adoptPlaceholder : currentDog.primary_photo_cropped.medium} alt="" />
                        </div>
                        <div className="current-dog-information-container">
                            <div className="current-dog-name-and-save-container">
                                <h2 className="current-dog-name">{currentDog.name}</h2>
                                <div className="current-dog-save-container" onMouseOver={() => {
                                    if(Object.keys(currentUserInformation).length === 0) {
                                        console.log(currentUserInformation.uid)
                                        return
                                    }

                                    handleGetUserInformation()
                                }} onClick={() => {
                                    if(currentUserInformation.uid === undefined) {
                                        navigate('/Signin')
                                    } else {
                                        handleUserSubmittedInformation()
    
                                        if(petSavedToggle) {
                                            return
                                        }
    
                                        setSavePetToggle(true)
                                        setPetSavedToggle(true)
                                        console.log('passed')                               
                                    }
                                }}>
                                    
                                    {savePetToggle === false ? <i className="fa-solid fa-heart"></i> : null}
                                    {savePetToggle === false ? <p className="current-dog-save-text">Save this pet</p> : null}

                                    {petSavedToggle === true ? <i className="fa-solid fa-heart" style={{ color: 'red' }}></i> : null}
                                    {petSavedToggle === true ? <p className="current-dog-save-text" onClick={() =>  {}}>Pet saved!</p> : null}
                                    
                                    {/* {petCurrentlySavedToggle === true ? <i className="fa-solid fa-heart" style={{ color: 'red' }}></i> : null}
                                    {petCurrentlySavedToggle === true ? <p className="current-dog-save-text">Already saved!</p> : null} */}
                                </div>
                            </div>
                            <div className="current-dog-description-container">
                                <p className="current-dog-location-text">Nestled in the heart of town, Pawsitively Yours Dog Adoption Center is conveniently located at 123 Bark Lane, welcoming visitors to embark on the journey of finding their furry companions. Our central location ensures easy access for all dog lovers seeking a lifelong connection with a canine friend.</p>
                                <p className="current-dog-description-text">{currentDog.description}</p>
                                <p className="current-dog-conclusion-text">Join us at Pawsitively Yours Dog Adoption Center, where every wagging tail tells a unique story of love and companionship, and together, we make forever homes for our furry friends.</p>
                            </div>
                            <div className="current-dog-additional-details-container">
                                <h2 className="additional-details-title-text">Additional Details</h2>
                                <div className="additional-details-container">
                                    <div className="age-detail-container">
                                        <i className="fa-solid fa-calendar-days fa-xl"></i>
                                        <p className="age-detail-text">Age</p>
                                        <p className="age">{currentDog.age}</p>
                                    </div>
                                    <div className="gender-detail-container">
                                        <i className="fa-solid fa-venus-mars fa-xl"></i>
                                        <p className="gender-detail-text">Gender</p>
                                        <p className="gender">{currentDog.gender}</p>
                                    </div>
                                    <div className="status-detail-container">
                                        <i className="fa-solid fa-clipboard fa-xl"></i>
                                        <p className="status-detail-text">Status</p>
                                        <p className="status">{currentDog.status}</p>
                                    </div>
                                    <div className="size-detail-container">
                                        <i className="fa-solid fa-ruler fa-xl"></i>
                                        <p className="size-detail-text">Size</p>
                                        <p className="size">{currentDog.size}</p>
                                    </div>
                                    <div className="mood-detail-container">
                                        <i className="fa-solid fa-face-smile fa-xl"></i>
                                        <p className="mood-detail-text">Mood</p>
                                        <p className="mood">{currentDog.tags[0]}</p>
                                    </div>
                                    <div className="id-detail-container">
                                        <i className="fa-solid fa-id-card fa-xl"></i>
                                        <p className="id-detail-text">ID</p>
                                        <p className="id">{currentDog.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="more-pets-container">
                            <h2 className="more-pets-title-text">More Pets</h2>
                            <div className="pets-container">
                                {randomPetsArray.map((info, x) => {
                                    // console.log(info)

                                    return (
                                        <Link to={`${info.id}`} className={`adoption-photo-container-${x} adoption-photo-containers`} key={`${info.id}`} onClick={() => setRandomPetsArray([])}>
                                            <img src={info.primary_photo_cropped === null ? adoptPlaceholder : info.primary_photo_cropped.large} alt="" />
                                            <div className="adoption-photo-box-shadow"></div>
                                            <div className="adoption-photo-information-container">
                                                <p className="adoption-photo-name">{`${info.name}`}</p>
                                                <p className="adoption-photo-sex-and-id">{`${info.gender}`} &bull; {`ID# ${info.id}`}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </Fragment>
        )
    }

  return (
        <div className="current-dog-container">
            {currentDog.name === undefined ? null : <HandleDogInformation />}
        </div>
  )
}

export default DogInformation