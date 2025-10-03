import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-renart-cream/95 backdrop-blur-sm border-b border-renart-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <button
              className="lg:hidden text-renart-charcoal"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <a href="/" className="flex items-center py-2">
              <img
                src="https://cdn.prod.website-files.com/68234acd8fb1ab421a72b174/6835a18d5509df5179891345_Renart_Social_Primary.png"
                alt="Renart Logo"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-all duration-200 hover:scale-105"
              />
            </a>

            <nav className="hidden lg:flex space-x-8">
              <a href="#collections" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                COLLECTIONS
              </a>
              <a href="#engagement" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                ENGAGEMENT
              </a>
              <a href="#wedding" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                WEDDING
              </a>
              <a href="#bespoke" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                BESPOKE
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-renart-charcoal hover:text-renart-primary transition-colors">
              <Search size={20} />
            </button>
            <button className="text-renart-charcoal hover:text-renart-primary transition-colors">
              <User size={20} />
            </button>
            <button className="text-renart-charcoal hover:text-renart-primary transition-colors">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-renart-gray-200 bg-renart-cream">
            <div className="flex flex-col space-y-4">
              <a href="#collections" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                COLLECTIONS
              </a>
              <a href="#engagement" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                ENGAGEMENT
              </a>
              <a href="#wedding" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                WEDDING
              </a>
              <a href="#bespoke" className="text-sm tracking-wide text-renart-charcoal hover:text-renart-primary transition-colors font-medium">
                BESPOKE
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
