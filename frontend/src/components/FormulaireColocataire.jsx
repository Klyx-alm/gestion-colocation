import { useState } from 'react';
import api from '../api';

function FormulaireColocataire({ onAjout }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreur('');
    setEnCours(true);

    api.post('/colocataires', { nom, prenom, email })
      .then(() => {
        setNom('');
        setPrenom('');
        setEmail('');
        onAjout();
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
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg border border-gray-200 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Ajouter un colocataire</h2>

      {erreur && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-3">{erreur}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>

      <button
        type="submit"
        disabled={enCours}
        className="mt-3 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {enCours ? 'Ajout en cours...' : 'Ajouter'}
      </button>
    </form>
  );
}

export default FormulaireColocataire;