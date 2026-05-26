<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdminProfileContoller extends Controller
{
    public function index(Request $request)
{
    // 1. التحقق من أن المستخدم هو أدمن
    if (!Auth::guard('api-admin')->check()) {
        return response()->json(['message' => 'Unauthorized. Admin access only.'], 403);
    }

    // 2. البدء ببناء الاستعلام
    $query = Profile::query();

    // 3. البحث حسب الاسم (إذا تم إرساله في الطلب)
    if ($request->has('full_name')) {
        $query->where('full_name', 'like', '%' . $request->full_name . '%');
    }

    // 4. الفلترة حسب حالة التوثيق (is_verified)
    if ($request->has('is_verified')) {
        $query->where('is_verified', $request->boolean('is_verified'));
    }

    // 5. البحث حسب المدينة
    if ($request->has('city')) {
        $query->where('city', $request->city);
    }
     if ($request->has('national_number')) {
        $query->where('national_number', $request->city);
    }
     if ($request->has('date_of_birth')) {
        $query->where('date_of_birth', $request->city);
    }

    // 6. جلب النتائج مع الترقيم (Pagination) لضمان سرعة الأداء
    $profiles = $query->with('user')->latest()->paginate(15);

    return response()->json([
        'message' => 'Profiles retrieved successfully',
        'data' => $profiles
    ]);
}

    /**
     * عرض الملفات المعلقة (غير الموثقة)
     */
public function pending()
{
    $profiles = Profile::where('is_verified', false)
        ->with(['user:id,name,email,phone'])           // جلب بيانات اليوزر المرتبطة
        ->orderBy('created_at', 'desc')
        ->paginate(15);

    return response()->json([
        'success'  => true,
        'message'  => 'Pending profiles retrieved successfully',
        'profiles' => $profiles->items(),              // فقط البيانات (بدون junk data)
        'pagination' => [
            'total'         => $profiles->total(),
            'per_page'      => $profiles->perPage(),
            'current_page'  => $profiles->currentPage(),
            'last_page'     => $profiles->lastPage(),
            'from'          => $profiles->firstItem(),
            'to'            => $profiles->lastItem(),
        ]
    ]);
}


    /**
     * الموافقة على ملف شخصي
     */
    public function approve($id)
    {
        $profile = Profile::find($id);
     if ($profile->is_verified) {
        return response()->json([
                'success' => false,
                'message' => 'This profile is already verified.'
            ], 422);
        }

    $profile->update([
        'is_verified' => true,
    ]);
    if ($profile->user) {
        $profile->user->notify(new \App\Notifications\ProfileApproveNotification());
    }
    $updatedProfile = $profile->fresh();
        return response()->json([
            'success' => true,
            'message' => 'Profile approved successfully.',
            'profile' =>$updatedProfile
        ]);
    }


    /**
 * رفض ملف شخصي
 */
public function reject(Request $request, $id)
{
    $profile = Profile::find($id);

    if (!$profile) {
        return response()->json([
            'success' => false,
            'message' => 'Profile not found.'
        ], 404);
    }
    $reason = $request->input('reason', 'البيانات المقدمة غير واضحة أو غير مكتملة.');

    $profile->update([
        'is_verified' => false,
    ]);
    // إرسال إشعار الرفض مع السبب
    if ($profile->user) {
        $profile->user->notify(new \App\Notifications\ProfileRejectedNotification());
    }

    return response()->json([
        'success' => true,
        'message' => 'Profile has been rejected and the user has been notified.',
        'reason' => $reason
    ]);
}
}
