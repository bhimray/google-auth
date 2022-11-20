import React from 'react'
import { useLoadScript } from '@react-google-maps/api'
import Map from './Components/Map'

const libraryArray = ["places",""]
const UseLoadScript = () => {
    const {isLoaded}  = useLoadScript({
        googleMapsApiKey:"AIzaSyCUQZBdHSfRg0OhB58RTbgvdsUhq6q1ydM",
        libraries:libraryArray
    })
    if (!isLoaded) return <div>Loading.....</div>
  return (
    <div>
        <Map/>
    </div>
  )
}

export default UseLoadScript