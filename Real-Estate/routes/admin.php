<?php

use App\Http\Controllers\Admin\AdminLoginController;
use App\Http\Controllers\Admin\AdminProfileContoller;
use App\Http\Controllers\Admin\AdminPropertyController;
use App\Http\Controllers\Admin\AdminStatsController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')
    ->group(
        function () {
            Route::post('/login', [AdminLoginController::class, 'login']);
            Route::post('/logout', [AdminLoginController::class, 'logout'])->middleware('auth:api-admin');
            Route::post('/change-password', [AdminLoginController::class, 'changePassword'])->middleware('auth:api-admin');

        });

Route::prefix('stats')
    ->controller(AdminStatsController::class)
    ->middleware('auth:api-admin')
    ->group(function () {
        Route::get('/index', 'index');
    });

        Route::prefix('profiles')
        ->controller(AdminProfileContoller::class)
        ->middleware('auth:api-admin')
        ->group(function () {
        Route::get('/index', 'index');                     // عرض الكل مع بحث
        Route::get('/pending', 'pending');            // عرض المعلقة فقط
        Route::post('/approve/{id}', 'approve'); // الموافقة
        Route::delete('/reject/{id}', 'reject'); // الرفض
    });


   Route::prefix('property/admin')
    ->controller(AdminPropertyController::class)
    ->middleware('auth:api-admin')
    ->group(function () {
        Route::get('/index', 'index');
        Route::post('/changeStatus/{id}', 'changeStatus')->name('changeStatus');
    });


