import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './UserRoutes';
// import AdminRoutes from './AdminRoutes';
import Home from '../Pages/Home/Home';
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
const AppRoutes = () => {
  return (
    <Routes>
 
      {/* User Routes */}
      <Route path="/user/*" element={<UserRoutes />} />

      {/* Admin Routes */}
      {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}

      {/* Default or fallback route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
