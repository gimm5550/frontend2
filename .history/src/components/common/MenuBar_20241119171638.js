import React from "react";
import { Link } from "react-router-dom";
import "./MenuBar.css"; // 스타일링 파일

const MenuBar = () => {
  return (
    <div className="menu-bar">
      <h3 className="menu-title">Menu</h3>
      <ul className="menu-list">
        <li className="menu-item">
          <Link to="/google-map-records">Google Map 여행 기록</Link>
        </li>
        <li className="menu-item">
          <Link to="/all-travel-records">전체 여행 기록</Link>
        </li>
        <li className="menu-item">
          <Link to="/main-list">게시글 리스트</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuBar;
