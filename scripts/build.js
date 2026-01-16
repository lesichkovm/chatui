const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/entry.js'],
  bundle: true,
  outfile: 'src/chat-widget.js',
  format: 'iife',
  minify: false,
}).catch(() => process.exit(1));
