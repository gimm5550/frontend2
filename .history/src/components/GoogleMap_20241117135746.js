import React, { useState, useRef, useEffect } from "react";
import api from '../api';
import { GoogleMap, LoadScript, Autocomplete, Polyline } from "@react-google-maps/api";
const libraries = ["places"]; // 고정된 libraries 선언
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
        if (!polylineRef.current) {
            console.error("Polyline Ref is null or undefined!");
            return;
        }
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
    useEffect(() => {
        if (polylineRef.current) {
            const path = polylineRef.current.getPath();

            // 기존 리스너 제거
            window.google.maps.event.clearInstanceListeners(path);

            // 리스너 재등록
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
    }, [path]); // path 변경 시마다 리스너 재등록
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                <GoogleMap mapContainerStyle={{ height: "80%", width: "100%" }} center={mapCenter} zoom={12}>
                    <Polyline
                        path={path}
                        options={{ editable: true, strokeColor: "#FF0000", strokeOpacity: 1.0, strokeWeight: 2 }}
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
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
