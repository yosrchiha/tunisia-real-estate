import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const Accueil: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (!user || !user.roles || user.roles.length === 0) return;

    const role = user.roles[0];
    switch (role) {
      case 'renter':
        navigate('/dashboard/renter');
        break;
      case 'homeowner':
        navigate('/dashboard/homeowner');
        break;
      case 'buyer':
        navigate('/dashboard/buyer');
        break;
      default:
        navigate('/dashboard');
        break;
    }
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar simplifiée */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tunisia Real Estate</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hello, {user?.username} 👋</span>
            <button
              onClick={goToProfile}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Section principale */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-6">
          Welcome Back, {user?.username}!
        </h2>
        <p className="text-lg md:text-xl text-gray-700 text-center mb-10 max-w-2xl">
          Explore properties, manage your listings, or check your activity with just one click. 
          Your personalized dashboard is ready for you.
        </p>

        <div className="flex gap-4">
          <button
            onClick={goToDashboard}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-shadow shadow-lg"
          >
            Go to Dashboard
          </button>
          <button
            onClick={goToProfile}
            className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-shadow shadow-md"
          >
            Profile
          </button>
        </div>

        {/* Sections style cartes */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">Find Properties</h3>
            <p className="text-gray-600">
              Browse the best properties across Tunisia tailored to your needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">Manage Listings</h3>
            <p className="text-gray-600">
              Easily manage your properties, track visits, and update details.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold mb-2">Check Activity</h3>
            <p className="text-gray-600">
              See all your recent activities and stay updated with notifications.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Accueil;
