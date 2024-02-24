import solidLabels from 'unplugin-solid-labels';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin(), solidLabels.vite({})],
  define: {
    'process.env': '{}',
  },
});
