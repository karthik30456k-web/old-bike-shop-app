import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// Pre-configured demo accounts for fast access
export const DEMO_ACCOUNTS = [
  {
    id: 'usr-1',
    name: 'Suresh Kumar',
    email: 'owner@velocebikes.com',
    role: 'admin',
    roleTitle: 'Dealership Owner / Admin',
    badgeIcon: '👑',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98401 23456'
  },
  {
    id: 'usr-2',
    name: 'Karthik Raja',
    email: 'karthik@velocebikes.com',
    role: 'staff',
    roleTitle: 'Chief Mechanic & Lead Sales',
    badgeIcon: '💼',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98402 34567'
  },
  {
    id: 'usr-3',
    name: 'Anand Natarajan',
    email: 'anand.customer@gmail.com',
    role: 'customer',
    roleTitle: 'Verified Buyer / Customer',
    badgeIcon: '🛵',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98403 45678'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('velo_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('velo_auth_token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('velo_auth_user', JSON.stringify(currentUser));
      localStorage.setItem('velo_role', currentUser.role);
    } else {
      localStorage.removeItem('velo_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('velo_auth_token', authToken);
    } else {
      localStorage.removeItem('velo_auth_token');
    }
  }, [authToken]);

  /**
   * Standard email + password login
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      // First try backend API
      try {
        const response = await api.login({ email, password });
        if (response && response.success && response.user) {
          setCurrentUser(response.user);
          setAuthToken(response.token || `token_${Date.now()}`);
          setLoading(false);
          return { success: true, user: response.user };
        }
      } catch {
        // Fallback to local demo list match if backend is unreachable
      }

      // Check against demo accounts
      const matched = DEMO_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === (email || '').trim().toLowerCase()
      );

      if (matched) {
        setCurrentUser(matched);
        setAuthToken(`token_${matched.id}_${Date.now()}`);
        setLoading(false);
        return { success: true, user: matched };
      }

      // Generic user fallback for custom email
      const customUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'staff',
        roleTitle: 'Showroom Associate',
        badgeIcon: '💼',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        phone: '+91 98400 00000'
      };

      setCurrentUser(customUser);
      setAuthToken(`token_${customUser.id}_${Date.now()}`);
      setLoading(false);
      return { success: true, user: customUser };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Fast 1-click login for demo accounts
   */
  const quickLoginAs = (roleOrAccount) => {
    let target = null;
    if (typeof roleOrAccount === 'string') {
      target = DEMO_ACCOUNTS.find((acc) => acc.role === roleOrAccount) || DEMO_ACCOUNTS[0];
    } else {
      target = roleOrAccount;
    }
    setCurrentUser(target);
    setAuthToken(`token_${target.id}_${Date.now()}`);
    return target;
  };

  /**
   * Quick guest login into Customer Catalog
   */
  const loginAsGuest = () => {
    const guestUser = {
      id: 'usr-guest',
      name: 'Guest Customer',
      email: 'guest@velocebikes.com',
      role: 'customer',
      roleTitle: 'Showroom Visitor',
      badgeIcon: '🛵',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      phone: ''
    };
    setCurrentUser(guestUser);
    setAuthToken('token_guest');
    return guestUser;
  };

  /**
   * Logout and clear session
   */
  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('velo_auth_user');
    localStorage.removeItem('velo_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        authToken,
        isAuthenticated: Boolean(currentUser),
        loading,
        login,
        quickLoginAs,
        loginAsGuest,
        logout,
        demoAccounts: DEMO_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
