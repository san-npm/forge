'use client';

import { useEffect } from 'react';

// Registers tool definitions via the WebMCP API (navigator.modelContext) so
// in-browser AI agents can invoke OpenLetz actions without scraping the UI.
// Spec: https://webmachinelearning.github.io/webmcp/

type ModelContext = {
  provideContext: (opts: { tools: WebMcpTool[] }) => void | Promise<void>;
};

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<{ content: string }>;
};

export default function WebMcpTools() {
  useEffect(() => {
    const nav = typeof navigator === 'undefined' ? null : navigator;
    const ctx = (nav as unknown as { modelContext?: ModelContext } | null)?.modelContext;
    if (!ctx?.provideContext) return;

    const tools: WebMcpTool[] = [
      {
        name: 'openletz_start_quiz',
        description:
          'Open the OpenLetz eligibility quiz for Luxembourg public grants (digital & AI funding for SMEs). Six questions, ~30 seconds.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        execute: async () => {
          const url = '/';
          if (window.location.pathname !== url) window.location.href = url;
          return { content: 'Quiz page loaded. Answer the six questions to get eligible programs.' };
        },
      },
      {
        name: 'openletz_subscribe_newsletter',
        description:
          'Subscribe an email address to the OpenLetz newsletter (new Luxembourg grant programs, deadlines).',
        inputSchema: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
            lang: { type: 'string', enum: ['fr', 'en', 'lb', 'de', 'it', 'pt'] },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          });
          if (!res.ok) {
            return { content: `Subscription failed: HTTP ${res.status}` };
          }
          return { content: 'Subscribed. Confirmation email is on its way.' };
        },
      },
    ];

    void ctx.provideContext({ tools });
  }, []);

  return null;
}
