import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserNav } from "./user-nav";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, loading,logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-blue-600">
          PartTimer
        </a>
        <nav className="hidden md:flex space-x-6">
          <Link
            to={`services`}
            className="text-gray-600 hover:text-blue-600 transition-colors">
            Services
          </Link>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition-colors">
            How It Works
          </a>
          <a
            href="#post-request"
            className="text-gray-600 hover:text-blue-600 transition-colors">
            Post a Request
          </a>
        </nav>
        <Button className="hidden md:inline-flex">Sign Up</Button>
        <button onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white px-4 py-2 flex flex-col space-y-2">
          <a
            href="#services"
            className="text-gray-600 hover:text-blue-600 transition-colors">
            Services
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-blue-600 transition-colors">
            How It Works
          </a>
          <a
            href="#post-request"
            className="text-gray-600 hover:text-blue-600 transition-colors">
            Post a Request
          </a>
          {user? <UserNav logout={logout} user={user} />:<Button className="w-full">
            <Link to="/login">Sign In</Link>
          </Button>}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
