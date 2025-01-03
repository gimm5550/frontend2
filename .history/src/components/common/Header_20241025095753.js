import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
export default function Header() {
    const [user, setUser] = useState(null); // 사용자 정보 상태
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log('로그아웃 처리');
        localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
        navigate('/login');
    };
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
        setUser(userData);
        fetchCommunities(); // 컴포넌트가 마운트될 때 커뮤니티 목록을 가져옵니다.
    }, []);

    const handleEditProfile = () => {
        console.log('회원정보 수정 페이지로 이동');
        // 회원정보 수정 로직 추가
    };


    return (
        <div>
            {user && <p>현재 로그인된 아이디: {user.id}</p>}
            <div>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={handleEditProfile}>회원정보 수정</button>
            </div>
        </div>
    );
}
