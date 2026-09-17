import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  Briefcase,
  Code2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  User,
  Building2,
  Copy,
  Eye,
  Layers,
} from 'lucide-react';
import { Template, Contact, UserSettings } from '../types';
import { interpolateVariables, COMMON_VARIABLES } from '../lib/variables';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  activeContact?: Contact | null;
  contacts?: Contact[];
  onSelectContact?: (contact: Contact) => void;
  onApplyTemplate: (template: Template, interpolatedSubject: string, interpolatedBody: string) => void;
  settings?: UserSettings | null;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  templates,
  activeContact = null,
  contacts = [],
  onSelectContact,
  onApplyTemplate,
  settings = null,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [previewMode, setPreviewMode] = useState<'interpolated' | 'raw'>('interpolated');
  const [copiedField, setCopiedField] = useState<'subject' | 'body' | null>(null);
  const [previewContact, setPreviewContact] = useState<Contact | null>(activeContact);

  // Keep preview contact synced if activeContact changes
  React.useEffect(() => {
    if (activeContact) {
      setPreviewContact(activeContact);
    } else if (contacts.length > 0 && !previewContact) {
      setPreviewContact(contacts[0]);
    }
  }, [activeContact, contacts]);

  // Set default selected template if empty
  React.useEffect(() => {
    if (!selectedTemplateId && templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [selectedTemplateId, templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        t.category.toUpperCase().replace(/\s+/g, '_') === selectedCategory.toUpperCase().replace(/\s+/g, '_') ||
        (selectedCategory === 'HR' && t.category.toLowerCase().includes('hr')) ||
        (selectedCategory === 'ENGINEERING' && t.category.toLowerCase().includes('eng')) ||
        (selectedCategory === 'UNIVERSITY' && (t.category.toLowerCase().includes('univ') || t.category.toLowerCase().includes('academic')));

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

  const activeTemplate = useMemo(() => {
    return (
      templates.find((t) => t.id === selectedTemplateId) ||
      filteredTemplates[0] ||
      templates[0] ||
      null
    );
  }, [templates, selectedTemplateId, filteredTemplates]);

  // Variable context with active or sample contact
  const variableContext = useMemo(() => {
    const fallbackContact: Partial<Contact> = {
      name: 'Alex Mercer',
      email: 'alex.mercer@innovatetech.com',
      organization: 'InnovateTech Systems',
      role: 'Staff Infrastructure Engineer',
      country: 'United States',
      city: 'San Francisco',
      department: 'Platform Engineering',
    };

    return {
      contact: previewContact || activeContact || fallbackContact,
      settings: settings || null,
    };
  }, [previewContact, activeContact, settings]);

  const interpolatedSubject = useMemo(() => {
    if (!activeTemplate) return '';
    return interpolateVariables(activeTemplate.subject, variableContext, false);
  }, [activeTemplate, variableContext]);

  const interpolatedBody = useMemo(() => {
    if (!activeTemplate) return '';
    return interpolateVariables(activeTemplate.body, variableContext, false);
  }, [activeTemplate, variableContext]);

  const handleApply = () => {
    if (!activeTemplate) return;
    onApplyTemplate(activeTemplate, interpolatedSubject, interpolatedBody);
    onClose();
  };

  const handleCopy = (text: string, field: 'subject' | 'body') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="template-library-modal"
        className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl w-full max-w-5xl h-[90vh] max-h-[820px] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Professional Outreach Template Library</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  {templates.length} Templates
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Curated outreach blueprints for HR & Recruitment, Systems Engineering, and International Universities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-black">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Categories', count: templates.length },
              { id: 'HR', label: 'HR & Recruitment', count: templates.filter((t) => t.category.toLowerCase().includes('hr')).length },
              { id: 'ENGINEERING', label: 'Engineering', count: templates.filter((t) => t.category.toLowerCase().includes('eng')).length },
              { id: 'UNIVERSITY', label: 'International University', count: templates.filter((t) => t.category.toLowerCase().includes('univ')).length },
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      active ? 'bg-indigo-500/80 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates or variables..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Modal Body: 2-Column Split View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Template List (5 Cols) */}
          <div className="md:col-span-5 border-r border-slate-200 dark:border-zinc-850 overflow-y-auto p-3 space-y-2 bg-slate-50/30 dark:bg-zinc-950/40">
            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
                No templates matched your criteria.
              </div>
            ) : (
              filteredTemplates.map((tpl) => {
                const isSelected = activeTemplate?.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative group ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-2xs'
                        : 'bg-white dark:bg-zinc-900/90 border-slate-200/80 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadgeClass(tpl.category)}`}>
                        {getCategoryIcon(tpl.category)}
                        <span>{tpl.category}</span>
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tpl.name || tpl.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-1 font-medium">
                      {tpl.subject}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {(tpl.variables || ['first_name', 'company', 'role']).slice(0, 3).map((v) => (
                        <span
                          key={v}
                          className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[9px] font-mono"
                        >
                          {`{{${v.replace(/[{}]/g, '')}}}`}
                        </span>
                      ))}
                      {(tpl.variables?.length || 0) > 3 && (
                        <span className="text-[9px] text-slate-400 self-center">
                          +{(tpl.variables?.length || 0) - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Template Preview & Personalization Controls (7 Cols) */}
          <div className="md:col-span-7 flex flex-col overflow-hidden bg-white dark:bg-black">
            {activeTemplate ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Preview Toolbar */}
                <div className="p-4 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between bg-slate-50/40 dark:bg-zinc-950">
                  {/* Recipient context selector */}
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Target Contact:</span>
                    {contacts.length > 0 ? (
                      <select
                        value={previewContact?.id || ''}
                        onChange={(e) => {
                          const matched = contacts.find((c) => c.id === e.target.value) || null;
                          setPreviewContact(matched);
                          if (matched && onSelectContact) onSelectContact(matched);
                        }}
                        className="text-xs py-1 px-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        {contacts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {c.organization || 'Direct Contact'}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                        {previewContact?.name || 'Alex Mercer'} ({previewContact?.organization || 'InnovateTech Systems'})
                      </span>
                    )}
                  </div>

                  {/* Mode switcher: Interpolated vs Raw */}
                  <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-0.5 rounded-lg text-xs">
                    <button
                      onClick={() => setPreviewMode('interpolated')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        previewMode === 'interpolated'
                          ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400'
                      }`}
                    >
                      Mapped Preview
                    </button>
                    <button
                      onClick={() => setPreviewMode('raw')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                        previewMode === 'raw'
                          ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400'
                      }`}
                    >
                      Raw Tags
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Subject Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Subject Line</span>
                      <button
                        onClick={() => handleCopy(previewMode === 'interpolated' ? interpolatedSubject : activeTemplate.subject, 'subject')}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'subject' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'subject' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-zinc-900/80 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-900 dark:text-zinc-100 select-text">
                      {previewMode === 'interpolated' ? interpolatedSubject : activeTemplate.subject}
                    </div>
                  </div>

                  {/* Body Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Email Body</span>
                      <button
                        onClick={() => handleCopy(previewMode === 'interpolated' ? interpolatedBody : activeTemplate.body, 'body')}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'body' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'body' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-zinc-900/80 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed font-normal min-h-[220px] select-text">
                      {previewMode === 'interpolated' ? interpolatedBody : activeTemplate.body}
                    </div>
                  </div>

                  {/* Active Variable Mappings Table */}
                  <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                    <div className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Dynamic Personalization Variables</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">{'{{first_name}}'} &rarr;</span>{' '}
                        <strong className="text-slate-800 dark:text-zinc-200">
                          {variableContext.contact?.name?.split(' ')[0] || 'Alex'}
                        </strong>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">{'{{company}}'} &rarr;</span>{' '}
                        <strong className="text-slate-800 dark:text-zinc-200">
                          {variableContext.contact?.organization || 'InnovateTech Systems'}
                        </strong>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">{'{{role}}'} &rarr;</span>{' '}
                        <strong className="text-slate-800 dark:text-zinc-200">
                          {variableContext.contact?.role || variableContext.contact?.jobTitle || 'Senior Role'}
                        </strong>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-400">{'{{my_name}}'} &rarr;</span>{' '}
                        <strong className="text-slate-800 dark:text-zinc-200">
                          {variableContext.settings?.profile?.name || 'Anjan Prajapati'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Apply Bar */}
                <div className="p-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950">
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    Selected:{' '}
                    <strong className="text-slate-800 dark:text-zinc-200">{activeTemplate.name}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="apply-template-btn"
                      onClick={handleApply}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Apply to Compose Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">No template selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
