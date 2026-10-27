import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Sparkles,
  Copy,
  Check,
  Edit3,
  CheckCircle2,
  XCircle,
  Filter,
  MessageSquare,
  Send,
  RefreshCw,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { generateHinglishMarketingDraft } from '../utils/promptTemplates';
import { GeneratedResultItem } from '../types';

export const MessageStudioPage: React.FC = () => {
  const { drafts, updateDraftMessage, approveDraft, rejectDraft, customerRecords, loadSampleData } =
    useApp();
  const [segmentFilter, setSegmentFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  // Ad-hoc generator state
  const [adhocName, setAdhocName] = useState('Aarav');
  const [adhocFood, setAdhocFood] = useState('Chicken Biryani');
  const [adhocSegment, setAdhocSegment] = useState('Frequent');
  const [adhocTone, setAdhocTone] = useState<'Hinglish Humorous (Default)' | 'Warm & Friendly' | 'Executive & Classic'>(
    'Hinglish Humorous (Default)'
  );
  const [adhocResult, setAdhocResult] = useState<string>(() =>
    generateHinglishMarketingDraft({
      customerName: 'Aarav',
      favoriteFood: 'Chicken Biryani',
      customerSegment: 'Frequent',
      tone: 'Hinglish Humorous (Default)',
    })
  );

  const handleGenerateAdhoc = () => {
    const msg = generateHinglishMarketingDraft({
      customerName: adhocName,
      favoriteFood: adhocFood,
      customerSegment: adhocSegment,
      tone: adhocTone,
    });
    setAdhocResult(msg);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartEdit = (index: number, currentMsg: string) => {
    setEditingIndex(index);
    setEditText(currentMsg);
  };

  const handleSaveEdit = (index: number) => {
    updateDraftMessage(index, editText);
    setEditingIndex(null);
  };

  const filteredDrafts = drafts.filter((d) => {
    if (segmentFilter !== 'All' && !d.segment.includes(segmentFilter)) {
      return false;
    }
    if (channelFilter !== 'All' && d.channel !== channelFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Important Safety Banner */}
      <div className="p-4 rounded-xl bg-[#FFFBF0] dark:bg-[#2B2313] border border-[#FDE7B4] dark:border-[#4E3D1C] flex items-start gap-3 text-xs text-[#87590C] dark:text-[#E8BA61]">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Draft Generation & Preview Only:</strong> RestroGenie AI Message Studio generates,
          audits, and customizes campaign drafts. Messages are <em>never</em> automatically
          dispatched to actual customer phones without explicit marketing team approval and external
          gateway authorization.
        </div>
      </div>

      {/* Ad-hoc Live Prompt Composer & Tester */}
      <Card className="border-[#C5A3FF]/50 bg-linear-to-b from-white to-[#FAF6FF] dark:from-[#1E1C24] dark:to-[#221B2F]">
        <CardHeader
          title="Interactive Prompt & Tone Playground"
          subtitle="Real-time Hinglish copy generator matching prompts/marketing.txt"
          icon={<Sparkles className="w-4 h-4 text-[#8654DE] dark:text-[#C5A3FF]" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#E2DFE8] mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={adhocName}
              onChange={(e) => setAdhocName(e.target.value)}
              placeholder="e.g. Diya"
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#E2DFE8] mb-1">
              Favorite Food Dish
            </label>
            <input
              type="text"
              value={adhocFood}
              onChange={(e) => setAdhocFood(e.target.value)}
              placeholder="e.g. Avocado Toast"
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#E2DFE8] mb-1">
              Customer Segment
            </label>
            <select
              value={adhocSegment}
              onChange={(e) => setAdhocSegment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg font-medium"
            >
              <option value="Frequent">Frequent</option>
              <option value="High Spender">High Spender</option>
              <option value="Inactive">Inactive</option>
              <option value="New Customer">New Customer</option>
              <option value="Regular">Regular</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D2D2D] dark:text-[#E2DFE8] mb-1">
              Message Tone
            </label>
            <select
              value={adhocTone}
              onChange={(e) =>
                setAdhocTone(
                  e.target.value as
                    | 'Hinglish Humorous (Default)'
                    | 'Warm & Friendly'
                    | 'Executive & Classic'
                )
              }
              className="w-full px-3 py-2 text-xs bg-white dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-lg font-medium"
            >
              <option value="Hinglish Humorous (Default)">Hinglish Humorous (Default)</option>
              <option value="Warm & Friendly">Warm & Friendly</option>
              <option value="Executive & Classic">Executive & Classic</option>
            </select>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8654DE] dark:text-[#C5A3FF] block mb-1">
              Generated Message Preview
            </span>
            <p className="text-sm font-medium text-[#2D2D2D] dark:text-[#F5F3F8] italic">
              "{adhocResult}"
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateAdhoc}
              icon={<RefreshCw className="w-3 h-3" />}
            >
              Regenerate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy('adhoc', adhocResult)}
              icon={
                copiedId === 'adhoc' ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )
              }
            >
              {copiedId === 'adhoc' ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Campaign Drafts Table & Filters */}
      {drafts.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-8 h-8" />}
          title="No Campaign Drafts Generated Yet"
          description="Upload customer data to automatically produce personalized Hinglish drafts for all eligible diners."
          actionText="Load Sample Dataset"
          onAction={loadSampleData}
        />
      ) : (
        <div className="space-y-4">
          {/* Drafts Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#1E1C24] p-4 rounded-xl border border-[#E9E4F0] dark:border-[#312E3C]">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#2D2D2D] dark:text-[#F5F3F8]">
                Batch Generated Drafts ({filteredDrafts.length} Messages)
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
                <Filter className="w-3.5 h-3.5" />
                <span>Segment:</span>
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  className="px-2 py-1 bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-md text-xs font-medium"
                >
                  <option value="All">All Segments</option>
                  <option value="Frequent">Frequent</option>
                  <option value="High Spender">High Spender</option>
                  <option value="Inactive">Inactive</option>
                  <option value="New Customer">New Customer</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
                <span>Channel:</span>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="px-2 py-1 bg-[#FAF9FC] dark:bg-[#16141B] border border-[#E9E4F0] dark:border-[#383345] rounded-md text-xs font-medium"
                >
                  <option value="All">All Channels</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Sms">SMS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drafts Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDrafts.map((draft, idx) => {
              const isEditing = editingIndex === idx;

              return (
                <Card
                  key={`${draft.customer_id}-${idx}`}
                  className="flex flex-col justify-between border-[#E9E4F0] dark:border-[#312E3C]"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#F0EBF7] dark:border-[#2C2936]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#2D2D2D] dark:text-[#F5F3F8]">
                          {draft.customer_name}
                        </span>
                        <span className="text-[11px] font-mono text-[#6F6A78] dark:text-[#A7A1B3]">
                          ({draft.customer_id})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="neutral" size="sm">
                          {draft.channel || 'WhatsApp'}
                        </Badge>
                        <Badge
                          variant={draft.status === 'success' ? 'success' : 'error'}
                          size="sm"
                        >
                          {draft.status === 'success' ? 'Approved' : 'Rejected'}
                        </Badge>
                      </div>
                    </div>

                    {/* Segment tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {draft.segments.map((seg) => (
                        <Badge key={seg} variant="lavender" size="sm">
                          {seg}
                        </Badge>
                      ))}
                    </div>

                    {/* Message Body */}
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          className="w-full p-2.5 text-xs bg-[#FAF9FC] dark:bg-[#16141B] border border-[#C5A3FF] rounded-lg focus:outline-hidden"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingIndex(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSaveEdit(idx)}
                          >
                            Save Draft
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#2D2D2D] dark:text-[#E2DFE8] font-medium leading-relaxed bg-[#FAF9FC] dark:bg-[#16141B] p-3 rounded-lg border border-[#F0EBF7] dark:border-[#2C2936]">
                        "{draft.message}"
                      </p>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#F0EBF7] dark:border-[#2C2936] text-xs">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(idx, draft.message || '')}
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(draft.customer_id, draft.message || '')}
                        icon={
                          copiedId === draft.customer_id ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )
                        }
                      >
                        {copiedId === draft.customer_id ? 'Copied' : 'Copy'}
                      </Button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rejectDraft(idx)}
                        className="text-[#D94F5C] hover:text-[#D94F5C]"
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => approveDraft(idx)}
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
