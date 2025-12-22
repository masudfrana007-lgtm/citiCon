// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ open, onClose }) => {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { to: "/", label: "Home" },
    { to: "/create-post", label: "Create Post" },
    { to: "/candidates", label: "Candidates" },
    { to: "/ads", label: "Ads" },
    { to: "/analytics", label: "Analytics" },
    { to: "/transparency", label: "Transparency" },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      navigate('/signin');
      if (isMobile) onClose();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleNavClick = () => {
    if (isMobile) onClose();
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      className="sidebar-drawer"
    >
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">Citizen Connect</div>
          {isMobile && (
            <IconButton onClick={onClose}>
              <MenuIcon />
            </IconButton>
          )}
        </div>

        <div className="menu-items">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `menu-item ${isActive ? 'active' : ''}`
              }
              end
            >
              {item.label}
            </NavLink>
          ))}

          <div className="menu-divider" />

          <NavLink to="/settings" onClick={handleNavClick} className="menu-item">
            Settings
          </NavLink>
          <NavLink to="/help" onClick={handleNavClick} className="menu-item">
            Help
          </NavLink>
          <NavLink to="/admin" onClick={handleNavClick} className="menu-item">
            Admin
          </NavLink>
        </div>

        <div className="sidebar-footer">
          {loading ? (
            <div className="loading-text">Loading...</div>
          ) : user ? (
            <div className="user-section">
              <div className="user-name">{user.name || 'User'}</div>
              <div className="user-email">{user.email}</div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => {
                navigate('/signin');
                if (isMobile) onClose();
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
