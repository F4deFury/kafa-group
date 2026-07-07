"use client";

import { useTransition } from "react";
import { removeClientAccount } from "./actions";

export default function RemoveClientButton({ clientId, name }: { clientId: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Remove access for ${name}? This cannot be undone — they will no longer be able to sign in, and any assigned project will become unassigned.`)) {
      return;
    }
    const formData = new FormData();
    formData.set("client_id", clientId);
    startTransition(async () => {
      await removeClientAccount(formData);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="mt-1 text-xs text-red-500 hover:text-red-600 disabled:opacity-60"
    >
      {isPending ? "Removing..." : "Remove Access"}
    </button>
  );
}
