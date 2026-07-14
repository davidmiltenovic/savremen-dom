import { ReactNode, useState } from 'react';
import { Phone, Mail, Menu, X, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from '../Router';
import { COMPANY_INFO } from '../../lib/constants';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEEEEE' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-4">
              <img
                src={COMPANY_INFO.logo}
                alt={COMPANY_INFO.name}
                className="h-12 w-auto"
              />
              <span className="hidden lg:block text-sm text-gray-600">
                Reg. broj: {COMPANY_INFO.registrationNumber}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-primary-green transition-colors font-medium">
                Početna
              </Link>
              <Link to="/search" className="text-gray-700 hover:text-primary-green transition-colors font-medium">
                Nekretnine
              </Link>
              <Link to="/o-nama" className="text-gray-700 hover:text-primary-green transition-colors font-medium">
                O nama
              </Link>
              <Link to="/ponudite-nekretninu" className="text-gray-700 hover:text-primary-green transition-colors font-medium">
                Ponudite nekretninu
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-green transition-colors font-medium">
                Kontakt
              </Link>
              <a
                href={`tel:${COMPANY_INFO.contact.phones[0]}`}
                className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-semibold text-white"
                style={{ backgroundColor: '#7096AF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a7a96'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7096AF'}
              >
                <Phone className="w-4 h-4" />
                Pozovite nas
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-green"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-4">
              <div className="text-sm text-gray-600 pb-2 border-b border-gray-200 mb-2">
                Reg. broj: {COMPANY_INFO.registrationNumber}
              </div>
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-primary-green transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Početna
              </Link>
              <Link
                to="/search"
                className="block py-2 text-gray-700 hover:text-primary-green transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nekretnine
              </Link>
              <Link
                to="/o-nama"
                className="block py-2 text-gray-700 hover:text-primary-green transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                O nama
              </Link>
              <Link
                to="/ponudite-nekretninu"
                className="block py-2 text-gray-700 hover:text-primary-green transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ponudite nekretninu
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-gray-700 hover:text-primary-green transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
              <a
                href={`tel:${COMPANY_INFO.contact.phones[0]}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold text-white"
                style={{ backgroundColor: '#7096AF' }}
              >
                <Phone className="w-4 h-4" />
                Pozovite nas
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <img
                  src={COMPANY_INFO.logo}
                  alt={COMPANY_INFO.name}
                  className="h-10 w-auto mb-4"
                />
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {COMPANY_INFO.tagline}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={COMPANY_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-green transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={COMPANY_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-green transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={COMPANY_INFO.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-green transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Brzi linkovi</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-600 hover:text-primary-green text-sm transition-colors">
                  Početna
                </Link>
                <Link to="/search" className="block text-gray-600 hover:text-primary-green text-sm transition-colors">
                  Nekretnine
                </Link>
                <Link to="/o-nama" className="block text-gray-600 hover:text-primary-green text-sm transition-colors">
                  O nama
                </Link>
                <Link to="/ponudite-nekretninu" className="block text-gray-600 hover:text-primary-green text-sm transition-colors">
                  Ponudite nekretninu
                </Link>
                <Link to="/contact" className="block text-gray-600 hover:text-primary-green text-sm transition-colors">
                  Kontakt
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Kontakt</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#7096AF' }} />
                  <span>{COMPANY_INFO.contact.address}</span>
                </div>
                {COMPANY_INFO.contact.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-green text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {phone}
                  </a>
                ))}
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-green text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {COMPANY_INFO.contact.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. Sva prava zadržana.</p>
            <p className="mt-2">Registarski broj posrednika: {COMPANY_INFO.registrationNumber}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
