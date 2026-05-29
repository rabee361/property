<?php

use App\Http\Controllers\App\PublicPropertyController;
use App\Http\Controllers\User\FavoriteController;
use App\Http\Controllers\User\LoginController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\RegisterController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('auth')
    ->group(
        function (){
            Route::post('/register',[RegisterController::class,'register']);
            Route::post('/login' ,[LoginController::class , 'login']);
            Route::post('/logout' ,[LoginController::class , 'logout'])->middleware('auth:api');
            Route::post('/change-password' ,[LoginController::class , 'changePassword'])->middleware('auth:api');

        }
    );

Route::prefix('app')
    ->controller(PublicPropertyController::class)
    ->group(function () {
        Route::get('/properties', 'index');
        Route::get('/properties/featured', 'featured');
        Route::get('/properties/{id}', 'show')->whereNumber('id');
    });


    Route::prefix('profile')
    ->controller(ProfileController::class)
       ->group(
        function (){
            Route::get('/me' , 'me')->middleware('auth:api');
            Route::post('/add' , 'store')-> middleware('auth:api');
            Route::get('/show/{profile}',  'show')->middleware('auth:api,api-admin');
            Route::post('/update/{profile}',  'update')->middleware('auth:api,api-admin');
            Route::delete('/delete/{profile}' ,'destroy')-> middleware('auth:api');
                  });



       Route::prefix('property')
       ->controller(UserController::class)
          ->group(
          function (){
            Route::get('/index' ,  'index');
                        Route::get('/mine' ,  'mine')->middleware('auth:api');
            Route::get('/show/{property}' ,  'show');
            Route::post('/add' ,  'store') ->middleware('auth:api,api-admin');
            Route::post('/update/{property}' ,  'update') ->middleware('auth:api,api-admin');
            Route::delete('/delete/{property}' ,  'destroy') ->middleware('auth:api,api-admin');
        });


       Route::prefix('/favorite')
       ->controller(FavoriteController::class)
          ->group(
          function (){
        Route::post('/properties/add/{id}','ToggleFavorite') ->middleware('auth:api');
        Route::get('/properties','myFavorites') ->middleware('auth:api');

         });

       Route::prefix('/notifications')
       ->controller(NotificationController::class)
       ->group(function () {
           Route::get('/mine', 'index')->middleware('auth:api');
       });
