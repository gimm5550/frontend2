import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker, InfoWindow } from "@react-google-maps/api";
import api from "../api"; // API 호출을 위한 모듈

const libraries = ["places"];
const types = ["restaurant", "park", "museum"]; // 명소 타입

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
    const [places, setPlaces] = useState([]); // 명소 저장
    const [selectedTypes, setSelectedTypes] = useState(new Set(types)); // 선택된 명소 타입
    const [selectedPlace, setSelectedPlace] = useState(null); // 클릭된 명소 정보
    const polylineRef = useRef(null); // Polyline 참조
    const mapRef = useRef(null); // Google Map 참조

    // 로컬 스토리지에서 사용자 ID 가져오기
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUserId(userData.id.toString()); // ID를 문자열로 변환
        }
    }, []);

    // 지도 확대/축소 변경 이벤트
    const handleZoomChanged = async () => {
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();
            const zoom = mapRef.current.getZoom();

            // Zoom level이 16 이상일 때만 명소 가져오기
            if (zoom >= 16) {
                const placesService = new window.google.maps.places.PlacesService(mapRef.current);
                const request = {
                    bounds,
                    type: Array.from(selectedTypes), // 선택된 타입 필터링
                };

                placesService.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setPlaces(results.map(place => ({
                            id: place.place_id,
                            name: place.name,
                            position: place.geometry.location,
                            type: place.types,
                            photoUrl: place.photos ? place.photos[0].getUrl() : null, // 명소 이미지 URL
                            address: place.vicinity, // 명소 주소
                            rating: place.rating, // 명소 평점
                        })));
                    }
                });
            } else {
                setPlaces([]); // Zoom level이 낮으면 명소 비우기
            }
        }
    };

    // 체크박스 변경 핸들러
    const handleTypeChange = (type) => {
        setSelectedTypes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(type)) {
                newSet.delete(type);
            } else {
                newSet.add(type);
            }
            return newSet;
        });
    };

    // 명소 마커 클릭 핸들러
    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
    };

    // 기타 기존 함수들 (출발지/도착지 선택, 경로 추가, 메모 관리 등)
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart) {
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
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [prevPath[0], latLng].filter(Boolean));
            }
        }
    };

    const handleMapClick = (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setPath((prevPath) => [...prevPath, latLng]);
    };

    const handlePolylineEdit = () => {
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((coord) => ({
                    lat: coord.lat(),
                    lng: coord.lng(),
                }));
    
            // 새로운 경로 생성 (출발지와 목적지는 그대로 유지)
            if (updatedPath.length > 2) {
                const start = updatedPath[0]; // 출발지
                const end = updatedPath[updatedPath.length - 3]; // 목적지
                const newPath = [start, end]; // 중간 점 제거
    
                setPath(newPath); // 새로운 경로로 업데이트
            } else {
                setPath(updatedPath); // 그대로 유지
            }
        }
    };
    

    const handlePolylineDoubleClick = (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkers((prevMarkers) => [...prevMarkers, { position: latLng, memo: "" }]);
    };

    const handleMarkerClick = (markerIndex) => {
        setActiveMarker(markerIndex);
        setMarkerMemo(markers[markerIndex].memo);
    };

    const handleMemoChange = (event) => {
        setMarkerMemo(event.target.value);
    };

    const handleMemoSave = () => {
        setMarkers((prevMarkers) =>
            prevMarkers.map((marker, index) =>
                index === activeMarker ? { ...marker, memo: markerMemo } : marker
            )
        );
        setActiveMarker(null);
    };

    const sendPathToServer = async () => {
        if (!userId || !title || path.length < 2) {
            alert("유효한 사용자 ID, 제목 및 경로를 입력하세요.");
            return;
        }

        const payload = {
            pathData: path,
            markersData: markers.map(marker => ({
                lat: marker.position.lat,
                lng: marker.position.lng,
                memo: marker.memo,
            })),
            title,
            userId,
        };

        try {
            console.log("서버로 전송할 데이터:", payload);
            const response = await api.PostPolyLine(payload);
            console.log("서버 응답:", response.data);
            alert("Polyline 및 마커 정보가 성공적으로 전송되었습니다!");
        } catch (error) {
            console.error("Polyline 정보 전송 실패:", error);
            alert("Polyline 정보 전송 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
            <LoadScript googleMapsApiKey="AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ" libraries={libraries}>
                <div style={{ padding: "10px", backgroundColor: "#f1f1f1", display: "flex", flexWrap: "wrap" }}>
                    {types.map(type => (
                        <label key={type} style={{ marginRight: "10px" }}>
                            <input
                                type="checkbox"
                                checked={selectedTypes.has(type)}
                                onChange={() => handleTypeChange(type)}
                            />
                            {type}
                        </label>
                    ))}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="여행 제목을 입력하세요"
                        style={{ padding: "10px", marginLeft: "10px", width: "200px" }}
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
                            marginLeft: "10px",
                        }}
                    >
                        서버로 전송
                    </button>
                </div>
                <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    center={mapCenter}
                    zoom={12}
                    onClick={handleMapClick}
                    onRightClick={handlePolylineDoubleClick}
                    onZoomChanged={handleZoomChanged}
                    onLoad={(map) => (mapRef.current = map)}
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
                            onLoad={(polyline) => (polylineRef.current = polyline)}
                            onMouseUp={handlePolylineEdit}
                        />
                    )}
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
                    {places.map(place => (
                        <Marker
                            key={place.id}
                            position={place.position}
                            onClick={() => handlePlaceClick(place)}
                        />
                    ))}
                    {selectedPlace && (
                        <InfoWindow
                            position={selectedPlace.position}
                            onCloseClick={() => setSelectedPlace(null)}
                        >
                            <div>
                                <h3>{selectedPlace.name}</h3>
                                {selectedPlace.photoUrl && (
                                    <img
                                        src={selectedPlace.photoUrl}
                                        alt={selectedPlace.name}
                                        style={{ width: "100%", height: "100px", objectFit: "cover" }}
                                    />
                                )}
                                <p>{selectedPlace.address}</p>
                                <p>Rating: {selectedPlace.rating || "N/A"}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
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
