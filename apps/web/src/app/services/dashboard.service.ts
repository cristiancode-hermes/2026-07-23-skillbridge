import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardStats, Exchange } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getStats(): Observable<DashboardStats> {
    return this.api.get('/dashboard/stats');
  }

  getExchanges(status?: string): Observable<{exchanges: Exchange[], total: number, page: number, total_pages: number}> {
    return this.api.get('/dashboard/exchanges', { status });
  }
}
