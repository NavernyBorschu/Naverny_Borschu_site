import { Marker } from "@react-google-maps/api";

export const CurrentLocationMarker = ({ position, onClick, id, grade, zIndexBase = 0, zoomLevel = 17, clusterer }) => {
  const labelText = grade !== null && grade !== undefined ? String(grade) : '';

  // Consistent stacking independent of render order
  const zIndex = Math.round((position.lat + 90) * 1000) + zIndexBase * 100;

  // Size and label position adapt to zoom (helps reduce collisions visually)
  const size =
    zoomLevel >= 17 ? { w: 74, h: 48 } :
    zoomLevel >= 15 ? { w: 66, h: 44 } :
    { w: 58, h: 40 };

  // Deterministic small jitter per marker (reduces perfect overlaps at same coords)
  const hash = typeof id === 'string'
    ? id.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
    : Math.floor((position.lat + position.lng) * 100000);
  const jitterX = (hash % 7) - 3; // [-3..3] px
  const jitterY = ((hash >> 3) % 7) - 3; // [-3..3] px

  // Base label origin near the center-top of the icon
  const baseLabelOrigin = { x: Math.round(size.w * 0.72), y: Math.round(size.h * 0.44) };

  const labelOrigin = new window.google.maps.Point(
    baseLabelOrigin.x + jitterX,
    baseLabelOrigin.y + jitterY
  );

  // Font size slightly adjusts with zoom for readability
  const fontSize =
    zoomLevel >= 17 ? "16px" :
    zoomLevel >= 15 ? "15px" :
    "14px";

  return (
    <Marker
      clusterer={clusterer}
      label={{
        text: labelText,
        color: "black",
        fontSize,
        fontWeight: "400",
      }}
      position={position}
      icon={{
        url: `${process.env.PUBLIC_URL}/beet-icon.png`,
        scaledSize: new window.google.maps.Size(size.w, size.h),
        labelOrigin,
      }}
      zIndex={zIndex}
      onClick={() => onClick(id)}
    />
  );
};
