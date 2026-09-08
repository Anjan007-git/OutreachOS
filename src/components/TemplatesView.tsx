import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Send,
  Sparkles,
  Copy,
  Check,
  X,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { Template } from '../types';

interface TemplatesViewProps {
  templates: Template[];
  onCreateTemplate: (template: Partial<Template>) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
  onUseTemplate: (template: Template) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  onCreateTemplate,
  onDeleteTemplate,
  onUseTemplate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Template['category']>('JOB_OUTREACH');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const variableTokens = [
    '{{first_name}}',
    '{{last_name}}',
    '{{organization}}',
    '{{role}}',
    '{{country}}',
    '{{city}}',
    '{{department}}',
    '{{my_name}}',
    '{{my_email}}',
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !body.trim()) return;

    await onCreateTemplate({
      name: name.trim(),
      category,
      subject: subject.trim(),
      body: body.trim(),
      variables: variableTokens.filter((v) => body.includes(v) || subject.includes(v)),
    });

    setIsModalOpen(false);
    setName('');
    setSubject('');
    setBody('');
  };

  const filtered = templates.filter(
    (t) => selectedCategory === 'ALL' || t.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Email Template Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-crafted outreach formulas with dynamic contact variable merge tags.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Categories ({templates.length})</option>
            <option value="JOB_OUTREACH">Job Outreach</option>
            <option value="UNIVERSITY_ADMISSIONS">University Admissions</option>
            <option value="FOLLOW_UP">Follow-up Sequences</option>
            <option value="CUSTOM">Custom</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No email templates found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Create reusable message templates with variable tokens like {'{{name}}'}, {'{{organization}}'}, and {'{{role}}'}.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Your First Template</span>
            </button>
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
            >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{t.title || t.name}</h3>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-block mt-1">
                    {String(t.category || 'GENERAL').replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(t.body);
                      setCopiedId(t.id);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    title="Copy Body"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    {copiedId === t.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete template "${t.name}"?`)) {
                        onDeleteTemplate(t.id);
                      }
                    }}
                    title="Delete Template"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-800 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100 mb-3">
                <span className="text-slate-400 font-normal">Subject: </span>
                {t.subject}
              </div>

              <div className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-6 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 whitespace-pre-wrap mb-4">
                {t.body}
              </div>

              {t.variables && t.variables.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.variables.map((v, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onUseTemplate(t)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Use in Email Composer</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Outreach Template</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Senior Backend Role Outreach"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Template['category'])}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white font-medium cursor-pointer"
                  >
                    <option value="JOB_OUTREACH">Job Outreach</option>
                    <option value="UNIVERSITY_ADMISSIONS">University Admissions</option>
                    <option value="FOLLOW_UP">Follow-up Cadence</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>

              {/* Variable Token Clickers */}
              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Insert Dynamic Variables (Click to insert):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {variableTokens.map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => setBody(body + ' ' + tok)}
                      className="px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 font-semibold transition-colors cursor-pointer"
                    >
                      + {tok}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Line *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiry regarding {{role}} at {{organization}}"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Body *</label>
                <textarea
                  rows={8}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your email body..."
                  className="w-full p-3 font-sans leading-relaxed rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/70"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
