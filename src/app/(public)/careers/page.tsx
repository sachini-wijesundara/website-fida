import CareersClient from "./careers-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Careers | FIDA Global",
  description: "Join FIDA Global — build the future of enterprise technology alongside 500+ engineers across 12 countries.",
};

export default function CareersPage() {
  return (
    <main className="public-pastel-page min-h-screen">
      <CareersClient />
    </main>
  );
}
