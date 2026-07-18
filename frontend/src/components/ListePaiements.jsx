import { useState } from 'react';
import api from '../api';

function statutFacture(paiement) {
  return paiement.facture_envoyee
    ? { label: 'Facture envoyée', couleur: 'bg-green-100 text-green-700' }
    : { label: 'Non envoyée', couleur: 'bg-gray-100 text-gray-600' };
}

function statutEcheance(dateEcheance) {
  const diff = Math.ceil((new Date(dateEcheance) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'En retard', couleur: 'bg-red-100 text-red-700' };
  if (diff <= 7) return { label: 'Échéance proche', couleur: 'bg-amber-100 text-amber-700' };
  return { label: 'À jour', couleur: 'bg-green-100 text-green-700' };
}

function ListePaiements({ paiements, onRafraichir }) {
  const [envoiEnCours, setEnvoiEnCours] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(null);

  const envoyerFacture = (id) => {
    setEnvoiEnCours(id);
    api.post(`/paiements/${id}/envoyer-facture`)
      .then(() => {
        onRafraichir();
        alert('Facture envoyée avec succès.');
      })
      .catch(() => alert("Erreur lors de l'envoi de la facture."))
      .finally(() => setEnvoiEnCours(null));
  };

  const supprimerPaiement = (id) => {
    if (!confirm('Supprimer ce paiement ?')) return;
    setSuppressionEnCours(id);
    api.delete(`/paiements/${id}`)
      .then(() => onRafraichir())
      .catch(() => alert('Erreur lors de la suppression.'))
      .finally(() => setSuppressionEnCours(null));
  };

  if (paiements.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        Aucun paiement enregistré pour l'instant.
      </p>
    );
  }

  return (
  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
  <table className="min-w-[720px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Colocataire</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Montant</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Durée</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Échéance</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Facture</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {paiements.map((p) => {
            const echeance = statutEcheance(p.date_echeance);
            const facture = statutFacture(p);
            return (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {p.colocataire?.prenom} {p.colocataire?.nom}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {Number(p.montant).toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{p.nombre_mois} mois</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(p.date_echeance).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${echeance.couleur}`}>
                    {echeance.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${facture.couleur}`}>
                    {facture.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  <button
                    onClick={() => envoyerFacture(p.id)}
                    disabled={envoiEnCours === p.id}
                    className="text-sm text-amber-700 hover:text-amber-900 font-medium disabled:opacity-50"
                  >
                    {envoiEnCours === p.id ? 'Envoi...' : 'Envoyer facture'}
                  </button>
                  <button
                    onClick={() => supprimerPaiement(p.id)}
                    disabled={suppressionEnCours === p.id}
                    className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                  >
                    {suppressionEnCours === p.id ? '...' : 'Supprimer'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ListePaiements;