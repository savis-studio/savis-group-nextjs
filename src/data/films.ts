/** The SAVIS videos hosted with the website (public/video). */
export type FilmId = "brand" | "services";

export interface Film {
  src: string;
  poster: string;
  /** Heading of the card that opens the video. */
  title: string;
  text: string;
  /** Name of the video, shown under the player. */
  label: string;
}

export const FILMS: Record<FilmId, Film> = {
  brand: {
    src: "/video/savis-story.mp4",
    poster: "/images/company/film-poster.jpg",
    title: "Our history, vision, growth and global reach",
    text: "Twenty-two years of digital trust, from Vietnam to the world, in under two minutes.",
    label: "SAVIS Group: our history, vision, growth and global reach",
  },
  services: {
    src: "/video/film-services.mp4",
    poster: "/images/company/film-services.jpg",
    title: "Assess, design, deploy and operate.",
    text: "How SAVIS services take a project from the first assessment to day-to-day operation.",
    label: "SAVIS Services: Assess, design, deploy and operate",
  },
};
