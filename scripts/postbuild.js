/**
 * Post-build script to prepare Chrome extension
 * Copies static files and updates paths for extension
 */

import { copyFileSync, mkdirSync, existsSync, cpSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, 'dist');

// Ensure dist directories exist
const dirs = [
  'dist',
  'dist/src/popup',
  'dist/src/content',
  'dist/src/background',
  'dist/assets/styles',
  'dist/assets/icons'
];

dirs.forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Copy static files that Vite doesn't handle
const filesToCopy = [
  // Manifest
  ['manifest.json', 'dist/manifest.json'],
  
  // Popup (not bundled)
  ['src/popup/popup.html', 'dist/src/popup/popup.html'],
  ['src/popup/popup.js', 'dist/src/popup/popup.js'],
  
  // Background service worker (not bundled)
  ['src/background/background.js', 'dist/src/background/background.js'],
  
  // Content script (not bundled)
  ['src/content/content.js', 'dist/src/content/content.js'],
  
  // Styles
  ['assets/styles/output.css', 'dist/assets/styles/output.css'],
  ['assets/styles/tailwind.css', 'dist/assets/styles/tailwind.css'],
];

filesToCopy.forEach(([src, dest]) => {
  try {
    if (existsSync(src)) {
      copyFileSync(src, dest);
      console.log(`✓ Copied ${src} → ${dest}`);
    } else {
      console.warn(`⚠ Source not found: ${src}`);
    }
  } catch (e) {
    console.error(`✗ Failed to copy ${src}:`, e.message);
  }
});

// Copy icons folder
if (existsSync('assets/icons')) {
  cpSync('assets/icons', 'dist/assets/icons', { recursive: true });
  console.log('✓ Copied assets/icons/');
}

// Update manifest paths for dist structure
const manifestPath = 'dist/manifest.json';
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  
  // Update popup path to point to Vite output
  if (manifest.action?.default_popup) {
    manifest.action.default_popup = 'src/popup/popup.html';
  }
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('✓ Updated manifest.json paths');
}

// Copy wrapped.css
if (existsSync('assets/styles/wrapped.css')) {
  copyFileSync('assets/styles/wrapped.css', 'dist/assets/styles/wrapped.css');
  console.log('✓ Copied wrapped.css');
}

console.log('\n🎉 Extension build complete! Load dist/ folder in Chrome.\n');
