import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { deckPlugin, tailwindPlugin } from '@deckio/deck-engine/vite'
import { registrationFormBuildError } from './src/registration/microsoftForm.js'

// deck-engine's global.css loads Inter from Google Fonts, which would send every visitor's IP
// address and user agent to Google. The site serves the same Inter files itself (@fontsource/inter,
// imported in src/index.css), so this drops that one remote @import, and the build fails if any
// built file still refers to Google Fonts.
const GOOGLE_FONTS_INTER_IMPORT =
  /@import\s+(?:url\(\s*)?(["']?)https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[:&][^"')]*\1\s*\)?[^;]*;/g
const GOOGLE_FONTS_HOST = /fonts\.(?:googleapis|gstatic)\.com/
const TEXT_OUTPUT = new Set(['.html', '.css', '.js', '.mjs', '.cjs', '.json', '.map', '.svg', '.txt', '.xml', '.webmanifest'])

function filesUnder(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [path]
  })
}

function selfHostedFonts() {
  let outDir
  return [
    {
      name: 'self-hosted-fonts',
      transform(code, id) {
        if (!/\.css(?:$|\?)/.test(id) || !code.includes('fonts.googleapis.com')) return null
        return { code: code.replace(GOOGLE_FONTS_INTER_IMPORT, ''), map: null }
      },
    },
    {
      name: 'self-hosted-fonts:check',
      apply: 'build',
      configResolved(config) {
        outDir = resolve(config.root, config.build.outDir)
      },
      closeBundle() {
        // This also runs after a failed build, which may have written nothing to check.
        if (!existsSync(outDir)) return
        const offenders = filesUnder(outDir)
          .filter((file) => TEXT_OUTPUT.has(extname(file)) && GOOGLE_FONTS_HOST.test(readFileSync(file, 'utf8')))
          .map((file) => relative(outDir, file))
        if (offenders.length) {
          this.error(`Google Fonts is referenced in the build output (${offenders.join(', ')}). Serve fonts from the site instead.`)
        }
      },
    },
  ]
}

// Registration state 4 sends registrants to this bootcamp's Microsoft Form. Without a valid form link
// the site would show registration as closed, so the build fails and a broken form never deploys.
// The dev server only warns.
function requireRegistrationFormUrl() {
  let config
  return {
    name: 'require-registration-form-url',
    configResolved(resolved) {
      config = resolved
    },
    buildStart() {
      const siteState = JSON.parse(readFileSync(join(config.root, 'api/site-state.json'), 'utf8'))
      const problem = registrationFormBuildError(siteState)
      if (!problem) return
      if (config.command === 'build') this.error(problem)
      this.warn(problem)
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    react({
      include: [/\.[jt]sx?$/, /node_modules\/@deckio\/deck-engine\/.+\.jsx$/],
    }),
    deckPlugin({ inlineEditing: false }),
    tailwindPlugin(),
    selfHostedFonts(),
    requireRegistrationFormUrl(),
  ],
  server: {
    fs: {
      allow: ['..', '../..'],
    },
  },
})
