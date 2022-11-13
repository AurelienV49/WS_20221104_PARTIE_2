const staticDevCoffee = "dev-coffee-site-v2"
const assets = [
    "/",
    "/index.html",
    "/css/style.css",
    "/js/app.js",
    "/images/coffee1.jpg",
    "/images/coffee2.jpg",
    "/images/coffee3.jpg",
    "/images/coffee4.jpg",
    "/images/coffee5.jpg",
    "/images/coffee6.jpg",
    "/images/coffee7.jpg",
    "/images/coffee8.jpg",
    "/images/coffee9.jpg",
    "/images/favicon/bluetooth.ico",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticDevCoffee).then(cache => {
            cache.addAll(assets)
        })
    )
});

/*  “activate”: levé lorsque le navigateur active la nouvelle version 
    L’événement d’activation se déclenche une fois que l’événement d’installation est terminé.  
    Cet  évènement  est  surtout  utile  pour  supprimer  tous  les  fichiers  qui  ne  sont  plus  nécessaires  ou  pour  nettoyer 
    l’application. 
*/
self.addEventListener('activate', (event) => {

    console.log(`----------------------- .claims : dit au worker de controler la page immédiatement grâce au mode ACTIVATE`);
    clients.claim();
    console.log(`----------------------- Nom du cache utilisé par "active" : ${staticDevCoffee}`);

    // On supprime les caches inutiles
    event.waitUntil(
        (async() => {
            const keys = await caches.keys();
            await Promise.all(
                keys.map(key => {
                    if (!key.includes(staticDevCoffee)) {
                        console.log(`----------------------- Suppression d'un cache non utilisés : ${key}`);
                        return caches.delete(key);
                    }
                })
            );
        })()
    );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
});