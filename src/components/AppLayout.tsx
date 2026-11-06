import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { Logo } from "@/components/Logo";
import { LogOut, LayoutGrid, Scale, BookOpen, Menu, X } from "lucide-react";
import type { ReactNode } from "react";

const navLinkBase = "flex items-center gap-1 text-sm transition-colors duration-150";
const navLinkIdle = "text-ink-muted hover:text-ink";
const navLinkActive = "text-ink border-b border-action";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
            <Link to="/compare" className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
              <Scale className="h-4 w-4" />
              {COPY.nav.compare}
            </Link>
            <Link to="/methodology" className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
              <BookOpen className="h-4 w-4" />
              {COPY.nav.howItWorks}
            </Link>

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
              <Link to="/compare" onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                <Scale className="h-5 w-5" />
                {COPY.nav.compare}
              </Link>
              <Link to="/methodology" onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                <BookOpen className="h-5 w-5" />
                {COPY.nav.howItWorks}
              </Link>

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

      <main className="animate-fade-in">{children}</main>

      <footer className="border-t border-line bg-surface-1 py-6 text-center text-sm text-ink-muted">
        {COPY.footer.tagline}
      </footer>
    </div>
  );
}
