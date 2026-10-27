import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  RefreshCw,
  Server,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

interface TopbarProps {
  onMobileMenuOpen: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuOpen }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const {
    backendStatus,
    backendUrl,
    checkBackend,
    loadSampleData,
    isProcessing,
    uploadData,
  } = useApp();

  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/':
        return {
          title: 'Marketing Dashboard',
          subtitle: 'Real-time customer segmentation and campaign readiness overview',
        };
      case '/customers':
        return {
          title: 'Customer Data Management',
          subtitle: 'CSV upload, schema validation, and consent auditing',
        };
      case '/segments':
        return {
          title: 'Customer Segments',
          subtitle: 'Rule-based cohort analytics (Frequent, Inactive, High Spender, New)',
        };
      case '/messages':
        return {
          title: 'AI Message Studio',
          subtitle: 'Hinglish marketing copy generator tailored to customer preferences',
        };
      case '/campaigns':
        return {
          title: 'Campaign Drafts & Simulation',
          subtitle: 'Review, approve, and simulate customer marketing dispatches',
        };
      case '/settings':
        return {
          title: 'System Settings',
          subtitle: 'Backend URL configuration, connection diagnostics, and display preferences',
        };
      default:
        return { title: 'RestroGenie', subtitle: 'AI Restaurant Marketing' };
    }
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <header className="h-[68px] px-4 md:px-8 bg-white/80 dark:bg-[#1E1C24]/80 backdrop-blur-md border-b border-[#E9E4F0] dark:border-[#312E3C] flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-lg text-[#6F6A78] hover:text-[#2D2D2D] dark:text-[#A7A1B3] dark:hover:text-[#F5F3F8] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-[#2D2D2D] dark:text-[#F5F3F8] leading-tight">
            {pageInfo.title}
          </h1>
          <p className="hidden md:block text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Backend Connectivity Status Pill */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            backendStatus === 'connected'
              ? 'bg-[#EBF7F0] text-[#27845A] border-[#C8EDD7] dark:bg-[#162D21] dark:text-[#52C98F] dark:border-[#224A35]'
              : backendStatus === 'checking'
              ? 'bg-[#EFF4FC] text-[#3E6ECF] border-[#CFDEF9] dark:bg-[#17243C] dark:text-[#7EA7F5] dark:border-[#273B61]'
              : 'bg-[#FFF7EB] text-[#C08119] border-[#FCE2B8] dark:bg-[#332512] dark:text-[#F0B758] dark:border-[#523A1B]'
          }`}
          title={`Backend URL: ${backendUrl}`}
        >
          {backendStatus === 'connected' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#27845A] dark:text-[#52C98F]" />
              <span>FastAPI Online (8000)</span>
            </>
          ) : backendStatus === 'checking' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-[#C08119] dark:text-[#F0B758]" />
              <span>Offline (Local Demo)</span>
            </>
          )}

          <button
            onClick={() => checkBackend()}
            className="p-0.5 hover:opacity-75 rounded focus:outline-hidden cursor-pointer"
            title="Ping backend"
            aria-label="Ping backend"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Load Sample Dataset Quick Action */}
        {!uploadData && (
          <Button
            variant="secondary"
            size="sm"
            onClick={loadSampleData}
            isLoading={isProcessing}
            icon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#8654DE] dark:text-[#C5A3FF]" />}
            className="hidden lg:inline-flex"
          >
            Load Sample CSV
          </Button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#6F6A78] hover:text-[#2D2D2D] dark:text-[#A7A1B3] dark:hover:text-[#F5F3F8] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-[#2D2D2D]" />
          )}
        </button>
      </div>
    </header>
  );
};
