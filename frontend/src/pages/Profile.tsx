import React from 'react';
import { useAuth } from '../contexts/useAuth';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.roles?.[0]}</p>
      </div>
    </div>
  );
};

export default Profile;
