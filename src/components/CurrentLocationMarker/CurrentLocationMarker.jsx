import { Marker } from "@react-google-maps/api";

export const CurrentLocationMarker = ({ position, onClick, id, grade, zIndexBase = 0 }) => {
  const labelText = grade !== null && grade !== undefined ? String(grade) : '';
  const zIndex = Math.round((position.lat + 90) * 1000) + zIndexBase * 100;

  return (
    <Marker
      label={{
        text: labelText,
        color: "black",
        fontSize: "16px",
        fontWeight: "400",
      }}
      position={position}
      icon={{
        url: '../../beet-icon.png',
        scaledSize: new window.google.maps.Size(70, 45),
        labelOrigin: new window.google.maps.Point(50, 20),
      }}
      zIndex={zIndex}
      onClick={() => onClick(id)}
    />
  );
};
