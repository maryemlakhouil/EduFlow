<?php


namespace App\Repositories\Eloquent;

use App\Models\Course;
use App\Repositories\Contracts\CourseRepositoryInterface;

class CourseRepository implements CourseRepositoryInterface
{
    public function all()
    {
        return Course::all();
    }
    
    // s’il existe :: retourne l’objet 
    // s’il n’existe pas :: lance une exception automatique
    public function find($id)
    {
        return Course::findOrFail($id);
    }

    public function create(array $data)
    {
        return Course::create($data);
    }

    public function update($id, array $data)
    {
        $course = $this->find($id);
        $course->update($data);
        return $course;
    }

    public function delete($id)
    {
        $course = $this->find($id);
        return $course->delete();   
    }
}