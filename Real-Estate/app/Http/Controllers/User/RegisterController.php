<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\RegisterRequest;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request){

            $user = User::create([
            'name' => $request->name ,
            'email' => $request->email,
            'password' => $request->password,
            'phone' => $request->phone,

        ]);

        $token = $user->createToken('access_token')->plainTextToken;

        $response = [];

        $response['user'] = new UserResource($user);
        $response['token'] = $token;

        return response()->json($response);

    }
}
