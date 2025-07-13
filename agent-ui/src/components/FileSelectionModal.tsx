import React, { useState, useEffect } from 'react';
import { API } from '../lib/api';
import { FileMetadata } from '../types';

interface FileSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
  onExistingFileSelected: (fileId: string, fileName: string, fileType: string) => void;
  userId: string;
}

export default function FileSelectionModal({
  isOpen,
  onClose,
  onFileSelected,
  onExistingFileSelected,
  userId
}: FileSelectionModalProps) {
  const [mode, setMode] = useState<'upload' | 'select'>('upload');
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<FileMetadata | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && mode === 'select') {
      loadFiles();
    }
  }, [isOpen, mode, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading files for user:', userId);
      const response = await API.listFiles(userId);
      console.log('Files loaded:', response);
      setFiles(response.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
      setError(error instanceof Error ? error.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
      onClose();
    }
  };

  const handleExistingFileSelect = () => {
    const selectedFile = files.find(f => f.file_id === selectedFileId);
    if (selectedFile) {
      onExistingFileSelected(
        selectedFile.file_id, 
        selectedFile.display_name || selectedFile.file_name || 'Unnamed File', 
        selectedFile.file_type || 'unknown'
      );
      onClose();
    }
  };

  const handleDeleteClick = (file: FileMetadata, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent file selection
    setDeleteConfirmFile(file);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmFile) return;
    
    setIsDeleting(true);
    try {
      await API.deleteFile(userId, deleteConfirmFile.file_id);
      
      // Remove the deleted file from the list
      setFiles(files.filter(f => f.file_id !== deleteConfirmFile.file_id));
      
      // Clear selection if the deleted file was selected
      if (selectedFileId === deleteConfirmFile.file_id) {
        setSelectedFileId(null);
      }
      
      setDeleteConfirmFile(null);
    } catch (error) {
      console.error('Error deleting file:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmFile(null);
  };

  const toggleColumnsExpanded = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent file selection
    setExpandedFileId(expandedFileId === fileId ? null : fileId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    
    try {
      // Handle various date formats
      let date: Date;
      
      // If it's a timestamp string or number, parse it
      if (/^\d+$/.test(dateString)) {
        // Unix timestamp in seconds or milliseconds
        const timestamp = parseInt(dateString);
        date = new Date(timestamp > 1e10 ? timestamp : timestamp * 1000);
      } else {
        // Try parsing as ISO string or other formats
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date parsing error:', error, 'for string:', dateString);
      return 'Invalid date';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Select Data File</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upload New File
          </button>
          <button
            onClick={() => setMode('select')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'select'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Select Existing
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {mode === 'upload' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">Upload a new data file</p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".csv,.xlsx,.xls,.json,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Choose File
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: CSV, Excel (.xlsx, .xls), JSON, TXT
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="ml-2 text-gray-600">Loading files...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No files found</p>
                  <p className="text-sm mt-1">Upload your first file to get started</p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-96">
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.file_id}
                        onClick={() => setSelectedFileId(file.file_id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedFileId === file.file_id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-3 h-3 rounded-full mt-1.5 ${
                              selectedFileId === file.file_id ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1 min-w-0">
                              {/* File ID - prominently displayed with better contrast */}
                              <div className="text-sm font-mono text-blue-800 bg-blue-100 px-3 py-1.5 rounded-md inline-block mb-3 border border-blue-200">
                                <span className="text-blue-600 font-semibold">ID:</span> {file.file_id}
                              </div>
                              
                              {/* Display name - larger and more prominent */}
                              <div className="font-bold text-gray-900 mb-2 text-lg leading-tight">
                                {file.display_name || file.file_name || 'Unnamed File'}
                              </div>
                              
                              {/* Original filename if different - with better contrast */}
                              {file.original_filename && file.original_filename !== (file.display_name || file.file_name) && (
                                <div className="text-sm text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">
                                  <span className="text-gray-600">Original:</span> <span className="font-semibold text-gray-800">{file.original_filename}</span>
                                </div>
                              )}
                              
                              {/* File metadata */}
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                {file.file_type && <span className="font-medium text-gray-700">{file.file_type.toUpperCase()}</span>}
                                {file.row_count && <span className="text-gray-700">{file.row_count.toLocaleString()} rows</span>}
                                {file.columns && (
                                  <button
                                    onClick={(e) => toggleColumnsExpanded(file.file_id, e)}
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    <span className="font-medium">{file.columns.length} columns</span>
                                    <svg 
                                      className={`w-4 h-4 transition-transform ${expandedFileId === file.file_id ? 'rotate-180' : ''}`} 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                )}
                              </div>

                              {/* Columns dropdown */}
                              {file.columns && expandedFileId === file.file_id && (
                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                  <div className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                                    Columns ({file.columns.length})
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {file.columns.map((column, index) => (
                                      <div 
                                        key={index} 
                                        className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono text-gray-800 truncate"
                                        title={column}
                                      >
                                        {column}
                                      </div>
                                    ))}
                                  </div>
                                  {file.columns.length > 12 && (
                                    <div className="text-xs text-gray-500 mt-2 text-center">
                                      Showing all {file.columns.length} columns
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right text-sm ml-3 min-w-0 flex flex-col items-end">
                            <div className="font-bold text-gray-800 text-lg mb-1">v{file.current_version || 1}</div>
                            <div className="text-sm text-gray-700 font-medium">{formatDate(file.upload_timestamp)}</div>
                            {file.version_history && file.version_history.length > 1 && (
                              <div className="text-xs text-gray-500 mt-1 mb-2">
                                {file.version_history.length} versions
                              </div>
                            )}
                            
                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDeleteClick(file, e)}
                              className="mt-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Delete file"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {files.length > 0 && (
                <div className="pt-4 border-t flex justify-end">
                  <button
                    onClick={handleExistingFileSelect}
                    disabled={!selectedFileId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Select File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete File</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                Are you sure you want to delete this file? This will permanently remove:
              </p>
              <div className="bg-gray-50 rounded-md p-3 space-y-2">
                <div className="font-medium text-gray-900">
                  {deleteConfirmFile.display_name || deleteConfirmFile.file_name || 'Unnamed File'}
                </div>
                <div className="text-sm text-gray-600">
                  File ID: <span className="font-mono">{deleteConfirmFile.file_id}</span>
                </div>
                <div className="text-sm text-gray-600">
                  All {deleteConfirmFile.version_history?.length || 1} version(s) of this file
                </div>
              </div>
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ This operation is irreversible and cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete File'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}