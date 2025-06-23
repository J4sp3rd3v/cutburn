const CACHE_NAME = 'cutburn-pro-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Supabase requests (need internet connection)
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache successful responses for static assets
            if (event.request.url.includes('.js') || 
                event.request.url.includes('.css') || 
                event.request.url.includes('.png') || 
                event.request.url.includes('.jpg') || 
                event.request.url.includes('.svg')) {
              
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // If network fails, show offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a simple offline response
            return new Response('Offline - CutBurn Pro', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
      })
  );
});

// Background sync for data when back online
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

// Sync user data when connection is restored
async function syncUserData() {
  try {
    console.log('📤 Background sync: starting user data sync...');
    
    // Get pending data from localStorage
    const pendingData = await getPendingData();
    
    if (pendingData.length > 0) {
      console.log(`📦 Found ${pendingData.length} pending items to sync`);
      
      // Notify main app to handle sync
      const clients = await self.clients.matchAll();
      for (const client of clients) {
        client.postMessage({
          type: 'BACKGROUND_SYNC',
          action: 'SYNC_PENDING_DATA',
          data: pendingData
        });
      }
      
      console.log('✅ Background sync notification sent to app');
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Helper functions for data sync
async function getPendingData() {
  try {
    // Try to get pending data from localStorage
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
      // Ask the main app for pending data
      clients[0].postMessage({
        type: 'REQUEST_PENDING_DATA'
      });
    }
    return [];
  } catch (error) {
    console.error('Error getting pending data:', error);
    return [];
  }
}

// Listen for messages from main app
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker received message:', event.data);
  
  if (event.data.type === 'PENDING_DATA_RESPONSE') {
    // Handle pending data from main app
    const pendingData = event.data.data || [];
    if (pendingData.length > 0) {
      console.log(`📦 Received ${pendingData.length} pending items from main app`);
      // Trigger sync in main app
      event.source.postMessage({
        type: 'TRIGGER_SYNC',
        data: pendingData
      });
    }
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📲 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Ricorda di tracciare i tuoi progressi oggi!',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'track-weight',
        title: 'Traccia Peso',
        icon: '/icon-96x96.png'
      },
      {
        action: 'view-diet',
        title: 'Vedi Dieta',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('CutBurn Pro', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/?action=' + (event.action || 'dashboard'))
  );
});

console.log('🚀 CutBurn Pro Service Worker loaded'); 