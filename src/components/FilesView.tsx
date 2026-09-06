import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  Upload,
  Trash2,
  FileText,
  File,
  CheckCircle2,
  ExternalLink,
  Plus,
  X,
  HardDrive,
} from 'lucide-react';
import { StoredFile, FileCategory } from '../types';

interface FilesViewProps {
  files: StoredFile[];
  onUploadFile: (file: {
    name: string;
    size: number;
    mimeType: string;
    category: FileCategory;
    dataBase64?: string;
  }) => Promise<void>;
  onDeleteFile: (id: string) => Promise<void>;
  onLoadDriveFiles: () => Promise<any[]>;
}

const categoryLabels: Record<FileCategory, string> = {
  'Resume/CV': 'Resume / CV',
  'Cover Letter': 'Cover Letter',
  SOP: 'Statement of Purpose (SOP)',
  Transcript: 'Academic Transcript',
  Certificates: 'Certification / Credential',
  Portfolio: 'Work Portfolio',
  Other: 'General Attachment',
};

export const FilesView: React.FC<FilesViewProps> = ({
  files,
  onUploadFile,
  onDeleteFile,
  onLoadDriveFiles,
}) => {
  const [activeTab, setActiveTab] = useState<'LOCAL' | 'DRIVE'>('LOCAL');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('Resume/CV');
  const [isUploading, setIsUploading] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1] || '';
        await onUploadFile({
          name: uploaded.name,
          size: uploaded.size,
          mimeType: uploaded.type || 'application/pdf',
          category: selectedCategory,
          dataBase64: base64,
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(uploaded);
    } catch (err: any) {
      alert('File upload failed: ' + err.message);
      setIsUploading(false);
    }
  };

  const handleFetchDrive = async () => {
    setIsDriveLoading(true);
    try {
      const res = await onLoadDriveFiles();
      setDriveFiles(res || []);
    } catch (err: any) {
      alert('Failed to list Google Drive files: ' + err.message);
    } finally {
      setIsDriveLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Document Repository</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Securely manage Resume/CV, SOPs, Cover Letters, transcripts, and certificates for email attachments.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg"
            onChange={handleFileChange}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as FileCategory)}
            className="text-xs py-2 px-3.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>
                Upload as: {label}
              </option>
            ))}
          </select>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Uploading...' : 'Upload Document'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
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
          <span>Google Drive Cloud</span>
        </button>
      </div>

      {/* Local Files Tab */}
      {activeTab === 'LOCAL' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No documents uploaded yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Upload your Resume / CV, Cover Letter, Statement of Purpose (SOP), or Transcripts to attach to cold emails.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload First Document</span>
              </button>
            </div>
          ) : (
            files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">
                      {file.name}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5 uppercase tracking-wider">
                      {categoryLabels[file.category] || file.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB &bull; PDF Document
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete document "${file.name}"?`)) {
                      onDeleteFile(file.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready for Attachment</span>
                </span>
                <span className="font-mono text-[10px]">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      )}

      {/* Google Drive Tab */}
      {activeTab === 'DRIVE' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Google Drive Document Explorer</h3>
              <p className="text-xs text-slate-500">
                Files accessible via your authorized Google Workspace integration
              </p>
            </div>
            <button
              onClick={handleFetchDrive}
              disabled={isDriveLoading}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              {isDriveLoading ? 'Loading Drive...' : 'Refresh Drive'}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {driveFiles.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                {isDriveLoading ? 'Fetching files from Google Drive...' : 'No Drive files retrieved.'}
              </div>
            ) : (
              driveFiles.map((df: any) => (
                <div key={df.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <File className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-900">{df.name}</div>
                      <div className="text-[10px] text-slate-400">{df.mimeType}</div>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await onUploadFile({
                        name: df.name,
                        size: Number(df.size) || 150000,
                        mimeType: df.mimeType,
                        category: selectedCategory,
                      });
                      alert(`Linked "${df.name}" to your local OutreachOS repository.`);
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    + Import to Repository
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
