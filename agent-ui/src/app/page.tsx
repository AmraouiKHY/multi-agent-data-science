// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { API, SUPERVISOR_TYPES } from '../lib/api';
import { Message } from '../types';
import FileSelectionModal from '../components/FileSelectionModal';
import MediaDisplay from '../components/MediaDisplay';
import ProviderSettings from '../components/ProviderSettings';
import FileVersionStatus from '../components/FileVersionStatus';
import FileVersionViewer from '../components/FileVersionViewer';
import ConversationSidebar from '../components/ConversationSidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Logo component
function SupervisorLogo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl'
  };
  
  return (
    <span className={`font-bold ${sizeClasses[size]} text-gray-800`}>
      Multi-Agent Supervisor
    </span>
  );
}

// Simple component for rendering a message in the chat
function ChatMessage({ 
  message, 
  supervisorName, 
  onViewFile 
}: { 
  message: Message; 
  supervisorName?: string;
  onViewFile?: (fileData: {
    fileId?: string;
    fileName?: string;
    fileType?: string;
    versionInfo?: {
      current_version: number;
      previous_version?: number;
      changes_detected: boolean;
      change_summary?: string;
    };
    fileContentBase64?: string;
  }) => void;
}) {
  if (message.role === 'system') {
    return (
      <div className="my-3 text-center system-message">
        <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full">
          {message.content}
        </span>
      </div>
    );
  }
  
  const isUser = message.role === 'user';
  
  return (
    <div className={`w-full ${isUser ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              isUser ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {isUser ? 'U' : 'AI'}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-900">
                {isUser ? 'You' : (supervisorName || 'AI Assistant')}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
              {/* Version info badge for agent messages with file updates */}
              {!isUser && message.versionInfo && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  v{message.versionInfo.current_version}
                  {message.fileUpdated && " (Updated)"}
                </span>
              )}
            </div>
            
            {/* Message Content */}
            <div className="text-gray-800">
              {isUser ? (
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              ) : (
                <div className="prose prose-sm prose-gray max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-xl font-bold mb-3 text-gray-900">{children}</h1>,
                      h2: ({children}) => <h2 className="text-lg font-semibold mb-2 text-gray-900">{children}</h2>,
                      h3: ({children}) => <h3 className="text-md font-medium mb-2 text-gray-800">{children}</h3>,
                      p: ({children}) => <p className="mb-3 text-gray-800 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-gray-800">{children}</li>,
                      code: ({children}) => <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm text-red-600 font-mono">{children}</code>,
                      pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-3 font-mono text-sm">{children}</pre>,
                      strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-3">{children}</blockquote>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
              
              {/* Display media if it's an agent message and has media */}
              {!isUser && (message.hasPlot || message.hasData) && (
                <MediaDisplay
                  plotBase64={message.plotBase64}
                  plotBase64List={message.plotBase64List}
                  plotContentType={message.plotContentType}
                  dataBase64={message.dataBase64}
                  dataContentType={message.dataContentType}
                  hasPlot={message.hasPlot}
                  hasMultiplePlots={message.hasMultiplePlots}
                  hasData={message.hasData}
                />
              )}
              
              {/* Display version info if available */}
              {!isUser && message.versionInfo && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  message.fileUpdated 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-blue-50 border border-blue-200'
                }`}>
                  <div className={`flex items-center justify-between ${
                    message.fileUpdated ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">
                        {message.fileName || 'File'} - Version {message.versionInfo.current_version}
                        {message.fileUpdated && " (Updated)"}
                      </span>
                      {message.versionInfo.previous_version && (
                        <span className="ml-2 text-xs opacity-75">
                          (was v{message.versionInfo.previous_version})
                        </span>
                      )}
                    </div>
                    {(message.fileContentBase64 || message.dataBase64) && onViewFile && (
                      <button
                        onClick={() => {
                          onViewFile({
                            fileId: message.fileId,
                            fileName: message.fileName,
                            fileType: message.fileType,
                            versionInfo: message.versionInfo,
                            fileContentBase64: message.fileContentBase64 || message.dataBase64
                          });
                        }}
                        className={`text-xs px-3 py-1 rounded transition-colors ${
                          message.fileUpdated
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        View File
                      </button>
                    )}
                  </div>
                  {message.versionInfo.change_summary && (
                    <div className={`mt-2 text-xs ${
                      message.fileUpdated ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      <strong>Changes:</strong> {message.versionInfo.change_summary}
                    </div>
                  )}
                  {message.fileUpdated && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      File has been updated with your changes
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [currentFileContentBase64, setCurrentFileContentBase64] = useState<string | null>(null);
  const [currentFileType, setCurrentFileType] = useState<string | null>(null);
  const [currentVersionInfo, setCurrentVersionInfo] = useState<{
    current_version: number;
    previous_version?: number;
    changes_detected: boolean;
    change_summary?: string;
  } | null>(null);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [isFileSelectionOpen, setIsFileSelectionOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState('default');
  const [isProviderSettingsOpen, setIsProviderSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userId] = useState('system_user'); // In a real app, this would come from authentication

  // Scroll to bottom when messages update
  useEffect(() => {
    console.log('Messages updated, scrolling to bottom');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Debug current messages state
  useEffect(() => {
    console.log('Current messages:', messages);
  }, [messages]);

  const handleFileSelected = (file: File) => {
    console.log('File selected:', file.name);
    
    if (!file) {
      console.log('No file selected, ignoring');
      return;
    }
    
    console.log('Using file:', file.name);
    setCurrentFile(file);
    setCurrentFileName(file.name);
    // Reset file_id and content when a new file is selected
    setCurrentFileId(null);
    setCurrentFileContentBase64(null);
    setCurrentFileType(null);
    setCurrentVersionInfo(null);
    
    // Add a notification that the file is now being used
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `Now using data file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleExistingFileSelected = (fileId: string, fileName: string, fileType: string) => {
    console.log('Existing file selected:', { fileId, fileName, fileType });
    
    // Clear current file and set the existing file info
    setCurrentFile(null);
    setCurrentFileId(fileId);
    setCurrentFileName(fileName);
    setCurrentFileType(fileType);
    // Reset content and version info - will be loaded when used
    setCurrentFileContentBase64(null);
    setCurrentVersionInfo(null);
    
    // Add a notification that the existing file is now being used
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `Now using existing file: ${fileName} (ID: ${fileId})`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    setCurrentFileId(null);
    setCurrentFileName(null);
    setCurrentFileContentBase64(null);
    setCurrentFileType(null);
    setCurrentVersionInfo(null);
    setIsFileViewerOpen(false);
    
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: 'File cleared. You can now upload a new file or continue without a file.',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleAnalyzeData = async (file: File | null, query: string) => {
    try {
      console.log('Making data analysis request with supervisor:', selectedSupervisor);
      console.log('File:', file?.name || 'No file');
      console.log('Current file_id:', currentFileId);
      
      // Use file_id if available, otherwise upload file
      const fileToUpload = currentFileId ? null : file;
      const result = await API.analyzeData(fileToUpload, query, selectedSupervisor, currentFileId || undefined);
      
      // Store file_id and version info from response for subsequent requests
      if (result.file_id && !currentFileId) {
        setCurrentFileId(result.file_id);
        console.log('Stored file_id:', result.file_id);
      }

      // Store file content and version info for visualization
      // The server returns file content in data_base64 when file is updated
      if (result.data_base64) {
        console.log('Setting file content base64 from data_base64:', {
          length: result.data_base64.length,
          preview: result.data_base64.substring(0, 100) + '...',
          file_updated: result.file_updated
        });
        setCurrentFileContentBase64(result.data_base64);
      } else if (result.file_content_base64) {
        console.log('Setting file content base64 from file_content_base64:', {
          length: result.file_content_base64.length,
          preview: result.file_content_base64.substring(0, 100) + '...'
        });
        setCurrentFileContentBase64(result.file_content_base64);
      }
      
      if (result.file_name) {
        setCurrentFileName(result.file_name);
      }
      
      if (result.file_type) {
        setCurrentFileType(result.file_type);
      }
      
      if (result.version_info) {
        console.log('Setting version info:', result.version_info);
        setCurrentVersionInfo(result.version_info);
        
        // Auto-open file viewer when a new version is detected
        if (result.file_updated && result.version_info.changes_detected) {
          console.log('Auto-opening file viewer for new version');
          setIsFileViewerOpen(true);
        }
      }
      
      // Add version info to system messages if file was updated
      if (result.file_updated && result.version_info) {
        const versionMessage: Message = {
          id: `version-${Date.now()}`,
          role: 'system',
          content: `File updated to version ${result.version_info.current_version}${
            result.version_info.change_summary ? `: ${result.version_info.change_summary}` : ''
          }`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, versionMessage]);
      }
      
      // Add the agent response with media data and version info if available
      const agentMessage: Message = {
        id: Date.now().toString(),
        role: 'agent',
        content: result.message || 'No response generated',
        timestamp: new Date(),
        plotBase64: result.plot_base64,  // First plot for backward compatibility
        plotBase64List: result.plot_base64_list,  // Array of all plots with metadata
        plotContentType: result.plot_content_type,
        dataBase64: result.data_base64,
        dataContentType: result.data_content_type,
        hasPlot: result.has_plot,
        hasMultiplePlots: result.has_multiple_plots,  // Flag for multiple plots
        hasData: result.has_data,
        fileId: result.file_id,
        fileUpdated: result.file_updated,
        fileName: result.file_name,
        fileContent: result.file_content,
        fileContentBase64: result.data_base64 && result.file_updated ? result.data_base64 : result.file_content_base64,
        fileType: result.file_type,
        versionInfo: result.version_info
      };
      
      console.log('Creating agent message with:', {
        fileId: agentMessage.fileId,
        fileUpdated: agentMessage.fileUpdated,
        versionInfo: agentMessage.versionInfo,
        hasFileContent: !!agentMessage.fileContentBase64
      });
      
      setMessages(prevMessages => [...prevMessages, agentMessage]);
      
    } catch (error) {
      console.error('Error in data analysis:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessageContent = input.trim();
    console.log('Submitting user message:', userMessageContent);
    
    // Some supervisors can work without files, so we'll allow queries without files
    // but show a warning for certain supervisor types that typically need data
    const dataFocusedSupervisors = ['analytics', 'ml', 'preprocessing'];
    if (!currentFile && dataFocusedSupervisors.includes(selectedSupervisor)) {
      setError(`The ${SUPERVISOR_TYPES.find(s => s.id === selectedSupervisor)?.name} typically requires a data file for optimal results.`);
      // Don't return - allow the query to proceed
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
      timestamp: new Date()
    };
    
    console.log('Adding user message to state:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setInput('');
    
    await handleAnalyzeData(currentFile, userMessageContent);
  };

  const handleNewConversation = () => {
    // Clear current conversation state
    setMessages([]);
    setCurrentFile(null);
    setCurrentFileId(null);
    setCurrentFileName(null);
    setCurrentFileContentBase64(null);
    setCurrentFileType(null);
    setCurrentVersionInfo(null);
    setIsFileViewerOpen(false);
    setError(null);
    setInput('');
    setCurrentConversationId(null);
    
    // Close sidebar on mobile after creating new conversation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    // In a real app, this would load the conversation from storage/API
    setCurrentConversationId(conversationId);
    
    // For demo purposes, we'll just clear the current state
    // In a real implementation, you would load the conversation messages and state
    console.log('Loading conversation:', conversationId);
    
    // Close sidebar on mobile after selecting conversation
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Conversation Sidebar - Independent scroll container */}
      <div className="flex-shrink-0 h-screen overflow-hidden">
        <ConversationSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewConversation={handleNewConversation}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Main Chat Area - Independent scroll container */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header with sidebar toggle */}
        <div className="bg-white border-b border-gray-200 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <SupervisorLogo size="medium" />
            <div className="w-9" /> {/* Spacer for center alignment */}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-auto p-4 main-chat-container">
          <div className="max-w-3xl mx-auto chat-messages-container">
            {/* Conditionally render welcome message if no messages */}
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-96 text-center space-y-6">
                <div className="mt-8 mb-4 hidden lg:block">
                  <SupervisorLogo size="large" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Ask questions about your data or request analysis from specialized supervisors.</p>
                  <p className="text-gray-700">Choose the right supervisor for your task and get intelligent responses.</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-white shadow-sm border-l-4 border-red-500 rounded p-4 text-gray-600 my-4 fade-in">
                {error}
              </div>
            )}

            {/* Supervisor Type Indicator */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700 mb-4 flex items-center justify-between fade-in">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                </svg>
                <span>Using: {SUPERVISOR_TYPES.find(s => s.id === selectedSupervisor)?.name}</span>
              </div>
              {!currentFile && ['analytics', 'ml', 'preprocessing'].includes(selectedSupervisor) && (
                <span className="ml-2 text-orange-600 text-xs">⚠ Data file recommended</span>
              )}
            </div>

            {/* Current Data File Indicator */}
            {(currentFile || currentFileId) && (
              <div className="bg-white shadow-sm border border-gray-200 rounded p-3 text-sm text-gray-600 mb-4 flex items-center justify-between fade-in">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <line x1="10" y1="9" x2="8" y2="9"></line>
                  </svg>
                  <span className="truncate max-w-xs">
                    {currentFile ? (
                      `${currentFile.name} (${(currentFile.size / 1024).toFixed(1)} KB)`
                    ) : (
                      `${currentFileName || 'Unknown file'} ${currentFileId ? `(ID: ${currentFileId.substring(0, 8)}...)` : ''}`
                    )}
                  </span>
                  {currentFileId && !currentFile && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Existing
                    </span>
                  )}
                  {currentVersionInfo && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      v{currentVersionInfo.current_version}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {currentFileContentBase64 && (
                    <button
                      onClick={() => setIsFileViewerOpen(true)}
                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                    >
                      View File
                    </button>
                  )}
                  <button 
                    onClick={handleClearFile}
                    className="text-gray-400 hover:text-gray-600 ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="space-y-0">
              {messages.map(msg => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  supervisorName={msg.role === 'agent' ? SUPERVISOR_TYPES.find(s => s.id === selectedSupervisor)?.name : undefined}
                  onViewFile={(fileData) => {
                    // Update current file info and open viewer
                    if (fileData.fileId) setCurrentFileId(fileData.fileId);
                    if (fileData.fileName) setCurrentFileName(fileData.fileName);
                    if (fileData.fileType) setCurrentFileType(fileData.fileType);
                    if (fileData.versionInfo) setCurrentVersionInfo(fileData.versionInfo);
                    if (fileData.fileContentBase64) setCurrentFileContentBase64(fileData.fileContentBase64);
                    setIsFileViewerOpen(true);
                  }}
                />
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="w-full bg-gray-50 border-b border-gray-100">
                  <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                          AI
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {SUPERVISOR_TYPES.find(s => s.id === selectedSupervisor)?.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-gray-400 pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 pulse" style={{ animationDelay: '300ms' }}></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 pulse" style={{ animationDelay: '600ms' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 sticky bottom-0 w-full bg-white">
          <div className="input-container max-w-3xl mx-auto">
            {/* File Version Status */}
            <FileVersionStatus
              currentFile={currentFile}
              currentFileId={currentFileId}
              currentFileName={currentFileName}
              versionInfo={currentVersionInfo}
              onClearFile={handleClearFile}
              onViewFile={() => setIsFileViewerOpen(true)}
            />
            
            <form
              onSubmit={handleSubmit}
              className="mx-auto grid max-w-3xl grid-rows-[auto_auto] gap-0"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.metaKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    const el = e.target as HTMLElement | undefined;
                    const form = el?.closest("form");
                    form?.requestSubmit();
                  }
                }}
                placeholder="Ask the supervisor about your data or request analysis..."
                className="min-h-[60px] w-full resize-none bg-white p-4 outline-none text-gray-700 placeholder:text-gray-400 rounded-t-md"
              />

              <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-white rounded-b-md">
                <div className="flex items-center space-x-4">
                  {/* Add file button */}
                  <button
                    type="button"
                    onClick={() => setIsFileSelectionOpen(true)}
                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    {currentFile || currentFileId ? 'Change file' : 'Add data file'}
                  </button>

                  {/* Supervisor Selection */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Supervisor:</span>
                    <select
                      value={selectedSupervisor}
                      onChange={(e) => setSelectedSupervisor(e.target.value)}
                      className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-gray-600 max-w-[140px]"
                      title={SUPERVISOR_TYPES.find(s => s.id === selectedSupervisor)?.description}
                    >
                      {SUPERVISOR_TYPES.map(supervisor => (
                        <option key={supervisor.id} value={supervisor.id}>
                          {supervisor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Provider Settings Button */}
                  <button
                    type="button"
                    onClick={() => setIsProviderSettingsOpen(true)}
                    className="flex items-center text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    title="LLM Provider Settings"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                    </svg>
                    Settings
                  </button>
                </div>
                {isLoading ? (
                  <button
                    type="button"
                    className="btn-secondary px-4 py-2 flex items-center gap-2 text-gray-600"
                    onClick={() => {
                      console.log('Cancelling request');
                      setIsLoading(false);
                    }}
                  >
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancel
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 text-white font-medium"
                    disabled={isLoading || !input.trim()}
                  >
                    Send
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* File Selection Modal */}
      <FileSelectionModal 
        isOpen={isFileSelectionOpen}
        onClose={() => setIsFileSelectionOpen(false)}
        onFileSelected={handleFileSelected}
        onExistingFileSelected={handleExistingFileSelected}
        userId={userId}
      />

      {/* Provider Settings Modal */}
      <ProviderSettings
        isOpen={isProviderSettingsOpen}
        onClose={() => setIsProviderSettingsOpen(false)}
      />

      {/* File Version Viewer Modal */}
      <FileVersionViewer
        fileId={currentFileId}
        fileName={currentFileName}
        versionInfo={currentVersionInfo}
        fileContentBase64={currentFileContentBase64}
        fileType={currentFileType}
        isVisible={isFileViewerOpen}
        onClose={() => setIsFileViewerOpen(false)}
      />
    </div>
  );
}