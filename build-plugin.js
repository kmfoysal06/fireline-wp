/**
 * Build script for FireLine SPA WordPress Plugin
 * 
 * This script bundles the plugin assets including:
 * - FireLine library
 * - Alpine.js
 * - NProgress
 * - Custom plugin initialization code
 */
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'fireline-spa', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Build the main plugin JavaScript bundle
esbuild.buildSync({
    entryPoints: ['plugin-src/main.js'],
    outfile: 'fireline-spa/assets/fireline-spa.min.js',
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2017',
    platform: 'browser',
});

console.log('✓ Plugin JavaScript bundle created');

// Copy NProgress CSS
const nprogressCss = fs.readFileSync(
    path.join(__dirname, 'node_modules', 'nprogress', 'nprogress.css'),
    'utf8'
);

fs.writeFileSync(
    path.join(assetsDir, 'nprogress.css'),
    nprogressCss
);

console.log('✓ NProgress CSS copied');
console.log('✓ Build complete!');
