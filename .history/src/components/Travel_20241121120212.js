import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import "../MainList.css"; // CSS 파일 import
import { useNavigate } from "react-router-dom";

export default function MyTravel() {
    const [travelData, setTravelData] = useState([]); // 서버에서 가져온 전체 여행 데이터
    const [filteredData, setFilteredData] = useState([]); // 필터링된 여행 데이터
    const [error, setError] = useState(null); // 에러 상태
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    const navigate = useNavigate();

    // 서버에서 전체 여행 데이터를 가져옴
    useEffect(() => {
        const fetchTravelData = async () => {
            try {
                const response = await api.getAllTreavel();
                console.log("response.data를 Travel에서 받아옴.", response.data);
                setTravelData(response.data); // 서버 응답 데이터를 상태에 저장
                setFilteredData(response.data); // 초기 상태로 필터링 데이터도 설정
            } catch (error) {
                console.error("여행 데이터 가져오기 실패:", error);
                setError("여행 데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchTravelData();
    }, []);

    // 검색 기능
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredData(travelData); // 검색어가 비어 있으면 전체 데이터 표시
        } else {
            setFilteredData(
                travelData.filter((polyline) =>
                    polyline.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, travelData]);

    const handleEnterMyTravel = (polylineId) => {
        navigate(`/MyTravel/${polylineId}`);
    };

    return (
        <div>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>전체 여행 기록</h1>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="여행 제목으로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "10px",
                        width: "300px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
            </div>
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : filteredData.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "0 20px" }}>
                    {filteredData.map((polyline, index) => (
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
                                <p style={{ margin: 0, color: "#555" }}>Polyline ID: {polyline.polylineId}</p>
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
                                onClick={() => handleEnterMyTravel(polyline.polylineId)}
                            >
                                입장
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", marginTop: "20px" }}>검색 결과가 없습니다.</p>
            )}
        </div>
    );
}
