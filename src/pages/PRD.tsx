import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import MDEditor from '@uiw/react-md-editor';
import { githubService } from '../lib/services/github-service';
import { queryClient } from '../lib/queryClient';

export default function PRD() {
  const [, setLocation] = useLocation();
  const [content, setContent] = useState<string>('');
  const [fileSha, setFileSha] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  const clientId = localStorage.getItem('flowency-client-id');
  const clientName = localStorage.getItem('flowency-client-name');
  const token = localStorage.getItem('flowency-token');

  // Redirect if no auth
  useEffect(() => {
    if (!clientId || !token) {
      setLocation('/');
    }
  }, [clientId, token, setLocation]);

  // Fetch document
  const { isLoading, error } = useQuery({
    queryKey: ['prd', clientId],
    queryFn: async () => {
      const file = await githubService.getFile(clientId!);
      setContent(file.content);
      setFileSha(file.sha);
      return file;
    },
    enabled: !!clientId,
    retry: false
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      await githubService.updateFile(
        clientId!,
        content,
        fileSha,
        'prd.md',
        `Update PRD by ${clientName}`
      );
    },
    onSuccess: () => {
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['prd', clientId] });
      alert('Document saved successfully!');
    },
    onError: (error: Error) => {
      alert(`Failed to save: ${error.message}`);
    }
  });

  const handleContentChange = (value?: string) => {
    setContent(value || '');
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!hasChanges) return;
    saveMutation.mutate();
  };

  const handleLogout = () => {
    localStorage.removeItem('flowency-token');
    localStorage.removeItem('flowency-client-id');
    localStorage.removeItem('flowency-client-name');
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-flowency-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Document</h1>
          <p className="text-gray-600 mb-4">
            {(error as Error).message}
          </p>
          <button
            onClick={handleLogout}
            className="bg-flowency-accent text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {clientName} - Product Requirements Document
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {hasChanges && <span className="text-amber-600">● Unsaved changes</span>}
              {!hasChanges && <span className="text-green-600">✓ All changes saved</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!hasChanges || saveMutation.isPending}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                hasChanges
                  ? 'bg-flowency-accent text-white hover:opacity-90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <MDEditor
            value={content}
            onChange={handleContentChange}
            height={700}
            preview="live"
            hideToolbar={false}
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Use markdown syntax to format your document. Changes are saved when you click "Save Changes".
          </p>
          <p className="mt-2">
            Need help? Contact your Flowency representative.
          </p>
        </div>
      </div>
    </div>
  );
}
