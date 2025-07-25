import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to="/dashboard">TicketFlow</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/create-ticket" className="hover:underline">Create Ticket</Link>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
            {user && user.role === 'admin' && (
              <Link to="/admin" className="hover:underline">Admin Panel</Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 