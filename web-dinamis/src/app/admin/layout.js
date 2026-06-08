'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthProvider from '@/components/AuthProvider';
import {
  LayoutDashboard, Users, Stethoscope, Building2, Calendar,
  Newspaper, Heart, Mail, LogOut, Menu, X, Layers,
  ChevronRight,
} from 'lucide-react';

function AdminLayoutInner({ children }) {
  // TEMPORARY: Bypass auth for development — remove before production!
  const { data: realSession, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use real session if logged in, otherwise fake it for dev access
  const session = realSession || {
    user: {
      id: '0',
      name: 'Dev Admin',
      username: 'dev',
      email: 'dev@admin.com',
      role: 'admin',
    },
  };

  if (status === 'loading') {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  }

  // Auth bypass: no redirect, no null return

  const menuItems = [
    {
      section: 'Menu Utama', items: [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      section: 'Master Data', items: [
        { href: '/admin/dokter', icon: Stethoscope, label: 'Dokter' },
        { href: '/admin/poliklinik', icon: Building2, label: 'Poliklinik' },
        { href: '/admin/jadwal_dokter', icon: Calendar, label: 'Jadwal Dokter' },
        { href: '/admin/users', icon: Users, label: 'Users' },
      ]
    },
    {
      section: 'Konten', items: [
        { href: '/admin/berita', icon: Newspaper, label: 'Berita' },
        { href: '/admin/layanan', icon: Layers, label: 'Layanan' },
        { href: '/admin/kontak', icon: Mail, label: 'Pesan Kontak' },
      ]
    },
  ];

  const getPageTitle = () => {
    const flat = menuItems.flatMap(s => s.items);
    const match = flat.find(item => pathname === item.href);
    if (match) return match.label;
    if (pathname.includes('/create')) return 'Tambah Data';
    if (pathname.includes('/edit')) return 'Edit Data';
    return 'Admin Panel';
  };

  const initials = session.user.name
    ? session.user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/admin" className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Heart size={20} color="#fff" />
            </div>
            <span>RS Admin</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((section, sIdx) => (
            <div key={sIdx} className="sidebar-section">
              <div className="sidebar-section-title">{section.section}</div>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="sidebar-link"
            style={{ width: '100%', color: 'var(--color-danger)' }}
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className="sidebar-mobile-toggle btn-icon btn-secondary"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1>{getPageTitle()}</h1>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-user-info">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {session.user.name}
              </span>
              <div className="admin-avatar">{initials}</div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
