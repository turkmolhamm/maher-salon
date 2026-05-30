import React, { useState, useEffect, useRef } from 'react'

// ─── Gold Button ─────────────────────────────────────────────────────
export function GoldBtn({ children, onClick, disabled, style, outline, sm }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: sm ? '8px 16px' : '13px 24px',
    borderRadius: 10,
    fontSize: sm ? 13 : 15,
    fontWeight: 700,
    fontFamily: 'Cairo, sans-serif',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    opacity: disabled ? 0.5 : 1,
    ...style
  }
  if (outline) {
    return (
      <button onClick={disabled ? null : onClick} style={{ ...base, background: 'transparent', border: '1px solid var(--gold-dark)', color: 'var(--gold)' }}
        onMouseEnter={e => { if (!disabled) { e.target.style.background = 'var(--gold-subtle)' } }}
        onMouseLeave={e => { e.target.style.background = 'transparent' }}>
        {children}
      </button>
    )
  }
  return (
    <button onClick={disabled ? null : onClick}
      style={{ ...base, background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', color: '#080808' }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.88' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
      {children}
    </button>
  )
}

// ─── DangerBtn ───────────────────────────────────────────────────────
export function DangerBtn({ children, onClick, sm }) {
  return (
    <button onClick={onClick} style={{
      background: 'rgba(229,57,53,0.12)', color: '#E57373', border: '1px solid rgba(229,57,53,0.3)',
      padding: sm ? '6px 12px' : '10px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'Cairo, sans-serif', transition: 'all 0.2s'
    }}>
      {children}
    </button>
  )
}

// ─── Input ───────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = 'text', dir, required, icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
        {label} {required && <span style={{ color: 'var(--gold)' }}>*</span>}
      </label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.4 }}>{icon}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir}
          style={{
            width: '100%', background: 'var(--dark3)', border: '1px solid var(--dark5)',
            color: 'var(--text-primary)', padding: icon ? '11px 40px 11px 14px' : '11px 14px',
            borderRadius: 9, fontSize: 13, outline: 'none', transition: 'border-color 0.2s'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--gold-dark)'}
          onBlur={e => e.target.style.borderColor = 'var(--dark5)'}
        />
      </div>
    </div>
  )
}

// ─── Select ──────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
        {label} {required && <span style={{ color: 'var(--gold)' }}>*</span>}
      </label>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', background: 'var(--dark3)', border: '1px solid var(--dark5)',
          color: value ? 'var(--text-primary)' : 'var(--text-dim)',
          padding: '11px 14px', borderRadius: 9, fontSize: 13, outline: 'none',
          transition: 'border-color 0.2s', cursor: 'pointer'
        }}
        onFocus={e => e.target.style.borderColor = 'var(--gold-dark)'}
        onBlur={e => e.target.style.borderColor = 'var(--dark5)'}>
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: 'var(--dark3)' }}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────
export function Card({ children, style, onClick, hover, goldBorder }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: 'var(--dark2)', borderRadius: 14,
        border: goldBorder ? '1px solid var(--gold-dark)' : `1px solid ${hovered ? 'var(--dark5)' : 'var(--dark4)'}`,
        transition: 'all 0.2s', cursor: onClick ? 'pointer' : 'default',
        transform: hovered && hover ? 'translateY(-2px)' : 'none',
        ...style
      }}>
      {children}
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────
export function Badge({ children, color = 'gold', style }) {
  const colors = {
    gold:    { bg: 'rgba(201,168,76,0.15)',  text: '#C9A84C',  border: 'rgba(201,168,76,0.3)' },
    blue:    { bg: 'rgba(91,179,224,0.15)',  text: '#5BB3E0',  border: 'rgba(91,179,224,0.3)' },
    green:   { bg: 'rgba(76,175,80,0.15)',   text: '#66BB6A',  border: 'rgba(76,175,80,0.3)' },
    red:     { bg: 'rgba(229,57,53,0.15)',   text: '#EF5350',  border: 'rgba(229,57,53,0.3)' },
    gray:    { bg: 'rgba(255,255,255,0.06)', text: '#888888',  border: 'rgba(255,255,255,0.1)' },
    vip:     { bg: 'linear-gradient(90deg,rgba(201,168,76,0.2),rgba(240,208,128,0.15))', text: '#F0D080', border: 'rgba(201,168,76,0.4)' },
  }
  const c = colors[color] || colors.gold
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, padding: '3px 10px', borderRadius: 20,
      fontWeight: 600, letterSpacing: 0.3,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      ...style
    }}>{children}</span>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────
export function Avatar({ name, size = 40, color }) {
  const initials = name ? name.trim().charAt(0) : '?'
  const colors = ['#8B6914','#1a5a8a','#3d6b22','#7a2d7a','#7a3d22']
  const bg = color || colors[name ? name.charCodeAt(0) % colors.length : 0]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#fff', flexShrink: 0,
      fontFamily: 'Cairo, sans-serif'
    }}>{initials}</div>
  )
}

// ─── Toast ───────────────────────────────────────────────────────────
let toastCb = null
export function registerToast(fn) { toastCb = fn }
export function toast(msg, type = 'success') { toastCb && toastCb(msg, type) }

export function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    registerToast((msg, type) => {
      const id = Date.now()
      setToasts(p => [...p, { id, msg, type }])
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
    })
  }, [])
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? 'var(--dark3)' : 'var(--dark3)',
          border: `1px solid ${t.type === 'error' ? '#E53935' : 'var(--gold-dark)'}`,
          color: 'var(--text-primary)', padding: '12px 24px', borderRadius: 12, fontSize: 14,
          fontWeight: 600, whiteSpace: 'nowrap', animation: 'fadeInUp 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>{t.msg}</div>
      ))}
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 420 }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  if (!open) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.2s ease'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--dark2)', border: '1px solid var(--gold-dark)', borderRadius: 18,
        padding: 28, width: '100%', maxWidth: width, animation: 'fadeInUp 0.25s ease',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {title && <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)', fontSize: 20, marginBottom: 20, textAlign: 'center' }}>{title}</h3>}
        {children}
      </div>
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--gold)', marginBottom: 3 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────
export function Divider({ style }) {
  return <div style={{ borderTop: '1px solid var(--dark4)', margin: '16px 0', ...style }} />
}

// ─── Loading Spinner ─────────────────────────────────────────────────
export function Spinner({ size = 24 }) {
  return (
    <div style={{ width: size, height: size, border: `2px solid var(--dark5)`, borderTop: `2px solid var(--gold)`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
  )
}

// ─── Status Dot ──────────────────────────────────────────────────────
export function StatusDot({ available }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12,
      color: available ? '#66BB6A' : '#EF5350',
      background: available ? 'rgba(76,175,80,0.12)' : 'rgba(229,57,53,0.12)',
      padding: '3px 10px', borderRadius: 20
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: available ? '#66BB6A' : '#EF5350', animation: available ? 'pulse 2s infinite' : 'none' }} />
      {available ? 'متاح' : 'مشغول'}
    </span>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13 }}>{subtitle}</div>}
    </div>
  )
}
