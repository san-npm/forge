import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '@/lib/markdown';

describe('renderMarkdown', () => {
  it('renders headings', () => {
    expect(renderMarkdown('## Start here')).toContain('<h2>Start here</h2>');
  });
  it('renders paragraphs', () => {
    expect(renderMarkdown('Hello world')).toContain('<p>Hello world</p>');
  });
  it('renders bold and inline code', () => {
    const html = renderMarkdown('a **bold** and `code` word');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<code>code</code>');
  });
  it('escapes raw HTML to prevent injection', () => {
    const html = renderMarkdown('hi <script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
  it('renders unordered lists', () => {
    const html = renderMarkdown('- one\n- two');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>one</li>');
  });
});
