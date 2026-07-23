import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserSkill } from '../models';

@Injectable({ providedIn: 'root' })
export class UserSkillService {
  constructor(private api: ApiService) {}

  getMySkills(): Observable<{offered: UserSkill[], wanted: UserSkill[]}> {
    return this.api.get('/users/me/skills');
  }

  addSkill(skillId: string | number, type: 'offering' | 'seeking'): Observable<UserSkill> {
    return this.api.post('/users/me/skills', { skillId, type });
  }

  removeSkill(id: string | number): Observable<void> {
    return this.api.delete(`/users/me/skills/${id}`);
  }

  getUserSkills(userId: string | number): Observable<UserSkill[]> {
    return this.api.get(`/users/${userId}/skills`);
  }
}
