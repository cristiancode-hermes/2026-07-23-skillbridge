import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Session } from '../models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  constructor(private api: ApiService) {}

  getByExchange(exchangeId: string | number): Observable<Session[]> {
    return this.api.get(`/exchanges/${exchangeId}/sessions`);
  }

  create(exchangeId: string | number, data: { date: string; startTime: string; duration: number; location?: string }): Observable<Session> {
    return this.api.post(`/exchanges/${exchangeId}/sessions`, data);
  }

  confirm(id: string | number): Observable<Session> {
    return this.api.patch(`/sessions/${id}/confirm`);
  }

  update(id: string | number, data: Partial<Session>): Observable<Session> {
    return this.api.patch(`/sessions/${id}`, data);
  }

  complete(id: string | number): Observable<Session> {
    return this.api.patch(`/sessions/${id}/complete`);
  }

  remove(id: string | number): Observable<void> {
    return this.api.delete(`/sessions/${id}`);
  }
}
