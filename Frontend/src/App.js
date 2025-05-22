import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Questionnaire from './components/Questionnaire';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;