<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{

public function ToggleFavorite($propertyId) {
    $user = auth()->user();
 $result = $user->favoriteProperties()->toggle($propertyId);

    $attached = count($result['attached']) > 0;
    $message = $attached ? 'Added to favorites successfully' : 'Removed from favorites successfully';
    return response()->json([
        'status' => true,
        'message' => $message,
        'is_favorite' => $attached
    ]);
}

public function myFavorites()
{
    $user = auth()->user();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'يجب تسجيل الدخول أولاً.'
        ], 401);
    }

    // 2. جلب العقارات المفضلة مع الصور الخاصة بها
    // نستخدم eloquent relationship التي عرفناها سابقاً (favoriteProperties)
    $favoriteProperties = $user->favoriteProperties()
        ->with('images') // جلب الصور المرتبطة بكل عقار
        ->latest('favorites.created_at') // ترتيبها من الأحدث إضافة للمفضلة
        ->get();

    // 3. الرد
    return response()->json([
        'success' => true,
        'count' => $favoriteProperties->count(),
        'data' => $favoriteProperties
    ]);
}
}
