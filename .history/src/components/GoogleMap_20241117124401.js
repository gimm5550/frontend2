import React, { useState } from "react";
import {
    GoogleMap,
    LoadScript,
    Autocomplete,
    Polyline,
} from "@react-google-maps/api";

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울시청 기본 위치
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

    // 출발지 선택 이벤트
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart !== null) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...(prevPath.length > 1 ? [prevPath[prevPath.length - 1]] : [])]);
                setMapCenter(latLng);
            }
        }
    };

    // 도착지 선택 이벤트
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd !== null) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [(prevPath.length > 0 ? prevPath[0] : {}), latLng]);
            }
        }
    };

    // Polyline 경로 변경 이벤트 처리
    const handlePathChanged = (polyline) => {
        const updatedPath = polyline.getPath().getArray().map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
        }));
        setPath(updatedPath);
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
                <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
                    <Autocomplete
                        onLoad={(autocomplete) => setAutocompleteStart(autocomplete)}
                        onPlaceChanged={handlePlaceSelectedStart}
                    >
                        <input
                            type="text"
                            placeholder="출발지 검색"
                            style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
                        />
                    </Autocomplete>
                    <Autocomplete
                        onLoad={(autocomplete) => setAutocompleteEnd(autocomplete)}
                        onPlaceChanged={handlePlaceSelectedEnd}
                    >
                        <input
                            type="text"
                            placeholder="도착지 검색"
                            style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
                        />
                    </Autocomplete>
                </div>
                <GoogleMap
                    mapContainerStyle={{ height: "80%", width: "100%" }}
                    center={mapCenter}
                    zoom={12}
                    options={{
                        gestureHandling: "none", // 지도 드래그 비활성화
                        disableDefaultUI: true, // 기본 UI 비활성화
                    }}
                >
                    {path.length > 1 && (
                        <Polyline
                            path={path}
                            options={{
                                editable: true, // Polyline을 편집 가능하도록 설정
                                draggable: true, // Polyline 드래그 가능하도록 설정
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                            }}
                            onPathChanged={(e) => handlePathChanged(e.overlay)} // 경로 변경 이벤트 처리
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
