<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\LoginRequest;
use App\Http\Resources\Admin\AdminResource;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminLoginController extends Controller
{
    public function login(LoginRequest $request){
        $email = $request->email;
        $password = $request->password;

        $admin = Admin::where('email', $email)->first();

        if (is_null($admin)) {
            return [
                'success' => false,
                'message' => 'Email Not Found',
                'status' => 401
            ];
        }

        if (!Hash::check($password, $admin->password)) {
            return [
                'success' => false,
                'message' => 'Invalid Password',
                'status' => 401
            ];
        }

        return [
            'success' => true,
            'user' => $admin,
            'token' => $admin->createToken('admin_access_token')->plainTextToken
        ];

     return response()->json([
            'user' => new AdminResource($result['user']),
            'token' => $result['token']
        ]);
        }

    public function logout(Request $request)
    {
        $admin = Auth::guard('api-admin')->user();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin is not authenticated.',
            ], 401);
        }

        $admin->currentAccessToken()?->delete();

        return response()->json([
            'success' => true,
            'message' => 'Admin logged out successfully.',
        ]);
    }

    public function changePassword(Request $request)
    {
        $admin = Auth::guard('api-admin')->user();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin is not authenticated.',
            ], 401);
        }

        $validated = $request->validate([
            'new_password' => ['required', 'string', Password::min(8), 'confirmed'],
        ]);

        $admin->update([
            'password' => $validated['new_password'],
        ]);

        $admin->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Admin password updated successfully.',
        ]);
    }
    }
