import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

interface CsvUploadZoneProps {
  onShowFormatModal: () => void;
}

export const CsvUploadZone: React.FC<CsvUploadZoneProps> = ({ onShowFormatModal }) => {
  const { processUploadedFile, isProcessing, uploadError, loadSampleData, backendStatus } =
    useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a file with .csv extension.');
      return;
    }
    setSelectedFile(file);
    await processUploadedFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1E1C24] border border-[#E9E4F0] dark:border-[#312E3C] rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F0EBF7] dark:border-[#2C2936]">
        <div>
          <h2 className="text-base font-bold text-[#2D2D2D] dark:text-[#F5F3F8]">
            Customer Data Ingestion
          </h2>
          <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] mt-0.5">
            Upload your restaurant customer roster CSV to validate schemas and calculate marketing segments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowFormatModal}
            icon={<Info className="w-3.5 h-3.5 text-[#8654DE] dark:text-[#C5A3FF]" />}
          >
            Required Format
          </Button>
          <a
            href="/restrogenie_cust_sample.csv"
            download="restrogenie_cust_sample.csv"
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium border border-[#E9E4F0] dark:border-[#3B3844] text-[#2D2D2D] dark:text-[#F5F3F8] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample CSV
          </a>
        </div>
      </div>

      {/* Drag & Drop Surface */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 ${
          dragOver
            ? 'border-[#C5A3FF] bg-[#F5F0FF]/60 dark:bg-[#2A2338]/50'
            : 'border-[#DDD6E8] dark:border-[#3A3546] hover:border-[#C5A3FF] bg-[#FAF9FC] dark:bg-[#16141B]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F5F0FF] dark:bg-[#2A2338] text-[#8654DE] dark:text-[#C5A3FF] flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#F5F3F8]">
            Click to browse or drag and drop your CSV here
          </p>
          <p className="text-xs text-[#6F6A78] dark:text-[#A7A1B3] mt-1">
            Accepts UTF-8 .csv files with standard customer header specification
          </p>
          {selectedFile && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE2FF] dark:bg-[#34284A] text-xs font-medium text-[#6939C4] dark:text-[#C5A3FF]">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Error / Alert */}
      {uploadError && (
        <div className="mt-4 p-4 rounded-xl bg-[#FFF5F6] dark:bg-[#2F1518] border border-[#FCD2D6] dark:border-[#5C2228] flex items-start gap-3 text-xs text-[#C83846] dark:text-[#F8717D]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">CSV Processing Error</p>
            <p className="mt-0.5 leading-relaxed">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Fast Demo alternative */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-[#6F6A78] dark:text-[#A7A1B3]">
        <div className="flex items-center gap-2">
          <span>Backend Target:</span>
          <span className="font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
            POST /upload-csv
          </span>
          {backendStatus === 'connected' ? (
            <span className="text-[#27845A] dark:text-[#52C98F] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Offline (runs in browser engine)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            loadSampleData();
          }}
          disabled={isProcessing}
          className="text-[#8654DE] dark:text-[#C5A3FF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          Load Pre-Packaged Demo Data (152 rows)
        </button>
      </div>
    </div>
  );
};
