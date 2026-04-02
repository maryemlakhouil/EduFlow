<?php

namespace App\Services;

use App\Models\Course;
use App\Models\User;
use App\Models\Group;
use Illuminate\Support\Facades\DB;

class GroupAssignmentService
{
    public function assign(User $user, Course $course)
    {
        $group = $course->groups()
            ->withCount('students')
            ->having('students_count', '<', 25)
            ->first();

        if (!$group) {
            $groupNumber = $course->groups()->count() + 1;

            $group = Group::create([
                'course_id' => $course->id,
                'name' => 'Groupe ' . $groupNumber,
            ]);
        }

        $course->students()->updateExistingPivot(
            $user->id,
            ['group_id' => $group->id]
        );

        DB::table('course_user')
            ->where('course_id', $course->id)
            ->where('user_id', $user->id)
            ->update([
                'group_id' => $group->id
            ]);

        return $group;
    }
}
