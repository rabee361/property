<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PropertyImage extends Model
{

    protected $fillable = [
        'property_id',
        'image_path',
        'order',
    ];


    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    protected function getImagePathAttribute($value)
{
    return $this->buildPublicStorageUrl($value);
}

    private function buildPublicStorageUrl($value)
    {
        if (!$value) {
            return null;
        }

        $normalizedValue = str_replace('\\', '/', trim((string) $value));
        $storagePath = $this->extractStoragePath($normalizedValue);

        if (!$storagePath) {
            return $normalizedValue;
        }

        $baseUrl = request()?->getSchemeAndHttpHost() ?: rtrim((string) config('app.url'), '/');

        return rtrim($baseUrl, '/') . '/storage/' . ltrim($storagePath, '/');
    }

    private function extractStoragePath(string $value): ?string
    {
        if (preg_match('~(?:https?://[^/]+/)?storage/(.+)$~i', $value, $matches)) {
            return ltrim($matches[1], '/');
        }

        return ltrim($value, '/');
    }
}
