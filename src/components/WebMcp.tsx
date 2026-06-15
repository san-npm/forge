'use client';

import { useEffect } from 'react';
import { computeSmePackage, SME_MIN, SME_MAX } from '@/lib/sme-package';
import { SITE_URL } from '@/lib/site-config';

/**
 * WebMCP tool registration (W3C Web ML Community Group, webmachinelearning/webmcp).
 *
 * Registers honest, read-only tools on `document.modelContext` after mount so an
 * in-page agent can call them. WebMCP is a runtime JS API (no static artifact):
 * a scanner detects tools by reading `document.modelContext` after the page's JS
 * runs. The API is [SecureContext]-gated (HTTPS only) and absent on older
 * browsers, so we feature-detect with `'modelContext' in document`. Renders null.
 *
 * Tools are unregistered by aborting the shared AbortController on unmount
 * (there is no unregisterTool() in the current spec).
 */

interface ToolResult {
  content: { type: 'text'; text: string }[];
}

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema?: object;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
}

interface ModelContext {
  registerTool: (
    tool: ModelContextTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void>;
}

function text(t: string): ToolResult {
  return { content: [{ type: 'text', text: t }] };
}

/** Exported for unit testing the tool math without a DOM. */
export function estimateSmeFundingText(rawBudget: unknown): string {
  const budget = Number(rawBudget);
  if (!Number.isFinite(budget) || budget <= 0) {
    return 'Please provide a positive project budget in EUR (e.g. 20000).';
  }
  const { eligible, grant, net, clamped } = computeSmePackage(budget);
  const note = clamped
    ? ` Your figure (EUR ${budget.toLocaleString('en')}) is outside the eligible band of EUR ${SME_MIN.toLocaleString('en')}-${SME_MAX.toLocaleString('en')}, so this uses EUR ${eligible.toLocaleString('en')}.`
    : '';
  return (
    `For an eligible project cost of EUR ${eligible.toLocaleString('en')}, the indicative ` +
    `SME Package grant is EUR ${grant.toLocaleString('en')} (70%), leaving your contribution at ` +
    `EUR ${net.toLocaleString('en')} (30%).${note} Indicative only: subject to SME eligibility and ` +
    `Ministry of the Economy approval, reimbursed after delivery. ${SITE_URL}/sme-package`
  );
}

export function WebMcp() {
  useEffect(() => {
    // WebMCP may be exposed on `document` (W3C standards track) or `navigator`
    // (the MCP-B polyfill surface); accept either so a scanner detects the tools
    // whichever surface it provides.
    const modelContext =
      (document as unknown as { modelContext?: ModelContext }).modelContext ??
      (typeof navigator !== 'undefined'
        ? (navigator as unknown as { modelContext?: ModelContext }).modelContext
        : undefined);
    if (!modelContext || typeof modelContext.registerTool !== 'function') return;
    const controller = new AbortController();

    void modelContext.registerTool(
      {
        name: 'estimate_sme_funding',
        description:
          'Estimate the indicative Luxembourg SME Package grant for an eligible ' +
          'digital or AI project. Openletz projects can qualify for a 70% grant on ' +
          'eligible costs (band EUR 3,000-25,000). Pass the project budget in EUR; ' +
          'returns the indicative grant, the company contribution, and caveats.',
        inputSchema: {
          type: 'object',
          properties: {
            budget: {
              type: 'number',
              description: 'Total eligible project budget in EUR (e.g. 20000)',
            },
          },
          required: ['budget'],
        },
        annotations: { readOnlyHint: true },
        execute({ budget }) {
          return text(estimateSmeFundingText(budget));
        },
      },
      { signal: controller.signal },
    );

    void modelContext.registerTool(
      {
        name: 'get_services',
        description:
          'Return a short overview of what Openletz, a Luxembourg AI agency, ' +
          'offers: AI agents and automation, websites and shops, digital growth, ' +
          'and Web3 when it helps.',
        annotations: { readOnlyHint: true },
        execute() {
          return text(
            'Openletz (Commit Media S.à r.l., Luxembourg) builds: AI agents and ' +
              'automation (the front door); websites and shops; digital growth (SEO/AEO/' +
              'analytics); and Web3 when it genuinely helps. Hosted in Europe, built with ' +
              `GDPR and the EU AI Act in mind. More: ${SITE_URL}.`,
          );
        },
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, []);

  return null;
}
