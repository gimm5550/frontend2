import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker, InfoWindow } from "@react-google-maps/api";
import api from "../api"; // API 호출을 위한 모듈

const libraries = ["places"];
const MIN_ZOOM_FOR_MARKERS = 14;

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [title, setTitle] = useState("");
    const [userId, setUserId] = useState(null);
    const mapRef = useRef(null);
    const polylineRef = useRef(null);

    // 로컬 스토리지에서 사용자 ID 가져오기
    React.useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUserId(userData.id.toString());}
            console.log("userId!!!!!!!!", userId)
    }, []);

    // 출발지 설정
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

    // 도착지 설정
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                setPath((prev) => [prev[0], { lat: location.lat(), lng: location.lng() }]);
            }
        }
    };

    // Polyline 수정 시 경로 업데이트
    const handlePolylineEdit = () => {
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((coord) => ({
                    lat: coord.lat(),
                    lng: coord.lng(),
                }));
            setPath(updatedPath);
        }
    };

    // Polyline 서버로 전송
    const sendPathToServer = async () => {
        console.log("userId:", userId);
        console.log("title:", title);
        console.log("path:", path);
        if (!userId || !title || path.length < 2) {
            alert("유효한 사용자 ID, 제목 및 경로를 입력하세요.");
            return;
        }

        const payload = {
            pathData: path,
            title,
            userId,
        };

        try {
            console.log("서버로 전송할 데이터:", payload);
            const response = await api.PostPolyLine(payload);
            console.log("서버 응답:", response.data);
            alert("Polyline 정보가 성공적으로 전송되었습니다!");
        } catch (error) {
            console.error("Polyline 정보 전송 실패:", error);
            alert("Polyline 정보 전송 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
            <LoadScript googleMapsApiKey="AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ" libraries={libraries}>
                <div style={{ padding: "10px", backgroundColor: "#f1f1f1", display: "flex" }}>
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
                            style={{ padding: "10px", marginRight: "10px", width: "200px" }}
                        />
                    </Autocomplete>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="여행 제목을 입력하세요"
                        style={{ padding: "10px", marginRight: "10px", width: "200px" }}
                    />
                    <button
                        onClick={sendPathToServer}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        서버로 경로 전송
                    </button>
                </div>
                <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={mapCenter}
                    zoom={12}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                    onClick={(event) => {
                        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
                        setPath((prev) => [...prev, latLng]);
                    }}
                >
                    {path.length > 1 && (
                        <Polyline
                            path={path}
                            options={{
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                                draggable: true,
                                editable: true,
                            }}
                            onLoad={(polyline) => {
                                if (polylineRef.current) polylineRef.current.setMap(null);
                                polylineRef.current = polyline;
                            }}
                            onMouseUp={handlePolylineEdit}
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
