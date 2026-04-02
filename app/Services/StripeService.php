<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use App\Models\Course;


class StripeService
{
    public function createCheckoutSession(Course $course, $user)
    {
        $stripeSecret = config('services.stripe.secret');

        if (!$stripeSecret) {
            throw new \RuntimeException('La cle Stripe est manquante. Verifiez STRIPE_SECRET dans le fichier .env.');
        }

        Stripe::setApiKey($stripeSecret);

        $baseUrl = rtrim(request()?->getSchemeAndHttpHost() ?: config('app.url', 'http://127.0.0.1:8000'), '/');

        try {
            return Session::create([
                'payment_method_types' => ['card'],
                'mode' => 'payment',

                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $course->titre,
                        ],
                        'unit_amount' => (int) round($course->prix * 100),
                    ],
                    'quantity' => 1,
                ]],

                'metadata' => [
                    'course_id' => $course->id,
                    'user_id' => $user->id,
                ],

                'success_url' => "{$baseUrl}/success",
                'cancel_url' => "{$baseUrl}/cancel",
            ]);
        } catch (ApiErrorException $exception) {
            throw new \RuntimeException('Impossible de creer la session de paiement Stripe. Verifiez vos cles Stripe et l URL de l application.', 0, $exception);
        }
    }
}
