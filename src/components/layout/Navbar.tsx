import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, User, X, Hospital, Pill } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold text-primary">MedicHub Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/find-doctors" className="text-gray-700 hover:text-primary">
            Find Doctors
          </Link>
          <Link to="/specialists" className="text-gray-700 hover:text-primary flex items-center">
            <User className="h-4 w-4 mr-1" /> Specialists
          </Link>
          <Link to="/hospitals" className="text-gray-700 hover:text-primary flex items-center">
            <Hospital className="h-4 w-4 mr-1" /> Hospitals
          </Link>
          <Link to="/medicines" className="text-gray-700 hover:text-primary flex items-center">
            <Pill className="h-4 w-4 mr-1" /> Medicines
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
              <Link to="/profile">
                <Button className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login / Signup</Button>
              </Link>
              <Button className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>For Doctors</span>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t pt-2 pb-4 px-4">
          <nav className="flex flex-col space-y-3">
            <Link to="/find-doctors" className="text-gray-700 hover:text-primary py-2 flex items-center">
              Find Doctors
            </Link>
            <Link to="/specialists" className="text-gray-700 hover:text-primary py-2 flex items-center">
              <User className="h-4 w-4 mr-2" /> Specialists
            </Link>
            <Link to="/hospitals" className="text-gray-700 hover:text-primary py-2 flex items-center">
              <Hospital className="h-4 w-4 mr-2" /> Hospitals
            </Link>
            <Link to="/medicines" className="text-gray-700 hover:text-primary py-2 flex items-center">
              <Pill className="h-4 w-4 mr-2" /> Medicines
            </Link>
            <div className="pt-3 flex flex-col space-y-3">
              {user ? (
                <>
                  <Button variant="outline" onClick={handleSignOut} className="w-full justify-center">
                    Sign Out
                  </Button>
                  <Link to="/profile">
                    <Button className="w-full justify-center">
                      Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full justify-center">
                      Login / Signup
                    </Button>
                  </Link>
                  <Button className="w-full justify-center">
                    For Doctors
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
