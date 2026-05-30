importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey:            'AIzaSyCF6IEGyJBc3uS4SsG65-t_BpelPtOKPJk',
  authDomain:        'maher-salo-jo.firebaseapp.com',
  projectId:         'maher-salo-jo',
  storageBucket:     'maher-salo-jo.firebasestorage.app',
  messagingSenderId: '796748141933',
  appId:             '1:796748141933:web:d2f8ab335320c05b90f664',
})

const messaging = firebase.messaging()

// إشعارات الخلفية - لما يكون التطبيق مغلق
messaging.onBackgroundMessage(function(payload) {
  console.log('Background message:', payload)

  const { title, body, icon } = payload.notification || {}

  self.registration.showNotification(title || 'صالون ماهر', {
    body:  body  || 'لديك إشعار جديد من صالون ماهر',
    icon:  icon  || '/logo.jpg',
    badge: '/logo.jpg',
    dir:   'rtl',
    lang:  'ar',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'فتح التطبيق' },
    ]
  })
})

// لما يضغط على الإشعار يفتح التطبيق
self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})
