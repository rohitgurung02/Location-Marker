"use client"
import { useState } from 'react';

export default function AddLocation() {
  const [formData, setFormData] = useState({
    longitude: '',
    latitude: '',
    potholes: '',
    animalProneAreas: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/tracker', {
        method: 'POST',
        body: new URLSearchParams(formData),
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage('Location added successfully!');
        setFormData({ longitude: '', latitude: '', potholes: '', animalProneAreas: '' });
      } else {
        setStatusMessage('Failed to add location. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage('An unexpected error occurred.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Add Location</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Longitude:
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Latitude:
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Potholes:
            <input
              type="text"
              name="potholes"
              value={formData.potholes}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Animal Prone Areas:
            <input
              type="text"
              name="animalProneAreas"
              value={formData.animalProneAreas}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add Location
        </button>
      </form>

      {statusMessage && (
        <p style={{ marginTop: '20px', color: statusMessage.includes('successfully') ? 'green' : 'red' }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}
