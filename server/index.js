const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const WORDS_PATH = path.join(__dirname, '..', 'words.txt');

function seededRandom(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    const t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    return ((t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ 0) / 4294967296;
  };
}

function shuffleWithSeed(arr, seed) {
  const rng = seededRandom(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function loadWords() {
  const content = fs.readFileSync(WORDS_PATH, 'utf-8');
  return content
    .split(/\r?\n/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0);
}

let words = loadWords();
words = shuffleWithSeed(words, Date.now());
let nextIndex = 0;

app.get('/api/word', (req, res) => {
  try {
    if (nextIndex >= words.length) {
      words = shuffleWithSeed([...words], Date.now());
      nextIndex = 0;
    }
    const word = words[nextIndex];
    nextIndex += 1;
    res.json({ word });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read words file' });
  }
});

app.listen(PORT, () => {
  console.log(`Hangman API at http://localhost:${PORT}`);
});
