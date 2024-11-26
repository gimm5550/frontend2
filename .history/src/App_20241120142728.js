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
        <div className="layout">
          {/* 메뉴바: 왼쪽 고정 */}
          <MenuBar />
          {/* 본문: 오른쪽 배치 */}
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
