import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />

      </Routes>
    </Router>
  );
}

export default App;
