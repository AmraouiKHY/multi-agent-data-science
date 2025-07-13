// src/components/ConversationSidebar.tsx
"use client";

import { useState, useEffect } from 'react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ConversationSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewConversation: () => void;
  currentConversationId?: string | null;
  onSelectConversation?: (conversationId: string) => void;
}

export default function ConversationSidebar({
  isOpen,
  onToggle,
  onNewConversation,
  currentConversationId,
  onSelectConversation
}: ConversationSidebarProps) {
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock conversation data - in a real app, this would come from an API or context
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Data Analysis - Sales Report',
      lastMessage: 'Can you analyze the quarterly sales trends?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      messageCount: 8
    },
    {
      id: '2',
      title: 'ML Model Training',
      lastMessage: 'What are the best features for this model?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      messageCount: 15
    },
    {
      id: '3',
      title: 'Data Preprocessing',
      lastMessage: 'How can I clean this dataset?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      messageCount: 5
    },
    {
      id: '4',
      title: 'Statistical Analysis',
      lastMessage: 'Run a correlation analysis on these variables',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      messageCount: 12
    },
    {
      id: '5',
      title: 'Visualization Request',
      lastMessage: 'Create a scatter plot for this data',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      messageCount: 6
    }
  ]);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const groupConversationsByDate = (conversations: Conversation[]) => {
    // Filter conversations by search query first
    const filteredConversations = conversations.filter(conv => 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const groups: { [key: string]: Conversation[] } = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 days': [],
      'Previous 30 days': [],
      'Older': []
    };
    
    filteredConversations.forEach(conv => {
      const convDate = new Date(conv.timestamp);
      const diffInDays = Math.floor((today.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) {
        groups['Today'].push(conv);
      } else if (diffInDays === 1) {
        groups['Yesterday'].push(conv);
      } else if (diffInDays <= 7) {
        groups['Previous 7 days'].push(conv);
      } else if (diffInDays <= 30) {
        groups['Previous 30 days'].push(conv);
      } else {
        groups['Older'].push(conv);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  };

  const conversationGroups = groupConversationsByDate(conversations);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowOptionsMenu(null);
    };

    if (showOptionsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showOptionsMenu]);

  const handleOptionsClick = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowOptionsMenu(showOptionsMenu === conversationId ? null : conversationId);
  };

  const handleRenameConversation = (conversationId: string) => {
    // TODO: Implement rename functionality
    console.log('Rename conversation:', conversationId);
    setShowOptionsMenu(null);
  };

  const handleDeleteConversation = (conversationId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete conversation:', conversationId);
    setShowOptionsMenu(null);
  };

  const handleArchiveConversation = (conversationId: string) => {
    // TODO: Implement archive functionality
    console.log('Archive conversation:', conversationId);
    setShowOptionsMenu(null);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'none'
          }}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          sidebar-container
          w-64 text-white 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto
          shadow-xl flex flex-col
          fixed left-0 top-0 z-50 lg:static
        `}
        style={{ 
          backgroundColor: '#111827', // Explicit color instead of bg-gray-900
          height: '100vh'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="font-semibold text-lg">Conversations</h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-700 rounded lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Conversation Button */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Conversation</span>
          </button>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:border-gray-500 focus:outline-none pl-9"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(conversationGroups).map(([groupName, groupConversations]) => (
            <div key={groupName} className="p-4">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {groupName}
              </h3>
              <div className="space-y-1">
                {groupConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`
                      w-full text-left p-3 rounded-lg transition-colors group cursor-pointer
                      ${currentConversationId === conversation.id 
                        ? 'bg-gray-700 text-white' 
                        : 'hover:bg-gray-800 text-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      {/* Main content area - clickable for conversation selection */}
                      <div 
                        className="flex-1 min-w-0"
                        onClick={() => onSelectConversation?.(conversation.id)}
                      >
                        <h4 className={`
                          text-sm font-medium truncate
                          ${currentConversationId === conversation.id ? 'text-white' : 'text-gray-200'}
                        `}>
                          {conversation.title}
                        </h4>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(conversation.timestamp)}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {conversation.messageCount} messages
                          </span>
                        </div>
                      </div>
                      
                      {/* More options button - appears on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 relative">
                        <button
                          onClick={(e) => handleOptionsClick(conversation.id, e)}
                          className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-gray-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {/* Options dropdown menu */}
                        {showOptionsMenu === conversation.id && (
                          <div className="absolute right-0 top-8 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                            <div className="py-1">
                              <button
                                onClick={() => handleRenameConversation(conversation.id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Rename
                              </button>
                              <button
                                onClick={() => handleArchiveConversation(conversation.id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                                </svg>
                                Archive
                              </button>
                              <button
                                onClick={() => handleDeleteConversation(conversation.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Empty state */}
          {conversations.length === 0 && (
            <div className="p-4 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No conversations yet</p>
              <p className="text-xs text-gray-500 mt-1">Start by creating a new conversation</p>
            </div>
          )}
          
          {/* No search results state */}
          {searchQuery && Object.keys(conversationGroups).length === 0 && conversations.length > 0 && (
            <div className="p-4 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No conversations found</p>
              <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Conversations are stored locally</span>
          </div>
        </div>
      </div>
    </>
  );
}
