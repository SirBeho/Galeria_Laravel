<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;

use function Laravel\Prompts\error;

class PedidoController extends Controller
{
    
    public function add(Request $request)
    {

        try {
            if ($request->carrito == null) {
                throw new \Exception('El carrito no puede estar vacío');
            }

            $request->validate([
                'nombre' => 'required',
                'telefono' => 'required',
            ]);

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
            $whatsappMessage = "Este es mi pedido No. $pedido->numero_pedido \n Puedes acceder aqui --> http://" . $host . $dir . "pedido?p=$pedido->numero_pedido&key=$pedido->key";
            $whatsappLink = 'https://wa.me/18094624721/?text=' . urlencode(str_replace('\\', '/', $whatsappMessage));

            return response()->json([
                'message' => 'Pedido creado correctamente',
                'pedido' => $pedido,
                'whatsappLink' => $whatsappLink,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function sent(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required',
            ]);

            $pedido = Pedido::find($request->id);
            $pedido->update([
                'status' => 2,
            ]);
        } catch (\Throwable $th) {
        }
    }

    public function status(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required',
                'status' => 'required|numeric',
            ]);
            
            if ($request->id == null || $request->status == null) {
                $request->merge(['id' => $request->input('id'), 'status' => $request->input('status')]);
            }
            
            $pedido = Pedido::find($request->id);
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