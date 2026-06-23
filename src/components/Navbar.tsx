"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import { useProjectModal } from "@/components/ui/ProjectModal";
import { setScrollIntent } from "@/lib/scroll-intent";

const LOCALES = [
    { code: "en", label: "EN", full: "English" },
    { code: "bg", label: "BG", full: "Български" },
    { code: "de", label: "DE", full: "Deutsch" },
];

type NavLink =
    | { key: string; href: string; type: "anchor" }
    | { key: string; href: string; type: "route" };

const NAV_LINKS: ReadonlyArray<NavLink> = [
    { key: "services", href: "/services", type: "route" },
    { key: "work", href: "/work", type: "route" },
    { key: "process", href: "#process", type: "anchor" },
    { key: "pricing", href: "#pricing", type: "anchor" },
    { key: "contact", href: "#contact", type: "anchor" },
];

export default function Navbar() {
    const t = useTranslations("nav");
    const { open: openModal } = useProjectModal();
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (
                langRef.current &&
                !langRef.current.contains(e.target as Node)
            ) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
        setLangOpen(false);
    };

    const handleNavClick = (href: string) => {
        setMenuOpen(false);
        if (!href.startsWith("#")) return;

        if (pathname === "/") {
            router.push(href as Parameters<typeof router.push>[0]);
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            setScrollIntent(href);
            router.push("/");
        }
    };

    const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? "bg-bg/90 backdrop-blur-xl border-b border-border shadow-[0_4px_40px_rgba(0,0,0,0.4)]"
                        : "bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-18">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="group flex items-center gap-2.5 relative"
                        >
                            <div className="relative w-8 h-8">
                                <div className="absolute inset-0 rounded-full bg-ignis opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm" />
                                <svg
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    className="w-8 h-8 relative z-10"
                                >
                                    <path
                                        d="M16 4C16 4 8 12 8 20C8 24.4 11.6 28 16 28C20.4 28 24 24.4 24 20C24 16 20 12 20 12C20 12 20 16 16 18C16 18 12 14 16 4Z"
                                        fill="url(#flame-grad)"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="flame-grad"
                                            x1="16"
                                            y1="4"
                                            x2="16"
                                            y2="28"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#ffcb47"
                                            />
                                            <stop
                                                offset="50%"
                                                stopColor="#ff6b2c"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#ff3d00"
                                            />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span
                                className="font-display text-xl font-bold tracking-wider text-text group-hover:text-ignis transition-colors duration-300"
                                style={{ letterSpacing: "0.15em" }}
                            >
                                IGNIS
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
                            {NAV_LINKS.map((link) =>
                                link.type === "route" ? (
                                    <Link
                                        key={link.key}
                                        href={link.href}
                                        className="text-sm font-medium text-text-secondary hover:text-text transition-colors duration-200 relative group cursor-pointer"
                                    >
                                        {t(link.key)}
                                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-ignis transition-all duration-300 group-hover:w-full" />
                                    </Link>
                                ) : (
                                    <button
                                        key={link.key}
                                        onClick={() =>
                                            handleNavClick(link.href)
                                        }
                                        className="text-sm font-medium text-text-secondary hover:text-text transition-colors duration-200 relative group cursor-pointer"
                                    >
                                        {t(link.key)}
                                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-ignis transition-all duration-300 group-hover:w-full" />
                                    </button>
                                ),
                            )}
                        </div>

                        {/* Desktop Right */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Language Switcher */}
                            <div ref={langRef} className="relative">
                                <button
                                    onClick={() => setLangOpen(!langOpen)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text transition-colors duration-200 px-3 py-1.5 rounded-lg border border-border hover:border-border-bright"
                                >
                                    <span>{currentLocale.label}</span>
                                    <svg
                                        className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {langOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-36 bg-surface border border-border rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50">
                                        {LOCALES.map((loc) => (
                                            <button
                                                key={loc.code}
                                                onClick={() =>
                                                    switchLocale(loc.code)
                                                }
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer ${
                                                    loc.code === locale
                                                        ? "text-ignis bg-ignis/10"
                                                        : "text-text-secondary hover:text-text hover:bg-surface-2"
                                                }`}
                                            >
                                                <span className="font-mono font-bold text-xs w-6">
                                                    {loc.label}
                                                </span>
                                                <span>{loc.full}</span>
                                                {loc.code === locale && (
                                                    <svg
                                                        className="w-3.5 h-3.5 ml-auto text-ignis"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => openModal()}
                                className="relative group px-5 py-2 text-sm font-semibold text-white overflow-hidden rounded-lg cursor-pointer"
                            >
                                <span className="absolute inset-0 bg-ignis transition-all duration-300 group-hover:bg-ignis-bright" />
                                <span
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, var(--color-ignis), var(--color-ignis-glow))",
                                    }}
                                />
                                <span className="relative z-10">
                                    {t("startProject")}
                                </span>
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            <span
                                className={`block w-6 h-0.5 bg-text transition-all duration-300 ${
                                    menuOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-text transition-all duration-300 ${
                                    menuOpen ? "opacity-0 scale-x-0" : ""
                                }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-text transition-all duration-300 ${
                                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-all duration-400 ${
                    menuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
            >
                <div
                    className="absolute inset-0 bg-bg/95 backdrop-blur-2xl"
                    onClick={() => setMenuOpen(false)}
                />
                <div className="relative z-10 flex flex-col h-full pt-24 px-8">
                    <nav className="flex flex-col gap-2">
                        {NAV_LINKS.map((link, i) => {
                            const style: React.CSSProperties = {
                                transitionDelay: menuOpen
                                    ? `${i * 60}ms`
                                    : "0ms",
                                transform: menuOpen
                                    ? "translateX(0)"
                                    : "translateX(-20px)",
                                opacity: menuOpen ? 1 : 0,
                                transition: `transform 0.4s ease ${i * 60}ms, opacity 0.4s ease ${i * 60}ms, color 0.2s ease`,
                            };
                            const cls =
                                "text-left text-4xl font-display font-bold text-text-secondary hover:text-text transition-all duration-200 py-3 border-b border-border cursor-pointer";
                            return link.type === "route" ? (
                                <Link
                                    key={link.key}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={cls}
                                    style={style}
                                >
                                    {t(link.key)}
                                </Link>
                            ) : (
                                <button
                                    key={link.key}
                                    onClick={() => handleNavClick(link.href)}
                                    className={cls}
                                    style={style}
                                >
                                    {t(link.key)}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pb-12 flex flex-col gap-4">
                        {/* Language switcher mobile */}
                        <div className="flex gap-3">
                            {LOCALES.map((loc) => (
                                <button
                                    key={loc.code}
                                    onClick={() => switchLocale(loc.code)}
                                    className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
                                        loc.code === locale
                                            ? "border-ignis text-ignis bg-ignis/10"
                                            : "border-border text-text-secondary hover:border-border-bright hover:text-text"
                                    }`}
                                >
                                    {loc.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                openModal();
                            }}
                            className="w-full py-4 text-base font-semibold text-white rounded-xl cursor-pointer"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--color-ignis), var(--color-ignis-glow))",
                            }}
                        >
                            {t("startProject")}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
