<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\CourseRepositoryInterface;
use App\Repositories\Eloquent\CourseRepository;
use App\Repositories\Contracts\FavoretlistRepositoryInterface;
use App\Repositories\Eloquent\FavoretlistRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
         $this->app->bind(CourseRepositoryInterface::class, CourseRepository::class);
         $this->app->bind(WishlistRepositoryInterface::class,WishlistRepository::class);
    }


    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
