import React from 'react';
import { useAuth } from '../../contexts/useAuth';

import { useNavigate } from 'react-router-dom';

const homeowner: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddProperty = (listingType: 'sale' | 'rent') => {
    navigate(`/dashboard/AddPropertyForm?type=${listingType}`);

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Homeowner Dashboard</h1>
          <span className="text-gray-600">Hello, {user?.username}</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Add a New Property</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <button
            onClick={() => handleAddProperty('sale')}
            className="bg-green-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          >
            Sell a Property
          </button>
          <button
            onClick={() => handleAddProperty('rent')}
            className="bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Rent a Property
          </button>
        </div>
      </main>
    </div>
  );
};

export default homeowner;
