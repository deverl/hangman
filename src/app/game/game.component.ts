import { Component, HostListener, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  private readonly maxWrong = 6;

  word = signal<string>('');
  guessed = signal<Set<string>>(new Set());
  wrongCount = signal(0);
  status = signal<'playing' | 'won' | 'lost'>('playing');

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchWord();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.fetchWord();
      return;
    }
    if (this.status() !== 'playing') return;
    const key = e.key.toLowerCase();
    if (ALPHABET.includes(key)) this.guess(key);
  }

  fetchWord(): void {
    this.word.set('');
    this.guessed.set(new Set());
    this.wrongCount.set(0);
    this.status.set('playing');
    this.http.get<{ word: string }>('/api/word').subscribe({
      next: (res) => this.word.set(res.word.toLowerCase()),
      error: () => this.word.set('angular'),
    });
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
