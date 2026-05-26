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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('sent_by_admin_id')->nullable()->constrained('admins')->onDelete('set null');
            $table->string('title');
            $table->text('description');
            $table->enum('notification_type', [
                'PropertyApproved',     // تمت الموافقة على العقار
                'PropertyRejected',     // تم رفض العقار
                'PropertyFeatured',     // تم تمييز العقار
                'InquiryReceived',      // استفسار جديد على عقارك
                'PropertySold',         // تم بيع عقارك
                'PropertyRented',       // تم تأجير عقارك
                'AccountVerified',      // تم التحقق من حسابك
                'AdminMessage',         // رسالة مباشرة من الإدارة
                'System',               // إشعارات النظام العامة
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
