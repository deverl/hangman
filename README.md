# Hangman

A hangman-style word game built with **Angular** and **TypeScript**. You load a word list from a file; the app shuffles it and steps through one word at a time. Wrong guesses build a stick figure on the gallows in 6 steps: head, body, left arm, right arm, left leg, right leg.

## Run the game

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npm start
   ```

3. Open **http://localhost:4200**, then use **Load word list** to choose a text file with one word per line (e.g. the included `words.txt`).

## How to play

- Load a word list file (one word per line). The first game starts automatically.
- Guess letters by typing on the keyboard. Correct letters fill in the word; wrong letters are listed with a strikethrough and add a part to the stick figure.
- You have 6 wrong guesses before the figure is complete and the game is over.
- **New game** or **Enter** gives you the next word from the list. After every word is used once, the list is reshuffled and you go through it again.

## Word list format

Use a plain text file with one word per line. Empty lines are ignored; words are treated as lowercase.

## Tech

- **Frontend**: Angular 19, TypeScript, standalone components. No backend; words are read from a file you select in the browser.
