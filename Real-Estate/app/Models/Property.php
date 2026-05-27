<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Property extends Model
{
    use HasFactory;

     protected $fillable=['user_id', 'admin_id' , 'title' ,   'description' ,'deed_photo',
         'price' ,  'purpose' ,  'property_type',  'status' ,
         'address' ,   'number_of_rooms' , 'bathrooms' , 'area_m2' , 'features' ,'approved_by' ];



   public function admin(){
    return $this->belongsTo(Admin::class);
   }

    public function user(){
    return $this->belongsTo(User::class);
   }

       public function images()
    {
        return $this->hasMany(PropertyImage::class)->orderBy('order');
    }

        public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }



   protected function getDeedPhotoAttribute($value)
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
