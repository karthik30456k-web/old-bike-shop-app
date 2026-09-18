import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import {
  Bike,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  UserCheck,
  Users,
  Compass
} from 'lucide-react';

export const LoginView = () => {
  const { login, quickLoginAs, loginAsGuest, demoAccounts, loading } = useAuth();
  const { theme, toggleTheme, accent, setAccent, paletteList } = useTheme();

  const [email, setEmail] = useState('owner@velocebikes.com');
  const [password, setPassword] = useState('dealer2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Please enter your email address or username.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = await login(email.trim(), password.trim());
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials. Try using one of the Quick Demo Logins below.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Ambient Radial Lighting Glow (Zero CPU, pure CSS) */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '450px',
        background: 'radial-gradient(ellipse at center, var(--primary-glow) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Top Navbar Utility Strip */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 18px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Bike size={22} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              VELOCE WHEELS
            </span>
            <span style={{
              fontSize: '0.7rem',
              marginLeft: '8px',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-bg)',
              color: 'var(--primary)',
              fontWeight: 700
            }}>
              ERP v2.4
            </span>
          </div>
        </div>

        {/* Theme & Palette Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {paletteList.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.name}
                onClick={() => setAccent(p.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  border: accent === p.id ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.1)',
                  boxShadow: accent === p.id ? `0 0 8px ${p.color}` : 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle Dark / Light Mode"
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          {/* Card Top Banner */}
          <div style={{
            padding: '22px 20px 18px 20px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-surface-elevated)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              margin: '0 0 6px 0',
              color: 'var(--text-primary)'
            }}>
              Showroom Portal Sign In
            </h2>
            <p style={{
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.4
            }}>
              Manage two-wheeler inventory, 4-angle inspections, POS invoicing, and customer bookings.
            </p>
          </div>

          {/* Form Content */}
          <div style={{ padding: '20px 18px' }}>
            {errorMessage && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#dc2626',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '18px'
              }}>
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Email / Username Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '6px'
                }}>
                  Official Email or Username
                </label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    color: 'var(--text-muted)',
                    display: 'flex'
                  }}>
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. owner@velocebikes.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      fontSize: '0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                  }}>
                    Password
                  </label>
                  <span style={{ fontSize: '0.76rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => alert('For showroom demo, use the 1-click quick logins below.')}>
                    Forgot Password?
                  </span>
                </div>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    color: 'var(--text-muted)',
                    display: 'flex'
                  }}>
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 38px',
                      fontSize: '0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Remember my session on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '4px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-text)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Showroom ERP'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '24px 0 16px 0'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Or 1-Click Quick Demo Sign-In
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            </div>

            {/* Quick Demo Logins Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => quickLoginAs(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid var(--border-color)'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {acc.badgeIcon} {acc.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {acc.roleTitle}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: acc.role === 'admin' ? 'rgba(29, 78, 216, 0.15)' : acc.role === 'staff' ? 'rgba(51, 65, 85, 0.15)' : 'rgba(4, 120, 87, 0.15)',
                    color: acc.role === 'admin' ? '#1d4ed8' : acc.role === 'staff' ? '#334155' : '#047857'
                  }}>
                    Sign In →
                  </span>
                </button>
              ))}
            </div>

            {/* Guest Customer Catalog Direct Access */}
            <div style={{ marginTop: '18px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={loginAsGuest}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--primary)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'underline'
                }}
              >
                <Compass size={14} />
                <span>Continue as Guest Customer (Browse 3D Virtual Showroom)</span>
              </button>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-input)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
            <span>256-Bit Encrypted Showroom Session • GST & RTO Compliant</span>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '14px 20px',
        fontSize: '0.76rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        zIndex: 10
      }}>
        © 2026 Veloce Wheels Dealership Management System. All rights reserved.
      </footer>
    </div>
  );
};
