import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 997,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #120606 50%, #1a0606 100%)',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 96px',
        }}
      >
        {/* Radial glow — upper right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,107,44,0.30) 0%, rgba(255,107,44,0.10) 40%, transparent 70%)',
          }}
        />

        {/* Secondary ambient glow — left */}
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: 60,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,107,44,0.08) 0%, transparent 70%)',
          }}
        />

        {/* Wordmark: IGNIS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Flame icon placeholder — orange block accent */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#ff6b2c',
                boxShadow: '0 0 12px rgba(255,107,44,0.8)',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#8e8ea8',
              }}
            >
              WEB DEVELOPMENT STUDIO
            </span>
          </div>

          {/* IGNIS wordmark with gradient */}
          <div
            style={{
              fontSize: 128,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #ff6b2c 0%, #ff8a50 40%, #ffb347 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            IGNIS
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: '#6a6a84',
              letterSpacing: '0.01em',
              marginTop: 4,
            }}
          >
            Fast websites & web apps for European businesses
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, #ff6b2c 30%, #ffb347 60%, transparent 100%)',
          }}
        />

        {/* Domain — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 64,
            fontSize: 18,
            color: '#4a4a62',
            letterSpacing: '0.04em',
          }}
        >
          ignis-mls.com
        </div>
      </div>
    ),
    {
      width: 997,
      height: 630,
    }
  );
}
