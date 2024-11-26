import React, { useEffect, useState } from "react";
import api from "../api"; // API 모듈 import
import BypolylineId from "./BypolylineId";

export default function MainList() {
    const [data, setData] = useState([]); // 서버에서 가져온 데이터를 저장
    const [error, setError] = useState(null); // 에러 상태 저장

    // 서버에서 likes 데이터를 가져와 정렬
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.getAlllike(); // 모든 likes 정보 가져오기
                console.log("response.data:", response.data)
                const sortedData = response.data.sort((a, b) => b.likes - a.likes); // likes로 내림차순 정렬
                setData(sortedData); // 정렬된 데이터를 상태에 저장
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setError("데이터를 가져오는 중 문제가 발생했습니다.");
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>인기 경로 리스트</h1>
            {error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : (
                data.map((item) => (
                    <BypolylineId key={item.polylineId} polylineId={item.polylineId} />
                ))
            )}
        </div>
    );
}
