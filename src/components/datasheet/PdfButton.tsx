"use client";
import { Button } from "@/components/ui";

/**
 * Opens the print window, where the reader saves the datasheet as a PDF (see the print rules in datasheet.css).
 * That window suggests the page title as the file name, so the title is swapped while it is open.
 */
export function PdfButton({ fileName }: { fileName: string }) {
  const save = () => {
    const title = document.title;
    document.title = fileName;
    window.addEventListener("afterprint", () => { document.title = title; }, { once: true });
    window.print();
  };
  return <Button className="sv-ds__pdf" onClick={save}>Download PDF</Button>;
}
