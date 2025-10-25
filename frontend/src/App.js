import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClaimsPage from './pages/ClaimsPage';
import ClaimPage from './pages/ClaimPage';
import ClaimForm from './components/ClaimForm';

// Page transition component
const PageLayout = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageLayout><Home /></PageLayout>} />
            <Route path="/login" element={<PageLayout><LoginPage onLogin={handleLogin} /></PageLayout>} />
            <Route path="/register" element={<PageLayout><RegisterPage onRegister={handleLogin} /></PageLayout>} />
            <Route path="/claims" element={<PageLayout><ClaimsPage user={user} /></PageLayout>} />
            <Route path="/claims/:id" element={<PageLayout><ClaimPage user={user} /></PageLayout>} />
            <Route path="/submit-claim" element={<PageLayout><ClaimForm user={user} /></PageLayout>} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;