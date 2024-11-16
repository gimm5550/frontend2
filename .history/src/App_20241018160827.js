import React from 'react';
import './App.css';
import FromServer from './components/FromServer';
import { Route, Routes } from 'react-router-dom';
import UserDetail from './components/UserDetail';
import LandingPageLayout from './components/layout/LandingPageLayout';
import UserDetailLayout from './components/layout/UserDetailLayout';
import routes from './routes';
import { AuthProvider } from './AuthContext'; // AuthProvider import

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
      <AuthProvider> {/* AuthProvider로 전체 애플리케이션 감싸기 */}
        <Routes>
          {getRoutes(routes)}
          <Route path='*' element={<LandingPageLayout />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
