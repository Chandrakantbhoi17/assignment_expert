import './App.css';
import { Routes, Route } from 'react-router-dom';
import Signup from './Pages/auth/SignUp/Signup.jsx';
import Login from './Pages/auth/Login/Login.jsx';
import UserRoutes from './routes/UserRoutes'; // <-- Import your user-specific routes
import PublicLayout from './layouts/PublicLayout/PublicLayout.jsx';
import Home from './Pages/Home/Home.jsx';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* User Routes (dashboard, tasks, etc.) */}
      <Route path="/user/*" element={<UserRoutes />} />
    </Routes>
  );
}

export default App;
