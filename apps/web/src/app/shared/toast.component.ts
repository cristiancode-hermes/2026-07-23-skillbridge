import { Injectable, Component, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly messages = signal<ToastMessage[]>([]);

  success(msg: string): void {
    this.add(msg, 'success');
  }

  error(msg: string): void {
    this.add(msg, 'error');
  }

  info(msg: string): void {
    this.add(msg, 'info');
  }

  dismiss(id: number): void {
    this.messages.update((msgs) => msgs.filter((m) => m.id !== id));
  }

  private add(text: string, type: ToastMessage['type']): void {
    const id = this.nextId++;
    const msg: ToastMessage = { id, text, type };
    this.messages.update((msgs) => [...msgs, msg]);
    setTimeout(() => this.dismiss(id), 3000);
  }
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-container">
      @for (msg of toastService.messages(); track msg.id) {
        <div class="toast toast-{{ msg.type }}" (click)="toastService.dismiss(msg.id)">
          <span class="toast-icon">
            @switch (msg.type) {
              @case ('success') { ✓ }
              @case ('error')   { ✕ }
              @case ('info')    { ℹ }
            }
          </span>
          <span class="toast-text">{{ msg.text }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 2000;
        max-width: 360px;
      }
      .toast {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        animation: slideIn 0.2s ease-out;
      }
      .toast-success { background: var(--color-success); color: #fff; }
      .toast-error   { background: var(--color-danger); color: #fff; }
      .toast-info    { background: var(--color-primary); color: #fff; }
      .toast-icon { font-weight: 700; font-size: 1rem; line-height: 1; flex-shrink: 0; }
      .toast-text { flex: 1; }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
    `,
  ],
})
export class ToastContainerComponent {
  constructor(protected readonly toastService: ToastService) {}
}
