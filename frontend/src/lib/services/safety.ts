/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Safety & Moderation Utilities (client-side heuristics)
 * NOTE: This is a lightweight best-effort layer; server-side validation is recommended for production.
 */

const ENABLE_PII = (process.env.NEXT_PUBLIC_ENABLE_PII_REDACTION || 'false')
  .toLowerCase()
  .startsWith('t');
const STRICT_MODERATION = (process.env.NEXT_PUBLIC_MODERATION_STRICT || 'true')
  .toLowerCase()
  .startsWith('t');

// Minimal keyword lists (extend server-side if needed)
const TOXIC_KEYWORDS = [
  'kill yourself',
  'kys',
  'hate speech',
  'racial slur',
  'terrorist',
  'rape',
  'nsfw',
  'porn',
  'sexual act',
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore (previous|all) instructions/i,
  /disregard prior rules/i,
  /reveal system prompt/i,
  /you are now/gi,
];

// PII redaction regexes
const EMAIL_REGEX = /([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+)\.[a-zA-Z0-9-.]+/g;
const PHONE_REGEX = /(?:\+\d{1,3}[\s-]?)?(?:\d[\s-]?){10,14}\b/g;

export interface SafetyResult {
  ok: boolean;
  reason?: 'toxicity' | 'nsfw' | 'injection' | 'empty';
  message?: string;
}

export function neutralizeHTML(input: string): string {
  // Strip HTML tags and scripts/styles
  const withoutTags = input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '');
  // Normalize whitespace
  return withoutTags.replace(/\s+/g, ' ').trim();
}

export function redactPII(input: string): string {
  if (!ENABLE_PII) return input;
  return input
    .replace(EMAIL_REGEX, (_m, _u) => '[redacted-email]')
    .replace(PHONE_REGEX, '[redacted-phone]');
}

export function sanitizeInput(input: string): string {
  const trimmed = input.trim();
  const noHtml = neutralizeHTML(trimmed);
  const redacted = redactPII(noHtml);
  return redacted;
}

export function basicModerationCheck(input: string): SafetyResult {
  const text = input.toLowerCase();
  if (!text) return { ok: false, reason: 'empty', message: 'Empty message' };

  // Prompt injection heuristics
  if (PROMPT_INJECTION_PATTERNS.some(rx => rx.test(text))) {
    return {
      ok: false,
      reason: 'injection',
      message: 'Unsafe instruction detected',
    };
  }

  if (!STRICT_MODERATION) return { ok: true };

  // Toxicity/NSFW heuristics
  if (TOXIC_KEYWORDS.some(k => text.includes(k))) {
    const reason =
      text.includes('nsfw') || text.includes('porn') ? 'nsfw' : 'toxicity';
    return { ok: false, reason, message: 'Content violates safety policy' };
  }

  return { ok: true };
}

export function sanitizeHistory(
  history: Array<{ type: 'apiMessage' | 'userMessage'; message: string }>
): Array<{ type: 'apiMessage' | 'userMessage'; message: string }> {
  return history.map(h => ({ ...h, message: sanitizeInput(h.message) }));
}
