import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParametres } from '../contexts/ParametresContext';
import { useAuth } from '../contexts/AuthContext';

const liens = [
  { to: '/', label: 'Tableau de bord', exact: true, icone: '📊' },
  { to: '/colocataires', label: 'Colocataires', icone: '👥' },
  { to: '/paiements', label: 'Paiements', icone: '💳' },
  { to: '/parametres', label: 'Paramètres', icone: '⚙️' },
];

function Sidebar() {
  const { parametres } = useParametres();
  const [ouvert, setOuvert] = useState(false);
  const { logout } = useAuth();
const navigate = useNavigate();

  const contenu = (
    <>
      <div className="px-6 py-8 text-white font-bold text-xl border-b border-amber-500/40 flex items-center justify-between">
        {parametres.nom_app}
        <button
          onClick={() => setOuvert(false)}
          className="md:hidden text-white text-2xl leading-none"
          aria-label="Fermer le menu"
        >
          ×
        </button>
      </div>
      <nav className="flex flex-col gap-5 px-5 py-8">
        {liens.map((lien) => (
          <NavLink
            key={lien.to}
            to={lien.to}
            end={lien.exact}
            onClick={() => setOuvert(false)}
            className={({ isActive }) =>
              `group flex items-center gap-4 px-5 py-5 rounded-xl text-base font-semibold transition-all duration-300 ease-out transform ${
                isActive
                  ? 'bg-white text-amber-800 shadow-lg scale-[1.03]'
                  : 'text-amber-50 hover:bg-amber-500/40 hover:scale-[1.02] hover:shadow-md'
              }`
            }
          >
            <span className="text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
              {lien.icone}
            </span>
            {lien.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-5 py-6">
  <button
    onClick={() => logout().then(() => navigate('/login'))}
    className="w-full text-left px-5 py-3 rounded-xl text-sm font-semibold text-amber-100 hover:bg-red-800/40 transition"
  >
    🚪 SE DÉCONNECTER
  </button>
</div>
    </>
  );

  return (
    <>
      {/* Barre supérieure mobile avec bouton hamburger */}
      <div className="md:hidden flex items-center justify-between bg-amber-700 text-white px-4 py-4">
        <span className="font-bold text-lg">{parametres.nom_app}</span>
        <button
          onClick={() => setOuvert(true)}
          className="text-2xl leading-none"
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
      </div>

      {/* Sidebar fixe sur desktop */}
      <aside className="hidden md:flex w-64 min-h-screen bg-gradient-to-b from-amber-600 to-yellow-700 text-amber-50 flex-col">
        {contenu}
      </aside>

      {/* Tiroir mobile + overlay */}
      {ouvert && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-gradient-to-b from-amber-600 to-yellow-700 text-amber-50 flex flex-col min-h-screen">
            {contenu}
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOuvert(false)}
          />
        </div>

      )}
      
    </>
  );
}

export default Sidebar;