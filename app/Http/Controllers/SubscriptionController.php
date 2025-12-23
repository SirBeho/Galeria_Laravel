<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription as WebPushSubscription;

class SubscriptionController extends Controller
{
    /**
     * Guarda o actualiza la suscripción push del usuario.
     */
    public function store(Request $request)
    {
        // Validamos que vengan los datos necesarios del objeto PushSubscription
        $request->validate([
            'endpoint' => 'required|url',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
        ]);

        // Buscamos por endpoint para evitar duplicados si el usuario 
        // se desloguea y vuelve a loguear en el mismo navegador.
        Subscription::updateOrCreate(
            ['endpoint' => $request->endpoint],
            [
                'user_id'    => Auth::id(),
                'public_key' => $request->keys['p256dh'],
                'auth_token' => $request->keys['auth'],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Suscripción guardada correctamente.'
        ]);
    }

    public function sendPush($userId, $title, $message, $url = '/')
    {
        $subscriptions = Subscription::where('user_id', $userId)->get();

        if ($subscriptions->isEmpty()) {
            Log::warning("No se encontraron suscripciones para el usuario ID: $userId");
            return;
        }

        $auth = [
            'VAPID' => [
                'subject' => env('VAPID_SUBJECT', 'mailto:tu@email.com'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        try {
            $webPush = new WebPush($auth);

            foreach ($subscriptions as $sub) {
                $webPush->queueNotification(
                    WebPushSubscription::create([
                        'endpoint' => $sub->endpoint,
                        'publicKey' => $sub->public_key,
                        'authToken' => $sub->auth_token,
                    ]),
                    json_encode([
                        'title' => $title,
                        'body' => $message,
                        'url' => $url
                    ])
                );
            }

            foreach ($webPush->flush() as $report) {
                $endpoint = $report->getEndpoint();
                if (!$report->isSuccess()) {
                    if ($report->isSubscriptionExpired()) {
                        Subscription::where('endpoint', $endpoint)->delete();
                        Log::info("Suscripción expirada eliminada.");
                    } else {
                        Log::error("Error Push: " . $report->getReason());
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Fallo crítico WebPush: " . $e->getMessage());
        }
    }

    
}