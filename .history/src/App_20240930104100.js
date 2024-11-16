import logo from './logo.svg';
import './App.css';
import FromServer from './components/FromServer';
import { Route, Routes } from 'react-router-dom';
import UserDetail from './components/UserDetail';
import LandingPageLayout from './components/layout/LandingPageLayout';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LandingPageLayout></LandingPageLayout>}></Route>
        <Route path='/user-detail/:userId' element={<UserDetail></UserDetail>}></Route>
      </Routes>
    </div>
  );
}

export default App;
