import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css"; 

function Map({position}) {

    return ( 
        <MapContainer center={position} zoom={13} style={{height:"50vh",width:"50vw"}}>
        <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

    // https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
/>
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>


     );
}

export default Map;