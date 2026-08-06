import ContactClient from "./contact-client";

export const metadata = {
  title: "Contact Us | FIDA Global",
  description:
    "Connect with our team of global enterprise consultants to unlock your company's full potential in the digital-first economy.",
};

export default function ContactPage() {
  return (
    <main className="contact-page min-h-screen">
      <ContactClient />
    </main>
  );
}
