import React, { useState, useRef, useEffect } from "react";
import api from "../api";
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker } from "@react-google-maps/api";

// 외부에 고정된 libraries 선언
const libraries = ["places"];

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [places, setPlaces] = useState([]); // 주변 명소 상태 추가
    const [title, setTitle] = useState(""); // 제목 상태 추가
    const [userId, setUserId] = useState(null); // 사용자 정보 상태
    const polylineRef = useRef(null);
    const mapRef = useRef(null);
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

    // 로컬 스토리지에서 유저 아이디 가져오기
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) setUserId(userData);
    }, []);

    // 출발지 선택
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart !== null) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...prevPath.slice(1)]);
                setMapCenter(latLng);
                fetchNearbyPlaces(latLng); // 명소 정보 업데이트
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
                setPath((prevPath) => [prevPath[0], ...prevPath.slice(1, -1), latLng].filter(Boolean));
            }
        }
    };

    // 지도 클릭으로 중간 경로 추가
    const handleMapClick = (event) => {
        const latLng = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPath((prevPath) => [...prevPath, latLng]);
    };

    // Polyline 경로 변경 처리
    const handlePathChanged = () => {
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((point) => ({
                    lat: point.lat(),
                    lng: point.lng(),
                }));
            setPath(updatedPath);
        } else {
            console.error("Polyline Ref is null or undefined!");
        }
    };

    // Places API 호출하여 주변 명소 가져오기
    const fetchNearbyPlaces = (location) => {
        if (!mapRef.current) return;

        const service = new window.google.maps.places.PlacesService(mapRef.current);
        const request = {
            location: new window.google.maps.LatLng(location.lat, location.lng),
            radius: 5000, // 5km 반경
            type: ["restaurant", "tourist_attraction"], // 음식점과 관광 명소
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaces(results);
            } else {
                console.error("Places API 요청 실패:", status);
            }
        });
    };

    // Polyline 경로 서버 전송
    const sendPathToServer = async () => {
        try {
            const pathData = path.map((vertex) => ({
                lat: vertex.lat,
                lng: vertex.lng,
            }));

            const payload = {
                pathData,
                userId: userId.id.toString(),
                title, // 제목 추가
            };

            console.log("전송 데이터:", payload);
            const response = await api.PostPolyLine(payload);
            console.log("서버 응답:", response.data);
        } catch (error) {
            console.error("서버 전송 중 오류 발생:", error);
        }
    };

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    value={title}
                    placeholder="여행 제목을 입력하세요"
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: "10px", marginBottom: "10px", width: "300px" }}
                />
                <button onClick={sendPathToServer} style={{ padding: "10px", cursor: "pointer" }}>
                    서버로 Polyline 전송
                </button>
            </div>
            <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
                <GoogleMap
                    mapContainerStyle={{ height: "80%", width: "100%" }}
                    center={mapCenter}
                    zoom={12}
                    onLoad={(map) => {
                        mapRef.current = map;
                        fetchNearbyPlaces(mapCenter); // 초기 명소 검색
                    }}
                    onClick={handleMapClick} // 지도 클릭 이벤트 추가
                >
                    {path.length > 1 && (
                        <Polyline
                            path={path}
                            options={{
                                editable: true,
                                strokeColor: "#FF0000",
                                strokeOpacity: 1.0,
                                strokeWeight: 2,
                            }}
                            onLoad={(polyline) => {
                                polylineRef.current = polyline;
                            }}
                        />
                    )}

                    {places.map((place, index) => (
                        <Marker
                            key={index}
                            position={place.geometry.location}
                            title={place.name}
                            onClick={() => alert(`명소: ${place.name}\n주소: ${place.vicinity}`)}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
