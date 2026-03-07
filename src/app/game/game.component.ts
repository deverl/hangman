import { Component, HostListener, signal, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

function seededRandom(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    const t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    return ((t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rng = seededRandom(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  private readonly maxWrong = 6;

  private words: string[] = [];
  private nextIndex = 0;

  word = signal<string>('');
  guessed = signal<Set<string>>(new Set());
  wrongCount = signal(0);
  status = signal<'playing' | 'won' | 'lost'>('playing');

  hasWords = signal(false);

  displayWord = computed(() => {
    const w = this.word();
    const g = this.guessed();
    if (!w) return [];
    return w.split('').map((letter) => ({
      letter,
      visible: g.has(letter),
    }));
  });

  wrongGuesses = computed(() => {
    const w = this.word();
    const g = this.guessed();
    if (!w) return [];
    return [...g].filter((letter) => !w.includes(letter)).sort();
  });

  correctGuesses = computed(() => {
    const w = this.word();
    const g = this.guessed();
    if (!w) return [];
    return [...g].filter((letter) => w.includes(letter)).sort();
  });

  phasesVisible = computed(() => this.wrongCount());

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.startNewGame();
      return;
    }
    if (this.status() !== 'playing') return;
    const key = e.key.toLowerCase();
    if (ALPHABET.includes(key)) this.guess(key);
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = (reader.result as string) ?? '';
      const raw = text.split(/\r?\n/).map((w) => w.trim().toLowerCase()).filter((w) => w.length > 0);
      if (raw.length === 0) {
        this.hasWords.set(false);
        this.word.set('');
        return;
      }
      this.words = shuffleWithSeed(raw, Date.now());
      this.nextIndex = 0;
      this.hasWords.set(true);
      this.startNewGame();
    };
    reader.readAsText(file);
    input.value = '';
  }

  startNewGame(): void {
    if (!this.hasWords() || this.words.length === 0) return;

    if (this.nextIndex >= this.words.length) {
      this.words = shuffleWithSeed(this.words, Date.now());
      this.nextIndex = 0;
    }
    const nextWord = this.words[this.nextIndex];
    this.nextIndex += 1;

    this.word.set(nextWord);
    this.guessed.set(new Set());
    this.wrongCount.set(0);
    this.status.set('playing');
  }

  guess(letter: string): void {
    const l = letter.toLowerCase();
    if (!ALPHABET.includes(l)) return;
    const w = this.word();
    if (!w || this.status() !== 'playing') return;

    const next = new Set(this.guessed());
    if (next.has(l)) return;
    next.add(l);
    this.guessed.set(next);

    if (w.includes(l)) {
      const revealed = w.split('').filter((c) => next.has(c)).length;
      if (revealed === w.length) this.status.set('won');
    } else {
      const wrong = this.wrongCount() + 1;
      this.wrongCount.set(wrong);
      if (wrong >= this.maxWrong) this.status.set('lost');
    }
  }
}
