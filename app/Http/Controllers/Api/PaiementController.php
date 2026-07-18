<?php

namespace App\Http\Controllers\Api;

use App\Mail\FactureMail;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Mail\RappelMail;

class PaiementController extends Controller
{
    public function index(): JsonResponse
    {
        $paiements = Paiement::with('colocataire')->latest('date_paiement')->get();

        return response()->json($paiements);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'colocataire_id' => 'required|exists:colocataires,id',
            'montant' => 'required|numeric|min:0',
            'nombre_mois' => 'required|integer|min:1|max:255',
            'date_paiement' => 'required|date',
        ]);

        $paiement = Paiement::create($validated);
        $paiement->load('colocataire');

        return response()->json($paiement, 201);
    }

    public function show(Paiement $paiement): JsonResponse
    {
        $paiement->load('colocataire');

        return response()->json($paiement);
    }

    public function update(Request $request, Paiement $paiement): JsonResponse
    {
        $validated = $request->validate([
            'montant' => 'sometimes|required|numeric|min:0',
            'nombre_mois' => 'sometimes|required|integer|min:1|max:255',
            'date_paiement' => 'sometimes|required|date',
        ]);

        $paiement->update($validated);

        // Si la date ou la durée change, il faut recalculer l'échéance à la main
        if ($request->hasAny(['date_paiement', 'nombre_mois'])) {
            $paiement->date_echeance = \Carbon\Carbon::parse($paiement->date_paiement)
    ->addMonths((int) $paiement->nombre_mois);
            $paiement->rappel_envoye = false;
            $paiement->save();
        }

        return response()->json($paiement->fresh('colocataire'));
    }

    public function destroy(Paiement $paiement): JsonResponse
    {
        $paiement->delete();

        return response()->json(null, 204);
    }
    public function envoyerFacture(Paiement $paiement): JsonResponse
    {
        $paiement->load('colocataire');

        Mail::to($paiement->colocataire->email)
            ->send(new FactureMail($paiement));

        $paiement->update(['facture_envoyee' => true]);

        return response()->json(['message' => 'Facture envoyée avec succès.']);
    }
    public function envoyerRappel(Paiement $paiement): JsonResponse
    {
        $paiement->load('colocataire');

        Mail::to($paiement->colocataire->email)
            ->send(new RappelMail($paiement));

        $paiement->update(['rappel_envoye' => true]);

        return response()->json(['message' => 'Rappel envoyé avec succès.']);
    }
}