import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LandingPageLayout from './components/layout/LandingPageLayout';
import routes from './routes';
import { AuthProvider } from './AuthContext'; // AuthProvider import
import MenuBar from "./components/common/MenuBar";
// 특정 경로에서 메뉴바 숨기기 (예: /login)
const hideMenuBar = location.pathname === "/login";
function App() {
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

  return (
    <div className="App">
      <AuthProvider>
        <div className="layout">
          {/* 메뉴바: 왼쪽 고정 */}
          {/* 본문: 메뉴바 오른쪽에 위치 */}
          {!hideMenuBar && <MenuBar />}
          <div className="main-content">
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
