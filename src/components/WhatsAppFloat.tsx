"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "@/lib/constants";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand-terracotta text-brand-cream shadow-[0_10px_30px_-12px_rgba(232,92,58,0.6)] transition-all duration-500 wa-pulse",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.172-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.004 2C6.481 2 2 6.48 2 11.994c0 2.096.547 4.142 1.588 5.945L2 22l4.2-1.557a9.936 9.936 0 0 0 5.79 1.785h.005c5.522 0 10.003-4.48 10.003-9.995 0-2.67-1.04-5.182-2.93-7.07A9.91 9.91 0 0 0 12.004 2zm0 18.179h-.004a8.3 8.3 0 0 1-4.227-1.157l-.303-.18-3.132 1.16.168-3.055-.197-.314a8.26 8.26 0 0 1-1.284-4.439c0-4.571 3.722-8.292 8.299-8.292 2.216 0 4.298.863 5.867 2.431a8.262 8.262 0 0 1 2.433 5.864c0 4.572-3.721 8.292-8.62 8.292z" />
      </svg>
    </a>
  );
}
