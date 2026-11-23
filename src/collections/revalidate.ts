import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook } from "payload";
import { CATALOG_TAG } from "../lib/cache-tags";

/** Refresh the header and footer after catalogue edits. Safe to skip outside a Next request (seed script). */
export const revalidateSite: CollectionAfterChangeHook = ({ doc, context }) => {
  if (context?.disableRevalidate) return doc;
  try {
    revalidateTag(CATALOG_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  } catch {
    /* not inside a Next.js request */
  }
  return doc;
};
