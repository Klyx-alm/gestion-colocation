import { useState, Fragment } from 'react';
import api from '../api';
import FormulairePaiement from './FormulairePaiement';
import { calculerStatut, dernierPaiementDe, paiementLePlusRecent } from '../utils/statut';

function estAEcheance(dateEcheance) {
  const diff = Math.ceil((new Date(dateEcheance) - new Date()) / (1000 * 60 * 60 * 24));
  return diff <= 7;
}

function ListeColocataires({ colocataires, onSupprimer, onRafraichir }) {
  const [formulaireOuvertPour, setFormulaireOuvertPour] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(null);
  const [rappelEnCours, setRappelEnCours] = useState(null);

  const envoyerFacture = (paiementId) => {
    setEnvoiEnCours(paiementId);
    api.post(`/paiements/${paiementId}/envoyer-facture`)
      .then(() => {
        onRafraichir();
        alert('Facture envoyée avec succès.');
      })
      .catch(() => alert("Erreur lors de l'envoi de la facture."))
      .finally(() => setEnvoiEnCours(null));
  };

  const envoyerRappel = (paiementId) => {
    setRappelEnCours(paiementId);
    api.post(`/paiements/${paiementId}/envoyer-rappel`)
      .then(() => {
        onRafraichir();
        alert('Rappel envoyé avec succès.');
      })
      .catch(() => alert("Erreur lors de l'envoi du rappel."))
      .finally(() => setRappelEnCours(null));
  };

  if (colocataires.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">
        Aucun colocataire enregistré pour l'instant.
      </p>
    );
  }

  return (
  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
  <table className="min-w-[640px] w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {colocataires.map((coloc) => {
            const statut = calculerStatut(coloc);
            const dernier = paiementLePlusRecent(coloc);
            const formulaireOuvert = formulaireOuvertPour === coloc.id;

            return (
              <Fragment key={coloc.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {coloc.prenom} {coloc.nom}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{coloc.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statut.couleur}`}>
                      {statut.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => setFormulaireOuvertPour(formulaireOuvert ? null : coloc.id)}
                      className="text-sm text-amber-700 hover:text-amber-900 font-medium"
                    >
                      {formulaireOuvert ? 'Fermer' : 'Ajouter paiement'}
                    </button>

                    {dernier && (
                      estAEcheance(dernier.date_echeance) ? (
                        <button
                          onClick={() => envoyerRappel(dernier.id)}
                          disabled={rappelEnCours === dernier.id}
                          className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          {rappelEnCours === dernier.id ? 'Envoi...' : 'Envoyer rappel'}
                        </button>
                      ) : (
                        <button
                          onClick={() => envoyerFacture(dernier.id)}
                          disabled={envoiEnCours === dernier.id}
                          className="text-sm text-amber-700 hover:text-amber-900 font-medium disabled:opacity-50"
                        >
                          {envoiEnCours === dernier.id ? 'Envoi...' : 'Envoyer facture'}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => onSupprimer(coloc.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
                {formulaireOuvert && (
                  <tr>
                    <td colSpan={4} className="px-4 pb-4">
                      <FormulairePaiement
                        colocataireId={coloc.id}
                        onAjout={onRafraichir}
                        onFermer={() => setFormulaireOuvertPour(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ListeColocataires;