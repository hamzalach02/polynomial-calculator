import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State for polynomial coefficients input and calculated roots
  const [coefficients, setCoefficients] = useState('');
  const [roots, setRoots] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRoots(null);
    setLoading(true);

    try {
      // Convert input string to array of numbers
      const coefficientsArray = JSON.parse(coefficients);
      
      // Make API request to backend
      const response = await axios.post('http://localhost:8080/calculate', {
        coefficients: coefficientsArray
      });

      setRoots(response.data);
    } catch (err) {
      if (err.name === 'SyntaxError') {
        setError('Invalid input format. Please enter coefficients as an array (e.g., [1, -6, 11, -6])');
      } else {
        setError(err.response?.data?.message || 'An error occurred while calculating roots');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Polynomial Root Calculator</h1>
      </header>
      <main className="App-main">
        <form onSubmit={handleSubmit} className="calculator-form">
          <div className="form-group">
            <label htmlFor="coefficients">Enter Polynomial Coefficients:</label>
            <input
              type="text"
              id="coefficients"
              value={coefficients}
              onChange={(e) => setCoefficients(e.target.value)}
              placeholder="[1, -6, 11, -6]"
              required
            />
            <small className="help-text">
              Enter coefficients as an array, starting with the highest degree
            </small>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Roots'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {roots && (
          <div className="results">
            <h2>Roots:</h2>
            <ul>
              {roots.map((root, index) => (
                <li key={index}>x{index + 1} = {root}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;