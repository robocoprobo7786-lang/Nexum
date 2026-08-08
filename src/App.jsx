import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Faculty from './pages/Faculty';
import FacultyProfile from './pages/FacultyProfile';
import Publications from './pages/Publications';
import AddPublication from './pages/AddPublication';
import PublicationDetails from './pages/PublicationDetails';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="faculty/:id" element={<FacultyProfile />} />
          <Route path="publications" element={<Publications />} />
          <Route path="publications/add" element={<AddPublication />} />
          <Route path="publications/:id" element={<PublicationDetails />} />
          <Route path="contributions" element={<div style={{padding:'2rem'}}>Contributions coming soon</div>} />
          <Route path="reports" element={<Reports />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
