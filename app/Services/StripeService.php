<?php

namespace App\Services;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Course;


class StripeService
{
    public function createCheckoutSession(Course $course, $user)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        return Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',

            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $course->titre,
                    ],
                    'unit_amount' => $course->prix * 100,
                ],
                'quantity' => 1,
            ]],

            // IMPORTANT POUR WEBHOOK
            'metadata' => [
                'course_id' => $course->id,
                'user_id' => $user->id,
            ],

            'success_url' => env('APP_URL').'/success',
            'cancel_url' => env('APP_URL').'/cancel',
        ]);
    }
}