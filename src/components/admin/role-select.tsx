"use client";

import { useState, useTransition } from "react";
import { setRole } from "@/app/admin/users/actions";

const LABELS = { user: "User", editor: "Editor", admin: "Admin" } as const;

export function RoleSelect({ userId, role, name }: { userId: string; role: string; name: string }) {
  const [value, setValue] = useState(role);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-col items-end">
      <select
        aria-label={`Role for ${name}`}
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          if (next === "admin" && !window.confirm(`Give ${name} full admin access (site content, team, users)?`)) return;
          const prev = value;
          setValue(next);
          setError(null);
          start(async () => {
            const r = await setRole(userId, next);
            if (!r.ok) {
              setValue(prev);
              setError(r.error ?? "Couldn't change the role.");
            }
          });
        }}
        className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm font-semibold text-forest outline-none focus:border-forest disabled:opacity-50"
      >
        {Object.entries(LABELS).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
