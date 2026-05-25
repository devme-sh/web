import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: Landing })

function Landing() {
  return (
    <div className="page-wrap">
      <Hero />
      <hr className="separator" />
      <TerminalDemo />
      <hr className="separator" />
      <Features />
      <hr className="separator" />
      <HowItWorks />
      <hr className="separator" />
      <Footer />
    </div>
  )
}

function Hero() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('brew install devme-sh/tap/devme')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section style={{ padding: '4lh 0 2lh' }}>
      <p className="dimmed fade-in">~/your-project</p>
      <h1 className="fade-in stagger-1" style={{ fontSize: '2em', margin: '0.5lh 0', lineHeight: 1.2 }}>
        The executable README
      </h1>
      <p className="muted fade-in stagger-2" style={{ maxWidth: '60ch', margin: '0 0 2lh' }}>
        One command to go from <span className="accent">git clone</span> to a running dev environment.
        devme reads your project config, installs dependencies, starts services,
        and drops you into a live TUI. No README needed.
      </p>

      <div
        className="hero-install fade-in stagger-3"
        onClick={handleCopy}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCopy()}
      >
        <span className="prompt">$</span>
        <span className="cmd">brew install devme-sh/tap/devme</span>
        <span className="copy-hint">{copied ? <><span className="nf-icon green">󰄬</span>copied</> : <><span className="nf-icon">󰆏</span>copy</>}</span>
      </div>

      <div className="fade-in stagger-4" style={{ marginTop: '1lh', display: 'flex', gap: '2ch' }}>
        <a href="https://github.com/devme-sh/devme" className="accent" style={{ textDecoration: 'none' }}>
          <span className="nf-icon"></span>GitHub
        </a>
        <a href="https://github.com/devme-sh/devme#quickstart" className="muted" style={{ textDecoration: 'none' }}>
          <span className="nf-icon"></span>Docs
        </a>
      </div>
    </section>
  )
}

function TerminalDemo() {
  return (
    <section>
      <h2 className="section-heading">See it in action</h2>
      <div className="terminal-demo fade-in">
        <span className="line"><span className="prompt-char">$</span> <span className="cmd-text">cd my-project && devme</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="accent">  ◆</span>  <strong>Configure environment</strong>  <span className="dimmed">3 variables</span></span>
        <span className="line"><span className="dimmed">  │</span></span>
        <span className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> DATABASE_URL  <span className="dimmed">postgresql://localhost:5432/dev</span></span>
        <span className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> AUTH_SECRET  <span className="dimmed">Generated</span></span>
        <span className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> API_KEY  <span className="dimmed">sk-proj-...abc</span></span>
        <span className="line"><span className="dimmed">  │</span></span>
        <span className="line">  └  <span className="green">Wrote 3 variables to .env.local</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="accent">  ◆</span>  <strong>Check dependencies</strong></span>
        <span className="line"><span className="dimmed">  │</span></span>
        <span className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> Node.js runtime</span>
        <span className="line"><span className="dimmed">  │</span>  <span className="green">◇</span> Install dependencies</span>
        <span className="line"><span className="dimmed">  │</span></span>
        <span className="line">  └  <span className="green">All dependencies satisfied</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[+] Running 3/3</span></span>
        <span className="line"><span className="green">  ● postgres</span>    <span className="dimmed">ready to accept connections</span></span>
        <span className="line"><span className="green">  ● api</span>         <span className="dimmed">listening on :8080</span></span>
        <span className="line"><span className="green">  ● web</span>         <span className="dimmed">VITE+ ready in 340ms</span></span>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: '',
      title: 'Declarative env vars',
      desc: 'Declare expected variables in devme.toml with defaults, help text, and auto-generate commands. New team members get prompted automatically.',
    },
    {
      icon: '',
      title: 'Dependency checks',
      desc: 'Steps verify prerequisites before services start. Missing Node.js? devme offers to install it. All checks pass? One clean line.',
    },
    {
      icon: '',
      title: 'Service orchestration',
      desc: 'Postgres, Redis, your API, your frontend — started in dependency order with health checks. Like docker-compose but for your whole dev stack.',
    },
    {
      icon: '',
      title: 'Live TUI',
      desc: 'A real terminal UI with per-service log streams, scrollback, filtering, and keyboard navigation. Not just interleaved stdout.',
    },
    {
      icon: '',
      title: 'Multi-worktree',
      desc: 'Working on two branches? Each git worktree gets its own devme instance with isolated ports. No conflicts.',
    },
    {
      icon: '',
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
        <span className="line"><span className="warn">schema_version</span> = <span className="green">1</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="warn">env</span>.DATABASE_URL<span className="dimmed">]</span></span>
        <span className="line">default = <span className="green">"postgresql://localhost:5432/dev"</span></span>
        <span className="line">help    = <span className="green">"Connection string for the dev database"</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="warn">step</span>.deps<span className="dimmed">]</span></span>
        <span className="line">check     = <span className="green">"test -d node_modules"</span></span>
        <span className="line">provision = <span className="green">"bun install"</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="warn">service</span>.db<span className="dimmed">]</span></span>
        <span className="line">cmd  = <span className="green">"docker run --rm -p {'{port}'}:5432 postgres:17"</span></span>
        <span className="line">port = <span className="dimmed">{'{ base = 5432, slot_offset = 10 }'}</span></span>
        <span className="line">&nbsp;</span>
        <span className="line"><span className="dimmed">[</span><span className="warn">service</span>.web<span className="dimmed">]</span></span>
        <span className="line">cmd        = <span className="green">"bun run dev"</span></span>
        <span className="line">depends_on = <span className="dimmed">[</span><span className="green">"deps"</span>, <span className="green">"db"</span><span className="dimmed">]</span></span>
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
