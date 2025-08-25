import React, { useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti'; // 🎉 Imported confetti
import './UploadCard.css';

const UploadCard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setPrediction('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setPrediction('');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const result = response.data.prediction;
      setPrediction(result);

      // 🎉 Confetti animation based on prediction
      if (result === 'Real') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else if (result === 'Fake') {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#000000']
        });
      }

      // 🔊 Optional sound effect (place sound files in public folder)
      // const sound = new Audio(result === 'Real' ? '/success.mp3' : '/alert.mp3');
      // sound.play();

    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction('Something went wrong! Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-background">
      <div className="glass-card">
        <h2 className="title">Fake Image Detector</h2>

        <div
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag & Drop your Image here or</p>
          <input 
            type="file" 
            className="form-control file-input" 
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="preview">
            <img src={preview} alt="preview" className="preview-img" />
          </div>
        )}

        <button 
          className="btn predict-btn" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Predict'
          )}
        </button>

        {prediction && (
          <div 
            className={`result ${prediction === 'Real' ? 'real' : 'fake'}`}
          >
            {prediction}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
