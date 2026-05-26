<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(Auth::guard('api-admin')->check()){
            $admin = Auth::guard('api-admin')->user();
            if(!$admin){
                return response()->json(['message' => 'Not Admin'] ,401);
            }
        }
        return $next($request);
    }
}
