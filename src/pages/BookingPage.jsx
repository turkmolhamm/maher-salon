import React, { useState, useEffect } from 'react'
import { SERVICES, BARBERS } from '../data/store.js'
import { db, bookingsCol, customersCol, addItem, getAll, requestNotificationPermission } from '../data/firebase.js'
import { GoldBtn, Input, Select, Card, Badge, StatusDot, SectionHeader, Modal, toast } from '../components/UI.jsx'

function getDayKey(dateStr) {
  return ['sun','mon','tue','wed','thu','fri','sat'][new Date(dateStr).getDay()]
}

export default function BookingPage() {
  const [barber, setBarber]     = useState('maher')
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [service, setService]   = useState('')
  const [date, setDate]         = useState(today())
  const [time, setTime]         = useState('')
  const [schedule, setSchedule] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [lastBooking, setLastBooking] = useState(null)
  const [loading, setLoading]   = useState(false)
const [pushEnabled, setPushEnabled] = useState(false)
const [pushLoading, setPushLoading] = useState(false)

useEffect(() => {
  if (Notification.permission === 'granted') setPushEnabled(true)
}, [])

async function enablePush() {
  setPushLoading(true)
  const token = await requestNotificationPermission()
  if (token) {
    setPushEnabled(true)
    toast('✅ تم تفعيل الإشعارات!')
  } else {
    toast('❌ لم يتم السماح بالإشعارات', 'error')
  }
  setPushLoading(false)
}

function today() { return new Date().toISOString().split('T')[0] }
  function today() { return new Date().toISOString().split('T')[0] }

  // Load schedule from Firebase
  useEffect(() => {
    import('../data/firebase.js').then(async ({ getSchedule }) => {
      const s = await getSchedule()
      setSchedule(s)
    })
  }, [])

  // Load booked slots for selected barber+date
  useEffect(() => {
    if (!date || !barber) return
    getAll(bookingsCol).then(all => {
      const taken = all
        .filter(b => b.barber === barber && b.date === date && b.status !== 'cancelled')
        .map(b => b.time)
      setBookedSlots(taken)
    })
  }, [barber, date])

  const barberInfo   = BARBERS[barber]
  const dayKey       = getDayKey(date)
  const daySchedule  = schedule?.[barber]?.[dayKey] || { open: false, slots: [] }
  const availCount   = daySchedule.slots.filter(s => !bookedSlots.includes(s)).length

  const serviceOptions = [
    { value: '', label: 'اختر الخدمة — Choose Service' },
    ...SERVICES.map(s => ({ value: s.id, label: `${s.ar}  |  ${s.en}` }))
  ]

  const maxDate = (() => { const d = new Date(); d.setDate(d.getDate()+30); return d.toISOString().split('T')[0] })()

  async function handleConfirm() {
    setLoading(true)
    try {
      const booking = {
        customerName:  name.trim(),
        customerPhone: phone.trim(),
        barber, service, date, time,
        status: 'confirmed',
      }
      const id = await addItem(bookingsCol, booking)

      // Add/update customer record
      const allCustomers = await getAll(customersCol)
      const existing = allCustomers.find(c => c.phone === phone.trim())
      if (existing) {
        import('../data/firebase.js').then(({ updateItem, customersCol: cc }) => {
          updateItem(cc, existing.id, { visits: (existing.visits||0) + 1 })
        })
      } else {
        await addItem(customersCol, {
          name: name.trim(), phone: phone.trim(),
          preferredBarber: barber, visits: 1, vip: false,
          joinDate: today(), notes: ''
        })
      }

      setLastBooking({ ...booking, id })
      setBookedSlots(p => [...p, time])
      setConfirmOpen(false)
      setSuccessOpen(true)
      setName(''); setPhone(''); setService(''); setTime('')
      toast('✅ تم الحجز بنجاح!')
    } catch (e) {
      toast('❌ حدث خطأ، حاول مرة ثانية', 'error')
    }
    setLoading(false)
  }

  function handleBook() {
    if (!name.trim() || !phone.trim() || !service || !time) {
      toast('⚠️ الرجاء إكمال جميع الحقول', 'error'); return
    }
    if (phone.replace(/\D/g,'').length < 9) {
      toast('⚠️ رقم الهاتف غير صحيح', 'error'); return
    }
    setConfirmOpen(true)
  }

  return (
    <div style={{ padding:20, animation:'fadeInUp 0.35s ease' }}>
      <SectionHeader title="احجز موعدك" subtitle="Book Your Appointment" />

      {/* Barber cards */}
      {!pushEnabled && (
  <Card style={{ padding:16, marginBottom:20, borderColor:'var(--gold-dark)', background:'var(--gold-subtle)' }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--gold)', marginBottom:3 }}>
          🔔 فعّل الإشعارات على جهازك
        </div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>
          عشان يوصلك إشعار لما يكون في عرض أو موعد جديد
        </div>
      </div>
      <GoldBtn sm onClick={enablePush} disabled={pushLoading}>
        {pushLoading ? '...' : 'تفعيل 🔔'}
      </GoldBtn>
    </div>
  </Card>
)}

{/* Barber cards */}
<div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
        {Object.values(BARBERS).map(b => (
          <BarberCard key={b.id} barber={b} selected={barber===b.id}
            onSelect={() => { setBarber(b.id); setTime('') }} />
        ))}
      </div>

      <Input label="اسمك الكريم | Your Name" value={name} onChange={setName} placeholder="أدخل اسمك" required icon="👤" />
      <Input label="رقم الهاتف | Phone" value={phone} onChange={setPhone} placeholder="+962 7X XXX XXXX" type="tel" dir="ltr" required icon="📱" />
      <Select label="الخدمة | Service" value={service} onChange={setService} options={serviceOptions} required />

      {/* Date */}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontSize:12, color:'var(--text-muted)', marginBottom:6, fontWeight:500 }}>
          التاريخ | Date <span style={{ color:'var(--gold)' }}>*</span>
        </label>
        <input type="date" value={date} min={today()} max={maxDate}
          onChange={e => { setDate(e.target.value); setTime('') }}
          style={{ width:'100%', background:'var(--dark3)', border:'1px solid var(--dark5)',
                   color:'var(--text-primary)', padding:'11px 14px', borderRadius:9, fontSize:13, outline:'none' }}
          onFocus={e => e.target.style.borderColor='var(--gold-dark)'}
          onBlur={e  => e.target.style.borderColor='var(--dark5)'}
        />
      </div>

      {/* Time slots */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <label style={{ fontSize:12, color:'var(--text-muted)', fontWeight:500 }}>
            الوقت | Time <span style={{ color:'var(--gold)' }}>*</span>
          </label>
          {daySchedule.open && <span style={{ fontSize:11, color:'var(--text-dim)' }}>{availCount} وقت متاح</span>}
        </div>

        {!schedule ? (
          <div style={{ textAlign:'center', padding:20, color:'var(--text-muted)', fontSize:13 }}>جاري التحميل...</div>
        ) : !daySchedule.open ? (
          <div style={{ background:'rgba(229,57,53,0.08)', border:'1px solid rgba(229,57,53,0.2)', borderRadius:10, padding:'14px 16px', textAlign:'center' }}>
            <span style={{ fontSize:13, color:'#EF5350' }}>❌ {barberInfo.nameAr} غير متاح هذا اليوم</span>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {daySchedule.slots.map(slot => {
              const booked   = bookedSlots.includes(slot)
              const selected = time === slot
              return (
                <button key={slot} disabled={booked} onClick={() => setTime(slot)} style={{
                  padding:'10px 4px', borderRadius:8, fontSize:13, textAlign:'center',
                  cursor: booked ? 'not-allowed' : 'pointer', transition:'all 0.2s',
                  fontFamily:'Cairo,sans-serif', fontWeight: selected ? 700 : 400,
                  background: selected ? 'var(--gold-dark)' : booked ? 'var(--dark)' : 'var(--dark3)',
                  border:`1px solid ${selected ? 'var(--gold)' : booked ? 'var(--dark4)' : 'var(--dark5)'}`,
                  color: selected ? '#fff' : booked ? 'var(--dark5)' : 'var(--text-muted)',
                  textDecoration: booked ? 'line-through' : 'none', opacity: booked ? 0.35 : 1
                }}>{slot}</button>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      {service && time && (
        <Card style={{ padding:'14px 16px', marginBottom:16, background:'var(--gold-subtle)', borderColor:'var(--gold-dark)' }}>
          <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>ملخص الحجز | Summary</div>
          {[
            { label:'الحلاق',  value:<span style={{ color:barberInfo.color, fontWeight:600 }}>{barberInfo.nameAr} | {barberInfo.nameEn}</span> },
            { label:'الخدمة',  value: SERVICES.find(s=>s.id===service)?.ar },
            { label:'التاريخ', value:`${date}  ·  ${time}` },
          ].map(r => (
            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
              <span style={{ color:'var(--text-muted)' }}>{r.label}</span>
              <span>{r.value}</span>
            </div>
          ))}
        </Card>
      )}

      <GoldBtn onClick={handleBook} style={{ width:'100%' }}>✅ تأكيد الحجز | Confirm</GoldBtn>

      {/* Confirm modal */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="تأكيد الحجز" width={360}>
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>✂️</div>
          <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.9 }}>
            موعد لـ <strong style={{ color:'var(--text-primary)' }}>{name}</strong><br/>
            مع <strong style={{ color:barberInfo.color }}>{barberInfo.nameAr}</strong><br/>
            {date} الساعة {time}
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setConfirmOpen(false)} style={{ flex:1, background:'var(--dark4)', color:'var(--text-muted)', border:'none', padding:12, borderRadius:9, cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>إلغاء</button>
          <GoldBtn onClick={handleConfirm} disabled={loading} style={{ flex:1 }}>{loading ? '...' : 'تأكيد ✓'}</GoldBtn>
        </div>
      </Modal>

      {/* Success modal */}
      <Modal open={successOpen} onClose={() => setSuccessOpen(false)} title="" width={360}>
        <div style={{ textAlign:'center', padding:'10px 0' }}>
          <div style={{ fontSize:56, marginBottom:12 }}>🎉</div>
          <h3 style={{ fontFamily:'Playfair Display,serif', color:'var(--gold)', fontSize:20, marginBottom:6 }}>تم الحجز بنجاح!</h3>
          <p style={{ fontSize:13, color:'var(--text-muted)' }}>Booking Confirmed Successfully</p>
          {lastBooking && (
            <div style={{ background:'var(--dark3)', borderRadius:10, padding:'12px 16px', marginTop:16, textAlign:'right' }}>
              {[
                { k:'الاسم',     v: lastBooking.customerName },
                { k:'الوقت',     v:`${lastBooking.date} — ${lastBooking.time}` },
                { k:'رقم الحجز', v:<span style={{ fontFamily:'monospace', color:'var(--gold)' }}>#{lastBooking.id?.slice(0,8).toUpperCase()}</span> },
              ].map(r => (
                <div key={r.k} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:4 }}>
                  <span style={{ color:'var(--text-muted)' }}>{r.k}</span><span>{r.v}</span>
                </div>
              ))}
            </div>
          )}
          <GoldBtn onClick={() => {
            setSuccessOpen(false)
            // اطلب إذن الإشعارات بعد الحجز
            if (Notification.permission === 'default') {
              requestNotificationPermission().then(token => {
                if (token) toast('🔔 تم تفعيل الإشعارات! رح يوصلك أي عروض جديدة')
              })
            }
          }} style={{ width:'100%', marginTop:20 }}>رائع! 👍</GoldBtn>
        </div>
      </Modal>
    </div>
  )
}

function BarberCard({ barber, selected, onSelect }) {
  return (
    <div onClick={onSelect} style={{
      background: selected ? 'var(--dark3)' : 'var(--dark2)',
      border:`2px solid ${selected ? barber.color : 'var(--dark4)'}`,
      borderRadius:14, padding:16, cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden'
    }}>
      {selected && <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${barber.color}66,${barber.color})` }} />}
      <div style={{ width:56, height:56, borderRadius:'50%', margin:'0 auto 10px', background:`linear-gradient(135deg,${barber.color}44,${barber.color}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#fff' }}>{barber.avatar}</div>
      <div style={{ textAlign:'center', fontWeight:700, fontSize:15, marginBottom:2 }}>{barber.nameAr}</div>
      <div style={{ textAlign:'center', fontSize:12, color:barber.color, marginBottom:6 }}>{barber.nameEn}</div>
      <div style={{ textAlign:'center', fontSize:11, color:'var(--text-dim)', marginBottom:8 }}>{barber.title}</div>
      <div style={{ display:'flex', justifyContent:'center' }}><StatusDot available={true} /></div>
    </div>
  )
}
