import React from "react";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2, Globe, Scale, UserCheck } from "lucide-react";
import CookieSettingsButton from "@/components/common/cookie-settings-button";

export const metadata = {
  title: "Privacy & Cookie Policy | FIDA Global",
  description: "Read FIDA Global's GDPR-compliant Privacy and Cookie Policy to understand how we protect enterprise data, respect personal privacy, and adhere to global compliance standards.",
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
            Last updated: October 2026 · Committed to EU GDPR compliance, transparency, and enterprise data security.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#052c65]/10 shadow-[0_20px_50px_rgba(5,44,101,0.06)] p-5 sm:p-12 space-y-8 sm:space-y-10 text-slate-600 text-sm sm:text-base leading-relaxed">
          {/* 1. Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">1. Introduction & Data Controller</h2>
            <p>
              At FIDA Global (Private) Ltd (&quot;FIDA Global&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we are committed to safeguarding the confidentiality, integrity, and security of all personal data entrusted to us. This Privacy & Cookie Policy outlines how we collect, process, store, and protect personal data in compliance with applicable global data protection regulations, including the <strong>European Union General Data Protection Regulation (EU GDPR)</strong>, the UK GDPR, and the ePrivacy Directive.
            </p>
            <p>
              For the purposes of data protection legislation, the Data Controller responsible for your personal data is:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
              <strong>FIDA Global (Private) Ltd</strong><br />
              No. 215 C, Raththanapitiya, Boralesgamuwa, 10290, Sri Lanka<br />
              Email: <a href="mailto:info@fidaglobal.com" className="text-[#0047e1] underline">info@fidaglobal.com</a> · Phone: +94 11 710 80 20
            </div>
          </section>

          {/* 2. Legal Bases for Processing */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">2. Legal Bases for Processing (GDPR Art. 6)</h2>
            <p>
              We only collect and process personal data when we have a lawful basis under Article 6 of the GDPR:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Consent (Art. 6(1)(a)):</strong> Where you have granted explicit consent for specific purposes, such as subscribing to our newsletter dispatch or opting in to non-essential statistics and marketing cookies.</li>
              <li><strong>Contractual Performance (Art. 6(1)(b)):</strong> Where processing is required to deliver requested services, respond to enterprise consultation requests, or fulfill our software agreements.</li>
              <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> To enhance system security, detect and prevent fraud, optimize platform performance, and communicate with corporate clients, provided these interests do not override your fundamental rights.</li>
              <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> Where processing is necessary for compliance with applicable corporate, tax, or legal regulatory obligations.</li>
            </ul>
          </section>

          {/* 3. Information We Collect */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">3. Information We Collect</h2>
            <p>
              We adhere to the principle of data minimization and only collect data necessary for operational purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Contact & Consultation Data:</strong> Full name, corporate email address, organization name, phone number, and inquiry messages submitted through our contact or service forms.</li>
              <li><strong>Recruitment Data:</strong> Curriculum vitae, contact details, employment history, and notes submitted via our careers application portal.</li>
              <li><strong>Technical & System Information:</strong> Browser type, operating system version, anonymized IP addresses, and interaction logs captured solely for performance monitoring and security authentication.</li>
            </ul>
          </section>

          {/* 4. Cookies & Tracking Technologies */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">4. Cookies & ePrivacy Choices</h2>
            <p>
              Cookies are small data files placed on your browser or device. We do not load non-essential cookies without your prior consent. Cookies are divided into four clear categories:
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
            <p className="text-xs text-slate-500 pt-1">
              You can adjust or revoke your cookie choices at any time via the{" "}
              <CookieSettingsButton /> link located in the footer of every page.
            </p>
          </section>

          {/* 5. Your Data Subject Rights under GDPR */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65] flex items-center gap-2">
              <Scale size={20} className="text-[#0047e1]" />
              5. Your Rights Under the GDPR (Articles 15–22)
            </h2>
            <p>
              If you are located in the European Union (or UK), you hold specific, legally enforceable rights regarding your personal data:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                <strong className="text-[#052c65] text-sm block mb-1">Right of Access (Art. 15):</strong>
                <p className="text-xs sm:text-sm text-slate-600">You have the right to request a confirmation of whether we process your personal data and to receive a copy of that data.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                <strong className="text-[#052c65] text-sm block mb-1">Right to Rectification (Art. 16):</strong>
                <p className="text-xs sm:text-sm text-slate-600">You may request the immediate correction of inaccurate or incomplete personal data concerning you.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                <strong className="text-[#052c65] text-sm block mb-1">Right to Erasure / &quot;Right to be Forgotten&quot; (Art. 17):</strong>
                <p className="text-xs sm:text-sm text-slate-600">You may request the deletion of your personal data when it is no longer necessary for the purposes collected or when you withdraw your consent.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                <strong className="text-[#052c65] text-sm block mb-1">Right to Restriction of Processing (Art. 18):</strong>
                <p className="text-xs sm:text-sm text-slate-600">You can demand that we temporarily restrict processing if you contest data accuracy or object to its processing.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                <strong className="text-[#052c65] text-sm block mb-1">Right to Data Portability (Art. 20):</strong>
                <p className="text-xs sm:text-sm text-slate-600">You have the right to receive your personal data in a structured, commonly used, and machine-readable format and transmit it to another controller.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                <strong className="text-[#052c65] text-sm block mb-1">Right to Object (Art. 21):</strong>
                <p className="text-xs sm:text-sm text-slate-600">You hold the right to object at any time to processing based on legitimate interests or direct marketing.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80">
                <strong className="text-[#052c65] text-sm block mb-1">Right to Lodge a Complaint (Art. 77):</strong>
                <p className="text-xs sm:text-sm text-slate-600">You have the right to file a complaint with a competent Data Protection Authority (DPA) in the EU member state of your residence, place of work, or place of alleged infringement.</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              To exercise any of these rights, email us at <a href="mailto:info@fidaglobal.com" className="text-[#0047e1] underline font-medium">info@fidaglobal.com</a>. We will respond within one month without charge.
            </p>
          </section>

          {/* 6. Cross-Border International Data Transfers */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65] flex items-center gap-2">
              <Globe size={20} className="text-[#0047e1]" />
              6. Cross-Border Data Transfers & Safeguards
            </h2>
            <p>
              FIDA Global is headquartered in Sri Lanka. Consequently, when European Union or international visitors interact with our website or submit inquiries, their personal data may be transferred, stored, and processed outside the European Economic Area (EEA).
            </p>
            <p>
              To ensure that your personal information receives an adequate level of protection equivalent to EU standards, we implement appropriate safeguards in compliance with Chapter V of the GDPR:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong>Standard Contractual Clauses (SCCs):</strong> We utilize the European Commission&apos;s approved Standard Contractual Clauses for transfers of personal data to third countries where applicable.</li>
              <li><strong>Technical & Organizational Measures:</strong> All data in transit is protected via modern TLS 1.3 protocol, and stored data is shielded behind AES-256 encryption, role-based access controls, and strict perimeter firewalls.</li>
              <li><strong>Vendor Due Diligence:</strong> Cloud hosting infrastructure and database service providers are selected based on strict SOC 2, ISO 27001, and GDPR compliance certifications.</li>
            </ul>
          </section>

          {/* 7. Data Security & Storage */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">7. Data Security & Retention</h2>
            <p>
              We retain personal data only for as long as strictly necessary to fulfill the operational purposes for which it was gathered, including satisfying legal, accounting, or auditing requirements. When data is no longer needed, it is securely destroyed or irreversibly anonymized.
            </p>
          </section>

          {/* 8. Contact Privacy Team */}
          <section className="space-y-3 border-t border-slate-100 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">8. Contact Our Data Governance Team</h2>
            <p>
              If you have any questions, inquiries, or requests regarding this Privacy & Cookie Policy or your GDPR data rights, please reach out to our data protection team:
            </p>
            <p className="font-semibold text-[#052c65]">
              Email: <a href="mailto:info@fidaglobal.com" className="text-[#0047e1] underline">info@fidaglobal.com</a><br />
              Telephone: +94 11 710 80 20<br />
              Registered Address: No. 215 C, Raththanapitiya, Boralesgamuwa, 10290, Sri Lanka
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
