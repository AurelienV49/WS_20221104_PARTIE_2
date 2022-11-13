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

/*  “install” : levé lorsque le navigateur installe le Service Worker 
    L’événement d’installation se déclenche uniquement s’il y a eu un changement sur le fichier du service worker ou 
    alors à chaque nouveau lancement de l’application.
    Cet événement va s’occuper de toutes les actions qui sont nécessaires de faire au chargement de l’application, tel 
    que mettre certains fichiers en cache.  
*/
self.addEventListener("install", installEvent => {
    // .skipWaiting : dit au worker de s'installer avec sa nouvelle version immédiatement
    // si elle existe (exemple: passage d'une v2 à v3)
    // pas d'attente d'install = on n'attend pas que le client réouvre la page pour utiliser la 
    // nouvelle version du worker
    self.skipWaiting();

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


/*  “fetch”: à chaque requête effectuée par le navigateur 
    Un évènement fetch est également possible, il est déclenché lorsqu’une requête HTTP est émise par l’application.
    permet d'intercepter des requêtes et d'y répondre de façon personnalisée. 
*/
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
});