import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/pizzabase': {
          target: env.VITE_API_URL || 'https://database.pizzaria.foundation/pizzapp-wordsearch-foundation/pizzapp-wordsearch-foundation',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/pizzabase/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_API_TOKEN}`);
            });
          },
        },
      },
    },
  };
});
