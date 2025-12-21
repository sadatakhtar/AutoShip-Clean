import { Routes, Route } from 'react-router-dom';
import MainLayout from '../src/layout/MainLayout';
import AuthLayout from '../src/layout/AuthLayout';
import Home from '../src/pages/Home';
import About from '../src/pages/About';
import DashboardPage from '../src/pages/DashboardPage';
import LoginPage from '../src/pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ProtectedRoute from './components/auth/ProtectedRoutes';
import RegisterPage from './pages/RegisterPage';
import AdminRoute from './components/auth/AdminRoute';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPasswordPage';
import ResetPassword from './pages/ResetPasswordPage';

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AdminRoute>
              <RegisterPage /> {/*Admin only page */}
            </AdminRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
