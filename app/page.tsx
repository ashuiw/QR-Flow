'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react'
import { Check, ChevronDown, Copy, Download, Code2, Link2, MapPin, Menu, Palette, Phone, QrCode, RotateCcw, Send, Share2, Sparkles, UserRound, Wifi, X, Zap, Mail, MessageSquareText, FileText, ShieldCheck } from 'lucide-react'

type QRType = 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'phone' | 'sms' | 'location'
type Config = { type: QRType; content: string; fg: string; bg: string; transparent: boolean; style: 'square' | 'rounded' | 'dots'; corner: 'square' | 'rounded' | 'extra'; size: number; level: 'L' | 'M' | 'Q' | 'H'; logo: string }

const types: { id: QRType; label: string; icon: typeof Link2; description: string }[] = [
  { id: 'url', label: 'URL', icon: Link2, description: 'Share a link instantly.' },
  { id: 'text', label: 'Text', icon: FileText, description: 'Turn any message into a code.' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, description: 'Share access, not passwords.' },
  { id: 'contact', label: 'Contact', icon: UserRound, description: 'Make your details scannable.' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Open a pre-filled email.' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Let people call you.' },
  { id: 'sms', label: 'SMS', icon: MessageSquareText, description: 'Start a text conversation.' },
  { id: 'location', label: 'Location', icon: MapPin, description: 'Pinpoint a place.' },
]

const presets = ['#17131f', '#3857d6', '#7049d8', '#19876e', '#d65959']
const initial: Config = { type: 'url', content: '', fg: '#17131f', bg: '#ffffff', transparent: false, style: 'square', corner: 'square', size: 800, level: 'M', logo: '' }

function makeData(config: Config) {
  if (!config.content.trim()) return ''
  if (config.type === 'phone') return `tel:${config.content}`
  if (config.type === 'sms') return `SMSTO:${config.content}`
  if (config.type === 'location') return `https://www.google.com/maps?q=${config.content}`
  return config.content
}

function QRForm({ config, setConfig }: { config: Config; setConfig: (next: Partial<Config>) => void }) {
  const type = config.type
  const field = (label: string, value: string, key: string, placeholder: string, area = false) => (
    <label className="field"><span>{label}</span>{area ? <textarea value={value} onChange={e => setConfig({ [key]: e.target.value })} placeholder={placeholder} maxLength={2000} rows={5} /> : <input value={value} onChange={e => setConfig({ [key]: e.target.value })} placeholder={placeholder} />}</label>
  )
  if (type === 'url') return <div className="form-stack">{field('Website URL', config.content, 'content', 'https://example.com')}<p className="hint">We&apos;ll add https:// automatically when needed.</p></div>
  if (type === 'text') return <div className="form-stack">{field('Your text', config.content, 'content', 'Enter any text here...', true)}<div className="count">{config.content.length} / 2000</div></div>
  if (type === 'wifi') return <div className="form-stack">{field('Network name (SSID)', config.content, 'content', 'My Wi-Fi')}<label className="field"><span>Password</span><input type="password" placeholder="Your network password" /></label><label className="field"><span>Security</span><select><option>WPA / WPA2</option><option>WEP</option><option>None</option></select></label><label className="check"><input type="checkbox" /> Hidden network</label></div>
  if (type === 'contact') return <div className="form-grid">{field('First name', '', 'content', 'Aarav')}{field('Last name', '', 'content', 'Shah')}{field('Phone', '', 'content', '+91 98765 43210')}{field('Email', '', 'content', 'hello@example.com')}{field('Organization', '', 'content', 'Company name')}{field('Website', '', 'content', 'example.com')}</div>
  if (type === 'email') return <div className="form-stack">{field('Email address', config.content, 'content', 'hello@example.com')}{field('Subject', '', 'content', 'Let&apos;s connect')}{field('Message', '', 'content', 'Write a message...', true)}</div>
  if (type === 'phone') return <div className="form-stack">{field('Phone number', config.content, 'content', '+91 98765 43210')}</div>
  if (type === 'sms') return <div className="form-stack">{field('Phone number', config.content, 'content', '+91 98765 43210')}{field('Message', '', 'content', 'Your message...', true)}</div>
  return <div className="form-grid">{field('Latitude', config.content, 'content', '19.0760')}{field('Longitude', '', 'content', '72.8777')}<p className="hint full">Enter coordinates to create a Google Maps location link.</p></div>
}

export default function Page() {
  const [config, setConfigState] = useState<Config>(initial)
  const [generated, setGenerated] = useState(false)
  const [menu, setMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const data = useMemo(() => makeData(config), [config])
  const setConfig = (next: Partial<Config>) => setConfigState(current => ({ ...current, ...next }))
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2400) }
  const selectType = (id: QRType) => { setConfig({ type: id, content: '' }); setGenerated(false) }
  const download = (format: 'png' | 'jpg' | 'svg') => {
    if (!data) return notify('Add content before downloading')
    if (format === 'svg') {
      const svg = document.querySelector('#qr-svg') as SVGElement
      const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' })
      const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'qrflow-code.svg'; link.click(); URL.revokeObjectURL(link.href)
    } else if (canvasRef.current) {
      const link = document.createElement('a'); link.download = `qrflow-code.${format}`; link.href = format === 'jpg' ? canvasRef.current.toDataURL('image/jpeg', .95) : canvasRef.current.toDataURL('image/png'); link.click()
    }
    notify(`${format.toUpperCase()} downloaded`)
  }
  const copy = async () => { if (!canvasRef.current) return notify('Add content first'); canvasRef.current.toBlob(async blob => { if (blob) { await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]); notify('QR image copied') } }); }
  return <div className="site-shell">
    <header className="nav"><a href="#top" className="brand"><span className="brand-mark"><QrCode /></span>QRFlow</a><nav className={menu ? 'nav-links open' : 'nav-links'}><a href="#generator">Generator</a><a href="#features">Features</a><a href="#how">How it works</a></nav><div className="nav-actions"><a className="github" href="https://github.com" aria-label="GitHub"><Code2 /></a><button className="icon-button" onClick={() => document.documentElement.classList.toggle('dark')} aria-label="Toggle theme"><span>◐</span></button><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Open menu"><Menu /></button></div></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" />No sign-up. No tracking. Just QR codes.</div><h1>Create QR codes.<br /><em>Instantly.</em></h1><p>Generate beautiful, customizable QR codes for links, text, Wi-Fi, contacts, and more — completely free.</p><div className="hero-actions"><a href="#generator" className="button primary">Generate QR Code <Send /></a><a href="#features" className="button secondary">Explore features</a></div></div><div className="hero-art" aria-hidden="true"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="mini-qr"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="art-label">SCAN / CREATE<br /><b>01—26</b></div></div></section>
      <section id="generator" className="generator-section"><div className="section-kicker">THE WORKSPACE</div><div className="generator-heading"><div><h2>Your code, your way.</h2><p>Choose a format, add your content, then make it yours.</p></div><div className="privacy-pill"><ShieldCheck /> 100% client-side</div></div><div className="type-scroll">{types.map(({ id, label, icon: Icon }) => <button key={id} className={config.type === id ? 'type-tab active' : 'type-tab'} onClick={() => selectType(id)}><Icon />{label}</button>)}</div><div className="workspace"><div className="config-panel"><div className="panel-title"><span><Sparkles /> {types.find(item => item.id === config.type)?.label} QR code</span><button className="reset-small" onClick={() => { setConfigState(initial); notify('Settings reset') }}><RotateCcw /> Reset</button></div><QRForm config={config} setConfig={setConfig} /><div className="customize"><div className="customize-title"><span><Palette /> Customize your QR</span><ChevronDown /></div><div className="customize-body"><div className="color-row"><label>Foreground <input type="color" value={config.fg} onChange={e => setConfig({ fg: e.target.value })} /></label><label>Background <input type="color" value={config.bg} onChange={e => setConfig({ bg: e.target.value })} /></label></div><div className="preset-row">{presets.map(color => <button key={color} style={{ background: color }} className="swatch" onClick={() => setConfig({ fg: color })} aria-label={`Use ${color}`} />)}</div><label className="check"><input type="checkbox" checked={config.transparent} onChange={e => setConfig({ transparent: e.target.checked })} /> Transparent background</label><div className="option-line"><span>Pattern</span><div className="segmented">{(['square', 'rounded', 'dots'] as const).map(item => <button key={item} className={config.style === item ? 'selected' : ''} onClick={() => setConfig({ style: item })}>{item}</button>)}</div></div><div className="option-line"><span>Size <b>{config.size}px</b></span><input className="range" type="range" min="200" max="1200" step="100" value={config.size} onChange={e => setConfig({ size: Number(e.target.value) })} /></div></div></div><button className="button generate" onClick={() => { setGenerated(true); notify('QR Code ready') }}>{generated ? <><Check /> QR Code Ready</> : <>Generate QR Code <Zap /></>}</button></div><div className="preview-panel"><div className="preview-top"><span>LIVE PREVIEW</span><span className="live-dot" /> <span className="live-text">Updates live</span></div><motion.div className="qr-stage" animate={{ scale: generated ? [1, 1.025, 1] : 1 }} transition={{ duration: .45 }}>{data ? <><QRCodeCanvas ref={canvasRef} value={data} size={270} level={config.logo ? 'H' : config.level} fgColor={config.fg} bgColor={config.transparent ? 'transparent' : config.bg} includeMargin imageSettings={config.logo ? { src: config.logo, height: 48, width: 48, excavate: true } : undefined} /><QRCodeSVG id="qr-svg" value={data} size={270} level={config.logo ? 'H' : config.level} fgColor={config.fg} bgColor={config.transparent ? 'transparent' : config.bg} includeMargin className="hidden-svg" /></> : <div className="empty-qr"><QrCode /><span>Your QR code will appear here</span><small>Enter your content and customize it instantly.</small></div>}</motion.div><div className="preview-label">{types.find(item => item.id === config.type)?.label} QR CODE <span>•</span> {data ? 'READY TO SCAN' : 'WAITING FOR CONTENT'}</div><div className="download-actions"><button className="button primary download" onClick={() => download('png')}><Download /> Download PNG</button><div className="download-menu"><button className="icon-button" onClick={() => setMenu(!menu)} aria-label="More download formats"><ChevronDown /></button>{menu && <div className="format-menu"><button onClick={() => download('png')}>PNG</button><button onClick={() => download('svg')}>SVG</button><button onClick={() => download('jpg')}>JPG</button></div>}</div></div><div className="quick-actions"><button onClick={copy}><Copy /> Copy image</button><button onClick={() => navigator.share?.({ title: 'QRFlow code', text: data })}><Share2 /> Share</button><button onClick={() => navigator.clipboard.writeText(data).then(() => notify('Data copied'))}><Copy /> Copy data</button></div></div></div></section>
      <section id="features" className="features"><div className="section-kicker">WHY QRFLOW</div><h2>Powerful by default.<br /><em>Simple by design.</em></h2><div className="feature-grid">{[[Zap, 'Instant generation', 'See your QR code change as you type.'], [Palette, 'Fully customizable', 'Colors, patterns, size and more.'], [ShieldCheck, 'Privacy first', 'Your data never leaves your device.'], [Download, 'High quality downloads', 'Export clean PNG, SVG or JPG files.']].map(([Icon, title, desc]) => <div className="feature" key={title as string}><Icon /><h3>{title as string}</h3><p>{desc as string}</p></div>)}</div></section>
      <section id="how" className="how"><div className="section-kicker">HOW IT WORKS</div><h2>From idea to <em>scan.</em></h2><div className="steps">{[['01', 'Choose a type', 'Select what you want your QR code to contain.'], ['02', 'Customize', 'Adjust the color, pattern, size and details.'], ['03', 'Download', 'Save your code and share it anywhere.']].map(([num, title, desc]) => <div className="step" key={num}><span>{num}</span><h3>{title}</h3><p>{desc}</p></div>)}</div></section>
      <section className="privacy"><ShieldCheck /><div><h3>Privacy by design</h3><p>QRFlow generates everything directly in your browser. No accounts, no storage, no tracking of what you create.</p></div><a href="#generator" className="button secondary">Create privately</a></section>
    </main><footer><a href="#top" className="brand"><span className="brand-mark"><QrCode /></span>QRFlow</a><span>Create. Scan. Share.</span><div><a href="#generator">Generator</a><a href="https://github.com">GitHub</a><a href="#top">Privacy</a></div><small>© 2026 QRFlow · Built for simplicity.</small></footer>{notice && <div className="toast"><Check /> {notice}</div>}
  </div>
}
