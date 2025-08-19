import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout/UserLayout';
import UserDashboard from '../features/dashboard/UserDashboard';
import TaskList from '../features/Tasks/TaskList';
import AddAssignment from '../features/Tasks/TaskCreate';
import TaskDetails from '../features/Tasks/TaskDetails';
import ProtectedRoute from './ProtectedRoute'; // path as needed
import Account from '../Pages/auth/Account/Account';
const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="assignments" element={<TaskList />} />
          <Route path="assignments/add" element={<AddAssignment />} />
          <Route path="assignments/view/:id" element={<TaskDetails />} />
          <Route path="account" element={<Account />} />
   
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;
