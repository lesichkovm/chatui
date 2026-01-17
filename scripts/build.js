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

  // 2. Ensure dist and netlify/dist directories exist
  ['dist', 'netlify/dist'].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // 3. Build unminified versions
  const unminifiedTargets = ['dist/chat-widget.js', 'netlify/dist/chat-widget.js'];
  for (const outfile of unminifiedTargets) {
    await esbuild.build({
      entryPoints: ['src/entry.js'],
      bundle: true,
      outfile: outfile,
      format: 'iife',
      minify: false,
    });
  }

  // 4. Build minified versions
  const minifiedTargets = ['dist/chat-widget.min.js', 'netlify/dist/chat-widget.min.js'];
  for (const outfile of minifiedTargets) {
    await esbuild.build({
      entryPoints: ['src/entry.js'],
      bundle: true,
      outfile: outfile,
      format: 'iife',
      minify: true,
    });
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});