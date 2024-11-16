import React, { useEffect, useState } from "react";
import api from '../api'; // api 모듈 import
import { useNavigate } from "react-router-dom";
import '../MainList.css'; // CSS 파일을 불러옵니다.
import Header from './Header'; // Header 컴포넌트 import

export default function MainList() {
    const [communities, setCommunities] = useState([]);
    const [user, setUser] = useState(null); // 사용자 정보 상태
    const navigate = useNavigate();

    const fetchCommunities = () => {
        api.list() // 커뮤니티 목록을 가져오는 API 호출
            .then(response => {
                const { data } = response.data[0]; // 적절한 데이터 구조에 맞춰 수정 필요
                setCommunities(data); // 데이터를 상태에 저장
            })
            .catch(err => {
                console.log(JSON.stringify(err));
            });
    };

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
        setUser(userData);
        fetchCommunities(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    const handleLogout = () => {
        console.log('로그아웃 처리');
        localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
        navigate('/login');
    };

    const handleEditProfile = () => {
        console.log('회원정보 수정 페이지로 이동');
        // 회원정보 수정 로직 추가
    };

    const handleJoinCommunity = async (communityid) => {
        try {
            const response = await api.get_pending_clients2(user.id); // user.id를 보내야함. 해당 사용자의 아이디가 포함되어있는지 확인해야하기 때문..
            navigate(`/community_detail/${communityid}`);
            return; // 여기서 return을 해야 함.
        } catch (err) {
            // 오류 처리
        }
        try {
            // 승인 요청 API 호출
            const response = await api.request_join_community(user.id, communityid); // user.id와 community ID를 보내는 API 호출
            console.log("response:", response);
            alert("승인 요청이 완료되었습니다.");
        } catch (err) {
            alert("승인 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <Header user={user} onLogout={handleLogout} onEditProfile={handleEditProfile} /> {/* Header 추가 */}
            <h1>커뮤니티 목록</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>관리자 ID</th>
                        <th>회원 수</th>
                        <th>지역</th>
                        <th>입장</th>
                    </tr>
                </thead>
                <tbody>
                    {communities.map(community => (
                        <tr key={community.id}>
                            <td>{community.id}</td>
                            <td>{community.title}</td>
                            <td>{community.content}</td>
                            <td>{community.admin_id}</td>
                            <td>{community.member_count}</td>
                            <td>{community.region}</td>
                            <td>
                                <button onClick={() => handleJoinCommunity(community.id)}>입장</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
