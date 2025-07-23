import {Marker} from "@react-google-maps/api";


export const CurrentLocationMarker=({position,onClick,id,grade})=>{
    return (    
        <Marker 
            label={{
            text: String(grade), 
            color: "black",
            fontSize: "16px",    
            fontWeight: "regular",
            
            }}
            position={position} 
            icon={{url:'beet-icon.png',scaledSize: new window.google.maps.Size(70, 45),
                labelOrigin: new window.google.maps.Point(50,20) 
            }} 
            onClick={()=>onClick(id)}
          />
                
    )
}
