<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use function Laravel\Prompts\error;

class PedidoController extends Controller
{   

    public function index(Request $request)
    {
        $validated = $request->validate([
            'p' => ['required', 'integer'], 
            'key' => ['required', 'string'], 
        ]);
        
        $numero_pedido = $validated['p'];
        $clave_acceso = $validated['key'];

        // 2. LÓGICA DE NEGOCIO
        $pedido = Pedido::with('detalle')
            ->where('numero_pedido', $numero_pedido)
            ->where('key', $clave_acceso)
            ->first();

        if (! $pedido) {
            return Inertia::render('AccessDenied');
        }

        // 4. RESPUESTA (Si todo es correcto)
        return Inertia::render('Pedido', [
            'user' => $request->user() ?? [], 
            'pedido' => $pedido,
        ]);
    }
    
        



    public function add(Request $request)
    {

        $request->validate([
            'nombre' => 'required|string',
            'telefono' => 'required|string',
            'carrito' => 'array|min:1|required',
            'carrito.*.codigo' => 'required|string',
            'carrito.*.cantidad' => 'required|integer|min:1',
            'carrito.*.comentario' => 'nullable|string',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'telefono.required' => 'El teléfono es obligatorio.',
            'carrito.min' => 'El carrito debe contener al menos un artículo.',
            'carrito.required' => 'El carrito no puede estar vacío.',
        ]);

        try {

            $pedido = Pedido::create([
                'nombre' => $request->nombre,
                'telefono' => $request->telefono,
                'key' => bin2hex(random_bytes(10)),
            ]);

            $carrito = $request->carrito;
            foreach ($carrito as $item) {
                $pedido->detalle()->create([
                    'pedido' => $pedido->id,
                    'codigo' => $item['codigo'],
                    'cantidad' => $item['cantidad'],
                    'comentario' => $item['comentario'],
                ]);
            }

            $host = $_SERVER['HTTP_HOST'];
            $dir = dirname($_SERVER['REQUEST_URI']);
            $url = 'http://'.$host.$dir."pedido?p=$pedido->numero_pedido&key=$pedido->key";
            $whatsappMessage = "Este es mi pedido No. $pedido->numero_pedido \n Puedes acceder aqui --> $url";
            $whatsappLink = 'https://wa.me/18094624721/?text='.urlencode(str_replace('\\', '/', $whatsappMessage));

            session()->flash('pedido_status', [
                'message' => 'Pedido creado correctamente',
                'pedido' => $pedido,
                'whatsappLink' => $whatsappLink,
                'whatsapp_response' => 'Not attempted',
                // 'whatsapp_response' => $this->notificacion_whatsapp($request->nombre, $pedido->numero_pedido, $url),
            ]);

            return redirect()->back()->with('success', 'Pedido creado Correctamente.');
            //añadir respuesta de whatsapp

            /* return response()->json([
                'message' => 'Pedido creado correctamente',
                'pedido' => $pedido,
                'whatsappLink' => $whatsappLink,
                'whatsapp_response' => $this->notificacion_whatsapp($request->nombre, $pedido->numero_pedido, $url),
            ]); */
        } catch (\Throwable $th) {
            Log::error('Fallo al crear pedido: '.$th->getMessage()); // 🟢 Registrar error

            // Devolver una respuesta JSON clara
            return response()->json([
                'error' => 'Ocurrió un error interno al procesar el pedido.',
                'details' => $th->getMessage(),
            ], 500);
        }
    }

    public function notificacion_whatsapp($nombre, $pedido, $link)
    {

        //TOKEN QUE NOS DA FACEBOOK
        $token = 'EAALF0a6PX8EBO5ObmVNONaCieGYBwnb0zTOGaLkHRucTMedEeuf7KmdJper0RS1bUXnziR86amykZBrZCPr2ZC1SU3rGzmN1jzUB13PfsTkq7K17SsG7BqoHeZBRmD0c0jKODEKXl9QaSxgt4Vt1eTvkP5MSAtDZBCSbtdgl5pDwV1BNOKqf4POMjvYnoWYZBKgUtBByaRGXsujtIa6diVVCeMXM8H9gaj';
        //NUESTRO TELEFONO
        $telefono = '18098892235';
        //URL A DONDE SE MANDARA EL MENSAJE
        $url = 'https://graph.facebook.com/v19.0/302001563003182/messages';

        //CONFIGURACION DEL MENSAJE
        $mensaje = [
            'messaging_product' => 'whatsapp',
            'to' => $telefono,
            'type' => 'template',
            'template' => [
                'name' => 'new_pedido',
                'language' => [
                    'code' => 'es',
                ],
                'components' => [
                    [
                        'type' => 'body',
                        'parameters' => [
                            [
                                'type' => 'text',
                                'text' => $nombre, // Parámetro 1
                            ],
                            [
                                'type' => 'text',
                                'text' => $pedido, // Parámetro 2
                            ],
                            [
                                'type' => 'text',
                                'text' => $link, // Parámetro 3
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $mensaje = json_encode($mensaje);

        //DECLARAMOS LAS CABECERAS
        $header = ['Authorization: Bearer '.$token, 'Content-Type: application/json'];
        //INICIAMOS EL CURL
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $mensaje);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        //OBTENEMOS LA RESPUESTA DEL ENVIO DE INFORMACION
        $response = json_decode(curl_exec($curl), true);
        //IMPRIMIMOS LA RESPUESTA

        //OBTENEMOS EL CODIGO DE LA RESPUESTA
        $status_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        //CERRAMOS EL CURL
        curl_close($curl);

        return $response;
    }

    public function sent(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);

        try {

            $pedido = Pedido::findOrFail($request->id);
            $pedido->update([
                'status' => 2,
            ]);
        } catch (\Throwable $th) {
        }
    }

    public function status(Request $request)
    {
        $request->validate([
            'id' => 'required',
            'status' => 'required|numeric',
        ]);
        try {

            if ($request->id == null || $request->status == null) {
                $request->merge(['id' => $request->input('id'), 'status' => $request->input('status')]);
            }

            $pedido = Pedido::findOrFail($request->id);
            $pedido->update([
                'status' => $request->status,
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
