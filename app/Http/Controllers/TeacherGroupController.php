<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TeacherGroupController extends Controller
{

    // Enseignant voit les groupes de son cours
    public function index($courseId)
    {
        $course = Course::where('id', $courseId)
            ->where('teacher_id', auth()->id())
            ->with('groups')
            ->firstOrFail();

        return response()->json($course->groups);
    }
    // Voir participants d’un groupe
    public function show($groupId)
    {
        $group = Group::with('students')->findOrFail($groupId);

        return response()->json([
            'group' => $group->name,
            'students' => $group->students
        ]);
    }
}
