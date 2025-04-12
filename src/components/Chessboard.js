import React, { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import axios from 'axios';
import '../App.css';

function ChessGame() {
  const [fen, setFen] = useState('start');
  const [turn, setTurn] = useState('w');
  const [theme, setTheme] = useState("default"); 
  const [captured, setCaptured] = useState({ w: [], b: [] });
  const [winner, setWinner] = useState(null);

  // theme paired to its color 
  const themeColors = {
    default: {
      light: '#f0d9b5',
      dark: '#b58863'
    },
    green: {
      light: '#dfffe0',
      dark: '#3e8e41'
    },
    dark: {
      light: 'add8e6',
      dark: '#4682b4'
    }
  };

  const toggleTheme = () => {
    if (theme === 'default') setTheme('green');
    else if (theme === 'green') setTheme('dark');
    else setTheme('default');
  };

  const pieceValues = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
  };

  const calculateScore = (pieces) => {
    return pieces.reduce((total, piece) => total + (pieceValues[piece.toLowerCase()] || 0), 0);
  };

  const fetchBoard = async () => {
    const res = await axios.get('http://localhost:5000/api/board');
    setFen(res.data.fen);
    setTurn(res.data.turn);
    setCaptured(res.data.captured);
    setWinner(res.data.winner);
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const onDrop = async (sourceSquare, targetSquare) => {
    try {
      const res = await axios.post('http://localhost:5000/api/move', {
        from: sourceSquare,
        to: targetSquare
      });
      setFen(res.data.fen);
      setTurn(res.data.turn);
      setCaptured(res.data.captured);
      setWinner(res.data.winner);
    } catch (err) {
      console.log("Invalid move");
    }
  };

  const resetGame = async () => {
    const res = await axios.post('http://localhost:5000/api/reset');
    setFen(res.data.fen);
    setTurn(res.data.turn);
    setCaptured(res.data.captured);
    setWinner(null);
  };

  const isDraggable = ({ piece, sourceSquare }) => {
    const pieceOnSquare = fen.split(' ')[0]
      .split('/')
      .map(row => row.replace(/\d/g, match => ' '.repeat(+match)))
      .join('')
      .split('')[squareToIndex(sourceSquare)];
  
    if (!pieceOnSquare) return false;
  
    return (turn === 'w' && pieceOnSquare === pieceOnSquare.toUpperCase()) ||
           (turn === 'b' && pieceOnSquare === pieceOnSquare.toLowerCase());
  };

  const squareToIndex = (square) => {
    const files = 'abcdefgh';
    const rank = 8 - parseInt(square[1], 10);
    const file = files.indexOf(square[0]);
    return rank * 8 + file;
  };

  return (
    <div className="container text-center mt-1">
      <div>
        <h5><strong>Score :</strong> White : {calculateScore(captured.b)} <strong> | </strong> Black : {calculateScore(captured.w)}</h5>
      </div>
      {winner ?<h2> `${winner} Wins!`</h2> :<span><strong>Current Turn:</strong>{turn === 'w' ? "White" : "Black"}</span>}
      
      <div className="my-2">
        <button className="btn btn-primary mx-2" onClick={toggleTheme}>
          Toggle Theme
        </button>

        <button className="btn btn-danger mx-2" onClick={resetGame}>
          Reset Game
        </button>
      </div>

      <div className="chessboard-container">
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardOrientation="white"
          boardWidth={400}
          isDraggablePiece={isDraggable}
          customBoardStyle={{
            borderRadius: '10px',
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
          }}
          customDarkSquareStyle={{
            backgroundColor: themeColors[theme].dark,
          }}
          customLightSquareStyle={{
            backgroundColor: themeColors[theme].light,
          }}
        />
      </div>

     
    </div>
  );
}

export default ChessGame;
