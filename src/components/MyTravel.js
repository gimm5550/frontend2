import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import "../MainList.css"; // CSS 파일 import
import { useNavigate } from "react-router-dom";

export default function MyTravel() {
    const [travelData, setTravelData] = useState([]); // 서버에서 가져온 여행 데이터
    const [userId, setUserId] = useState(null); // 사용자 정보 상태

    // 로컬 스토리지에서 userId를 가져옴
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user")); // 로컬 스토리지에서 사용자 정보 가져오기
        if (userData) {
            setUserId(userData.id); // userId를 설정
        }
    }, []);

    // userId가 설정된 후 서버에서 여행 데이터를 가져옴
    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchTravelData = async () => {
            try {
                const response = await api.getMyTreavel(userId);
                setTravelData(response.data);
            } catch (error) {
                console.error("여행 데이터 가져오기 실패:", error);
            }
        };

        fetchTravelData();
    }, [userId]);

    const navigate = useNavigate();

    // 상세 페이지로 이동
    const handleEnterMyTravel = (polylineId) => {
        navigate(`/MyTravel/${polylineId}`);
    };

    // 여행 기록 삭제
    const handleDeleteTravelRecord = async (polylineId) => {
        if (window.confirm("정말로 이 여행 기록을 삭제하시겠습니까?")) {
            try {
                await api.deleteTravelRecord(polylineId);
                alert("여행 기록이 삭제되었습니다.");
                // 삭제 후 데이터 갱신
                setTravelData((prevData) =>
                    prevData.filter((record) => record.polylineId !== polylineId)
                );
            } catch (error) {
                console.error("여행 기록 삭제 실패:", error);
                alert("여행 기록 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div>
            <h1>MyTravel 화면</h1>
            {travelData.length > 0 ? (
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
                            <div>
                                <h2 style={{ margin: 0 }}>제목: {polyline.title}</h2>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#555777",
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
                                <button
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "#dc3545",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                    }}
                                    onClick={() => handleDeleteTravelRecord(polyline.polylineId)}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", marginTop: "20px" }}>여행 기록이 없습니다.</p>
            )}
        </div>
    );
}
