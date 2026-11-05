import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useAuth } from "@/lib/auth";
import { COPY } from "@/lib/copy";
import { GoogleIcon } from "@/components/GoogleIcon";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) ?? "/",
  }),
  component: LoginPage,
});


function LoginPage() {
  const { redirect } = Route.useSearch();
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  if (!siteKey) throw new Error("VITE_TURNSTILE_SITE_KEY is not set");

  const captchaFailed = (message: string) => {
    setCaptchaToken(null);
    setError(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Complete the human check before signing in.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password, captchaToken);
      navigate({ to: redirect });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      // Tokens are single-use; a new one is needed for the next attempt.
      setCaptchaToken(null);
      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">
        {COPY.auth.signInHeading}
      </h1>

      <div className="mt-8 space-y-6">
        {error && (
          <p className="text-sm text-crit">{error}</p>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-3 rounded border border-line bg-surface-1 px-4 py-2.5 text-sm font-medium text-ink-2 hover:border-action hover:bg-surface-2"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink-muted">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-ink-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-surface-1 px-3 py-2 text-ink-2 focus:border-action focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-ink-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-line bg-surface-1 px-3 py-2 text-ink-2 focus:border-action focus:outline-none"
            />
          </div>
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            options={{ size: "flexible", theme: "auto" }}
            onSuccess={setCaptchaToken}
            onExpire={() => setCaptchaToken(null)}
            onError={() =>
              captchaFailed("The human check could not load. Reload the page and try again.")
            }
            onUnsupported={() =>
              captchaFailed("This browser cannot run the human check.")
            }
          />
          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full rounded bg-action px-4 py-2 font-semibold text-ink hover:bg-action-hi disabled:opacity-50"
          >
            {loading ? COPY.auth.signingIn : COPY.auth.signInHeading}
          </button>
        </form>
      </div>
    </div>
  );
}
