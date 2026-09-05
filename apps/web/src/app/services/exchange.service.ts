import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Exchange, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  constructor(private api: ApiService) {}

  getExchanges(status?: string, page?: number): Observable<PaginatedResponse<Exchange>> {
    return this.api.get('/exchanges', { status, page: page ?? 1 });
  }

  create(data: { skillId: string | number; receiverId: string | number; message: string }): Observable<Exchange> {
    return this.api.post('/exchanges', data);
  }

  getById(id: string | number): Observable<Exchange> {
    return this.api.get(`/exchanges/${id}`);
  }

  accept(id: string | number): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/accept`);
  }

  decline(id: string | number, reason?: string): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/decline`, { reason });
  }

  cancel(id: string | number, reason?: string): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/cancel`, { reason });
  }

  complete(id: string | number): Observable<Exchange> {
    return this.api.patch(`/exchanges/${id}/complete`);
  }
}
