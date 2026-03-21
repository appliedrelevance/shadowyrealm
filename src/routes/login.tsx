import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) ?? "/",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: redirect });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-text-bright">
        Enter the Realm
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm text-text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-realm-border bg-realm-surface px-3 py-2 text-text focus:border-arcane-purple focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-text-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-realm-border bg-realm-surface px-3 py-2 text-text focus:border-arcane-purple focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-primary px-4 py-2 font-semibold text-text-bright hover:bg-primary-hover disabled:opacity-50"
        >
          {loading ? "Entering..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
