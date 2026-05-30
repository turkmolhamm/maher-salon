// ─── Initial seed data ───────────────────────────────────────────────
const SEED_CUSTOMERS = [
  { id: 'c1', name: 'أمير خالد العمري', nameEn: 'Amir Khaled', phone: '+962791234567', preferredBarber: 'maher', visits: 14, vip: true, joinDate: '2024-01-15', notes: 'يفضل قص كلاسيكي' },
  { id: 'c2', name: 'محمد الرشيد', nameEn: 'Mohammad Al-Rashid', phone: '+962782345678', preferredBarber: 'mulham', visits: 8, vip: false, joinDate: '2024-03-10', notes: '' },
  { id: 'c3', name: 'عبدالله السالم', nameEn: 'Abdullah Al-Salem', phone: '+962773456789', preferredBarber: 'maher', visits: 22, vip: true, joinDate: '2023-11-05', notes: 'زبون منتظم - الباقة الملكية دائماً' },
  { id: 'c4', name: 'فيصل الحربي', nameEn: 'Faisal Al-Harbi', phone: '+962794567890', preferredBarber: 'mulham', visits: 5, vip: false, joinDate: '2024-06-01', notes: '' },
  { id: 'c5', name: 'خالد المطيري', nameEn: 'Khaled Al-Mutairi', phone: '+962785678901', preferredBarber: 'maher', visits: 11, vip: true, joinDate: '2024-02-20', notes: '' },
  { id: 'c6', name: 'يوسف النجار', nameEn: 'Yusuf Al-Najjar', phone: '+962776789012', preferredBarber: 'mulham', visits: 3, vip: false, joinDate: '2024-08-14', notes: '' },
]

const SEED_BOOKINGS = [
  { id: 'b1', customerId: 'c3', customerName: 'عبدالله السالم', customerPhone: '+962773456789', barber: 'maher', service: 'royal', date: today(), time: '09:00', status: 'confirmed', createdAt: new Date().toISOString() },
  { id: 'b2', customerId: 'c2', customerName: 'محمد الرشيد', customerPhone: '+962782345678', barber: 'mulham', service: 'haircut_beard', date: today(), time: '10:00', status: 'confirmed', createdAt: new Date().toISOString() },
  { id: 'b3', customerId: 'c5', customerName: 'خالد المطيري', customerPhone: '+962785678901', barber: 'maher', service: 'haircut', date: today(), time: '11:00', status: 'confirmed', createdAt: new Date().toISOString() },
  { id: 'b4', customerId: 'c4', customerName: 'فيصل الحربي', customerPhone: '+962794567890', barber: 'mulham', service: 'beard', date: today(), time: '11:30', status: 'confirmed', createdAt: new Date().toISOString() },
  { id: 'b5', customerId: 'c1', customerName: 'أمير خالد العمري', customerPhone: '+962791234567', barber: 'maher', service: 'royal', date: today(), time: '14:00', status: 'confirmed', createdAt: new Date().toISOString() },
]

const SEED_NOTIFICATIONS = [
  { id: 'n1', message: 'عرض خاص: الباقة الملكية بسعر مميز طوال هذا الأسبوع! 👑', recipients: 'all', count: 147, sentAt: new Date(Date.now() - 86400000*2).toISOString() },
  { id: 'n2', message: 'تذكير: الصالون مغلق كل يوم جمعة 🗓', recipients: 'all', count: 130, sentAt: new Date(Date.now() - 86400000*7).toISOString() },
]

const SEED_SCHEDULE = {
  maher: {
    sat: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'] },
    sun: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30'] },
    mon: { open: true,  slots: ['09:00','09:30','10:30','11:00','11:30','12:00','14:00','15:00','16:00','17:00'] },
    tue: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','12:00','14:00','14:30','15:00','16:00'] },
    wed: { open: true,  slots: ['09:00','09:30','10:00','11:00','11:30','14:00','15:00','16:00','17:00'] },
    thu: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00'] },
    fri: { open: false, slots: [] },
  },
  mulham: {
    sat: { open: true,  slots: ['10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','16:00','17:00'] },
    sun: { open: true,  slots: ['10:00','10:30','11:00','12:00','14:00','15:00','16:00','17:00'] },
    mon: { open: false, slots: [] },
    tue: { open: true,  slots: ['10:00','10:30','11:00','12:00','14:00','15:00','16:00'] },
    wed: { open: true,  slots: ['10:00','11:00','12:00','14:00','15:00','16:00'] },
    thu: { open: true,  slots: ['10:00','10:30','11:00','12:00','14:00','15:00','16:00','17:00'] },
    fri: { open: false, slots: [] },
  }
}

function today() {
  return new Date().toISOString().split('T')[0]
}

// ─── Storage helpers ─────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const v = localStorage.getItem('ms_' + key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function save(key, val) {
  try { localStorage.setItem('ms_' + key, JSON.stringify(val)) } catch {}
}

// ─── Store ───────────────────────────────────────────────────────────
export const store = {
  getCustomers: () => load('customers', SEED_CUSTOMERS),
  saveCustomers: (v) => save('customers', v),

  getBookings: () => load('bookings', SEED_BOOKINGS),
  saveBookings: (v) => save('bookings', v),

  getNotifications: () => load('notifications', SEED_NOTIFICATIONS),
  saveNotifications: (v) => save('notifications', v),

  getSchedule: () => load('schedule', SEED_SCHEDULE),
  saveSchedule: (v) => save('schedule', v),

  getAdminPin: () => load('adminPin', '1234'),
  saveAdminPin: (v) => save('adminPin', v),

  isAdmin: () => load('isAdmin', false),
  setAdmin: (v) => save('isAdmin', v),

  genId: () => Math.random().toString(36).slice(2, 10),
  today,
}

// ─── Services catalog ────────────────────────────────────────────────
export const SERVICES = [
  { id: 'haircut',       ar: 'قص شعر',                  en: 'Haircut',            duration: 30, price: 15 },
  { id: 'beard',         ar: 'تشكيل لحية',               en: 'Beard Trim',         duration: 20, price: 10 },
  { id: 'haircut_beard', ar: 'قص شعر + لحية',            en: 'Haircut & Beard',    duration: 45, price: 22 },
  { id: 'royal',         ar: 'الباقة الملكية 👑',         en: 'Royal Package 👑',   duration: 60, price: 35 },
  { id: 'kids',          ar: 'قص أطفال',                 en: "Kids' Haircut",       duration: 25, price: 10 },
]

export const BARBERS = {
  maher:  { id: 'maher',  nameAr: 'ماهر',   nameEn: 'Maher',  title: 'Master Barber',  color: '#C9A84C', avatar: 'M' },
  mulham: { id: 'mulham', nameAr: 'مُلهَم',  nameEn: 'Mulham', title: 'Professional Barber',  color: '#5BB3E0', avatar: 'Mu' },
}

export const DAY_KEYS   = ['sat','sun','mon','tue','wed','thu','fri']
export const DAY_NAMES  = { sat:'السبت', sun:'الأحد', mon:'الاثنين', tue:'الثلاثاء', wed:'الأربعاء', thu:'الخميس', fri:'الجمعة' }
export const DAY_EN     = { sat:'Saturday', sun:'Sunday', mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday' }
