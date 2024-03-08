<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\User;
use App\Notifications\UserCreatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {

        $mensajes = [
            'name' => 'El nombre es invalido',
            'email.required' => 'El email no puede estar en blanco',
            'email.email' => 'Email no valido',
            'email.unique' => 'Ya existe una cuenta con este email'
        ];

        $validator = validator($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:' . User::class,
        ], $mensajes);


        if ($validator->fails()) {

            return redirect()->route('usuarios.index')->with('msj', ['error' => array_values($validator->errors()->messages())], 404);
        }

        $password = Str::random(12);


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'telefono' => $request->telefono,
            'rol_id' => $request->rol_id,
            'empresa' => $request->empresa,
            'rnc' => $request->rnc
        ]);

        // // Envía la notificación por correo electrónico
        $user->notify(new UserCreatedNotification($password));

        session()->put('msj', ["success" => 'Usuario registrado con exito']);
        return redirect(route('usuarios.index'));
    }
}
