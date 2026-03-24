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
        return $this->FavoretlistRepository
            ->addToWishlist($user->id, $courseId);
    }

    public function remove($courseId, $user)
    {
        return $this->FavoretlistRepository
            ->removeFromWishlist($user->id, $courseId);
    }

    public function myWishlist($user)
    {
        return $this->FavoretlistRepository
            ->getUserWishlist($user->id);
    }
}