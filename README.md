# Hangman

A hangman-style word game built with **Node**, **Angular**, and **TypeScript**. Words are loaded from `words.txt`. Wrong guesses build a stick figure on the gallows in 6 steps: head, body, left arm, right arm, left leg, right leg.

## Run the game

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the API and the Angular app together:
   ```bash
   npm run dev
   ```
   This starts the word API on port 3000 and the Angular app on port 4200 with proxy to the API.

   Or run them separately:
   ```bash
   npm run server   # API at http://localhost:3000
   npm start       # Angular at http://localhost:4200 (proxies /api to 3000)
   ```

3. Open **http://localhost:4200** in your browser.

## How to play

- Guess letters by typing on the keyboard (or use the UI when implemented).
- Correct letters fill in the word. Wrong letters are listed with a strikethrough and add a part to the stick figure.
- You have 6 wrong guesses before the figure is complete and the game is over.
- Use **New game** to get a new word from `words.txt`.

## Customize words

Edit `words.txt` in the project root: one word per line. The API serves a random word from this file.

## Tech

- **Frontend**: Angular 19, TypeScript, standalone components
- **Backend**: Node + Express, reads words from `words.txt`
- **Proxy**: `proxy.conf.json` forwards `/api` from the dev server to the Node API
