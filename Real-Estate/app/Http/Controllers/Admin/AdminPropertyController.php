<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AddPropertyRequest;
use App\Http\Requests\Admin\UpdatePropertyRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPropertyController extends Controller
{

public function index()
{
    $properties = Property::with([
        'user:id,name,email,phone',
        'admin:id,name,email',
        'images',
    ])
    ->latest()
    ->get();

    return response()->json([
        'success' => true,
        'message' => 'Properties retrieved successfully.',
        'properties' => $properties,
    ]);
}

/**
 * تغيير حالة العقار من قبل الأدمن
 */
public function changeStatus(Request $request, $id)
{
    $property = Property::find($id);

    if (!$property) {
        return response()->json(['success' => false, 'message' => 'العقار غير موجود'], 404);
    }
    $request->validate([
        'status' => 'required|in:approved,rejected,sold,rented,pending'
    ]);

    $newStatus = $request->status;
    $property->update([
        'status' => $newStatus
    ]);

    if ($property->user) {
        if ($newStatus === 'approved') {
            $property->user->notify(new \App\Notifications\PropertyApproveNotification());
        }
        elseif ($newStatus === 'rejected') {
            $property->user->notify(new \App\Notifications\PropertyRejectedNotification());
        }
                elseif ($newStatus === 'sold') {
            $property->user->notify(new \App\Notifications\PropertySoldNotification());
        }
                elseif ($newStatus === 'rented') {
            $property->user->notify(new \App\Notifications\PropertyRentNotification());
        }
    }
    return response()->json([
        'success' => true,
        'message' => "تم تغيير حالة العقار إلى $newStatus بنجاح",
        'property' => $property->fresh()
    ]);
}

}
