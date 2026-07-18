<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Parametre extends Model
{
    protected $fillable = [
        'rappel_jours_min',
        'rappel_jours_max',
        'rappel_actif',
        'nom_app',
    ];

    protected $casts = [
        'rappel_actif' => 'boolean',
    ];

    public static function actuel(): self
    {
        return static::firstOrCreate([], [
            'rappel_jours_min' => 3,
            'rappel_jours_max' => 5,
            'rappel_actif' => true,
            'nom_app' => 'Gestion Colocation',
        ]);
    }
}