import { useState } from 'react';
import api from '../api';

function FormulairePaiement({ colocataireId, onAjout, onFermer }) {
  const [montant, setMontant] = useState('');
  const [nombreMois, setNombreMois] = useState(1);
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().slice(0, 10));
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreur('');
    setEnCours(true);

    api.post('/paiements', {
      colocataire_id: colocataireId,
      montant,
      nombre_mois: nombreMois,
      date_paiement: datePaiement,
    })
      .then(() => {
        onAjout();
        onFermer();
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          const messages = Object.values(error.response.data.errors).flat();
          setErreur(messages.join(' '));
        } else {
          setErreur('Une erreur est survenue.');
        }
      })
      .finally(() => setEnCours(false));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-2">
      {erreur && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-3">{erreur}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Montant (FCFA)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Durée (mois)</label>
          <select
            value={nombreMois}
            onChange={(e) => setNombreMois(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          >
            {[1, 2, 3, 9, 12].map((mois) => (
              <option key={mois} value={mois}>{mois} mois</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date de paiement</label>
          <input
            type="date"
            value={datePaiement}
            onChange={(e) => setDatePaiement(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={enCours}
          className="bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded hover:bg-amber-800 disabled:opacity-50"
        >
          {enCours ? 'Enregistrement...' : 'Enregistrer le paiement'}
        </button>
        <button
          type="button"
          onClick={onFermer}
          className="text-sm text-gray-500 px-4 py-2 hover:text-gray-700"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default FormulairePaiement;