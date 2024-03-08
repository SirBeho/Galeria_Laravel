<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next,$role): Response
    {
        if (auth()->user() && ( auth()->user()->rol_id == $role|| auth()->user()->rol_id ==1)) {
            return $next($request);
        }

        return redirect('AccessDenied');
    }
}
