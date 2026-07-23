import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Exchange } from '../models';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  constructor(private api: ApiService) {}

  getExchanges(status?: string, page?: number): Observable<{exchanges: Exchange[], total: number}> {
    return this.api.get('/exchanges', { status, page: page ?? 1 });
  }

  create(data: { skillId: string; receiverId: string; message: string }): Observable<Exchange> {
    return this.api.post('/exchanges', data);
  }

  getById(id: string): Observable<Exchange> {
    return this.api.get(`/exchanges/${id}`);
  }

  accept(id: string): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/accept`);
  }

  decline(id: string, reason?: string): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/decline`, { reason });
  }

  cancel(id: string, reason?: string): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/cancel`, { reason });
  }

  complete(id: string): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/complete`);
  }
}
