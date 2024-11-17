import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import "../MainList.css"; // CSS 파일 import

export default function MyTravel() {
    const [travelData, setTravelData] = useState([]); // 서버에서 가져온 여행 데이터
    const userId = "gyu"; // 현재 사용자 ID (추후 인증과 연동 가능)

    useEffect(() => {
        // 서버에서 userId에 해당하는 여행 데이터를 가져옴
        const fetchTravelData = async () => {
            try {
                const response = await api.get(`/api/travel/${userId}`);
                setTravelData(response.data);
            } catch (error) {
                console.error("여행 데이터 가져오기 실패:", error);
            }
        };
        fetchTravelData();
    }, []);

    return (
        <div>
            <h1>MyTravel 화면</h1>
            {travelData.length > 0 ? (
                travelData.map((polyline, index) => (
                    <div key={index} className="travel-item">
                        <h2>Polyline ID: {polyline.polylineId}</h2>
                        <ul>
                            {polyline.coordinates.map((coord, idx) => (
                                <li key={idx}>
                                    Lat: {coord.lat}, Lng: {coord.lng}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>여행 기록이 없습니다.</p>
            )}
        </div>
    );
}
