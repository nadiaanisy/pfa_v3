import './App.css';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from 'next-themes';
/* PROVIDER */
import { Providers } from './miscellaneous/Providers';

/* LAYOUT */
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

/* ROUTE */
import ProtectedRoute from './components/routes/ProtectedRoute';

/* PAGES */
import Login from './pages/auth/Login';
import Registration from './pages/auth/Registration';
import ChangePassword from './pages/auth/ChangePassword';
import Dashboard from './pages/dashboard/Dashboard';
import Settings from './pages/settings/Settings';
import Commitments from './pages/commitments/Commitments';
import IncomeSources from './pages/income-sources/IncomeSources';
import Expenses from './pages/expenses/Expenses';
import DebtTracker from './pages/debt-tracker/DebtTracker';
import Goals from './pages/goals/Goals';
import Analytics from './pages/analytics/Analytics';


export default function App () {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Providers>
        <Toaster
          position="bottom-right"
          richColors
        />
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/forgot-password" element={<ChangePassword />} />
            </Route>
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/income-sources" element={<IncomeSources />} />
              <Route path="/commitments" element={<Commitments />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/debt-tracker" element={<DebtTracker />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Providers>
    </ThemeProvider>
  )
};