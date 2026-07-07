import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'rcl_theme';
  private _theme = new BehaviorSubject<Theme>(this.loadTheme());

  theme$ = this._theme.asObservable();

  get current(): Theme { return this._theme.value; }
  get isDark(): boolean { return this._theme.value === 'dark'; }

  constructor() {
    this.apply(this._theme.value);
  }

  toggle(): void {
    this.set(this._theme.value === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this._theme.next(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.apply(theme);
  }

  private apply(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#0d1117' : '#ffffff');
    }
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
