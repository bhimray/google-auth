import logo from './logo.svg';
import './App.css';
import GoogleAuth from './GoogleAuth';
import Map from './Map';
import GarageInMap from './GarageInMap';
import MarkerClusters from './markerClusters';
import GoogleMapWrapper from './googleMapWrapper';
import UseLoadScript from './UseLoadScript';

// https://roads.googleapis.com/v1/snapToRoads?path=-35.27801,149.12958|-35.28032,149.12907|-35.28099,149.12929|-35.28144,149.12984|-35.28194,149.13003|-35.28282,149.12956|-35.28302,149.12881|-35.28473,149.12836 &interpolate=true &key=AIzaSyCUQZBdHSfRg0OhB58RTbgvdsUhq6q1ydM
export default function App() {
  return (
    <div className="App">
      {/* <GoogleAuth/> */}
      {/* <Map/> */}
      {/* <GarageInMap/> */}
      {/* <MarkerClusters/> */}
      {/* <GoogleMapWrapper/> */}
      <UseLoadScript/>
    </div>
  );
}

