import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import AuthProvider, { AuthCtx } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

import CommunityList from './pages/CommunityList';
import CommunityForm from './pages/CommunityForm';
import CommunityEdit from './pages/CommunityEdit';

import EventList from './pages/EventList';
import EventForm from './pages/EventForm';
import EventEdit from './pages/EventEdit';

/* ───────── helper that decides where "/" should go ───────── */
function RootRedirect() {
  const { user } = React.useContext(AuthCtx);
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* default root */}
          <Route path="/" element={<RootRedirect />} />

          {/* public */}
          <Route path="/login" element={<Login />} />

          {/* ─── Dashboard route ─── */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* ─── Community routes ─── */}
          <Route
            path="/communities"
            element={
              <PrivateRoute>
                <CommunityList />
              </PrivateRoute>
            }
          />
          <Route
            path="/community/new"
            element={
              <PrivateRoute>
                <CommunityForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/community/:id/edit"
            element={
              <PrivateRoute>
                <CommunityEdit />
              </PrivateRoute>
            }
          />

          {/* ─── Event routes ─── */}
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <EventList />
              </PrivateRoute>
            }
          />
          <Route
            path="/event/new"
            element={
              <PrivateRoute>
                <EventForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/event/:id/edit"
            element={
              <PrivateRoute>
                <EventEdit />
              </PrivateRoute>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}