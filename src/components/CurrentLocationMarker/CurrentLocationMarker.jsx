import {Marker} from "@react-google-maps/api";


export const CurrentLocationMarker=({position,onClick,id})=>{
    return (
        <Marker position={position} icon={{url:'beet-icon.png',scaledSize: new window.google.maps.Size(40, 40)}} onClick={()=>onClick(id)}/>
    )
}
