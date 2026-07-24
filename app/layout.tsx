import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Occasion Copilot — Swiggy MCP AI Agent',
  description: 'Plan your entire evening in one conversation — restaurant reservations + food delivery, coordinated across Swiggy Food and Dineout MCP servers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Inter', 'Sora', system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
