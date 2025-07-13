import { NextRequest, NextResponse } from 'next/server';

const FILES_API_BASE_URL = process.env.NEXT_PUBLIC_FILES_API_URL || 'http://localhost:20001/api';

/**
 * GET /api/files - List all files for a user
 * Query parameters:
 * - user_id: The ID of the user whose files to list (required)
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }
    
    const url = `${FILES_API_BASE_URL}/files?user_id=${encodeURIComponent(userId)}`;
    console.log('Proxying GET request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Files API error:', response.status, response.statusText);
      let errorMessage = `Failed to fetch files: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If response is not JSON, use the default error message
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Files API response received');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/files - Delete a specific file
 * Query parameters:
 * - user_id: The ID of the user who owns the file (required)
 * - file_id: The ID of the file to delete (required)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const fileId = searchParams.get('file_id');
    
    if (!userId || !fileId) {
      return NextResponse.json(
        { error: 'user_id and file_id parameters are required' },
        { status: 400 }
      );
    }
    
    const deleteUrl = `${FILES_API_BASE_URL}/files/${encodeURIComponent(userId)}/${encodeURIComponent(fileId)}`;
    console.log('Proxying DELETE request to:', deleteUrl);
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Delete API error:', response.status, response.statusText);
      let errorMessage = `Failed to delete file: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If response is not JSON, use the default error message
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Delete API response:', data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Delete proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
