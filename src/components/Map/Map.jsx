import React, { useCallback, useMemo, useState, useRef } from "react";
import { GoogleMap, MarkerClustererF } from "@react-google-maps/api";
import { defaultTheme } from "./Theme";
import { CurrentLocationMarker } from "../CurrentLocationMarker/CurrentLocationMarker";
import { Modal } from "../Modal/Modal";
import { Gallery } from "../Gallery/Gallary";
import { useBorsch } from "../../context/BorschContext";
import style from "./Map.module.scss";
import { AddBorsch } from "../AddBorsch/AddBorsch";
import RestaurantIcon from "./restaurant.svg";

const containerStyle = { width: "100%", height: "100%" };

const MIN_ZOOM = 12;
const MAX_ZOOM = 20;
const HIDE_ZOOM = 13;

const defoultOptions = {
  gestureHandling: "greedy", 
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
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
};

export const MODES = {
  MOVE: 0,
  SET_MARKER: 1,
};

export const Map = ({ center, mode, places, onMarkerAdd }) => {
  const [isActiveAbout, setIsActiveAbout] = useState(false);
  const [isActiveAddForm, setIsActiveAddForm] = useState(false);
  const [newMarker, setIsNewMarker] = useState(null);
  const [place, setIsPlace] = useState(null);
  const [newMarkerData, setNewMarkerData] = useState(null);

  const { getAveragePlaceRating } = useBorsch();

  const mapRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(17);
  const [, forceUpdate] = useState(0);

  // ----------------------------------------------------
  //  FETCH PLACE DATA
  // ----------------------------------------------------
  const fetchPlaceData = async (lat, lng) => {
    try {
      // Nearby Search
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
              circle: {
                center: { latitude: lat, longitude: lng },
                radius: 50,
              },
            },
          }),
        }
      );

      const nearbyData = await nearbyRes.json();
      if (nearbyData.places?.length) return nearbyData.places[0];

      // Text Search fallback
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
              circle: {
                center: { latitude: lat, longitude: lng },
                radius: 50,
              },
            },
          }),
        }
      );

      const textData = await textRes.json();
      if (textData.places?.length) return textData.places[0];

      // Geocode fallback
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_API_KEY_MAP}`
      );

      const geoData = await geoRes.json();
      if (geoData.results?.length) {
        return {
          id: `${lat}-${lng}`,
          displayName: { text: "Місце" },
          formattedAddress: geoData.results[0].formatted_address,
          location: { latitude: lat, longitude: lng },
        };
      }

      return null;
    } catch (err) {
      console.error("❌ Error fetchPlaceData:", err);
      return null;
    }
  };

  // ----------------------------------------------------
  // SAVE BOUNDS
  // ----------------------------------------------------
  const saveCornersToLocalStorage = (map) => {
    const bounds = map.getBounds();
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

  // ----------------------------------------------------
  // MAP LOAD
  // ----------------------------------------------------
  const onLoad = useCallback((map) => {
    mapRef.current = map;

    setZoomLevel(map.getZoom());
    saveCornersToLocalStorage(map);

    // Контроль зума
    map.addListener("zoom_changed", () => {
      let z = map.getZoom();
      if (z < MIN_ZOOM) {
        map.setZoom(MIN_ZOOM);
        z = MIN_ZOOM;
      }
      setZoomLevel(z);
      forceUpdate((v) => v + 1);
    });

    map.addListener("bounds_changed", () => {
      saveCornersToLocalStorage(map);
    });
  }, []);

  const onUnmount = () => {
    mapRef.current = null;
  };

  // ----------------------------------------------------
  // ADD MARKER
  // ----------------------------------------------------
  const changeIsActiveAddForm = () => {
    setIsActiveAddForm((p) => !p);
  };

  const onAddMarker = () => {
    onMarkerAdd(newMarker);
    changeIsActiveAddForm();
  };

  const onClickMap = useCallback(
    async (loc) => {
      if (mode !== MODES.SET_MARKER) return;

      const lat = loc.latLng.lat();
      const lng = loc.latLng.lng();

      setIsNewMarker({ lat, lng });
      changeIsActiveAddForm();

      const place = await fetchPlaceData(lat, lng);

      if (place) {
        setNewMarkerData(place.formattedAddress || "Адреса не визначена");
        setIsPlace({
          id: place.id,
          name: place.displayName?.text || "Назва не визначена",
          address: place.formattedAddress,
          location: {
            lat: place.location.latitude,
            lng: place.location.longitude,
          },
          type: place.primaryType || null,
          types: place.types || [],
          photos: place.photos || [],
          hours: place.regularOpeningHours || null,
        });
      } else {
        setNewMarkerData("Адреса не визначена");
      }
    },
    [mode]
  );

  // ----------------------------------------------------
  // CLICK MARKER
  // ----------------------------------------------------
  const onClickMarker = (id) => {
    const found = places.find((p) => p.id === id);
    if (found) setIsPlace(found);
    setIsActiveAbout((p) => !p);
  };

  const getAverageOverallRating = (id) => getAveragePlaceRating(id);

  // ----------------------------------------------------
  // CLUSTER ICONS
  // ----------------------------------------------------
  const clusterStyles = useMemo(
    () => [
      {
        url: RestaurantIcon,
        width: 40,
        height: 40,
        textColor: "#A71E5B",
        textSize: 20,
        anchorText: [0, 25],
      },
      {
        url: RestaurantIcon,
        width: 50,
        height: 50,
        textColor: "#A71E5B",
        textSize: 22,
        anchorText: [0, 25],
      },
      {
        url: RestaurantIcon,
        width: 60,
        height: 60,
        textColor: "#A71E5B",
        textSize: 24,
        anchorText: [0, 25],
      },
    ],
    []
  );

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
        {/* МАРКЕРЫ ПОКАЗЫВАЕМ ТОЛЬКО ПРИ КРУПНОМ ZOOM */}
        {zoomLevel > HIDE_ZOOM && (
          <MarkerClustererF
            options={{
              minimumClusterSize: 2,
              gridSize: 50,
              maxZoom: MAX_ZOOM,
              styles: clusterStyles,
            }}
          >
            {(clusterer) =>
              places.map((p) => (
                <CurrentLocationMarker
                  key={p.id}
                  position={p.location}
                  id={p.id}
                  onClick={onClickMarker}
                  grade={getAverageOverallRating(p.id)}
                  zIndexBase={zoomLevel}
                  zoomLevel={zoomLevel}
                  clusterer={clusterer}
                />
              ))
            }
          </MarkerClustererF>
        )}

        {isActiveAbout && (
          <Modal onClose={onClickMarker}>
            <Gallery
              onClose={onClickMarker}
              id_place={place.id}
              place={place}
            />
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
