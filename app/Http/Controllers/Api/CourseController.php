<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\CourseService;

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
        ]);

        $course = $this->courseService->createCourse($data, auth('api')->user());

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
}