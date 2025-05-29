
/**
 * Utility functions for handling Google Documents and Drive files
 */

export interface DocumentInfo {
  isGoogleDocument: boolean;
  fileId: string | null;
  documentType: 'docs' | 'sheets' | 'slides' | 'drive' | 'unknown';
}

/**
 * Detects if a document is from Google (Docs, Sheets, Slides, or Drive)
 */
export const isGoogleDocument = (url: string, documentType?: string): boolean => {
  if (!url) return false;
  
  // Check URL patterns
  const googleUrlPatterns = [
    'docs.google.com',
    'drive.google.com',
    'sheets.google.com',
    'slides.google.com'
  ];
  
  const hasGoogleUrl = googleUrlPatterns.some(pattern => url.includes(pattern));
  
  // Check document type
  const googleDocTypes = ['google-docs', 'google-sheets', 'google-slides'];
  const hasGoogleDocType = documentType && googleDocTypes.some(type => documentType.includes(type));
  
  return hasGoogleUrl || !!hasGoogleDocType;
};

/**
 * Extracts the Google Drive file ID from various URL formats
 */
export const extractFileIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    // Google Docs: https://docs.google.com/document/d/FILE_ID/edit
    // Google Sheets: https://docs.google.com/spreadsheets/d/FILE_ID/edit
    // Google Slides: https://docs.google.com/presentation/d/FILE_ID/edit
    /\/d\/([a-zA-Z0-9-_]+)/,
    
    // Google Drive: https://drive.google.com/file/d/FILE_ID/view
    /\/file\/d\/([a-zA-Z0-9-_]+)/,
    
    // Google Drive direct: https://drive.google.com/open?id=FILE_ID
    /[?&]id=([a-zA-Z0-9-_]+)/,
    
    // Alternative patterns
    /\/folders\/([a-zA-Z0-9-_]+)/,
    /\/document\/d\/([a-zA-Z0-9-_]+)/,
    /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
    /\/presentation\/d\/([a-zA-Z0-9-_]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Determines the Google document type from URL
 */
export const getDocumentType = (url: string): 'docs' | 'sheets' | 'slides' | 'drive' | 'unknown' => {
  if (!url) return 'unknown';
  
  if (url.includes('/document/') || url.includes('docs.google.com')) return 'docs';
  if (url.includes('/spreadsheets/') || url.includes('sheets.google.com')) return 'sheets';
  if (url.includes('/presentation/') || url.includes('slides.google.com')) return 'slides';
  if (url.includes('drive.google.com')) return 'drive';
  
  return 'unknown';
};

/**
 * Converts Google Docs URLs to preview-friendly embed URLs
 */
export const getDocumentViewerUrl = (url: string): string => {
  const fileId = extractFileIdFromUrl(url);
  if (!fileId) return url;
  
  const docType = getDocumentType(url);
  
  switch (docType) {
    case 'docs':
      return `https://docs.google.com/document/d/${fileId}/preview`;
    case 'sheets':
      return `https://docs.google.com/spreadsheets/d/${fileId}/pubhtml?gid=0&single=true&widget=true&headers=false`;
    case 'slides':
      return `https://docs.google.com/presentation/d/${fileId}/embed?start=false&loop=false&delayms=3000`;
    case 'drive':
      // For general Drive files, try the preview endpoint
      return `https://drive.google.com/file/d/${fileId}/preview`;
    default:
      return url;
  }
};

/**
 * Creates thumbnail URLs using Google Drive's thumbnail API
 */
export const getDocumentPreviewUrl = (url: string, size: string = 'w600'): string => {
  const fileId = extractFileIdFromUrl(url);
  if (!fileId) return '';
  
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
};

/**
 * Gets comprehensive document information
 */
export const getDocumentInfo = (url: string, documentType?: string): DocumentInfo => {
  return {
    isGoogleDocument: isGoogleDocument(url, documentType),
    fileId: extractFileIdFromUrl(url),
    documentType: getDocumentType(url)
  };
};

/**
 * Generates an embedded iframe URL with minimal Google interface
 */
export const getCleanEmbedUrl = (url: string): string => {
  const fileId = extractFileIdFromUrl(url);
  if (!fileId) return url;
  
  const docType = getDocumentType(url);
  
  switch (docType) {
    case 'docs':
      return `https://docs.google.com/document/d/${fileId}/pub?embedded=true`;
    case 'sheets':
      return `https://docs.google.com/spreadsheets/d/${fileId}/pubhtml?widget=true&headers=false`;
    case 'slides':
      return `https://docs.google.com/presentation/d/${fileId}/embed?rm=minimal`;
    default:
      return getDocumentViewerUrl(url);
  }
};
