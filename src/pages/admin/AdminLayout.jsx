import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  // Initialize from localStorage or default to false
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden font-montserrat">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 h-full overflow-hidden
        ${collapsed ? (isRtl ? 'md:mr-20' : 'md:ml-20') : (isRtl ? 'md:mr-64' : 'md:ml-64')}`}
      >
        <Topbar collapsed={collapsed} onMenuClick={() => setMobileOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-neutral-950 transition-colors duration-300">
           <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 h-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
