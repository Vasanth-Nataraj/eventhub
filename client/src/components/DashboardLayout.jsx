import React from 'react';

export default function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Stripe-inspired atmospheric ambient mesh (completely static, zero lag) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-indigo-100/40 via-purple-100/30 to-emerald-100/40 blur-3xl opacity-70" />

      {/* Structured Notion-Style Content Canvas */}
      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {children}
      </div>
    </div>
  );
}