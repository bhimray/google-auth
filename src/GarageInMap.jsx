import React, { useRef } from 'react'
import './GarageInMap.css'
// import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import { Loader } from "@googlemaps/js-api-loader"
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const GarageInMap = () => {
    /* global google */

    const loader = new Loader({
        apiKey: "AIzaSyCUQZBdHSfRg0OhB58RTbgvdsUhq6q1ydM",
        version: "quarterly",
      });
      
    const center ={ lat: -34.397, lng: 150.644 }
    loader.load().then(() => {
    let map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 10,
    });
    const marker = new google.maps.Marker({
        position:center,
        map: map,
        });
    });

      
      
  return (
    <div>
        <div id='map'></div>
    </div>
  )
}

export default GarageInMap