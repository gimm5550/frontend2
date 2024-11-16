import logo from './logo.svg';
import './App.css';
import FromServer from './components/FromServer';
import { Route, Routes } from 'react-router-dom';
import UserDetail from './components/UserDetail';
import LandingPageLayout from './components/layout/LandingPageLayout';
import UserDetailLayout from './components/layout/UserDetailLayout';
import routes from './routes';
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
    return null;
  });
  return (
    <div className="App">
      <Routes>
        {getRoutes(routes)}
        <Route path='*' element={<LandingPageLayout></LandingPageLayout>}></Route>
      </Routes>
    </div>
  );
}

export default App;
