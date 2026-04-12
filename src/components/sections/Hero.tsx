'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────── Fire color ramp ─────────────────────────────
   8 stops:  near-black ember → deep red → orange → bright gold
   ────────────────────────────────────────────────────────────────────── */
const FIRE_COLORS = [
  new THREE.Color('#5a0400'),  // 0  near-black ember
  new THREE.Color('#aa1000'),  // 1  deep red
  new THREE.Color('#dd2200'),  // 2  red
  new THREE.Color('#ff4400'),  // 3  orange-red
  new THREE.Color('#ff6b2c'),  // 4  ignis orange
  new THREE.Color('#ff8c42'),  // 5  bright orange
  new THREE.Color('#ffb347'),  // 6  ember gold
  new THREE.Color('#ffd060'),  // 7  bright gold
] as const;

function fireColor(t: number): THREE.Color {
  const c = Math.max(0, Math.min(1, t)) * (FIRE_COLORS.length - 1);
  const i = Math.min(Math.floor(c), FIRE_COLORS.length - 2);
  return new THREE.Color().lerpColors(FIRE_COLORS[i], FIRE_COLORS[i + 1], c - i);
}

/* ─────────────────────────── Particle type ───────────────────────────── */

interface Particle {
  spawnX:   number;   // world-space X at birth (fire centre + layer spread)
  z:        number;   // depth jitter for slight parallax feel
  vspeed:   number;   // rise speed (relative to column height per lifetime)
  life:     number;   // seconds alive
  maxLife:  number;   // lifetime in seconds
  baseSize: number;   // CSS-pixel size at birth
  phase:    number;   // unique turbulence phase
  layer:    0 | 1 | 2; // 0=core, 1=inner, 2=outer
}

/* Per-layer constants ─────────────────────────────────────────────────── */
//                          core   inner  outer
const L_ALPHA  = [0.90,  0.68,  0.38] as const; // max opacity
const L_SPEED  = [1.55,  1.00,  0.58] as const; // rise speed multiplier
const L_SPREAD = [0.10,  0.38,  0.80] as const; // fraction of halfWidth used at spawn

function spawnParticle(layer: 0 | 1 | 2, centreX: number, halfW: number): Particle {
  return {
    spawnX:   centreX + (Math.random() - 0.5) * 2 * L_SPREAD[layer] * halfW,
    z:        (Math.random() - 0.5) * 90,
    vspeed:   L_SPEED[layer] * (0.72 + Math.random() * 0.56),
    life:     0,
    maxLife:  1.6 + Math.random() * 2.4,
    baseSize: (2.8 + Math.random() * 5.2) * (layer === 0 ? 1.45 : layer === 1 ? 1.0 : 0.62),
    phase:    Math.random() * Math.PI * 2,
    layer,
  };
}

/* ─────────────────────────── Fire geometry helpers ──────────────────── */

const isDesktop  = (cw: number) => cw >= 900;
// fire column anchored right-of-centre on desktop, centred on mobile
const fireCentreX = (cw: number) => isDesktop(cw) ? cw * 0.185 : 0;
const fireBaseY   = (ch: number) => -(ch * 0.5) - 20;
const fireColH    = (cw: number, ch: number) => isDesktop(cw) ? ch * 0.88 : ch * 0.70;
const fireHalfW   = (cw: number) => isDesktop(cw) ? Math.min(cw * 0.125, 148) : cw * 0.29;

/* ────────────────────────────── Component ────────────────────────────── */

export default function Hero() {
  const t = useTranslations('hero');

  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const sectionRef   = useRef<HTMLElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  /** Normalised [0,1] mouse position */
  const mouseRef     = useRef({ nx: 0.5, ny: 0.5 });
  /** Smoothed lean offset applied to particle positions */
  const leanRef      = useRef({ x: 0, y: 0 });

  /* ── Three.js fire system ─────────────────────────────────────────── */
  const setupThree = useCallback((canvas: HTMLCanvasElement) => {

    const w0    = canvas.clientWidth;
    const h0    = canvas.clientHeight;
    const COUNT = w0 < 900 ? 1600 : 3200;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w0, h0, false);
    renderer.setClearColor(0x000000, 0);
    const DPR = renderer.getPixelRatio();

    /* Scene / camera (orthographic: world units = CSS pixels) */
    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-w0/2, w0/2, h0/2, -h0/2, 0.1, 1000);
    camera.position.z = 200;

    /* Geometry attributes */
    const posBuf  = new Float32Array(COUNT * 3);
    const colBuf  = new Float32Array(COUNT * 3);
    const sizeBuf = new Float32Array(COUNT);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',      new THREE.BufferAttribute(posBuf,  3));
    geo.setAttribute('particleColor', new THREE.BufferAttribute(colBuf,  3));
    geo.setAttribute('size',          new THREE.BufferAttribute(sizeBuf, 1));

    /* Double-gaussian shader — bright core with soft halo */
    const mat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: /* glsl */`
        attribute float size;
        attribute vec3  particleColor;
        varying   vec3  vColor;
        void main() {
          vColor = particleColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size;
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec3 vColor;
        void main() {
          vec2  uv   = gl_PointCoord - 0.5;
          float d    = length(uv);
          if (d > 0.5) discard;
          float core = exp(-d * d * 28.0);
          float halo = exp(-d * d *  5.5);
          float a    = core * 0.78 + halo * 0.22;
          gl_FragColor = vec4(vColor * a, a);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      vertexColors: true,
    });

    scene.add(new THREE.Points(geo, mat));

    /* Build particle array — 30 % core | 50 % inner | 20 % outer */
    const cx0 = fireCentreX(w0), hw0 = fireHalfW(w0);
    const by0  = fireBaseY(h0),  ch0  = fireColH(w0, h0);

    const particles: Particle[] = Array.from({ length: COUNT }, (_, i) => {
      const layer: 0 | 1 | 2 = i < COUNT * 0.30 ? 0 : i < COUNT * 0.80 ? 1 : 2;
      const p = spawnParticle(layer, cx0, hw0);
      // Pre-seed life so the fire column appears full on frame 1
      p.life = Math.random() * p.maxLife;
      // Approximate start position (no turbulence yet, just straight up)
      const ar = p.life / p.maxLife;
      posBuf[i * 3]     = p.spawnX;
      posBuf[i * 3 + 1] = by0 + ar * ch0 * p.vspeed;
      posBuf[i * 3 + 2] = p.z;
      return p;
    });

    /* ── Animation loop ─────────────────────────────────────────────── */
    let lastTime = performance.now();
    let prevCw   = w0;
    let prevCh   = h0;

    const posAttr  = geo.attributes.position      as THREE.BufferAttribute;
    const colAttr  = geo.attributes.particleColor as THREE.BufferAttribute;
    const sizeAttr = geo.attributes.size          as THREE.BufferAttribute;

    function tick(now: number) {
      animFrameRef.current = requestAnimationFrame(tick);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      /* Handle canvas resize */
      if (cw !== prevCw || ch !== prevCh) {
        prevCw = cw; prevCh = ch;
        renderer.setSize(cw, ch, false);
        camera.left   = -cw / 2;  camera.right  =  cw / 2;
        camera.top    =  ch / 2;  camera.bottom = -ch / 2;
        camera.updateProjectionMatrix();
      }

      const cx   = fireCentreX(cw);
      const by   = fireBaseY(ch);
      const colH = fireColH(cw, ch);
      const hw   = fireHalfW(cw);

      /* Smooth lean: fire leans toward cursor position */
      const isD   = isDesktop(cw);
      const tLX   = (mouseRef.current.nx - 0.5) * (isD ? 88 : 42);
      const tLY   = -(mouseRef.current.ny - 0.5) * 20;
      leanRef.current.x += (tLX - leanRef.current.x) * 0.036;
      leanRef.current.y += (tLY - leanRef.current.y) * 0.028;

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.life += dt;

        /* Respawn when lifetime is exhausted */
        if (p.life >= p.maxLife) {
          const np = spawnParticle(p.layer, cx, hw);
          particles[i] = np;
          colAttr.setXYZ(i, 0, 0, 0);   // zero colour so no flash
          sizeAttr.setX(i, 0);
          continue;
        }

        const ar = p.life / p.maxLife;  // age ratio  0 → 1

        /* ── Turbulence (3 layered frequencies)
              amplitude DECREASES toward the tip to create a converging column
              outer layer has the widest spread (creates the diffuse base) ── */
        const convergence = 1.0 - ar * 0.45;
        const turbAmp     = hw * (0.18 + p.layer * 0.28) * convergence;
        const turbX =
          Math.sin(p.phase        + p.life * 2.55) * turbAmp * 0.56 +
          Math.sin(p.phase * 2.31 + p.life * 1.18) * turbAmp * 0.29 +
          Math.sin(p.phase * 0.74 + p.life * 4.95) * turbAmp * 0.15;

        /* ── Position
              y rises proportionally to age — simple and fast, looks right with turbulence ── */
        const px = p.spawnX + turbX;
        const py = by + ar * colH * p.vspeed;

        /* ── Lean: tips deflect more than base (height factor) ── */
        const hf = Math.max(0, Math.min(1, (py - by) / colH));
        const lx = leanRef.current.x * hf;
        const ly = leanRef.current.y * hf;

        /* ── Alpha envelope: sharp fade-in at birth, gradual fade-out at death ── */
        const fadeIn  = Math.min(1, ar / 0.10);
        const fadeOut = ar > 0.60 ? Math.max(0, 1 - (ar - 0.60) / 0.40) : 1;
        const alpha   = fadeIn * fadeOut * L_ALPHA[p.layer];

        /* ── Colour: core skips near-black phase — goes warm-orange immediately ── */
        const colorT = p.layer === 0
          ? Math.min(ar * 0.72 + 0.20, 1)
          : ar * 0.94;
        const c = fireColor(colorT);

        /* ── Size: large at base, shrinks and fades toward tip ── */
        const sz = p.baseSize * (1 - ar * 0.58) * Math.min(1, fadeIn * 2.8);

        posAttr.setXYZ(i,  px + lx,  py + ly,  p.z);
        colAttr.setXYZ(i,  c.r * alpha,  c.g * alpha,  c.b * alpha);
        sizeAttr.setX(i,   Math.max(0.4, sz) * DPR);  // DPR converts CSS→device px
      }

      posAttr.needsUpdate  = true;
      colAttr.needsUpdate  = true;
      sizeAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  /* ── Mount / unmount ─────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = setupThree(canvas);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        nx: e.clientX / window.innerWidth,
        ny: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cleanup();
      window.removeEventListener('mousemove', onMove);
    };
  }, [setupThree]);

  /* ── GSAP text reveal + scroll parallax ─────────────────────────── */
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('[data-gsap="badge"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .fromTo('[data-gsap="headline"]',
          { opacity: 0, y: 40, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12 },
          '-=0.3')
        .fromTo('[data-gsap="sub"]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.4')
        .fromTo('[data-gsap="cta"]',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 },
          '-=0.4')
        .fromTo('[data-gsap="stats"]',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
          '-=0.3');

      gsap.to('[data-gsap="hero-content"]', {
        y: -80,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end:   'bottom top',
          scrub: true,
        },
      });
    }, content);

    return () => ctx.revert();
  }, []);

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Three.js canvas — covers the full section */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Radial gradient overlay — adds depth and warmth at base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,107,44,0.12) 0%, transparent 70%),' +
            'radial-gradient(ellipse 60% 40% at 30% 60%, rgba(255,61,0,0.06) 0%, transparent 60%)',
          zIndex: 1,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,107,44,0.03) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,107,44,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-24"
      >
        <div data-gsap="hero-content" className="max-w-4xl">

          {/* Badge */}
          <div data-gsap="badge" className="inline-flex items-center gap-2.5 mb-8">
            <span className="flex items-center justify-center w-1.5 h-1.5 rounded-full bg-ignis" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-text-secondary">
              {t('badge')}
            </span>
            <span className="flex-1 w-16 h-px bg-gradient-to-r from-ignis/50 to-transparent" />
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold leading-[1.0] tracking-tight mb-7 overflow-hidden">
            <span
              data-gsap="headline"
              className="block text-[clamp(3.5rem,8vw,7rem)] text-text"
            >
              {t('headline1')}
            </span>
            <span
              data-gsap="headline"
              className="block text-[clamp(3.5rem,8vw,7rem)] text-gradient-fire"
            >
              {t('headline2')}
            </span>
          </h1>

          {/* Subheadline */}
          <p
            data-gsap="sub"
            className="text-lg lg:text-xl text-text-secondary max-w-xl leading-relaxed mb-10"
          >
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-20">
            <button
              data-gsap="cta"
              onClick={() => document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 py-4 text-sm font-semibold text-white rounded-xl overflow-hidden cursor-pointer"
            >
              <span
                className="absolute inset-0 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #ff6b2c, #ffb347)' }}
              />
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #ff8c42, #ffd700)' }}
              />
              <span className="relative z-10 flex items-center gap-2">
                {t('ctaPrimary')}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>

            <button
              data-gsap="cta"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-8 py-4 text-sm font-semibold text-text border border-border hover:border-ignis/50 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-ignis/0 group-hover:bg-ignis/5 transition-colors duration-300" />
              <span className="relative z-10">{t('ctaSecondary')}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10">
            {[
              { val: t('stat1Value'), label: t('stat1Label') },
              { val: t('stat2Value'), label: t('stat2Label') },
              { val: t('stat3Value'), label: t('stat3Label') },
            ].map(({ val, label }) => (
              <div key={label} data-gsap="stats" className="flex flex-col gap-1">
                <span className="font-display text-3xl font-bold text-gradient-ignis">
                  {val}
                </span>
                <span className="text-xs text-text-muted tracking-wide uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-xs text-text-muted tracking-[0.2em] uppercase">
          {t('scrollText')}
        </span>
        <div className="w-px h-12 relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-ignis to-transparent"
            style={{ animation: 'scrollLine 1.8s ease-in-out infinite' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(100%);  opacity: 0; }
        }
      `}</style>
    </section>
  );
}
