'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LegalPageProps {
  content: string;
}

export function LegalPage({ content }: LegalPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div ref={containerRef}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-text mb-6 leading-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="font-display text-xl lg:text-2xl font-semibold text-text mt-12 mb-4 leading-snug">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-display text-lg font-semibold text-text mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-text-secondary leading-relaxed mb-4">
                  {children}
                </p>
              ),
              em: ({ children }) => (
                <em className="text-text-secondary italic">{children}</em>
              ),
              strong: ({ children }) => (
                <strong className="text-text font-semibold">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-ignis hover:text-ignis-bright underline underline-offset-4 transition-colors duration-200"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="text-text-secondary mb-4 ml-6 space-y-2 list-disc marker:text-ignis">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-text-secondary mb-4 ml-6 space-y-2 list-decimal marker:text-ignis">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed pl-1">{children}</li>
              ),
              hr: () => (
                <hr className="border-border my-10" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-ignis pl-4 my-4 text-text-secondary italic">
                  {children}
                </blockquote>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
