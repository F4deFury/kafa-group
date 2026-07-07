"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns a short-lived signed download URL for a document, but only after
 * confirming — via the normal RLS-scoped client — that the requesting user
 * is actually allowed to see this row (their own assigned project, or
 * staff/management). The bucket itself stays fully private; the admin
 * client is only used to mint the signed URL, never to bypass the
 * ownership check itself.
 */
export async function getDocumentDownloadUrl(documentId: string) {
  const supabase = await createClient();
  const { data: doc, error } = await supabase
    .from("project_documents")
    .select("storage_path, name")
    .eq("id", documentId)
    .single();

  if (error || !doc) {
    return { success: false as const, message: "Document not found or access denied." };
  }

  const adminClient = createAdminClient();
  const { data: signed, error: signError } = await adminClient.storage
    .from("project-documents")
    .createSignedUrl(doc.storage_path, 60);

  if (signError || !signed) {
    return { success: false as const, message: signError?.message ?? "Could not generate download link." };
  }

  return { success: true as const, url: signed.signedUrl, name: doc.name };
}
