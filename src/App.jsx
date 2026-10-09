import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toast } from './components/ui.jsx';
import { useApp } from './state/AppState.jsx';
import SignIn from './pages/SignIn.jsx';
import TenantHome from './pages/tenant/TenantHome.jsx';
import RepairHub from './pages/tenant/RepairHub.jsx';
import ReportIssue from './pages/tenant/ReportIssue.jsx';
import AiTriage from './pages/tenant/AiTriage.jsx';
import ReviewUrgency from './pages/tenant/ReviewUrgency.jsx';
import RepairTracker from './pages/tenant/RepairTracker.jsx';
import Inspection from './pages/tenant/Inspection.jsx';
import UnitKeys from './pages/tenant/UnitKeys.jsx';
import Portfolio from './pages/landlord/Portfolio.jsx';
import PropertyPortal from './pages/landlord/PropertyPortal.jsx';
import VendorSelection from './pages/landlord/VendorSelection.jsx';
import TriageQueue from './pages/landlord/TriageQueue.jsx';
import Vendors from './pages/landlord/Vendors.jsx';
import Account from './pages/landlord/Account.jsx';
import AutoApproval from './pages/landlord/AutoApproval.jsx';
import Financials from './pages/landlord/Financials.jsx';

export default function App() {
  const { pathname } = useLocation();
  const { setRole } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Keep the active persona in sync with whichever side of the app is open.
    if (pathname.startsWith('/tenant')) setRole('tenant');
    else if (pathname.startsWith('/landlord')) setRole('landlord');
  }, [pathname, setRole]);

  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/tenant/home" element={<TenantHome />} />
        <Route path="/tenant/repairs" element={<RepairHub />} />
        <Route path="/tenant/report" element={<ReportIssue />} />
        <Route path="/tenant/triage" element={<AiTriage />} />
        <Route path="/tenant/review" element={<ReviewUrgency />} />
        <Route path="/tenant/tracker" element={<RepairTracker />} />
        <Route path="/tenant/inspection" element={<Inspection />} />
        <Route path="/tenant/unit" element={<UnitKeys />} />
        <Route path="/landlord/portfolio" element={<Portfolio />} />
        <Route path="/landlord/property/:id" element={<PropertyPortal />} />
        <Route path="/landlord/dispatch" element={<VendorSelection />} />
        <Route path="/landlord/triage" element={<TriageQueue />} />
        <Route path="/landlord/vendors" element={<Vendors />} />
        <Route path="/landlord/account" element={<Account />} />
        <Route path="/landlord/auto-approval" element={<AutoApproval />} />
        <Route path="/landlord/financials" element={<Financials />} />
        <Route path="/landlord/financials/:id" element={<Financials />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
