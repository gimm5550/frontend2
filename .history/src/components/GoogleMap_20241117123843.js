import React, { useState } from "react";
import {
    GoogleMap,
    LoadScript,
    Autocomplete,
    Marker,
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

    // 드래그 이벤트 처리
    const handleMarkerDrag = (index, newPosition) => {
        const updatedPath = [...path];
        updatedPath[index] = { lat: newPosition.lat(), lng: newPosition.lng() };
        setPath(updatedPath);
    };

    // 경로 중간에 드래그 가능한 마커 추가
    const renderDraggableMarkers = () => {
        return path.map((position, index) => (
            <Marker
                key={index}
                position={position}
                draggable={true} // 모든 마커를 드래그 가능
                onDragEnd={(e) =>
                    handleMarkerDrag(index, { lat: e.latLng.lat(), lng: e.latLng.lng() })
                }
            />
        ));
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
                >
                    {renderDraggableMarkers()}
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
            </LoadScript>
        </div>
    );
}
