import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import api from './api';
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
    }, []);

    const handleEditProfile = () => {
        console.log('회원정보 수정 페이지로 이동');
        navigate('/edit_info');
        // 회원정보 수정 로직 추가
        //api.edit_info(user.id);
    };

    const handleDelete = () => {
        if (window.confirm('정말로 회원탈퇴를 하시겠습니까?')) {
            console.log('회원탈퇴 진행 중...');
            api.deleteUser(user) // 서버에 회원탈퇴 요청
                .then(response => {
                    console.log('회원탈퇴 성공:', response.data);
                    alert('회원탈퇴가 완료되었습니다.');
                    localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
                    navigate('/login'); // 로그인 페이지로 이동
                })
                .catch(error => {
                    console.error('회원탈퇴 실패:', error);
                    alert('회원탈퇴 처리 중 오류가 발생했습니다.');
                });
        }
    };


    return (
        <div>
            {user && <p>현재 로그인된 아이디: {user.id}</p>}
            <div>
                <button onClick={handleLogout}>로그아웃</button>
                <button onClick={handleEditProfile}>회원정보 수정</button>
                <button onClick={handleDelete}>회원탈퇴</button>
            </div>
        </div>
    );
}
