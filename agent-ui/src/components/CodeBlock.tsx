"use client";

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  executionResult?: string;
}

export default function CodeBlock({ 
  code, 
  language = 'python', 
  executionResult 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  return (
    <div className="rounded-md overflow-hidden mb-4 group relative">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-200">
        <div className="text-sm">{language}</div>
        <button
          onClick={copyToClipboard}
          className="text-xs bg-gray-700 hover:bg-gray-600 rounded px-2 py-1 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="text-sm"
        customStyle={{ margin: 0, padding: '1rem' }}
      >
        {code}
      </SyntaxHighlighter>
      
      {executionResult && (
        <div className="bg-gray-100 border-t border-gray-300 p-4">
          <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">
            Execution Result
          </div>
          <div className="text-sm whitespace-pre-wrap font-mono">
            {executionResult}
          </div>
        </div>
      )}
    </div>
  );
}