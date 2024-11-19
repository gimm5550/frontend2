import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker } from "@react-google-maps/api";

const libraries = ["places"];

export default function GoogleMapPage() {
    const [isLoaded, setIsLoaded] = useState(false); // API 로드 상태
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [places, setPlaces] = useState([]);
    const mapRef = useRef(null);
    const googleMapsApiKey = "YOUR_API_KEY_HERE";

    const handlePlaceSelectedStart = () => {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                setPath((prev) => [{ lat: location.lat(), lng: location.lng() }, ...prev.slice(1)]);
                setMapCenter({ lat: location.lat(), lng: location.lng() });
            }
        }
    };

    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                setPath((prev) => [prev[0], { lat: location.lat(), lng: location.lng() }]);
            }
        }
    };

    const fetchVisiblePlaces = () => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const request = {
            bounds,
            type: ["restaurant", "tourist_attraction"],
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(results);
            }
        });
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <LoadScript
                googleMapsApiKey={googleMapsApiKey}
                libraries={libraries}
                onLoad={() => setIsLoaded(true)} // 로드 상태 업데이트
            >
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={{ height: "80%", width: "100%" }}
                        center={mapCenter}
                        zoom={12}
                        onLoad={(map) => {
                            mapRef.current = map;
                            fetchVisiblePlaces();
                        }}
                        onBoundsChanged={fetchVisiblePlaces}
                    >
                        <Autocomplete
                            onLoad={(autocomplete) => setAutocompleteStart(autocomplete)}
                            onPlaceChanged={handlePlaceSelectedStart}
                        >
                            <input
                                type="text"
                                placeholder="출발지 검색"
                                style={{ padding: "10px", marginBottom: "10px", width: "200px" }}
                            />
                        </Autocomplete>
                        <Autocomplete
                            onLoad={(autocomplete) => setAutocompleteEnd(autocomplete)}
                            onPlaceChanged={handlePlaceSelectedEnd}
                        >
                            <input
                                type="text"
                                placeholder="도착지 검색"
                                style={{ padding: "10px", marginBottom: "10px", width: "200px" }}
                            />
                        </Autocomplete>

                        {places.map((place, index) => (
                            <Marker
                                key={index}
                                position={place.geometry.location}
                                title={place.name}
                            />
                        ))}

                        {path.length > 1 && (
                            <Polyline
                                path={path}
                                options={{
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 1.0,
                                    strokeWeight: 2,
                                }}
                            />
                        )}
                    </GoogleMap>
                )}
            </LoadScript>
        </div>
    );
}
