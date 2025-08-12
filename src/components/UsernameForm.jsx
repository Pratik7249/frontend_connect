import React, { useState } from 'react';

function UsernameForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (username.length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }
    
    if (username.length > 20) {
      setError('Username must be less than 20 characters long');
      return;
    }
    
    setError('');
    onSubmit(username.trim());
  };

  return (
    <div className="username-form">
      <div className="form-container">
        <h1>Connect Four</h1>
        <h2>Multiplayer Game</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Enter your username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              maxLength={20}
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="join-btn">
            Join Game
          </button>
        </form>
        
        <div className="game-info">
          <p>• Play against other players or challenge the AI bot</p>
          <p>• Get matched automatically or play against bot after 10 seconds</p>
          <p>• Real-time gameplay with WebSocket technology</p>
        </div>
      </div>
    </div>
  );
}

export default UsernameForm;
