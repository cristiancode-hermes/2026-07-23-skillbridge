import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PublicStats } from '../models';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private api: ApiService) {}

  getPublicStats(): Observable<PublicStats> {
    return this.api.get<PublicStats>('/stats');
  }
}
