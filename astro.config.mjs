// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',

  integrations: [
      mdx(),
      sitemap(),
      react(),
      AstroPWA({
          registerType: 'autoUpdate',
          manifest: {
              name: 'Anotar',
              short_name: 'Anotar',
              description: 'Tu aplicación de tareas',
              theme_color: '#ffffff',
              background_color: '#ffffff',
              display: 'standalone',
              icons: [
                  {
                      src: '/Anotar.svg',
                      sizes: 'any',
                      type: 'image/svg+xml',
                      purpose: 'any maskable'
                  }
              ]
          },
          workbox: {
              globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,json}'],
              navigateFallback: '/',
          },
          devOptions: {
              enabled: true,
              type: 'module',
          },
      })
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});