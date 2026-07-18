export function calculerStatut(colocataire) {
  if (!colocataire.paiements || colocataire.paiements.length === 0) {
    return { label: 'En retard', couleur: 'bg-red-100 text-red-700' };
  }

  const dernierPaiement = dernierPaiementDe(colocataire);
  const echeance = new Date(dernierPaiement.date_echeance);
  const aujourdHui = new Date();
  const diffJours = Math.ceil((echeance - aujourdHui) / (1000 * 60 * 60 * 24));

  if (diffJours < 0) {
    return { label: 'En retard', couleur: 'bg-red-100 text-red-700' };
  }
  if (diffJours <= 7) {
    return { label: 'Échéance proche', couleur: 'bg-amber-100 text-amber-700' };
  }
  return { label: 'À jour', couleur: 'bg-green-100 text-green-700' };
}

export function dernierPaiementDe(colocataire) {
  if (!colocataire.paiements || colocataire.paiements.length === 0) return null;
  return colocataire.paiements.reduce((plusRecent, p) =>
    new Date(p.date_echeance) > new Date(plusRecent.date_echeance) ? p : plusRecent
  );
}
export function paiementLePlusRecent(colocataire) {
  if (!colocataire.paiements || colocataire.paiements.length === 0) return null;
  return colocataire.paiements.reduce((plusRecent, p) =>
    new Date(p.created_at) > new Date(plusRecent.created_at) ? p : plusRecent
  );
}