<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('paiements', function (Blueprint $table) {
        $table->id();
        $table->foreignId('colocataire_id')->constrained()->onDelete('cascade');
        $table->decimal('montant', 10, 2);
        $table->unsignedTinyInteger('nombre_mois');
        $table->date('date_paiement');
        $table->date('date_echeance');
        $table->boolean('rappel_envoye')->default(false);
        $table->boolean('facture_envoyee')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
