import React, { useState, useEffect } from 'react';
import { useTheme } from './theme/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MobileAppBar } from './components/layout/MobileAppBar';
import {
  Monitor,
  ShieldCheck,
  UserCheck,
  Users,
  Sun,
  Moon,
  Wifi,
  BatteryCharging
} from 'lucide-react';

// Views
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { PurchaseView } from './views/PurchaseView';
import { InspectionView } from './views/InspectionView';
import { EnquiryPipelineView } from './views/EnquiryPipelineView';
import { TestRidesView } from './views/TestRidesView';
import { BookingsView } from './views/BookingsView';
import { SalesInvoicingView } from './views/SalesInvoicingView';
import { ExpensesProfitView } from './views/ExpensesProfitView';
import { CustomersView } from './views/CustomersView';
import { CustomerCatalogView } from './views/CustomerCatalogView';
import { LoginView } from './views/LoginView';
import { useAuth } from './context/AuthContext';

export function App() {
  const {
    currentRole,
    setCurrentRole,
    deviceMode,
    setDeviceMode,
    theme,
    toggleTheme
  } = useTheme();
  const { currentUser, quickLoginAs } = useAuth();

  // Active view tab
  const [activeTab, setActiveTab] = useState(() => {
    return currentRole === 'customer' ? 'catalog' : 'dashboard';
  });

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Cross-view state pass-throughs
  const [targetBikeForInspection, setTargetBikeForInspection] = useState(null);
  const [incomingBookingForSale, setIncomingBookingForSale] = useState(null);

  // Sync tab and role when currentUser logs in or switches
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role !== currentRole) {
        setCurrentRole(currentUser.role);
      }
      if (currentUser.role === 'customer') {
        setActiveTab('catalog');
      } else if (currentUser.role === 'staff' && activeTab === 'dashboard') {
        setActiveTab('inventory');
      }
    }
  }, [currentUser]);

  // Sync tab when role changes
  useEffect(() => {
    if (currentRole === 'customer') {
      setActiveTab('catalog');
    } else if (currentRole === 'staff' && activeTab === 'dashboard') {
      setActiveTab('inventory');
    }
  }, [currentRole]);

  // If user is not logged in, render the dedicated Showroom Login View
  if (!currentUser) {
    return <LoginView />;
  }

  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBikeForInspection = (bike) => {
    setTargetBikeForInspection(bike);
    setActiveTab('inspection');
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToSale = (booking) => {
    setIncomingBookingForSale(booking);
    setActiveTab('sales');
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'inventory':
        return (
          <InventoryView
            onNavigate={handleNavigate}
            onSelectBikeForInspection={handleSelectBikeForInspection}
          />
        );
      case 'purchase':
        return (
          <PurchaseView
            onNavigate={handleNavigate}
            onIntakeComplete={handleSelectBikeForInspection}
          />
        );
      case 'inspection':
        return (
          <InspectionView
            preselectedBike={targetBikeForInspection}
            onNavigate={handleNavigate}
          />
        );
      case 'enquiries':
        return <EnquiryPipelineView onNavigate={handleNavigate} />;
      case 'test-rides':
        return <TestRidesView />;
      case 'bookings':
        return (
          <BookingsView
            onNavigate={handleNavigate}
            onProceedToSale={handleProceedToSale}
          />
        );
      case 'sales':
        return <SalesInvoicingView incomingBooking={incomingBookingForSale} />;
      case 'expenses':
        return <ExpensesProfitView />;
      case 'customers':
        return <CustomersView onNavigate={handleNavigate} />;
      case 'catalog':
        return <CustomerCatalogView />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)', position: 'relative' }}>
      {deviceMode === 'mobile' ? (
        /* Top Simulator Toolstrip for Desktop Viewers */
        <header style={{
          minHeight: '50px',
          backgroundColor: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px',
          gap: '12px',
          flexWrap: 'wrap',
          zIndex: 100
        }}>
          {/* Left Title & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
              📱 Mobile Device View
            </span>
            <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--primary-bg)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
              Retina Phone Simulation
            </span>
          </div>

          {/* Quick Role Switcher in Toolstrip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => { setCurrentRole('admin'); quickLoginAs('admin'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentRole === 'admin' ? 'var(--primary)' : 'transparent',
                color: currentRole === 'admin' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <ShieldCheck size={13} />
              <span>Owner</span>
            </button>
            <button
              type="button"
              onClick={() => { setCurrentRole('staff'); quickLoginAs('staff'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentRole === 'staff' ? 'var(--primary)' : 'transparent',
                color: currentRole === 'staff' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <UserCheck size={13} />
              <span>Staff</span>
            </button>
            <button
              type="button"
              onClick={() => { setCurrentRole('customer'); quickLoginAs('customer'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: currentRole === 'customer' ? 'var(--primary)' : 'transparent',
                color: currentRole === 'customer' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <Users size={13} />
              <span>Customer</span>
            </button>
          </div>

          {/* Right Action: Return to Desktop View */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--primary-border)',
                backgroundColor: 'var(--primary-bg)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Monitor size={15} />
              <span>Return to Desktop View</span>
            </button>
          </div>
        </header>
      ) : (
        <Navbar onToggleMobileMenu={() => setIsMobileDrawerOpen(prev => !prev)} />
      )}

      {deviceMode === 'mobile' ? (
        /* Mobile Device Frame Mockup Simulation */
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px 12px',
          backgroundColor: '#05070a',
          flex: 1
        }}>
          <div className="phone-mockup-frame">
            {/* Phone Top Notch & Status Bar */}
            <div style={{
              height: '34px',
              backgroundColor: 'var(--bg-sidebar)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 18px',
              position: 'relative',
              zIndex: 70,
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              userSelect: 'none'
            }}>
              <span>9:41</span>
              {/* Centered Camera/Speaker Notch */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                width: '116px',
                height: '18px',
                backgroundColor: '#1e293b',
                borderRadius: '0 0 12px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <div style={{ width: '40px', height: '4px', backgroundColor: '#334155', borderRadius: '4px' }} />
                <div style={{ width: '8px', height: '8px', backgroundColor: '#0f172a', borderRadius: '50%', border: '1px solid #334155' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Wifi size={13} />
                <BatteryCharging size={14} />
              </div>
            </div>

            {/* Mobile App Bar Inside the Phone Frame */}
            <MobileAppBar onToggleMobileMenu={() => setIsMobileDrawerOpen(prev => !prev)} />

            {/* Navigation Drawer scoped inside phone frame */}
            <Sidebar
              activeTab={activeTab}
              onSelectTab={handleNavigate}
              isMobileDrawerOpen={isMobileDrawerOpen}
              onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
              isInsideMockup={true}
            />

            {/* Scrollable Mobile Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 12px 76px 12px'
            }}>
              {renderActiveView()}
            </div>

            {/* Mobile Bottom Navigation Inside the Phone Frame */}
            <MobileNav
              activeTab={activeTab}
              onSelectTab={handleNavigate}
              onOpenMenu={() => setIsMobileDrawerOpen(true)}
              isInsideMockup={true}
            />
          </div>
        </div>
      ) : (
        /* Standard Responsive Showroom Layout (Fluid for Mobile, Tablet & Desktop) */
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleNavigate}
            isMobileDrawerOpen={isMobileDrawerOpen}
            onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            isInsideMockup={false}
          />

          <main className="app-main-content">
            {renderActiveView()}
          </main>

          {/* Mobile Bottom Navigation Bar (automatically shown on mobile/tablet screens) */}
          <MobileNav
            activeTab={activeTab}
            onSelectTab={handleNavigate}
            onOpenMenu={() => setIsMobileDrawerOpen(true)}
            isInsideMockup={false}
          />
        </div>
      )}
    </div>
  );
}
export default App;
