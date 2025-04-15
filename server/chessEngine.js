const { Chess } = require('chess.js');
const game = new Chess();

const captured = {
  w: [],
  b: [],
};

function getBoardState() {
  return {
    fen: game.fen(),
    turn: game.turn(),
    gameOver: game.isGameOver(),
    checkmate: game.isCheckmate(),
    winner: game.isCheckmate() ? (game.turn() === 'w' ? 'Black' : 'White') : null,
    captured,
  };
}

function getLegalMoves(from) {
  const moves = game.moves({ square: from, verbose: true });
  return moves.map((move) => move.to);
}

function makeMove(from, to) {
  const move = game.move({ from, to, promotion: 'q' });
  if (move && move.captured) {
    captured[move.color === 'w' ? 'b' : 'w'].push(move.captured);
  }
  return move ? getBoardState() : null;
}

function resetGame() {
  game.reset();
  captured.w = [];
  captured.b = [];
  return getBoardState();
}

module.exports = { getBoardState, makeMove, resetGame, getLegalMoves };
