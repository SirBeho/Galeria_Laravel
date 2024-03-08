<?php

namespace App\Notifications;

use App\Mail\DocumentCreateMail;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewDocumentsNotification extends Notification
{
    use Queueable;

    protected $emailRecipient;

    public $numero_solicitud;
    public $nombre_documento;
    /**
     * Create a new notification instance.
     */
    public function __construct($emailRecipient, $numero_solicitud)
    {
        $this->emailRecipient = $emailRecipient;
        $this->numero_solicitud = $numero_solicitud;
 
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
    public function toMail(object $notifiable)
    {
        return (new DocumentCreateMail($this->numero_solicitud, $this->nombre_documento))
            ->view('emails-templates.user-created')
            ->to($this->emailRecipient);
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
