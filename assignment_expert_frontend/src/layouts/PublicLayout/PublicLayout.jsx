// src/layouts/PublicLayout.jsx
import Navbar from '../../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main style={{ marginTop: '80px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
