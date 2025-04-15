import React, { useEffect, useState } from 'react';
import ChessBoardComponent from './components/Chessboard';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import { pieceSets, getPieceImage } from './components/pieceSets';

function ChessGame() {
  const [fen, setFen] = useState('start');
  const [turn, setTurn] = useState('w');
  const [theme, setTheme] = useState("default");
  const [captured, setCaptured] = useState({ w: [], b: [] });
  const [winner, setWinner] = useState(null);
  const pieceStyles = ['alpha', 'neo', 'classic'];
  const [pieceStyle, setPieceStyle] = useState('alpha');  
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidMove, setIsInvalidMove] = useState(false);



  const themeColors = {
    default: { light: '#f0d9b5', dark: '#b58863' },
    green: { light: '#dfffe0', dark: '#3e8e41' },
    dark: { light: '#add8e6', dark: '#4682b4' }
  };

  const pieceSets = {
    classic: "https://images.chesscomfiles.com/chess-themes/pieces/classic/150",
    neo: "https://images.chesscomfiles.com/chess-themes/pieces/neo/150",
    alpha: "https://images.chesscomfiles.com/chess-themes/pieces/alpha/150"
  };

  const toggleTheme = () => {
    const next = theme === 'default' ? 'green' : theme === 'green' ? 'dark' : 'default';
    setTheme(next);
  };

  const togglePieceStyle = () => {
    const currentIndex = pieceStyles.indexOf(pieceStyle);
    const nextIndex = (currentIndex + 1) % pieceStyles.length;
    setPieceStyle(pieceStyles[nextIndex]);
  };

  const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const calculateScore = (pieces) =>
    pieces.reduce((total, piece) => total + (pieceValues[piece.toLowerCase()] || 0), 0);

  const fetchBoard = async () => {
    const res = await axios.get('https://chessboard-backend-prwn.onrender.com/api/board');
    setFen(res.data.fen);
    setTurn(res.data.turn);
    setCaptured(res.data.captured);
    setWinner(res.data.winner);
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const onDrop = async (sourceSquare, targetSquare) => {
    if (winner|| isLoading) return;
    setIsInvalidMove(false);
    setIsLoading(true);
    try {
      const res = await axios.post('https://chessboard-backend-prwn.onrender.com/api/move', {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });
      setFen(res.data.fen);
      setTurn(res.data.turn);
      setCaptured(res.data.captured);
      setWinner(res.data.winner);
    } catch (err) {
      console.log("Invalid move");
      setIsInvalidMove(true)
      setTimeout(()=>{setIsInvalidMove(false);},100);
    }finally{
      setIsLoading(false);
    }
  };

  const resetGame = async () => {
    const res = await axios.post('https://chessboard-backend-prwn.onrender.com/api/reset');
    setFen(res.data.fen);
    setTurn(res.data.turn);
    setCaptured(res.data.captured);
    setWinner(null);
  };

  return (
    <div className="container text-center mt-1">
    <h2>Chess Game</h2>
    
      <h5><strong>Score :</strong> White : {calculateScore(captured.b)} | Black : {calculateScore(captured.w)}</h5>
      {winner ? <h2>{winner} Wins!</h2> : <span><strong>Current Turn:</strong> {turn === 'w' ? "White" : "Black"}</span>}

      <div className="my-2">
        <button className="btn btn-primary mx-2" onClick={toggleTheme}>Toggle Theme</button>
        <button className="btn btn-secondary mx-2" onClick={togglePieceStyle}>Switch Piece Style</button>
        <button className="btn btn-danger mx-2" onClick={resetGame}>Reset Game</button>
      </div>
      
     
      <ChessBoardComponent
        fen={fen}
        onDrop={onDrop}
        themeColors={themeColors[theme]}
        pieceStyle={pieceStyle}
        pieceSets={pieceSets}
        turn={turn}
      />

        {winner && <div className="alert alert-success mt-2">Winner: {winner}</div>}
        {(isLoading|| isInvalidMove) &&  <div className="loading-overlay"><p >
        {isInvalidMove ? "Invalid Move" : "Processing Move..."}</p></div>}
    </div>
  );

}

export default ChessGame;
