import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// ── Firebase config ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            'AIzaSyCF6IEGyJBc3uS4SsG65-t_BpelPtOKPJk',
  authDomain:        'maher-salo-jo.firebaseapp.com',
  projectId:         'maher-salo-jo',
  storageBucket:     'maher-salo-jo.firebasestorage.app',
  messagingSenderId: '796748141933',
  appId:             '1:796748141933:web:d2f8ab335320c05b90f664',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const messaging = getMessaging(app)

// ── FCM Push Notifications ───────────────────────────────────────────

// VAPID key من Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = 'BLCdqrs89TNtlLqcrIDDXzFnkZ4agMKNGVZUiMj2wyQBB_NT6Q52R0wASc4tQOMKNsbe8C_pehZFFfsVwbO3Vl4'

/** اطلب إذن الإشعارات واحفظ التوكن في Firestore */
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    const token = await getToken(messaging, { vapidKey: VAPID_KEY })
    if (token) {
      // احفظ التوكن في Firestore
      await setDoc(doc(db, 'fcm_tokens', token), {
        token,
        createdAt: serverTimestamp(),
        platform: navigator.userAgent
      })
      console.log('FCM Token saved:', token)
    }
    return token
  } catch (err) {
    console.error('FCM permission error:', err)
    return null
  }
}

/** استمع للإشعارات لما يكون التطبيق مفتوح */
export function onForegroundMessage(callback) {
  return onMessage(messaging, callback)
}

/** احصل على كل توكنات الزبائن */
export async function getAllFCMTokens() {
  const snap = await getDocs(collection(db, 'fcm_tokens'))
  return snap.docs.map(d => d.data().token)
}

// ── Collection refs ──────────────────────────────────────────────────
export const bookingsCol      = collection(db, 'bookings')
export const customersCol     = collection(db, 'customers')
export const notificationsCol = collection(db, 'notifications')

// ── Generic helpers ──────────────────────────────────────────────────

/** Get all docs from a collection, returns array of {id, ...data} */
export async function getAll(col) {
  const snap = await getDocs(col)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/** Add a new doc, returns the new id */
export async function addItem(col, data) {
  const ref = await addDoc(col, { ...data, createdAt: serverTimestamp() })
  return ref.id
}

/** Set a doc by id (overwrite) */
export async function setItem(col, id, data) {
  await setDoc(doc(db, col.path, id), data, { merge: true })
}

/** Update fields in a doc */
export async function updateItem(col, id, data) {
  await updateDoc(doc(db, col.path, id), data)
}

/** Delete a doc */
export async function deleteItem(col, id) {
  await deleteDoc(doc(db, col.path, id))
}

/** Real-time listener — returns unsubscribe fn */
export function listenCol(col, callback) {
  const q = query(col, orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ── Schedule (single doc per barber) ────────────────────────────────
export async function getSchedule() {
  const maherDoc  = await getDoc(doc(db, 'schedule', 'maher'))
  const mulhamDoc = await getDoc(doc(db, 'schedule', 'mulham'))
  return {
    maher:  maherDoc.exists()  ? maherDoc.data()  : defaultSchedule('maher'),
    mulham: mulhamDoc.exists() ? mulhamDoc.data() : defaultSchedule('mulham'),
  }
}

export async function saveScheduleBarber(barber, data) {
  await setDoc(doc(db, 'schedule', barber), data)
}

// ── Settings (PIN etc.) ──────────────────────────────────────────────
export async function getSetting(key, fallback) {
  try {
    const d = await getDoc(doc(db, 'settings', key))
    return d.exists() ? d.data().value : fallback
  } catch { return fallback }
}

export async function saveSetting(key, value) {
  await setDoc(doc(db, 'settings', key), { value })
}

// ── Default schedule fallback ────────────────────────────────────────
function defaultSchedule(barber) {
  const common = {
    sat: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'] },
    sun: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'] },
    mon: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'] },
    tue: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'] },
    wed: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'] },
    thu: { open: true,  slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'] },
    fri: { open: false, slots: ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'] },
  }
  if (barber === 'mulham') {
    common.mon = { open: false, slots: [] }
  }
  return common
}
