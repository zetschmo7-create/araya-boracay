"use client";

import { useActionState } from "react";
import { signInAction, type AuthActionState } from "../auth/actions";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState<
    AuthActionState | null,
    FormData
  >(signInAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div>
        <label htmlFor="email" className="admin-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="admin-input"
          placeholder="admin@araya.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="admin-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-input"
        />
      </div>

      {state?.error && (
        <p className="rounded border border-[rgba(184,107,92,0.3)] bg-[rgba(184,107,92,0.08)] px-4 py-3 text-sm text-[var(--admin-danger)]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="admin-btn admin-btn-primary w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
