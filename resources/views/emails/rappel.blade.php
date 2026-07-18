<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #2d2d2d;
            font-size: 14px;
            margin: 0;
            padding: 0;
            background-color: #f4f5f7;
        }
        .wrapper {
            max-width: 520px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: #92400e;
            color: #ffffff;
            padding: 24px 32px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        .body {
            padding: 28px 32px;
            line-height: 1.7;
        }
        .highlight {
            background-color: #fef3c7;
            border-left: 4px solid #92400e;
            padding: 14px 16px;
            border-radius: 6px;
            font-weight: 600;
            margin: 18px 0;
            color: #78350f;
        }
        .montant-box {
            background-color: #f3f4f6;
            padding: 14px 16px;
            border-radius: 6px;
            margin: 16px 0;
            font-size: 15px;
        }
        .footer {
            padding: 20px 32px 28px;
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>⏰ Rappel de paiement</h1>
        </div>

        <div class="body">
            <p>Bonjour {{ $paiement->colocataire->prenom }},</p>

            <p>Ceci est un rappel amical : votre échéance de loyer approche.</p>

            <div class="highlight">
                Échéance le {{ $paiement->date_echeance->format('d/m/Y') }}
                ({{ (int) now()->diffInDays($paiement->date_echeance, false) }} jour(s) restant(s))
            </div>

            <div class="montant-box">
                Montant à régler : <strong>{{ number_format($paiement->montant, 2, ',', ' ') }} FCFA</strong>
            </div>

            <p>Merci de bien vouloir procéder au paiement dans les meilleurs délais.</p>
        </div>

        <div class="footer">
            Ce message est envoyé automatiquement — merci de ne pas y répondre.
        </div>
    </div>
</body>
</html>