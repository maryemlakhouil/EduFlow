<?php

namespace App\Services;

use App\Repositories\Contracts\FavoretlistRepositoryInterface;

class FavoretlistService
{
    protected $FavoretlistRepository;

    public function __construct(FavoretlistRepositoryInterface $FavoretlistRepository) {
        $this->FavoretlistRepository = $FavoretlistRepository;
    }

    public function add($courseId, $user)
    {
        return $this->FavoretlistRepository->addToFavoretlist($user->id, $courseId);
    }

    public function remove($courseId, $user)
    {
        return $this->FavoretlistRepository->removeFromFavoretlist($user->id, $courseId);
    }

    public function myFavoretlist($user)
    {
        return $this->FavoretlistRepository->getUserFavoretlist($user->id);
    }
}