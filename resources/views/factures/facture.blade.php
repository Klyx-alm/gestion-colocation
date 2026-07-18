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
            max-width: 560px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .header {
            background-color: #1f2937;
            color: #ffffff;
            padding: 28px 32px;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }
        .header p {
            margin: 6px 0 0;
            font-size: 13px;
            color: #9ca3af;
        }
        .body {
            padding: 28px 32px;
        }
        .intro {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.6;
            margin: 0 0 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f0f0f0;
        }
        .info-line {
            margin: 4px 0;
            font-size: 14px;
        }
        .info-line strong {
            color: #1f2937;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 24px;
            font-size: 13px;
        }
        th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 10px 12px;
            color: #374151;
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .montant {
            font-weight: 700;
            color: #1f2937;
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
            <h1>Facture de loyer</h1>
            <p>Émise le {{ now()->format('d/m/Y') }}</p>
        </div>
<div class="body">
            <p class="intro">
                Ce document vous est transmis automatiquement par le logiciel de gestion de la colocation.
                Il récapitule votre dernier paiement de loyer ainsi que la période couverte.
            </p>

            <p class="info-line"><strong>Locataire: Mr/Mme</strong> {{ $paiement->colocataire->prenom }} {{ $paiement->colocataire->nom }}</p>
            <p class="info-line"><strong>Email :</strong> {{ $paiement->colocataire->email }}</p>

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Période couverte</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Loyer ({{ $paiement->nombre_mois }} mois)</td>
                        <td>
                            Du {{ $paiement->date_paiement->format('d/m/Y') }}<br>
                            au {{ $paiement->date_echeance->format('d/m/Y') }}
                        </td>
                        <td class="montant">{{ number_format($paiement->montant, 2, ',', ' ') }} FCFA</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            Merci pour votre paiement. Ce document est généré automatiquement — merci de ne pas y répondre.
        </div>
    </div>
</body>
</html>