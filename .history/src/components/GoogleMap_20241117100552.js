import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import axios from "axios";
import { REQUEST_URL } from "../url";
import { useNavigate } from "react-router-dom";
import api from '../api';

export default function GoogleMapPage() {
    const [map, setMap] = useState(null);
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울시청 기본 위치
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ"; // Google Maps API 키를 입력하세요.

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
                setMarkers((prevMarkers) => [...prevMarkers, latLng]);
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
                setMarkers((prevMarkers) => [...prevMarkers, latLng]);
            }
        }
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
                    {markers.map((marker, index) => (
                        <Marker key={index} position={marker} />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
