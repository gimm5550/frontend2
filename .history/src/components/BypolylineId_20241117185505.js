import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api'; // API 모듈 import
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api"; // 구글 맵 컴포넌트 import
import '../MainList.css'; // CSS 파일 import

export default function BypolylineId() {
    const { polylineId } = useParams(); // URL에서 polylineId 추출
    const [coordinates, setCoordinates] = useState([]); // 해당 polylineId의 좌표 데이터를 저장
    const [error, setError] = useState(null); // 에러 상태
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 초기 중심 좌표

    useEffect(() => {
        if (!polylineId) {
            return;
        }
        console.log("polylineId:", polylineId);

        // 서버에서 polylineId에 해당하는 좌표 데이터를 가져옴
        const fetchCoordinates = async () => {
            try {
                const response = await api.getMyTreavelMyPolylineId(polylineId);
                console.log("response:", response);
                console.log("response.data:", response.data);

                const coords = response.data.coordinates;
                setCoordinates(coords); // `coordinates` 배열로 업데이트

                // 첫 좌표를 지도 중심으로 설정
                if (coords.length > 0) {
                    setMapCenter({ lat: coords[0].lat, lng: coords[0].lng });
                }
            } catch (error) {
                console.error("좌표 데이터 가져오기 실패:", error);
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchCoordinates();
    }, [polylineId]); // polylineId가 변경될 때마다 데이터 요청

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <h1 style={{ textAlign: "center", margin: "20px" }}>내 여행기록 상세 페이지</h1>
            <h2 style={{ textAlign: "center" }}>Polyline ID: {polylineId}</h2>
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : (
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                    <GoogleMap
                        mapContainerStyle={{ height: "80%", width: "100%" }}
                        center={mapCenter}
                        zoom={12}
                    >
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
                    </GoogleMap>
                </LoadScript>
            )}
        </div>
    );
}
