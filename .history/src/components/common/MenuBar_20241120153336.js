import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../Apcss";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const MenuBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("로그아웃 처리");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const handleEditProfile = () => {
    console.log("회원정보 수정 페이지로 이동");
    navigate("/edit_info");
  };

  const handleDelete = () => {
    if (window.confirm("정말로 회원탈퇴를 하시겠습니까?")) {
      console.log("회원탈퇴 진행 중...");
      api
        .deleteUser(user.id)
        .then((response) => {
          console.log("회원탈퇴 성공:", response.data);
          alert("회원탈퇴가 완료되었습니다.");
          localStorage.removeItem("user");
          navigate("/login");
        })
        .catch((error) => {
          console.error("회원탈퇴 실패:", error);
          alert("회원탈퇴 처리 중 오류가 발생했습니다.");
        });
    }
  };

  return (
    <>
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
              <Link to="/GoogleMap">여행기록 생성</Link>
            </li>
          </ul>
          <button onClick={handleLogout}>로그아웃</button>
          <button onClick={handleEditProfile}>회원정보 수정</button>
          <button onClick={handleDelete}>회원탈퇴</button>
        </div>
      )}
    </>
  );
};

export default MenuBar;
