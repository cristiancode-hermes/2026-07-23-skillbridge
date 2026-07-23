import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SkillService } from '../services/skill.service';
import { AuthService } from '../services/auth.service';
import { Skill, SkillCategory } from '../models';
import { SkillBadgeComponent } from '../shared/skill-badge.component';
import { SearchInputComponent } from '../shared/search-input.component';
import { LoadingSkeletonComponent } from '../shared/loading-skeleton.component';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { ErrorAlertComponent } from '../shared/error-alert.component';

@Component({
  selector: 'app-browse-skills',
  standalone: true,
  imports: [
    RouterLink, FormsModule,
    SkillBadgeComponent, SearchInputComponent,
    LoadingSkeletonComponent, EmptyStateComponent, ErrorAlertComponent,
  ],
  template: `
    <div class="page-wide">
      <div class="page-header">
        <div>
          <h1 class="page-title">Browse Skills</h1>
          <p class="page-subtitle">Discover skills to learn or teach — connect and exchange knowledge.</p>
        </div>
      </div>

      <div class="search-bar">
        <app-search-input
          placeholder="Search skills..."
          (search)="onSearch($event)"
        />
      </div>

      @if (categoriesLoading()) {
        <div class="categories-skeleton">
          @for (_ of [1,2,3,4,5,6]; track $index) {
            <div class="cat-skeleton-pill"></div>
          }
        </div>
      } @else {
        <div class="categories-row">
          <button
            class="category-pill"
            [class.category-active]="!activeCategory()"
            (click)="selectCategory('')"
          >All</button>
          @for (cat of categories(); track cat.id) {
            <button
              class="category-pill"
              [class.category-active]="activeCategory() === cat.slug"
              (click)="selectCategory(cat.slug)"
            >
              @if (cat.emoji) { <span class="cat-icon">{{ cat.emoji }}</span> }
              {{ cat.name }}
            </button>
          }
        </div>
      }

      <div class="section-header">
        <h2 class="section-title">
          @if (activeCategory()) {
            {{ getActiveCategoryName() }}
          } @else {
            All Skills
          }
          @if (searchQuery()) {
            <span class="search-tag">"{{ searchQuery() }}"</span>
          }
        </h2>
        <span class="result-count">{{ totalSkills() }} skill{{ totalSkills() !== 1 ? 's' : '' }}</span>
      </div>

      @if (loading()) {
        <div class="grid grid-3">
          @for (_ of [1,2,3,4,5,6]; track $index) {
            <app-loading-skeleton type="card" />
          }
        </div>
      } @else if (error()) {
        <app-error-alert [message]="error()" (retry)="loadSkills()" />
      } @else if (skills().length === 0) {
        <app-empty-state
          icon="🔍"
          title="No skills found"
          [message]="'Try a different search or category.'"
        />
      } @else {
        <div class="skills-grid">
          @for (skill of skills(); track skill.id) {
            <div class="card skill-card">
              <div class="skill-card-header">
                <span class="skill-card-emoji">{{ skill.emoji || '📚' }}</span>
                <h3 class="skill-card-name">{{ skill.name }}</h3>
              </div>
              @if (skill.description) {
                <p class="skill-card-desc">{{ skill.description }}</p>
              }
              @if (skill.category) {
                <span class="skill-card-category">{{ skill.category.name }}</span>
              }
              <div class="skill-card-actions">
                <a [routerLink]="['/exchanges/new', skill.id, 0]" class="btn btn-primary btn-sm btn-full">
                  Request Exchange
                </a>
              </div>
            </div>
          }
        </div>
        @if (totalPages() > 1) {
          <div class="pagination">
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() <= 1" (click)="changePage(currentPage() - 1)">← Previous</button>
            <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() >= totalPages()" (click)="changePage(currentPage() + 1)">Next →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .page-wide { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--color-ink); }
    .page-subtitle { font-size: 0.9375rem; color: var(--color-muted); margin: 0; }
    .search-bar { margin-bottom: 1.25rem; max-width: 400px; }
    .categories-skeleton { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .cat-skeleton-pill { width: 80px; height: 34px; background: var(--color-surface-hover); border-radius: 999px; animation: pulse 1.5s ease-in-out infinite; }
    .categories-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .category-pill {
      display: inline-flex; align-items: center; gap: 0.375rem;
      padding: 0.375rem 0.875rem; border-radius: 999px; border: 1px solid var(--color-border);
      background: var(--color-surface); color: var(--color-muted); font-size: 0.8125rem;
      cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .category-pill:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .category-active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
    .cat-icon { font-size: 1rem; line-height: 1; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .section-title { font-size: 1.125rem; font-weight: 700; margin: 0; color: var(--color-ink); display: flex; align-items: center; gap: 0.5rem; }
    .search-tag { font-size: 0.8125rem; font-weight: 400; color: var(--color-muted); }
    .result-count { font-size: 0.8125rem; color: var(--color-muted); }
    .grid { display: grid; gap: 1rem; }
    .grid-3 { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .skill-card { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.25rem; }
    .skill-card-header { display: flex; align-items: center; gap: 0.75rem; }
    .skill-card-emoji { font-size: 1.75rem; line-height: 1; }
    .skill-card-name { margin: 0; font-size: 1.0625rem; font-weight: 600; color: var(--color-ink); }
    .skill-card-desc { margin: 0; font-size: 0.8125rem; color: var(--color-muted); line-height: 1.5; flex: 1; }
    .skill-card-category { font-size: 0.75rem; color: var(--color-primary); font-weight: 500; }
    .skill-card-actions { margin-top: auto; }
    .btn-full { width: 100%; }
    .pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 2rem; }
    .page-info { font-size: 0.8125rem; color: var(--color-muted); }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  `],
})
export class BrowseSkillsComponent {
  private readonly skillService = inject(SkillService);
  private readonly authService = inject(AuthService);

  protected readonly skills = signal<Skill[]>([]);
  protected readonly categories = signal<SkillCategory[]>([]);
  protected readonly loading = signal(true);
  protected readonly categoriesLoading = signal(true);
  protected readonly error = signal('');
  protected readonly activeCategory = signal('');
  protected readonly searchQuery = signal('');
  protected readonly currentPage = signal(1);
  protected readonly totalPages = signal(1);
  protected readonly totalSkills = signal(0);

  constructor() {
    this.loadCategories();
    this.loadSkills();
  }

  protected getActiveCategoryName(): string {
    const cat = this.categories().find(c => c.slug === this.activeCategory());
    return cat?.name ?? 'Skills';
  }

  protected selectCategory(slug: string): void {
    this.activeCategory.set(slug);
    this.currentPage.set(1);
    this.loadSkills();
  }

  protected onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.loadSkills();
  }

  protected changePage(page: number): void {
    this.currentPage.set(page);
    this.loadSkills();
  }

  protected loadCategories(): void {
    this.categoriesLoading.set(true);
    this.skillService.getCategories().subscribe({
      next: (cats) => { this.categories.set(cats); this.categoriesLoading.set(false); },
      error: () => this.categoriesLoading.set(false),
    });
  }

  protected loadSkills(): void {
    this.loading.set(true);
    this.error.set('');
    this.skillService.getAll(
      this.activeCategory() || undefined,
      this.searchQuery() || undefined,
      'name',
      this.currentPage(),
    ).subscribe({
      next: (res) => {
        this.skills.set(res.skills);
        this.totalPages.set(res.total_pages);
        this.currentPage.set(res.page);
        this.totalSkills.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load skills');
        this.loading.set(false);
      },
    });
  }
}
