import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageTransition from "@/components/animations/page-transition";
import ChatBot from "@/components/chatbot/chat-bot";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-theme min-h-screen">
      {/* Persistent navigation */}
      <Navbar />

      {/* Page content wrapped in the cinematic page transition */}
      <PageTransition>{children}</PageTransition>

      {/* Persistent footer */}
      <Footer />

      {/* Floating chat widget */}
      <ChatBot />
    </div>
  );
}
