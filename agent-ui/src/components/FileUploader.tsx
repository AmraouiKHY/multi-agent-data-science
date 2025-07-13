"use client";

import { useState, useRef, useEffect } from 'react';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FileUploader({ 
  onFileSelected, 
  isOpen,
  onClose
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset the file when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);
  
  // Early return to prevent rendering when not open
  if (!isOpen) return null;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File dropped:', file.name);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      console.log('Submitting file:', selectedFile.name);
      onFileSelected(selectedFile);
      onClose();
    }
  };
  
  const dragAreaClass = `
    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer mb-6
    ${isDragging ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}
    hover:border-gray-400 hover:bg-gray-50 transition-all duration-200
  `;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-gray-700">Add Data File</h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p className="mb-1"><strong>Note:</strong> File upload is optional for some supervisors.</p>
          <p className="text-xs text-blue-600">Analytics, ML, and Preprocessing supervisors work best with data files.</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div
            className={dragAreaClass}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="text-base text-gray-600 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-sm text-gray-500 mb-3">
                or
              </p>
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
              >
                Browse files
              </button>
              <p className="text-xs text-gray-400 mt-4">
                Supported formats: CSV, Excel, JSON, etc.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls,.json,.txt"
            />
          </div>
          
          {selectedFile && (
            <div className="mb-6 mt-2 bg-gray-50 p-3 rounded border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">{selectedFile.name}</span>
                </div>
                <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="px-4 py-2 border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className={`px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 ${
                !selectedFile ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Use File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 