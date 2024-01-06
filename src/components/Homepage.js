import React from 'react'

import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

import dogParkBanner from '../images/dog-placeholder-500x500-1.png'
import adoptPlaceholder from '../images/adopt-placeholder.avif'
import noResultsImage from '../images/no-results-puppy.png'

import allAdoptionInformation from '../scripts/dog-adoption-info'
import '../styles/homepage.css'

const Homepage = () => {
    const [pageResultCount, setPageResultCount] = useState(20)
    const [currentFilter, setCurrentFilter] = useState([])
    const [currentFilterArray, setCurrentFilterArray] = useState([])
    const [filterToggle, setFilterToggle] = useState(false)
   
    const searchInputRef = useRef(null)

    useEffect(() => {
        if(pageResultCount === 20) {
            window.scrollTo(0, 0)
        }
    }, [pageResultCount, filterToggle, currentFilterArray])

    function handleCurrentPageCount() {
        if(pageResultCount >= allAdoptionInformation.length) {
            return
        } else if (pageResultCount === 40) {
            setPageResultCount(pageResultCount + 20)

            // remove 'Load More' Button
        } else {
            setPageResultCount(pageResultCount + 20)
        }

    }

    function handlePageFilter(search) {
        let searchTerm = search.toLowerCase().split('')
        searchTerm[0] = searchTerm[0].toUpperCase()

        const finalSearchTerm = searchTerm.join('')

        setPageResultCount(20)

        if(finalSearchTerm == 'Male' || finalSearchTerm == 'Female') {
            let sexFilterArray = allAdoptionInformation.animals.filter((dog) => {
                return dog.gender === finalSearchTerm
            })
    
            setCurrentFilter(sexFilterArray)
    
            if(filterToggle === true) {
                return
            }
            
            setFilterToggle(!filterToggle)
        } else if(finalSearchTerm === 'Puppy' || finalSearchTerm === 'Young' || finalSearchTerm === 'Adult' || finalSearchTerm === 'Senior') {
            let ageFilterArray = allAdoptionInformation.animals.filter((dog) => {
                return dog.age === finalSearchTerm
            })
    
            setCurrentFilter(ageFilterArray)
    
            if(filterToggle === true) {
                return
            }
            
            setFilterToggle(!filterToggle)
        } else if(finalSearchTerm === 'Small' || finalSearchTerm === 'Medium' || finalSearchTerm === 'Large' || finalSearchTerm === 'Extra Large') {
            let sizeFilterArray = allAdoptionInformation.animals.filter((dog) => {
                return dog.size === finalSearchTerm
            })
    
            setCurrentFilter(sizeFilterArray)
    
            if(filterToggle === true) {
                return
            }
            
            setFilterToggle(!filterToggle)
        } else if(finalSearchTerm) {
            let nameFilterArray = allAdoptionInformation.animals.filter((dog) => {
                return dog.name === finalSearchTerm
            })
    
            setCurrentFilter(nameFilterArray)
    
            if(filterToggle === true) {
                return
            }
            
            setFilterToggle(!filterToggle)
        } else {

        }
    }

    function handleClearFilter() {
        setFilterToggle(false)
        setCurrentFilter([])
    }

    function NoDogsFound() {
        return (
            <div className='dog-adoption-no-results-container'>
                <h2 className="no-results-title-text">No Results Found</h2>
                <img src={noResultsImage} alt="" />
            </div>
        )
    }

  return (
    <div className="homepage-container">
        <div className="homepage-banner-container">
            <img src={dogParkBanner} alt="" />
            <div className="homepage-banner-text-container">
                <p className="homepage-banner-top">"Where Love Meets a Wagging Tail!"</p>
                <p className="homepage-banner-bottom">- Pawsitively Yours</p>
            </div>
        </div>
        <section className="homepage-information-container">
            <h2 className="homepage-information-title">Adopt a Dog</h2>
            <p className="homepage-information-hours">Visit Pawsitively Yours Dog Adoption Center at 123 Bark Lane from Monday to Saturday, 9 AM to 5 PM, and discover your new canine companion during our dedicated hours.</p>
            <p className="homepage-information-reminder">Don't forget to bring a leash and some treats to the center - your essentials for a tail-wagging meet-and-greet with your potential new best friend!</p>
            <p className="homepage-information-virtual">Discover the joy of adoption from anywhere – virtual adoptions are still available at Pawsitively Yours Dog Adoption Center, connecting you with your future furry friend no matter where you are!</p>
            <p className="homepage-information-conclusion">At Pawsitively Yours Dog Adoption Center, our dogs are not just pets; they're incredible companions with boundless love, loyalty, and charm, waiting to bring joy and warmth into your life.</p>
            <blockquote className="homepage-information-restrictions" cite=''>
                <p>Before leashing up for a visit, kindly ensure you're in the know – check the local county dog restrictions to ensure a paw-sitively smooth experience at our adoption center!</p>
            </blockquote>
            <p className="homepage-information-website-cookies">Like dogs and cookies, a website is best enjoyed with all its treats – don't forget to turn on your browser cookies for the full fetching experience at Pawsitively Yours Dog Adoption Center!</p>
        </section>
        <section className="dog-adoption-container">
            <div className="dog-adoption-search-container">
                <div className="dog-adoption-search-container-left">
                    <div className="dog-adoption-search-input-container">
                        <input type="text" className="dog-adoption-search-input" placeholder='Search by pet size, age or gender' ref={searchInputRef} onKeyDown={(event) => event.key === 'Enter' ? handlePageFilter(searchInputRef.current.value) : null}/>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                <div className="dog-adoption-search-container-right">
                    

                    <div className="dog-adoption-clear-all-btn-container">
                        <button className="clear-all-btn" onClick={() => handleClearFilter()}>Clear Search</button>
                    </div>
                </div>
            </div>
            <div className="dog-adoption-photo-container">
                {currentFilter.length === 0 && filterToggle === true ? <NoDogsFound /> : null}

                {filterToggle === true ? null : allAdoptionInformation.animals.slice(0, pageResultCount).map((info, x) => {
                    return (
                        <Link to={`Dog-Information/${info.id}`} className={`adoption-photo-container-${x} adoption-photo-containers`} key={`${info.id}`} state={{ from: info.name }}>
                            <img src={info.primary_photo_cropped === null ? adoptPlaceholder : info.primary_photo_cropped.large} alt="" />
                            <div className="adoption-photo-box-shadow"></div>
                            <div className="adoption-photo-information-container">
                                <p className="adoption-photo-name">{`${info.name}`}</p>
                                <p className="adoption-photo-sex-and-id">{`${info.gender}`} &bull; {`ID# ${info.id}`}</p>
                            </div>
                        </Link>
                    )
                })}
                
                {filterToggle === false ? null : currentFilter.slice(0, pageResultCount).map((info, x) => {
                    return (
                        <Link to={`Dog-Information/${info.id}`} className={`adoption-photo-container-${x} adoption-photo-containers`} key={`${info.id}`}>
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
            {filterToggle === false && pageResultCount < allAdoptionInformation.animals.length ? <button className="dog-adoption-load-more-btn" onClick={() => handleCurrentPageCount()}>Load More Pets</button> : null}
            {filterToggle === true && pageResultCount <= currentFilter.length ? <button className="dog-adoption-load-more-btn" onClick={() => handleCurrentPageCount()}>Load More Pets</button> : null}
            
        </section>
    </div>
  )
}

export default Homepage