import { Link } from "@tanstack/react-router";
import {
  CreditFormula,
  DimensionTable,
  IntensityTable,
  LevelFormula,
  LinkTypeTable,
  PersistenceTable,
  ReachTable,
  TierTable,
} from "@/features/methodology/tables";

/** Prior Art's account of its method; the tables come from the site config. */
export function Methodology() {
  return (
    <>
      <p className="mt-4 text-lg text-ink-2">
        Prior Art measures what inventions did to the world, not how clever they were. Fritz Haber's ammonia process
        feeds billions, and Haber also ran Germany's chlorine gas programme. Thomas Midgley gave the world leaded petrol
        and CFCs. The score keeps both sides of each.
      </p>

      <div className="prose prose-invert mt-8 max-w-none">
        <h2 className="font-display text-ink">Ten numbers, never netted</h2>
        <p>
          Every entry carries a profile of ten numbers: a <strong>benefit</strong> and a <strong>harm</strong> for
          each of five dimensions. Benefit and harm are never subtracted from each other. Their sum,{" "}
          <em>magnitude</em>, is used only to rank entries and assign tiers.
        </p>
        <DimensionTable />
        <p>
          No dimension measures technology itself. What an invention made possible reaches it as credit from the
          things built on it: the transistor is credited with a share of the integrated circuit, the microprocessor and
          the iPhone. Scoring "advanced technology" as a dimension as well would count those descendants twice.
        </p>

        <h2 className="font-display text-ink">Inventions, products and the people behind them</h2>
        <p>
          An <em>invention</em> is a technique, device, material or process, such as the transistor or the Haber
          process. A <em>product</em> is one thing made and sold under one name, such as the Model T or the Walkman.
          Products embody inventions, so the graph can say which inventions a phone is made of. People, organizations
          and projects originate inventions and make products; a <em>discovery</em> about nature enters the index only
          when an invention here builds on it.
        </p>
        <LinkTypeTable />

        <h2 className="font-display text-ink">Periods and the influence curve</h2>
        <p>
          Each entry's direct activity is divided into periods: an invention's first working form, its
          commercialization, its mass adoption and its decline; a product's generations; an inventor's working life.
          Within a period each of the ten numbers has a level per year:
        </p>
        <LevelFormula />
        <p>
          The reach multiplier is (reach ÷ 5)<sup>1.8</sup> × 3, so an invention used across a nation weighs far more
          than one used in a town. Laid end to end, the periods form an influence curve, and each number's score is
          the area under it up to today, in <strong>influence-centuries</strong> (level × years ÷ 100).
        </p>

        <h2 className="font-display text-ink">Scoring each period with Clef</h2>
        <p>
          Each period is scored by Clef, Cloudflare's decision model, from evidence text taken from Wikipedia and
          stored with the score. Clef rates an inventor on their own work and an invention on its making and use, and
          leaves out the consequences that have entries of their own. Environment is judged by the effect on the
          natural world as well as on people.
        </p>
        <IntensityTable />
        <ReachTable />

        <h2 className="font-display text-ink">Persistence and the fading tail</h2>
        <p>
          When an entry's last period ends, its influence fades at a rate set by that period's persistence: the years
          for its level to fall to 37% (1/e). A product replaced within a decade fades fast; the plough never does.
        </p>
        <PersistenceTable />
        <p>
          The part of a legacy that later inventions carry comes back as credit instead, so the tail shrinks by the
          credit an entry passes on.
        </p>

        <h2 className="font-display text-ink">Share is originality</h2>
        <p>
          Links run from cause to consequence, and a link's strength is the share of the consequence credited to the
          cause. Credit travels any number of hops by the strongest chain, so Bell Labs is credited, through the
          transistor, the integrated circuit and the microprocessor, with a share of the iPhone.
        </p>
        <CreditFormula />
        <p>
          A consequence can give away at most all of itself, and what it keeps is its own originality: the iPhone
          credits parts of itself to the inventions inside it and to Apple, and keeps the rest for what was new in
          putting them together. An inventor's share of an invention is smaller for each rival who came close. Jack
          Kilby and Robert Noyce built integrated circuits months apart, and Joseph Swan and Thomas Edison both made
          working light bulbs, so each shares the credit.
        </p>

        <h2 className="font-display text-ink">Tiers</h2>
        <p>
          Tiers are set from the spread of the index itself: their boundaries are the round numbers nearest the
          20th, 50th, 80th and 95th percentiles of total influence.
        </p>
        <TierTable />

        <h2 className="font-display text-ink">One of the ShadowyRealm indexes</h2>
        <p>
          Prior Art runs on the same engine as ShadowyRealm, which scores people, institutions and events across
          history. The credit shares are computed inside Postgres by a recursive query over the links, and a small
          TypeScript calculator in a Cloudflare Worker turns periods into curves and areas for every page and for the
          MCP tools that maintain the index.
        </p>
        <p>
          <Link to="/realm">See the lineage</Link> or <Link to="/">return to the index</Link>.
        </p>
      </div>
    </>
  );
}
