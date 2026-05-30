import React, { useState } from 'react'
import { store } from './data/store.js'
import Header from './components/Header.jsx'
import { ToastContainer } from './components/UI.jsx'
import BookingPage from './pages/BookingPage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

const IgIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#E1306C" strokeWidth="2"/>
    <circle cx="12" cy="12" r="5" stroke="#E1306C" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="#E1306C"/>
  </svg>
)
const FbIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
)
const WaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function App() {
  const [activeTab, setActiveTab] = useState('booking')
  const [isAdmin, setIsAdmin]     = useState(() => store.isAdmin())

  const pages = {
    booking:       <BookingPage />,
    schedule:      <SchedulePage isAdmin={isAdmin} />,
    customers:     <CustomersPage isAdmin={isAdmin} />,
    notifications: <NotificationsPage isAdmin={isAdmin} />,
    dashboard:     <DashboardPage isAdmin={isAdmin} />,
  }

  const socials = [
    { href:'https://www.instagram.com/maher.salon.jo/',                    icon:<IgIcon />, label:'Instagram' },
    { href:'https://www.facebook.com/profile.php?id=100064496874456',      icon:<FbIcon />, label:'Facebook'  },
    { href:'https://wa.me/962789998007',                                   icon:<WaIcon />, label:'واتساب'    },
    { href:'tel:065859879', icon:(
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
        </svg>
      ), label:'06-5859879' },
  ]

  return (
    <div style={{ maxWidth:900, margin:'0 auto', minHeight:'100vh' }} dir="rtl">
      <Header activeTab={activeTab} setActiveTab={setActiveTab}
              isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main key={activeTab}>{pages[activeTab]}</main>
      <ToastContainer />

      {/* ── Footer ── */}
      <footer style={{ textAlign:'center', padding:'28px 16px 40px',
                       borderTop:'1px solid var(--dark4)', marginTop:20, background:'var(--dark)' }}>
        <div style={{ background:'#fff', display:'inline-block', borderRadius:12, padding:6,
                      border:'1px solid var(--gold-dark)', marginBottom:12 }}>
          <img src="/logo.jpg" alt="Salon Maher"
            style={{ width:48, height:48, borderRadius:8, objectFit:'contain', display:'block' }} />
        </div>

        <div style={{ fontFamily:'Playfair Display,serif', fontSize:17, color:'var(--gold)', letterSpacing:2, marginBottom:4 }}>
          SALON MAHER
        </div>
        <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:6 }}>صالون ماهر</div>
        <div style={{ fontSize:12, color:'var(--text-dim)', marginBottom:18 }}>
          📍 الدوار السابع · شارع يزيد الأسدي · بجانب مطعم سماور (الجمعية الشركسية) ·
        </div>

        {/* Social icons */}
        <div style={{ display:'flex', justifyContent:'center', gap:18, marginBottom:16 }}>
          {socials.map(s=>(
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                       textDecoration:'none', color:'var(--text-muted)', fontSize:11, transition:'color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--gold)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}>
              {s.icon}
              <span>{s.label}</span>
            </a>
          ))}
        </div>

        <div style={{ fontSize:11, color:'var(--text-dim)', opacity:0.4 }}>
          © 2025 Salon Maher · All rights reserved
        </div>
      </footer>
    </div>
  )
}
