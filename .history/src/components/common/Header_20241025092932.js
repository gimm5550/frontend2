import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ user, onLogout, onEditProfile }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('로그아웃 처리');
        onLogout();
        navigate('/login');
    };

    const handleEditProfile = () => {
        console.log('회원정보 수정 페이지로 이동');
        onEditProfile();
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
