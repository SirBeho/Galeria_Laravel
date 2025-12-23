self.addEventListener('push', function (event) {

    let data = {
        title: 'Nuevo Regalo',
        body: '¡Alguien actualizó una lista!',
        url: '/'
    };

    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        console.warn('Recibido push sin JSON válido, usando fallback');
    }

    console.log(data)

    const options = {
        body: data.body,
        vibrate: [100, 50, 100],
        icon: '/favico.png',
        badge: '/nota.svg',
        data: {
            url: data.url || '/'
        },
        tag: 'regalo-update',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Al hacer clic en la notificación
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        // eslint-disable-next-line no-undef
        clients.openWindow(event.notification.data.url)
    );
});