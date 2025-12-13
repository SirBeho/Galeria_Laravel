<?php

namespace App\Http\Middleware;

use App\Http\Controllers\NotificacionController;
use App\Models\Notificacion;
use App\Models\Solicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {


        return [
            ...parent::share($request),
            'auth' => [
                'user' => null,
              
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'designSettings' => [
            'logoUrl' => env('IMAGEN_PRINCIPAL_CODE', 'favico.png'),
            'primaryColor' => env('COLOR_PRIMARIO', '#343a40'),
            'secondaryColor' => env('COLOR_SECUNDARIO', '#2563EB'),
        ],
        ];
    }
}
