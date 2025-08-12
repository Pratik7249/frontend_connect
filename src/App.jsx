import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import UsernameForm from './components/UsernameForm';
import Leaderboard from './components/Leaderboard';
import GameStatus from './components/GameStatus';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [gameState, setGameState] = useState(null);
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [matchmakingStatus, setMatchmakingStatus] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameStats, setGameStats] = useState(null);

  useEffect(() => {
    // Fetch initial data
    fetchLeaderboard();
    fetchGameStats();
  }, []);

  

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  const fetchGameStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setGameStats(data);
    } catch (error) {
      console.error('Failed to fetch game stats:', error);
    }
  };

  const handleUsernameSubmit = (submittedUsername) => {
    setUsername(submittedUsername);
    connectWebSocket(submittedUsername);
  };

  const connectWebSocket = (user) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3001`;
    
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Join game
      websocket.send(JSON.stringify({
        type: 'join_game',
        username: user
      }));
      
      setMatchmakingStatus('Looking for opponent...');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setGameState(null);
      setMatchmakingStatus('');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setWs(websocket);
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'matchmaking':
        setMatchmakingStatus(data.message);
        break;
        
      case 'game_state':
        setGameState(data.game);
        setMatchmakingStatus('');
        break;
        
      case 'error':
        console.error('Game error:', data.message);
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const handleColumnClick = (column) => {
    if (ws && gameState && gameState.isYourTurn) {
      ws.send(JSON.stringify({
        type: 'make_move',
        column: column
      }));
    }
  };

  const handleNewGame = () => {
    if (ws) {
      ws.send(JSON.stringify({
        type: 'join_game',
        username: username
      }));
      setGameState(null);
      setMatchmakingStatus('Looking for opponent...');
    }
  };

  const handleDisconnect = () => {
    if (ws) {
      ws.close();
    }
    setUsername('');
    setGameState(null);
    setWs(null);
    setIsConnected(false);
    setMatchmakingStatus('');
  };

  if (!username) {
    return <UsernameForm onSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Connect Four</h1>
        <div className="user-info">
          <span>Playing as: {username}</span>
          <button onClick={handleDisconnect} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="game-section">
          {matchmakingStatus && (
            <div className="matchmaking-status">
              {matchmakingStatus}
            </div>
          )}

          {gameState && (
            <>
              <GameStatus 
                gameState={gameState} 
                username={username}
                onNewGame={handleNewGame}
              />
              <GameBoard 
                board={gameState.board}
                onColumnClick={handleColumnClick}
                isYourTurn={gameState.isYourTurn}
                gameStatus={gameState.status}
              />
            </>
          )}
        </div>

        <div className="sidebar">
          <Leaderboard 
            leaderboard={leaderboard} 
            onRefresh={fetchLeaderboard}
          />
          
          {gameStats && (
            <div className="game-stats">
              <h3>Game Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Games:</span>
                  <span className="stat-value">{gameStats.overall?.total_games || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Human Games:</span>
                  <span className="stat-value">{gameStats.overall?.human_games || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Bot Games:</span>
                  <span className="stat-value">{gameStats.overall?.bot_games || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Players:</span>
                  <span className="stat-value">{gameStats.playerCount || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
