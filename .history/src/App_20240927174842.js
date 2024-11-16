import logo from './logo.svg';
import './App.css';
import FromServer from './components/FromServer';
import { Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<FromServer></FromServer>}></Route>
      </Routes>
    </div>
  );
}

export default App;
