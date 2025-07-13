import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface FileContentViewerProps {
  fileBase64?: string;
  fileName?: string;
  fileType?: string;
}

interface ParsedData {
  headers: string[];
  rows: string[][];
  totalRows: number;
  error?: string;
}

export default function FileContentViewer({ fileBase64, fileName, fileType }: FileContentViewerProps) {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'raw'>('table');
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 50;

  // Enhanced debug logging
  console.log('FileContentViewer props:', { 
    fileBase64: fileBase64 ? `${fileBase64.substring(0, 50)}...` : 'null/undefined',
    fileName, 
    fileType,
    fileBase64Length: fileBase64?.length,
    hasFileBase64: !!fileBase64,
    hasFileName: !!fileName
  });
  
  // Log when props change
  console.log('FileContentViewer render - parsedData state:', parsedData);
  console.log('FileContentViewer render - isLoading state:', isLoading);

  const parseFile = useCallback(async (base64Data: string, filename: string) => {
    setIsLoading(true);
    try {
      // Use fileType if provided, otherwise determine from extension
      const getFileExtension = (fname: string): string => {
        return fname.split('.').pop()?.toLowerCase() || '';
      };
      
      const extension = fileType?.toLowerCase() || getFileExtension(filename);
      
      // Convert base64 to binary data
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      let parsed: ParsedData;

      switch (extension) {
        case 'csv':
          parsed = await parseCSV(binaryString);
          break;
        case 'xlsx':
        case 'xls':
          parsed = await parseExcel(bytes);
          break;
        case 'json':
          parsed = parseJSON(binaryString);
          break;
        default:
          // Try to parse as text/CSV first
          try {
            parsed = await parseCSV(binaryString);
          } catch {
            parsed = parseAsText(binaryString);
          }
      }

      setParsedData(parsed);
    } catch (error) {
      console.error('Error parsing file:', error);
      setParsedData({
        headers: [],
        rows: [],
        totalRows: 0,
        error: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  }, [fileType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fileBase64 && fileName) {
      parseFile(fileBase64, fileName);
    }
  }, [fileBase64, fileName, parseFile]);

  const parseCSV = (data: string): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(results.errors[0].message));
            return;
          }

          const rows = results.data as string[][];
          if (rows.length === 0) {
            resolve({
              headers: [],
              rows: [],
              totalRows: 0
            });
            return;
          }

          const headers = rows[0];
          const dataRows = rows.slice(1);

          resolve({
            headers,
            rows: dataRows,
            totalRows: dataRows.length
          });
        },
        error: (error: Error) => reject(error)
      });
    });
  };

  const parseExcel = async (data: Uint8Array): Promise<ParsedData> => {
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON to get structured data
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      
      if (jsonData.length === 0) {
        return {
          headers: [],
          rows: [],
          totalRows: 0
        };
      }

      const headers = jsonData[0] || [];
      const dataRows = jsonData.slice(1);

      return {
        headers,
        rows: dataRows,
        totalRows: dataRows.length
      };
    } catch (error) {
      throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const parseJSON = (data: string): ParsedData => {
    try {
      const jsonData = JSON.parse(data);
      
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        // If it's an array of objects, convert to table format
        if (typeof jsonData[0] === 'object' && jsonData[0] !== null) {
          const headers = Object.keys(jsonData[0]);
          const rows = jsonData.map(item => headers.map(header => String(item[header] || '')));
          
          return {
            headers,
            rows,
            totalRows: rows.length
          };
        }
      }
      
      // If it's not a structured array, show as raw JSON
      return parseAsText(JSON.stringify(jsonData, null, 2));
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const parseAsText = (data: string): ParsedData => {
    const lines = data.split('\n');
    return {
      headers: ['Content'],
      rows: lines.map(line => [line]),
      totalRows: lines.length
    };
  };

  const getCurrentPageData = () => {
    if (!parsedData) return { headers: [], rows: [] };
    
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageRows = parsedData.rows.slice(startIndex, endIndex);
    
    return {
      headers: parsedData.headers,
      rows: pageRows
    };
  };

  const totalPages = parsedData ? Math.ceil(parsedData.totalRows / rowsPerPage) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Parsing file...</span>
        </div>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>No file data available</p>
      </div>
    );
  }

  if (parsedData.error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <svg className="w-8 h-8 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Error parsing file</p>
          <p className="text-sm mt-1">{parsedData.error}</p>
        </div>
      </div>
    );
  }

  const { headers, rows } = getCurrentPageData();

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'table' | 'raw')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="table">Table</option>
              <option value="raw">Raw Data</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            {parsedData.totalRows} rows total
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && viewMode === 'table' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              {headers.length > 0 && (
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                      >
                        {header || `Column ${index + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 text-sm text-gray-900 border-r border-gray-200 last:border-r-0 max-w-xs truncate"
                        title={String(cell)}
                      >
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
            {fileBase64 ? atob(fileBase64) : 'No raw data available'}
          </pre>
        </div>
      )}
    </div>
  );
}
