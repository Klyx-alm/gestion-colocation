import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Colocataires from './pages/Colocataires';
import Paiements from './pages/Paiements';
import Parametres from './pages/Parametres';
import Login from './pages/Login';
import RouteProtegee from './components/RouteProtegee';
import { ParametresProvider } from './contexts/ParametresContext';
import { AuthProvider } from './contexts/AuthContext';

function AppLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-sky-100">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ParametresProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RouteProtegee>
                  <AppLayout><Dashboard /></AppLayout>
                </RouteProtegee>
              }
            />
            <Route
              path="/colocataires"
              element={
                <RouteProtegee>
                  <AppLayout><Colocataires /></AppLayout>
                </RouteProtegee>
              }
            />
            <Route
              path="/paiements"
              element={
                <RouteProtegee>
                  <AppLayout><Paiements /></AppLayout>
                </RouteProtegee>
              }
            />
            <Route
              path="/parametres"
              element={
                <RouteProtegee>
                  <AppLayout><Parametres /></AppLayout>
                </RouteProtegee>
              }
            />
          </Routes>
        </BrowserRouter>
      </ParametresProvider>
    </AuthProvider>
  );
}

export default App;