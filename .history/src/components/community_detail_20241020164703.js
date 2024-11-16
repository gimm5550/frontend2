import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import api from '../api';
import '../MainList.css';

export default function CommunityDetail() {
    const [details, setDetails] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

    const show = () => {
        console.log("show 실행됨");
        api.detail_show()
            .then(response => {
                console.log("전체 응답:", response.data); // 전체 응답 로그 출력

                const communityData = response.data; // 전체 공지사항 데이터
                console.log("communityData:", communityData); // 데이터 확인

                if (communityData.length > 0) {
                    console.log("11")
                    setDetails(communityData);
                } else {
                    console.log("데이터가 없습니다.");
                }
            })
            .catch(err => {
                console.error("API 호출 중 오류 발생:", JSON.stringify(err));
            });
    };

    useEffect(() => {
        show(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    return (
        <div>
            <h1>공지글</h1>
            {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
            <button onClick={() => navigate('/new_community')}>생성</button> {/* 생성 버튼 추가 */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    {details.length > 0 ? (
                        details.map(community => (
                            <tr key={community.id}>
                                <td>{community.id}</td>
                                <td>{community.title}</td>
                                <td>{community.content}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">데이터가 없습니다.</td> {/* 데이터가 없을 때 메시지 표시 */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
