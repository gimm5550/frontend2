import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MenuBar.css"; // 스타일링 파일
// 홈
// 내 게시글
// 내 여행기록
// 여행기록 탐색
// 회원수정
// 회원탈퇴
// 로그아웃
const MenuBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // 메뉴바 상태 관리

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // 메뉴바 열고 닫기 토글
  };

  return (
    <>
      {/* 토글 버튼 */}
      <button className="menu-toggle-button" onClick={toggleMenu}>
        {isMenuOpen ? "Close Menu" : "Open Menu"}
      </button>
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
            <li className="menu-item">
              <Link to="/Travel">회원수정</Link>
            </li>
            <li className="menu-item">
              <Link to="/mainlist">회원탈퇴</Link>
            </li>
            <li className="menu-item">
              <Link to="/MyTravel">로그아웃</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuBar;
