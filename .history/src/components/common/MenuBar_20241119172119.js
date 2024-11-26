import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MenuBar.css"; // 스타일링 파일

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
              <Link to="/MyTravel">Google Map 여행 기록</Link>
            </li>
            <li className="menu-item">
              <Link to="/Travel">전체 여행 기록</Link>
            </li>
            <li className="menu-item">
              <Link to="/mainlist">게시글 리스트</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default MenuBar;
