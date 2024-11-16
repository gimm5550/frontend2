import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useNavigate 및 useParams import 추가
import api from '../api';
import '../MainList.css';

export default function CommunityDetail() {
    const [details, setDetails] = useState([]); // 초기값을 배열로 설정
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기

    const show = () => {
        console.log("show 실행됨");
        api.detail_show(id)
            .then(response => {
                console.log("전체 응답:", response.data); // 전체 응답 로그 출력

                const communityData = response.data; // 문자열 리스트
                console.log("communityData:", communityData); // 데이터 확인

                // JSON 문자열을 객체로 변환
                try {
                    const parsedData = JSON.parse(communityData);
                    setDetails(parsedData); // 변환된 데이터를 상태에 저장
                } catch (error) {
                    console.error("JSON 파싱 오류:", error);
                    setError("데이터 형식이 잘못되었습니다."); // 오류 메시지 설정
                }
            })
            .catch(err => {
                console.error("API 호출 중 오류 발생:", JSON.stringify(err));
                setError("API 호출 중 오류가 발생했습니다."); // 오류 메시지 설정
            });
    };

    const handleDelete = (detail_id) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            console.log("커뮤id:", id);
            console.log("공지글id:", detail_id);
            api.detail_delete(id, detail_id) // 삭제 API 호출. 앞의 id는 커뮤id, 
                .then(response => {
                    console.log("삭제 응답:", response.data);
                    // 삭제 후 커뮤니티 목록을 다시 가져옵니다.
                    show();
                })
                .catch(err => {
                    console.error("삭제 중 오류 발생:", JSON.stringify(err));
                    setError("삭제 중 오류가 발생했습니다."); // 오류 메시지 설정
                });
        }
    };

    const handleViewDetail = (communityId) => {
        console.log("handle된 id:", communityId);
        navigate(`/CommunityView/${communityId}`); // 상세 페이지로 이동
    };

    const handleAdminClick = () => {
        navigate(`/AdminClient/${id}`); // 회원 관리 페이지로 이동
    };

    useEffect(() => {
        show(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    return (
        <div>
            <h1>공지글</h1>
            {error && <p className="error-message">{error}</p>} {/* 오류 메시지 표시 */}
            <button onClick={() => navigate(`/new_community/${id}`)}>생성</button> {/* 생성 버튼 추가 */}
            <button onClick={handleAdminClick}>회원 관리</button> {/* 회원 관리 버튼 추가 */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>작업</th> {/* 작업 열 추가 */}
                    </tr>
                </thead>
                <tbody>
                    {details.length > 0 ? (
                        details.map(community => (
                            <tr key={community.id}>
                                <td>{community.id}</td>
                                <td>{community.title}</td>
                                <td>{community.content}</td>
                                <td>
                                    <button onClick={() => handleViewDetail(community.id)}>상세</button> {/* 상세 버튼 추가 */}
                                    <button onClick={() => handleDelete(community.id)}>삭제</button> {/* 삭제 버튼 추가 */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">데이터가 없습니다.</td> {/* 데이터가 없을 때 메시지 표시 */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
