<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\FavoretlistService;

class FavoretlistController  extends Controller
{
    protected $wishlistService;

    public function __construct(FavoretlistService $wishlistService)
    {
        $this->wishlistService = $wishlistService;
    }

    // ajouter favori
    public function store($courseId)
    {
        $this->wishlistService->add(
            $courseId,
            auth('api')->user()
        );

        return response()->json([
            'message' => 'Cours ajouté aux favoris'
        ]);
    }

    // voir favoris
    public function index()
    {
        return response()->json(
            $this->wishlistService->myWishlist(
                auth('api')->user()
            )
        );
    }

    // supprimer favori
    public function destroy($courseId)
    {
        $this->wishlistService->remove(
            $courseId,
            auth('api')->user()
        );

        return response()->json([
            'message' => 'Cours retiré des favoris'
        ]);
    }
}