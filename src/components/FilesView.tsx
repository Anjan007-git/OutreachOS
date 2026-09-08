import React, { useState, useRef } from 'react';
import {
  Upload,
  Trash2,
  FileText,
  File,
  CheckCircle2,
  HardDrive,
  Star,
  Download,
  Search,
  ExternalLink,
  Plus,
  Send,
  AlertCircle,
  RefreshCw,
  X,
  Filter,
} from 'lucide-react';
import { StoredFile, FileCategory } from '../types';
import { GoogleDrivePickerModal } from './GoogleDrivePickerModal';
import { api } from '../lib/api';

interface FilesViewProps {
  files: StoredFile[];
  onUploadFile: (file: {
    name: string;
    size: number;
    mimeType: string;
    category: FileCategory;
    bufferBase64?: string;
    isDefaultResume?: boolean;
  }) => Promise<any>;
  onDeleteFile: (id: string) => Promise<void>;
  onLoadDriveFiles: () => Promise<any[]>;
  onSetDefaultResume?: (id: string) => Promise<void>;
  onSelectForCompose?: (file: StoredFile) => void;
}

const categoryLabels: Record<FileCategory, string> = {
  'Resume/CV': 'Resume / CV',
  'Cover Letter': 'Cover Letter',
  SOP: 'Statement of Purpose (SOP)',
  Transcript: 'Academic Transcript',
  Certificates: 'Certification / Credential',
  Portfolio: 'Work Portfolio',
  Other: 'General Document',
};

export const FilesView: React.FC<FilesViewProps> = ({
  files,
  onUploadFile,
  onDeleteFile,
  onLoadDriveFiles,
  onSetDefaultResume,
  onSelectForCompose,
}) => {
  const [activeTab, setActiveTab] = useState<'LOCAL' | 'DRIVE'>('LOCAL');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('Resume/CV');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isTogglingDefaultId, setIsTogglingDefaultId] = useState<string | null>(null);

  // Drive tab state
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (uploaded: File) => {
    setUploadError(null);
    setUploadSuccess(null);

    const name = uploaded.name.trim();
    const lowerName = name.toLowerCase();
    const isAllowed =
      lowerName.endsWith('.pdf') || lowerName.endsWith('.doc') || lowerName.endsWith('.docx');

    if (!isAllowed) {
      setUploadError(
        `Invalid file type "${uploaded.name}". Only PDF (.pdf), DOC (.doc), and DOCX (.docx) documents are supported.`
      );
      return;
    }

    const MAX_SIZE = 25 * 1024 * 1024;
    if (uploaded.size > MAX_SIZE) {
      setUploadError(
        `File size (${(uploaded.size / (1024 * 1024)).toFixed(1)} MB) exceeds Gmail maximum attachment size of 25 MB.`
      );
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onerror = () => {
        setUploadError('Failed to read file from your device.');
        setIsUploading(false);
      };
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1] || '';
          const mime =
            uploaded.type ||
            (lowerName.endsWith('.pdf') ? 'application/pdf' : 'application/msword');

          await onUploadFile({
            name: uploaded.name,
            size: uploaded.size,
            mimeType: mime,
            category: selectedCategory,
            bufferBase64: base64,
          });

          setUploadSuccess(`"${uploaded.name}" successfully added to your repository.`);
          setTimeout(() => setUploadSuccess(null), 5000);
        } catch (err: any) {
          console.error('Upload failed:', err);
          setUploadError(err.message || 'File upload failed');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(uploaded);
    } catch (err: any) {
      setUploadError(err.message || 'Upload could not be started');
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      processUpload(uploaded);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFetchDrive = async (query = '') => {
    setIsDriveLoading(true);
    try {
      const res = await api.getDriveFiles(query);
      setDriveFiles(res || []);
    } catch (err: any) {
      alert('Failed to list Google Drive files: ' + err.message);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleDriveImport = async (driveFile: {
    id: string;
    name: string;
    mimeType: string;
    size?: number;
  }) => {
    setUploadError(null);
    setUploadSuccess(null);
    try {
      await api.importDriveFile({
        driveFileId: driveFile.id,
        name: driveFile.name,
        mimeType: driveFile.mimeType,
        size: driveFile.size,
        category: selectedCategory,
      });
      setUploadSuccess(`"${driveFile.name}" imported into repository from Google Drive.`);
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to import Google Drive document');
    }
  };

  const handleToggleDefaultResume = async (file: StoredFile) => {
    if (!onSetDefaultResume) return;
    setIsTogglingDefaultId(file.id);
    try {
      await onSetDefaultResume(file.id);
    } catch (err: any) {
      alert('Failed to update primary resume: ' + err.message);
    } finally {
      setIsTogglingDefaultId(null);
    }
  };

  // Filtered files
  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      !searchQuery.trim() ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || f.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return 'Cloud File';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getDocTypeBadge = (name: string, mime: string) => {
    const lower = name.toLowerCase();
    if (lower.endsWith('.pdf') || mime.includes('pdf')) {
      return { label: 'PDF', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (lower.endsWith('.docx') || mime.includes('wordprocessingml')) {
      return { label: 'DOCX', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
    if (lower.endsWith('.doc') || mime.includes('msword')) {
      return { label: 'DOC', badgeClass: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
    return { label: 'DOC', badgeClass: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
      />

      {/* Top Banner & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Document Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified Resumes, CVs, Cover Letters, SOPs, and Portfolios attached to outreach emails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as FileCategory)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>
                Category: {label}
              </option>
            ))}
          </select>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsDriveModalOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
            <span>Choose from Google Drive</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="flex-1 font-medium">{uploadSuccess}</span>
          <button onClick={() => setUploadSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="flex-1 font-medium">{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('LOCAL')}
            className={`pb-2.5 text-xs font-bold border-b-2 px-3.5 transition-colors cursor-pointer ${
              activeTab === 'LOCAL'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Repository ({files.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('DRIVE');
              if (driveFiles.length === 0) handleFetchDrive();
            }}
            className={`pb-2.5 text-xs font-bold border-b-2 px-3.5 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'DRIVE'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Drive Explorer</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          Supported: PDF, DOC, DOCX &bull; Max 25 MB per file
        </div>
      </div>

      {/* Active Repository Tab */}
      {activeTab === 'LOCAL' && (
        <div className="space-y-4">
          {/* Search & Category Filter Bar */}
          {files.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repository documents..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterCategory('ALL')}
                  className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    filterCategory === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All ({files.length})
                </button>
                {Object.entries(categoryLabels).map(([catKey, catLabel]) => {
                  const count = files.filter((f) => f.category === catKey).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={catKey}
                      onClick={() => setFilterCategory(catKey)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        filterCategory === catKey
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {catLabel} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drag & Drop Dropzone if empty or when dragged over */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              const dropped = e.dataTransfer.files?.[0];
              if (dropped) processUpload(dropped);
            }}
          >
            {files.length === 0 ? (
              /* Empty State requested by user */
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center shadow-xs space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-base font-bold text-slate-900">No documents yet</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Upload your resume, CV, portfolio or other outreach documents.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Document</span>
                  </button>
                  <button
                    onClick={() => setIsDriveModalOpen(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Choose from Google Drive</span>
                  </button>
                </div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-700">No documents matched your filter</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('ALL');
                  }}
                  className="mt-2 text-xs text-indigo-600 hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              /* Document Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => {
                  const typeBadge = getDocTypeBadge(file.name, file.mimeType);
                  const isPrimary = Boolean(file.isDefaultResume);

                  return (
                    <div
                      key={file.id}
                      className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between ${
                        isPrimary ? 'border-amber-300 bg-amber-50/10' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Header Badge Row */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-start space-x-3 min-w-0">
                            <div className="p-2.5 rounded-xl bg-indigo-50/80 text-indigo-600 border border-indigo-100 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4
                                className="font-bold text-slate-900 text-xs leading-snug truncate"
                                title={file.name}
                              >
                                {file.name}
                              </h4>
                              <div className="flex items-center space-x-1.5 mt-1">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${typeBadge.badgeClass}`}
                                >
                                  {typeBadge.label}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatFileSize(file.size)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {/* Download Button */}
                            <a
                              href={`/api/files/${file.id}/download`}
                              download={file.name}
                              title="Download document"
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete document "${file.name}"?`)) {
                                  onDeleteFile(file.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                              title="Delete file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Category & Status Pill */}
                        <div className="flex items-center justify-between text-[11px] mb-3">
                          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                            {categoryLabels[file.category] || file.category}
                          </span>
                          {isPrimary ? (
                            <span className="flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px] font-bold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>Primary Resume</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {/* Toggle Primary Resume */}
                        {onSetDefaultResume && (
                          <button
                            type="button"
                            onClick={() => handleToggleDefaultResume(file)}
                            disabled={isTogglingDefaultId === file.id}
                            className={`text-[11px] font-semibold flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                              isPrimary
                                ? 'text-amber-800 bg-amber-50 hover:bg-amber-100'
                                : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50/70'
                            }`}
                          >
                            <Star
                              className={`w-3 h-3 ${
                                isPrimary ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                              }`}
                            />
                            <span>{isPrimary ? 'Primary' : 'Set as Primary'}</span>
                          </button>
                        )}

                        {/* Attach to Email (Compose) */}
                        {onSelectForCompose && (
                          <button
                            type="button"
                            onClick={() => onSelectForCompose(file)}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-200 hover:border-transparent px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Attach to Email</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Google Drive Tab */}
      {activeTab === 'DRIVE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Google Drive Document Explorer</h3>
              <p className="text-xs text-slate-500">
                Browse documents accessible via your connected Google Workspace integration
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={driveSearch}
                onChange={(e) => setDriveSearch(e.target.value)}
                placeholder="Search Drive..."
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
              />
              <button
                onClick={() => handleFetchDrive(driveSearch)}
                disabled={isDriveLoading}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${isDriveLoading ? 'animate-spin text-indigo-600' : ''}`} />
                <span>{isDriveLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {driveFiles.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {isDriveLoading ? 'Fetching files from Google Drive...' : 'No Drive files retrieved.'}
              </div>
            ) : (
              driveFiles.map((df: any) => {
                const typeBadge = getDocTypeBadge(df.name, df.mimeType);
                return (
                  <div key={df.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3 min-w-0 pr-3">
                      <File className="w-4 h-4 text-slate-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate">{df.name}</div>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${typeBadge.badgeClass}`}>
                            {typeBadge.label}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatFileSize(df.size)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDriveImport(df)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0"
                    >
                      + Import to Repository
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Google Drive Document Picker Modal */}
      <GoogleDrivePickerModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onSelectFile={async (df) => {
          await handleDriveImport(df);
        }}
        title="Select Document from Google Drive"
        actionButtonLabel="Import to Repository"
      />
    </div>
  );
};
