import React, { useState, useEffect } from 'react'
import { BARBERS } from '../data/store.js'
import { notificationsCol, customersCol, listenCol, addItem, requestNotificationPermission, onForegroundMessage } from '../data/firebase.js'
import { Card, Badge, GoldBtn, SectionHeader, Divider, toast, EmptyState } from '../components/UI.jsx'

export default function NotificationsPage({ isAdmin }) {
  const [notifications, setNotifications] = useState([])
  const [customers, setCustomers]         = useState([])
  const [message, setMessage]             = useState('')
  const [recipient, setRecipient]         = useState('all')
  const [loading, setLoading]             = useState(false)
  const [pushEnabled, setPushEnabled]     = useState(false)
  const [pushLoading, setPushLoading]     = useState(false)

  useEffect(() => {
    const u1 = listenCol(notificationsCol, data => setNotifications(data))
    const u2 = listenCol(customersCol,     data => setCustomers(data))

    // تحقق إذا الإشعارات مفعلة مسبقاً
    if (Notification.permission === 'granted') setPushEnabled(true)

    // استمع للإشعارات لما يكون التطبيق مفتوح
    const unsubMsg = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {}
      toast(`🔔 ${title || 'صالون ماهر'}: ${body || ''}`)
    })

    return () => { u1(); u2(); if (unsubMsg) unsubMsg() }
  }, [])

  async function enablePush() {
    setPushLoading(true)
    const token = await requestNotificationPermission()
    if (token) {
      setPushEnabled(true)
      toast('✅ تم تفعيل الإشعارات على هذا الجهاز!')
    } else {
      toast('❌ لم يتم السماح بالإشعارات', 'error')
    }
    setPushLoading(false)
  }

  const recipientOptions = [
    { id:'all',    label:'كل الزبائن',   icon:'📱', count: customers.length },
    { id:'maher',  label:'زبائن ماهر',   icon:'👤', count: customers.filter(c=>c.preferredBarber==='maher').length },
    { id:'mulham', label:'زبائن مُلهَم', icon:'👤', count: customers.filter(c=>c.preferredBarber==='mulham').length },
  ]

  async function send() {
    if (!message.trim()) { toast('⚠️ اكتب الرسالة أولاً', 'error'); return }
    setLoading(true)
    const rec = recipientOptions.find(r=>r.id===recipient)
    await addItem(notificationsCol, {
      message: message.trim(),
      recipients: recipient,
      recipientLabel: rec.label,
      count: rec.count,
      sentAt: new Date().toISOString()
    })
    setMessage('')
    toast(`🚀 تم إرسال الإشعار لـ ${rec.count} زبون!`)
    setLoading(false)
  }

  function formatDate(iso) {
    if (!iso) return ''
    const diff = Date.now() - new Date(iso).getTime()
    if (diff < 60000)    return 'الآن'
    if (diff < 3600000)  return `منذ ${Math.floor(diff/60000)} دقيقة`
    if (diff < 86400000) return `منذ ${Math.floor(diff/3600000)} ساعة`
    return `منذ ${Math.floor(diff/86400000)} يوم`
  }

  return (
    <div style={{ padding:20, animation:'fadeInUp 0.35s ease' }}>
      <SectionHeader title="الإشعارات | Notifications" subtitle="أرسل رسائل لزبائنك" />

      {/* ── بطاقة تفعيل الإشعارات للزبون ── */}
      {!pushEnabled && (
        <Card style={{ padding:16, marginBottom:16, borderColor:'var(--gold-dark)', background:'var(--gold-subtle)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
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

      {pushEnabled && (
        <Card style={{ padding:12, marginBottom:16, borderColor:'rgba(76,175,80,0.4)', background:'rgba(76,175,80,0.08)' }}>
          <div style={{ fontSize:13, color:'#66BB6A', textAlign:'center' }}>
            ✅ الإشعارات مفعّلة على هذا الجهاز
          </div>
        </Card>
      )}

      {/* ── إرسال رسالة (للأدمن فقط) ── */}
      <Card style={{ padding:20, marginBottom:20 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'var(--gold)', marginBottom:14 }}>📢 رسالة جديدة</div>

        {!isAdmin && (
          <div style={{ background:'rgba(201,168,76,0.08)', border:'1px solid var(--gold-dark)', borderRadius:9, padding:'10px 14px', fontSize:12, color:'var(--gold)', marginBottom:14 }}>
            🔒 تحتاج صلاحيات الإدارة لإرسال الإشعارات
          </div>
        )}

        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>نص الرسالة *</label>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} disabled={!isAdmin}
            placeholder="اكتب رسالتك هنا... مثال: الصالون مسكر هذا الأسبوع بسبب السفر 🌍"
            rows={3}
            style={{ width:'100%', background:'var(--dark3)', border:'1px solid var(--dark5)', color:'var(--text-primary)', padding:'12px 14px', borderRadius:9, fontSize:13, resize:'vertical', fontFamily:'Cairo,sans-serif', lineHeight:1.7, outline:'none', opacity:isAdmin?1:0.5 }}
            onFocus={e=>e.target.style.borderColor='var(--gold-dark)'}
            onBlur={e=>e.target.style.borderColor='var(--dark5)'}
          />
          <div style={{ fontSize:11, color:'var(--text-dim)', marginTop:4, textAlign:'left' }}>{message.length} حرف</div>
        </div>

        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:12, color:'var(--text-muted)', marginBottom:8 }}>إرسال إلى</label>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {recipientOptions.map(r=>(
              <button key={r.id} onClick={() => isAdmin && setRecipient(r.id)} style={{
                padding:'10px 8px', borderRadius:9, cursor:isAdmin?'pointer':'not-allowed',
                border:`1px solid ${recipient===r.id?'var(--gold-dark)':'var(--dark5)'}`,
                background: recipient===r.id?'var(--gold-subtle)':'var(--dark3)',
                color: recipient===r.id?'var(--gold)':'var(--text-muted)',
                transition:'all 0.2s', opacity:isAdmin?1:0.5,
                fontFamily:'Cairo,sans-serif', textAlign:'center'
              }}>
                <div style={{ fontSize:16, marginBottom:3 }}>{r.icon}</div>
                <div style={{ fontSize:11, fontWeight:600 }}>{r.label}</div>
                <div style={{ fontSize:10, color:'var(--text-dim)', marginTop:2 }}>{r.count} زبون</div>
              </button>
            ))}
          </div>
        </div>

        <GoldBtn onClick={send} disabled={!isAdmin || loading} style={{ width:'100%' }}>
          {loading ? '⏳ جاري الإرسال...' : '🚀 إرسال الإشعار الآن'}
        </GoldBtn>
      </Card>

      <Divider />
      <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:12 }}>سجل الإشعارات السابقة</div>

      {notifications.length===0
        ? <EmptyState icon="🔔" title="لا توجد إشعارات سابقة" subtitle="ابدأ بإرسال أول إشعار" />
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {notifications.map(n => (
              <Card key={n.id} style={{ padding:'14px 16px' }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ fontSize:22, marginTop:1 }}>📢</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, color:'var(--text-primary)', lineHeight:1.7, marginBottom:8 }}>{n.message}</p>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                      <Badge color="gray">📱 {n.recipientLabel}</Badge>
                      <Badge color="gold">{n.count} زبون</Badge>
                      <span style={{ fontSize:11, color:'var(--text-dim)' }}>{formatDate(n.sentAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      }
    </div>
  )
}
