<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class ResetPasswordNotification extends Notification
{
    use Queueable;
    public $token;


    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */

     public function toMail($notifiable)
    {
        $url = env('FRONTEND_URL')
            .'/reset-password?token='.$this->token
            .'&email='.$notifiable->email;

        return (new MailMessage)
            ->subject('Réinitialisation du mot de passe')
            ->line('Cliquez pour réinitialiser votre mot de passe.')
            ->action('Réinitialiser', $url)
            ->line('Si vous n’avez rien demandé, ignorez cet email.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
