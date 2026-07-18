import { useEffect, useState } from 'react';
import api from '../api';
import ListePaiements from '../components/ListePaiements';

function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');

  const chargerPaiements = () => {
    api.get('/paiements')
      .then((response) => setPaiements(response.data))
      .catch((error) => console.error('Erreur API:', error))
      .finally(() => setChargement(false));
  };

  useEffect(() => {
    chargerPaiements();
  }, []);

  const paiementsFiltres = paiements.filter((p) => {
    const nomComplet = `${p.colocataire?.prenom} ${p.colocataire?.nom}`.toLowerCase();
    return nomComplet.includes(recherche.toLowerCase());
  });

  if (chargement) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Paiements</h1>

      <input
        type="text"
        placeholder="Rechercher un colocataire..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="mb-4 w-full sm:w-72 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
      />

      <ListePaiements paiements={paiementsFiltres} onRafraichir={chargerPaiements} />
    </div>
  );
}

export default Paiements;