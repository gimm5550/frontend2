import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MenuBar.css"; // 스타일링 파일
import { useNavigate } from 'react-router-dom';
import api from '../../api';
// 홈
// 내 게시글
// 내 여행기록
// 여행기록 탐색
// 회원수정
// 회원탈퇴
// 로그아웃
const MenuBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // 메뉴바 상태 관리
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
            
            api.deleteUser(user.id) // user의 id만 전달
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
    <>
      {/* 메뉴바 */}
      {isMenuOpen && (
        <div className="menu-bar">
          <h3 className="menu-title">Menu</h3>
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/mainlist">홈</Link>
            </li>
            <li className="menu-item">
              <Link to="/MyTravel">내 여행기록</Link>
            </li>
            <li className="menu-item">
              <Link to="/Travel">여행기록 탐색</Link>
            </li>
            <button onClick={handleLogout}>로그아웃</button>
            <button onClick={handleEditProfile}>회원정보 수정</button>
                <button onClick={handleDelete}>회원탈퇴</button>
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuBar;
