import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src'],
  format: ['cjs', 'esm'],
  outDir: 'dist',
  minify: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  loader: {
    '.sql': 'file',
  },
});
