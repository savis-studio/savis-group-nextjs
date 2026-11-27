"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FILMS, type FilmId } from "@/data/films";

/** A video in a window over the page. Escape, the close button or a click outside close it. */
export function VideoDialog({ film, onClose }: { film: FilmId | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (film && ref.current && !ref.current.open) ref.current.showModal();
  }, [film]);

  if (!film) return null;
  const { src, poster, label } = FILMS[film];
  const close = () => ref.current?.close();

  return (
    <dialog ref={ref} className="sv-vdlg" aria-label={label} onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="sv-vdlg__in">
        <button type="button" className="sv-vdlg__x" aria-label="Close video" onClick={close}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <video src={src} poster={poster} controls autoPlay playsInline aria-label={label} />
        <p>{label}</p>
      </div>
    </dialog>
  );
}

/** A button that opens one of the videos. Its content is the card or label to show. */
export function VideoButton({ film, className, children }: { film: FilmId; className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" onClick={() => setOpen(true)}>{children}</button>
      <VideoDialog film={open ? film : null} onClose={() => setOpen(false)} />
    </>
  );
}
