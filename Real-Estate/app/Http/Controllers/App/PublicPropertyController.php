<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PublicPropertyController extends Controller
{
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
            'admin_id',
            'approved_by',
        ];
    }

    private function baseApprovedPropertiesQuery()
    {
        return Property::query()
            ->select($this->propertySelectColumns())
            ->with([
                'images',
                'user:id,name,email',
                'admin:id,email',
            ])
            ->where('status', 'approved');
    }

    private function propertyDetailsQuery()
    {
        return $this->baseApprovedPropertiesQuery();
    }

    private function applyFilters($query, Request $request): void
    {
        if ($request->filled('search')) {
            $searchTerm = trim((string) $request->input('search'));

            $query->where(function ($searchQuery) use ($searchTerm) {
                $searchQuery
                    ->where('title', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%")
                    ->orWhere('address', 'like', "%{$searchTerm}%");
            });
        }

        if ($request->filled('city')) {
            $city = trim((string) $request->input('city'));
            $query->where('address', 'like', "%{$city}%");
        }

        if ($request->filled('purpose')) {
            $query->where('purpose', $request->input('purpose'));
        }

        if ($request->filled('property_type')) {
            $query->where('property_type', $request->input('property_type'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }
    }

    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'purpose' => ['nullable', 'string', 'max:50'],
            'property_type' => ['nullable', 'string', 'max:50'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $propertiesQuery = $this->baseApprovedPropertiesQuery()->latest();
        $this->applyFilters($propertiesQuery, $request);

        $perPage = (int) ($validated['per_page'] ?? 12);
        $properties = $propertiesQuery->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Public properties retrieved successfully.',
            'properties' => $properties->items(),
            'filters' => [
                'search' => $validated['search'] ?? null,
                'city' => $validated['city'] ?? null,
                'purpose' => $validated['purpose'] ?? null,
                'property_type' => $validated['property_type'] ?? null,
                'min_price' => $validated['min_price'] ?? null,
                'max_price' => $validated['max_price'] ?? null,
            ],
            'pagination' => [
                'total' => $properties->total(),
                'per_page' => $properties->perPage(),
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'from' => $properties->firstItem(),
                'to' => $properties->lastItem(),
            ],
        ]);
    }

    public function featured()
    {
        $properties = $this->baseApprovedPropertiesQuery()
            ->inRandomOrder()
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Featured properties retrieved successfully.',
            'properties' => $properties,
        ]);
    }

    public function show($id)
    {
        $property = $this->propertyDetailsQuery()->find($id);

        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Property not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Property retrieved successfully.',
            'property' => $property,
        ]);
    }
}