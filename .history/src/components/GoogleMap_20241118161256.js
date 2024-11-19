import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker } from "@react-google-maps/api";
import api from "../api"; // API 호출을 위한 모듈

const libraries = ["places"];

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]); // Polyline 경로
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 중심
    const [title, setTitle] = useState(""); // 제목
    const [userId, setUserId] = useState(null); // 사용자 ID
    const [markers, setMarkers] = useState([]); // 마커 저장
    const [activeMarker, setActiveMarker] = useState(null); // 현재 활성화된 마커
    const [markerMemo, setMarkerMemo] = useState(""); // 마커 메모
    const polylineRef = useRef(null); // Polyline 참조

    // 로컬 스토리지에서 사용자 ID 가져오기
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUserId(userData.id.toString()); // ID를 문자열로 변환
        }
    }, []);

    // 출발지 선택
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...(prevPath.length > 1 ? prevPath.slice(1) : [])]);
                setMapCenter(latLng); // 지도 중심 이동
            }
        }
    };

    // 도착지 선택
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [prevPath[0], latLng].filter(Boolean));
            }
        }
    };

    // 지도 클릭으로 경로 추가
    const handleMapClick = (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setPath((prevPath) => [...prevPath, latLng]);
    };

    // Polyline 편집 시 경로 업데이트
    const handlePolylineEdit = () => {
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((coord) => ({
                    lat: coord.lat(),
                    lng: coord.lng(),
                }));
            setPath(updatedPath); // 전체 경로 업데이트
        }
    };

    // Polyline 위의 지점을 더블 클릭하여 마커 추가
    const handlePolylineDoubleClick = (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkers((prevMarkers) => [...prevMarkers, { position: latLng, memo: "" }]);
    };

    // 마커 클릭 시 메모 입력 창 활성화
    const handleMarkerClick = (markerIndex) => {
        setActiveMarker(markerIndex);
        setMarkerMemo(markers[markerIndex].memo);
    };

    // 메모 업데이트
    const handleMemoChange = (event) => {
        const newMemo = event.target.value;
        setMarkerMemo(newMemo);
    };

    // 메모 저장
    const handleMemoSave = () => {
        setMarkers((prevMarkers) =>
            prevMarkers.map((marker, index) =>
                index === activeMarker ? { ...marker, memo: markerMemo } : marker
            )
        );
        setActiveMarker(null); // 메모 입력 창 닫기
    };

    // Polyline 경로를 서버로 전송
    const sendPathToServer = async () => {
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
                {/* 상단 입력 UI */}
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
                {/* 지도 렌더링 */}
                <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={mapCenter}
                    zoom={12}
                    onClick={handleMapClick} // 지도 클릭 이벤트
                    onDblClick={handlePolylineDoubleClick} // Polyline 더블 클릭 이벤트
                >
                    {/* Polyline 렌더링 */}
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
                                polylineRef.current = polyline;
                            }}
                            onMouseUp={handlePolylineEdit} // Polyline 수정 이벤트
                        />
                    )}
                    {/* 마커 렌더링 */}
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker.position}
                            icon={{
                                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            }}
                            onClick={() => handleMarkerClick(index)}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
            {/* 메모 입력 창 */}
            {activeMarker !== null && (
                <div style={{ position: "absolute", bottom: "20px", left: "20px", backgroundColor: "white", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                    <textarea
                        value={markerMemo}
                        onChange={handleMemoChange}
                        placeholder="메모를 입력하세요"
                        style={{ width: "300px", height: "100px" }}
                    />
                    <button
                        onClick={handleMemoSave}
                        style={{
                            marginTop: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        저장
                    </button>
                </div>
            )}
        </div>
    );
}
