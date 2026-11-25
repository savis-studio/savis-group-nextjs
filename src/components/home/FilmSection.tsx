"use client";

import { useRef, useState } from "react";

export interface FilmSectionProps {
  src: string;
  poster?: string;
  caption: string;
}

/** Click-to-play brand film. The file is not requested until the visitor presses play (preload="none"). */
export function FilmSection({ src, poster, caption }: FilmSectionProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="sv-film">
      <div className="sv-film__box">
        <video
          ref={video}
          playsInline
          preload="none"
          poster={poster}
          controls={playing}
          src={src}
          aria-label={caption}
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <button
            type="button"
            className="sv-film__play"
            aria-label={`Play: ${caption}`}
            onClick={() => { setPlaying(true); void video.current?.play(); }}
          >
            <span className="sv-film__ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
            </span>
            <span className="sv-film__st">Play video</span>
          </button>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
