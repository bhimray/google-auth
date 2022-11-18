import React, {useMemo, useState} from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'
import usePlacesAutoComplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete'
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import './Map.css'

const Map = () => {
    const { isLoaded} = useLoadScript({
        googleMapsApiKey:"AIzaSyCUQZBdHSfRg0OhB58RTbgvdsUhq6q1ydM",
        libraries:['places']
    })
    if (!isLoaded) return <div>Loading Map...</div>
  return (
    <div>
        <MapLayout/>
    </div>
  )
}

export default Map;

function MapLayout(){
    const center = {lat:44, lng:-80}
    const [selected, setSelected] = useState(center)
    return(
        <>
        <div className="places-container">
            <PlacesAutocomplete setSelected={setSelected}></PlacesAutocomplete>
        </div>
        <GoogleMap zoom={10} center={selected} mapContainerClassName="map-container">
            <MarkerF position={selected}/>
        </GoogleMap>
        </>
    )
}

function PlacesAutocomplete({setSelected}){
    const {
        ready,
        value,
        setValue,
        suggestions:{status, data},
        clearSuggestions
    } = usePlacesAutoComplete();
    console.log(ready,"ready")

    const handleInput =(e)=>{
        setValue(e.target.value)
    }
    const handleSelect=(val)=>{
        setValue(val, false)
        getGeocode({address:val}).then((results) => {
          console.log("results", results)
          const selectedLatLng = getLatLng(results[0]);
          setSelected(selectedLatLng)
          console.log("📍 Coordinates: ", selectedLatLng);
        });
    }
    return <Combobox onSelect={handleSelect} aria-labelledby="demo">
    <ComboboxInput value={value} onChange={handleInput} disabled={!ready} />
    <ComboboxPopover>
      <ComboboxList>
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <ComboboxOption key={place_id} value={description} />
          ))}
      </ComboboxList>
    </ComboboxPopover>
  </Combobox>

}