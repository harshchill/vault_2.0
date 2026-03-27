"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import Navbar from "@/component/Navbar";

export default function UserLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicBrowseRoute = pathname === "/user/browse";

  useEffect(() => {
    if (status === "unauthenticated" && !isPublicBrowseRoute) {
      const callback = encodeURIComponent(pathname || "/user/upload");
      router.push(`/auth/login?callbackUrl=${callback}`);
    }
  }, [status, isPublicBrowseRoute, pathname, router]);

  if (status === "loading" && !isPublicBrowseRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg, #F7F0F0 0%, #eef5ec 60%, #F7F0F0 100%)" }}>
        <div className="flex items-center gap-2 text-sm" style={{ color: "#25671E" }}>
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" && !isPublicBrowseRoute) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="pt-20">
        {children}
      </div>
    </>
  );
}
