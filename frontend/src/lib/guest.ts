export type Tone = 'friendly' | 'formal' | 'concise' | 'detailed';

export type Persona = {
  name?: string;
  preferences?: {
    tone?: Tone;
    focus?: string;
    language?: string; // e.g., "English" or IETF tag like "en-IN"
  };
};

const GUEST_ID_KEY = 'guestId';
const PERSONA_KEY = 'guestPersona';

export function getGuestId(): string | null {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    const uuid =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? (crypto as { randomUUID: () => string }).randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    id = `guest-${uuid}`;
    localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

export function getPersona(): Persona | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PERSONA_KEY);
    return raw ? (JSON.parse(raw) as Persona) : null;
  } catch {
    return null;
  }
}

export function setPersona(persona: Persona): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERSONA_KEY, JSON.stringify(persona));
}

export function getDefaultPersona(): Persona {
  return {
    name: 'Guest',
    preferences: {
      tone: 'friendly',
      focus: 'education',
      language: 'English',
    },
  };
}
