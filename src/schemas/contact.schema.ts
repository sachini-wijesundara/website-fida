export interface ContactInput {
  name: string;
  email: string;
  category: string;
  message: string;
  consent: boolean;
  honeypot?: string;
}

// Known throwaway / temporary email services
export const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "throwawaymail.com",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "dispostable.com",
  "getairmail.com",
  "mohmal.com",
  "fakeinbox.com",
  "inboxkitten.com",
  "temp-mail.org",
  "crazymailing.com",
  "mytemp.email",
  "burnermail.io",
  "nada.ltd",
  "fakemailgenerator.com",
]);

// Obvious dummy / placeholder domains often used in fake test submissions
export const DUMMY_DOMAINS = new Set([
  "test.com",
  "example.com",
  "example.org",
  "example.net",
  "sample.com",
  "fake.com",
  "dummy.com",
  "invalid.com",
  "cyberdyne.com",
  "asdf.com",
]);

// Common email provider typo suggestions
export const EMAIL_TYPOS: Record<string, string> = {
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "outlok.com": "outlook.com",
};

/**
 * Validates an email address with strict syntax, TLD checks, disposable blocks, and typo warnings.
 */
export function validateEmail(email: any): { valid: boolean; error?: string; suggestion?: string } {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Work email is required." };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Work email is required." };
  }

  if (trimmed.length > 254) {
    return { valid: false, error: "Email address cannot exceed 254 characters." };
  }

  if (/\s/.test(trimmed)) {
    return { valid: false, error: "Email address cannot contain spaces." };
  }

  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return { valid: false, error: "Email must include exactly one '@' symbol." };
  }

  const [localPart, domain] = parts;

  // Local part checks
  if (!localPart || localPart.length > 64) {
    return { valid: false, error: "Username portion before '@' is invalid." };
  }

  if (localPart.startsWith(".") || localPart.endsWith(".")) {
    return { valid: false, error: "Email username cannot start or end with a dot." };
  }

  if (localPart.includes("..")) {
    return { valid: false, error: "Email username cannot contain consecutive dots." };
  }

  // Domain checks
  if (!domain || domain.length > 253) {
    return { valid: false, error: "Email domain is invalid." };
  }

  if (domain.startsWith(".") || domain.endsWith(".")) {
    return { valid: false, error: "Email domain cannot start or end with a dot." };
  }

  if (domain.includes("..")) {
    return { valid: false, error: "Email domain cannot contain consecutive dots." };
  }

  if (!domain.includes(".")) {
    return { valid: false, error: "Email domain must include an extension (e.g. .com, .lk)." };
  }

  // Standard email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address (e.g. name@company.com)." };
  }

  const domainParts = domain.toLowerCase().split(".");
  const tld = domainParts[domainParts.length - 1];

  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { valid: false, error: "Email must end with a valid domain extension (e.g. .com, .lk)." };
  }

  const lowerDomain = domain.toLowerCase();

  // Disposable domain block
  if (DISPOSABLE_DOMAINS.has(lowerDomain)) {
    return { valid: false, error: "Disposable or temporary email addresses are not accepted." };
  }

  // Dummy placeholder domain block
  if (DUMMY_DOMAINS.has(lowerDomain)) {
    return { valid: false, error: "Please provide an active business or personal email address." };
  }

  // Typo check suggestion
  if (EMAIL_TYPOS[lowerDomain]) {
    const suggestedDomain = EMAIL_TYPOS[lowerDomain];
    const suggestedEmail = `${localPart}@${suggestedDomain}`;
    return {
      valid: true,
      suggestion: suggestedEmail,
    };
  }

  return { valid: true };
}

export function validateContact(data: any): { error?: string; value?: ContactInput } {
  // 1. Honeypot check for bots
  if (data.honeypot && data.honeypot.trim() !== "") {
    return { error: "Spam detected." };
  }

  // 2. Name validation
  if (!data.name || typeof data.name !== "string") {
    return { error: "Name is required." };
  }
  const name = data.name.trim();
  if (name.length < 2 || name.length > 100) {
    return { error: "Name must be between 2 and 100 characters." };
  }

  // 3. Email validation
  const emailCheck = validateEmail(data.email);
  if (!emailCheck.valid) {
    return { error: emailCheck.error || "Invalid email address format." };
  }
  const email = data.email.trim().toLowerCase();

  // 4. Category validation
  if (!data.category || typeof data.category !== "string") {
    return { error: "Category is required." };
  }
  const category = data.category.trim();

  // 5. Message validation
  if (!data.message || typeof data.message !== "string") {
    return { error: "Message is required." };
  }
  const message = data.message.trim();
  if (message.length < 10 || message.length > 5000) {
    return { error: "Message must be between 10 and 5000 characters." };
  }

  // 6. Consent check
  if (data.consent !== true && data.consent !== "true" && data.consent !== 1) {
    return { error: "You must consent to the terms and conditions." };
  }

  // Sanitize content: escape HTML entities to prevent XSS
  const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return {
    value: {
      name: sanitize(name),
      email: email,
      category: sanitize(category),
      message: sanitize(message),
      consent: true,
    }
  };
}
