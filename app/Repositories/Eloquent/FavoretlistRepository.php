<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\FavoretlistRepositoryInterface;

class FavoretlistRepository implements FavoretlistRepositoryInterface
{
    public function addToFavoretlist($userId, $courseId)
    {
        $user = User::findOrFail($userId);
        $user->favoriteCourses()->syncWithoutDetaching([$courseId]);
    }

    public function removeFromFavoretlist($userId, $courseId)
    {
        $user = User::findOrFail($userId);
        $user->favoriteCourses()->detach($courseId);
    }

    public function getUserFavoretlist($userId)
    {
        $user = User::findOrFail($userId);
        return $user->favoriteCourses;
    }
}