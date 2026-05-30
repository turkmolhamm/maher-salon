import React, { useState, useEffect } from 'react'
import { BARBERS, DAY_KEYS, DAY_NAMES, DAY_EN } from '../data/store.js'
import { getSchedule, saveScheduleBarber } from '../data/firebase.js'
import { Card, Badge, GoldBtn, SectionHeader, Modal, toast } from '../components/UI.jsx'

const ALL_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00']

export default function SchedulePage({ isAdmin }) {
  const [activeBarber, setActiveBarber] = useState('maher')
  const [schedule, setSchedule]         = useState(null)
  const [editDay, setEditDay]           = useState(null)
  const [tempSlots, setTempSlots]       = useState([])
  const [saving, setSaving]             = useState(false)

  useEffect(() => {
    getSchedule().then(setSchedule)
  }, [])

  async function toggleDayOpen(dayKey) {
    if (!isAdmin) { toast('🔒 تحتاج صلاحيات الإدارة', 'error'); return }
    const current = schedule[activeBarber][dayKey]
    const updated = { ...schedule, [activeBarber]: { ...schedule[activeBarber], [dayKey]: { ...current, open: !current.open } } }
    setSchedule(updated)
    await saveScheduleBarber(activeBarber, updated[activeBarber])
    toast(`${!current.open ? '✅ تم فتح' : '❌ تم إغلاق'} يوم ${DAY_NAMES[dayKey]}`)
  }

  function openEdit(dayKey) {
    if (!isAdmin) return
    setTempSlots([...schedule[activeBarber][dayKey].slots])
    setEditDay(dayKey)
  }

  async function saveDay() {
    setSaving(true)
    const updated = { ...schedule, [activeBarber]: { ...schedule[activeBarber], [editDay]: { open: true, slots: tempSlots.sort() } } }
    setSchedule(updated)
    await saveScheduleBarber(activeBarber, updated[activeBarber])
    setEditDay(null)
    setSaving(false)
    toast(`✅ تم حفظ جدول ${DAY_NAMES[editDay]}`)
  }

  if (!schedule) return <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>⏳ جاري التحميل...</div>

  return (
    <div style={{ padding:20, animation:'fadeInUp 0.35s ease' }}>
      <SectionHeader title="إدارة الجدول" subtitle="Manage Schedule — أوقات الحلاقين" />

      {!isAdmin && (
        <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid var(--gold-dark)', borderRadius:10, padding:'10px 14px', fontSize:12, color:'var(--gold)', marginBottom:16 }}>
          👁 وضع العرض فقط — ادخل كمدير لتعديل الجدول
        </div>
      )}

      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        {Object.values(BARBERS).map(b => (
          <button key={b.id} onClick={() => setActiveBarber(b.id)} style={{
            flex:1, padding:'10px 16px', borderRadius:10, cursor:'pointer',
            border:`1px solid ${activeBarber===b.id ? b.color : 'var(--dark5)'}`,
            background: activeBarber===b.id ? `${b.color}18` : 'var(--dark2)',
            color: activeBarber===b.id ? b.color : 'var(--text-muted)',
            fontFamily:'Cairo,sans-serif', fontSize:14, fontWeight:700, transition:'all 0.2s'
          }}>{b.nameAr} | {b.nameEn}</button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {DAY_KEYS.map(dayKey => {
          const dayData = schedule[activeBarber]?.[dayKey] || { open:false, slots:[] }
          return (
            <Card key={dayKey} style={{ overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom: dayData.open ? '1px solid var(--dark4)' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{DAY_NAMES[dayKey]}</div>
                  <div style={{ fontSize:11, color:'var(--text-dim)' }}>{DAY_EN[dayKey]}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {dayData.open && <span style={{ fontSize:11, color:'var(--text-dim)' }}>{dayData.slots.length} وقت</span>}
                  <Badge color={dayData.open ? 'green' : 'red'}>{dayData.open ? '✓ مفتوح' : '✗ مغلق'}</Badge>
                  {isAdmin && (
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => toggleDayOpen(dayKey)} style={{ fontSize:11, padding:'5px 10px', background:'var(--dark4)', border:'none', borderRadius:6, color:'var(--text-muted)', cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>
                        {dayData.open ? 'أغلق' : 'افتح'}
                      </button>
                      {dayData.open && (
                        <button onClick={() => openEdit(dayKey)} style={{ fontSize:11, padding:'5px 10px', background:'var(--gold-dark)', border:'none', borderRadius:6, color:'#fff', cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>تعديل</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {dayData.open && dayData.slots.length > 0 && (
                <div style={{ padding:'10px 16px', display:'flex', flexWrap:'wrap', gap:6 }}>
                  {dayData.slots.map(slot => (
                    <span key={slot} style={{ fontSize:12, padding:'4px 10px', borderRadius:6, background:'rgba(76,175,80,0.1)', color:'#66BB6A', border:'1px solid rgba(76,175,80,0.3)' }}>{slot}</span>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Modal open={!!editDay} onClose={() => setEditDay(null)} title={`تعديل ${editDay ? DAY_NAMES[editDay] : ''}`} width={460}>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:13, color:'var(--text-muted)' }}>{tempSlots.length} وقت محدد</span>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setTempSlots([...ALL_SLOTS])} style={{ fontSize:11, padding:'4px 10px', background:'var(--dark4)', border:'none', borderRadius:6, color:'var(--text-muted)', cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>اختر الكل</button>
              <button onClick={() => setTempSlots([])} style={{ fontSize:11, padding:'4px 10px', background:'var(--dark4)', border:'none', borderRadius:6, color:'var(--text-muted)', cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>امسح الكل</button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, maxHeight:280, overflowY:'auto' }}>
            {ALL_SLOTS.map(slot => {
              const sel = tempSlots.includes(slot)
              return (
                <button key={slot} onClick={() => setTempSlots(p => sel ? p.filter(s=>s!==slot) : [...p,slot].sort())}
                  style={{ padding:'8px 4px', borderRadius:7, fontSize:12, cursor:'pointer', transition:'all 0.15s', fontFamily:'Cairo,sans-serif',
                    background: sel ? 'var(--gold-dark)' : 'var(--dark3)',
                    border:`1px solid ${sel ? 'var(--gold)' : 'var(--dark5)'}`,
                    color: sel ? '#fff' : 'var(--text-muted)', fontWeight: sel ? 700 : 400
                  }}>{slot}</button>
              )
            })}
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:16 }}>
          <button onClick={() => setEditDay(null)} style={{ flex:1, background:'var(--dark4)', color:'var(--text-muted)', border:'none', padding:12, borderRadius:9, cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>إلغاء</button>
          <GoldBtn onClick={saveDay} disabled={saving} style={{ flex:1 }}>{saving ? '...' : 'حفظ ✓'}</GoldBtn>
        </div>
      </Modal>
    </div>
  )
}
