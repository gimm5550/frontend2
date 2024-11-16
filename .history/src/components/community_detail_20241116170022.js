import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useNavigate 및 useParams import 추가
import api from '../api'; // api 모듈 import
import '../MainList.css'; // 스타일 import

export default function CommunityDetail() {
    const [details, setDetails] = useState(null); // 초기값을 null로 설정
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기

    const fetchDetails = () => {
        api.detail_show(id) // 서버에서 해당 ID의 데이터 가져오기
            .then(response => {
                const { data } = response.data; // 서버에서 반환된 데이터
                setDetails(data);
            })
            .catch(err => {
                console.error("API 호출 중 오류 발생:", err);
                setError("API 호출 중 오류가 발생했습니다."); // 오류 메시지 설정
            });
    };

    useEffect(() => {
        fetchDetails(); // 컴포넌트가 마운트될 때 데이터 가져오기
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!details) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>커뮤니티 상세 페이지</h1>
            <p><strong>ID:</strong> {details.id}</p>
            <p><strong>제목:</strong> {details.title}</p>
            <p><strong>내용:</strong> {details.description}</p>
            <p><strong>작성일:</strong> {new Date(details.createdDate).toLocaleString()}</p>
            <button onClick={() => navigate('/')}>목록으로 돌아가기</button>
        </div>
    );
}
