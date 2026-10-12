"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function InquiriesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/customer-leads");
  }, [router]);

  return (
    <div className="h-64 flex flex-col items-center justify-center gap-3 text-[#0047e1]">
      <Loader2 className="animate-spin" size={32} />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Redirecting to Customer Leads...
      </p>
    </div>
  );
}
