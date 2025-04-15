import React from 'react';
import { Chessboard } from 'react-chessboard';
// import { pieceSets, getPieceImage } from './pieceSets';


const getCustomPieces = (pieceStyle, pieceSets) => {
  const set = pieceSets[pieceStyle];
  const pieces = {};
  const pieceNames = ['p', 'r', 'n', 'b', 'q', 'k'];

  pieceNames.forEach(piece => {
    // White pieces
    pieces['w' + piece.toUpperCase()] = ({ squareWidth }) => (
      <img
        src={`${set}/w${piece}.png`}
        alt=""
        style={{ width: squareWidth, height: squareWidth }}
      />
    );
    // Black pieces
    pieces['b' + piece.toUpperCase()] = ({ squareWidth }) => (
      <img
        src={`${set}/b${piece}.png`}
        alt=""
        style={{ width: squareWidth, height: squareWidth }}
      />
    );
  });

  return pieces;
};

const squareToIndex = (square) => {
  const files = 'abcdefgh';
  const rank = 8 - parseInt(square[1], 10);
  const file = files.indexOf(square[0]);
  return rank * 8 + file;
};

const isDraggable = (fen, turn) => ({ piece, sourceSquare }) => {
  const pieceOnSquare = fen.split(' ')[0]
    .split('/')
    .map(row => row.replace(/\d/g, match => ' '.repeat(+match)))
    .join('')
    .split('')[squareToIndex(sourceSquare)];

  if (!pieceOnSquare) return false;
  return (turn === 'w' && pieceOnSquare === pieceOnSquare.toUpperCase()) ||
         (turn === 'b' && pieceOnSquare === pieceOnSquare.toLowerCase());
};

const ChessBoardComponent = ({ fen, onDrop, themeColors, pieceStyle, pieceSets, turn }) => {
  return (
    <div className="chessboard-container d-flex jusify-content-center">
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation="white"
        boardWidth={400}
        isDraggablePiece={isDraggable(fen, turn)}
        customBoardStyle={{
          borderRadius: '10px',
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
        }}
        customDarkSquareStyle={{
          backgroundColor: themeColors.dark,
        }}
        customLightSquareStyle={{
          backgroundColor: themeColors.light,
        }}
        customPieces={getCustomPieces(pieceStyle, pieceSets)}
      />
    </div>
  );
};

export default ChessBoardComponent;
