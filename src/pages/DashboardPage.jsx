import React, { useState, useEffect } from 'react'
import { SERVICES, BARBERS } from '../data/store.js'
import { bookingsCol, customersCol, listenCol, updateItem } from '../data/firebase.js'
import { Card, Badge, GoldBtn, DangerBtn, SectionHeader, Modal, toast, EmptyState } from '../components/UI.jsx'

export default function DashboardPage({ isAdmin }) {
  const [bookings, setBookings]   = useState([])
  const [customers, setCustomers] = useState([])
  const [filter, setFilter]       = useState('today')
  const [viewBooking, setViewBooking] = useState(null)
  const [loading, setLoading]     = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const unsub1 = listenCol(bookingsCol,  data => { setBookings(data);  setLoading(false) })
    const unsub2 = listenCol(customersCol, data => setCustomers(data))
    return () => { unsub1(); unsub2() }
  }, [])

  const todayB  = bookings.filter(b => b.date===today && b.status!=='cancelled')
  const maherT  = todayB.filter(b=>b.barber==='maher').length
  const mulhamT = todayB.filter(b=>b.barber==='mulham').length

  const display = (() => {
    let list
    if (filter==='today')    list = bookings.filter(b=>b.date===today)
    else if (filter==='upcoming') list = bookings.filter(b=>b.date>=today && b.status!=='cancelled')
    else list = bookings
    return [...list].sort((a,b)=>a.date?.localeCompare(b.date)||a.time?.localeCompare(b.time))
  })()

  async function cancelBooking(id) {
    if (!window.confirm('إلغاء هذا الحجز؟')) return
    await updateItem(bookingsCol, id, { status: 'cancelled' })
    setViewBooking(null)
    toast('🗑 تم إلغاء الحجز')
  }

  const getServiceName = sid => SERVICES.find(s=>s.id===sid)?.ar || sid

  const stats = [
    { label:'حجوزات اليوم',   value: todayB.length,      icon:'📅', color:'var(--gold)'         },
    { label:'إجمالي الزبائن', value: customers.length,    icon:'👥', color:'var(--mulham-color)' },
    { label:'ماهر — اليوم',   value: maherT,              icon:'✂',  color:'var(--maher-color)'  },
    { label:'مُلهَم — اليوم', value: mulhamT,             icon:'✂',  color:'var(--mulham-color)' },
  ]

  return (
    <div style={{ padding:20, animation:'fadeInUp 0.35s ease' }}>
      <SectionHeader title="لوحة التحكم | Dashboard" subtitle={`اليوم: ${today} · البيانات مباشرة 🔴`} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:22 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{s.label}</div>
                <div style={{ fontSize:30, fontWeight:700, fontFamily:'Playfair Display,serif', color:s.color, lineHeight:1 }}>{s.value}</div>
              </div>
              <div style={{ fontSize:22, opacity:0.3 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[{id:'today',label:'اليوم'},{id:'upcoming',label:'القادمة'},{id:'all',label:'الكل'}].map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)} style={{
            padding:'7px 16px', borderRadius:8, cursor:'pointer',
            background: filter===f.id ? 'var(--gold-dark)' : 'var(--dark3)',
            border:`1px solid ${filter===f.id ? 'var(--gold)' : 'var(--dark5)'}`,
            color: filter===f.id ? '#fff' : 'var(--text-muted)',
            fontFamily:'Cairo,sans-serif', fontSize:12, fontWeight:600, transition:'all 0.2s'
          }}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>⏳ جاري التحميل...</div>
      ) : display.length===0 ? (
        <EmptyState icon="📅" title="لا توجد حجوزات" subtitle="ما في حجوزات في هذا الفلتر" />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {display.map(b => {
            const barber    = BARBERS[b.barber]
            const cancelled = b.status==='cancelled'
            return (
              <Card key={b.id} style={{ padding:'12px 16px', opacity:cancelled?0.5:1, cursor: isAdmin?'pointer':'default' }}
                onClick={() => isAdmin && setViewBooking(b)} hover={isAdmin}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ background:'var(--dark4)', borderRadius:9, padding:'8px 12px', textAlign:'center', minWidth:64, flexShrink:0 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:'var(--gold)', fontFamily:'Playfair Display,serif' }}>{b.time}</div>
                    <div style={{ fontSize:10, color:'var(--text-dim)', marginTop:2 }}>{b.date}</div>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>
                      {isAdmin ? b.customerName : 'حجز مؤكد ✓'}
                    </div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>
                      {isAdmin ? getServiceName(b.service) : barber?.nameAr}
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                    <Badge color={b.barber==='maher'?'gold':'blue'}>{barber?.nameAr}</Badge>
                    {cancelled && <Badge color="red">ملغي</Badge>}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {viewBooking && isAdmin && (
        <Modal open={!!viewBooking} onClose={()=>setViewBooking(null)} title="تفاصيل الحجز" width={380}>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {[
              { label:'رقم الحجز', value:<span style={{ fontFamily:'monospace', color:'var(--gold)' }}>#{viewBooking.id?.slice(0,8).toUpperCase()}</span> },
              { label:'الزبون',    value: viewBooking.customerName },
              { label:'الهاتف',    value: viewBooking.customerPhone },
              { label:'الحلاق',    value:<span style={{ color:BARBERS[viewBooking.barber]?.color }}>{BARBERS[viewBooking.barber]?.nameAr}</span> },
              { label:'الخدمة',    value: getServiceName(viewBooking.service) },
              { label:'التاريخ',   value:`${viewBooking.date} — ${viewBooking.time}` },
              { label:'الحالة',    value:<Badge color={viewBooking.status==='cancelled'?'red':'green'}>{viewBooking.status==='cancelled'?'ملغي':'مؤكد ✓'}</Badge> },
            ].map(item=>(
              <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:13, padding:'10px 0', borderBottom:'1px solid var(--dark4)' }}>
                <span style={{ color:'var(--text-muted)' }}>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          {viewBooking.status!=='cancelled' && (
            <DangerBtn onClick={()=>cancelBooking(viewBooking.id)} style={{ width:'100%', marginTop:16 }}>
              🗑 إلغاء الحجز
            </DangerBtn>
          )}
        </Modal>
      )}
    </div>
  )
}
