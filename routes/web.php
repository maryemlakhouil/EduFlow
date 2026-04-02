<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/success', function () {
        return "Paiement réussi ";
    });

Route::view('/login', 'auth.login');
Route::view('/register', 'auth.register');

Route::view('/courses', 'courses.index');
Route::view('/courses/{id}', 'courses.show');
Route::view('/wishlist', 'courses.wishlist');
Route::view('/dashboard', 'dashboard.index');
