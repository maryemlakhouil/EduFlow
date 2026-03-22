<?php

namespace App\Services;

use App\Repositories\Contracts\CourseRepositoryInterface;

class CourseService
{
    protected $courseRepo;

    public function __construct(CourseRepositoryInterface $courseRepo)
    {
        $this->courseRepo = $courseRepo;
    }

    public function getAllCourses()
    {
        return $this->courseRepo->getAll();
    }

    public function getCourse($id)
    {
        return $this->courseRepo->findById($id);
    }

    public function createCourse($data, $user)
    {
        $data['enseignant_id'] = $user->id;
        return $this->courseRepo->create($data);
    }

    public function updateCourse($id, $data)
    {
        return $this->courseRepo->update($id, $data);
    }

    public function deleteCourse($id)
    {
        return $this->courseRepo->delete($id);
    }
}