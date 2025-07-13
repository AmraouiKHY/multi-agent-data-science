import React, { useState } from 'react';
import FileContentViewer from './FileContentViewer';

interface FileVersionViewerProps {
  fileId?: string | null;
  fileName?: string | null;
  versionInfo?: {
    current_version: number;
    previous_version?: number;
    changes_detected: boolean;
    change_summary?: string;
  } | null;
  fileContentBase64?: string | null;
  fileType?: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function FileVersionViewer({ 
  fileId, 
  fileName, 
  versionInfo, 
  fileContentBase64,
  fileType,
  isVisible, 
  onClose 
}: FileVersionViewerProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'changes'>('content');
  
  // Debug logging
  console.log('FileVersionViewer props:', {
    fileId: fileId ? `${fileId.substring(0, 8)}...` : 'null',
    fileName,
    fileType,
    fileContentBase64: fileContentBase64 ? `${fileContentBase64.substring(0, 50)}...` : 'null/undefined',
    fileContentBase64Length: fileContentBase64?.length,
    hasFileContentBase64: !!fileContentBase64,
    versionInfo,
    isVisible
  });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {fileName || 'File Version Viewer'}
              </h2>
              {versionInfo && (
                <p className="text-sm text-gray-600">
                  Version {versionInfo.current_version}
                  {versionInfo.previous_version && (
                    <span> (updated from v{versionInfo.previous_version})</span>
                  )}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Version Status Bar */}
        {versionInfo && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    versionInfo.changes_detected ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {versionInfo.changes_detected ? 'Changes Detected' : 'No Changes'}
                  </span>
                </div>
                {fileId && (
                  <div className="text-xs text-gray-500 font-mono">
                    ID: {fileId.substring(0, 8)}...
                  </div>
                )}
              </div>
              {versionInfo.change_summary && (
                <div className="text-sm text-blue-600 max-w-md truncate">
                  {versionInfo.change_summary}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            File Content
          </button>
          <button
            onClick={() => setActiveTab('changes')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'changes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Version History
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'content' && (
            <div>
              <FileContentViewer
                fileBase64={fileContentBase64 || undefined}
                fileName={fileName || undefined}
                fileType={fileType || undefined}
              />
            </div>
          )}

          {activeTab === 'changes' && (
            <div className="space-y-4">
              {versionInfo ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        Version {versionInfo.current_version} (Current)
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      {versionInfo.changes_detected 
                        ? `Changes detected: ${versionInfo.change_summary || 'File was modified'}`
                        : 'No changes detected from previous version'
                      }
                    </p>
                  </div>

                  {versionInfo.previous_version && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="font-medium text-gray-800">
                          Version {versionInfo.previous_version} (Previous)
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Previous version of the file
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No version information available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
