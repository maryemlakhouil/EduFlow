<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Group;

class TeacherGroupController extends Controller
{
    public function index($courseId)
    {
        $teacher = auth('api')->user();

        $course = Course::where('id', $courseId)
            ->where('enseignant_id', $teacher->id)
            ->with(['groups' => function ($query) {
                $query->withCount('students');
            }])
            ->firstOrFail();

        return response()->json([
            'course' => $course->titre,
            'groups' => $course->groups,
        ]);
    }

    public function show($groupId)
    {
        $teacher = auth('api')->user();

        $group = Group::where('id', $groupId)
            ->whereHas('course', function ($query) use ($teacher) {
                $query->where('enseignant_id', $teacher->id);
            })
            ->with(['students' => function ($query) {
                $query->select('users.id', 'name', 'email');
            }])
            ->firstOrFail();

        return response()->json([
            'group' => $group->name,
            'students' => $group->students,
        ]);
    }
}
