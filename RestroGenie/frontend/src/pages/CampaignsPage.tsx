import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Send,
  Download,
  AlertCircle,
  Play,
  CheckCircle2,
  Calendar,
  Users,
  Info,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { drafts, campaigns, simulateSendCampaign, loadSampleData, isProcessing } = useApp();
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [simulationAlert, setSimulationAlert] = useState<string | null>(null);

  const approvedDrafts = drafts.filter((d) => d.status === 'success');

  const handleSimulate = () => {
    if (approvedDrafts.length === 0) {
      setSimulationAlert('Please approve at least one message draft in the AI Message Studio before simulating.');
      return;
    }
    const res = simulateSendCampaign(selectedSegment);
    setSimulationAlert(res.message);
  };

  const handleDownloadCsv = () => {
    if (drafts.length === 0) return;

    const headers = ['customer_id', 'customer_name', 'segment', 'channel', 'status', 'message'];
    const rows = drafts.map((d) => [
      `"${d.customer_id}"`,
      `"${d.customer_name}"`,
      `"${d.segment}"`,
      `"${d.channel || 'WhatsApp'}"`,
      `"${d.status}"`,
      `"${(d.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `restrogenie_approved_drafts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Informational Architecture Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1C24] border border-[#E9E4F0] dark:border-[#312E3C] shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#F5F0FF] dark:bg-[#2A2338] text-[#8654DE] dark:text-[#C5A3FF] shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#2D2D2D] dark:text-[#F5F3F8]">
                Campaign Execution Status: Simulation Mode
              </h2>
              <Badge variant="warning" size="sm">
                No External Dispatch Gateway
              </Badge>
            </div>
            <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] leading-relaxed max-w-3xl">
              In accordance with backend capabilities (<code>services/sender.py</code> is an unimplemented stub in
              the ZIP and external Twilio / Meta WhatsApp credentials are not connected), RestroGenie operates in{' '}
              <strong>Simulated Dispatch Mode</strong>. You can simulate blast runs, audit eligible recipient
              headcounts, and export approved message batches as CSV for manual CRM import.
            </p>
          </div>
        </div>
      </div>

      {drafts.length === 0 ? (
        <EmptyState
          icon={<Send className="w-8 h-8" />}
          title="No Campaign Drafts Available"
          description="Load customer records and review drafts in the AI Message Studio before running a campaign simulation."
          actionText="Load Sample Dataset"
          onAction={loadSampleData}
        />
      ) : (
        /* Campaign Simulation Control Card */
        <Card>
          <CardHeader
            title="Launch Simulated Campaign Run"
            subtitle="Record and preview recipient distribution for approved message copies"
            icon={<Play className="w-4 h-4" />}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCsv}
                icon={<Download className="w-3.5 h-3.5" />}
              >
                Export Drafts as CSV
              </Button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#E2DFE8] mb-1">
                Select Target Cohort
              </label>
              <select
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg font-medium"
              >
                <option value="All">All Eligible Diners ({approvedDrafts.length} Approved)</option>
                <option value="Frequent">Frequent Cohort</option>
                <option value="High Spender">High Spender Cohort</option>
                <option value="Inactive">Inactive Reconnection Cohort</option>
                <option value="New Customer">New Customer Welcome</option>
                <option value="Regular">Regular Cohort</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#E2DFE8] mb-1">
                Execution Mode
              </label>
              <div className="px-3 py-2 text-xs bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg text-[#6F6A78] dark:text-[#A7A1B3]">
                Offline Simulation Log Only (Safe)
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleSimulate}
                icon={<Send className="w-4 h-4" />}
                className="w-full"
              >
                Simulate Campaign Send
              </Button>
            </div>
          </div>

          {simulationAlert && (
            <div className="p-3 rounded-lg bg-[#EBF7F0] dark:bg-[#162D21] border border-[#C8EDD7] dark:border-[#224A35] text-xs text-[#27845A] dark:text-[#52C98F] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{simulationAlert}</span>
            </div>
          )}
        </Card>
      )}

      {/* Campaign Simulation Log Table */}
      <Card>
        <CardHeader
          title="Campaign Simulation History"
          subtitle="Audit log of previous campaign dry-runs"
          icon={<Calendar className="w-4 h-4" />}
        />

        {campaigns.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
            No simulated campaigns recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9FC] dark:bg-[#16141B] text-[#6F6A78] dark:text-[#A7A1B3] uppercase text-[10px] font-bold border-b border-[#F0EBF7] dark:border-[#2C2936]">
                <tr>
                  <th className="p-3">Campaign ID</th>
                  <th className="p-3">Campaign Title</th>
                  <th className="p-3">Target Segment</th>
                  <th className="p-3">Recipients</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBF7] dark:divide-[#2C2936]">
                {campaigns.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-black/2 dark:hover:bg-white/2">
                    <td className="p-3 font-mono font-semibold text-[#8654DE] dark:text-[#C5A3FF]">
                      {cmp.id}
                    </td>
                    <td className="p-3 font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
                      {cmp.title}
                    </td>
                    <td className="p-3">
                      <Badge variant="lavender" size="sm">
                        {cmp.target_segment}
                      </Badge>
                    </td>
                    <td className="p-3 font-semibold">{cmp.recipient_count} recipients</td>
                    <td className="p-3 text-[#6F6A78] dark:text-[#A7A1B3]">{cmp.created_at}</td>
                    <td className="p-3">
                      <Badge variant="warning" size="sm">
                        {cmp.mode}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="success" size="sm">
                        {cmp.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
