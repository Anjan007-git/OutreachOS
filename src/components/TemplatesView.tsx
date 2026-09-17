import React, { useState, useMemo } from 'react';
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
  Code2,
  GraduationCap,
  Layers,
  Search,
  Eye,
} from 'lucide-react';
import { Template, Contact, UserSettings } from '../types';
import { TemplateLibraryModal } from './TemplateLibraryModal';

interface TemplatesViewProps {
  templates: Template[];
  contacts?: Contact[];
  settings?: UserSettings | null;
  onCreateTemplate: (template: Partial<Template>) => Promise<void>;
  onDeleteTemplate: (id: string) => Promise<void>;
  onUseTemplate: (template: Template) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  contacts = [],
  settings = null,
  onCreateTemplate,
  onDeleteTemplate,
  onUseTemplate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form for custom template creation
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('ENGINEERING');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const variableTokens = [
    '{{first_name}}',
    '{{last_name}}',
    '{{company}}',
    '{{role}}',
    '{{country}}',
    '{{city}}',
    '{{department}}',
    '{{my_name}}',
    '{{my_title}}',
    '{{my_email}}',
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !body.trim()) return;

    await onCreateTemplate({
      name: name.trim(),
      category: category as any,
      subject: subject.trim(),
      body: body.trim(),
      variables: variableTokens.filter((v) => body.includes(v) || subject.includes(v)),
    });

    setIsModalOpen(false);
    setName('');
    setSubject('');
    setBody('');
  };

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        (selectedCategory === 'HR' && t.category.toLowerCase().includes('hr')) ||
        (selectedCategory === 'ENGINEERING' && t.category.toLowerCase().includes('eng')) ||
        (selectedCategory === 'UNIVERSITY' && (t.category.toLowerCase().includes('univ') || t.category.toLowerCase().includes('admissions'))) ||
        t.category.toUpperCase() === selectedCategory.toUpperCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        (t.title && t.title.toLowerCase().includes(query)) ||
        t.subject.toLowerCase().includes(query) ||
        t.body.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('hr') || c.includes('recruit')) return <Briefcase className="w-3.5 h-3.5 text-blue-500" />;
    if (c.includes('eng')) return <Code2 className="w-3.5 h-3.5 text-indigo-500" />;
    if (c.includes('univ') || c.includes('admissions')) return <GraduationCap className="w-3.5 h-3.5 text-amber-500" />;
    return <Layers className="w-3.5 h-3.5 text-slate-500" />;
  };

  const getCategoryBadgeClass = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('hr') || c.includes('recruit')) return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900';
    if (c.includes('eng')) return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900';
    if (c.includes('univ') || c.includes('admissions')) return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900';
    return 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700';
  };

  return (
    <div className="space-y-6" id="templates-library-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Email Template Library</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
              {templates.length} Templates
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            10 professional blueprints covering HR & Recruitment, Systems Engineering, and International University admissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLibraryModalOpen(true)}
            id="open-library-modal-btn"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>Interactive Library Modal</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            id="new-template-btn"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-black p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Templates', count: templates.length },
            { id: 'HR', label: 'HR & Talent', count: templates.filter((t) => t.category.toLowerCase().includes('hr')).length },
            { id: 'ENGINEERING', label: 'Engineering', count: templates.filter((t) => t.category.toLowerCase().includes('eng')).length },
            { id: 'UNIVERSITY', label: 'International University', count: templates.filter((t) => t.category.toLowerCase().includes('univ') || t.category.toLowerCase().includes('admissions')).length },
          ].map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-850'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates or variables..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-16 text-center shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100">No email templates found</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-850 p-6 shadow-sm hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{t.title || t.name}</h3>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider mt-1.5 border ${getCategoryBadgeClass(t.category)}`}>
                      {getCategoryIcon(t.category)}
                      <span>{String(t.category || 'GENERAL').replace(/_/g, ' ')}</span>
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
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                    >
                      {copiedId === t.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {!t.isDefault && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete template "${t.name}"?`)) {
                            onDeleteTemplate(t.id);
                          }
                        }}
                        title="Delete Template"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-900/60 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 mb-3">
                  <span className="text-slate-400 dark:text-zinc-500 font-normal">Subject: </span>
                  {t.subject}
                </div>

                <div className="text-xs text-slate-600 dark:text-zinc-300 font-sans leading-relaxed line-clamp-5 bg-slate-50/60 dark:bg-zinc-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 whitespace-pre-wrap mb-4">
                  {t.body}
                </div>

                {/* Variable Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(t.variables || ['first_name', 'company', 'role']).map((v, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 font-semibold"
                    >
                      {v.startsWith('{{') ? v : `{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                  {t.isDefault ? 'Default Blueprint' : 'Custom'}
                </span>
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

      {/* Interactive Template Library Modal */}
      <TemplateLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        templates={templates}
        contacts={contacts}
        settings={settings}
        onApplyTemplate={(tpl) => {
          onUseTemplate(tpl);
        }}
      />

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-black rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-zinc-850">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Outreach Template</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Senior Backend Role Outreach"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-900 font-medium text-slate-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="HR">HR & Recruitment</option>
                    <option value="ENGINEERING">Engineering</option>
                    <option value="UNIVERSITY">International University</option>
                    <option value="FOLLOW_UP">Follow-up Cadence</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">Subject Line *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Infrastructure Engineer Candidate — {{first_name}} at {{company}}"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50/50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-zinc-300">Message Body *</label>
                  <span className="text-[11px] text-slate-400">Click a variable tag to append</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {variableTokens.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setBody((prev) => prev + (prev.endsWith(' ') ? '' : ' ') + v)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-zinc-300 text-[10px] font-mono border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Hi {{first_name}}, I noticed the open engineering roles at {{company}}..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-indigo-500 font-mono text-xs bg-slate-50/50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
