import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import { IncidentsBySector } from './pages/incidents';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { CreateIncident } from './pages/create_incident';

import './index.css';
import Statistic from './pages/statistic';

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
        <Route
          path="/statistic"
          element={
            <AuthProvider >
              <Statistic />
            </AuthProvider >
          }
        />
      </Routes >
      <ToastContainer position='top-right' autoClose={5000} />
    </>
  );

};

export default App;
