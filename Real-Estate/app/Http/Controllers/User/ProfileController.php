<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ProfileRequest;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Resources\User\ProfileResource;
use App\Http\Resources\User\ShowProfileResource;
use App\Http\Resources\User\UpdateProfileResource;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{

public function me()
{
    $user = Auth::user();

    if (!$user) {
        return response()->json([
            'message' => 'User is not authenticated',
            'profile' => null,
        ], 401);
    }

    $profile = $user->profile;

    return response()->json([
        'message' => $profile ? 'Profile retrieved successfully' : 'Profile not created yet',
        'profile' => $profile ? new ShowProfileResource($profile) : null,
    ]);
}



       public function store(ProfileRequest $request){
        $user = Auth::user();

        if ($user->profile) {
            return response()->json([
                'message' => 'A profile already exists for this user.',
                'profile' => new ShowProfileResource($user->profile),
            ], 422);
        }

        //$Id_Card_Photo = $request->id_card_photo ;
        $Id_Card_Photo_Path =$request->file('id_card_photo') ->store('Id_Card_Photo' , 'public');

            $profile = Profile::create([
            'user_id'     => $user->id,
            'full_name' => $request->full_name ,
            'national_number'=>$request->national_number,
            'id_card_photo' =>$Id_Card_Photo_Path ,
            'date_of_birth' => $request->date_of_birth,
            'city' => $request->city,
            'is_verified' => false,
            'status' => 'pending',

        ]);

              return response()->json([
            'message' => 'The profile has been created successfully',
            'profile' =>new ProfileResource($profile)
         ], 201);
}

public function show(Profile $profile)
{
    $user = Auth::user();
    $isAdmin = Auth::guard('api-admin')->check();

    // التحقق من الصلاحية
    if (!$isAdmin && $user->id !== $profile->user_id) {
        return response()->json(['message' => 'You are not authorized to view this profile'], 403);
    }

    return response()->json([
        'message' => 'Profile retrieved successfully',
        'profile' => new ShowProfileResource($profile)
    ]);
}

        public function update(UpdateProfileRequest $request, Profile $profile)
    {
        // التحقق من الصلاحية: المالك أو الأدمن
        $user = Auth::user();
        $isAdmin = Auth::guard('api-admin')->check(); // إذا كنت تستخدم guard منفصل للأدمن

        if (!$isAdmin && $user->id !== $profile->user_id) {
            return response()->json(['message' => 'you are not authorized to modify this profile'], 403);
        }

    // 2. جلب المسار "الأصلي" الخام من قاعدة البيانات لتجنب تكرار الرابط
    $id_card_photo = $profile->getRawOriginal('id_card_photo');

    // 3. التحقق إذا كان هناك ملف جديد مرفوع
    if ($request->hasFile('id_card_photo')) {
        // حذف الصورة القديمة من التخزين (اختياري لكن مفضل)
        if ($id_card_photo) {
            Storage::disk('public')->delete($id_card_photo);
        }
        // تخزين الصورة الجديدة وحفظ مسارها فقط
        $id_card_photo = $request->file('id_card_photo')->store('id_card_photo', 'public');
    }

        $profileData = [
            'full_name'       => $request->full_name ?? $profile->full_name,
            'national_number' => $request->national_number ?? $profile->national_number,
            'id_card_photo'   => $id_card_photo,
            'date_of_birth'   => $request->date_of_birth ?? $profile->date_of_birth,
            'city'            => $request->city ?? $profile->city,
        ];

        if (!$isAdmin) {
            $profileData['is_verified'] = false;
            $profileData['status'] = 'pending';
        }

        $profile->update($profileData);
        // إذا الأدمن يريد توثيق الحساب (حقل is_verified)
        if ($isAdmin && $request->has('is_verified')) {
            $profile->update([
                'is_verified' => $request->boolean('is_verified'),
                'status' => $request->boolean('is_verified') ? 'approved' : 'pending'
            ]);
        }

        return response()->json([
            'message' => 'The file has been updated successfully',
            'profile' => new UpdateProfileResource($profile->fresh())
        ]);
    }



       public function destroy(Profile $profile)
{
    $user = Auth::user();
    $isAdmin = Auth::guard('api-admin')->check();


    if (!$isAdmin && $user->id !== $profile->user_id) {
        return response()->json(['message' => 'you are not authorized to delete this profile'], 403);
    }

    // حذف صورة الهوية من التخزين إذا وجدت
    if ($profile->id_card_photo) {
        Storage::disk('private')->delete($profile->id_card_photo);
    }

    $profile->delete();

    return response()->json([
        'message' => 'The profile has been deleted successfully'
    ]);
}
}
