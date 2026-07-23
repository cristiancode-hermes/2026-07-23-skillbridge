import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Message } from '../models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private api: ApiService) {}

  getByExchange(exchangeId: number): Observable<Message[]> {
    return this.api.get<Message[]>(`/exchanges/${exchangeId}/messages`);
  }

  create(exchangeId: number, text: string): Observable<Message> {
    return this.api.post<Message>(`/exchanges/${exchangeId}/messages`, {
      text,
    });
  }
}
