import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useNavigate 및 useParams import 추가
import api from '../api';
import '../MainList.css';

export default function CommunityDetail() {
    const [details, setDetails] = useState(null); // 초기값을 null로 설정
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // useNavigate 훅 사용
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기

    const show = () => {
        console.log("show 실행됨");
        api.detail_show(id)
            .then(response => {
                console.log("전체 응답:", response.data); // 전체 응답 로그 출력

                const communityData = response.data; // 전체 공지사항 데이터
                console.log("communityData:", communityData); // 데이터 확인

                // response.data가 배열이지만 첫 번째 요소를 가져온다고 가정
                if (communityData && communityData.length > 0) {
                    console.log("if문으로 빠짐")
                    setDetails(communityData[0]); // 첫 번째 객체만 저장
                } else {
                    console.log("데이터가 없습니다.");
                    setError("데이터가 없습니다."); // 오류 메시지 설정
                }
            })
            .catch(err => {
                console.error("API 호출 중 오류 발생:", JSON.stringify(err));
                setError("API 호출 중 오류가 발생했습니다."); // 오류 메시지 설정
            });
    };

    const handleDelete = (communityId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            console.log("id:", communityId);
            api.detail_delete(communityId) // 삭제 API 호출
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
            <button onClick={() => navigate('/new_community')}>생성</button> {/* 생성 버튼 추가 */}
            <button onClick={handleAdminClick}>회원 관리</button> {/* 회원 관리 버튼 추가 */}
            {details ? (
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
                        <tr key={details.id}>
                            <td>{details.id}</td>
                            <td>{details.title}</td>
                            <td>{details.content}</td>
                            <td>
                                <button onClick={() => handleViewDetail(details.id)}>상세</button> {/* 상세 버튼 추가 */}
                                <button onClick={() => handleDelete(details.id)}>삭제</button> {/* 삭제 버튼 추가 */}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>데이터를 불러오는 중...</p> // 데이터 로딩 중 메시지
            )}
        </div>
    );
}
