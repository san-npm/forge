import { SITE_URL } from '@/lib/site-config';

/**
 * A2A Agent Card (Agent2Agent Protocol, v0.3.0).
 *
 * The card is the manifest an A2A client fetches first, at
 * `/.well-known/agent-card.json`, to discover this agent's identity, endpoint,
 * transport, capabilities, and skills before sending any task. The `url` MUST
 * point at a live A2A JSON-RPC endpoint (our `/api/a2a` route), not a marketing
 * page. Spec: https://a2a-protocol.org/v0.3.0/specification/
 *
 * One builder, two consumers: the `/.well-known/agent-card.json` route and a
 * GET to `/api/a2a` both return this object, so the card never drifts.
 */
export function buildAgentCard() {
  const base = SITE_URL;
  return {
    protocolVersion: '0.3.0',
    name: 'Openletz Studio Agent',
    description:
      'Conversational agent for Openletz, a Luxembourg AI agency. Answers questions about Openletz services (AI agents and automation, websites, digital growth, Web3 when it helps) and produces indicative SME Package funding estimates (70% Luxembourg state co-funding) for eligible companies.',
    url: `${base}/api/a2a`,
    preferredTransport: 'JSONRPC',
    version: '1.0.0',
    provider: {
      organization: 'Commit Media S.à r.l.',
      url: base,
    },
    iconUrl: `${base}/icon-512.png`,
    documentationUrl: `${base}/.well-known/openapi.yaml`,
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ['text/plain'],
    defaultOutputModes: ['text/plain', 'application/json'],
    skills: [
      {
        id: 'answer-services',
        name: 'Answer questions about Openletz services',
        description:
          "Explains Openletz's offering (AI agents, automations, websites, digital growth, Web3) and helps a visitor scope a project enquiry.",
        tags: ['services', 'ai-agents', 'automation', 'websites', 'luxembourg'],
        examples: [
          'What does Openletz build?',
          'Can you automate my customer support with an AI agent?',
          'Do you build multilingual websites?',
        ],
        inputModes: ['text/plain'],
        outputModes: ['text/plain'],
      },
      {
        id: 'estimate-sme-funding',
        name: 'Estimate SME Package funding',
        description:
          'Produces an indicative SME Package co-funding estimate (70% of eligible costs, eligible band EUR 3k-25k) for a Luxembourg SME, given a project budget. Estimates are indicative only, subject to eligibility and Ministry of the Economy / Luxinnovation approval, and reimbursed after delivery.',
        tags: ['funding', 'sme-package', 'grant-estimate', 'luxembourg'],
        examples: [
          'Estimate the SME Package funding for a 12000 EUR website project.',
          'Is my company eligible for the 70% SME Package co-funding?',
        ],
        inputModes: ['text/plain', 'application/json'],
        outputModes: ['application/json', 'text/plain'],
      },
    ],
    supportsAuthenticatedExtendedCard: false,
  } as const;
}

export type AgentCard = ReturnType<typeof buildAgentCard>;
