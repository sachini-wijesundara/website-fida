import React from "react";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy & Cookie Policy | FIDA Global",
  description: "Read FIDA Global's Privacy and Cookie Policy to understand how we protect enterprise data, respect personal privacy, and adhere to global compliance standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="public-pastel-page min-h-screen pt-36 pb-28">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0047e1] text-xs font-bold uppercase tracking-wider mb-5">
            <Shield size={14} /> Data Protection & Privacy
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#052c65] tracking-tight leading-tight mb-4">
            Privacy & Cookie Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Last updated: October 2026 · Committed to transparency and enterprise security.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-[#052c65]/10 shadow-[0_20px_50px_rgba(5,44,101,0.06)] p-8 sm:p-12 space-y-10 text-slate-600 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">1. Introduction</h2>
            <p>
              At FIDA Global, we are committed to safeguarding the confidentiality, integrity, and security of all personal data and enterprise assets entrusted to us. This Privacy & Cookie Policy explains how we collect, use, store, and disclose information when you visit our website, utilize our SaaS products (including Smart HRIS), or communicate with our consultancy and engineering teams.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">2. How We Use Cookies</h2>
            <p>
              Cookies are small data files placed on your browser or device. We categorize our cookies into four distinct types:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-[#052c65] text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#0047e1]" /> Necessary Cookies
                </div>
                <p className="text-xs text-slate-500">
                  Essential for basic navigation, security validations, and session authentication across our platforms. These cannot be switched off.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-[#052c65] text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#0047e1]" /> Preferences Cookies
                </div>
                <p className="text-xs text-slate-500">
                  Allow the website to remember choices you have made, such as your regional language preference or display modes.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-[#052c65] text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#0047e1]" /> Statistics & Analytics
                </div>
                <p className="text-xs text-slate-500">
                  Help us understand how visitors interact with pages anonymously, enabling performance enhancements and bug resolutions.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-[#052c65] text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#0047e1]" /> Marketing Cookies
                </div>
                <p className="text-xs text-slate-500">
                  Used to deliver relevant enterprise product updates and gauge the effectiveness of our marketing initiatives.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">3. Information We Collect</h2>
            <p>
              We only collect information necessary to provide you with tailored solutions and enterprise software services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Contact Information:</strong> Name, work email, phone number, and organization details submitted through inquiry forms.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and interaction records collected via analytics cookies (subject to consent).</li>
              <li><strong>Enterprise Credentials:</strong> Login credentials and role privileges managed securely with multi-factor authentication.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">4. Data Security & Storage</h2>
            <p>
              FIDA Global maintains multi-tiered enterprise security. Data at rest is encrypted using AES-256 encryption, and data in transit is protected via TLS 1.3. We conduct routine penetration tests and adhere to international standards to prevent unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">5. Managing Your Cookie Preferences</h2>
            <p>
              You can adjust or revoke your cookie consent at any time by clicking the{" "}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-cookie-banner"));
                  }
                }}
                className="text-[#0047e1] font-bold underline underline-offset-2 hover:text-[#0037b0]"
              >
                Cookie Settings
              </button>{" "}
              link located in the footer of any page on this website.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">6. Contact Privacy Team</h2>
            <p>
              If you have any questions about this Privacy & Cookie Policy or wish to exercise your data subject rights, please contact our data governance team at:
            </p>
            <p className="font-semibold text-[#052c65]">
              Email: <a href="mailto:info@fidaglobal.com" className="text-[#0047e1] underline">info@fidaglobal.com</a><br />
              Telephone: +94-11-710-80-20<br />
              Address: No. 215 C, Raththanapitiya, Boralesgamuwa, 10290, Sri Lanka
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
