import * as React from "react";
import {Children, cloneElement, isValidElement} from 'react'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { createRoot } from "react-dom/client";


const render = (status) => {
    return <h1>{status}</h1>;
  };


const GoogleMapWrapper= () => { //-----------App---------------
    /* global google */
    const [clicks, setClicks] = React.useState([]);
    const [zoom, setZoom] = React.useState(3); // initial zoom
    const [center, setCenter] = React.useState({
      lat: 0,
      lng: 0,
    });
  
    const onClick = (e) => {
      // avoid directly mutating state
      setClicks([...clicks, e.latLng]);
    };
  
    const onIdle = (m) => {
        console.log(m,"m in onIdle")
      console.log("onIdle");
      setZoom(m.getZoom());
      setCenter(m.getCenter().toJSON()); // error is occuring over here due to deep compare effect
    };
  
    const form = (
      <div
        style={{
          padding: "1rem",
          flexBasis: "250px",
          height: "100%",
          overflow: "auto",
        }}
      >
        <label htmlFor="zoom">Zoom</label>
        <input
          type="number"
          id="zoom"
          name="zoom"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
        <br />
        <label htmlFor="lat">Latitude</label>
        <input
          type="number"
          id="lat"
          name="lat"
          value={center.lat}
          onChange={(event) =>
            setCenter({ ...center, lat: Number(event.target.value) })
          }
        />
        <br />
        <label htmlFor="lng">Longitude</label>
        <input
          type="number"
          id="lng"
          name="lng"
          value={center.lng}
          onChange={(event) =>
            setCenter({ ...center, lng: Number(event.target.value) })
          }
        />
        <h3>{clicks.length === 0 ? "Click on map to add markers" : "Clicks"}</h3>
        {clicks.map((latLng, i) => (
          <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
        ))}
        <button onClick={() => setClicks([])}>Clear</button>
      </div>
    );
  
    return (
      <div style={{ display: "flex", height: "100%" }}>
        <Wrapper apiKey="AIzaSyCUQZBdHSfRg0OhB58RTbgvdsUhq6q1ydM" render={render}>
          <Map
            center={center}
            onClick={onClick}
            onIdle={onIdle}
            zoom={zoom}
            style={{ flexGrow: "1", height: "100vh" }}
          >
            {clicks.map((latLng, i) => (
              <Marker key={i} position={latLng} />
            ))}
          </Map>
        </Wrapper>
        {/* Basic form for controlling center and zoom of map. */}
        {form}
      </div>
    );
  };

  const Map= ({ //--------------Map-------------
    onClick,
    onIdle,
    children,
    style,
    ...options// options is all other remaining props passed to the Map components which is not called directly i.e. center and zoom
  }) => {
    console.log(options, "map component options")
    const ref = React.useRef(null);
    const [map, setMap] = React.useState();
  
    React.useEffect(() => {
        console.log(ref.current, "Map----------")
      if (ref.current && !map) {
        setMap(new window.google.maps.Map(ref.current, {}));// to reference div ref is okay but to get currrent value of ref use ref.current
      }
    }, [ref, map]);
  
    // because React does not do deep comparisons, a custom hook is used
    // see discussion in https://github.com/googlemaps/js-samples/issues/946
    useDeepCompareEffectForMaps(() => {
      if (map) {
        map.setOptions(options);
      }
    }, [map, options]);// options: center and zoom value
  
    React.useEffect(() => {
      if (map) {
        // ["click", "idle"].forEach((eventName) =>
        //   google.maps.event.clearListeners(map, eventName)
        // );
  
        if (onClick) {
          map.addListener("click", onClick);
        }
  
        if (onIdle) {
            console.log(map, "map while idling")
          map.addListener("idle", () => onIdle(map));
        }
      }
    }, [map, onClick, onIdle]);
  
    return (
      <>
        <div ref={ref} style={style} /> {/*map will appear here as referenced by the useRef which will run using useEffect with deps= map, ref */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // set the map prop on the child component
            // @ts-ignore
            return React.cloneElement(child, { map });
          }
        })}
      </>
    );
  };

  const Marker= (options) => { //------------------Marker---------------
    const [marker, setMarker] = React.useState();
  
    React.useEffect(() => {
        console.log(marker,"useEffect- marker")
      if (!marker) {
        setMarker(new google.maps.Marker());
      }
  
      // remove marker from map on unmount
      return () => {
        if (marker) {
            console.log(marker,"This is marker.map")
          marker.setMap(null);// setMap is a property of marker where null will erase the marker on map.
        }
      };
    }, [marker]);
  
    React.useEffect(() => {
      if (marker) {
        console.log(options)
        console.log(marker, "useEffect- marker, options",`${options}`)
        marker.setOptions(options);// options=>(map, position) give marker position to show on map....options carries marker position (lat, lng) along with the map information.
      }
    }, [marker, options]);
  
    return null;
  };
  
  const deepCompareEqualsForMaps = createCustomEqual(
    (deepEqual) =>{
        console.log("A AND B888888888888888888888888")
        return (
        ((a, b) => {
            console.log(a,"a",b,"b----------------------")
            if (
                a instanceof google.maps.LatLng ||
                b instanceof google.maps.LatLng
            ) {
                console.log(a,"a***********", b,"b******************")
                return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
            }
        
            // TODO extend to other types
        
            // use fast-equals for other objects
            return deepEqual(a, b);
            }
        )
    )}
    );

    let i=0;
  function useDeepCompareMemoize(val) { //---------------------useDeepCompare Memoize---------------
    const refM = React.useRef();
    i++
    console.log(val,`val----------------${i}`, refM, refM.current,"dc-memoize")
    console.log(refM.current,"refM.current")
    if (!deepCompareEqualsForMaps(val, refM.current)) {
        console.log(`val and refM.current are equal ===== ==== ===${i}`)
      refM.current = val;
    }
    return refM.current;
  }
  
  function useDeepCompareEffectForMaps( // ------------------------ useDeepComapareEffect--------------
    callback,
    dependencies
  ) {
    // console.log(callback,"callback, useDeepCompare",dependencies, "dependencies, useDeepCompare")
    // console.log(dependencies.map(useDeepCompareMemoize), "mapping-dependencies")
    React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
  }
  
//   window.addEventListener("DOMContentLoaded", () => {
//     const root = createRoot(document.getElementById("root"));
//     root.render(<GoogleMapWrapper />);
//   });
export default GoogleMapWrapper;
  