import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/upload');
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1 className="main-title">Deepfake Shield</h1>
        <p className="sub-title">Protecting Reality with AI</p>
        <button 
          className="btn btn-primary start-btn"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
