<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DocumentCreateMail extends Mailable
{
    use Queueable, SerializesModels;

    public $numero_solicitud;

    public $nombre_documento;

    public function __construct($numero_solicitud)
    {
        $this->numero_solicitud = $numero_solicitud;
    }

    public function build()
    {
        return $this->subject('Nuevo documento recibido')
            ->view('emails-templates.upload-document');
    }
}
