import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import PostHogProvider from '../integrations/posthog/provider'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'devme | the executable README' },
      { name: 'description', content: 'One command to go from git clone to a running dev environment. devme reads your project config, installs dependencies, starts services, and drops you into a live TUI.' },
      { property: 'og:title', content: 'devme | the executable README' },
      { property: 'og:description', content: 'One command to go from git clone to a running dev environment. No README needed.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://devme.sh' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'devme | the executable README' },
      { name: 'twitter:description', content: 'One command to go from git clone to a running dev environment. No README needed.' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/logo512.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/logo192.png' },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-webtui-theme="dark">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "devme",
          "alternateName": "devme CLI",
          "description": "A CLI developer tool that sets up complete dev environments from a single config file (devme.toml). One command to go from git clone to a running dev environment with services, environment variables, dependency checks, and a live terminal UI.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "macOS, Linux",
          "url": "https://devme.sh",
          "downloadUrl": "https://devme.sh/install",
          "installUrl": "https://devme.sh/install",
          "license": "https://opensource.org/licenses/MIT",
          "isAccessibleForFree": true,
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "featureList": [
            "Declarative environment variable management with devme.toml",
            "Automatic dependency checking and installation",
            "Service orchestration with health checks and dependency ordering",
            "Live terminal UI with per-service log streams",
            "Git multi-worktree support with isolated ports",
            "AI agent skills for Claude Code, Cursor, and Codex",
          ],
          "author": { "@type": "Organization", "name": "devme-sh", "url": "https://github.com/devme-sh" },
          "codeRepository": "https://github.com/devme-sh/devme",
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is devme?",
              "acceptedAnswer": { "@type": "Answer", "text": "devme is a CLI tool that reads a devme.toml config file in your project and sets up your entire dev environment — environment variables, dependencies, and services — with a single command." },
            },
            {
              "@type": "Question",
              "name": "How do I install devme?",
              "acceptedAnswer": { "@type": "Answer", "text": "Run curl -fsSL https://devme.sh/install | sh, or use Homebrew: brew install devme-sh/tap/devme" },
            },
            {
              "@type": "Question",
              "name": "What does devme.toml look like?",
              "acceptedAnswer": { "@type": "Answer", "text": "A devme.toml declares env vars with defaults and help text, steps that check and provision dependencies, and services with commands, ports, health checks, and dependency ordering." },
            },
          ],
        }) }} />
      </head>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  )
}
