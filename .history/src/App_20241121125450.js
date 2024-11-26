import React from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import LandingPageLayout from './components/layout/LandingPageLayout';
import routes from './routes';
import { AuthProvider } from './AuthContext'; // AuthProvider import
import MenuBar from "./components/common/MenuBar";

function App() {
  const location = useLocation(); // React Router의 useLocation 훅 사용

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      }
      return null;
    });

  // 로그인 페이지 여부 확인
  const isHiddenPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <div className="App">
      <AuthProvider>
        {/* Flexbox 컨테이너 */}
        <div className="layout">
          {/* 메뉴바 */}
          {!isHiddenPage && ( // 로그인 페이지에서는 완전히 숨김
            <div className="menu-bar" style={{ width: '275px' }}>
              <MenuBar />
            </div>
          )}
          {/* 오른쪽 본문 */}
          <div className="main-content1">
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<LandingPageLayout />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;
