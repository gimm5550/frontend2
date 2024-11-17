import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import "../MainList.css"; // CSS 파일 import

export default function MyTravel() {
    const [travelData, setTravelData] = useState([]); // 서버에서 가져온 여행 데이터
    const [userId, setUserId] = useState(null); // 사용자 정보 상태

    // 로컬 스토리지에서 userId를 가져옴
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user")); // 로컬 스토리지에서 사용자 정보 가져오기
        console.log("userData!!!", userData);
        if (userData) {
            setUserId(userData.userId); // userId를 설정
        }
    }, []);

    // userId가 설정된 후 서버에서 여행 데이터를 가져옴
    useEffect(() => {
        if (!userId) {
            return;    
        }// userId가 null인 경우 fetch를 실행하지 않음

        const fetchTravelData = async () => {
            try {
                console.log("Fetching data for userId:", userId);
                const response = await api.get(`/api/travel/${userId}`);
                setTravelData(response.data);
            } catch (error) {
                console.error("여행 데이터 가져오기 실패:", error);
            }
        };

        fetchTravelData();
    }, [userId]); // userId가 변경될 때만 실행

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
