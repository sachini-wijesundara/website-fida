export interface CareerApplicationInput {
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  resumeUrl?: string;
  message?: string;
}

export function validateCareerApplication(data: any): { error?: string; value?: CareerApplicationInput } {
  // 1. Full Name
  if (!data.FullName || typeof data.FullName !== "string") {
    return { error: "Full Name is required." };
  }
  const fullName = data.FullName.trim();
  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "Full Name must be between 2 and 100 characters." };
  }

  // 2. Email
  if (!data.Email || typeof data.Email !== "string") {
    return { error: "Email is required." };
  }
  const email = data.Email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 255) {
    return { error: "Invalid email format." };
  }

  // 3. Phone (Optional but checked if present)
  let phone = undefined;
  if (data.Phone && typeof data.Phone === "string" && data.Phone.trim() !== "") {
    phone = data.Phone.trim();
    const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      return { error: "Invalid phone number format." };
    }
  }

  // 4. Position
  if (!data.Position || typeof data.Position !== "string") {
    return { error: "Position is required." };
  }
  const position = data.Position.trim();

  // 5. Resume URL (Optional but must be valid and secure if present)
  let resumeUrl = undefined;
  if (data.ResumeUrl && typeof data.ResumeUrl === "string" && data.ResumeUrl.trim() !== "") {
    resumeUrl = data.ResumeUrl.trim();
    if (!resumeUrl.startsWith("http://") && !resumeUrl.startsWith("https://")) {
      return { error: "Resume URL must start with http:// or https://" };
    }
    const lowerUrl = resumeUrl.toLowerCase();
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const hasValidExtension = allowedExtensions.some(ext => lowerUrl.includes(ext));
    if (!hasValidExtension) {
      return { error: "Invalid resume format. Only PDF, DOC, and DOCX are allowed." };
    }
  }

  // 6. Message (Optional, sanitized)
  let message = undefined;
  if (data.Message && typeof data.Message === "string") {
    message = data.Message.trim();
  }

  // Sanitize inputs to prevent XSS
  const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return {
    value: {
      fullName: sanitize(fullName),
      email: email,
      phone: phone ? sanitize(phone) : undefined,
      position: sanitize(position),
      resumeUrl: resumeUrl,
      message: message ? sanitize(message) : undefined
    }
  };
}
