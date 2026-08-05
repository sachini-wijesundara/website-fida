import PageHero from "@/components/shared/page-hero";
import ContactClient from "./contact-client";

export const metadata = {
  title: "Contact Us | FIDA Global",
  description: "Get in touch with FIDA Global — whether you need a quote, a demo, or just have a question, we're here.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <PageHero
        badge="Let's Talk"
        badgeColor="blue"
        accent="blue"
        title={<>Start Your <span style={{ color: "var(--blue)" }} className="italic">Digital</span><br />Journey Today</>}
        subtitle="Whether you're planning a new infrastructure roll-out, need a security review, or want to see a product demo — our team is ready."
      />
      <ContactClient />
    </main>
  );
}
