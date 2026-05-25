import { createFileRoute } from '@tanstack/react-router'
import { lazy, useState, useEffect, useRef, Suspense } from 'react'
import { ScrambleText } from '../components/ScrambleText'

const AsciiHero = lazy(() =>
  import('../components/ascii/AsciiHero').then((m) => ({ default: m.AsciiHero }))
)

export const Route = createFileRoute('/')( { component: Landing })

function Landing() {
  return (
    <>
      <div className="crt-overlay" />
      <Hero />
      <div className="page-wrap">
        <hr className="separator" />
        <TerminalDemo />
        <hr className="separator" />
        <Features />
        <hr className="separator" />
        <HowItWorks />
        <hr className="separator" />
        <Footer />
      </div>
    </>
  )
}

function Hero() {
  const [copied, setCopied] = useState(false)
  const [method, setMethod] = useState<'curl' | 'brew'>('curl')

  const commands = {
    curl: 'curl -fsSL https://devme.sh/install | sh',
    brew: 'brew install devme-sh/tap/devme',
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[method])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="hero-section">
      <Suspense fallback={null}>
        <AsciiHero />
      </Suspense>
      <div className="hero-content page-wrap" style={{ padding: '6lh 0 4lh' }}>
        <p className="dimmed fade-in" style={{ marginBottom: '0.5lh' }}>~/your-project</p>
        <h1 className="fade-in stagger-1 glow-green" style={{ fontSize: '2.4em', margin: '0 0 1lh', lineHeight: 1.1 }}>
          <ScrambleText text="The executable README" speed={0.6} scramble={8} step={2} />
        </h1>
        <p className="muted fade-in stagger-2" style={{ maxWidth: '55ch', margin: '0 0 2lh', lineHeight: 1.6 }}>
          One command to go from <span className="glow-cyan">git clone</span> to a running dev environment.
          devme reads your project config, installs dependencies, starts services,
          and drops you into a live TUI. No README needed.
        </p>

        <div className="fade-in stagger-3">
          <div className="install-tabs">
            <button className={`install-tab ${method === 'curl' ? 'active' : ''}`} onClick={() => setMethod('curl')}>curl</button>
            <button className={`install-tab ${method === 'brew' ? 'active' : ''}`} onClick={() => setMethod('brew')}>brew</button>
          </div>
          <div
            className="hero-install"
            onClick={handleCopy}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
          >
            <span className="prompt">$</span>
            <span className="cmd">{commands[method]}</span>
            <span className="copy-hint">{copied ? <><span className="nf-icon green">󰄬</span>copied</> : <><span className="nf-icon">󰆏</span>copy</>}</span>
          </div>
        </div>

        <div className="fade-in stagger-4" style={{ marginTop: '1.5lh', display: 'flex', gap: '3ch' }}>
          <a href="https://github.com/devme-sh/devme" className="glow-cyan" style={{ textDecoration: 'none' }}>
            <span className="nf-icon">󰊤</span>GitHub
          </a>
          <a href="https://github.com/devme-sh/devme#quickstart" className="muted" style={{ textDecoration: 'none' }}>
            <span className="nf-icon">󰃤</span>Docs
          </a>
        </div>
      </div>
    </section>
  )
}

function TerminalDemo() {
  const [typedCmd, setTypedCmd] = useState('')
  const [visibleLines, setVisibleLines] = useState(0)
  const [started, setStarted] = useState(false)
  const demoRef = useRef<HTMLDivElement>(null)
  const animatingRef = useRef(false)

  const cmd = 'cd my-project && devme'

  useEffect(() => {
    const el = demoRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatingRef.current) {
          animatingRef.current = true
          setTypedCmd('')
          setVisibleLines(0)
          setStarted(true)
        } else if (!entry.isIntersecting) {
          animatingRef.current = false
          setStarted(false)
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let i = 0
    const typeInterval = setInterval(() => {
      i++
      setTypedCmd(cmd.slice(0, i))
      if (i >= cmd.length) clearInterval(typeInterval)
    }, 45)
    return () => clearInterval(typeInterval)
  }, [started])

  useEffect(() => {
    if (!started || typedCmd.length < cmd.length) return
    const delays = [300, 100, 200, 80, 200, 200, 200, 80, 350, 400, 250, 100, 200, 200, 100, 350, 500, 150, 250, 250, 250]
    let line = 0
    let timeout: ReturnType<typeof setTimeout>
    function showNext() {
      line++
      setVisibleLines(line)
      if (line < delays.length) {
        timeout = setTimeout(showNext, delays[line])
      }
    }
    timeout = setTimeout(showNext, delays[0])
    return () => clearTimeout(timeout)
  }, [started, typedCmd])

  const lines: JSX.Element[] = [
    <span key={0} className="line">&nbsp;</span>,
    <span key={1} className="line"><span className="accent">  ◆</span>  <strong>Configure environment</strong>  <span className="dimmed">3 variables</span></span>,
    <span key={2} className="line"><span className="dimmed">  │</span></span>,
    <span key={3} className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> <span className="yellow">DATABASE_URL</span>  <span className="dimmed">postgresql://localhost:5432/dev</span></span>,
    <span key={4} className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> <span className="yellow">AUTH_SECRET</span>  <span className="green">Generated</span></span>,
    <span key={5} className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> <span className="yellow">API_KEY</span>  <span className="dimmed">sk-proj-...abc</span></span>,
    <span key={6} className="line"><span className="dimmed">  │</span></span>,
    <span key={7} className="line">  └  <span className="green">Wrote 3 variables to .env.local</span></span>,
    <span key={8} className="line">&nbsp;</span>,
    <span key={9} className="line"><span className="accent">  ◆</span>  <strong>Check dependencies</strong></span>,
    <span key={10} className="line"><span className="dimmed">  │</span></span>,
    <span key={11} className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> Node.js runtime</span>,
    <span key={12} className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> Install dependencies</span>,
    <span key={13} className="line"><span className="dimmed">  │</span></span>,
    <span key={14} className="line">  └  <span className="green">All dependencies satisfied</span></span>,
    <span key={15} className="line">&nbsp;</span>,
    <span key={16} className="line"><span className="cyan">[+]</span> Running <span className="green">3/3</span></span>,
    <span key={17} className="line">  <span className="green">●</span> <span className="cyan">postgres</span>    <span className="dimmed">ready to accept connections</span></span>,
    <span key={18} className="line">  <span className="green">●</span> <span className="cyan">api</span>         <span className="dimmed">listening on </span><span className="yellow">:8080</span></span>,
    <span key={19} className="line">  <span className="green">●</span> <span className="cyan">web</span>         <span className="dimmed">VITE+ ready in </span><span className="yellow">340ms</span></span>,
  ]

  return (
    <section>
      <h2 className="section-heading">See it in action</h2>
      <div className="terminal-demo" ref={demoRef}>
        <span className="line">
          <span className="prompt-char">$</span>{' '}
          <span className="cmd-text">{typedCmd}</span>
          {typedCmd.length < cmd.length && <span className="cursor-blink">▌</span>}
        </span>
        {lines.slice(0, visibleLines).map((line, i) => (
          <span key={i} className="terminal-line-enter">{line.props.children}</span>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: '󰌾',
      title: 'Declarative env vars',
      desc: 'Declare expected variables in devme.toml with defaults, help text, and auto-generate commands. New team members get prompted automatically.',
    },
    {
      icon: '󰒃',
      title: 'Dependency checks',
      desc: 'Steps verify prerequisites before services start. Missing Node.js? devme offers to install it. All checks pass? One clean line.',
    },
    {
      icon: '󰚡',
      title: 'Service orchestration',
      desc: 'Postgres, Redis, your API, your frontend — started in dependency order with health checks. Like docker-compose but for your whole dev stack.',
    },
    {
      icon: '󰒉',
      title: 'Live TUI',
      desc: 'A real terminal UI with per-service log streams, scrollback, filtering, and keyboard navigation. Not just interleaved stdout.',
    },
    {
      icon: '󰄦',
      title: 'Multi-worktree',
      desc: 'Working on two branches? Each git worktree gets its own devme instance with isolated ports. No conflicts.',
    },
    {
      icon: '󰃡',
      title: 'No README maintenance',
      desc: 'The setup instructions are the config file. devme.toml is the source of truth — always up to date, never stale.',
    },
  ]

  return (
    <section>
      <h2 className="section-heading">Features</h2>
      <div className="feature-grid">
        {features.map((f, i) => (
          <div key={f.title} className={`feature-card fade-in stagger-${i + 1}`}>
            <h3><span className="nf-icon">{f.icon}</span>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section>
      <h2 className="section-heading">How it works</h2>
      <div className="terminal-demo">
        <span className="line"><span className="dimmed"># 1. Add a devme.toml to your repo</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="cyan">schema_version</span> = <span className="yellow">1</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="yellow">env</span><span className="dimmed">.</span><span className="yellow">DATABASE_URL</span><span className="dimmed">]</span></span>
        <span className="line"><span className="cyan">default</span> = <span className="green">"postgresql://localhost:5432/dev"</span></span>
        <span className="line"><span className="cyan">help</span>    = <span className="green">"Connection string for the dev database"</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="yellow">step</span><span className="dimmed">.</span><span className="yellow">deps</span><span className="dimmed">]</span></span>
        <span className="line"><span className="cyan">check</span>     = <span className="green">"test -d node_modules"</span></span>
        <span className="line"><span className="cyan">provision</span> = <span className="green">"bun install"</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="yellow">service</span><span className="dimmed">.</span><span className="yellow">db</span><span className="dimmed">]</span></span>
        <span className="line"><span className="cyan">cmd</span>  = <span className="green">"docker run --rm -p {'{port}'}:5432 postgres:17"</span></span>
        <span className="line"><span className="cyan">port</span> = <span className="dimmed">{'{ '}</span><span className="cyan">base</span> = <span className="yellow">5432</span><span className="dimmed">, </span><span className="cyan">slot_offset</span> = <span className="yellow">10</span><span className="dimmed">{' }'}</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="yellow">service</span><span className="dimmed">.</span><span className="yellow">web</span><span className="dimmed">]</span></span>
        <span className="line"><span className="cyan">cmd</span>        = <span className="green">"bun run dev"</span></span>
        <span className="line"><span className="cyan">depends_on</span> = <span className="dimmed">[</span><span className="green">"deps"</span><span className="dimmed">, </span><span className="green">"db"</span><span className="dimmed">]</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed"># 2. Run devme</span></span>
        <span className="line"><span className="prompt-char">$</span> <span className="cmd-text">devme</span></span>
        <span className="line"><span className="dimmed"># That's it. Environment configured, deps installed, services running.</span></span>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span>devme — the executable README</span>
      <div style={{ display: 'flex', gap: '2ch' }}>
        <a href="https://github.com/devme-sh/devme">GitHub</a>
        <a href="https://github.com/devme-sh/devme/issues">Issues</a>
        <a href="https://github.com/devme-sh/devme#license">MIT License</a>
      </div>
    </footer>
  )
}
