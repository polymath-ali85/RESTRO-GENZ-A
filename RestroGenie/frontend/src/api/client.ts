import { UploadCsvResponse, BackendHealthResponse } from '../types';

export const DEFAULT_API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000';

class RestroGenieApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = localStorage.getItem('restrogenie_api_base') || DEFAULT_API_BASE;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, '');
    localStorage.setItem('restrogenie_api_base', this.baseUrl);
  }

  /**
   * Ping backend to check connectivity.
   * Checks /api/health first, then / as fallback.
   */
  public async checkHealth(): Promise<BackendHealthResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const res = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          status: 'connected',
          message: data.message || 'Connected to FastAPI Backend',
          url: this.baseUrl,
        };
      }

      // Check root if /api/health returned non-ok
      const rootRes = await fetch(`${this.baseUrl}/`, {
        headers: { Accept: 'application/json' },
      });
      if (rootRes.ok) {
        const data = await rootRes.json();
        return {
          status: 'connected',
          message: data.message || 'RestroGenie API is running!',
          url: this.baseUrl,
        };
      }

      return {
        status: 'disconnected',
        message: `HTTP ${res.status}: Backend responded with error`,
        url: this.baseUrl,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const message =
        err instanceof Error && err.name === 'AbortError'
          ? 'Backend connection timed out (3.5s)'
          : 'Backend is offline or unreachable at ' + this.baseUrl;
      return {
        status: 'disconnected',
        message,
        url: this.baseUrl,
      };
    }
  }

  /**
   * Upload CSV file directly to FastAPI's /upload-csv endpoint
   */
  public async uploadCsv(file: File): Promise<UploadCsvResponse> {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      throw new Error('Please upload a valid CSV file.');
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/upload-csv`, {
        method: 'POST',
        body: formData,
        // Do not set Content-Type header manually for FormData; browser sets multipart boundary
      });
    } catch (networkError) {
      throw new Error(
        `Network error: Could not reach backend at ${this.baseUrl}. Please verify the Python server is running.`
      );
    }

    if (!res.ok) {
      let errorDetail = `Server error (${res.status})`;
      try {
        const errJson = await res.json();
        if (errJson && errJson.detail) {
          errorDetail = errJson.detail;
        }
      } catch {
        // Ignored
      }
      throw new Error(errorDetail);
    }

    const data: UploadCsvResponse = await res.json();
    return {
      ...data,
      isLocalFallback: false,
    };
  }
}

export const apiClient = new RestroGenieApiClient();
