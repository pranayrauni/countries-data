import React, { useEffect, useState } from 'react'
import './CountryDetail.css'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import CountryDetailShimmer from './CountryDetailShimmer'

export default function CountryDetail() {
  
  const params = useParams()
  
  const countryName = params.country

  const {state} = useLocation()       
  

  const [countryData, setCountryData] = useState({})    

  const [notFound, setNotFound] = useState(false)    
  const [isDark] = useTheme()

            


  function updateCountryData(data){
    setCountryData({
      name: data.name.common || data.name,
      nativeName: Object.values(data.name.nativeName || {})[0]?.common,   
      region: data.region,
      subregion: data.subregion,
      capital: data.capital,
      tld: data.tld,
      flag: data.flags.svg,
      languages: Object.values(data.languages || {}).join(', '),
      borders: [],
      currencies: Object.values(data.currencies || {})
          .map((currency) => currency.name)
          .join(', '),
    })

    if(!data.borders){
      data.borders = []
    }

    Promise.all(data.borders.map((border) => {
      return fetch(`https://restcountries.com/v3.1/alpha/${border}`)
      .then((res) => res.json())
      .then(([borderCountry]) => borderCountry.name.common)
    })).then((borders) => {
      // console.log(borders);
      setTimeout(() => setCountryData((prevState) => ({...prevState, borders})))
    }) 
  }

  useEffect(() => {

    if(state) {
      updateCountryData(state)
      return
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then(res => res.json())
    .then(([data]) => {
      
      updateCountryData(data)     
      setNotFound(true)
    })
  }, [countryName])

  if(notFound){
    return <div>country not found</div>
  }

  return  (
    <main className={`${isDark ? 'dark' : ''}`}>

      

      <div className="country-details-container">
        <span className="back-button" onClick={() => history.back()}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>
        {countryData === null ? (
          <CountryDetailShimmer />
        ) : (
        <div className="country-details">
          <img src={countryData.flag} alt={`${countryData.name} flag`} />
          <div className="details-text-container">
            <h1>{countryData.name}</h1>
            <div className="details-text">
              <p><b>Native Name: {countryData.nativeName}</b><span className="native-name"></span></p>
              <p><b>Population: {countryData.population}</b><span className="population"></span></p>
              <p><b>Region: {countryData.region}</b><span className="region"></span></p>
              <p><b>Sub Region: {countryData.subregion}</b><span className="sub-region"></span></p>
              <p><b>Capital: {countryData.capital?.join(', ')}</b><span className="capital"></span></p>
              <p>
                <b>Top Level Domain: {countryData.tld}</b><span className="top-level-domain"></span>
              </p>
              <p><b>Currencies: {countryData.currencies}</b><span className="currencies"></span></p>
              <p><b>Languages: {countryData.languages}</b><span className="languages"></span></p>
            </div>
            {countryData.borders?.length !==0 && <div className="border-countries"><b>Border Countries: </b>&nbsp;
                {
                   
                  countryData.borders?.map((border) => <Link key={border} to={`/${border}`}>{border}</Link>)
                }
            </div>}
          </div>
        </div>
        )}
      </div>
    </main>
  )
}
