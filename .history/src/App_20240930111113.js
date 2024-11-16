import logo from './logo.svg';
import './App.css';
import FromServer from './components/FromServer';
import { Route, Routes } from 'react-router-dom';
import UserDetail from './components/UserDetail';
import LandingPageLayout from './components/layout/LandingPageLayout';
import UserDetailLayout from './components/layout/UserDetailLayout';
function App() {
  const getRoutes = (allRoutes) =>
  allRoutes.map((route) => {
    if (route.route){
      return (
        <Route
        exact
        path={route.route}
        element={route.component}
        key={route.key}
        />
      );
    }
  })
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LandingPageLayout></LandingPageLayout>}></Route>
        <Route path='/user-detail/:userId' element={<UserDetailLayout></UserDetailLayout>}></Route>
      </Routes>
    </div>
  );
}

export default App;
