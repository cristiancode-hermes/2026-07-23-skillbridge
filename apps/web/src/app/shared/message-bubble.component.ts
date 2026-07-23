import { Component, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message } from '../models';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="message-row" [class.is-sender]="isSender()">
      <div class="bubble" [class.bubble-sender]="isSender()" [class.bubble-receiver]="!isSender()">
        <p class="bubble-text">{{ message().text }}</p>
        <span class="bubble-time">{{ message().createdAt | date:'shortTime' }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .message-row { display: flex; margin-bottom: 0.5rem; }
      .is-sender { justify-content: flex-end; }
      .bubble {
        max-width: 75%;
        padding: 0.625rem 0.875rem;
        border-radius: 16px;
        font-size: 0.875rem;
        line-height: 1.4;
        position: relative;
      }
      .bubble-sender {
        background: var(--color-primary);
        color: #fff;
        border-bottom-right-radius: 4px;
      }
      .bubble-receiver {
        background: var(--color-surface);
        color: var(--color-ink);
        border-bottom-left-radius: 4px;
      }
      .bubble-text { margin: 0; }
      .bubble-time {
        display: block;
        font-size: 0.6875rem;
        opacity: 0.7;
        margin-top: 0.25rem;
        text-align: right;
      }
    `,
  ],
})
export class MessageBubbleComponent {
  readonly message = input.required<Message>();
  readonly isSender = input(false);
}
