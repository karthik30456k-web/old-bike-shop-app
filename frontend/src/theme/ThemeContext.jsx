import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme mode: light (default clean corporate) / dark (executive slate)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('velo_theme_corporate') || 'light';
  });

  // Executive Corporate Color Schemes:
  // 'cobalt' (Default - Corporate Banking & Automotive Trust Blue #1d4ed8)
  // 'titanium' (Modern Executive Slate/Graphite #334155)
  // 'navy' (Deep Oxford Navy #1e3a8a)
  // 'emerald' (Heritage Enterprise Emerald #047857)
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('velo_accent_corporate') || 'cobalt';
  });

  // Active Role: 'admin' | 'staff' | 'customer'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('velo_role') || 'admin';
  });

  // Device simulation: 'desktop' | 'mobile'
  const [deviceMode, setDeviceMode] = useState('desktop');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('velo_theme_corporate', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    localStorage.setItem('velo_accent_corporate', accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem('velo_role', currentRole);
  }, [currentRole]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const paletteList = [
    { id: 'cobalt', name: 'Executive Cobalt Blue', color: '#1d4ed8', description: 'Enterprise Automotive Blue' },
    { id: 'titanium', name: 'Titanium Graphite', color: '#334155', description: 'Minimalist Tech Slate' },
    { id: 'navy', name: 'Deep Oxford Navy', color: '#1e3a8a', description: 'Luxury Dealership Navy' },
    { id: 'emerald', name: 'Corporate Forest Emerald', color: '#047857', description: 'Heritage Precision Green' }
  ];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        accent,
        setAccent,
        paletteList,
        currentRole,
        setCurrentRole,
        deviceMode,
        setDeviceMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
