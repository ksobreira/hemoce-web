import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';



function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/login" replace />} />

      
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      
      
      <Route path="*" element={<div style={{ color: '#fff', padding: '20px' }}>Página não encontrada (404)</div>} />
    </Routes>
  );
}

export default AppRoutes;