import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  format: ['cjs'],
  dts: true,
  noExternal: ['@asteasolutions/zod-to-openapi'],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.sql': 'copy',
    };
  },
});
