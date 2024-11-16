import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ user, onLogout, onEditProfile }) {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        if (typeof onLogout === 'function') {
            onLogout(); // onLogout 호출
            navigate('/login'); // 로그아웃 후 리다이렉션
        } else {
            console.error("onLogout prop is not a function");
        }
    };

    const handleEditProfile = () => {
        console.log('회원정보 수정 페이지로 이동');
        onEditProfile(); // 회원정보 수정 호출
    };

    return (
        <div>
            {user && <p>현재 로그인된 아이디: {user.id}</p>}
            <div>
                <button onClick={handleLogoutClick}>로그아웃</button>
                <button onClick={handleEditProfile}>회원정보 수정</button>
            </div>
        </div>
    );
}
