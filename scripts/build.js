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

  // 3. Copy the built file to dist/ for the final distribution
  // We can also minify the dist version if desired, but for now we keep them identical
  fs.copyFileSync('src/chat-widget.js', 'dist/chat-widget.js');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
