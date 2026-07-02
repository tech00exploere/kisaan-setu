'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/farmer/SidebarContext';
import MobileDrawer from '@/components/farmer/MobileDrawer';

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toggle } = useSidebar();
  const [farmerName, setFarmerName] = useState('');

  // Ensure farmerName exists in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let name = localStorage.getItem('farmerName') || '';
      if (!name) {
        name = window.prompt('Enter your farmer name (used for product ownership):') || '';
        if (name) {
          localStorage.setItem('farmerName', name);
        }
      }
      setFarmerName(name);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('farmerName');
      window.location.href = '/login';
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-5 flex items-center justify-between h-20">
      {/* Logo / Title */}
      <div className="flex items-center gap-2 w-full text-xl font-bold text-slate-800">
        <Image src="/images/logo.png" alt="KISAAN SETU" width={80} height={80} className="h-auto" />
      </div>

      {/* Desktop actions */}
      <div className="hidden lg:flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </nav>
  );
}
