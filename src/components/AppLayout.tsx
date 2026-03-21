import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Scroll, LogIn, LogOut, UserPlus, Swords, Scale } from "lucide-react";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-realm-bg text-text">
      <header className="border-b border-realm-border bg-realm-surface">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-text-bright hover:text-arcane-purple-light">
            <Scroll className="h-5 w-5 text-arcane-purple" />
            ShadowyRealm
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1 text-sm text-text-muted hover:text-text-bright">
              <Swords className="h-4 w-4" />
              Archives
            </Link>
            <Link to="/compare" className="flex items-center gap-1 text-sm text-text-muted hover:text-text-bright">
              <Scale className="h-4 w-4" />
              Compare
            </Link>
            <Link to="/methodology" className="flex items-center gap-1 text-sm text-text-muted hover:text-text-bright">
              <Scroll className="h-4 w-4" />
              Tome
            </Link>

            {user ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 text-sm text-text-muted hover:text-text-bright"
              >
                <LogOut className="h-4 w-4" />
                Leave
              </button>
            ) : (
              <>
                <Link to="/login" search={{ redirect: "/" }} className="flex items-center gap-1 text-sm text-text-muted hover:text-text-bright">
                  <LogIn className="h-4 w-4" />
                  Enter
                </Link>
                <Link to="/register" className="flex items-center gap-1 text-sm text-text-muted hover:text-text-bright">
                  <UserPlus className="h-4 w-4" />
                  Join
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="border-t border-realm-border bg-realm-surface py-6 text-center text-sm text-text-muted">
        ShadowyRealm &mdash; Impact Assessment Through the Ages
      </footer>
    </div>
  );
}
