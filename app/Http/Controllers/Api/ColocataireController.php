<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Colocataire;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ColocataireController extends Controller
{
    public function index(): JsonResponse
    {
        $colocataires = Colocataire::with('paiements')->get();

        return response()->json($colocataires);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:colocataires,email',
        ]);

        $colocataire = Colocataire::create($validated);

        return response()->json($colocataire, 201);
    }

    public function show(Colocataire $colocataire): JsonResponse
    {
        $colocataire->load('paiements');

        return response()->json($colocataire);
    }

    public function update(Request $request, Colocataire $colocataire): JsonResponse
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:colocataires,email,' . $colocataire->id,
        ]);

        $colocataire->update($validated);

        return response()->json($colocataire);
    }

    public function destroy(Colocataire $colocataire): JsonResponse
    {
        $colocataire->delete();

        return response()->json(null, 204);
    }
}