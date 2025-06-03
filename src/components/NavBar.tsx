import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Home, Calendar, LineChart, User, Menu, X } from 'lucide-react';

const NavBar: React.FC = () => {
  const { isLoggedIn, user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="bg-fitness-primary text-black shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="font-bold text-xl text-black">
              GlowUp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="p-2 rounded hover:bg-blue-600 transition flex items-center gap-1">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/workout" className="p-2 rounded hover:bg-blue-600 transition flex items-center gap-1">
              <LineChart size={18} />
              <span>Workout Plan</span>
            </Link>
            <Link to="/progress" className="p-2 rounded hover:bg-blue-600 transition flex items-center gap-1">
              <Calendar size={18} />
              <span>Progress</span>
            </Link>
            <Link to="/profile" className="p-2 rounded hover:bg-blue-600 transition flex items-center gap-1">
              <User size={18} />
              <span>Profile</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="text-sm">
              <span className="font-bold">{user?.name}</span>
              <span className="ml-2 bg-fitness-accent text-white px-2 py-1 rounded-full text-xs">
                {user?.level}
              </span>
            </div>
            <Button variant="outline" className="text-white border-white hover:bg-blue-700" onClick={logout}>
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 pb-4">
            <Link
              to="/dashboard"
              className="block p-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/workout"
              className="block p-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <LineChart size={18} />
              <span>Workout Plan</span>
            </Link>
            <Link
              to="/progress"
              className="block p-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar size={18} />
              <span>Progress</span>
            </Link>
            <Link
              to="/profile"
              className="block p-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
            <div className="mt-2 pt-2 border-t border-blue-600 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-bold">{user?.name}</span>
                <span className="ml-2 bg-fitness-accent text-white px-2 py-1 rounded-full text-xs">
                  {user?.level}
                </span>
              </div>
              <Button variant="outline" className="text-white border-white" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
