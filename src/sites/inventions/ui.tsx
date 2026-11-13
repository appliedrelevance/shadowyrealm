import { Building2, Lightbulb, Package, Rocket, Telescope, User } from "lucide-react";
import type { SiteUi } from "../ui-types";
import { Hero } from "./Hero";
import { Logo } from "./Logo";
import { Methodology } from "./Methodology";

export const ui: SiteUi = {
  Logo,
  Hero,
  typeIcons: {
    person: User,
    organization: Building2,
    project: Rocket,
    invention: Lightbulb,
    product: Package,
    discovery: Telescope,
  },
  Methodology,
};
