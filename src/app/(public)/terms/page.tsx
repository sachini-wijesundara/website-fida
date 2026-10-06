import React from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { getDbConnection, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Terms & Conditions | FIDA Global",
  description: "Read FIDA Global's Terms & Conditions governing the use of our website, IT consultancy services, and enterprise software solutions.",
};

const fallbackSections = [
  {
    id: 1,
    title: "1. Acceptance of Terms",
    content: "<p>By accessing or using the website of <strong>FIDA Global (Private) Ltd</strong> (\"FIDA Global\", \"we\", \"us\", or \"our\"), including any associated enterprise software platforms (such as Smart HRIS), technical portals, or consultancy services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue your use of our website and services immediately.</p>"
  },
  {
    id: 2,
    title: "2. Scope of Services & Access License",
    content: "<p>FIDA Global provides enterprise IT consulting, custom software engineering, infrastructure support, and SaaS products. We grant users a limited, non-exclusive, non-transferable, and revocable license to access our public website for informational, evaluation, and business communication purposes.</p><p>Access to proprietary SaaS modules, including Smart HRIS, is further governed by specific Master Service Agreements (MSAs) and Service Level Agreements (SLAs) executed between FIDA Global and client organizations.</p>"
  },
  {
    id: 3,
    title: "3. Intellectual Property Rights",
    content: "<p>All content on this website, including but not limited to technical articles, architectural frameworks, logos, branding, graphics, source code, and design assets, is the exclusive intellectual property of <strong>FIDA Global (Private) Ltd</strong> or its licensors and is protected under national and international copyright, trademark, and intellectual property laws.</p>"
  },
  {
    id: 4,
    title: "4. User Conduct & Acceptable Use",
    content: "<p>You agree not to engage in any of the following prohibited activities:</p><ul><li>Attempting to bypass security systems, probe infrastructure vulnerabilities, or gain unauthorized access to servers, databases, or accounts.</li><li>Using automated scraping, crawling, or data extraction utilities without prior written authorization from FIDA Global.</li><li>Transmitting unsolicited advertising, spam, or malicious software (such as viruses or Trojans).</li><li>Using our platforms in any manner that infringes upon the rights of others or violates applicable laws and regulations.</li></ul>"
  },
  {
    id: 5,
    title: "5. Disclaimer & Limitation of Liability",
    content: "<p>While we strive to ensure that all information and services provided on this website are accurate and up to date, the website is offered on an \"as is\" and \"as available\" basis without warranties of any kind.</p><p>To the fullest extent permitted by law, FIDA Global shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or inability to use this website.</p>"
  },
  {
    id: 6,
    title: "6. Privacy & Data Protection",
    content: "<p>Your privacy is of utmost importance to us. Our data handling procedures, cookie practices, and GDPR compliance policies are detailed in our <a href=\"/privacy\" class=\"text-[#0047e1] underline font-medium hover:text-[#0037b0]\">Privacy & Cookie Policy</a>, which forms an integral part of these Terms of Service.</p>"
  },
  {
    id: 7,
    title: "7. Governing Law & Jurisdiction",
    content: "<p>These Terms of Service are governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law principles. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Sri Lanka, unless otherwise stipulated in a signed enterprise contract.</p>"
  },
  {
    id: 8,
    title: "8. Enterprise Inquiries & Contact",
    content: "<p>For legal inquiries, enterprise compliance questions, or contractual terms related to FIDA Global services, please contact our legal and administrative team directly at <strong>info@fidaglobal.com</strong> or phone <strong>+94 11 710 80 20</strong>.</p>"
  }
];

async function getPublishedTerms() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request()
      .input("All", 0)
      .execute("sp_GetAllTerms");

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset;
    }
  } catch (error) {
    console.error("Failed to fetch published terms for public page via SP:", error);
  }
  return fallbackSections;
}

export default async function TermsOfServicePage() {
  const sections = await getPublishedTerms();

  return (
    <main className="public-pastel-page min-h-screen pt-36 pb-28">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0047e1] text-xs font-bold uppercase tracking-wider mb-5">
            <Scale size={14} /> Legal Terms & Agreements
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#052c65] tracking-tight leading-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm sm:text-base text-slate-500">
            Last updated: October 2026 · Governing all enterprise services, software platforms, and website access.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#052c65]/10 shadow-[0_20px_50px_rgba(5,44,101,0.06)] p-5 sm:p-12 space-y-8 sm:space-y-10 text-slate-600 text-sm sm:text-base leading-relaxed">
          {sections.map((section: any, idx: number) => (
            <section
              key={section.id || idx}
              className={`space-y-3 ${idx > 0 ? "pt-6 border-t border-slate-100" : ""}`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#052c65]">
                {section.title}
              </h2>
              <div
                className="terms-rich-content text-slate-600 space-y-3"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>
      </div>

      <style>{`
        .terms-rich-content p {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }
        .terms-rich-content strong {
          color: #052c65;
          font-weight: 700;
        }
        .terms-rich-content u {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .terms-rich-content em {
          font-style: italic;
        }
        .terms-rich-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .terms-rich-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .terms-rich-content li {
          line-height: 1.6;
        }
        .terms-rich-content a {
          color: #0047e1;
          text-decoration: underline;
        }
        .terms-rich-content a:hover {
          color: #0037b0;
        }
        .terms-rich-content h1, .terms-rich-content h2, .terms-rich-content h3 {
          color: #052c65;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </main>
  );
}
