import React, { useCallback, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { defaultTheme } from "./Theme";
import { CurrentLocationMarker } from "../CurrentLocationMarker/CurrentLocationMarker";
import { Modal } from "../Modal/Modal";
import { Gallery } from "../Gallery/Gallary";
import borsch from "../../data/borsch.json";
import style from "./Map.module.css";
import { AddBorsch } from "../AddBorsch/AddBorsch";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defoultOptions = {
  panControl: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  clickableIcons: false,
  keyboardShortcuts: false,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  fullscreenControl: false,
  styles: defaultTheme,
};

export const MODES = {
  MOVE: 0,
  SET_MARKER: 1,
};

export const Map = ({ center, mode, places, onMarkerAdd }) => {
  const [isActiveAbout, setIsActiveAbout] = useState(false);
  const [isActiveAddForm, setIsActiveAddForm] = useState(false);
  const [newMarker, setIsNewMarker] = useState();
  const [place, setIsPlace] = useState();
  const mapRef = React.useRef(undefined);
  const [newMarkerData, setNewMarkerData] = useState(null);
  
  const [zoomLevel, setZoomLevel] = useState(17);
  const [, forceUpdate] = useState(0);

  const saveCornersToLocalStorage = (mapInstance) => {
    const bounds = mapInstance.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const corners = {
      topLeft: { lat: ne.lat(), lng: sw.lng() },
      topRight: { lat: ne.lat(), lng: ne.lng() },
      bottomLeft: { lat: sw.lat(), lng: sw.lng() },
      bottomRight: { lat: sw.lat(), lng: ne.lng() },
    };

    localStorage.setItem("mapCorners", JSON.stringify(corners));
  };

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setZoomLevel(map.getZoom());
    saveCornersToLocalStorage(map);

    map.addListener("bounds_changed", () => {
      saveCornersToLocalStorage(map);
    });

    map.addListener("zoom_changed", () => {
      setZoomLevel(map.getZoom());
      forceUpdate((v) => v + 1);
    });
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = undefined;
  }, []);

  const onAddMarker = () => {
    onMarkerAdd(newMarker);
    changeIsActiveAddForm();
  };

  const changeIsActiveAddForm = useCallback(() => {
    setIsActiveAddForm((prev) => !prev);
  }, []);

  
  const fetchPlaceData = async (lat, lng) => {
  try {
    const nearbyRes = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.REACT_APP_API_KEY_MAP,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.types,places.photos,places.regularOpeningHours",
        },
        body: JSON.stringify({
          includedTypes: ["restaurant", "cafe", "bar"],
          maxResultCount: 1,
          locationRestriction: {
            circle: { center: { latitude: lat, longitude: lng }, radius: 50 },
          },
        }),
      }
    );

    const nearbyData = await nearbyRes.json();
    if (nearbyData.places && nearbyData.places.length > 0) {
      return nearbyData.places[0];
    }

    // Если Nearby ничего не нашёл → Text Search
    const textRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.REACT_APP_API_KEY_MAP,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.primaryType,places.types,places.photos,places.regularOpeningHours",
        },
        body: JSON.stringify({
          textQuery: `${lat},${lng}`,
          locationBias: {
            circle: { center: { latitude: lat, longitude: lng }, radius: 50 },
          },
        }),
      }
    );

    const textData = await textRes.json();
    if (textData.places && textData.places.length > 0) {
      return textData.places[0];
    }

    // Если даже searchText пустой → fallback на geocode
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_API_KEY_MAP}`
    );
    const geoData = await geoRes.json();
    if (geoData.results && geoData.results.length > 0) {
      return {
        id: `${lat}-${lng}`,
        displayName: { text: "Місце" },
        formattedAddress: geoData.results[0].formatted_address,
        location: { latitude: lat, longitude: lng },
      };
    }

    return null;
  } catch (err) {
    console.error("❌ Помилка при пошуку:", err);
    return null;
  }
};


  const onClickMap = useCallback(
  async (loc) => {
    if (mode === MODES.SET_MARKER) {
      const lat = loc.latLng.lat();
      const lng = loc.latLng.lng();
      const position = { lat, lng };

      setIsNewMarker(position);
      changeIsActiveAddForm();

      const place = await fetchPlaceData(lat, lng);

      if (place) {
        setNewMarkerData(place.formattedAddress || "Адреса не визначена");       

        
        const newPlaceData = {
          id: place.id,
          name: place.displayName?.text || place.name || "Назва не визначена",
          address: place.formattedAddress,
          location: {
            lat: place.location.latitude,
            lng: place.location.longitude,
          },
          type: place.primaryType || null,
          types: place.types || [],
          photos: place.photos || [],
          hours: place.regularOpeningHours || null,
        };

        setIsPlace(newPlaceData);        
      } else {
        setNewMarkerData("Адреса не визначена");
      }
    }
  },
  [mode, changeIsActiveAddForm]
);


  const onClickMarker = (id) => {
    const found = places.find((place) => place.id === id);
    if (found) setIsPlace(found);
    setIsActiveAbout((prev) => !prev);
  };

  const getAverageOverallRating = (borsch, placeId) => {
    const filtered = borsch.filter((item) => item.place_id === placeId);
    if (filtered.length === 0) return null;
    const total = filtered.reduce((sum, item) => sum + parseFloat(item.overall_rating), 0);
    return (total / filtered.length).toFixed(1);
  };

  return (
    <div className={style.container}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomLevel}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={defoultOptions}
        onClick={onClickMap}
      >
        {places.map((pos) => (
          <CurrentLocationMarker
            key={pos.id}
            position={pos.location}
            id={pos.id}
            onClick={onClickMarker}
            grade={getAverageOverallRating(borsch, pos.id)}
            zIndexBase={zoomLevel}
          />
        ))}

        {isActiveAbout && (
          <Modal onClose={onClickMarker}>
            <Gallery onClose={onClickMarker} id_place={place.id} place={place} />
          </Modal>
        )}

        {isActiveAddForm && (
          <Modal onClose={changeIsActiveAddForm}>
            <AddBorsch
              onClick={onAddMarker}
              placeData={newMarkerData}
              onClose={changeIsActiveAddForm}                       
              place={place}
            />
          </Modal>
        )}
      </GoogleMap>
    </div>
  );
};
