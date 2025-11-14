import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Accueil from './pages/Accueil';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

import Homeowner from './pages/dashboard/homeowner';
import AddPropertyForm from './pages/dashboard/AddPropertyForm';
import RenterDashboard from './pages/dashboard/renter';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ---------- PROTECTED ROUTES ---------- */}
            <Route
              path="/accueil"
              element={
                <ProtectedRoute>
                  <Accueil />
                </ProtectedRoute>
              }
            />

            {/* Dashboard main */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard → Renter */}
            <Route
              path="/dashboard/renter"
              element={
                <ProtectedRoute>
                  <RenterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Dashboard → Homeowner */}
            <Route
              path="/dashboard/homeowner"
              element={
                <ProtectedRoute>
                  <Homeowner />
                </ProtectedRoute>
              }
            />

            {/* Add Property */}
            <Route
              path="/dashboard/AddPropertyForm"
              element={
                <ProtectedRoute>
                  <AddPropertyForm />
                </ProtectedRoute>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
