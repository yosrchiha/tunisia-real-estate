import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
}

/**
 * Register a new user
 */
export const register = async (
  username: string,
  email: string,
  password: string,
  role: string = 'buyer'
): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password,
    role,
  });
  return response.data;
};

/**
 * Login user
 */
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  
  // Save token and user to localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored user
 */
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};