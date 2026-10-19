// Service worker minimo: guarda la propia app para abrirla sin conexion. Lo externo (fotos, YouTube) siempre va a la red.
const V='twice-v30.0',CORE=['./','index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
