import React, { useEffect, useState } from "react";
import {
    GoogleMap,
    LoadScript,
    Autocomplete,
    Marker,
    Polyline
} from "@react-google-maps/api";

export default function GoogleMapPage() {
    const [map, setMap] = useState(null);
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울시청 기본 위치
    const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY";

    // 지도 로드 시 초기 설정
    const handleOnLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    // 출발지 자동 완성 선택 이벤트
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart !== null) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setStartLocation(latLng);
                setPath((prevPath) => [latLng, ...(prevPath.length > 1 ? [prevPath[prevPath.length - 1]] : [])]); // 갱신
                setMapCenter(latLng); // 지도 중심 변경
            }
        }
    };

    // 도착지 자동 완성 선택 이벤트
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd !== null) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setEndLocation(latLng);
                setPath((prevPath) => [(prevPath.length > 0 ? prevPath[0] : {}), latLng]); // 갱신
            }
        }
    };

    // Polyline 드래그 이벤트 처리
    const handlePathChanged = (index, position) => {
        const updatedPath = [...path];
        updatedPath[index] = position;
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
                    onLoad={handleOnLoad}
                >
                    {path.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker}
                            draggable={index > 0 && index < path.length - 1} // 중간 경로만 드래그 가능
                            onDragEnd={(e) =>
                                handlePathChanged(index, {
                                    lat: e.latLng.lat(),
                                    lng: e.latLng.lng()
                                })
                            }
                        />
                    ))}
                    {path.length > 1 && (
                        <Polyline
                            path={path}
                            options={{
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                                clickable: false,
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
