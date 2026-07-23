import { Component, input, signal, inject, computed, effect, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { Message } from '../models';
import { MessageBubbleComponent } from './message-bubble.component';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [FormsModule, MessageBubbleComponent],
  template: `
    <div class="thread-container">
      <div class="messages-list" #messageList>
        @for (msg of messages(); track msg.id) {
          <app-message-bubble
            [message]="msg"
            [isSender]="msg.senderId === currentUserId()"
          />
        } @empty {
          <div class="thread-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        }
      </div>

      <div class="thread-input">
        <input
          type="text"
          [(ngModel)]="newMessage"
          placeholder="Type a message..."
          class="input"
          (keydown.enter)="send()"
        />
        <button
          class="btn btn-primary btn-sm"
          [disabled]="!newMessage.trim()"
          (click)="send()"
        >
          Send
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .thread-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 300px;
      }
      .messages-list {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
      }
      .thread-empty {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-muted);
        font-size: 0.875rem;
      }
      .thread-input {
        display: flex;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--color-border);
        background: var(--color-bg);
      }
      .thread-input .input {
        flex: 1;
      }
    `,
  ],
})
export class MessageThreadComponent {
  readonly exchangeId = input.required<number>();

  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly messages = signal<Message[]>([]);
  protected newMessage = '';
  protected readonly currentUserId = computed(() => this.authService.currentUser()?.id ?? 0);

  constructor() {
    effect(() => {
      const id = this.exchangeId();
      if (id) {
        this.loadMessages(id);
      }
    });
  }

  private loadMessages(exchangeId: number): void {
    this.messageService.getByExchange(exchangeId).subscribe({
      next: (msgs) => this.messages.set(msgs),
      error: () => this.messages.set([]),
    });
  }

  protected send(): void {
    const text = this.newMessage.trim();
    if (!text) return;

    this.messageService.create(this.exchangeId(), text).subscribe({
      next: (msg) => {
        this.messages.update((msgs) => [...msgs, msg]);
        this.newMessage = '';
      },
    });
  }
}
