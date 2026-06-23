import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const MAX_REQUESTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

const contactSchema = z.object({
  service: z.enum(['landing', 'business', 'webapp']),
  description: z.string().trim().min(1).max(5000),
  budget: z.enum(['b500', 'b1k', 'b3k', 'b8k']),
  timeline: z.enum(['asap', '1to2', '3to6', 'flex']),
  name: z.string().trim().min(1).max(100),
  email: z.email().max(200),
  company: z.string().trim().max(200).optional(),
  privacy_consent: z.string().trim().min(1),
  // Honeypot — real users never see or fill this.
  website: z.string().optional(),
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(req: NextRequest) {
  const formspreeUrl = process.env.FORMSPREE_URL;
  if (!formspreeUrl) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const ip = getClientIp(req);
  const limit = rateLimit(`contact:${ip}`, MAX_REQUESTS, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
  }

  // Honeypot tripped — silently accept so bots get no signal, but don't forward.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const payload: Record<string, unknown> = { ...parsed.data };
  delete payload.website;

  const res = await fetch(formspreeUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Submission failed' }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
