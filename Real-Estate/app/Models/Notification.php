<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
        protected $fillable = [
        'user_id',
        'sent_by_admin_id',
        'title',
        'description',
        'notification_type'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sentByAdmin()
    {
        return $this->belongsTo(Admin::class, 'sent_by_admin_id');
    }

}
