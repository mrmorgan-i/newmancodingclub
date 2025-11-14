'use client';

import Link from 'next/link';
import Container from '@/components/Container';

const resourceGuides = [
  {
    title: 'AI Tool Finder',
    description: 'Curated list of free and student-friendly AI tools broken down by major with prompts and example use cases.',
    href: '/resources/ai-tools',
    badge: 'New',
    tags: ['Guide', 'AI', 'Student tools'],
  },
];

export default function ResourcesIndexPage() {
  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-b from-slate-100 to-white">
        <Container className="py-20 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Resources</p>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold manrope text-foreground">
            Guides & toolkits built by Newman Coding Club
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Browse helpful references for club members and the broader Newman community. We&apos;ll keep
            adding guides as we build them, including AI tools, study tips, event prep, and more.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-6">
          {resourceGuides.map((guide) => (
            <article
              key={guide.href}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/20"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {guide.badge}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">
                    {guide.title}
                  </h2>
                  <p className="mt-3 text-base text-slate-600">{guide.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={guide.href}
                  className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-accent"
                >
                  Open guide
                </Link>
              </div>
            </article>
          ))}

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-center text-slate-500">
            More resources are coming soon. Let us know what you&apos;d like to see at the next meeting or whenever you see an exec!
          </div>
        </Container>
      </section>
    </div>
  );
}
