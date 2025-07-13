import React from 'react';

interface FileVersionStatusProps {
  currentFile: File | null;
  currentFileId: string | null;
  currentFileName?: string | null;
  versionInfo?: {
    current_version: number;
    previous_version?: number;
    changes_detected: boolean;
    change_summary?: string;
  } | null;
  onClearFile: () => void;
  onViewFile?: () => void;
}

export default function FileVersionStatus({ 
  currentFile, 
  currentFileId, 
  currentFileName,
  versionInfo,
  onClearFile,
  onViewFile
}: FileVersionStatusProps) {
  if (!currentFile) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div className="text-sm font-medium text-green-800">
              {currentFileName || currentFile.name}
              {versionInfo && (
                <span className="ml-2 text-xs text-green-600">
                  v{versionInfo.current_version}
                </span>
              )}
            </div>
            <div className="text-xs text-green-600">
              {(currentFile.size / 1024).toFixed(1)} KB
              {currentFileId && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                  File ID: {currentFileId.slice(0, 8)}...
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onViewFile && currentFileId && (
            <button
              onClick={onViewFile}
              className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
              title="View file content and version history"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={onClearFile}
            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
            title="Clear current file"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-green-600">
        {currentFileId ? (
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            File uploaded and ready for analysis. Subsequent queries will use the existing file.
          </span>
        ) : (
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            File will be uploaded on next query.
          </span>
        )}
        
        {versionInfo && versionInfo.changes_detected && (
          <div className="mt-1 text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {versionInfo.change_summary || 'File changes detected'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
