import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api"; // 구글 맵 컴포넌트 import
import "../MainList.css"; // CSS 파일 import

export default function BypolylineId2({ polylineId }) {
    const [coordinates, setCoordinates] = useState([]); // 해당 polylineId의 좌표 데이터를 저장
    const [markers, setMarkers] = useState([]); // 마커 데이터를 저장
    const [title, setTitle] = useState(""); // 제목 상태 추가
    const [error, setError] = useState(null); // 에러 상태
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 초기 중심 좌표
    const [isMapVisible, setIsMapVisible] = useState(false); // GoogleMap 표시 여부
    const [selectedMemo, setSelectedMemo] = useState(null); // 선택된 메모 상태
    const [postContent, setPostContent] = useState(""); // 본문 내용 상태 추가

    useEffect(() => {
        if (!polylineId) {
            return;
        }

        const fetchPolylineData = async () => {
            try {
                const response = await api.getMyTreavelMyPolylineId(polylineId);
                const coords = response.data.coordinates;
                setCoordinates(coords);
                setTitle(response.data.title);
                setPostContent(response.data.postContent); // 본문 내용 설정

                // 첫 좌표를 지도 중심으로 설정
                if (coords.length > 0) {
                    setMapCenter({ lat: coords[0].lat, lng: coords[0].lng });
                }

                // 마커 데이터 가져오기
                const markerResponse = await api.getMarkersByPolylineId(polylineId);
                setMarkers(markerResponse.data); // 마커 데이터를 상태에 저장
            } catch (error) {
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchPolylineData();
    }, [polylineId]); // polylineId가 변경될 때마다 데이터 요청

    const toggleMapVisibility = () => {
        setIsMapVisible((prev) => !prev); // 지도 표시 여부 토글
    };

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            {/* 본문 영역 */}
            <div style={{ flex: "1", padding: "20px", overflow: "auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: "10px" }}>{title}</h2>

                <div style={{ margin: "20px 0" }}>
                    <p>{postContent}</p>
                </div>

                {/* 지도 표시 버튼 */}
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <button
                        onClick={toggleMapVisibility}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        {isMapVisible ? "지도 닫기" : "지도 보기"}
                    </button>
                </div>

                {/* 지도 팝업 */}
                {isMapVisible && (
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "80%",
                            height: "70%",
                            backgroundColor: "white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            zIndex: 1000,
                            borderRadius: "10px",
                            overflow: "hidden",
                        }}
                    >
                        <button
                            onClick={toggleMapVisibility}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "#ff4d4d",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            ×
                        </button>
                        <LoadScript googleMapsApiKey="AIzaSyAWWAlxhWa2A20TsMzA7oivnox-QDjjwyQ">
                            <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "100%" }}
                                center={mapCenter}
                                zoom={12}
                            >
                                {/* Polyline 렌더링 */}
                                {coordinates.length > 1 && (
                                    <Polyline
                                        path={coordinates}
                                        options={{
                                            strokeColor: "#FF0000",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 4,
                                        }}
                                    />
                                )}
                                {/* 마커 렌더링 */}
                                {markers.map((marker, index) => (
                                    <Marker
                                        key={index}
                                        position={{ lat: marker.lat, lng: marker.lng }}
                                        onClick={() => setSelectedMemo(marker.memo)} // 마커 클릭 시 메모 업데이트
                                    />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                )}
            </div>

            {/* 오른쪽 정보 영역 */}
            <div
                className="place_info2"
                style={{
                    width: "150px",
                    backgroundColor: "#f9f9f9",
                    padding: "20px",
                    borderLeft: "1px solid #ddd",
                    overflowY: "auto",
                }}
            >
                <h3>메모 정보</h3>
                {selectedMemo ? (
                    <p>{selectedMemo}</p>
                ) : (
                    <p>선택된 메모가 없습니다.</p>
                )}
            </div>

            {/* 지도가 보일 때 배경 흐림 효과 */}
            {isMapVisible && (
                <div
                    onClick={toggleMapVisibility}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 999,
                    }}
                ></div>
            )}
        </div>
    );
}
