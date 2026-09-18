import React, { useState, useEffect } from 'react';
import { useTheme } from './theme/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

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
  const { currentRole, setCurrentRole, deviceMode } = useTheme();
  const { currentUser } = useAuth();

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
      <Navbar onToggleMobileMenu={() => setIsMobileDrawerOpen(prev => !prev)} />

      {deviceMode === 'mobile' ? (
        /* Mobile Device Frame Mockup Simulation (Max Width safe for all screens) */
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px 12px',
          backgroundColor: '#05070a',
          flex: 1
        }}>
          <div
            style={{
              width: 'min(414px, 100%)',
              height: '840px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '36px',
              border: '10px solid #1e293b',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px var(--primary-glow)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Phone Top Notch / Speaker */}
            <div style={{
              height: '24px',
              backgroundColor: 'var(--bg-sidebar)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10
            }}>
              <div style={{
                width: '100px',
                height: '14px',
                backgroundColor: '#1e293b',
                borderRadius: '0 0 10px 10px'
              }} />
            </div>

            {/* Scrollable Mobile Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 12px 74px 12px'
            }}>
              {renderActiveView()}
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav
              activeTab={activeTab}
              onSelectTab={handleNavigate}
              onOpenMenu={() => setIsMobileDrawerOpen(true)}
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
          />

          <main className="app-main-content">
            {renderActiveView()}
          </main>

          {/* Mobile Bottom Navigation Bar (automatically shown on mobile/tablet) */}
          <MobileNav
            activeTab={activeTab}
            onSelectTab={handleNavigate}
            onOpenMenu={() => setIsMobileDrawerOpen(true)}
          />
        </div>
      )}
    </div>
  );
}
export default App;
