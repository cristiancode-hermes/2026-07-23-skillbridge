/**
 * PostCSS build script for Tailwind v4 pre-compilation.
 * This compiles src/styles.css → dist/styles.css with Tailwind directives.
 * Run: node scripts/build-css.cjs
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'styles.css');
const DIST = path.join(ROOT, 'dist', 'skillbridge', 'browser', 'styles.css');

// Ensure dist dir exists
fs.mkdirSync(path.dirname(DIST), { recursive: true });

console.log('🔨 Building CSS with PostCSS + Tailwind...');

try {
  execSync(
    `npx postcss "${SRC}" --output "${DIST}" --env production`,
    {
      cwd: ROOT,
      stdio: 'inherit',
      timeout: 60000,
    }
  );
  console.log('✅ CSS built successfully →', DIST);
} catch (err) {
  // Fallback: just copy the raw CSS if PostCSS/Tailwind isn't configured yet
  console.warn('⚠️ PostCSS build failed, copying raw CSS as fallback:', err.message);
  fs.copyFileSync(SRC, DIST);
  console.log('✅ Raw CSS copied to', DIST);
}
