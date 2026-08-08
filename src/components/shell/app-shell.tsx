"use client";

import { Sidebar } from "@/components/shell/sidebar";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-16 sm:pb-0">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
