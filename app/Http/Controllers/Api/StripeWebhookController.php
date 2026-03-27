<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use App\Models\User;
use App\Models\Course;
use Stripe\Stripe;
use App\Services\GroupAssignmentService;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        $event = Webhook::constructEvent(
            $payload,
            $sigHeader,
            $secret
        );

        //  paiement terminé
        if ($event->type === 'checkout.session.completed') {

            $session = $event->data->object;

            $courseId = $session->metadata->course_id;
            $userId   = $session->metadata->user_id;

            $user = User::findOrFail($userId);
            $course = Course::findOrFail($courseId);

            // inscription
            $user->courses()->syncWithoutDetaching([$course->id]);

             // assignation groupe
            app(GroupAssignmentService::class)->assign($user, $course);

        }

        return response()->json(['success' => true]);
    }
}