<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;
use Illuminate\Support\Facades\Log;

// Importar para logging profesional

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
    public function version(Request $request): ?string
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
            'mensaje' => fn () => $request->session()->get('msj'),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'pedido_status' => fn () => $request->session()->get('pedido_status'),
            ],
            'designSettings' =>[
                'logoUrl'=> config('settings.imagen_principal_code', 'favico.png'),
                'primaryColor'=> config('settings.color_primario', '#2563EB'),
                'secondaryColor'=> config('settings.color_secundario', '#2563EB'),
            ],
            'galleryUrl' => \Illuminate\Support\Facades\Storage::disk('gallery')->url(''),
        ];
    }
}
