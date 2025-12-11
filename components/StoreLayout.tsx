import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Instagram, MapPin, Phone } from 'lucide-react';
import { STORE_INFO } from '../constants';
import { getCart } from '../services/storageService';

const StoreLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    // Custom event for immediate updates within the same tab
    window.addEventListener('cart-updated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-iza-beige text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-iza-mint">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-iza-green tracking-tight">
            IZA<span className="text-iza-brown font-light">plantas</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-iza-green transition">Home</Link>
            <Link to="/shop" className="hover:text-iza-green transition">Loja</Link>
            <Link to="/contact" className="hover:text-iza-green transition">Contato</Link>
            <Link to="/admin" className="text-gray-400 hover:text-iza-green transition text-xs flex items-center">Admin</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 hover:bg-iza-mint rounded-full transition group">
              <ShoppingCart className="w-6 h-6 text-iza-green" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-iza-brown text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-iza-green" /> : <Menu className="w-6 h-6 text-iza-green" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-iza-mint">
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/" className="text-gray-700 hover:text-iza-green" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="text-gray-700 hover:text-iza-green" onClick={() => setIsMenuOpen(false)}>Loja</Link>
              <Link to="/contact" className="text-gray-700 hover:text-iza-green" onClick={() => setIsMenuOpen(false)}>Contato</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-iza-green text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-iza-mint">IZAplantas</h3>
              <p className="text-iza-beige/80 text-sm leading-relaxed">
                Trazendo a natureza para perto de você. Plantas, vasos e todo suporte para seu jardim.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-iza-mint">Contato</h3>
              <ul className="space-y-2 text-sm text-iza-beige/80">
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {STORE_INFO.whatsappDisplay}</li>
                <li className="flex items-center"><Instagram className="w-4 h-4 mr-2" /> {STORE_INFO.instagram}</li>
                <li className="flex items-start"><MapPin className="w-4 h-4 mr-2 mt-1" /> {STORE_INFO.address}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-iza-mint">Horários</h3>
              <p className="text-sm text-iza-beige/80 whitespace-pre-line">{STORE_INFO.hours.replace('|', '\n')}</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs text-iza-beige/60">
            &copy; {new Date().getFullYear()} IZAplantas. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreLayout;