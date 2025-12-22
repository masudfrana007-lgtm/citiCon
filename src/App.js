// src/App.js
import React, { useState } from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

// Components & Pages
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import CandidatesPage from './pages/CandidatesPage';
import AdsPage from './pages/AdsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TransparencyPage from './pages/TransparencyPage';
import HelpPage from './pages/HelpPage';
import AdminPage from './pages/AdminPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DataDeletionPage from "./pages/DataDeletionPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <Routes>
        {/* Standalone full-screen Sign-In page – no sidebar, no layout */}
        <Route path="/signin" element={<SignInPage />} />
	      <Route path="/signup" element={<SignUpPage />} />

        {/* All other routes use the full app layout with sidebar and FAB */}
        <Route
          path="/*"
          element={
            <div className="App">
              {!sidebarOpen && (
                <IconButton
                  className="hamburger-btn"
                  onClick={() => setSidebarOpen(true)}
                >
                  <MenuIcon fontSize="large" />
                </IconButton>
              )}

              <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              <div className={`main ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/create-post" element={<CreatePostPage />} />
                  <Route path="/candidates" element={<CandidatesPage />} />
                  <Route path="/ads" element={<AdsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/transparency" element={<TransparencyPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/admin" element={<AdminPage />} />

                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />	
  	              <Route path="/data-deletion" element={<DataDeletionPage />} />
{/*
                  // <Route
                  //   path="/create-post"
                  //   element={
                  //     <ProtectedRoute>
                  //       <CreatePostPage />
                  //     </ProtectedRoute>
                  //   }
                  // />
                  */}
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                </Routes>

                <button className="fab">+</button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
