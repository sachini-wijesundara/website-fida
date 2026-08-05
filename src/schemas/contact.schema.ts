export interface ContactInput {
  name: string;
  email: string;
  category: string;
  message: string;
  consent: boolean;
  honeypot?: string;
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
  if (!data.email || typeof data.email !== "string") {
    return { error: "Email is required." };
  }
  const email = data.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 255) {
    return { error: "Invalid email format." };
  }

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
    return { error: "You must consent to the privacy policy." };
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
