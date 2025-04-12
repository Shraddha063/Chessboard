import React, { useEffect, useState } from "react";

import ChessGame from "./components/Chessboard";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState("white");
  const [selected, setSelected] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [score, setScore] = useState({ white: 0, black: 0 });
  const [winner, setWinner] = useState(null);
  const [theme, setTheme] = useState("classic");
  const [pieceStyle, setPieceStyle] = useState("default");

  const fetchBoard = async () => {
    try {
      const response = await fetch("https://chessboard-backend-prwn.onrender.com/api/board");
      const data = await response.json();
      setBoard(data.board);
      setTurn(data.turn);
      setWinner(data.winner || null);
      setScore(data.score || { white: 0, black: 0 });
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  };
 
  useEffect(() => {
    fetchBoard();
  }, []);

  const handleSquareClick = async (row, col) => {
    if (winner) return;

    if (!selected || selected.row !== row || selected.col !== col) {
      setSelected({ row, col });
      try {
        const response = await fetch("https://chessboard-backend-prwn.onrender.com/api/legal-moves", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from: { row, col } }),
        });
        const data = await response.json();
        setLegalMoves(data.legalMoves || []);
      } catch (err) {
        console.error("Error fetching legal moves:", err);
        setLegalMoves([]);
      }
    } else {
      try {
        const response = await fetch("https://chessboard-backend-prwn.onrender.com/api/move", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from: selected, to: { row, col } }),
        });

        const data = await response.json();

        if (data.success) {
          setBoard(data.board);
          setTurn(data.turn);
          setWinner(data.winner || null);
          setScore(data.score);
        } else {
          alert(data.message || "Invalid move.");
        }
        setSelected(null);
        setLegalMoves([]);
      } catch (err) {
        console.error("Move failed:", err);
        setSelected(null);
        setLegalMoves([]);
      }
    }
  };

  const handleThemeChange = (newTheme) => setTheme(newTheme);
  const handlePieceStyleChange = (style) => setPieceStyle(style);

  const resetGame = async () => {
    try {
      await fetch("https://chessboard-backend-prwn.onrender.com/api/reset", { method: "POST" });
      fetchBoard();
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  

const toggleTheme = () => {
  const currentIndex = themes.indexOf(theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  setTheme(themes[nextIndex]);
};


  return (
    
    <div className="container text-center mt-1">
      <h2>Chess Game</h2>
      <div className="chessboard-container">
  <ChessGame
     board={board}
     selected={selected}
     onSquareClick={handleSquareClick}
     theme={theme}
     pieceStyle={pieceStyle}
     legalMoves={legalMoves}
     toggleTheme={toggleTheme}
  />
</div>

      </div>

   
  );
}

export default App;
