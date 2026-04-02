<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Group;
use App\Models\Domain;

class DashboardController extends Controller
{
    public function student()
    {
        $user = auth('api')->user();

        $enrolledCourses = $user->courses()
            ->with(['enseignant', 'domains'])
            ->get()
            ->map(function ($course) {
                $group = $course->pivot->group_id
                    ? Group::select('id', 'name')->find($course->pivot->group_id)
                    : null;

                return [
                    'id' => $course->id,
                    'titre' => $course->titre,
                    'description' => $course->description,
                    'prix' => $course->prix,
                    'enseignant' => $course->enseignant,
                    'domains' => $course->domains,
                    'group' => $group,
                    'status' => 'Confirmee',
                ];
            })
            ->values();

        $domainIds = $user->domains()->pluck('domains.id');
        $enrolledIds = $enrolledCourses->pluck('id');

        $recommendedCourses = Course::with(['enseignant', 'domains'])
            ->when($domainIds->isNotEmpty(), function ($query) use ($domainIds) {
                $query->whereHas('domains', function ($domainQuery) use ($domainIds) {
                    $domainQuery->whereIn('domains.id', $domainIds);
                });
            })
            ->when($enrolledIds->isNotEmpty(), function ($query) use ($enrolledIds) {
                $query->whereNotIn('id', $enrolledIds);
            })
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'domains' => $user->domains()->get(['domains.id', 'domains.name']),
            'wishlist_count' => $user->favoriteCourses()->count(),
            'enrolled_count' => $enrolledCourses->count(),
            'recommended_count' => $recommendedCourses->count(),
            'enrolled_courses' => $enrolledCourses,
            'recommended_courses' => $recommendedCourses,
        ]);
    }

    public function teacher()
    {
        $teacher = auth('api')->user();

        $courses = Course::where('enseignant_id', $teacher->id)
            ->with(['domains', 'groups' => function ($query) {
                $query->withCount('students')
                    ->with(['students' => function ($studentQuery) {
                        $studentQuery->select('users.id', 'name', 'email');
                    }]);
            }])
            ->withCount(['students', 'groups'])
            ->latest()
            ->get();

        $coursesData = $courses->map(function ($course) {
            $studentsCount = $course->students_count;
            $groupsCount = $course->groups_count;

            return [
                'id' => $course->id,
                'titre' => $course->titre,
                'description' => $course->description,
                'prix' => $course->prix,
                'domains' => $course->domains,
                'students_count' => $studentsCount,
                'groups_count' => $groupsCount,
                'total_revenue' => $studentsCount * $course->prix,
                'average_group_size' => $groupsCount > 0 ? round($studentsCount / $groupsCount, 1) : 0,
                'groups' => $course->groups->map(function ($group) {
                    return [
                        'id' => $group->id,
                        'name' => $group->name,
                        'students_count' => $group->students_count,
                        'students' => $group->students,
                    ];
                })->values(),
            ];
        })->values();

        return response()->json([
            'user' => $teacher->only(['id', 'name', 'email', 'role']),
            'courses_count' => $coursesData->count(),
            'students_count' => $coursesData->sum('students_count'),
            'groups_count' => $coursesData->sum('groups_count'),
            'total_revenue' => $coursesData->sum('total_revenue'),
            'available_domains' => Domain::select('id', 'name')->orderBy('name')->get(),
            'courses' => $coursesData,
        ]);
    }
}
