import React, { useState } from 'react'
import { store } from '../data/store.js'
import { Modal, Input, GoldBtn, toast } from './UI.jsx'

export default function Header({ activeTab, setActiveTab, isAdmin, setIsAdmin }) {
  const [pinModal, setPinModal] = useState(false)
  const [pin, setPin] = useState('')

  function handleAdminToggle() {
    if (isAdmin) { setIsAdmin(false); store.setAdmin(false); toast('🔒 تم الخروج من وضع الإدارة') }
    else setPinModal(true)
  }

  function submitPin() {
    if (pin === store.getAdminPin()) {
      setIsAdmin(true); store.setAdmin(true)
      setPinModal(false); setPin('')
      toast('🔓 مرحباً! وضع الإدارة مفعّل')
    } else {
      toast('❌ رقم PIN غير صحيح', 'error')
      setPin('')
    }
  }

 const tabs = [
  { id: 'booking',       icon: '📅', ar: 'حجز موعد' },
  { id: 'schedule',      icon: '🗓',  ar: 'الجدول'   },
  ...(isAdmin ? [{ id: 'customers', icon: '👥', ar: 'الزبائن' }] : []),
  ...(isAdmin ? [{ id: 'notifications', icon: '🔔', ar: 'إشعارات' }] : []),
  ...(isAdmin ? [{ id: 'dashboard',     icon: '📊', ar: 'التحكم'    }] : []),
]

  /* ── Social icon SVGs ── */
  const SocialLink = ({ href, title, children }) => (
    <a href={href} target="_blank" rel="noreferrer" title={title}
      style={{ display:'flex', alignItems:'center', justifyContent:'center',
               width:30, height:30, borderRadius:8,
               background:'rgba(255,255,255,0.12)', textDecoration:'none',
               transition:'background 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.22)'}
      onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}>
      {children}
    </a>
  )

  const IgIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="2"/>
      <circle cx="12" cy="12" r="5" stroke="#E1306C" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/>
    </svg>
  )

  const FbIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )

  const WaIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )

  const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )

  return (
    <>
      <header style={{ background:'var(--dark)', borderBottom:'1px solid var(--gold-dark)', position:'sticky', top:0, zIndex:100 }}>

        {/* ── Hero banner ── */}
        <div style={{ position:'relative', height:160, overflow:'hidden', background:'#111' }}>

          {/* Salon photo — object-position tuned so interior fills frame */}
          <img src="/salon-interior.jpg" alt="Maher Salon Interior"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                     objectFit:'cover', objectPosition:'center 69%',
                     opacity:0.55, display:'block' }} />

          {/* Dark gradient so text is always readable */}
          <div style={{ position:'absolute', inset:0,
                        background:'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.72) 100%)' }} />

          {/* Content row */}
          <div style={{ position:'absolute', inset:0, display:'flex',
                        alignItems:'center', justifyContent:'space-between', padding:'0 18px' }}>

            {/* Left: logo + info */}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {/* Logo on white bg so it pops */}
              <div style={{ background:'#fff', borderRadius:12, padding:4,
                            border:'1.5px solid var(--gold-dark)', flexShrink:0 }}>
                <img src="/logo.jpg" alt="Salon Maher Logo"
                  style={{ width:52, height:52, borderRadius:8, objectFit:'contain', display:'block' }} />
              </div>

              <div>
                <div style={{ fontFamily:'Playfair Display, serif', fontSize:20, fontWeight:700,
                               color:'#F0D080', letterSpacing:2, lineHeight:1.2, textShadow:'0 1px 4px rgba(0,0,0,0.6)' }}>
                  SALON MAHER
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', marginTop:2 }}>
                 📍 الدوار السابع · شارع يزيد الأسدي · بجانب مطعم سماور (الجمعية الشركسية) ·
                </div>

                {/* Social icons */}
                <div style={{ display:'flex', gap:6, marginTop:7 }}>
                  <SocialLink href="https://www.instagram.com/maher.salon.jo/" title="Instagram">
                    <IgIcon />
                  </SocialLink>
                  <SocialLink href="https://www.facebook.com/profile.php?id=100064496874456" title="Facebook">
                    <FbIcon />
                  </SocialLink>
                  <SocialLink href="https://wa.me/962789998007" title="WhatsApp">
                    <WaIcon />
                  </SocialLink>
                  <SocialLink href="tel:065859879" title="اتصل بنا">
                    <PhoneIcon />
                  </SocialLink>
                </div>
              </div>
            </div>

            {/* Right: admin button */}
            <button onClick={handleAdminToggle} style={{
              background: isAdmin ? 'var(--gold-dark)' : 'rgba(0,0,0,0.55)',
              border:`1px solid ${isAdmin ? 'var(--gold)' : 'rgba(255,255,255,0.25)'}`,
              color: isAdmin ? 'var(--gold-light)' : 'rgba(255,255,255,0.8)',
              padding:'7px 13px', borderRadius:8, fontSize:12, fontWeight:600,
              cursor:'pointer', fontFamily:'Cairo, sans-serif', transition:'all 0.2s',
              backdropFilter:'blur(6px)', alignSelf:'flex-start', marginTop:12
            }}>
              {isAdmin ? '🔓 إدارة' : '🔒 دخول'}
            </button>
          </div>
        </div>

        {/* ── Nav tabs ── */}
        <nav style={{ display:'flex', overflowX:'auto', borderTop:'1px solid var(--dark4)', background:'var(--dark)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                flex:1, minWidth:64, padding:'10px 6px', textAlign:'center',
                background:'none', border:'none', cursor:'pointer',
                borderBottom:`2px solid ${activeTab === t.id ? 'var(--gold)' : 'transparent'}`,
                color: activeTab === t.id ? 'var(--gold)' : 'var(--text-muted)',
                transition:'all 0.2s', whiteSpace:'nowrap', fontFamily:'Cairo, sans-serif'
              }}>
              <div style={{ fontSize:15 }}>{t.icon}</div>
              <div style={{ fontSize:10, fontWeight:600, marginTop:2 }}>{t.ar}</div>
            </button>
          ))}
        </nav>
      </header>

      {/* ── PIN Modal ── */}
      <Modal open={pinModal} onClose={() => { setPinModal(false); setPin('') }} title="دخول الإدارة" width={340}>
        <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16, textAlign:'center' }}>
          أدخل رقم PIN للدخول إلى وضع الإدارة
        </p>
        <Input label="رقم PIN" value={pin} onChange={setPin} type="password" placeholder="••••" required />
        <div style={{ fontSize:11, color:'var(--text-dim)', marginBottom:16, textAlign:'center' }}>
          رقم PIN الافتراضي: 1234
        </div>
        <GoldBtn onClick={submitPin} style={{ width:'100%' }}>دخول ←</GoldBtn>
      </Modal>
    </>
  )
}
