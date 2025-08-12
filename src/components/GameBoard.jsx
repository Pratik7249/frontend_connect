import React from 'react';

function GameBoard({ board, onColumnClick, isYourTurn, gameStatus }) {
  const handleColumnClick = (column) => {
    if (gameStatus === 'playing' && isYourTurn) {
      onColumnClick(column);
    }
  };

  const renderCell = (row, col) => {
    const cellValue = board[row][col];
    let cellClass = 'cell';
    
    if (cellValue === 0) {
      cellClass += ' player1';
    } else if (cellValue === 1) {
      cellClass += ' player2';
    }
    
    return (
      <div key={`${row}-${col}`} className={cellClass}>
        {cellValue !== null && <div className="disc" />}
      </div>
    );
  };

  const renderColumn = (col) => {
    return (
      <div 
        key={col} 
        className={`column ${gameStatus === 'playing' && isYourTurn ? 'clickable' : ''}`}
        onClick={() => handleColumnClick(col)}
      >
        {board.map((row, rowIndex) => renderCell(rowIndex, col))}
      </div>
    );
  };

  return (
    <div className="game-board">
      <div className="board-container">
        {Array.from({ length: 7 }, (_, col) => renderColumn(col))}
      </div>
      
      {gameStatus === 'playing' && !isYourTurn && (
        <div className="waiting-message">
          Waiting for opponent's move...
        </div>
      )}
      
      {gameStatus === 'won' && (
        <div className="game-over-message won">
          Game Over! {board.flat().filter(cell => cell !== null).length % 2 === 0 ? 'Player 2' : 'Player 1'} wins!
        </div>
      )}
      
      {gameStatus === 'draw' && (
        <div className="game-over-message draw">
          Game Over! It's a draw!
        </div>
      )}
    </div>
  );
}

export default GameBoard;
