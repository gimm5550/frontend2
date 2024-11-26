import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import "../MainList.css"; // CSS 파일 import
import { useNavigate } from "react-router-dom";

export default function MainList() {
    const [travelData, setTravelData] = useState([]); // 서버에서 가져온 전체 여행 데이터
    const [error, setError] = useState(null); // 에러 상태
    const navigate = useNavigate();

    // 서버에서 전체 여행 데이터를 가져옴
    useEffect(() => {
        const fetchTravelData = async () => {
            try {
                const response = await api.getAllTreavel();
                console.log("서버에서 받은 여행 데이터:", response.data);
                
                // likes 수로 내림차순 정렬
                const sortedData = response.data
                    .filter(item => item.visibility === 'public') // 공개 데이터만 필터링
                    .sort((a, b) => b.likes - a.likes); // likes 수 기준으로 정렬
                
                console.log("정렬된 데이터:", sortedData);
                setTravelData(sortedData); // 정렬된 데이터를 상태에 저장
            } catch (error) {
                console.error("여행 데이터 가져오기 실패:", error);
                setError("여행 데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchTravelData();
    }, []);

    const handleEnterTravel = (polylineId) => {
        navigate(`/MyTravel/${polylineId}`); // 클릭 시 상세 페이지로 이동
    };

    return (
        <div>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>인기 여행 경로</h1>
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : travelData.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "0 20px" }}>
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
                            <div>
                                <h2 style={{ margin: 0 }}>{index + 1}. {polyline.title}</h2>
                                <p style={{ margin: "5px 0", color: "#555" }}>Polyline ID: {polyline.polylineId}</p>
                                <p style={{ margin: 0, color: "red", fontWeight: "bold" }}>
                                    ❤️ Likes: {polyline.likes}
                                </p>
                            </div>
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
                                onClick={() => handleEnterTravel(polyline.polylineId)}
                            >
                                입장
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", marginTop: "20px" }}>데이터가 없습니다.</p>
            )}
        </div>
    );
}
