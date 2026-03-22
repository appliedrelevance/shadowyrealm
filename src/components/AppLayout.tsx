import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { BarChart3, LogIn, LogOut, UserPlus, LayoutGrid, Scale, BookOpen, Menu, X } from "lucide-react";
import type { ReactNode } from "react";

const navLinkBase = "flex items-center gap-1 text-sm transition-colors duration-150";
const navLinkIdle = "text-text-muted hover:text-text-bright";
const navLinkActive = "text-text-bright border-b border-arcane-purple";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-realm-bg text-text">
      <header className="border-b border-realm-border bg-realm-surface">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-text-bright hover:text-arcane-purple-light">
            <BarChart3 className="h-5 w-5 text-arcane-purple" />
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

            {user ? (
              <button
                onClick={() => signOut()}
                className={`${navLinkBase} ${navLinkIdle}`}
              >
                <LogOut className="h-4 w-4" />
                {COPY.nav.signOut}
              </button>
            ) : (
              <>
                <Link to="/login" search={{ redirect: "/" }} className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                  <LogIn className="h-4 w-4" />
                  {COPY.nav.signIn}
                </Link>
                <Link to="/register" className={navLinkBase} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                  <UserPlus className="h-4 w-4" />
                  {COPY.nav.signUp}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center text-text-muted hover:text-text-bright md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile overlay menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-realm-bg/90 md:hidden" onClick={closeMenu}>
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

              <div className="my-2 border-t border-realm-border" />

              {user ? (
                <button
                  onClick={() => { signOut(); closeMenu(); }}
                  className={`${navLinkBase} text-lg ${navLinkIdle}`}
                >
                  <LogOut className="h-5 w-5" />
                  {COPY.nav.signOut}
                </button>
              ) : (
                <>
                  <Link to="/login" search={{ redirect: "/" }} onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                    <LogIn className="h-5 w-5" />
                    {COPY.nav.signIn}
                  </Link>
                  <Link to="/register" onClick={closeMenu} className={`${navLinkBase} text-lg`} activeProps={{ className: navLinkActive }} inactiveProps={{ className: navLinkIdle }}>
                    <UserPlus className="h-5 w-5" />
                    {COPY.nav.signUp}
                  </Link>
                </>
              )}

              <button
                onClick={closeMenu}
                className="mt-4 flex items-center gap-1 text-sm text-text-muted hover:text-text-bright"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="animate-fade-in">{children}</main>

      <footer className="border-t border-realm-border bg-realm-surface py-6 text-center text-sm text-text-muted">
        {COPY.footer.tagline}
      </footer>
    </div>
  );
}
