import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-renart-charcoal text-renart-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img
              src="https://cdn.prod.website-files.com/68234acd8fb1ab421a72b174/6835bd10469b1259f48af473_Renart_Logo_White.svg"
              alt="Renart Logo"
              className="h-12 w-auto object-contain mb-6"
            />
            <p className="text-sm leading-relaxed text-renart-gray-400">
              Crafting timeless elegance through exquisite jewelry design since our inception.
              Each piece tells a unique story of love and commitment.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-renart-cream mb-4 tracking-wide">EXPLORE</h4>
            <ul className="space-y-3">
              <li>
                <a href="#collections" className="text-sm hover:text-renart-accent transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="#engagement" className="text-sm hover:text-renart-accent transition-colors">
                  Engagement Rings
                </a>
              </li>
              <li>
                <a href="#wedding" className="text-sm hover:text-renart-accent transition-colors">
                  Wedding Bands
                </a>
              </li>
              <li>
                <a href="#bespoke" className="text-sm hover:text-renart-accent transition-colors">
                  Bespoke Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-renart-cream mb-4 tracking-wide">CUSTOMER CARE</h4>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-sm hover:text-renart-accent transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#sizing" className="text-sm hover:text-renart-accent transition-colors">
                  Ring Sizing Guide
                </a>
              </li>
              <li>
                <a href="#care" className="text-sm hover:text-renart-accent transition-colors">
                  Jewelry Care
                </a>
              </li>
              <li>
                <a href="#shipping" className="text-sm hover:text-renart-accent transition-colors">
                  Shipping & Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-renart-cream mb-4 tracking-wide">CONNECT</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-3 text-renart-gray-400">
                <Phone size={16} className="text-renart-accent" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-renart-gray-400">
                <Mail size={16} className="text-renart-accent" />
                <span className="text-sm">info@renartglobal.com</span>
              </li>
              <li className="flex items-center space-x-3 text-renart-gray-400">
                <MapPin size={16} className="text-renart-accent" />
                <span className="text-sm">Istanbul, Turkey</span>
              </li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" className="text-renart-gray-400 hover:text-renart-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-renart-gray-400 hover:text-renart-accent transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-renart-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-renart-gray-400">
              © 2025 Renart Global. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-sm text-renart-gray-400 hover:text-renart-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-renart-gray-400 hover:text-renart-accent transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
