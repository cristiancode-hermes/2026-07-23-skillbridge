import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'skillbridge_theme';

  readonly darkMode = signal<boolean>(this.loadPreference());

  constructor() {
    this.applyTheme(this.darkMode());
  }

  toggle(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    this.savePreference(next);
    this.applyTheme(next);
  }

  private loadPreference(): boolean {
    const stored = localStorage.getItem(this.storageKey);
    if (stored !== null) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private savePreference(dark: boolean): void {
    localStorage.setItem(this.storageKey, dark ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean): void {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
