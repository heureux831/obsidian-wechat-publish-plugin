import esbuild from 'esbuild';
import process from 'process';

const prod = process.argv[2] === 'production';

const ctx = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian', 'electron'],
  format: 'cjs',
  target: 'es2020',
  platform: 'node',
  outfile: 'main.js',
  loader: {
    '.css': 'text',   // CSS files imported as raw strings
  },
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
});

if (prod) {
  await ctx.rebuild();
  await ctx.dispose();
} else {
  await ctx.watch();
  console.log('👀 watching for changes...');
}
