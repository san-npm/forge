import Link from 'next/link';
import type { ProofStripSectionProps } from '@/lib/schema';
import { getProofSnapshot, type ProofSnapshot } from '@/lib/proof';
import { ProofStripLive } from '@/components/ui/ProofStripLive';
import { Hairline } from '@/components/ui/Hairline';

/** Server Component: fetches the snapshot, then renders the SSR shell. */
export async function ProofStripSection(props: ProofStripSectionProps) {
  const snapshot = await getProofSnapshot();
  return <ProofStripShell {...props} snapshot={snapshot} />;
}

/** Pure shell — exported for testing without a live fetch. */
export function ProofStripShell({
  label,
  logos,
  snapshot,
}: ProofStripSectionProps & { snapshot: ProofSnapshot }) {
  return (
    <section data-section="proofStrip" aria-label={label} className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-widest text-text-dim">{label}</p>
        <ul role="list" className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
          {logos.map((logo) => (
            <li key={logo.slug}>
              <Link
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-dim transition-colors hover:text-hot"
              >
                {logo.name}
              </Link>
            </li>
          ))}
        </ul>
        <Hairline className="my-8" />
        {/* Live island — never blocks paint; the shell above is the crawlable proof. */}
        <ProofStripLive snapshot={snapshot} />
      </div>
    </section>
  );
}
