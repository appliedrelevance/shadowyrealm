import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { SITE } from "@/lib/site";
import { useSiteMismatch } from "@/lib/site-mismatch";
import { SITES } from "@/sites";
import { Logo } from "@/components/Logo";
import { LogOut, LayoutGrid, Network, Scale, BookOpen, Menu, X, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

/** The platform's other sites: one family of indexes under ShadowyRealm. */
const SIBLINGS = Object.values(SITES).filter((s) => s.key !== SITE.key);

const navLinkBase = "flex items-center gap-1 text-sm transition-colors duration-150";
const navLinkIdle = "text-ink-muted hover:text-ink";
const navLinkActive = "text-ink border-b border-action";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const mismatch = useSiteMismatch();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-surface text-ink-2">
      <header className="border-b border-line bg-surface-1">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink hover:text-action-ink">
            <Logo className="h-6 w-6" />
            {COPY.nav.brand}
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/" className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }} activeOptions={{ exact: true }}>
              <LayoutGrid className="h-4 w-4" />
              {COPY.nav.index}
            </Link>
            <Link to="/realm" className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
              <Network className="h-4 w-4" />
              {COPY.nav.lineage}
            </Link>
            <Link to="/compare" className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
              <Scale className="h-4 w-4" />
              {COPY.nav.compare}
            </Link>
            <Link to="/methodology" className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
              <BookOpen className="h-4 w-4" />
              {COPY.nav.howItWorks}
            </Link>
            {SIBLINGS.map((s) => (
              <a key={s.key} href={s.brand.origin} className={`${navLinkBase} ${navLinkIdle}`}>
                {s.brand.name}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}

            {user && (
              <button
                onClick={() => signOut()}
                className={`${navLinkBase} ${navLinkIdle}`}
              >
                <LogOut className="h-4 w-4" />
                {COPY.nav.signOut}
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center text-ink-muted hover:text-ink md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile overlay menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-surface/90 md:hidden" onClick={closeMenu}>
            <div
              className="mx-auto flex max-w-sm flex-col gap-4 px-6 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Link to="/" onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }} activeOptions={{ exact: true }}>
                <LayoutGrid className="h-5 w-5" />
                {COPY.nav.index}
              </Link>
              <Link to="/realm" onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                <Network className="h-5 w-5" />
                {COPY.nav.lineage}
              </Link>
              <Link to="/compare" onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                <Scale className="h-5 w-5" />
                {COPY.nav.compare}
              </Link>
              <Link to="/methodology" onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                <BookOpen className="h-5 w-5" />
                {COPY.nav.howItWorks}
              </Link>
              {SIBLINGS.map((s) => (
                <a key={s.key} href={s.brand.origin} className={`${navLinkBase} ${navLinkIdle} text-lg`}>
                  {s.brand.name}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}

              {user && (
                <>
                  <div className="my-2 border-t border-line" />
                  <button
                    onClick={() => { signOut(); closeMenu(); }}
                    className={`${navLinkBase} text-lg ${navLinkIdle}`}
                  >
                    <LogOut className="h-5 w-5" />
                    {COPY.nav.signOut}
                  </button>
                </>
              )}

              <button
                onClick={closeMenu}
                className="mt-4 flex items-center gap-1 text-sm text-ink-muted hover:text-ink"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="animate-fade-in">
        {mismatch ? (
          <div className="mx-auto max-w-3xl px-4 py-16" role="alert">
            <h1 className="font-display text-2xl font-bold text-ink">This page cannot load</h1>
            <p className="mt-3 text-ink-2">{mismatch.message}.</p>
            <p className="mt-2 text-sm text-ink-muted">
              Built for: <span className="font-mono">{mismatch.built}</span> · Served by:{" "}
              <span className="font-mono">{mismatch.served}</span>
            </p>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="border-t border-line bg-surface-1 py-6 text-center text-sm text-ink-muted">
        {COPY.footer.tagline}
        {SIBLINGS.length > 0 && (
          <>
            {" · "}Also from ShadowyRealm:{" "}
            {SIBLINGS.map((s, i) => (
              <span key={s.key}>
                {i > 0 && ", "}
                <a href={s.brand.origin} className="text-action-ink hover:underline">
                  {s.brand.name}
                </a>
              </span>
            ))}
          </>
        )}
      </footer>
    </div>
  );
}
