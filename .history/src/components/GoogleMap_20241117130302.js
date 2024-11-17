import React, { useState, useEffect, useRef } from "react";
import api from '../api'; // API 모듈 import
import {
    GoogleMap,
    LoadScript,
    Autocomplete,
    Polyline,
} from "@react-google-maps/api";

export default function GoogleMapPage() {
    const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울시청 기본 위치
    const polylineRef = useRef(null); // Polyline 객체 참조
    const googleMapsApiKey = "AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ";

    // 출발지 선택 이벤트
    const handlePlaceSelectedStart = () => {
        if (autocompleteStart !== null) {
            const place = autocompleteStart.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [latLng, ...(prevPath.length > 1 ? [prevPath[prevPath.length - 1]] : [])]);
                setMapCenter(latLng);
            }
        }
    };

    // 도착지 선택 이벤트
    const handlePlaceSelectedEnd = () => {
        if (autocompleteEnd !== null) {
            const place = autocompleteEnd.getPlace();
            if (place.geometry) {
                const location = place.geometry.location;
                const latLng = { lat: location.lat(), lng: location.lng() };
                setPath((prevPath) => [(prevPath.length > 0 ? prevPath[0] : {}), latLng]);
            }
        }
    };

    // Polyline 경로 변경 이벤트 처리
    const handlePathChanged = () => {
        if (polylineRef.current) {
            const updatedPath = polylineRef.current
                .getPath()
                .getArray()
                .map((point) => ({
                    lat: point.lat(),
                    lng: point.lng(),
                }));
            setPath(updatedPath); // 상태를 업데이트하여 Polyline을 단일 경로로 유지
        }
    };

    useEffect(() => {
        if (polylineRef.current) {
            // 이미 Polyline이 존재하면 경로를 갱신만 함
            polylineRef.current.setPath(path);
        }
    }, [path]);

    const sendPathToServer = async () => {
        try {
            // Polyline의 경로 데이터를 JSON으로 변환
            const pathData = path.map((vertex) => ({
                lat: vertex.lat,
                lng: vertex.lng,
            }));
            api.PostPolyLine(pathData) // 여행 기록 목록을 가져오는 API 호출
                .then(response => {
                    console.log("response!!!:", response)
                    const { data } = response.data; // 서버에서 반환된 데이터 구조를 맞춤
                })
                .catch(err => {
                    console.error("여행 기록을 가져오는 중 오류 발생:", err);
                });

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
                                // 기존 Polyline 객체가 있으면 삭제
                                if (polylineRef.current) {
                                    polylineRef.current.setMap(null);
                                }
                                // 새 Polyline 객체를 참조에 저장
                                polylineRef.current = polyline;
                            }}
                            onPathChanged={handlePathChanged} // 경로 변경 이벤트
                        />
                    )}
                </GoogleMap>
            </LoadScript>
        </div>
    );
}
