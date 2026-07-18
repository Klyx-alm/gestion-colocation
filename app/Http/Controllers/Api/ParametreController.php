<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Parametre;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ParametreController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(Parametre::actuel());
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rappel_jours_min' => 'required|integer|min:0|max:60',
            'rappel_jours_max' => 'required|integer|min:0|max:60|gte:rappel_jours_min',
            'rappel_actif' => 'required|boolean',
            'nom_app' => 'required|string|max:100',
        ]);

        $parametre = Parametre::actuel();
        $parametre->update($validated);

        return response()->json($parametre);
    }
}