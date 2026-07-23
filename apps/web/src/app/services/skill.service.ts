import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Skill, SkillCategory } from '../models';

@Injectable({ providedIn: 'root' })
export class SkillService {
  constructor(private api: ApiService) {}

  getAll(category?: string, search?: string, sort?: string, page?: number): Observable<{skills: Skill[], total: number, page: number}> {
    return this.api.get('/skills', { category, search, sort, page: page ?? 1 });
  }

  getCategories(): Observable<SkillCategory[]> {
    return this.api.get('/skills/categories');
  }

  search(query: string): Observable<{skills: Skill[], users: any[]}> {
    return this.api.get('/skills/search', { q: query });
  }

  getById(id: string): Observable<Skill> {
    return this.api.get(`/skills/${id}`);
  }
}
