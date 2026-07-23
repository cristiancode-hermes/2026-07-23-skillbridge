import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiService) {}

  getProfile(id: string | number): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.api.patch<User>('/users/me', data);
  }

  deleteAccount(): Observable<void> {
    return this.api.delete<void>('/users/me');
  }
}
