import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.username}!</h2>
          
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Roles:</span>{' '}
              {user?.roles.map(role => (
                <span key={role} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                  {role}
                </span>
              ))}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">User ID:</span> {user?.id}
            </p>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              🎉 Authentication is working! You are now logged in.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;