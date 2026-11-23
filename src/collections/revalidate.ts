import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";

/** Refresh the header and footer after catalogue edits. Safe to skip outside a Next request (seed script). */
export const revalidateSite: CollectionAfterChangeHook = ({ doc, context }) => {
  if (context?.disableRevalidate) return doc;
  try {
    revalidatePath("/", "layout");
  } catch {
    /* not inside a Next.js request */
  }
  return doc;
};
