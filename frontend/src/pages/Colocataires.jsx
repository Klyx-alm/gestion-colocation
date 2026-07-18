import { useEffect, useState } from 'react';
import api from '../api';
import ListeColocataires from '../components/ListeColocataires';
import FormulaireColocataire from '../components/FormulaireColocataire';

function Colocataires() {
  const [colocataires, setColocataires] = useState([]);

  const chargerColocataires = () => {
    api.get('/colocataires')
      .then((response) => setColocataires(response.data))
      .catch((error) => console.error('Erreur API:', error));
  };

  useEffect(() => {
    chargerColocataires();
  }, []);

  const supprimerColocataire = (id) => {
    if (!confirm('Supprimer ce colocataire et tous ses paiements ?')) return;

    api.delete(`/colocataires/${id}`)
      .then(() => chargerColocataires())
      .catch((error) => console.error('Erreur suppression:', error));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Colocataires</h1>
      <FormulaireColocataire onAjout={chargerColocataires} />
      <ListeColocataires
  colocataires={colocataires}
  onSupprimer={supprimerColocataire}
  onRafraichir={chargerColocataires}
/>
    </div>
  );
}

export default Colocataires;