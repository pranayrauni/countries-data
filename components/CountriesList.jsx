import React, { useEffect, useState } from 'react'
import CountryCard from './CountryCard'
import CountriesListShimmer from './CountriesListShimmer'


export default function CountriesList({query}) {
  
  const [countriesData, setCountriesData] = useState([])
  const [count, setCount] = useState(0)         

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags,population,region,languages,subregion,borders,tld')
      .then((res) => res.json())
      .then((data) => {
        setCountriesData(data)
      })


      // return () => {
      //   console.log("cleanup function called")       
      // }


  }, [])        
  useEffect(() => {
    
  }, [count, countriesData])      


  const array = countriesData.filter((country) => country.name.common.toLowerCase().includes(query) || country.region.toLowerCase().includes(query)).map((country) => {

    return <CountryCard
      key={country.name.common}        
      name={country.name.common}
      flag={country.flags.svg}
      population={country.population.toLocaleString('en-IN')}
      region={country.region}
      capital={country.capital?.[0]}
      data={country}
    />
  }) 

  

  

  if(countriesData.length === 0){
    return <CountriesListShimmer />
  }

  return (
    <>
      <div className='countries-container'>
        {array}
      </div>
    </>
  )
}
