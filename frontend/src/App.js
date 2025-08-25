import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadCard from './components/UploadCard';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadCard />} />
      </Routes>
    </Router>
  );
}

export default App;
