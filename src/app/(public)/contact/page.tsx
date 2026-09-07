import ContactClient from "./contact-client";

export const metadata = {
  title: "Contact FIDA Global | Colombo, Sri Lanka",
  description: "Get in touch with FIDA Global's Colombo office for HRIS, payroll, CRM, and IT consultancy inquiries. Call, email, or request a demo today.",
  keywords: "FIDA Global contact, FIDA Global Colombo office, book IT consultation Sri Lanka, request HR software demo",
};

export default function ContactPage() {
  return (
    <main className="contact-page public-pastel-page min-h-screen">
      <ContactClient />
    </main>
  );
}
