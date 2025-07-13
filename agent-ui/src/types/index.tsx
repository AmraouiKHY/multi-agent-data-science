// Core interfaces for the supervisor-based chat system

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  plotBase64?: string;  // First plot for backward compatibility
  plotBase64List?: PlotData[];  // Array of all plots with metadata
  plotContentType?: string;
  dataBase64?: string;
  dataContentType?: string;
  hasPlot?: boolean;
  hasMultiplePlots?: boolean;  // Flag for multiple plots
  hasData?: boolean;
  fileId?: string;
  fileUpdated?: boolean;
  fileName?: string;
  fileContent?: string;
  fileContentBase64?: string;
  fileType?: string;
  versionInfo?: {
    current_version: number;
    previous_version?: number;
    changes_detected: boolean;
    change_summary?: string;
  };
}

export interface FileVersionInfo {
  file_id: string;
  current_version: number;
  previous_version?: number;
  changes_detected: boolean;
  change_summary?: string;
  file_updated: boolean;
}

export interface AnalyzeDataRequest {
  query: string;
  file?: File;
  fileName?: string;
  file_id?: string;
}

export interface SupervisorType {
  id: string;
  name: string;
  description: string;
  endpoint: string;
}

export interface FileUploadResponse {
  file_path: string;
  file_name: string;
  size: number;
}

export interface PlotData {
  path: string;
  base64: string;
  content_type: string;
  filename: string;
}

export interface SupervisorResponse {
  message: string;
  supervisor_type?: string;
  status?: string;
  error?: string;
  plot_path?: string;
  plot_paths?: string[];  // Array of plot paths
  data_path?: string;
  has_plot?: boolean;
  has_multiple_plots?: boolean;  // Flag for multiple plots
  has_data?: boolean;
  plot_base64?: string;  // First plot for backward compatibility  
  plot_base64_list?: PlotData[];  // Array of all plots with metadata
  data_base64?: string;
  plot_content_type?: string;
  data_content_type?: string;
  file_id?: string;
  file_updated?: boolean;
  file_content?: string;
  file_content_base64?: string;
  file_name?: string;
  file_type?: string;
  version_info?: {
    current_version: number;
    previous_version?: number;
    changes_detected: boolean;
    change_summary?: string;
  };
}

export interface ProviderRequest {
  provider: string;
  ollama_model?: string;
}

export interface ProviderResponse {
  success: boolean;
  message: string;
  current_provider: string;
  ollama_model?: string;
}

export interface FileVersion {
  version_number: number;
  timestamp: string;
  file_size: number;
  changes_summary?: string;
  user_id: string;
}

export interface DataPreviewRow {
  [key: string]: string | number | boolean | null;
}

export interface FileSchema {
  fields?: Array<{
    name: string;
    type: string;
    nullable?: boolean;
  }>;
  primary_key?: string[];
  foreign_keys?: Array<{
    column: string;
    references: {
      table: string;
      column: string;
    };
  }>;
}

export interface SummaryStats {
  numeric?: {
    [columnName: string]: {
      mean?: number;
      median?: number;
      std?: number;
      min?: number;
      max?: number;
      count?: number;
    };
  };
  categorical?: {
    [columnName: string]: {
      unique_count?: number;
      most_frequent?: string;
      frequency?: number;
    };
  };
}

export interface FileMetadata {
  file_id: string;
  file_name: string;
  display_name?: string;
  file_type?: string;
  size?: number;
  upload_timestamp: string;
  current_version?: number;
  user_id: string;
  original_filename?: string;
  last_modified?: string;
  description?: string;
  tags?: string[];
  version_history?: FileVersion[];
  columns?: string[];
  row_count?: number;
  data_preview?: DataPreviewRow[];
  schema?: FileSchema;
  metadata?: {
    encoding?: string;
    delimiter?: string;
    has_header?: boolean;
    data_types?: { [key: string]: string };
  };
  status?: 'active' | 'archived' | 'processing' | 'error';
  analysis_results?: {
    data_quality_score?: number;
    missing_values_count?: number;
    duplicates_count?: number;
    summary_stats?: SummaryStats;
  };
}

export interface ListFilesResponse {
  user_id: string;
  files: FileMetadata[];
}