import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api'; // API 모듈 import

export default function Home() {
    const [polylineData, setPolylineData] = useState([]); // 전체 데이터를 저장
    const [error, setError] = useState(null); // 에러 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션

    useEffect(() => {
        const fetchPolylineList = async () => {
            try {
                const response = await api.getPolylineList(); // 전체 polyline 데이터 요청
                const sortedData = response.data.sort((a, b) => b.likes - a.likes); // likes 수로 정렬
                setPolylineData(sortedData);
            } catch (error) {
                console.error("Failed to fetch polyline data:", error);
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchPolylineList();
    }, []);

    const handleNavigate = (polylineId) => {
        navigate(`/polyline/${polylineId}`); // 클릭 시 상세 페이지로 이동
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>인기 경로</h1>
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {polylineData.map((item) => (
                        <li
                            key={item.polylineId}
                            style={{
                                padding: "10px",
                                margin: "10px 0",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => handleNavigate(item.polylineId)}
                        >
                            <div>
                                <h3 style={{ margin: 0 }}>{item.title}</h3>
                                <p style={{ margin: "5px 0", color: "gray" }}>
                                    {item.postContent.slice(0, 50)}...
                                </p>
                            </div>
                            <span
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "red",
                                }}
                            >
                                ❤️ {item.likes}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
