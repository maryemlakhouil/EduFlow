<?php

namespace App\Services;

use App\Repositories\Contracts\CourseRepositoryInterface;
use App\Services\StripeService;
use App\Models\Course;

class CourseService
{
    protected $courseRepo;
    protected $stripeService;


    public function __construct(CourseRepositoryInterface $courseRepo,StripeService $stripeService)
    {
        $this->courseRepo = $courseRepo;
        $this->stripeService = $stripeService;

    }

    public function getAllCourses()
    {
        return $this->courseRepo->all();
    }

    public function getCourse($id)
    {
        return $this->courseRepo->find($id);
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

    public function recommendedCourses($user)
    {
        return $this->courseRepo->getRecommendedCourses($user);
    }

    public function enrollWithPayment($courseId, $user)
    {
        $course = $this->courseRepo->find($courseId);

        return $this->stripeService->createCheckoutSession($course, $user);
    }



}