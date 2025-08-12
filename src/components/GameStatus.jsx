import React from 'react';

function GameStatus({ gameState, username, onNewGame }) {
  const getStatusMessage = () => {
    if (gameState.status === 'won') {
      if (gameState.winner === gameState.playerIndex) {
        return '🎉 You won! 🎉';
      } else {
        return `😔 ${gameState.opponent || 'Opponent'} won!`;
      }
    }
    
    if (gameState.status === 'draw') {
      return "🤝 It's a draw!";
    }
    
    if (gameState.isYourTurn) {
      return "🎯 Your turn!";
    } else {
      return `⏳ Waiting for ${gameState.opponent}...`;
    }
  };

  const getPlayerLabel = (playerIndex) => {
    if (playerIndex === gameState.playerIndex) {
      return 'You';
    }
    return gameState.opponent;
  };

  return (
    <div className="game-status">
      <div className="status-header">
        <h3>Game Status</h3>
        <div className="status-message">
          {getStatusMessage()}
        </div>
      </div>
      
      <div className="game-info">
        <div className="player-info">
          <div className="player player1">
            <span className="player-label">Player 1:</span>
            <span className="player-name">{getPlayerLabel(0)}</span>
            <div className="player-disc player1"></div>
          </div>
          
          <div className="player player2">
            <span className="player-label">Player 2:</span>
            <span className="player-name">{getPlayerLabel(1)}</span>
            <div className="player-disc player2"></div>
          </div>
        </div>
        
        <div className="game-details">
          <div className="detail-item">
            <span className="detail-label">Moves:</span>
            <span className="detail-value">{gameState.moves.length}</span>
          </div>
          
          <div className="detail-item">
            
          </div>
        </div>
      </div>
      
      {(gameState.status === 'won' || gameState.status === 'draw') && (
        <div className="game-actions">
          <button onClick={onNewGame} className="new-game-btn">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default GameStatus;
