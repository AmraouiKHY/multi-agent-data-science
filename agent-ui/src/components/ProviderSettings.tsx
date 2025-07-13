// src/components/ProviderSettings.tsx
import React, { useState, useEffect } from 'react';
import { API } from '../lib/api';

interface ProviderSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProviderSettings: React.FC<ProviderSettingsProps> = ({ isOpen, onClose }) => {
  const [currentProvider, setCurrentProvider] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('azure');
  const [ollamaModel, setOllamaModel] = useState<string>('llama3.2');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const providers = [
    { id: 'azure', name: 'Azure OpenAI', description: 'Microsoft Azure OpenAI service' },
    { id: 'groq', name: 'Groq', description: 'Fast inference with Groq LPU™ AI Inference Technology' },
    { id: 'ollama', name: 'Ollama', description: 'Local LLM with Ollama (requires local installation)' }
  ];

  // Load current provider on mount
  useEffect(() => {
    if (isOpen) {
      loadCurrentProvider();
    }
  }, [isOpen]);

  const loadCurrentProvider = async () => {
    try {
      setIsLoading(true);
      const response = await API.getCurrentProvider();
      setCurrentProvider(response.current_provider);
      setSelectedProvider(response.current_provider);
      if (response.ollama_model) {
        setOllamaModel(response.ollama_model);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load current provider');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetProvider = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await API.setProvider(
        selectedProvider,
        selectedProvider === 'ollama' ? ollamaModel : undefined
      );

      setCurrentProvider(response.current_provider);
      setSuccess(response.message);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set provider');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">LLM Provider Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Provider Display */}
          {currentProvider && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Current provider:</span> {currentProvider}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Provider Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select LLM Provider
            </label>
            
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-start space-x-3">
                <input
                  type="radio"
                  id={provider.id}
                  name="provider"
                  value={provider.id}
                  checked={selectedProvider === provider.id}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor={provider.id} className="cursor-pointer">
                    <div className="text-sm font-medium text-gray-700">{provider.name}</div>
                    <div className="text-xs text-gray-500">{provider.description}</div>
                  </label>
                </div>
              </div>
            ))}

            {/* Ollama Model Input */}
            {selectedProvider === 'ollama' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ollama Model Name
                </label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="e.g., llama3.2, codellama, mistral"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                />
                <p className="mt-2 text-sm text-gray-600">
                  Enter the exact model name as it appears in your local Ollama installation.
                  <br />
                  <span className="font-medium">Popular models:</span> llama3.2, codellama, mistral, phi3, gemma2
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  ⚠️ Make sure the model is installed locally with <code className="bg-gray-100 px-1 py-0.5 rounded">ollama pull &lt;model-name&gt;</code>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSetProvider}
            disabled={isLoading || selectedProvider === currentProvider}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Applying...
              </div>
            ) : (
              'Apply Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderSettings;
