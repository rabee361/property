<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddPropertyRequest;
use App\Http\Requests\Admin\UpdatePropertyRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{

private function normalizeStoredMediaPath(?string $path): ?string
{
    if (!$path) {
        return null;
    }

    $normalizedPath = str_replace('\\', '/', trim($path));

    if (preg_match('~(?:https?://[^/]+/)?storage/(.+)$~i', $normalizedPath, $matches)) {
        return ltrim($matches[1], '/');
    }

    return ltrim($normalizedPath, '/');
}

private function propertySelectColumns(): array
{
    return [
        'id',
        'title',
        'description',
        'deed_photo',
        'price',
        'purpose',
        'property_type',
        'status',
        'address',
        'number_of_rooms',
        'area_m2',
        'features',
        'created_at',
        'user_id',
        'approved_by',
    ];
}

public function index(Request $request)
{
    $query = Property::select($this->propertySelectColumns())
    ->with(['user' => function ($q) {
        $q->select('id', 'name');
    }])
    ->where('status', 'approved')
    ->latest();

    // ==================== فلترة و بحث ====================

    // بحث عام
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('title', 'LIKE', "%{$search}%")
              ->orWhere('description', 'LIKE', "%{$search}%")
              ->orWhere('address', 'LIKE', "%{$search}%");
        });
    }

    // نوع العملية (بيع / إيجار)
    if ($request->filled('purpose')) {
        $query->where('purpose', $request->purpose);
    }

    // نوع العقار
    if ($request->filled('property_type')) {
        $query->where('property_type', $request->property_type);
    }

    // نطاق السعر
    if ($request->filled('min_price')) {
        $query->where('price', '>=', $request->min_price);
    }
    if ($request->filled('max_price')) {
        $query->where('price', '<=', $request->max_price);
    }

    // عدد الغرف
    if ($request->filled('number_of_rooms')) {
        $query->where('number_of_rooms', '>=', $request->number_of_rooms);
    }

    // المساحة
    if ($request->filled('min_area')) {
        $query->where('area_m2', '>=', $request->min_area);
    }
    if ($request->filled('max_area')) {
        $query->where('area_m2', '<=', $request->max_area);
    }

    $properties = $query->paginate(12);

    return response()->json([
        'success' => true,
        'message' => 'Properties retrieved successfully',
        'properties' => $properties->items(),
        'pagination' => [
            'total'         => $properties->total(),
            'per_page'      => $properties->perPage(),
            'current_page'  => $properties->currentPage(),
            'last_page'     => $properties->lastPage(),
            'from'          => $properties->firstItem(),
            'to'            => $properties->lastItem(),
        ]
    ]);
}

public function mine(Request $request)
{
    $user = $request->user();

    $properties = Property::select($this->propertySelectColumns())
        ->with('images')
        ->where('user_id', $user->id)
        ->latest()
        ->get();

    return response()->json([
        'success' => true,
        'message' => 'Owner properties retrieved successfully',
        'properties' => $properties,
    ]);
}


    public function store(AddPropertyRequest $request)
{
    $isAdmin = Auth::guard('api-admin')->check();
    $user    = $isAdmin ? null : auth()->user();
    $admin   = $isAdmin ? Auth::guard('api-admin')->user() : null;

    // ====================== التحقق من البروفايل (لليوزر العادي فقط) ======================
    if (!$isAdmin) {
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'يجب إكمال الملف الشخصي أولاً.'
            ], 403);
        }

        if (!$profile->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'ملفك الشخصي قيد المراجعة. لا يمكن إضافة عقار حتى يتم توثيقه.'
            ], 403);
        }
    }

    // ====================== رفع صورة الصك ======================
    $deedPhotoPath = $request->deed_photo;
    if ($request->hasFile('deed_photo')) {
        $deedPhotoPath = $request->file('deed_photo')->store('deed_photo', 'public');
    }

    // ====================== إنشاء العقار ======================
    $property = Property::create([
        'user_id'         => $isAdmin ? null : $user->id,
        'admin_id'        => $isAdmin ? $admin->id : null,
        'title'           => $request->title,
        'description'     => $request->description,
        'deed_photo'      => $deedPhotoPath,
        'price'           => $request->price,
        'purpose'         => $request->purpose,
        'property_type'   => $request->property_type ?? $request->type,
        'status'          => $isAdmin ? 'approved' : 'pending',   // الأدمن = approved فوراً
        'address'         => $request->address,
        'number_of_rooms' => $request->number_of_rooms,
        'features'        => $request->features,
        'area_m2'         => $request->area_m2,
    ]);

    // ====================== رفع الصور الإضافية ======================
    if ($request->hasFile('image_path')) {
        $imageFiles = $request->file('image_path');

        foreach ($imageFiles as $index => $image) {
            $storedPath = $image->store('property_images', 'public');

            PropertyImage::create([
                'property_id' => $property->id,
                'image_path'  => $storedPath,
                'order'       => $index + 1,
                'alt_text'    => $request->input("alt_text.{$index}") ?? $request->title,
            ]);
        }
    }

    return response()->json([
        'success'  => true,
        'message'  => $isAdmin
                        ? 'تم إضافة العقار ونشره فوراً بنجاح'
                        : 'تم إضافة العقار بنجاح وهو قيد المراجعة من قبل الإدارة',
        'property' => $property->load('images')
    ], 201);
}

public function show($id)
{

    $property = Property::with('images')->find($id);

    if (!$property) {
        return response()->json([
            'success' => false,
            'message' => 'العقار غير موجود.'
        ], 404);
    }

    $isAdmin = auth('api-admin')->check();
    $user = auth()->user();

    if (!$isAdmin && $property->status !== 'approved' && (!$user || $user->id !== $property->user_id)) {
        return response()->json([
            'success' => false,
            'message' => 'عذراً، هذا العقار غير متاح للعرض حالياً.'
        ], 403);
    }

    // 4. عرض العقار في حال نجاح الشروط
    return response()->json([
        'success' => true,
        'property' => $property
    ]);
}

public function update(UpdatePropertyRequest $request, Property $property)
{
    // تحديد نوع المستخدم
    $isAdmin = Auth::guard('api-admin')->check();
    $user    = $isAdmin ? null : auth()->user();

    // ====================== التحقق من الصلاحية ======================
    if (!$isAdmin) {
        // اليوزر العادي يقدر يعدل فقط عقاره الخاص
        if ($user->id !== $property->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to update this property.'
            ], 403);
        }
    }
    // الأدمن يقدر يعدل أي عقار (بما فيها تغيير الـ status)

    // ====================== رفع صورة الصك ======================
    $deedPhotoPath = $this->normalizeStoredMediaPath($property->getRawOriginal('deed_photo'));

    if ($request->hasFile('deed_photo')) {
        $existingDeedPhotoPath = $this->normalizeStoredMediaPath($property->getRawOriginal('deed_photo'));

        if ($existingDeedPhotoPath) {
            Storage::disk('public')->delete($existingDeedPhotoPath);
        }

        $deedPhotoPath = $request->file('deed_photo')->store('deed_photo', 'public');
    }

    // ====================== تحديث العقار ======================
    $updateData = [
        'title'           => $request->title ?? $property->title,
        'description'     => $request->description ?? $property->description,
        'deed_photo'      => $deedPhotoPath,
        'price'           => $request->price ?? $property->price,
        'purpose'         => $request->purpose ?? $property->purpose,
        'property_type'   => $request->property_type ?? $request->type ?? $property->property_type,
        'address'         => $request->address ?? $property->address,
        'number_of_rooms' => $request->number_of_rooms ?? $property->number_of_rooms,
        'features'        => $request->features ?? $property->features,
        'area_m2'         => $request->area_m2 ?? $property->area_m2,
    ];

    // الأدمن فقط يقدر يغير الـ status
    if ($isAdmin && $request->has('status')) {
        $updateData['status'] = $request->status;
    }

    $property->update($updateData);

    // ====================== رفع صور إضافية ======================
    if ($request->hasFile('image_path')) {
        $imageFiles = $request->file('image_path');

        foreach ($imageFiles as $index => $image) {
            $storedPath = $image->store('property_images', 'public');

            PropertyImage::create([
                'property_id' => $property->id,
                'image_path'  => $storedPath,
                'order'       => $property->images()->count() + $index + 1,
                'alt_text'    => $request->input("alt_text.{$index}") ?? $property->title,
            ]);
        }
    }

    return response()->json([
        'success'  => true,
        'message'  => 'Property updated successfully',
        'property' => $property->fresh()->load('images')
    ]);
}

public function destroy(Property $property)
{
    // تحديد نوع المستخدم
    $isAdmin = Auth::guard('api-admin')->check();
    $user    = $isAdmin ? null : auth()->user();

    // ====================== التحقق من الصلاحية ======================
    if (!$isAdmin) {
        // اليوزر العادي يقدر يحذف فقط عقاره
        if ($property->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to delete this property.'
            ], 403);
        }
    }
    // الأدمن يقدر يحذف أي عقار

    // ====================== حذف الصور الإضافية (property_images) ======================
    if ($property->images()->exists()) {
        foreach ($property->images as $image) {
            // حذف الملف من التخزين
            $storedImagePath = $this->normalizeStoredMediaPath($image->getRawOriginal('image_path'));

            if ($storedImagePath) {
                Storage::disk('public')->delete($storedImagePath);
            }
        }
        // حذف السجلات من قاعدة البيانات
        $property->images()->delete();
    }

    // ====================== حذف صورة الصك + الصورة الرئيسية ======================
    $storedDeedPhotoPath = $this->normalizeStoredMediaPath($property->getRawOriginal('deed_photo'));

    if ($storedDeedPhotoPath) {
        Storage::disk('public')->delete($storedDeedPhotoPath);
    }

    // ====================== حذف العقار ======================
    $property->delete();

    return response()->json([
        'success' => true,
        'message' => 'The property has been successfully deleted'
    ]);
}


}
