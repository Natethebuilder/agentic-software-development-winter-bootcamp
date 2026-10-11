import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { deckPlugin } from '@deckio/deck-engine/vite'

export default defineConfig({
  base: '/',
  plugins: [
    react({
      include: [/\.[jt]sx?$/, /node_modules\/@deckio\/deck-engine\/.+\.jsx$/],
    }),
    deckPlugin({ inlineEditing: false }),
  ],
  server: {
    fs: {
      allow: ['..', '../..'],
    },
  },
})
