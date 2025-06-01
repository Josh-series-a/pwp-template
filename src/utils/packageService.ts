
interface Document {
  name: string;
  document: string[];
}

interface CreatePackageRequest {
  userId: string;
  reportId: string;
  package_name: string;
  documents: Document[];
}

interface Package {
  id: string;
  user_id: string;
  report_id: string;
  package_name: string;
  documents: Document[];
  created_at: string;
  updated_at: string;
}

const PACKAGES_FUNCTION_URL = 'https://eiksxjzbwzujepqgmxsp.supabase.co/functions/v1/packages';

export const packageService = {
  async createPackage(data: CreatePackageRequest): Promise<Package> {
    const response = await fetch(PACKAGES_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create package');
    }
    
    return result.package;
  },

  async getPackages(reportId: string, userId?: string): Promise<Package[]> {
    const url = new URL(PACKAGES_FUNCTION_URL);
    url.searchParams.append('reportId', reportId);
    if (userId) {
      url.searchParams.append('userId', userId);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3N4anpid3p1amVwcWdteHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTk4NTMsImV4cCI6MjA1ODM5NTg1M30.8DC-2c-QaqQlGbwrw2bNutDfTJYFFEPtPbzhWobZOLY`,
      },
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch packages');
    }
    
    return result.packages;
  },
};
