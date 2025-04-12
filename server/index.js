const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const { getBoardState, makeMove, resetGame } = require('./chessEngine');

app.use(cors());
app.use(express.json());

app.get('/api/board', (req, res) => {
  try {
    const boardState = getBoardState();
    res.json(boardState);
  } catch (error) {
    console.error("Error getting board state:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/move', (req, res) => {
  try {
    const { from, to } = req.body;
    const result = makeMove(from, to);
    if (result) {
      res.json(result);
    } else {
      res.status(400).json({ error: 'Invalid move' });
    }
  } catch (error) {
    console.error("Error making move:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reset', (req, res) => {
  try {
    const boardState = resetGame();
    res.json(boardState);
  } catch (error) {
    console.error("Error resetting game:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});