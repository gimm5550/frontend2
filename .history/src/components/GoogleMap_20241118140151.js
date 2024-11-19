import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const MIN_ZOOM_FOR_MARKERS = 14; // 마커를 표시하기 위한 최소 줌 레벨

export default function GoogleMapPage() {
    const [isLoaded, setIsLoaded] = useState(false); // API 로드 상태
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [places, setPlaces] = useState([]);
    const [zoom, setZoom] = useState(12); // 현재 줌 레벨 상태 추가
    const mapRef = useRef(null);
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

    // 출발지 선택
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

    // 도착지 선택
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                setPath((prev) => [prev[0], { lat: location.lat(), lng: location.lng() }]);
            }
        }
    };

    // 현재 화면 내 명소 가져오기
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
                onLoad={() => setIsLoaded(true)}
            >
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={{ height: "80%", width: "100%" }}
                        center={mapCenter}
                        zoom={zoom}
                        onLoad={(map) => {
                            mapRef.current = map;
                            fetchVisiblePlaces();
                        }}
                        onZoomChanged={() => {
                            if (mapRef.current) {
                                const currentZoom = mapRef.current.getZoom();
                                setZoom(currentZoom); // 줌 레벨 업데이트
                                if (currentZoom >= MIN_ZOOM_FOR_MARKERS) {
                                    fetchVisiblePlaces();
                                } else {
                                    setPlaces([]); // 줌 레벨이 낮으면 마커 삭제
                                }
                            }
                        }}
                        onBoundsChanged={() => {
                            if (mapRef.current && zoom >= MIN_ZOOM_FOR_MARKERS) {
                                fetchVisiblePlaces();
                            }
                        }}
                        onClick={(event) => {
                            const latLng = {
                                lat: event.latLng.lat(),
                                lng: event.latLng.lng(),
                            };
                            setPath((prev) => [...prev, latLng]);
                        }}
                    >
                        {/* 출발지 검색 */}
                        <Autocomplete
                            onLoad={(autocomplete) => setAutocompleteStart(autocomplete)}
                            onPlaceChanged={handlePlaceSelectedStart}
                        >
                            <input
                                type="text"
                                placeholder="출발지 검색"
                                style={{
                                    padding: "10px",
                                    margin: "10px",
                                    position: "absolute",
                                    top: "10px",
                                    left: "10px",
                                    zIndex: 1000,
                                }}
                            />
                        </Autocomplete>

                        {/* 도착지 검색 */}
                        <Autocomplete
                            onLoad={(autocomplete) => setAutocompleteEnd(autocomplete)}
                            onPlaceChanged={handlePlaceSelectedEnd}
                        >
                            <input
                                type="text"
                                placeholder="도착지 검색"
                                style={{
                                    padding: "10px",
                                    margin: "10px",
                                    position: "absolute",
                                    top: "10px",
                                    left: "220px",
                                    zIndex: 1000,
                                }}
                            />
                        </Autocomplete>

                        {/* 명소 마커 */}
                        {zoom >= MIN_ZOOM_FOR_MARKERS &&
                            places.map((place, index) => (
                                <Marker
                                    key={index}
                                    position={place.geometry.location}
                                    title={place.name}
                                    onClick={() =>
                                        alert(`명소: ${place.name}\n주소: ${place.vicinity}`)
                                    }
                                />
                            ))}

                        {/* 폴리라인 */}
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
