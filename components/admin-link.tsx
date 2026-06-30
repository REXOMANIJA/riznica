"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { BookMarked } from "lucide-react";

export function AdminLink() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
    });
  }, []);

  if (!loggedIn) return null;

  return (
    <Link
      href="/rex/panel"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 group"
      style={{
        background: "linear-gradient(135deg, rgba(28,18,8,0.96), rgba(18,10,4,0.96))",
        border: "1px solid rgba(200,148,90,0.38)",
        color: "rgba(200,148,90,0.88)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,148,90,0.08)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <BookMarked className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-6" />
      <span style={{ letterSpacing: "0.04em" }}>Admin Panel</span>
    </Link>
  );
}
