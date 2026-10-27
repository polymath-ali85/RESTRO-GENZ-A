import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useApp } from '../../context/AppContext';
import { Server, Sparkles, Terminal } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { backendStatus, backendUrl } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9FC] dark:bg-[#141317] text-[#2D2D2D] dark:text-[#F5F3F8]">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />

        {/* Offline Notice Banner if backend is not reachable */}
        {backendStatus === 'disconnected' && (
          <div className="bg-[#FBF8FF] dark:bg-[#201B2E] border-b border-[#E8DEF8] dark:border-[#382E4D] px-4 py-2 text-xs text-[#522998] dark:text-[#D5C2FA] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#EFE7FD] dark:bg-[#34264F]">
                <Sparkles className="w-3.5 h-3.5 text-[#8654DE] dark:text-[#C5A3FF]" />
              </span>
              <span>
                <strong>Running on Local Evaluation Engine:</strong> Python backend at{' '}
                <code>{backendUrl}</code> is currently offline. All features (CSV loading, validation,
                segmentation & Hinglish copy generator) are fully functional in browser simulation mode!
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#6F6A78] dark:text-[#A7A1B3]">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                To run live FastAPI: <code>uvicorn api:app --port 8000</code>
              </span>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
