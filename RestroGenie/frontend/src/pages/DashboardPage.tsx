import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  PieChart,
  Sparkles,
  FileSpreadsheet,
  Upload,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/dashboard/StatCard';
import { SegmentChart } from '../components/dashboard/SegmentChart';
import { ValidationCard } from '../components/dashboard/ValidationCard';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadData, loadSampleData, isProcessing, clearData } = useApp();
  const [copiedDraft, setCopiedDraft] = React.useState(false);

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  if (!uploadData) {
    return (
      <div className="py-6">
        <EmptyState
          badge="Getting Started"
          icon={<FileSpreadsheet className="w-8 h-8" />}
          title="Welcome to RestroGenie Marketing OS"
          description="Import your restaurant's customer CSV to run automated schema validation, classify behavioral cohorts, and generate AI-powered Hinglish WhatsApp drafts."
          actionText="Upload Customer CSV"
          onAction={() => navigate('/customers')}
          secondaryActionText="Load Sample Dataset (152 Records)"
          onSecondaryAction={loadSampleData}
        />
      </div>
    );
  }

  const sampleDraft = uploadData.sample_draft;

  return (
    <div className="space-y-6">
      {/* Top Banner / Context Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#1E1C24] p-4 rounded-xl border border-[#E9E4F0] dark:border-[#312E3C] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#F5F0FF] dark:bg-[#2A2338] text-[#8654DE] dark:text-[#C5A3FF]">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-[#2D2D2D] dark:text-[#F5F3F8]">
                {uploadData.filename}
              </h2>
              {uploadData.isLocalFallback ? (
                <Badge variant="warning" size="sm">
                  Client Evaluation Engine
                </Badge>
              ) : (
                <Badge variant="success" size="sm">
                  FastAPI Processed
                </Badge>
              )}
            </div>
            <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
              {uploadData.total_rows} total rows • {uploadData.eligible_customers} eligible •{' '}
              {uploadData.rows_with_data_errors} rows with data issues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/customers')}
            icon={<Upload className="w-3.5 h-3.5" />}
          >
            New Upload
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearData}
            className="text-[#D94F5C] hover:text-[#D94F5C]"
          >
            Clear Data
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={uploadData.total_rows}
          subtitle="Customer records imported"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Marketing Eligible"
          value={uploadData.eligible_customers}
          subtitle="Opted-in with valid phone"
          icon={<CheckCircle className="w-5 h-5 text-[#27845A]" />}
          trend={`${Math.round((uploadData.eligible_customers / uploadData.total_rows) * 100)}% consent rate`}
        />
        <StatCard
          title="Customer Segments"
          value={Object.keys(uploadData.segment_counts).length}
          subtitle="Distinct cohorts identified"
          icon={<PieChart className="w-5 h-5 text-[#8654DE]" />}
        />
        <StatCard
          title="Generated Message Drafts"
          value={uploadData.generated_count}
          subtitle="Personalized marketing copies"
          icon={<Sparkles className="w-5 h-5 text-[#C5A3FF]" />}
        />
      </div>

      {/* Charts Section */}
      <SegmentChart
        segmentCounts={uploadData.segment_counts}
        eligibleCount={uploadData.eligible_customers}
        notEligibleCount={uploadData.not_eligible_customers}
      />

      {/* Sample Marketing Draft Highlight */}
      {sampleDraft && (
        <Card className="border-[#C5A3FF]/40 bg-linear-to-r from-white via-white to-[#FAF6FF] dark:from-[#1E1C24] dark:to-[#221C2F]">
          <CardHeader
            title="Generated Hinglish Message Draft Preview"
            subtitle={`AI-crafted draft for ${sampleDraft.customer_name} (${sampleDraft.segments.join(', ')})`}
            icon={<Sparkles className="w-4 h-4" />}
            action={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyDraft(sampleDraft.message)}
                  icon={
                    copiedDraft ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {copiedDraft ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/messages')}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View All {uploadData.generated_count} Drafts
                </Button>
              </div>
            }
          />

          <div className="p-4 rounded-xl bg-[#FAF9FC] dark:bg-[#15131A] border border-[#E9E4F0] dark:border-[#2C2936] font-medium text-sm text-[#2D2D2D] dark:text-[#E8E6ED] leading-relaxed">
            "{sampleDraft.message}"
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
              Target Customer: <strong>{sampleDraft.customer_name}</strong> ({sampleDraft.customer_id})
            </span>
            <span className="text-xs text-[#6F6A78] dark:text-[#A7A1B3]">•</span>
            <span className="text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
              Segments:
            </span>
            {sampleDraft.segments.map((s) => (
              <Badge key={s} variant="lavender" size="sm">
                {s}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Validation Checklist */}
      <ValidationCard
        checks={uploadData.checks}
        totalErrors={uploadData.rows_with_data_errors}
      />
    </div>
  );
};
