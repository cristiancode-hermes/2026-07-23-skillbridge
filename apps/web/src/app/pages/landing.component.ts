import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsService } from '../services/stats.service';
import { PublicStats } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="landing">
      <section class="hero">
        <div class="hero-content">
          <span class="hero-badge">🔄 Skill Exchange Platform</span>
          <h1 class="hero-title">SkillBridge</h1>
          <p class="hero-subtitle">
            Connect with people who want to learn what you know — <br />
            and teach what you don't.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn btn-primary btn-lg">Get Started Free</a>
            <a routerLink="/login" class="btn btn-outline btn-lg">Sign In</a>
          </div>
        </div>
      </section>

      @if (stats(); as s) {
        <section class="stats-bar">
          <div class="stat-item">
            <span class="stat-value">{{ s.total_users }}</span>
            <span class="stat-label">Users</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ s.total_skills }}</span>
            <span class="stat-label">Skills</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ s.exchanges }}</span>
            <span class="stat-label">Exchanges</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ s.total_reviews }}</span>
            <span class="stat-label">Reviews</span>
          </div>
        </section>
      }

      <section class="how-it-works">
        <h2 class="section-title">How It Works</h2>
        <div class="steps">
          <div class="step-card">
            <span class="step-number">1</span>
            <h3>Create Your Profile</h3>
            <p>Sign up and tell the community what skills you offer and what you want to learn.</p>
          </div>
          <div class="step-connector">→</div>
          <div class="step-card">
            <span class="step-number">2</span>
            <h3>Find Your Match</h3>
            <p>Browse skills and connect with people who have what you need — and need what you have.</p>
          </div>
          <div class="step-connector">→</div>
          <div class="step-card">
            <span class="step-number">3</span>
            <h3>Exchange Knowledge</h3>
            <p>Schedule sessions, share what you know, and learn something new in return.</p>
          </div>
        </div>
      </section>

      <section class="features">
        <h2 class="section-title">Why SkillBridge?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🎓</span>
            <h3>Teach</h3>
            <p>Share your expertise and help others grow. Teaching reinforces your own knowledge.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🧠</span>
            <h3>Learn</h3>
            <p>Discover new skills from real people who've been there. No courses, just conversation.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🤝</span>
            <h3>Exchange</h3>
            <p>Trade knowledge in one-on-one skill swaps. Everyone has something to teach.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🌍</span>
            <h3>Community</h3>
            <p>Join a growing community of learners and teachers from around the world.</p>
          </div>
        </div>
      </section>

      <section class="cta">
        <h2>Ready to start sharing skills?</h2>
        <p>Join SkillBridge today and turn what you know into what you can learn.</p>
        <a routerLink="/register" class="btn btn-primary btn-lg">Get Started Free</a>
      </section>
    </div>
  `,
  styles: [`
    .landing { display: flex; flex-direction: column; gap: 4rem; padding: 2rem 0 4rem; }
    .hero { text-align: center; padding: 3rem 1rem; }
    .hero-content { max-width: 680px; margin: 0 auto; }
    .hero-badge { display: inline-block; padding: 0.25rem 0.875rem; background: var(--color-primary-light); color: var(--color-primary); border-radius: 999px; font-size: 0.8125rem; font-weight: 600; margin-bottom: 1.25rem; }
    .hero-title { font-size: 3.5rem; font-weight: 800; color: var(--color-primary); margin: 0; letter-spacing: -0.03em; }
    .hero-subtitle { font-size: 1.125rem; color: var(--color-muted); margin: 1rem 0 2rem; line-height: 1.6; }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .stats-bar { display: flex; align-items: center; justify-content: center; gap: 2rem; padding: 1.5rem; background: var(--color-surface); border-radius: 16px; max-width: 700px; margin: 0 auto; flex-wrap: wrap; }
    .stat-item { text-align: center; }
    .stat-value { display: block; font-size: 1.75rem; font-weight: 800; color: var(--color-primary); line-height: 1; }
    .stat-label { font-size: 0.8125rem; color: var(--color-muted); margin-top: 0.25rem; }
    .stat-divider { width: 1px; height: 40px; background: var(--color-border); }
    .how-it-works { max-width: 900px; margin: 0 auto; text-align: center; }
    .section-title { text-align: center; font-size: 1.75rem; font-weight: 700; margin: 0 0 2rem; color: var(--color-ink); }
    .steps { display: flex; align-items: flex-start; justify-content: center; gap: 1rem; flex-wrap: wrap; }
    .step-card { flex: 1; min-width: 200px; max-width: 280px; padding: 1.5rem; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border); text-align: center; }
    .step-number { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: var(--color-primary); color: #fff; font-weight: 700; font-size: 1rem; margin-bottom: 0.75rem; }
    .step-card h3 { margin: 0 0 0.5rem; font-size: 1.0625rem; font-weight: 700; color: var(--color-ink); }
    .step-card p { margin: 0; font-size: 0.875rem; color: var(--color-muted); line-height: 1.5; }
    .step-connector { font-size: 1.5rem; color: var(--color-border); padding-top: 2.5rem; }
    .features { max-width: 900px; margin: 0 auto; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; }
    .feature-card { text-align: center; padding: 2rem 1.25rem; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border); transition: box-shadow 0.2s; }
    .feature-card:hover { box-shadow: var(--shadow-md); }
    .feature-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
    .feature-card h3 { margin: 0 0 0.5rem; font-size: 1.125rem; font-weight: 700; color: var(--color-ink); }
    .feature-card p { margin: 0; font-size: 0.875rem; color: var(--color-muted); line-height: 1.5; }
    .cta { text-align: center; padding: 3rem 1rem; background: var(--color-surface); border-radius: 16px; max-width: 600px; margin: 0 auto; }
    .cta h2 { margin: 0 0 0.5rem; font-size: 1.5rem; font-weight: 700; color: var(--color-ink); }
    .cta p { margin: 0 0 1.5rem; font-size: 0.9375rem; color: var(--color-muted); }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.5rem; }
      .stats-bar { gap: 1rem; }
      .stat-divider { display: none; }
      .step-connector { display: none; }
      .steps { flex-direction: column; align-items: center; }
      .step-card { max-width: 100%; }
    }
  `],
})
export class LandingComponent {
  private readonly statsService = inject(StatsService);
  protected readonly stats = signal<PublicStats | null>(null);

  constructor() {
    this.statsService.getPublicStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => {},
    });
  }
}
