<?php

namespace App\Mail;

use App\Models\Paiement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class FactureMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Paiement $paiement)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre facture de loyer',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'factures.facture',
            with: ['paiement' => $this->paiement],
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('factures.facture', ['paiement' => $this->paiement]);

        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(
                fn () => $pdf->output(),
                'facture-' . $this->paiement->id . '.pdf'
            )->withMime('application/pdf'),
        ];
    }
}