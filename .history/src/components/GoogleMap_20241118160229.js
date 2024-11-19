import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker, InfoWindow } from "@react-google-maps/api";
import api from "../api"; // API 호출을 위한 모듈

const libraries = ["places"];
const MIN_ZOOM_FOR_MARKERS = 14; // 마커를 표시하기 위한 최소 줌 레벨

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]); // Polyline 경로
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 중심
    const [title, setTitle] = useState(""); // 제목
    const [userId, setUserId] = useState(null); // 사용자 ID
    const [places, setPlaces] = useState([]); // 명소 정보
    const [zoom, setZoom] = useState(12); // 현재 줌 레벨
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 명소
    const polylineRef = useRef(null); // Polyline 참조
    const mapRef = useRef(null); // 지도 참조
    const [showRestaurants, setShowRestaurants] = useState(true); // 음식점 필터링 상태
    const [showTouristAttractions, setShowTouristAttractions] = useState(true); // 관광지 필터링 상태
    const [isFirstDragHandled, setIsFirstDragHandled] = useState(false); // 최초 실행 여부를 확인하는 상태 추가
    const [markers, setMarkers] = useState([]); // 추가된 마커 상태
    const [memo, setMemo] = useState({}); // 마커별 메모 저장 상태
    const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUserId(userData.id.toString()); // ID를 문자열로 변환
        }
    }, []);

    const handlePlaceSelectedStart = () => {
        if (autocompleteStart) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...prevPath.slice(1)]);
                setMapCenter(latLng); // 지도 중심 이동
            }
        }
    };

    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [...prevPath.slice(0, prevPath.length - 1), latLng]);
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
            setPath(updatedPath); // 전체 경로 업데이트
        }
    };

    const fetchVisiblePlaces = () => {
        if (!mapRef.current) return;

        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const request = {
            bounds,
            type: [],
        };

        if (showRestaurants) request.type.push("restaurant");
        if (showTouristAttractions) request.type.push("tourist_attraction");

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(results);
            } else {
                console.error("Places API Error:", status);
            }
        });
    };

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

    const addMarker = (event) => {
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        setMarkers((prevMarkers) => [...prevMarkers, latLng]);
    };

    const updateMarkerPosition = (index, latLng) => {
        setMarkers((prevMarkers) =>
            prevMarkers.map((marker, i) => (i === index ? latLng : marker))
        );
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
                    zoom={zoom}
                    onLoad={(map) => {
                        mapRef.current = map;
                        fetchVisiblePlaces();
                    }}
                    onZoomChanged={() => {
                        if (mapRef.current) {
                            const currentZoom = mapRef.current.getZoom();
                            setZoom(currentZoom);
                            if (currentZoom >= MIN_ZOOM_FOR_MARKERS) {
                                fetchVisiblePlaces();
                            } else {
                                setPlaces([]); // 줌 레벨이 낮으면 명소 정보 초기화
                            }
                        }
                    }}
                    onClick={addMarker}
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
                                polylineRef.current = polyline;
                                const updatedPath = polyline.getPath().getArray().map((coord) => ({
                                    lat: coord.lat(),
                                    lng: coord.lng(),
                                }));
                                setPath(updatedPath); // 초기 상태 동기화
                            }}
                            onMouseUp={handlePolylineEdit}
                        />
                    )}

                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={marker}
                            draggable={true}
                            onDragEnd={(event) => {
                                const latLng = {
                                    lat: event.latLng.lat(),
                                    lng: event.latLng.lng(),
                                };
                                updateMarkerPosition(index, latLng);
                            }}
                            onClick={() => setSelectedMarker(index)}
                        />
                    ))}

                    {selectedMarker !== null && (
                        <InfoWindow
                            position={markers[selectedMarker]}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div>
                                <textarea
                                    value={memo[selectedMarker] || ""}
                                    onChange={(e) =>
                                        setMemo((prevMemo) => ({
                                            ...prevMemo,
                                            [selectedMarker]: e.target.value,
                                        }))
                                    }
                                    placeholder="메모를 입력하세요"
                                    style={{ width: "200px", height: "100px" }}
                                />
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
