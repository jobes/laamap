import angular from '@analogjs/vite-plugin-angular';
// import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
// import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: './node_modules/.vite/mapview',
  plugins: [
    angular() /*, nxViteTsPaths() as any, nxCopyAssetsPlugin(['*.md'])*/,
  ],
  test: {
    name: 'mapview',
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    // coverage: {
    //   provider: 'v8' as const,
    //   reportsDirectory: '../../coverage/mapview',
    //   include: ['src/**/*.{ts,tsx}'],
    // },
  },
}));
