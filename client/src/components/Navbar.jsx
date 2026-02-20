import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { buttonStyles } from "../styles/buttonStyles";

export default function Navbar() {
  const location = useLocation();
  const { isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? "text-blue-400" : "text-white";

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/gallery", label: "Gallery" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    ...(isAdmin ? [{ path: "/admin", label: "Admin" }] : [])
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md text-white border-b border-white/10">
      <div className="px-6 py-4 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl hover:text-blue-400 transition">
          ArtAuction
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`${isActive(path)} hover:text-blue-400 transition font-medium`}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <button
              onClick={logout}
              className={buttonStyles.secondary}
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-2xl"
        >
          ≡
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-gray-700 px-6 py-4 space-y-3">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block ${isActive(path)} hover:text-blue-400 transition font-medium`}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
