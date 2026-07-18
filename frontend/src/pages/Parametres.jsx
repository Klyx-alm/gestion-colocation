import { useState } from 'react';
import api from '../api';
import { useParametres } from '../contexts/ParametresContext';

function Parametres() {
  const { parametres, recharger } = useParametres();
  const [joursMin, setJoursMin] = useState(parametres.rappel_jours_min);
  const [joursMax, setJoursMax] = useState(parametres.rappel_jours_max);
  const [rappelActif, setRappelActif] = useState(parametres.rappel_actif);
  const [nomApp, setNomApp] = useState(parametres.nom_app);
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreur('');
    setMessage('');
    setEnregistrement(true);

    api.put('/parametres', {
      rappel_jours_min: joursMin,
      rappel_jours_max: joursMax,
      rappel_actif: rappelActif,
      nom_app: nomApp,
    })
      .then(() => {
        setMessage('Paramètres enregistrés avec succès.');
        recharger();
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          const messages = Object.values(error.response.data.errors).flat();
          setErreur(messages.join(' '));
        } else {
          setErreur('Une erreur est survenue.');
        }
      })
      .finally(() => setEnregistrement(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg p-10 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Général</h2>
        <p className="text-sm text-gray-600 mb-4">Nom affiché dans l'application.</p>

        {message && (
          <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg mb-4">{message}</p>
        )}
        {erreur && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-4">{erreur}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'application</label>
            <input
              type="text"
              value={nomApp}
              onChange={(e) => setNomApp(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Rappel automatique de paiement</h2>
            <p className="text-sm text-gray-600 mb-4">
              Fenêtre, en jours avant l'échéance, pendant laquelle un rappel est envoyé.
            </p>

            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={rappelActif}
                onChange={(e) => setRappelActif(e.target.checked)}
                className="w-5 h-5 accent-amber-700"
              />
              <span className="text-sm font-medium text-gray-700">
                Activer les rappels automatiques
              </span>
            </label>

            <div className={`grid grid-cols-2 gap-6 transition-opacity ${rappelActif ? 'opacity-100' : 'opacity-40'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum (jours)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  disabled={!rappelActif}
                  value={joursMin}
                  onChange={(e) => setJoursMin(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum (jours)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  disabled={!rappelActif}
                  value={joursMax}
                  onChange={(e) => setJoursMax(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={enregistrement}
            className="w-full bg-amber-700 text-white text-base font-semibold px-4 py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
          >
            {enregistrement ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Parametres;