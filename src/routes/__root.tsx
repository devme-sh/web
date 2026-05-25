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
