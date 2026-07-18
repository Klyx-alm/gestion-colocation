import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import { calculerStatut, dernierPaiementDe } from '../utils/statut';

function CarteStat({ titre, valeur, couleur, hoverCouleur }) {
  return (
    <div
      className={`rounded-xl border p-6 transition-all duration-200 cursor-default hover:-translate-y-1 hover:shadow-lg ${couleur} ${hoverCouleur}`}
    >
      <p className="text-sm font-medium opacity-80">{titre}</p>
      <p className="text-4xl font-bold mt-2">{valeur}</p>
    </div>
  );
}

function joursRestants(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `En retard de ${Math.abs(diff)} j`;
  if (diff === 0) return "Aujourd'hui";
  return `Dans ${diff} j`;
}

function tempsEcoule(dateStr) {
  const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Hier';
  return `Il y a ${diff} j`;
}

function Dashboard() {
  const [colocataires, setColocataires] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    api.get('/colocataires')
      .then((response) => setColocataires(response.data))
      .catch((error) => console.error('Erreur API:', error))
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  const total = colocataires.length;
  const aJour = colocataires.filter((c) => calculerStatut(c).label === 'À jour').length;
  const enAlerte = colocataires.filter((c) => {
    const label = calculerStatut(c).label;
    return label === 'En retard' || label === 'Échéance proche';
  }).length;

  // Tous les paiements à plat, avec référence au colocataire
  const tousLesPaiements = colocataires.flatMap((c) =>
    (c.paiements || []).map((p) => ({ ...p, colocataire: c }))
  );

  // (1) Prochaines échéances : dernier paiement de chaque colocataire, trié par échéance croissante
  const prochainesEcheances = colocataires
    .map((c) => ({ colocataire: c, paiement: dernierPaiementDe(c) }))
    .filter((item) => item.paiement !== null)
    .sort((a, b) => new Date(a.paiement.date_echeance) - new Date(b.paiement.date_echeance))
    .slice(0, 5);

  // (3) Montant encaissé par mois sur les 6 derniers mois
  const moisLabels = [];
  const donneesGraphique = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const cle = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleDateString('fr-FR', { month: 'short' });
    moisLabels.push(cle);
    const total = tousLesPaiements
      .filter((p) => {
        const dp = new Date(p.date_paiement);
        return `${dp.getFullYear()}-${dp.getMonth()}` === cle;
      })
      .reduce((sum, p) => sum + parseFloat(p.montant), 0);
    donneesGraphique.push({ mois: label, montant: total });
  }

  // (4) Activité récente : 5 derniers paiements enregistrés
  const activiteRecente = [...tousLesPaiements]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      {/* (6) Bannière d'alerte */}
      {enAlerte > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
          <span>
            ⚠️ {enAlerte} colocataire{enAlerte > 1 ? 's ont' : ' a'} un paiement en retard ou une échéance proche.
          </span>
          <Link to="/colocataires" className="underline hover:text-red-900">
            Voir
          </Link>
        </div>
      )}

      {/* (5) Actions rapides */}
      <div className="flex gap-3 mb-6">
        <Link
          to="/colocataires"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          + Ajouter un colocataire
        </Link>
        <Link
          to="/paiements"
          className="bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50 transition"
        >
          Voir tous les paiements
        </Link>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <CarteStat
          titre="Total colocataires"
          valeur={total}
          couleur="bg-gray-50 border-gray-200 text-gray-800"
          hoverCouleur="hover:bg-gray-100"
        />
        <CarteStat
          titre="À jour"
          valeur={aJour}
          couleur="bg-green-50 border-green-200 text-green-800"
          hoverCouleur="hover:bg-green-100"
        />
        <CarteStat
          titre="En retard / Échéance proche"
          valeur={enAlerte}
          couleur="bg-red-50 border-red-200 text-red-800"
          hoverCouleur="hover:bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
        {/* (1) Prochaines échéances */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Prochaines échéances</h2>
          {prochainesEcheances.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune échéance enregistrée.</p>
          ) : (
            <ul className="space-y-3">
              {prochainesEcheances.map(({ colocataire, paiement }) => {
                const statut = calculerStatut(colocataire);
                return (
                  <li key={colocataire.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {colocataire.prenom} {colocataire.nom}
                      </p>
                      <p className="text-xs text-gray-500">
                        Échéance le {new Date(paiement.date_echeance).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statut.couleur}`}>
                      {joursRestants(paiement.date_echeance)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* (4) Activité récente */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Activité récente</h2>
          {activiteRecente.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun paiement enregistré.</p>
          ) : (
            <ul className="space-y-3">
              {activiteRecente.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {p.colocataire.prenom} {p.colocataire.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      Paiement de {Number(p.montant).toLocaleString('fr-FR')} FCFA ({p.nombre_mois} mois)
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{tempsEcoule(p.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* (3) Graphique des encaissements */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Encaissements des 6 derniers mois</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={donneesGraphique}>
            <XAxis dataKey="mois" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, 'Montant']}
              cursor={{ fill: '#fef3c7' }}
            />
            <Bar dataKey="montant" fill="#b45309" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;