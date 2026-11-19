"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

/** A submit button that asks before it submits (deletes, restores…). */
export function ConfirmSubmit({
  message,
  className,
  children,
  pendingLabel,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
