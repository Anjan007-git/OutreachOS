import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  Search,
  X,
  FileText,
  File,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Download,
} from 'lucide-react';
import { api } from '../lib/api';

interface GoogleDrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: { id: string; name: string; mimeType: string; size?: number }) => Promise<void>;
  title?: string;
  actionButtonLabel?: string;
}

export const GoogleDrivePickerModal: React.FC<GoogleDrivePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectFile,
  title = 'Select Document from Google Drive',
  actionButtonLabel = 'Attach Document',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectingId, setIsSelectingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const fetchFiles = async (query = '') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const files = await api.getDriveFiles(query);
      setDriveFiles(files || []);
    } catch (err: any) {
      console.error('Failed to list Google Drive files:', err);
      setErrorMessage(
        err.message || 'Unable to connect to Google Drive. Please ensure your Google account is connected.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedFileId(null);
      fetchFiles(searchQuery);
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(searchQuery);
  };

  const handleConfirmSelect = async (file: any) => {
    setIsSelectingId(file.id);
    try {
      await onSelectFile({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: Number(file.size) || 150000,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to attach Drive file.');
    } finally {
      setIsSelectingId(null);
    }
  };

  if (!isOpen) return null;

  const selectedFile = driveFiles.find((f) => f.id === selectedFileId);

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return 'Cloud Doc';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeBadge = (mime: string, name: string) => {
    const lowerName = name.toLowerCase();
    if (mime.includes('pdf') || lowerName.endsWith('.pdf')) {
      return { label: 'PDF', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (mime.includes('word') || lowerName.endsWith('.doc') || lowerName.endsWith('.docx')) {
      return { label: 'DOCX', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    if (mime.includes('google-apps.document')) {
      return { label: 'Google Doc', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    }
    return { label: 'Document', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">
                Browse PDF, Word, and Google Docs from your connected Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google Drive documents (e.g., Resume, CV, Portfolio)..."
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium text-slate-800"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => fetchFiles(searchQuery)}
              disabled={isLoading}
              title="Refresh files"
              className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-100">
          {isLoading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
              <span className="text-xs text-slate-500 font-medium">Accessing your Google Drive...</span>
            </div>
          ) : driveFiles.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <File className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">No matching documents found in Google Drive</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Make sure your PDF or DOC files are in your Drive root or shared folders.
              </p>
            </div>
          ) : (
            driveFiles.map((file) => {
              const isSelected = selectedFileId === file.id;
              const badge = getFileTypeBadge(file.mimeType, file.name);
              const isProcessing = isSelectingId === file.id;

              return (
                <div
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`pt-2.5 pb-2.5 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border border-indigo-200 shadow-2xs'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatFileSize(file.size)}
                        </span>
                        {file.modifiedTime && (
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            &bull; {new Date(file.modifiedTime).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmSelect(file);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs'
                          : 'bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      {isProcessing ? 'Importing...' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {selectedFile ? (
              <span className="font-semibold text-slate-700 truncate block max-w-xs sm:max-w-md">
                Selected: {selectedFile.name}
              </span>
            ) : (
              <span>Supported: PDF, DOC, DOCX &bull; Max 25 MB</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedFile || Boolean(isSelectingId)}
              onClick={() => selectedFile && handleConfirmSelect(selectedFile)}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-2xs cursor-pointer flex items-center space-x-1.5"
            >
              {isSelectingId ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Attaching...</span>
                </>
              ) : (
                <span>{actionButtonLabel}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
