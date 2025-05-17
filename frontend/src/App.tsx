// App.tsx
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/main';
import Login from './pages/login';
import { IncidentsBySector } from './pages/incidents';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

import './index.css';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/incidents"
          element={
            <AuthProvider>
              <IncidentsBySector />
            </AuthProvider>
          }
        />
      </Routes>
    </>
  );

};

export default App;
