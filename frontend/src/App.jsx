import React, { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── CLASS NAMES & CONFIG ──
const CLASS_NAMES = [
  "Actualités", "Cuisine", "Culture", "Divertissement", "Santé",
  "Sport", "Technologie", "Voyage", "Économie", "Éducation"
]

const CLASS_COLORS = {
  "Actualités": "#f59e0b", "Cuisine": "#ef4444", "Culture": "#8b5cf6",
  "Divertissement": "#ec4899", "Santé": "#10b981", "Sport": "#06b6d4",
  "Technologie": "#6366f1", "Voyage": "#84cc16", "Économie": "#f97316", "Éducation": "#64748b"
}

const CLASS_ICONS = {
  "Actualités": "📰", "Cuisine": "🍳", "Culture": "🎭", "Divertissement": "🎬",
  "Santé": "🏥", "Sport": "⚽", "Technologie": "💻", "Voyage": "✈️",
  "Économie": "📈", "Éducation": "🎓"
}

function getLabelName(labelOrIndex) {
  if (typeof labelOrIndex === 'string' && labelOrIndex.startsWith('LABEL_')) {
    const idx = parseInt(labelOrIndex.replace('LABEL_', ''))
    return CLASS_NAMES[idx] || labelOrIndex
  }
  if (typeof labelOrIndex === 'number') return CLASS_NAMES[labelOrIndex] || `Class ${labelOrIndex}`
  return labelOrIndex
}

// ── ANIMATION HOOKS ──
function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    const start = performance.now()
    startRef.current = start
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration])

  return value
}

// ── ICONS ──
const BrainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
)

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)

const TargetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
)

const GitBranchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

// ── COMPONENTS ──

const Navbar = () => (
  <nav style={{
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    background: 'rgba(15, 23, 42, 0.7)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    padding: '0 2rem'
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
        }}>
          <BrainIcon />
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>DarijaBERT</span>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="#demo" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Demo</a>
        <a href="#architecture" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Architecture</a>
        <a href="https://github.com/Hanasoummar" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500
          }}>
          <GitBranchIcon /> GitHub
        </a>
      </div>
    </div>
  </nav>
)

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', paddingTop: '64px'
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168, 85, 247, 0.1), transparent)',
        animation: 'pulse 8s ease-in-out infinite'
      }} />
      
      {/* Floating orbs */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        top: '10%', left: '10%',
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        transition: 'transform 0.3s ease-out'
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
        bottom: '20%', right: '15%',
        transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)`,
        transition: 'transform 0.3s ease-out'
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 2rem' }}>
        <div className="animate-in" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem', borderRadius: 50,
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          color: '#818cf8', fontSize: '0.8rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '2px',
          marginBottom: '2rem'
        }}>
          <ZapIcon /> Production-Ready NLP Pipeline
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 6vw, 4.5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem'
        }}>
          <span style={{ color: '#f8fafc' }}>Moroccan Arabic</span><br />
          <span style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 40%, #f472b6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Text Classification</span>
        </h1>

        <p style={{
          color: '#94a3b8', fontSize: '1.25rem', lineHeight: 1.7,
          maxWidth: '600px', margin: '0 auto 2.5rem', fontWeight: 400
        }}>
          Fine-tuned <strong style={{ color: '#e2e8f0' }}>BERT</strong> with <strong style={{ color: '#e2e8f0' }}>LoRA</strong> adapters for 10-class Darija dialect classification. 
          Deployed with FastAPI + React.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#demo" style={{
            padding: '0.875rem 2rem', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            color: 'white', textDecoration: 'none', fontWeight: 600,
            boxShadow: '0 4px 24px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.3s', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}>
            Try the Demo <ArrowRightIcon />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
            padding: '0.875rem 2rem', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0', textDecoration: 'none', fontWeight: 600,
            transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
          }}>
            View Source
          </a>
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap'
        }}>
          {[
            { value: 10, suffix: '', label: 'Classes' },
            { value: 82, suffix: '%', label: 'F1 Score' },
            { value: 128, suffix: 'ms', label: 'Avg Latency' }
          ].map((stat) => (
            <StatCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        animation: 'bounce 2s infinite'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </section>
  )
}

const StatCounter = ({ value, suffix, label }) => {
  const count = useCountUp(value, 2000)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '0.5rem' }}>
        {label}
      </div>
    </div>
  )
}

const ArchitectureSection = () => (
  <section id="architecture" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        color: '#818cf8', fontSize: '0.8rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem'
      }}>
        <LayersIcon /> Technical Stack
      </div>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
        Architecture Overview
      </h2>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {[
        {
          title: "Model",
          icon: "🧠",
          items: ["DarijaBERT-base", "LoRA Adapters (r=16)", "10-class softmax", "HuggingFace Transformers"]
        },
        {
          title: "Training",
          icon: "⚙️",
          items: ["Mixed Precision (fp16)", "Gradient Accumulation", "Early Stopping", "Weighted Cross-Entropy"]
        },
        {
          title: "Backend",
          icon: "⚡",
          items: ["FastAPI (async)", "Torch JIT optimization", "Batch inference", "Health monitoring"]
        },
        {
          title: "Frontend",
          icon: "🎨",
          items: ["React 19 + Vite", "Real-time probability viz", "CSV batch processing", "Responsive design"]
        }
      ].map((card, i) => (
        <div key={i} className="glass-card-hover" style={{
          padding: '2rem', borderRadius: 16,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'all 0.3s'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{card.icon}</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>{card.title}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {card.items.map((item, j) => (
              <li key={j} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.6rem'
              }}>
                <span style={{ color: '#10b981' }}><CheckIcon /></span> {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
)

const ProbabilityBar = ({ label, prob, color, isTop, rank }) => {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(prob), 100)
    return () => clearTimeout(timer)
  }, [prob])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
      <div style={{ 
        width: '32px', height: '32px', borderRadius: 8,
        background: isTop ? `${color}20` : 'rgba(255,255,255,0.03)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem', fontWeight: 700, color: isTop ? color : '#64748b',
        flexShrink: 0
      }}>
        {rank}
      </div>
      <div style={{ width: '110px', fontSize: '0.85rem', fontWeight: isTop ? 600 : 500, color: isTop ? '#f8fafc' : '#94a3b8', textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
        <span>{CLASS_ICONS[label] || '•'}</span> {label}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{
          height: 8, borderRadius: 4,
          background: 'rgba(255,255,255,0.04)',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            width: `${width}%`,
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isTop ? `0 0 12px ${color}40` : 'none'
          }} />
        </div>
      </div>
      <div style={{ width: '55px', fontSize: '0.85rem', fontWeight: 700, color: isTop ? '#f8fafc' : '#64748b', textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
        {prob.toFixed(1)}%
      </div>
    </div>
  )
}

const ResultCard = ({ result }) => {
  const allProbs = result.all_probabilities.map((p, i) => ({
    ...p,
    class: getLabelName(p.class)
  }))
  allProbs.sort((a, b) => b.probability - a.probability)
  const topClass = allProbs[0]

  return (
    <div className="glass-card animate-in" style={{
      border: '1px solid rgba(16, 185, 129, 0.2)',
      background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(255,255,255,0.02) 100%)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(16, 185, 129, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <TargetIcon />
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Prediction Result</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Model inference complete</div>
        </div>
      </div>

      <div style={{
        padding: '1.5rem', borderRadius: 12,
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.15)',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '0.5rem' }}>
          Predicted Class
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          {CLASS_ICONS[topClass.class]} {topClass.class}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: 50,
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#10b981', fontSize: '0.9rem', fontWeight: 600
        }}>
          <ChartIcon /> Confidence: {result.confidence}%
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '1rem' }}>
          Probability Distribution
        </div>
        {allProbs.map((p, i) => (
          <ProbabilityBar
            key={p.class}
            label={p.class}
            prob={p.probability}
            color={CLASS_COLORS[p.class] || '#64748b'}
            isTop={i === 0}
            rank={i + 1}
          />
        ))}
      </div>

      <div style={{
        paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.75rem', color: '#475569'
      }}>
        <span>⚡ {result.inference_time_ms}ms inference</span>
        <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', opacity: 0.6 }}>{result.model_id}</span>
      </div>
    </div>
  )
}

const BatchUploader = ({ onResults }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0])
  }, [])

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/predict/csv?max_length=128`, {
        method: 'POST', body: formData,
      })
      if (!response.ok) throw new Error('Upload failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `predictions_${file.name}`; a.click()
      window.URL.revokeObjectURL(url)
      onResults?.()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card animate-in" style={{ border: '1px solid rgba(245, 158, 11, 0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(245, 158, 11, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <UploadIcon />
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Batch Classification</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Process multiple texts via CSV</div>
        </div>
      </div>

      <input
        type="file" accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: 'none' }} id="csv-upload"
      />
      <label
        htmlFor="csv-upload"
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        style={{
          display: 'block', cursor: 'pointer',
          border: `2px dashed ${dragActive ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 12, padding: '2.5rem 2rem', textAlign: 'center',
          background: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.3s'
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📄</div>
        <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: '0.25rem' }}>
          {file ? file.name : 'Drop CSV file or click to browse'}
        </div>
        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
          Must contain a <code style={{ background: 'rgba(99,102,241,0.1)', padding: '0.15rem 0.4rem', borderRadius: 4, color: '#818cf8', fontFamily: 'JetBrains Mono, monospace' }}>Text</code> column
        </div>
      </label>

      <button
        className="btn-primary"
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          marginTop: '1rem', width: '100%',
          background: !file ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          opacity: !file ? 0.5 : 1
        }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
            Processing batch...
          </span>
        ) : 'Upload & Classify'}
      </button>
    </div>
  )
}

const ClassLegend = () => (
  <div className="glass-card" style={{ marginTop: '1.5rem' }}>
    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '1rem' }}>
      Supported Categories
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
      {CLASS_NAMES.map((name) => (
        <div key={name} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          fontSize: '0.85rem', color: '#94a3b8'
        }}>
          <span style={{ fontSize: '1rem' }}>{CLASS_ICONS[name]}</span>
          <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{name}</span>
        </div>
      ))}
    </div>
  </div>
)

// ── MAIN APP ──
function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('single')

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(r => r.json())
      .then(data => {
        if (data.classes) data.classes = data.classes.map(c => getLabelName(c))
        setHealth(data)
      })
      .catch(() => setHealth({ status: 'offline', model_loaded: false }))
  }, [])

  const handlePredict = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult(null)

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), max_length: 128 }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Prediction failed')
      }
      const data = await response.json()
      data.prediction = getLabelName(data.prediction)
      if (data.all_probabilities) {
        data.all_probabilities = data.all_probabilities.map(p => ({
          ...p, class: getLabelName(p.class)
        }))
      }
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exampleTexts = [
    { text: "واش نتا مزيان؟ كيفاش كتخدم هاد النموذج؟", label: "Technologie", desc: "Tech inquiry in Darija" },
    { text: "الرياضة اليوم: الفريق الوطني فاز بمباراة مهمة", label: "Sport", desc: "Sports news headline" },
    { text: "وصفة جديدة للكسكس بالخضر والحم", label: "Cuisine", desc: "Recipe description" },
    { text: "أهمية التعليم في تطوير المجتمع المغربي", label: "Éducation", desc: "Education editorial" }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0' }}>
      <Navbar />
      <Hero />
      <ArchitectureSection />

      {/* DEMO SECTION */}
      <section id="demo" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            color: '#818cf8', fontSize: '0.8rem', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem'
          }}>
            <ZapIcon /> Live Demo
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Try It Yourself
          </h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '1rem auto 0' }}>
            Enter Moroccan Arabic (Darija) text and see the model classify it in real-time.
          </p>
        </div>

        {/* API Status */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: 50,
            background: health?.model_loaded ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${health?.model_loaded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            color: health?.model_loaded ? '#10b981' : '#ef4444',
            fontSize: '0.85rem', fontWeight: 600
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: health?.model_loaded ? '#10b981' : '#ef4444',
              boxShadow: health?.model_loaded ? '0 0 8px #10b981' : '0 0 8px #ef4444',
              display: 'inline-block'
            }} />
            {health?.model_loaded ? 'Model Online' : 'API Offline'}
            {health?.classes && ` • ${health.num_classes} classes`}
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem'
        }}>
          {[
            { id: 'single', label: 'Single Text', icon: '📝' },
            { id: 'batch', label: 'Batch CSV', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: 10,
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                color: activeTab === tab.id ? '#818cf8' : '#64748b',
                fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column */}
          <div>
            {activeTab === 'single' ? (
              <div className="glass-card animate-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    fontSize: '1.2rem'
                  }}>
                    📝
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Input Text</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Moroccan Arabic (Darija) text</div>
                  </div>
                </div>

                <textarea
                  className="input-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter Darija text here... e.g., 'شنو هو أحسن فريق فالمغرب؟'"
                  rows={5}
                  style={{
                    width: '100%', padding: '1rem', borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.6,
                    resize: 'vertical', outline: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                />

                <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Quick Examples
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {exampleTexts.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setText(ex.text)}
                        style={{
                          textAlign: 'left', padding: '0.75rem 1rem', borderRadius: 10,
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                          color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer',
                          transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'
                          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)'
                          e.currentTarget.style.color = '#e2e8f0'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                          e.currentTarget.style.color = '#94a3b8'
                        }}
                      >
                        <span style={{ fontFamily: 'system-ui', direction: 'rtl' }}>{ex.text}</span>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: 4,
                          background: `${CLASS_COLORS[ex.label]}15`,
                          color: CLASS_COLORS[ex.label], fontSize: '0.7rem', fontWeight: 600,
                          whiteSpace: 'nowrap', marginLeft: '0.5rem'
                        }}>
                          {ex.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  onClick={handlePredict}
                  disabled={loading || !text.trim()}
                  style={{
                    width: '100%', padding: '0.875rem',
                    background: loading || !text.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    opacity: loading || !text.trim() ? 0.5 : 1
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                      Analyzing with BERT...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <BrainIcon /> Analyze Text
                    </span>
                  )}
                </button>

                {error && (
                  <div style={{
                    marginTop: '1rem', padding: '1rem', borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}>
                    ⚠️ {error}
                  </div>
                )}
              </div>
            ) : (
              <BatchUploader />
            )}

            <ClassLegend />
          </div>

          {/* Right Column - Results */}
          <div>
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="glass-card" style={{
                textAlign: 'center', padding: '5rem 2rem', opacity: 0.6,
                border: '1px dashed rgba(255,255,255,0.1)'
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', fontSize: '2.5rem'
                }}>
                  🧠
                </div>
                <div style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Ready to Analyze
                </div>
                <div style={{ color: '#475569', fontSize: '0.9rem' }}>
                  Enter Darija text and click analyze to see classification results
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)', padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
            {[
              { icon: '🐙', label: 'GitHub', href: 'https://github.com' },
              { icon: '💼', label: 'LinkedIn', href: 'https://linkedin.com' },
              { icon: '📧', label: 'Email', href: 'mailto:contact@example.com' }
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500,
                transition: 'color 0.2s'
              }}>
                {link.icon} {link.label}
              </a>
            ))}
          </div>
          <div style={{ color: '#475569', fontSize: '0.8rem' }}>
            Built with <span style={{ color: '#ef4444' }}>❤</span> using DarijaBERT + LoRA + FastAPI + React
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App