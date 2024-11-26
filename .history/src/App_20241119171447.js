import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LandingPageLayout from './components/layout/LandingPageLayout';
import routes from './routes';
import { AuthProvider } from './AuthContext'; // AuthProvider import
import MenuBar from "./components/common/MenuBar";

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
        {/* 메뉴바 추가 */}
        <MenuBar />
        {/* 메인 컨텐츠: 사이드 메뉴바 오른쪽에 배치 */}
        <div className="main-content">
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<LandingPageLayout />} />
          </Routes>
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;
