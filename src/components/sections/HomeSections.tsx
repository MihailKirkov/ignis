"use client";

import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { useEffect } from "react";
import { getScrollIntent, clearScrollIntent } from "@/lib/scroll-intent";

const Services = dynamic(() => import("@/components/sections/Services"), {
    loading: () => <SectionSkeleton />,
});
const Work = dynamic(() => import("@/components/sections/Work"), {
    loading: () => <SectionSkeleton />,
});
const Process = dynamic(
    () =>
        import("@/components/sections/Process").then((m) => ({
            default: m.Process,
        })),
    { loading: () => <SectionSkeleton /> },
);
const Pricing = dynamic(
    () =>
        import("@/components/sections/Pricing").then((m) => ({
            default: m.Pricing,
        })),
    { loading: () => <SectionSkeleton /> },
);
const FAQ = dynamic(
    () => import("@/components/sections/FAQ").then((m) => ({ default: m.FAQ })),
    { loading: () => <SectionSkeleton /> },
);
const Contact = dynamic(
    () =>
        import("@/components/sections/Contact").then((m) => ({
            default: m.Contact,
        })),
    { loading: () => <SectionSkeleton /> },
);

export function HomeSections() {
    useEffect(() => {
        const hash = getScrollIntent();
        if (!hash) return;

        let frames = 0;
        const MAX_FRAMES = 60;

        const scroll = () => {
            const el = document.querySelector(hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                window.history.replaceState(null, "", hash);
                clearScrollIntent();
            } else if (frames < MAX_FRAMES) {
                frames++;
                requestAnimationFrame(scroll);
            } else {
                clearScrollIntent();
            }
        };

        requestAnimationFrame(scroll);
    }, []);
    return (
        <>
            <Services />
            <Work />
            <Process />
            <Pricing />
            <FAQ />
            <Contact />
        </>
    );
}
