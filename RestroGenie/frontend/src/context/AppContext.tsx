import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  UploadCsvResponse,
  CustomerRecord,
  GeneratedResultItem,
  CampaignHistoryItem,
} from '../types';
import { apiClient, DEFAULT_API_BASE } from '../api/client';
import {
  processCsvWithLocalEngine,
  loadSampleCustomerData,
} from '../api/localEngine';

interface AppContextType {
  backendStatus: 'checking' | 'connected' | 'disconnected';
  backendMessage: string;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  checkBackend: () => Promise<void>;
  
  uploadData: UploadCsvResponse | null;
  customerRecords: CustomerRecord[];
  isProcessing: boolean;
  uploadError: string | null;
  
  processUploadedFile: (file: File) => Promise<boolean>;
  loadSampleData: () => Promise<void>;
  clearData: () => void;

  // Draft review and campaign simulation
  drafts: GeneratedResultItem[];
  updateDraftMessage: (index: number, newMessage: string) => void;
  approveDraft: (index: number) => void;
  rejectDraft: (index: number) => void;
  campaigns: CampaignHistoryItem[];
  simulateSendCampaign: (segmentName: string) => { count: number; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [backendMessage, setBackendMessage] = useState<string>('Checking backend connectivity...');
  const [backendUrl, setBackendUrlState] = useState<string>(() => apiClient.getBaseUrl() || DEFAULT_API_BASE);

  // Rehydrate state from localStorage for cross-session persistence
  const [uploadData, setUploadData] = useState<UploadCsvResponse | null>(() => {
    try {
      const saved = localStorage.getItem('restrogenie_upload_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [customerRecords, setCustomerRecords] = useState<CustomerRecord[]>(() => {
    try {
      const saved = localStorage.getItem('restrogenie_customers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [drafts, setDrafts] = useState<GeneratedResultItem[]>(() => {
    try {
      const saved = localStorage.getItem('restrogenie_drafts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [campaigns, setCampaigns] = useState<CampaignHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('restrogenie_campaigns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (uploadData) {
        localStorage.setItem('restrogenie_upload_data', JSON.stringify(uploadData));
      } else {
        localStorage.removeItem('restrogenie_upload_data');
      }
    } catch {}
  }, [uploadData]);

  useEffect(() => {
    try {
      if (customerRecords.length > 0) {
        localStorage.setItem('restrogenie_customers', JSON.stringify(customerRecords));
      } else {
        localStorage.removeItem('restrogenie_customers');
      }
    } catch {}
  }, [customerRecords]);

  useEffect(() => {
    try {
      if (drafts.length > 0) {
        localStorage.setItem('restrogenie_drafts', JSON.stringify(drafts));
      } else {
        localStorage.removeItem('restrogenie_drafts');
      }
    } catch {}
  }, [drafts]);

  const checkBackend = useCallback(async () => {
    setBackendStatus('checking');
    try {
      const res = await apiClient.checkHealth();
      if (res.status === 'connected') {
        setBackendStatus('connected');
        setBackendMessage(res.message);
      } else {
        setBackendStatus('disconnected');
        setBackendMessage(res.message);
      }
    } catch {
      setBackendStatus('disconnected');
      setBackendMessage('Backend unreachable at ' + backendUrl);
    }
  }, [backendUrl]);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const setBackendUrl = (url: string) => {
    apiClient.setBaseUrl(url);
    setBackendUrlState(url);
    checkBackend();
  };

  const processUploadedFile = async (file: File): Promise<boolean> => {
    setIsProcessing(true);
    setUploadError(null);

    try {
      let response: UploadCsvResponse;

      // If backend is connected, upload to FastAPI
      if (backendStatus === 'connected') {
        try {
          response = await apiClient.uploadCsv(file);
          const fileText = await file.text();
          const localParsed = await processCsvWithLocalEngine(fileText, file.name);
          response.customers = localParsed.customers;
        } catch (apiErr: unknown) {
          throw apiErr;
        }
      } else {
        // Fallback to local evaluation engine when backend is offline
        const text = await file.text();
        response = await processCsvWithLocalEngine(text, file.name);
      }

      setUploadData(response);
      setCustomerRecords(response.customers || []);
      setDrafts(response.results || []);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process CSV file.';
      setUploadError(msg);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleData = async () => {
    setIsProcessing(true);
    setUploadError(null);
    try {
      const response = await loadSampleCustomerData();
      setUploadData(response);
      setCustomerRecords(response.customers || []);
      setDrafts(response.results || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not load sample dataset.';
      setUploadError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearData = () => {
    setUploadData(null);
    setCustomerRecords([]);
    setDrafts([]);
    setUploadError(null);
    localStorage.removeItem('restrogenie_upload_data');
    localStorage.removeItem('restrogenie_customers');
    localStorage.removeItem('restrogenie_drafts');
  };

  const updateDraftMessage = (index: number, newMessage: string) => {
    setDrafts((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], message: newMessage };
      }
      return next;
    });
  };

  const approveDraft = (index: number) => {
    setDrafts((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], status: 'success' };
      }
      return next;
    });
  };

  const rejectDraft = (index: number) => {
    setDrafts((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], status: 'failed', error: 'Draft rejected by user' };
      }
      return next;
    });
  };

  const simulateSendCampaign = (segmentName: string) => {
    const eligibleCount = drafts.filter(
      (d) => d.status === 'success' && (segmentName === 'All' || d.segment.includes(segmentName))
    ).length;

    const newCampaign: CampaignHistoryItem = {
      id: 'CMP-' + Date.now().toString(36).toUpperCase(),
      title: `${segmentName} Campaign Draft Run`,
      target_segment: segmentName,
      created_at: new Date().toLocaleString(),
      recipient_count: eligibleCount,
      mode: 'Simulation only',
      status: 'Completed',
    };

    const updated = [newCampaign, ...campaigns];
    setCampaigns(updated);
    localStorage.setItem('restrogenie_campaigns', JSON.stringify(updated));

    return {
      count: eligibleCount,
      message: `Simulated campaign execution for ${eligibleCount} recipients. Note: Real dispatch requires external SMS/WhatsApp gateway configuration.`,
    };
  };

  return (
    <AppContext.Provider
      value={{
        backendStatus,
        backendMessage,
        backendUrl,
        setBackendUrl,
        checkBackend,
        uploadData,
        customerRecords,
        isProcessing,
        uploadError,
        processUploadedFile,
        loadSampleData,
        clearData,
        drafts,
        updateDraftMessage,
        approveDraft,
        rejectDraft,
        campaigns,
        simulateSendCampaign,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
};
