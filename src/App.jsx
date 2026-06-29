import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getState } from './store';
import Onboarding       from './screens/Onboarding';
import Home             from './screens/Home';
import Learn            from './screens/Learn';
import Activity         from './screens/Activity';
import Badges           from './screens/Badges';
import ParentDashboard  from './screens/ParentDashboard';

function RequireOnboarding({ children }) {
  const { onboarded } = getState();
  return onboarded ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={
          <RequireOnboarding><Home /></RequireOnboarding>
        } />
        <Route path="/learn" element={
          <RequireOnboarding><Learn /></RequireOnboarding>
        } />
        <Route path="/learn/:zoneId" element={
          <RequireOnboarding><Learn /></RequireOnboarding>
        } />
        <Route path="/activity/:activityId" element={
          <RequireOnboarding><Activity /></RequireOnboarding>
        } />
        <Route path="/badges" element={
          <RequireOnboarding><Badges /></RequireOnboarding>
        } />
        <Route path="/parent" element={
          <RequireOnboarding><ParentDashboard /></RequireOnboarding>
        } />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
