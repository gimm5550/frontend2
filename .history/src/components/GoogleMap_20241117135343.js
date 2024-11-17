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
        console.log("Path Changed! Updated Path2222222",);
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((point) => ({
                    lat: point.lat(),
                    lng: point.lng(),
                }));
            console.log("Path Changed! Updated Path:", updatedPath);
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
                            polylineRef.current = polyline; // 초기화
                            const path = polyline.getPath();
                            console.log("Path Object:", path);
                    
                            // Path Listeners 등록
                            if (path.addListener) {
                                window.google.maps.event.addListener(path, "set_at", (index) => {
                                    console.log(`Point Updated at Index: ${index}`);
                                    handlePathChanged();
                                });
                                window.google.maps.event.addListener(path, "insert_at", (index) => {
                                    console.log(`Point Inserted at Index: ${index}`);
                                    handlePathChanged();
                                });
                            } else {
                                console.error("Path does not support addListener. Using alternate binding...");
                                window.google.maps.event.addDomListener(path, "set_at", (index) => {
                                    console.log(`Point Updated (DOM Listener) at Index: ${index}`);
                                    handlePathChanged();
                                });
                                window.google.maps.event.addDomListener(path, "insert_at", (index) => {
                                    console.log(`Point Inserted (DOM Listener) at Index: ${index}`);
                                    handlePathChanged();
                                });
                            }
                        }}
                    />
                    
                    
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
