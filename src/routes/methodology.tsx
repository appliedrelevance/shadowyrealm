import type { ComponentType } from "react";
import Markdown, { type Components } from "react-markdown";
import { createFileRoute, Link } from "@tanstack/react-router";
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
import { COPY } from "@/lib/copy";
import { usePageTitle } from "@/lib/usePageTitle";
import type { MethodTable } from "@/sites/types";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
});

const TABLES: Readonly<Record<MethodTable, ComponentType>> = {
  dimensions: DimensionTable,
  linkTypes: LinkTypeTable,
  level: LevelFormula,
  intensity: IntensityTable,
  reach: ReachTable,
  persistence: PersistenceTable,
  credit: CreditFormula,
  tiers: TierTable,
};

/** A link to a path stays in the app; any other opens beside it. */
const MARKDOWN: Components = {
  h2: ({ children }) => <h2 className="font-display text-ink">{children}</h2>,
  a: ({ href, children }) =>
    href?.startsWith("/") ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
};

/** Each site's account of its method (SiteMethod), around tables built from its config. */
function MethodologyPage() {
  const method = COPY.methodology;
  usePageTitle(method.heading);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-ink">{method.heading}</h1>
      <p className="mt-4 text-lg text-ink-2">{method.lede}</p>
      <div className="prose prose-invert mt-8 max-w-none">
        {method.blocks.map((block, i) => {
          if (typeof block === "string") {
            return (
              <Markdown key={i} components={MARKDOWN}>
                {block}
              </Markdown>
            );
          }
          const Table = TABLES[block.table];
          return <Table key={i} />;
        })}
      </div>
    </div>
  );
}
