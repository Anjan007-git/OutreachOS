import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit2,
  Mail,
  Send,
  Building,
  GraduationCap,
  Briefcase,
  MapPin,
  Tag,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Contact, OrganizationType } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onAddContact: (contact: Partial<Contact>) => Promise<void>;
  onUpdateContact: (id: string, contact: Partial<Contact>) => Promise<void>;
  onDeleteContact: (id: string) => Promise<void>;
  onImportContacts: (contacts: any[]) => Promise<void>;
  onComposeToContact: (contact: Contact) => void;
}

const orgTypeLabels: Record<OrganizationType, string> = {
  HR: 'HR Department',
  Recruiter: 'Technical Recruiter',
  'Hiring Manager': 'Hiring Manager',
  Company: 'Company / Lead',
  University: 'University Faculty / Department',
  Admissions: 'Admissions Office',
  'International Office': 'International Student Office',
  'Scholarship Office': 'Scholarship Committee',
  Other: 'General Contact',
};

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onImportContacts,
  onComposeToContact,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrgType, setSelectedOrgType] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    email: '',
    organization: '',
    organizationType: 'Recruiter',
    role: '',
    country: 'United States',
    tags: [],
    notes: '',
  });
  const [tagInput, setTagInput] = useState('');

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.role && c.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.tags && c.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesType = selectedOrgType === 'ALL' || c.organizationType === selectedOrgType;

      return matchesSearch && matchesType;
    });
  }, [contacts, searchTerm, selectedOrgType]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      organization: '',
      organizationType: 'Recruiter',
      role: '',
      country: 'United States',
      tags: [],
      notes: '',
    });
    setEditingContact(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({ ...contact });
    setIsAddModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.organization) {
      alert('Please fill out Name, Email, and Organization.');
      return;
    }

    if (editingContact) {
      await onUpdateContact(editingContact.id, formData);
    } else {
      await onAddContact(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleExportCsv = () => {
    if (contacts.length === 0) return;
    const headers = ['Name', 'Email', 'Organization', 'Type', 'Role', 'Country', 'City', 'Department', 'Tags', 'Notes'];
    const rows = contacts.map((c) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.organization}"`,
      `"${c.organizationType}"`,
      `"${c.role || ''}"`,
      `"${c.country || ''}"`,
      `"${c.city || ''}"`,
      `"${c.department || ''}"`,
      `"${(c.tags || []).join(';')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OutreachOS_Contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessCsvImport = async () => {
    if (!csvText.trim()) return;
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus('CSV requires header line and at least 1 data line.');
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
      const parsedContacts = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const vals = line.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = vals[idx] || '';
        });

        // Map common headers
        const name = obj.name || obj['full name'] || obj.contact || '';
        const email = obj.email || obj['email address'] || '';
        const organization = obj.organization || obj.company || obj.university || 'Unknown';
        const role = obj.role || obj.title || obj.position || '';
        const orgType = obj.type || obj.organizationtype || 'RECRUITER';
        const country = obj.country || 'United States';
        const city = obj.city || '';
        const tags = obj.tags ? obj.tags.split(';') : [];

        if (email && email.includes('@')) {
          parsedContacts.push({
            name: name || email.split('@')[0],
            email,
            organization,
            organizationType: orgType.toUpperCase(),
            role,
            country,
            city,
            tags,
          });
        }
      }

      if (parsedContacts.length === 0) {
        setImportStatus('No valid rows with email addresses found in input.');
        return;
      }

      await onImportContacts(parsedContacts);
      setIsImportModalOpen(false);
      setCsvText('');
      setImportStatus(null);
    } catch (err: any) {
      setImportStatus('Error importing CSV: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Contacts Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage target HR leads, recruiters, hiring managers, and university admissions contacts.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            id="btn-import-contacts-csv"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>
          <button
            id="btn-export-contacts-csv"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            id="btn-add-contact-open"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-contacts"
            type="text"
            placeholder="Search by name, email, company, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            id="select-filter-org-type"
            value={selectedOrgType}
            onChange={(e) => setSelectedOrgType(e.target.value)}
            className="text-xs py-2 px-3.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Categories ({contacts.length})</option>
            <option value="RECRUITER">Technical Recruiters</option>
            <option value="HR">HR Department</option>
            <option value="HIRING_MANAGER">Hiring Managers</option>
            <option value="FOUNDER">Founders & C-Level</option>
            <option value="UNIVERSITY_ADMISSIONS">University Admissions</option>
            <option value="INTERNATIONAL_OFFICE">International Offices</option>
            <option value="SCHOLARSHIP_OFFICE">Scholarship Offices</option>
            <option value="PROFESSOR">Faculty / Professors</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Contact</th>
                <th className="py-3.5 px-6">Organization & Role</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Status / Last Active</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No contacts in database</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                      Build your outreach network by adding recruiter or admissions contacts manually, or importing them in bulk via CSV.
                    </p>
                    <div className="flex items-center justify-center gap-2.5">
                      <button
                        onClick={handleOpenAdd}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add First Contact</span>
                      </button>
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-2xs inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Import CSV</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No contacts match your filters</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try changing the search keyword or category filter.</p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => {
                  const isAdmissions = [
                    'UNIVERSITY_ADMISSIONS',
                    'INTERNATIONAL_OFFICE',
                    'PROFESSOR',
                    'SCHOLARSHIP_OFFICE',
                  ].includes(c.organizationType);

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">{c.email}</div>
                        {c.tags && c.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {c.tags.map((t, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Organization & Role */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 flex items-center space-x-1.5 text-xs">
                          {isAdmissions ? (
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          ) : (
                            <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          )}
                          <span>{c.organization}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{c.role || '—'}</div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isAdmissions
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {orgTypeLabels[c.organizationType] || c.organizationType}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6 text-slate-600">
                        <div className="flex items-center space-x-1 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{[c.city, c.country].filter(Boolean).join(', ') || '—'}</span>
                        </div>
                      </td>

                      {/* Outreach Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            c.responseStatus === 'REPLIED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : c.responseStatus === 'BOUNCED'
                              ? 'bg-rose-100 text-rose-700'
                              : c.lastContactedDate
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-slate-50 text-slate-500 border border-slate-200/60'
                          }`}
                        >
                          {c.responseStatus === 'REPLIED'
                            ? 'Replied'
                            : c.lastContactedDate
                            ? `Contacted (${new Date(c.lastContactedDate).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })})`
                            : 'Not Contacted'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            id={`btn-compose-to-${c.id}`}
                            onClick={() => onComposeToContact(c)}
                            title="Compose Outreach to this contact"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-edit-contact-${c.id}`}
                            onClick={() => handleOpenEdit(c)}
                            title="Edit Contact"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-delete-contact-${c.id}`}
                            onClick={() => {
                              if (confirm(`Delete contact ${c.name}?`)) {
                                onDeleteContact(c.id);
                              }
                            }}
                            title="Delete Contact"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="sjenkins@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization / University *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization || ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Acme Cloud Corp"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization Category</label>
                  <select
                    value={formData.organizationType || 'Recruiter'}
                    onChange={(e) =>
                      setFormData({ ...formData, organizationType: e.target.value as OrganizationType })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    {Object.entries(orgTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Senior Technical Recruiter"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. Infrastructure Talent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. United States"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="e.g. San Francisco"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tags</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (tagInput.trim()) {
                          const updated = [...(formData.tags || []), tagInput.trim()];
                          setFormData({ ...formData, tags: Array.from(new Set(updated)) });
                          setTagInput('');
                        }
                      }
                    }}
                    placeholder="Press enter to add tag (e.g. Cloud, Kubernetes)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim()) {
                        const updated = [...(formData.tags || []), tagInput.trim()];
                        setFormData({ ...formData, tags: Array.from(new Set(updated)) });
                        setTagInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-semibold"
                  >
                    Add
                  </button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              tags: formData.tags?.filter((_, i) => i !== idx),
                            });
                          }}
                          className="ml-1 text-slate-400 hover:text-slate-600"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Notes about candidate fit, research, or mutual connection..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-sm cursor-pointer transition-colors"
                >
                  {editingContact ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Import Contacts from CSV</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Paste comma-separated rows below. The first row should contain column headers (e.g.{' '}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px] text-slate-800">
                Name, Email, Organization, Role, Country, Type
              </code>
              ).
            </p>

            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`Name,Email,Organization,Role,Country,Type\nElena Rostova,elena.r@innovate.tech,InnovateTech,Talent Acquisition,Germany,RECRUITER\nDr. Marcus Vance,m.vance@tum.de,Technical University of Munich,Admissions Director,Germany,UNIVERSITY_ADMISSIONS`}
              className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
            />

            {importStatus && (
              <div className="mt-2 text-xs font-semibold text-rose-600">{importStatus}</div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessCsvImport}
                disabled={!csvText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                Import Contacts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
