import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/main';
import { Login } from './pages/login';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />
      < Router >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router >
    </>
  );
}

export default App;
