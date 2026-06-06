'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: 'Beranda' },
    { href: '/#dokter', label: 'Dokter' },
    { href: '/berita', label: 'Berita' },
    { href: '/#booking', label: 'Booking' },
    { href: '/#kontak', label: 'Kontak' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <Heart size={22} color="#fff" />
            </div>
            <span>RS Morich</span>
          </Link>

          <ul className="navbar-links">
            {links.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={pathname === link.href ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <Link href="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <button
              className="navbar-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button
          className="mobile-menu-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/login"
          className="btn btn-primary"
          onClick={() => setMobileOpen(false)}
        >
          Login
        </Link>
      </div>
    </>
  );
}
