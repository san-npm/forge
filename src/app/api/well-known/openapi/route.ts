import { NextResponse } from 'next/server';

const SPEC = `openapi: 3.1.0
info:
  title: OpenLetz Public API
  version: 1.0.0
  description: >-
    Public endpoints for the OpenLetz Luxembourg SME grants simulator.
    Content-negotiable: send 'Accept: text/markdown' on any /:locale/... page
    to get a markdown rendering of that HTML page.
  contact:
    name: OpenLetz
    url: https://www.openletz.com/en/contact
  license:
    name: All rights reserved
servers:
  - url: https://www.openletz.com
paths:
  /api/blog:
    get:
      summary: List blog posts
      description: Returns every MDX blog post with multilingual frontmatter.
      responses:
        '200':
          description: Blog index
          content:
            application/json:
              schema:
                type: object
                properties:
                  posts:
                    type: array
                    items: { type: object }
  /api/newsletter:
    post:
      summary: Subscribe to the newsletter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email]
              properties:
                email: { type: string, format: email }
                lang: { type: string, enum: [fr, en, lb, de, it, pt] }
      responses:
        '200': { description: Subscribed }
        '400': { description: Invalid payload }
        '429': { description: Rate limited }
  /api/contact:
    post:
      summary: Submit the contact form
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, email, message]
              properties:
                name: { type: string }
                email: { type: string, format: email }
                company: { type: string }
                message: { type: string }
                lang: { type: string, enum: [fr, en, lb, de, it, pt] }
      responses:
        '200': { description: Received }
        '400': { description: Invalid payload }
        '429': { description: Rate limited }
`;

export async function GET() {
  return new NextResponse(SPEC, {
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
