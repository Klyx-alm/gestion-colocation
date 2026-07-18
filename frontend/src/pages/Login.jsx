import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useParametres } from '../contexts/ParametresContext';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);
  const { login } = useAuth();
const { recharger } = useParametres();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErreur('');
    setEnCours(true);
login(email, password)
  .then(() => {
    recharger();
    navigate('/');
  })
      .catch((error) => {
        if (error.response?.status === 422) {
          setErreur('Identifiants incorrects.');
        } else {
          setErreur('Une erreur est survenue.');
        }
      })
      .finally(() => setEnCours(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg p-10 w-full max-w-sm mx-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connexion</h1>

        {erreur && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-4">{erreur}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          <button
            type="submit"
            disabled={enCours}
            className="w-full bg-amber-700 text-white text-base font-semibold px-4 py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
          >
            {enCours ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;