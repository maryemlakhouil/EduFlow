<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CourseService;
use App\Models\Course;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index()
    {
        return response()->json($this->courseService->getAllCourses());
    }

    public function show($id)
    {
        return response()->json($this->courseService->getCourse($id));
    }

    public function store(Request $request)
    {
      
        $data = $request->validate([
            'titre' => 'required|string',
            'description' => 'required|string',
            'prix' => 'required|numeric',
            'domains' => 'required|array'
        ]);

        $data['enseignant_id'] = auth('api')->id();

        $course = $this->courseService->createCourse($data,auth('api')->user());

        // attacher domaines
        $course->domains()->sync($request->domains);

        return response()->json([
            'message' => 'Cours créé avec succès',
            'data' => $course
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $course = $this->courseService->updateCourse($id, $request->all());
        return response()->json([
            'message' => 'Cours modifiée avec succès',
            'data' =>  $course
        ]);
    }

    public function destroy($id)
    {
        $this->courseService->deleteCourse($id);
        return response()->json(['message' => 'course supprimée avec succés']);
    }

    public function recommended()
    {
        $courses = $this->courseService->recommendedCourses(auth('api')->user());

        return response()->json($courses);
    }

    public function enroll($id)
    {
        $session = $this->courseService
            ->enrollWithPayment($id, auth('api')->user());

        return response()->json([
            'checkout_url' => $session->url
        ]);
    }

    public function leave($id)
    {
        $user = auth('api')->user();

        $course = Course::findOrFail($id);

        // vérifier inscription
        if (! $user->courses()->where('course_id', $course->id)->exists()) {
            return response()->json([
                'message' => 'Vous n’êtes pas inscrit à ce cours'
            ], 400);
        }

        // retirer du cours
        $user->courses()->detach($course->id);

        // retirer du groupe du cours
        foreach ($course->groups as $group) {
            $group->students()->detach($user->id);
        }

        return response()->json([
            'message' => 'Vous avez quitté le cours avec succès'
        ]);
    }
    // Ensegnant voir ses etudiant

    public function students($id)
    {
        $teacher = auth('api')->user();

        $course = Course::where('id', $id)
            ->where('enseignant_id', $teacher->id)
            ->first();

        if (!$course) {
                return response()->json([
                    'message' => 'Cours introuvable ou non autorisé'
                ], 404);
            }
        $students = $course->students()
            ->select('users.id', 'name', 'email')
            ->get();

        return response()->json([
            'course' => $course->titre,
            'students' => $students
        ]);
    }

    public function statistics($id)
    {
        $teacher = auth('api')->user();

        // vérifier que le cours appartient à l’enseignant
        $course = Course::where('id', $id)
            ->where('enseignant_id', $teacher->id)
            ->firstOrFail();

        // nombre étudiants
        $studentsCount = $course->students()->count();

        // nombre groupes
        $groupsCount = $course->groups()->count();

        // revenu total de chaque course 
        $totalRevenue = $studentsCount * $course->prix;

        // moyenne taille groupe
        $averageGroupSize = $groupsCount > 0 ? round($studentsCount / $groupsCount): 0;

        return response()->json([
            'students_count' => $studentsCount,
            'groups_count' => $groupsCount,
            'total_revenue' => $totalRevenue,
            'average_group_size' => $averageGroupSize,
        ]);
    }
    // les groupes 
    
    public function groups($id)
    {
        $teacher = auth('api')->user();

        // vérifier que le cours appartient à l'enseignant
        $course = Course::where('id', $id)
            ->where('enseignant_id', $teacher->id)
            ->firstOrFail();

        $groups = $course->groups()
            ->withCount('students')
            ->get(['id', 'name', 'course_id']);

        return response()->json([
            'course' => $course->titre,
            'groups' => $groups
        ]);
    }
}