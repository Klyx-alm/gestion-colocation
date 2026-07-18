<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'colocataire_id',
        'montant',
        'nombre_mois',
        'date_paiement',
        'date_echeance',
        'rappel_envoye',
        'facture_envoyee',
    ];

    protected $casts = [
        'date_paiement' => 'date',
        'date_echeance' => 'date',
        'rappel_envoye' => 'boolean',
        'facture_envoyee' => 'boolean',
    ];

    public function colocataire(): BelongsTo
    {
        return $this->belongsTo(Colocataire::class);
    }

    protected static function booted(): void
    {
        static::creating(function (Paiement $paiement) {
            if (empty($paiement->date_echeance) && $paiement->date_paiement && $paiement->nombre_mois) {
                $paiement->date_echeance = Carbon::parse($paiement->date_paiement)
    ->addMonths((int) $paiement->nombre_mois); 
     }
        });
    }
}