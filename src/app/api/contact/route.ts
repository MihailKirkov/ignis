import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formspreeUrl = process.env.FORMSPREE_URL;
  if (!formspreeUrl) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const res = await fetch(formspreeUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Submission failed' }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
