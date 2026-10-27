import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CsvUploadZone } from '../components/customers/CsvUploadZone';
import { CustomerTable } from '../components/customers/CustomerTable';
import { FormatSpecModal } from '../components/customers/FormatSpecModal';
import { EmptyState } from '../components/ui/EmptyState';
import { Users, FileSpreadsheet } from 'lucide-react';

export const CustomerDataPage: React.FC = () => {
  const { uploadData, customerRecords, loadSampleData, isProcessing } = useApp();
  const [showFormatModal, setShowFormatModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* CSV Ingestion Component */}
      <CsvUploadZone onShowFormatModal={() => setShowFormatModal(true)} />

      {/* Customer Records Table */}
      {customerRecords.length > 0 ? (
        <CustomerTable customers={customerRecords} />
      ) : uploadData ? (
        <div className="bg-white dark:bg-[#1E1C24] p-8 rounded-xl border border-[#E9E4F0] dark:border-[#312E3C] text-center text-sm text-[#6F6A78] dark:text-[#A7A1B3]">
          Customer records processed by backend. ({uploadData.total_rows} total rows).
        </div>
      ) : (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No Customer Records Loaded"
          description="Upload a CSV file or load the pre-packaged sample dataset to view your customer roster with validation tags and segment labels."
          actionText="Load Sample Dataset"
          onAction={loadSampleData}
        />
      )}

      {/* Format Specification Modal */}
      <FormatSpecModal
        isOpen={showFormatModal}
        onClose={() => setShowFormatModal(false)}
      />
    </div>
  );
};
