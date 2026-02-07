import {
  KeyRound,
  LogIn,
  UserPlus
} from 'lucide-react';
import {
  Outlet,
  useLocation
} from 'react-router-dom';
import { motion } from 'motion/react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function AuthLayout() {
  const location = useLocation();

  const iconImage = (() => {
    switch (location.pathname) {
      case '/register':
        return UserPlus;
      case '/forgot-password':
        return KeyRound;
      default:
        return LogIn;
    }
  })();

  const IconImage = iconImage;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1628367282397-bf7cb7d6e4b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHNvZnQlMjBncmFkaWVudCUyMGJsdXIlMjBwdXJwbGUlMjBwaW5rJTIwYmx1ZSUyMGRhcmslMjBpcmlkZXNjZW50fGVufDF8fHx8MTc3MDA1OTEwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="h-full w-full object-cover opacity-80 dark:opacity-40"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-xl dark:bg-black/30" />
      </div>

      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-black/60 px-8 py-10 sm:px-12"
      >
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-3 shadow-lg">
            <IconImage className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <Outlet />
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-6 z-10 text-xs text-slate-600 dark:text-slate-400"
      >
        © 2026. All rights reserved.
      </motion.p>
    </div>
  );
}
