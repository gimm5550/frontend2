import React, { useState, useRef, useEffect } from "react";
import api from "../api";
import { GoogleMap, LoadScript, Autocomplete, Polyline } from "@react-google-maps/api";

// 외부에 고정된 libraries 선언
const libraries = ["places"];

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const polylineRef = useRef(null);
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

    // 출발지 선택
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

    // 도착지 선택
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

    // Polyline 경로 변경 처리
    const handlePathChanged = () => {
        console.log("Path Changed Triggered!");
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
        } else {
            console.error("Polyline Ref is null or undefined!");
        }
    };

    // Polyline 경로 서버 전송
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

    // Polyline 이벤트 리스너 재등록
    useEffect(() => {
        if (polylineRef.current) {
            const path = polylineRef.current.getPath();

            // 기존 리스너 제거
            window.google.maps.event.clearInstanceListeners(path);

            // 이벤트 리스너 등록
            console.log("Re-registering Path Listeners...");
            window.google.maps.event.addListener(path, "set_at", (index) => {
                console.log(`Point Updated at Index: ${index}`);
                handlePathChanged();
            });
            window.google.maps.event.addListener(path, "insert_at", (index) => {
                console.log(`Point Inserted at Index: ${index}`);
                handlePathChanged();
            });
        }
    }, [path]);

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <button onClick={sendPathToServer} style={{ marginBottom: "10px" }}>
                서버로 Polyline 전송
            </button>
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
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
                                polylineRef.current = polyline;

                                const path = polyline.getPath();
                                console.log("Initial Path Listeners Registration...");
                                window.google.maps.event.addListener(path, "set_at", (index) => {
                                    console.log(`Point Updated at Index: ${index}`);
                                    handlePathChanged();
                                });
                                window.google.maps.event.addListener(path, "insert_at", (index) => {
                                    console.log(`Point Inserted at Index: ${index}`);
                                    handlePathChanged();
                                });
                            }}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
