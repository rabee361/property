<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{

    use HasFactory;
    protected $fillable = [
        'user_id',
        'full_name' ,
        'national_number' ,
        'id_card_photo' ,
        'date_of_birth' ,
        'city' ,
        'is_verified'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

   protected function getIdCardPhotoAttribute($value)
{
    if ($value) {
        // إذا كنت تستخدم التخزين الخاص وتريد رابطاً مؤقتاً أو مساراً معيناً
        return url('storage/' . $value);
    }
    return null;
}
}
