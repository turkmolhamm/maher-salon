import React, { useState, useEffect } from 'react'
import { BARBERS } from '../data/store.js'
import { customersCol, listenCol, addItem, updateItem, deleteItem } from '../data/firebase.js'
import { Card, Badge, Avatar, GoldBtn, DangerBtn, Input, Select, Modal, SectionHeader, Divider, toast, EmptyState } from '../components/UI.jsx'

export default function CustomersPage({ isAdmin }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [addOpen, setAddOpen]     = useState(false)
  const [viewCustomer, setViewCustomer] = useState(null)
  const [form, setForm] = useState({ name:'', phone:'', preferredBarber:'maher', notes:'' })

  useEffect(() => {
    const unsub = listenCol(customersCol, data => { setCustomers(data); setLoading(false) })
    return unsub
  }, [])

  const filtered = customers.filter(c =>
    c.name?.includes(search) || c.phone?.includes(search)
  )

  async function addCustomer() {
    if (!form.name.trim() || !form.phone.trim()) { toast('⚠️ الاسم والهاتف مطلوبان', 'error'); return }
    await addItem(customersCol, { ...form, name:form.name.trim(), phone:form.phone.trim(), visits:0, vip:false, joinDate:new Date().toISOString().split('T')[0] })
    setAddOpen(false)
    setForm({ name:'', phone:'', preferredBarber:'maher', notes:'' })
    toast('✅ تم إضافة الزبون')
  }

  async function toggleVip(c) {
    await updateItem(customersCol, c.id, { vip: !c.vip })
    toast(c.vip ? '✓ تم إزالة VIP' : '👑 تم منح VIP')
    setViewCustomer(prev => prev ? { ...prev, vip: !prev.vip } : null)
  }

  async function deleteCustomer(id) {
    if (!window.confirm('حذف هذا الزبون؟')) return
    await deleteItem(customersCol, id)
    setViewCustomer(null)
    toast('🗑 تم حذف الزبون')
  }

  const barberOptions = Object.values(BARBERS).map(b => ({ value:b.id, label:`${b.nameAr} | ${b.nameEn}` }))

  return (
    <div style={{ padding:20, animation:'fadeInUp 0.35s ease' }}>
      <SectionHeader
        title="الزبائن | Clients"
        subtitle={`${customers.length} زبون مسجل`}
        action={isAdmin && <GoldBtn sm onClick={() => setAddOpen(true)}>+ إضافة</GoldBtn>}
      />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:18 }}>
        {[
          { label:'الكل',       value:customers.length,                                    color:'var(--text-primary)'  },
          { label:'زبائن ماهر', value:customers.filter(c=>c.preferredBarber==='maher').length,  color:'var(--maher-color)'   },
          { label:'زبائن مُلهَم',value:customers.filter(c=>c.preferredBarber==='mulham').length, color:'var(--mulham-color)'  },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--dark2)', border:'1px solid var(--dark4)', borderRadius:10, padding:'10px 14px', textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'Playfair Display,serif', color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ position:'relative', marginBottom:16 }}>
        <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:16, opacity:0.4 }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم أو الهاتف..."
          style={{ width:'100%', background:'var(--dark3)', border:'1px solid var(--dark5)', color:'var(--text-primary)', padding:'11px 40px 11px 14px', borderRadius:9, fontSize:13, outline:'none', fontFamily:'Cairo,sans-serif' }}
          onFocus={e=>e.target.style.borderColor='var(--gold-dark)'}
          onBlur={e=>e.target.style.borderColor='var(--dark5)'}
        />
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>⏳ جاري التحميل...</div>
      ) : filtered.length===0 ? (
        <EmptyState icon="👥" title="لا توجد نتائج" subtitle="جرب بحثاً مختلفاً" />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(c => {
            const barber = BARBERS[c.preferredBarber]
            return (
              <Card key={c.id} style={{ padding:'12px 16px', cursor:'pointer' }} onClick={() => setViewCustomer(c)} hover>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <Avatar name={c.name} size={42} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, fontSize:14 }}>{c.name}</span>
                      {c.vip && <Badge color="vip">👑 VIP</Badge>}
                    </div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', display:'flex', gap:10 }}>
                      <span>{c.phone}</span>
                      <span style={{ color:barber?.color }}>· {barber?.nameAr}</span>
                      <span>· {c.visits||0} زيارة</span>
                    </div>
                  </div>
                  <span style={{ fontSize:18, opacity:0.3 }}>›</span>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="إضافة زبون | Add Client">
        <Input label="الاسم *" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="اسم الزبون" required icon="👤" />
        <Input label="الهاتف *" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} placeholder="+962 7X XXX XXXX" type="tel" dir="ltr" required icon="📱" />
        <Select label="الحلاق المفضل" value={form.preferredBarber} onChange={v=>setForm(f=>({...f,preferredBarber:v}))} options={barberOptions} />
        <Input label="ملاحظات" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))} placeholder="اختياري..." />
        <div style={{ display:'flex', gap:10, marginTop:4 }}>
          <button onClick={() => setAddOpen(false)} style={{ flex:1, background:'var(--dark4)', color:'var(--text-muted)', border:'none', padding:12, borderRadius:9, cursor:'pointer', fontFamily:'Cairo,sans-serif' }}>إلغاء</button>
          <GoldBtn onClick={addCustomer} style={{ flex:1 }}>إضافة ✓</GoldBtn>
        </div>
      </Modal>

      {viewCustomer && (
        <Modal open={!!viewCustomer} onClose={() => setViewCustomer(null)} title="بطاقة الزبون">
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
              <Avatar name={viewCustomer.name} size={64} />
            </div>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:4 }}>{viewCustomer.name} {viewCustomer.vip && '👑'}</div>
            <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
              <Badge color={viewCustomer.preferredBarber==='maher'?'gold':'blue'}>
                {BARBERS[viewCustomer.preferredBarber]?.nameAr}
              </Badge>
            </div>
          </div>
          <Divider />
          {[
            { label:'الهاتف',        value: viewCustomer.phone },
            { label:'عدد الزيارات',  value:`${viewCustomer.visits||0} زيارة` },
            { label:'تاريخ الانضمام',value: viewCustomer.joinDate },
            viewCustomer.notes && { label:'ملاحظات', value: viewCustomer.notes },
          ].filter(Boolean).map(item=>(
            <div key={item.label} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'8px 0', borderBottom:'1px solid var(--dark4)' }}>
              <span style={{ color:'var(--text-muted)' }}>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
          {isAdmin && (
            <div style={{ display:'flex', gap:8, marginTop:20 }}>
              <GoldBtn sm onClick={() => toggleVip(viewCustomer)} outline style={{ flex:1 }}>
                {viewCustomer.vip ? '✕ إزالة VIP' : '👑 منح VIP'}
              </GoldBtn>
              <DangerBtn sm onClick={() => deleteCustomer(viewCustomer.id)}>🗑 حذف</DangerBtn>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
