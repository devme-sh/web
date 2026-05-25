import { createFileRoute } from '@tanstack/react-router'

const INSTALL_SCRIPT_URL =
  'https://raw.githubusercontent.com/devme-sh/devme/main/install.sh'

export const Route = createFileRoute('/install')({
  server: {
    handlers: {
      GET: async () => {
        const res = await fetch(INSTALL_SCRIPT_URL)
        const body = await res.text()
        return new Response(body, {
          headers: {
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'public, max-age=300',
          },
        })
      },
    },
  },
})
