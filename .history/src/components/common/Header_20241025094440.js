import React from 'react';
import { useNavigate } from 'react-router-dom';
// { user, onLogout, onEditProfile }
export default function Header({ user, onLogout, onEditProfile }) {
    const handleLogoutClick = () => {
        if (typeof onLogout === 'function') {
            onLogout(); // onLogout 호출
        } else {
            console.error("onLogout prop is not a function");
        }
    };
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log('로그아웃 처리');
        onLogout();
        console.log('로그아웃 처리2');
        navigate('/login');
    };

    const handleEditProfile = () => {
        console.log('회원정보 수정 페이지로 이동');
        onEditProfile();
        console.log('회원정보 수정 페이지로 이동2');
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
