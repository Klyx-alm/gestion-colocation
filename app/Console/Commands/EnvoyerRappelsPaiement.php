<?php

namespace App\Console\Commands;

use App\Mail\RappelMail;
use App\Models\Paiement;
use App\Models\Parametre;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class EnvoyerRappelsPaiement extends Command
{
    protected $signature = 'paiements:envoyer-rappels';

    protected $description = 'Envoie un rappel aux colocataires dont l’échéance arrive dans la fenêtre configurée';

    public function handle(): void
    {
        $parametre = Parametre::actuel();

        if (! $parametre->rappel_actif) {
            $this->info('Les rappels automatiques sont désactivés dans les paramètres.');
            return;
        }

        $debut = Carbon::today()->addDays($parametre->rappel_jours_min);
        $fin = Carbon::today()->addDays($parametre->rappel_jours_max);

        $paiements = Paiement::with('colocataire')
            ->whereBetween('date_echeance', [$debut->toDateString(), $fin->toDateString()])
            ->where('rappel_envoye', false)
            ->get();

        $this->info("{$paiements->count()} rappel(s) à envoyer.");

        foreach ($paiements as $paiement) {
            Mail::to($paiement->colocataire->email)
                ->send(new RappelMail($paiement));

            $paiement->update(['rappel_envoye' => true]);

            $this->info("Rappel envoyé à {$paiement->colocataire->email} (échéance le {$paiement->date_echeance->format('d/m/Y')})");
        }
    }
}