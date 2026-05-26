<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Property;

class AdminStatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'stats' => [
                'profiles' => Profile::count(),
                'sale_properties' => Property::where('purpose', 'sale')->count(),
                'rent_properties' => Property::where('purpose', 'rent')->count(),
                'rejected_properties' => Property::where('status', 'rejected')->count(),
            ],
        ]);
    }
}