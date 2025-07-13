// src/components/MediaDisplay.tsx
import React from 'react';

import { PlotData } from '../types';

interface MediaDisplayProps {
  plotBase64?: string;  // First plot for backward compatibility
  plotBase64List?: PlotData[];  // Array of all plots with metadata
  plotContentType?: string;
  dataBase64?: string;
  dataContentType?: string;
  hasPlot?: boolean;
  hasMultiplePlots?: boolean;  // Flag for multiple plots
  hasData?: boolean;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
  plotBase64,
  plotBase64List,
  plotContentType,
  dataBase64,
  dataContentType,
  hasPlot,
  hasMultiplePlots,
  hasData
}) => {
  const handleDownload = (base64Data: string, filename: string, contentType: string) => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Display plots - handle both single and multiple plots */}
      {hasPlot && (
        <div className="space-y-4">
          {/* Multiple plots from plot_base64_list */}
          {hasMultiplePlots && plotBase64List && plotBase64List.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">
                Generated Plots ({plotBase64List.length})
              </h4>
              {plotBase64List.map((plot, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-600">
                      {plot.filename || `Plot ${index + 1}`}
                    </h5>
                    <button
                      onClick={() => handleDownload(plot.base64, plot.filename || `plot_${index + 1}.png`, plot.content_type)}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Download
                    </button>
                  </div>
                  {plot.content_type?.startsWith('image/') && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`data:${plot.content_type};base64,${plot.base64}`}
                      alt={`Generated plot ${index + 1}`}
                      className="max-w-full h-auto rounded border"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Single plot fallback for backward compatibility */
            plotBase64 && plotContentType?.startsWith('image/') && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Generated Plot</h4>
                  <button
                    onClick={() => handleDownload(plotBase64, 'plot.png', plotContentType)}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Download
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:${plotContentType};base64,${plotBase64}`}
                  alt="Generated plot"
                  className="max-w-full h-auto rounded border"
                />
              </div>
            )
          )}
        </div>
      )}

      {/* Display data file download if available */}
      {hasData && dataBase64 && dataContentType && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Generated Data File</h4>
              <p className="text-xs text-gray-500">
                Type: {dataContentType}
              </p>
            </div>
            <button
              onClick={() => {
                const extension = dataContentType.includes('csv') ? 'csv' : 
                                 dataContentType.includes('excel') || dataContentType.includes('spreadsheet') ? 'xlsx' : 
                                 dataContentType.includes('json') ? 'json' : 'data';
                handleDownload(dataBase64, `processed_data.${extension}`, dataContentType);
              }}
              className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
            >
              Download Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDisplay;
