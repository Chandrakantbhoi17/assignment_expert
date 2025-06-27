import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Pages/auth/SignUp/Signup.jsx';
import Login from './Pages/auth/Login/Login.jsx';
import Task from './features/Tasks/TaskList.jsx';
import Addassignment from './features/Tasks/TaskCreate.jsx';
import Navbar from '../src/components/Navbar/Navbar.jsx';

function App() {
  return (
    <div>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/assignment" element={<Task />} />
          <Route path="/add-assignment" element={<Addassignment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
