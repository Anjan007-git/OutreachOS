import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { Contact, ReplyClassification, UserProfile } from '../src/types.js';

let aiClient: GoogleGenAI | null = null;

function sanitizeApiKey(val?: string): string | undefined {
  if (!val) return undefined;
  let cleaned = String(val).trim();
  if (cleaned === '' || cleaned === 'undefined' || cleaned === 'null') return undefined;
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();
  const match = cleaned.match(/^(?:GEMINI_API_KEY)\s*=\s*(.*)$/i);
  if (match) {
    cleaned = match[1].trim().replace(/^["']|["']$/g, '').trim();
  }
  return cleaned || undefined;
}

function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = sanitizeApiKey(process.env.GEMINI_API_KEY);
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODEL = 'gemini-3.6-flash';

async function generateWithFallback(prompt: string): Promise<string> {
  const ai = getAI();
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    const res = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: prompt,
    });
    const text = res.text?.trim();
    if (text) return text;
  } catch (err: any) {
    console.warn(`Gemini primary model (${PRIMARY_MODEL}) error:`, err.message || err);
    // Try fallback model
    try {
      const fallbackRes = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: prompt,
      });
      const text = fallbackRes.text?.trim();
      if (text) return text;
    } catch (fallbackErr: any) {
      console.error(`Gemini fallback model (${FALLBACK_MODEL}) error:`, fallbackErr.message || fallbackErr);
      throw fallbackErr;
    }
  }

  return '';
}

const AI_SAFETY_PREAMBLE = `You are OutreachOS AI, an executive outreach assistant for Anjan Prajapati.
CRITICAL SAFETY & TRUTHFULNESS DIRECTIVES:
1. NEVER invent or hallucinate candidate work experience, past employers, degrees, certifications, skills, projects, or achievements not explicitly provided.
2. NEVER fabricate job offers, interview guarantees, university requirements, or admissions criteria.
3. NEVER assume facts not present in the user profile or contact record.
4. Keep outreach authentic, articulate, high-signal, concise, and respectful of the recipient's time. Avoid hype, buzzword stuffing, or generic templates.`;

export async function improveMessage(
  content: string,
  instruction = 'Make it concise, polite, and impactful',
  contactContext?: Partial<Contact>
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    return content;
  }

  const prompt = `${AI_SAFETY_PREAMBLE}
Task: Refine and polish the following outreach email.
User Instruction: "${instruction}"
Recipient Info:
- Name: ${contactContext?.name || 'Contact'}
- Organization: ${contactContext?.organization || 'Target Organization'}
- Role: ${contactContext?.role || 'Recipient Role'}

Original Email Draft:
---
${content}
---

Return ONLY the refined email text. Do not wrap in markdown quotes or preamble.`;

  try {
    const text = await generateWithFallback(prompt);
    return text || content;
  } catch (err) {
    console.error('Gemini improveMessage error:', err);
    return content;
  }
}

export async function generateSubject(
  content: string,
  role?: string,
  organization?: string,
  candidateName = 'Anjan Prajapati'
): Promise<string[]> {
  const ai = getAI();
  if (!ai) {
    return [
      `Application: ${role || 'Engineering Opportunities'} - ${candidateName}`,
      `Connecting regarding ${organization || 'Team'} opportunities - ${candidateName}`,
      `Inquiry: ${role || 'Role'} at ${organization || 'Organization'}`,
    ];
  }

  const prompt = `${AI_SAFETY_PREAMBLE}
Task: Generate 3 high-converting, professional, spam-filter-safe email subject lines for the following outreach message.
Role: ${role || 'Role'}
Organization: ${organization || 'Organization'}
Candidate: ${candidateName}

Email Body:
${content}

Format: Return a JSON array of 3 string subject lines, e.g. ["Subject 1", "Subject 2", "Subject 3"]. Return only valid JSON.`;

  try {
    const text = await generateWithFallback(prompt);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return text.split('\n').filter((l) => l.trim()).slice(0, 3);
  } catch (err) {
    console.error('Gemini generateSubject error:', err);
    return [`Inquiry: ${role || 'Opportunities'} at ${organization || 'Team'} - ${candidateName}`];
  }
}

export async function personalizeMessage(
  template: string,
  contact: Contact,
  userProfile: UserProfile
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    const contactName = contact.name || '';
    return (template || '')
      .replace(/\{\{first_name\}\}/g, contactName.split(' ')[0] || contactName || 'there')
      .replace(/\{\{company\}\}/g, contact.organization || '')
      .replace(/\{\{role\}\}/g, contact.jobTitle || contact.role || 'the position')
      .replace(/\{\{university\}\}/g, contact.organization || '')
      .replace(/\{\{programme\}\}/g, contact.jobTitle || 'Graduate Program')
      .replace(/\{\{country\}\}/g, contact.country || '');
  }

  const prompt = `${AI_SAFETY_PREAMBLE}
Task: Personalize this outreach email for the specific contact.
Strict Constraint: You may ONLY reference skills and background explicitly listed in Candidate Profile. DO NOT make up claims.

Candidate Profile:
- Name: ${userProfile.name}
- Title: ${userProfile.title}
- Skills: ${userProfile.skills}
- Education: ${userProfile.education}

Recipient Contact:
- Name: ${contact.name}
- Organization: ${contact.organization} (${contact.organizationType})
- Role: ${contact.role}
- Target Job / Program: ${contact.jobTitle || ''}
- Country: ${contact.country}
- Notes: ${contact.notes || ''}

Base Template:
---
${template}
---

Return ONLY the personalized email body ready to be sent.`;

  try {
    const text = await generateWithFallback(prompt);
    return text || template;
  } catch (err) {
    console.error('Gemini personalizeMessage error:', err);
    return template;
  }
}

export async function generateFollowUp(
  originalSubject: string,
  originalBody: string,
  stepNumber: number,
  contactName: string
): Promise<{ subject: string; body: string }> {
  const ai = getAI();
  if (!ai) {
    return {
      subject: originalSubject.startsWith('Following up') ? originalSubject : `Following up: ${originalSubject}`,
      body: `Hi ${contactName.split(' ')[0] || 'there'},\n\nI wanted to gently follow up on my note below in case it got buried in your inbox. I know you're busy, so no rush at all.\n\nWould love to connect briefly if your calendar allows.\n\nBest regards,`,
    };
  }

  const prompt = `${AI_SAFETY_PREAMBLE}
Task: Generate a courteous, low-pressure follow-up email (Sequence Step #${stepNumber}).
Recipient Name: ${contactName}
Original Subject: ${originalSubject}
Original Outreach:
---
${originalBody}
---

Return a JSON object:
{
  "subject": "string",
  "body": "string"
}
Return only valid JSON.`;

  try {
    const text = await generateWithFallback(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error('Gemini generateFollowUp error:', err);
  }

  return {
    subject: `Following up: ${originalSubject}`,
    body: `Hi ${contactName.split(' ')[0] || 'there'},\n\nJust following up on my previous note. Looking forward to connecting when time permits.\n\nBest regards,`,
  };
}

export async function summarizeJobDescription(jdText: string): Promise<{
  keyRequirements: string[];
  recommendedAngle: string;
  matchedSkills: string;
}> {
  const ai = getAI();
  if (!ai) {
    return {
      keyRequirements: ['Review technical requirements', 'Check cloud experience', 'Assess team culture'],
      recommendedAngle: 'Highlight cloud infrastructure and container orchestration background.',
      matchedSkills: 'Kubernetes, Cloud Architecture, Automation',
    };
  }

  const prompt = `${AI_SAFETY_PREAMBLE}
Task: Extract key hiring manager requirements and suggest an outreach angle from this job posting.

Job Description:
---
${jdText}
---

Return a JSON object with:
{
  "keyRequirements": ["req 1", "req 2", "req 3"],
  "recommendedAngle": "brief advice on what to emphasize",
  "matchedSkills": "key keywords to mention"
}
Return only JSON.`;

  try {
    const text = await generateWithFallback(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error('Gemini summarizeJobDescription error:', err);
  }

  return {
    keyRequirements: ['Experience in cloud engineering', 'System reliability', 'Communication skills'],
    recommendedAngle: 'Focus on production systems reliability and cloud scaling.',
    matchedSkills: 'GCP, AWS, Kubernetes, Terraform',
  };
}

export async function classifyIncomingReply(
  subject: string,
  replyBody: string,
  originalSubject?: string,
  originalOutreach?: string
): Promise<{ classification: ReplyClassification; reason: string }> {
  const ai = getAI();
  if (!ai) {
    const lower = replyBody.toLowerCase();
    if (lower.includes('interview') || lower.includes('chat') || lower.includes('schedule') || lower.includes('call')) {
      return { classification: 'Interview Request', reason: 'Contains interview/meeting keywords' };
    }
    if (lower.includes('reject') || lower.includes('unfortunately') || lower.includes('not moving forward') || lower.includes('other candidates')) {
      return { classification: 'Rejection', reason: 'Declination of candidacy detected' };
    }
    if (lower.includes('automated') || lower.includes('out of office') || lower.includes('auto-reply')) {
      return { classification: 'Automated Reply', reason: 'Automated auto-responder' };
    }
    return { classification: 'Positive', reason: 'Recipient responded to outreach' };
  }

  const prompt = `${AI_SAFETY_PREAMBLE}
Task: Classify an incoming email reply received in response to an outreach campaign.
Choose strictly one of the following classifications:
- 'Positive'
- 'Interview Request'
- 'Meeting Request'
- 'Request for Information'
- 'Application Confirmation'
- 'Rejection'
- 'Follow-up Required'
- 'Automated Reply'
- 'Unclear'

Incoming Email:
Subject: ${subject}
Body:
---
${replyBody}
---

Original Outreach Context:
Subject: ${originalSubject || 'N/A'}
Body: ${originalOutreach || 'N/A'}

Return a JSON object:
{
  "classification": "ClassificationType",
  "reason": "One concise sentence explaining the classification."
}
Return only JSON.`;

  try {
    const text = await generateWithFallback(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        classification: parsed.classification as ReplyClassification,
        reason: parsed.reason,
      };
    }
  } catch (err) {
    console.error('Gemini classifyIncomingReply error:', err);
  }

  return { classification: 'Positive', reason: 'Direct response received from recipient.' };
}

export async function draftReplyResponse(
  incomingSubject: string,
  incomingBody: string,
  originalOutreach: string,
  userProfile: UserProfile
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    return `Hi,\n\nThank you for getting back to me! I would be delighted to connect. Please let me know what times suit you best.\n\nBest regards,\n${userProfile.name}`;
  }

  const prompt = `${AI_SAFETY_PREAMBLE}
Task: Draft a courteous, professional response to this email reply.
NEVER send automatically. This is a draft for human review.
DO NOT hallucinate candidate background.

Candidate:
Name: ${userProfile.name}
Title: ${userProfile.title}
Phone: ${userProfile.phone}

Incoming Email:
Subject: ${incomingSubject}
Body:
---
${incomingBody}
---

Original Outreach:
---
${originalOutreach}
---

Return ONLY the drafted response body text.`;

  try {
    const text = await generateWithFallback(prompt);
    return text || '';
  } catch (err) {
    console.error('Gemini draftReplyResponse error:', err);
    return `Hi,\n\nThank you very much for the update. Looking forward to connecting.\n\nBest regards,\n${userProfile.name}`;
  }
}

/**
 * Interactive AI Assistant Chatbot inside OutreachOS
 */
export async function chatWithOutreachAssistant(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemContext: {
    userName?: string;
    userTitle?: string;
    contactsCount: number;
    campaignsCount: number;
    queuedCount: number;
    sentCount: number;
    repliesCount: number;
    isGmailConnected: boolean;
    gmailEmail?: string;
    dailyLimit?: number;
    sentToday?: number;
    recentCampaigns?: string[];
    documents?: Array<{ name: string; category: string; isDefaultResume?: boolean }>;
  }
): Promise<string> {
  const ai = getAI();
  if (!ai) {
    return "OutreachOS Assistant is currently offline (GEMINI_API_KEY not configured). You can still manage campaigns and compose emails directly.";
  }

  const docsList =
    (systemContext.documents || [])
      .map(
        (d) =>
          `• ${d.name} (${d.category}${d.isDefaultResume ? ' — PRIMARY / DEFAULT RESUME' : ''})`
      )
      .join('\n') || 'None yet';

  const contextPrompt = `You are the built-in Executive AI Assistant inside OutreachOS for ${systemContext.userName || 'Anjan Prajapati'}.
User Title: ${systemContext.userTitle || 'Senior Cloud & Systems Engineer'}

Current System State:
- Gmail Connection: ${systemContext.isGmailConnected ? `Connected (${systemContext.gmailEmail})` : 'Disconnected'}
- Daily Limit: ${systemContext.sentToday || 0} / ${systemContext.dailyLimit || 10} sent today
- Active Campaigns: ${systemContext.campaignsCount} (${(systemContext.recentCampaigns || []).join(', ') || 'None'})
- Saved Contacts: ${systemContext.contactsCount}
- Scheduled / Queued Messages: ${systemContext.queuedCount}
- Sent Messages: ${systemContext.sentCount}
- Incoming Responses: ${systemContext.repliesCount}
- Available Documents in Repository:
${docsList}

Document Attachment & Sending Rules:
1. If the user asks to "attach my resume" or "attach a document":
   - Find the matching document (preferring the PRIMARY / DEFAULT RESUME).
   - Tell the user which file you found, e.g.: "Found [Filename]. I've attached it to this draft."
2. If the user asks to "send my resume to [recruiter/recipient]":
   - DO NOT claim that it has already been sent!
   - Prepare the email draft with recipient, subject, professional body, and the attachment name.
   - Ask for confirmation: "Ready to send this email with [Filename] attached. Confirm?"
3. NEVER invent fake documents that are not in the repository.

Capabilities:
1. Help write, critique, and polish high-converting outreach emails and follow-ups.
2. Analyze campaign strategy, target audience, and subject lines.
3. Summarize outreach metrics, queued dispatches, and incoming responses.
4. Give specific, high-signal recommendations on cold outreach etiquette and deliverability.
5. Work seamlessly with user documents and resumes.
6. NEVER invent false work history or make up facts. Be concise, direct, and professional.

Conversation History:
${(history || [])
  .slice(-6)
  .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
  .join('\n')}

User Question: ${message}

Provide a helpful, well-formatted response with clear action steps or ready-to-use email copy where appropriate.`;

  try {
    const reply = await generateWithFallback(contextPrompt);
    return reply || 'I am ready to assist with your outreach, campaigns, and drafts.';
  } catch (err: any) {
    console.error('Gemini chatWithOutreachAssistant error:', err);
    return 'I encountered a temporary connection issue. Please try your request again in a moment.';
  }
}
