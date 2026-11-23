/* Imports the bundled catalogue (from the savis.vn V3 mockup) into Payload. Safe to re-run: upserts by slug.
   Usage: npm run seed */
import config from "@payload-config";
import { getPayload } from "payload";
import { industries, pillars } from "../components/layout/catalog";

const payload = await getPayload({ config });
const context = { disableRevalidate: true, skipAudit: true };

for (const p of pillars) {
  const data = {
    n: p.n,
    name: p.name,
    short: p.short,
    slug: p.id,
    pitch: p.pitch,
    groups: p.groups.map((g) => ({ name: g.name, items: g.items.map((name) => ({ name })) })),
  };
  const found = await payload.find({ collection: "pillars", where: { slug: { equals: p.id } }, limit: 1, depth: 0 });
  if (found.docs[0]) await payload.update({ collection: "pillars", id: found.docs[0].id, data, context });
  else await payload.create({ collection: "pillars", data, context });
}

for (const i of industries) {
  const data = { name: i.name, slug: i.id };
  const found = await payload.find({ collection: "industries", where: { slug: { equals: i.id } }, limit: 1, depth: 0 });
  if (found.docs[0]) await payload.update({ collection: "industries", id: found.docs[0].id, data, context });
  else await payload.create({ collection: "industries", data, context });
}

console.log(`Seeded ${pillars.length} pillars and ${industries.length} industries.`);
process.exit(0);
