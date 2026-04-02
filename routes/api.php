<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\FavoretlistController;
use App\Http\Controllers\Api\UserDomainController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\TeacherGroupController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\DashboardController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

 Route::post('/stripe/webhook', [StripeWebhookController::class,'handle']);  

    Route::get('/success', function () {
        return "Paiement réussi ";
    });

    Route::get('/cancel', function () {
        return "Paiement annulé ";
    });

// Courses public 

Route::get('/courses/recommended',[CourseController::class, 'recommended']);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/student', [DashboardController::class, 'student']);
    Route::get('/dashboard/teacher', [DashboardController::class, 'teacher']);

    // enseignant 
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Etudiante
    Route::post('/wishlist/{courseId}', [FavoretlistController::class, 'store']);
    Route::get('/wishlist', [FavoretlistController::class, 'index']);
    Route::delete('/wishlist/{courseId}', [FavoretlistController::class, 'destroy']);

    Route::post('/user/domains',[UserDomainController::class,'store']);
    Route::post('/courses/{id}/enroll',[CourseController::class,'enroll'])->middleware('auth:api');

    // REtir un cours 

    Route::delete('/courses/{id}/leave', [CourseController::class,'leave']);

    Route::get('/teacher/courses/{id}/students',[CourseController::class,'students']);
    Route::get('/groups/{group}', [TeacherGroupController::class, 'show']);
    Route::get('/courses/{id}/groups',[CourseController::class, 'groups']);
    Route::get('/groups/{id}/students',[GroupController::class, 'students']);

});
   Route::get('/courses/{id}/statistics', [CourseController::class, 'statistics'])
    ->middleware('auth:api');
    Route::middleware('auth:api')->get('/teacher/courses/{course}/groups',[TeacherGroupController::class, 'index']);
    Route::post('/forgot-password', [AuthController::class,'forgotPassword']);
    Route::post('/reset-password', [AuthController::class,'resetPassword']);
    

   
