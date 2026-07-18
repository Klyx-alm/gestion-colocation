import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const ParametresContext = createContext(null);

export function ParametresProvider({ children }) {
  const [parametres, setParametres] = useState({
    nom_app: 'Gestion Colocation',
    rappel_jours_min: 3,
    rappel_jours_max: 5,
    rappel_actif: true,
  });

  const recharger = () => {
    if (!localStorage.getItem('token')) return;
    api.get('/parametres').then((response) => setParametres(response.data));
  };

  useEffect(() => {
    recharger();
  }, []);

  return (
    <ParametresContext.Provider value={{ parametres, recharger }}>
      {children}
    </ParametresContext.Provider>
  );
}

export function useParametres() {
  return useContext(ParametresContext);
}