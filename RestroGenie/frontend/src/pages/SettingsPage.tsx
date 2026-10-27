import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Server,
  Sun,
  Moon,
  Laptop,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Terminal,
  Database,
  Code2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { backendUrl, setBackendUrl, checkBackend, backendStatus, backendMessage } = useApp();
  const { theme, setTheme } = useTheme();

  const [urlInput, setUrlInput] = useState(backendUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSaveUrl = () => {
    setBackendUrl(urlInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      await checkBackend();
      setTestResult({
        ok: backendStatus === 'connected',
        msg: backendMessage,
      });
    } catch {
      setTestResult({
        ok: false,
        msg: 'Connection attempt failed',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Backend API Configuration */}
      <Card>
        <CardHeader
          title="Python Backend API Connection"
          subtitle="Configure the target address for RestroGenie's FastAPI server"
          icon={<Server className="w-4 h-4" />}
          action={
            <Badge
              variant={backendStatus === 'connected' ? 'success' : 'warning'}
              size="sm"
            >
              {backendStatus === 'connected' ? 'FastAPI Connected' : 'Offline / Local Fallback'}
            </Badge>
          }
        />

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#E2DFE8] mb-1">
              Backend Base URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://127.0.0.1:8000"
                className="flex-1 px-3 py-2 text-xs font-mono bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#C5A3FF]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  isLoading={testingConnection}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Test Ping
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveUrl}>
                  Save Base URL
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-[#6F6A78] dark:text-[#A7A1B3] mt-1.5">
              Default is <code>http://127.0.0.1:8000</code>. Saved locally in your browser’s localStorage.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-lg bg-[#EBF7F0] dark:bg-[#162D21] border border-[#C8EDD7] dark:border-[#224A35] text-xs text-[#27845A] dark:text-[#52C98F] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Backend URL saved successfully to localStorage.</span>
            </div>
          )}

          {testResult && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                testResult.ok
                  ? 'bg-[#EBF7F0] dark:bg-[#162D21] border-[#C8EDD7] dark:border-[#224A35] text-[#27845A] dark:text-[#52C98F]'
                  : 'bg-[#FFF5F6] dark:bg-[#2F1518] border-[#FCD2D6] dark:border-[#5C2228] text-[#C83846] dark:text-[#F8717D]'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{testResult.msg}</span>
            </div>
          )}

          {/* Quick start instructions */}
          <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
              <Terminal className="w-3.5 h-3.5 text-[#8654DE] dark:text-[#C5A3FF]" />
              <span>How to boot the Python FastAPI server locally:</span>
            </div>
            <pre className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5 font-mono text-[11px] text-[#2D2D2D] dark:text-[#E2DFE8] overflow-x-auto">
              cd RestroGenie-main/restaurant-ai-marketing
              {"\n"}pip install -r requirements.txt
              {"\n"}uvicorn api:app --reload --port 8000
            </pre>
          </div>
        </div>
      </Card>

      {/* Theme & Display Preferences */}
      <Card>
        <CardHeader
          title="Theme & Visual Appearance"
          subtitle="Toggle between Lavender Mist Light and Charcoal Dark Mode"
          icon={<Sun className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-[#8654DE] dark:border-[#C5A3FF] bg-[#F5F0FF] dark:bg-[#2A2338] text-[#7042C9] dark:text-[#C5A3FF] font-semibold ring-2 ring-[#C5A3FF]/40'
                : 'border-[#E9E4F0] dark:border-[#383345] text-[#6F6A78] dark:text-[#A7A1B3] hover:bg-black/2 dark:hover:bg-white/2'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-[#8654DE] dark:border-[#C5A3FF] bg-[#F5F0FF] dark:bg-[#2A2338] text-[#7042C9] dark:text-[#C5A3FF] font-semibold ring-2 ring-[#C5A3FF]/40'
                : 'border-[#E9E4F0] dark:border-[#383345] text-[#6F6A78] dark:text-[#A7A1B3] hover:bg-black/2 dark:hover:bg-white/2'
            }`}
          >
            <Moon className="w-5 h-5 text-[#8654DE] dark:text-[#C5A3FF]" />
            <span className="text-xs">Charcoal Dark Mode</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'system'
                ? 'border-[#8654DE] dark:border-[#C5A3FF] bg-[#F5F0FF] dark:bg-[#2A2338] text-[#7042C9] dark:text-[#C5A3FF] font-semibold ring-2 ring-[#C5A3FF]/40'
                : 'border-[#E9E4F0] dark:border-[#383345] text-[#6F6A78] dark:text-[#A7A1B3] hover:bg-black/2 dark:hover:bg-white/2'
            }`}
          >
            <Laptop className="w-5 h-5 text-slate-500" />
            <span className="text-xs">System Preference</span>
          </button>
        </div>
      </Card>

      {/* Backend API Surface Discovery */}
      <Card>
        <CardHeader
          title="Backend Architectural Surface (From Source Analysis)"
          subtitle="Inventory of implemented endpoints in RestroGenie-main"
          icon={<Code2 className="w-4 h-4" />}
        />

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg border border-[#E9E4F0] dark:border-[#383345] bg-[#FAF9FC] dark:bg-[#16141B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400">
                GET
              </span>
              <code className="font-mono font-semibold">/api/health</code>
              <Badge variant="success" size="sm">
                Connected
              </Badge>
            </div>
            <p className="text-[11px] text-[#6F6A78] dark:text-[#A7A1B3] mt-1">
              Checks service health. Returns <code>status: "ok"</code>.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[#E9E4F0] dark:border-[#383345] bg-[#FAF9FC] dark:bg-[#16141B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400">
                POST
              </span>
              <code className="font-mono font-semibold">/upload-csv</code>
              <Badge variant="success" size="sm">
                Connected
              </Badge>
            </div>
            <p className="text-[11px] text-[#6F6A78] dark:text-[#A7A1B3] mt-1">
              Multipart upload endpoint. Loads CSV, executes validation, classifies segments, and generates Hinglish drafts.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-[#E9E4F0] dark:border-[#383345] bg-[#FAF9FC] dark:bg-[#16141B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400">
                STUB
              </span>
              <code className="font-mono font-semibold">Campaign Gateway (sender.py)</code>
              <Badge variant="warning" size="sm">
                Simulation Mode
              </Badge>
            </div>
            <p className="text-[11px] text-[#6F6A78] dark:text-[#A7A1B3] mt-1">
              Backend file <code>services/sender.py</code> is 0 bytes. Direct dispatch is simulated safely in frontend.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
