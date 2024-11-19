import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker } from "@react-google-maps/api";

const libraries = ["places"];

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [places, setPlaces] = useState([]); // 화면에 보이는 명소 상태
    const [title, setTitle] = useState(""); // 제목 상태
    const mapRef = useRef(null);
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

    // 출발지 선택
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart !== null) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...prevPath.slice(1)]);
                setMapCenter(latLng);
            }
        }
    };

    // 도착지 선택
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd !== null) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [prevPath[0], ...prevPath.slice(1, -1), latLng].filter(Boolean));
            }
        }
    };

    // 화면에 보이는 영역 내 명소 가져오기
    const fetchVisiblePlaces = () => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const request = {
            bounds,
            type: ["restaurant", "tourist_attraction"], // 음식점과 관광 명소
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(results);
            } else {
                console.error("Places API 요청 실패:", status);
            }
        });
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <div style={{ marginBottom: "10px", padding: "10px" }}>
                <Autocomplete
                    onLoad={(autocomplete) => setAutocompleteStart(autocomplete)}
                    onPlaceChanged={handlePlaceSelectedStart}
                >
                    <input
                        type="text"
                        placeholder="출발지 검색"
                        style={{ padding: "10px", marginRight: "10px", width: "200px" }}
                    />
                </Autocomplete>
                <Autocomplete
                    onLoad={(autocomplete) => setAutocompleteEnd(autocomplete)}
                    onPlaceChanged={handlePlaceSelectedEnd}
                >
                    <input
                        type="text"
                        placeholder="도착지 검색"
                        style={{ padding: "10px", width: "200px" }}
                    />
                </Autocomplete>
            </div>
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                <GoogleMap
                    mapContainerStyle={{ height: "80%", width: "100%" }}
                    center={mapCenter}
                    zoom={12}
                    onLoad={(map) => {
                        mapRef.current = map;
                        fetchVisiblePlaces(); // 초기 로드 시 화면 내 명소 가져오기
                    }}
                    onBoundsChanged={fetchVisiblePlaces} // 화면 범위 변경 시 호출
                >
                    {path.length > 1 && (
                        <Polyline
                            path={path}
                            options={{
                                editable: true,
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                            }}
                        />
                    )}
                    {places.map((place, index) => (
                        <Marker
                            key={index}
                            position={place.geometry.location}
                            title={place.name}
                            onClick={() => alert(`명소: ${place.name}\n주소: ${place.vicinity}`)}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
