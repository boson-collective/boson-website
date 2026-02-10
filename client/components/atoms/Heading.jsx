"use client";

import { useEffect, useRef, useState } from "react";

function Header() {
  const headerRef = useRef(null);

  // =========================
  // SCROLL STATES
  // =========================
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const [hidden, setHidden] = useState(true);
  const [enabled, setEnabled] = useState(false);

  // =========================
  // MOBILE MENU
  // =========================
  const [menuOpen, setMenuOpen] = useState(false);

  // =========================
  // SCROLL LOGIC
  // =========================
  useEffect(() => {
    const threshold = 8;

    const onScroll = () => {
      const currentY = window.scrollY;
      const triggerY = window.innerHeight * 1.01;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentY >= triggerY) {
            setEnabled(true);
          } else {
            setEnabled(false);
            setHidden(true);
            lastScrollY.current = currentY;
            ticking.current = false;
            return;
          }

          const diff = currentY - lastScrollY.current;

          if (diff > threshold) setHidden(true);
          if (diff < -threshold) setHidden(false);

          lastScrollY.current = currentY;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // =========================
  // INTERSECTION → DATA-THEME
  // =========================
  useEffect(() => {
    if (!enabled) return;

    const header = headerRef.current;
    if (!header) return;

    const sections = document.querySelectorAll("[data-theme]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            header.dataset.theme = entry.target.dataset.theme;
          }
        });
      },
      {
        rootMargin: "-1px 0px -99% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <>
      {/* HEADER */}
      <header
        ref={headerRef}
        data-theme="light"
        className={`
          group font-[Code_Pro]
          fixed top-0 left-0 z-50 w-full
          bg-transparent
          transition-transform duration-300 ease-out
          ${
            !enabled || hidden
              ? "-translate-y-full"
              : "translate-y-0"
          }
        `}
      >
        <div
          className="
            relative
            mx-auto
            px-4 sm:px-6 md:px-20
            min-h-[64px] md:min-h-[72px]
            flex items-center
          "
        >
          {/* LEFT — NAV (DESKTOP ONLY) */}
          <nav
            aria-label="Primary navigation"
            className="
              hidden md:flex
              items-center gap-6
              flex-1 min-w-0
             text-xs sm:text-xs font-medium tracking-wide
            "
          >
            {["About"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="
                  transition-colors whitespace-nowrap
                  group-data-[theme=light]:text-black
                  group-data-[theme=dark]:text-white
                "
              >
                {item}
              </a>
            ))}
          </nav>

          {/* MOBILE — HAMBURGER */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="
              md:hidden
              relative z-50
              w-10 h-10
              flex items-center justify-center
              group-data-[theme=light]:text-black
              group-data-[theme=dark]:text-white
            "
            aria-label="Open menu"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
              <span className="block w-5 h-px bg-current" />
            </div>
          </button>

          {/* CENTER — LOGO */}
          <div
            className="
              absolute left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              pointer-events-none
            "
          >
            <a href="/" className="pointer-events-auto block">
              <img
                src="/png/boson-black.png"
                alt="Boson"
                className="
                  w-16 sm:w-18 md:w-28
                  h-auto
                  transition
                  group-data-[theme=dark]:invert
                "
              />
            </a>
          </div>

          {/* RIGHT — CTA (DESKTOP ONLY) */}
          <div className="hidden md:flex items-center justify-end flex-1">
            <a
              href="#contact"
              className="
                relative
                text-xs sm:text-xs font-medium tracking-wide whitespace-nowrap
                transition-colors
                group-data-[theme=light]:text-black
                group-data-[theme=dark]:text-white
              "
            >
              Contact
              <span
                className="
                  pointer-events-none
                  absolute left-0 right-0 -bottom-0.5
                  h-px
                  scale-x-0 origin-left
                  transition-transform duration-300
                  hover:scale-x-100
                  group-data-[theme=light]:bg-black
                  group-data-[theme=dark]:bg-white
                "
              />
            </a>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        <div
          className={`
            md:hidden
            absolute top-full left-0 w-full
            bg-white text-black
            group-data-[theme=dark]:bg-black
            group-data-[theme=dark]:text-white
            transition-all duration-300
            ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
        >
          <nav className="flex flex-col px-6 py-6 gap-4 text-base">
            {["About", "Contact"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="tracking-wide"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
