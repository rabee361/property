<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('admin_id')->nullable()->constrained('admins')->nullOnDelete();

            $table->string('title');
            $table->text('description');
            $table->string('deed_photo'); // صورة وثيقة سند ملكية العقار
            $table->decimal('price', 15, 2);
            $table->enum('purpose', ['sale' , 'rent'])->default('rent');
            $table->enum('property_type', ['apartment' , 'villa' , 'land' , 'office' ,'architecture' ,'shop'])->default('apartment');
            // حالة النشر والموافقة
            $table->enum('status', [
                'pending',     // بانتظار موافقة الأدمن (للمستخدمين العاديين)
                'approved',    // تمت الموافقة والنشر
                'rejected',    // مرفوض
                'sold',        //تم البيع
                'rented'       //تم التاجير
            ])->default('pending');
            $table->text('address');
            $table ->text('features')->nullable();
            $table->unsignedTinyInteger('number_of_rooms');
            $table->decimal('area_m2', 10, 2);

            $table->foreignId('approved_by')
                  ->nullable()
                  ->constrained('admins')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
