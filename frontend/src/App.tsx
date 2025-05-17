// App.tsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import { IncidentsBySector } from './pages/incidents';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { CreateIncident } from './pages/create_incident';

import './index.css';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/create_incident"
          element={
            <AuthProvider>
              <CreateIncident />
            </AuthProvider>
          }
        />
        <Route
          path="/"
          element={
            <AuthProvider >
              <IncidentsBySector />
            </AuthProvider >
          }
        />
      </Routes >
    </>
  );

};

export default App;
