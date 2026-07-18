<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ColocataireController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\ParametreController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('colocataires', ColocataireController::class);
    Route::apiResource('paiements', PaiementController::class);
    Route::post('paiements/{paiement}/envoyer-facture', [PaiementController::class, 'envoyerFacture']);
    Route::post('paiements/{paiement}/envoyer-rappel', [PaiementController::class, 'envoyerRappel']);
    Route::get('parametres', [ParametreController::class, 'show']);
    Route::put('parametres', [ParametreController::class, 'update']);
});