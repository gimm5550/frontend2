import logo from './logo.svg';
import './App.css';
import FromServer from './components/FromServer';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
  <BrowserRouter>
    <div className="App">
      <FromServer></FromServer>
    </div>
  </BrowserRouter>
  );
}

export default App;
