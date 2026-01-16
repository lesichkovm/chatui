const esbuild = require('esbuild');
const fs = require('fs');

async function build() {
  // 1. Build to src/chat-widget.js so tests and demos (which depend on src) continue to work
  await esbuild.build({
    entryPoints: ['src/entry.js'],
    bundle: true,
    outfile: 'src/chat-widget.js',
    format: 'iife',
    minify: false,
  });

  // 2. Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // 3. Copy the built file to dist/ for the standard distribution
  fs.copyFileSync('src/chat-widget.js', 'dist/chat-widget.js');

  // 4. Build minified version to dist/chat-widget.min.js
  await esbuild.build({
    entryPoints: ['src/entry.js'],
    bundle: true,
    outfile: 'dist/chat-widget.min.js',
    format: 'iife',
    minify: true,
  });
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});