import { ReactNode, useState } from 'react';
import { LayoutDashboard, Building2, Users, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useRouter } from '../Router';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const { navigate } = useRouter();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Building2, label: 'Nekretnine', path: '/admin/properties' },
    { icon: MessageSquare, label: 'Upiti', path: '/admin/leads' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEEEEE' }}>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg text-gray-700 hover:text-primary-green shadow-md transition-colors"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 shadow-lg
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Savremen Dom</h1>
          <p className="text-sm font-medium" style={{ color: '#7096AF' }}>Admin Panel</p>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:text-primary-green hover:bg-gray-50 rounded-lg transition-all font-medium"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{profile?.full_name}</span>
            </div>
            <span className="text-xs text-gray-500 capitalize">{profile?.role?.replace('_', ' ')}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Odjavi se</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
