<?php

namespace App\Repositories\Contracts;

interface FavoretlistRepositoryInterface
{
    public function addToFavoretlist($userId, $courseId);
    public function removeFromFavoretlist($userId, $courseId);
    public function getUserFavoretlist($userId);
}