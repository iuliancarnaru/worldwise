import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../context/CitiesContext";
import { useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const {
    position: geolocationPosition,
    getPosition: getGeolocationPosition,
    isLoading: isLoadingPosition,
  } = useGeolocation();

  const [mapPosition, setMapPosition] = useState<[number, number]>([40, 0]);
  const [searchParams, setSearchParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([Number(mapLat), Number(mapLng)]);
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getGeolocationPosition}>
          {isLoadingPosition ? "Loading..." : "User your position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities?.map(({ position, id, emoji, cityName }) => (
          <Marker position={[position.lat, position.lng]} key={id}>
            <Popup>
              <span>{emoji}</span> <span>{cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }: { position: [number, number] }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (event) => {
      navigate(`form?lat=${event.latlng.lat}&lng=${event.latlng.lng}`);
    },
  });

  return null;
}

export default Map;
