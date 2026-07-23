import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Review } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private api: ApiService) {}

  getUserReviews(userId: number): Observable<Review[]> {
    return this.api.get<Review[]>(`/users/${userId}/reviews`);
  }

  create(
    exchangeId: number,
    data: { rating: number; comment?: string; reviewee_id: number }
  ): Observable<Review> {
    return this.api.post<Review>(`/exchanges/${exchangeId}/review`, data);
  }
}
