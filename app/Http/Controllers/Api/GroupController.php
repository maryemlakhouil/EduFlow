<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;


class GroupController extends Controller
{
    public function students($id)
    {
        $teacher = auth('api')->user();

        // récupérer groupe + vérifier ownership
        $group = Group::where('id', $id)
            ->whereHas('course', function ($q) use ($teacher) {
                $q->where('enseignant_id', $teacher->id);
            })->firstOrFail();

        $students = $group->students()
            ->select('users.id', 'name', 'email')
            ->get();

        return response()->json([
            'group' => $group->name,
            'students' => $students
        ]);
    }
}



