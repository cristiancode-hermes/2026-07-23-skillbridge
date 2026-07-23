import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AvailabilitySlot } from '../models';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  constructor(private api: ApiService) {}

  getMySlots(): Observable<AvailabilitySlot[]> {
    return this.api.get<AvailabilitySlot[]>('/users/me/availability');
  }

  updateSlots(slots: Partial<AvailabilitySlot>[]): Observable<AvailabilitySlot[]> {
    return this.api.patch<AvailabilitySlot[]>(
      '/users/me/availability',
      slots
    );
  }

  getUserSlots(userId: number): Observable<AvailabilitySlot[]> {
    return this.api.get<AvailabilitySlot[]>(`/users/${userId}/availability`);
  }
}
