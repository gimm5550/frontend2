import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../api';
import { useNavigate } from "react-router-dom";
import '/MainList.css'; // CSS 파일을 불러옵니다.

export default function MainList() {
    const [communities, setCommunities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
        fetchCommunities(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    const handleLogout = () => {
        // 로그아웃 처리 로직을 추가하세요.
        console.log('로그아웃 처리');
        
        navigate('/login');
    };

    const handleEditProfile = () => {
        // 회원정보 수정 로직을 추가하세요.
        console.log('회원정보 수정 페이지로 이동');
    };

    const handleSearch = () => {
        // 지역 검색 로직을 추가하세요. (예: API 호출 또는 필터링)
        console.log(`검색어: ${searchTerm}`);
    };

    const handleCreateCommunity = () => {
        // 커뮤니티 생성 로직을 추가하세요.
        console.log('커뮤니티 생성 페이지로 이동');
    };

    const handleJoinCommunity = (id) => {
        // 커뮤니티 입장 로직을 추가하세요.
        console.log(`커뮤니티 ${id}에 입장`);
    };

    return (
        <div>
            <h1>커뮤니티 목록</h1>
            <div>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={handleEditProfile}>회원정보 수정</button>
                <button onClick={handleSearch}>지역 검색</button>
                <button onClick={handleCreateCommunity}>커뮤니티 생성</button>
            </div>
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
