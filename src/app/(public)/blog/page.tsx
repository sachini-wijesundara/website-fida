import BlogClient from "./blog-client";

export const metadata = {
  title: "Blog & Insights | FIDA Global",
  description: "Insights, deep dives, and expert commentary from the FIDA Global technology team.",
};

export default function BlogPage() {
  return (
    <main className="public-pastel-page min-h-screen">
      <BlogClient />
    </main>
  );
}
