/**
 * Copy of /services/developers, taken from the mockup. The long structured parts (API tables, examples, app screens,
 * onboarding) are in developers.json. Endpoints, sandbox terms, durations and certificate dates are product facts that
 * the TrustCA and product teams own.
 */
import json from "@/data/developers.json";
import type { LineIconName } from "@/lib/line-icons";
import { slugify } from "@/lib/slug";

/** A small tree of text and a few inline or block elements; rendered by `DevNodes`, never as raw HTML. */
export type DevNode = string | { icon: string } | { t: string; cls?: string; href?: string; width?: string; c?: DevNode[] };

export type DevCell = string | { code: string } | { method: string; kind: string };

export interface DevTable { columns: string[]; rows: DevCell[][] }

export interface DevSample { title: string; code: string }

export interface DeveloperData {
  hero: { eyebrow: string; title: string; lead: string; actions: string[]; standards: string[]; code: DevSample & { note: string } };
  cert: { title: string; text: string; link: string };
  jump: Array<{ id: string; label: string }>;
  build: { eyebrow: string; title: string; cards: Array<{ href: string; cls: string; title: string; text: string }> };
  apis: { eyebrow: string; title: string; badge: string; items: Array<{ name: string; text: string; bullets: string[] }> };
  apiRef: {
    eyebrow: string; title: string; lead: string;
    tabs: Array<{ id: string; title: string; org: string; lead: DevNode[]; table: DevTable; examples: DevSample[] }>;
    sad: { eyebrow: string; title: string; lead: DevNode[]; steps: Array<{ title: string; text: DevNode[] }>; flows: Array<{ title: string; text: DevNode[] }> };
  };
  ux: {
    eyebrow: string; title: string; lead: DevNode[];
    tabs: Array<{ id: string; title: string; lead: string; steps: Array<{ title: string; call: string; screen: DevNode[] }> }>;
  };
  flow: {
    eyebrow: string; title: string; lead: string;
    stages: Array<{ title: string; time: string; who: string[]; you: string[]; savis: string[]; standards: string[]; gate: string }>;
    sequence: {
      eyebrow: string; title: string; label: string; actors: string[]; note: string;
      messages: Array<{ from: number; to: number; reply: boolean; text: string; result: string }>;
    };
    requirements: DevTable & { title: string };
  };
}

export const DEVELOPERS = json as DeveloperData;

/** Icons of the API families, in list order. */
const API_ICONS: LineIconName[] = ["pen", "shield", "sign", "face", "key"];

/** The API families with their anchors; the services menu lists the same ones. */
export const DEVELOPER_APIS = DEVELOPERS.apis.items.map((item, i) => ({ ...item, id: `sdk-${slugify(item.name)}`, icon: API_ICONS[i] ?? ("api" as LineIconName) }));
