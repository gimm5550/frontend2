import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import BypolylineId2 from "./BypolylineId2";

export default function MainList() {
    const [data, setData] = useState([]); // 서버에서 가져온 데이터를 저장
    const [currentIndex, setCurrentIndex] = useState(0); // 현재 표시 중인 polylineId의 인덱스
    const [error, setError] = useState(null); // 에러 상태 저장

    // 서버에서 likes 데이터를 가져와 정렬
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.getAlllike(); // 모든 likes 정보 가져오기
                const sortedData = response.data.sort((a, b) => b.likes - a.likes); // likes로 내림차순 정렬
                setData(sortedData); // 정렬된 데이터를 상태에 저장
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchData();
    }, []);

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1); // 다음 인덱스로 이동
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1); // 이전 인덱스로 이동
        }
    };

    return (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>인기 경로 리스트</h1>
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : (
                <div style={{ position: "relative", height: "calc(100% - 60px)", overflow: "hidden" }}>
                    {data.length > 0 && (
                        <div
                            style={{
                                position: "absolute",
                                top: `-${currentIndex * 80}vh`, // 현재 인덱스에 따라 위치 이동
                                transition: "top 0.3s ease-in-out",
                            }}
                        >
                            {data.map((item, index) => (
                                <div
                                    key={item.polylineId}
                                    style={{
                                        height: "100vh", // 화면 높이 전체 차지
                                        borderBottom: "2px solid #ccc", // 다음 컴포넌트 구분선
                                    }}
                                >
                                    <BypolylineId2 polylineId={item.polylineId} />
                                </div>
                            ))}
                        </div>
                    )}
                    {/* 버튼 */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                        <button
                            style={{
                                position: "absolute",
                                top: "10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 10,
                                padding: "10px 20px",
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                        >
                            이전
                        </button>
                    </div>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                        <button
                            style={{
                                position: "absolute",
                                bottom: "10px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 10,
                                padding: "10px 20px",
                                background: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                            onClick={handleNext}
                            disabled={currentIndex === data.length - 1}
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
