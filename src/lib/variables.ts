import { Contact, UserSettings } from '../types.js';

export interface VariableContext {
  contact?: Partial<Contact> | null;
  customName?: string;
  customEmail?: string;
  settings?: Partial<UserSettings> | null;
}

export const COMMON_VARIABLES = [
  { key: '{{first_name}}', label: 'First Name', example: 'Alex' },
  { key: '{{last_name}}', label: 'Last Name', example: 'Mercer' },
  { key: '{{company}}', label: 'Company / Org', example: 'Acme Cloud' },
  { key: '{{role}}', label: 'Target Role', example: 'Senior Cloud Engineer' },
  { key: '{{country}}', label: 'Country', example: 'United States' },
  { key: '{{city}}', label: 'City', example: 'San Francisco' },
  { key: '{{department}}', label: 'Department', example: 'Infrastructure' },
  { key: '{{my_name}}', label: 'My Name', example: 'Anjan Prajapati' },
  { key: '{{my_title}}', label: 'My Title', example: 'Senior Cloud & Systems Engineer' },
  { key: '{{my_email}}', label: 'My Email', example: 'anjanp93722@gmail.com' },
];

/**
 * Replaces all known template variables in a text string with context-specific values.
 * Handles variations like {{first_name}}, {{ first_name }}, {first_name}, and case insensitivity.
 */
export function interpolateVariables(text: string, context: VariableContext, forSending = false): string {
  if (!text) return '';

  const contact = context.contact;
  const settings = context.settings;
  const profile = settings?.profile;

  // Resolve recipient name parts
  const rawRecipientName = (contact?.name || context.customName || '').trim();
  const nameParts = rawRecipientName.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || (forSending ? (contact?.organization ? 'Hiring Team' : 'there') : 'Hiring Team');
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const fullName = rawRecipientName || (forSending ? 'Hiring Manager' : 'Target Recipient');

  // Resolve organization / company
  const company =
    contact?.organization ||
    (contact as any)?.company ||
    (forSending ? 'your organization' : 'Target Organization');

  // Resolve target role
  const role =
    contact?.jobTitle ||
    contact?.role ||
    (forSending ? 'Engineering' : 'Open Role');

  // Resolve location & department
  const country = contact?.country || (forSending ? '' : 'United States');
  const city = contact?.city || (forSending ? '' : 'Global');
  const department = contact?.department || (forSending ? 'Engineering' : 'Engineering');
  const university = contact?.organization || (forSending ? 'University' : 'Target University');
  const programme = contact?.jobTitle || (forSending ? 'Program' : 'Graduate Program');

  // Resolve sender / candidate details
  const myName = profile?.name || 'Anjan Prajapati';
  const myEmail = profile?.email || context.customEmail || 'anjanp93722@gmail.com';
  const myTitle = profile?.title || 'Senior Cloud & Systems Engineer';
  const myPhone = profile?.phone || '';
  const mySkills = profile?.skills || 'Cloud Architecture, Kubernetes, Distributed Systems';
  const myEducation = profile?.education || '';
  const linkedin = profile?.linkedin || '';
  const github = profile?.github || '';
  const portfolio = profile?.portfolio || '';
  const targetRoles = profile?.targetRoles || '';

  const replacements: Record<string, string> = {
    first_name: firstName,
    firstname: firstName,
    last_name: lastName,
    lastname: lastName,
    name: fullName,
    full_name: fullName,
    recipient_name: fullName,
    company: company,
    organization: company,
    org: company,
    role: role,
    job_title: role,
    position: role,
    title: role,
    country: country,
    city: city,
    department: department,
    university: university,
    programme: programme,
    program: programme,
    my_name: myName,
    sender_name: myName,
    candidate_name: myName,
    my_email: myEmail,
    sender_email: myEmail,
    my_title: myTitle,
    candidate_title: myTitle,
    my_phone: myPhone,
    phone: myPhone,
    skills: mySkills,
    education: myEducation,
    linkedin: linkedin,
    github: github,
    portfolio: portfolio,
    target_roles: targetRoles,
  };

  // Replace double braces {{ var }} and single braces { var }
  return text.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}|\{\s*([a-zA-Z0-9_-]+)\s*\}/g, (match, p1, p2) => {
    const key = (p1 || p2 || '').toLowerCase();
    if (Object.prototype.hasOwnProperty.call(replacements, key)) {
      return replacements[key];
    }
    return match;
  });
}
