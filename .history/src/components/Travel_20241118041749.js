import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import "../MainList.css"; // CSS 파일 import
import { useNavigate } from "react-router-dom";

export default function MyTravel() {
    const [travelData, setTravelData] = useState([]); // 서버에서 가져온 여행 데이터
    const [error, setError] = useState(null); // 에러 상태

    const navigate = useNavigate();

    // 서버에서 전체 여행 데이터를 가져옴
    useEffect(() => {
        const fetchTravelData = async () => {
            try {
                const response = await api.getAllTreavel();
                setTravelData(response.data);
            } catch (error) {
                console.error("여행 데이터 가져오기 실패:", error);
                setError("여행 데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchTravelData();
    }, []);

    const handleEnterMyTravel = (polylineId) => {
        navigate(`/MyTravel/${polylineId}`);
    };

    return (
        <div>
            <h1>MyTravel 화면</h1>
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : travelData.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {travelData.map((polyline, index) => (
                        <div
                            key={index}
                            className="travel-item"
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                backgroundColor: "#f9f9f9",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <h2 style={{ margin: 0 }}>Polyline ID: {polyline.polylineId}</h2>
                            <button
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                                onClick={() => handleEnterMyTravel(polyline.polylineId)}
                            >
                                입장
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", marginTop: "20px" }}>여행 기록이 없습니다.</p>
            )}
        </div>
    );
}
