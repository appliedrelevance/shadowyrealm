import { Building2, User, Zap } from "lucide-react";
import type { SiteUi } from "../ui-types";
import hero from "./hero.jpg";
import { Logo } from "./Logo";
import { Methodology } from "./Methodology";

function Hero({ className, alt }: { className?: string; alt: string }) {
  return <img src={hero} alt={alt} width={512} height={512} className={className} />;
}

export const ui: SiteUi = {
  Logo,
  Hero,
  typeIcons: { person: User, organization: Building2, event: Zap },
  Methodology,
};
