<?php

namespace App\Notifications;

use App\Mail\UserCreatedMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCreatedNotification extends Notification
{
    use Queueable;

    protected $password;

    public function __construct($password)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable)
    {
        return  ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {

        return (new UserCreatedMail($this->password))
            ->view('emails-templates.user-created', [
                'email' => $notifiable->email,
                'password' => $this->password,
            ])
            ->to($notifiable->email);
    }
}
