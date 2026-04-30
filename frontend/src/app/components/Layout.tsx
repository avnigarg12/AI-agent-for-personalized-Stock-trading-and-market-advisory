import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, MessageSquare, Briefcase, TrendingUp, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import logo from "../../assets/logo.png";
import { AttractiveBackground } from "./AttractiveBackground";

export function Layout() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if dark mode is set in localStorage or default to true
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode === null ? true : savedMode === 'true';
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const loadUserName = () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const parsed = JSON.parse(user);
          if (parsed.fullName) {
            setUserName(parsed.fullName.split(' ')[0]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadUserName();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('investorProfile');
    navigate('/login');
  };

  const location = useLocation();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/advisor", label: "AI Advisory", icon: MessageSquare },
    { to: "/portfolio", label: "Portfolio", icon: Briefcase },
    { to: "/market", label: "Market Analysis", icon: TrendingUp },
    { to: "/settings", label: "Settings", icon: Settings },
  ];


  return (
    <div className="flex h-screen bg-transparent relative overflow-hidden">
      <AttractiveBackground variant="dashboard" />
      {/* Sidebar - Glassmorphism Effect */}
      <aside className="w-64 bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border flex flex-col z-20">
        <div className="p-8 border-b border-sidebar-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight flex-1">
            TradeMind AI
          </h1>
        </div>

        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
          
          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm font-semibold mb-1">💡 AI Tip</p>
            <p className="text-xs opacity-90">
              Diversification reduces risk. Consider spreading investments across sectors.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col relative z-10">
        {/* Top Bar - Glassmorphism */}
        <div className="border-b border-border/50 bg-background/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Dynamic Header based on location */}
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={location.pathname}
              className="text-xl md:text-2xl font-black bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight"
            >
              {location.pathname === '/dashboard' ? (userName ? `Welcome ${userName}!` : 'Welcome!') : navItems.find(i => i.to === location.pathname)?.label || 'TradeMind AI'}
            </motion.h2>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full hover:bg-primary/10 transition-all duration-300"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </Button>
          </div>
        </div>

        
        {/* Page Content with Animation */}
        <div className="flex-1 overflow-x-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-8 flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
