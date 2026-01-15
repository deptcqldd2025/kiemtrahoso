const CACHE_NAME = 'qldd-cache-v5.0';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// 1. Cài đặt Service Worker và Cache file tĩnh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Kích hoạt và xóa Cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. Xử lý yêu cầu mạng (Fetch)
self.addEventListener('fetch', (event) => {
  // Bỏ qua các request API (Firebase, Google Script) để luôn lấy dữ liệu mới
  if (event.request.url.includes('firebaseio.com') || 
      event.request.url.includes('script.google.com') ||
      event.request.url.includes('googleapis.com')) {
    return; 
  }

  // Chiến lược: Cache First, Network Fallback (Ưu tiên lấy từ cache cho nhanh)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
