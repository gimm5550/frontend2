import React, { useState, useRef, useEffect } from "react";
import api from '../api';
import { GoogleMap, LoadScript, Autocomplete, Polyline } from "@react-google-maps/api";

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const polylineRef = useRef(null);
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

    const handlePlaceSelectedStart = () => {
        if (autocompleteStart !== null) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...(prevPath.length > 1 ? prevPath.slice(1) : [])]);
                setMapCenter(latLng);
            }
        }
    };

    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd !== null) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [prevPath[0], latLng].filter(Boolean));
            }
        }
    };

    const handlePathChanged = () => {
        console.log("Path Changed!");
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((point) => ({
                    lat: point.lat(),
                    lng: point.lng(),
                }));
            console.log("Updated Path:", updatedPath);
            setPath(updatedPath);
        }
    };

    const sendPathToServer = async () => {
        try {
            const pathData = path.map((vertex) => ({
                lat: vertex.lat,
                lng: vertex.lng,
            }));

            console.log("전송 데이터:", JSON.stringify(pathData));
            const response = await api.PostPolyLine(pathData);
            console.log("서버 응답:", response.data);
        } catch (error) {
            console.error("서버 전송 중 오류 발생:", error);
        }
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <button onClick={sendPathToServer} style={{ marginBottom: "10px" }}>
                서버로 Polyline 전송
            </button>
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
                    {path.length > 1 && (
                        <Polyline
                        path={path}
                        options={{
                            editable: true, // Polyline 편집 가능
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 2,
                        }}
                        onLoad={(polyline) => {
                            console.log("Polyline Loaded:", polyline);
                            if (polylineRef.current) {
                                polylineRef.current.setMap(null);
                            }
                            polylineRef.current = polyline;
                        
                            const path = polyline.getPath();
                            console.log("Path Type:", path.constructor.name); // MVCArray 확인
                            console.log("Polyline Editable:", polyline.getEditable()); // Editable 속성 확인
                        
                            console.log("Path Listeners Registered");
                            window.google.maps.event.addListener(path, "set_at", (index) => {
                                console.log("Point Updated at Index:", index);
                                handlePathChanged();
                            });
                            window.google.maps.event.addListener(path, "insert_at", (index) => {
                                console.log("Point Inserted at Index:", index);
                                handlePathChanged();
                            });
                        
                            // 테스트: 경로 변경 강제 트리거
                            setTimeout(() => {
                                path.push(new window.google.maps.LatLng(37.5725, 126.9825)); // 임의의 점 추가
                                console.log("Point Added Programmatically");
                            }, 5000);
                        }}
                    />
                    
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
