import axios from 'axios';

export const pushSubscription = (vapidKey) => {

    const subscribeUser = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Las notificaciones no son compatibles');
            return;
        }

        console.log("suscripcion", vapidKey)

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registrado en:', reg.scope))
                .catch(err => console.log('Error al registrar SW:', err));
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            //const registration = await navigator.serviceWorker.register('/sw.js');

            /*  const existingSubscription = await registration.pushManager.getSubscription();
             if (existingSubscription) return; */


            /* const permission = await Notification.requestPermission();
            if (permission !== 'granted') return; */

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey
            });

            await axios.post(route('push.subscribe'), subscription);
            //await instance.post('/subscription/subscribe', subscription);

            console.log('✅ Suscripción guardada con éxito');
        } catch (error) {
            console.error('❌ Error en el proceso:', error);
        }
    };

    return { subscribeUser };
};