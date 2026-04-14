import { useAuthenticator } from '@aws-amplify/ui-react';
import { ChessKing, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center gap-2 text-white font-medium text-2xl lg:text-3xl p-4">
      <div className="flex items-center gap-2">
        <ChessKing />
        <span className="font-heading">Ace the Interview + AI</span>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-custom-dark border border-custom-secondary-accent/30 rounded-lg shadow-lg py-2 z-50 text-sm font-normal">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-white/70 border-b border-custom-secondary-accent/20">
                  {user.signInDetails?.loginId}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:text-white/60 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="block px-4 py-2 text-sm text-white hover:text-white/60 transition-colors"
              >
                Sign in
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;