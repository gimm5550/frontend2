import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api'; // API 모듈 import
import '../MainList.css'; // CSS 파일 import

export default function BypolylineId() {
    const { polylineId } = useParams(); // URL에서 polylineId 추출
    const [coordinates, setCoordinates] = useState([]); // 해당 polylineId의 좌표 데이터를 저장
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        // 서버에서 polylineId에 해당하는 좌표 데이터를 가져옴
        const fetchCoordinates = async () => {
            try {
                const response = await api.get(`/api/polyline/${polylineId}`);
                setCoordinates(response.data); // 서버 응답 데이터를 상태에 저장
            } catch (error) {
                console.error("좌표 데이터 가져오기 실패:", error);
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchCoordinates();
    }, [polylineId]); // polylineId가 변경될 때마다 데이터 요청

    return (
        <div>
            <h1>내 여행기록 상세 페이지</h1>
            <h2>Polyline ID: {polylineId}</h2>
            {error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : coordinates.length > 0 ? (
                <ul>
                    {coordinates.map((coord, index) => (
                        <li key={index}>
                            Lat: {coord.lat}, Lng: {coord.lng}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>좌표 데이터가 없습니다.</p>
            )}
        </div>
    );
}
