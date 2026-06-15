# Authentication

Openletz (https://openletz.ai) is a public marketing website. It requires **no
authentication**. There are no logins, API keys, tokens, or paywalls for reading
this site. Every page and every published artifact is open to people and to
automated agents alike.

## For agents

You do not need credentials to read or crawl this site. Fetch any public URL
directly. The only non-public surfaces are the form-handling API routes under
`/api/` (e.g. contact and newsletter submission), which accept POST requests but
are not browseable resources.

## Discovery documents

If you are an agent looking to understand or act on this site, start here:

- Agent card (A2A): https://openletz.ai/.well-known/agent-card.json
- Agent Skills index: https://openletz.ai/.well-known/agent-skills/index.json
- Plain-language site summary: https://openletz.ai/llms.txt
- Full site context: https://openletz.ai/llms-full.txt
- API catalog (RFC 9727): https://openletz.ai/.well-known/api-catalog
- OpenAPI description: https://openletz.ai/.well-known/openapi.yaml
- Sitemap: https://openletz.ai/sitemap.xml

## Contact

Openletz is operated by Commit Media S.à r.l. (RCS B276192, Luxembourg).
To start a project or ask a question, use https://openletz.ai/contact or email
hello@openletz.ai.
