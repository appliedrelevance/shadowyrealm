/**
 * Links that join the three eras of the launch set, drafted in parallel files.
 * Every endpoint is an entity in content/inventions/.
 */
import type { InventionsContent } from "../types";

export const crossEra: InventionsContent = {
  entities: [],
  links: [
    { from: "ferrous-metallurgy", to: "bessemer-process", type: "builds_on", share: 0.15, why: "The Bessemer converter refined blast-furnace pig iron into steel." },
    { from: "ferrous-metallurgy", to: "watt-steam-engine", type: "builds_on", share: 0.05, why: "Watt's engine needed accurately bored cast-iron cylinders." },
    { from: "lens", to: "daguerreotype", type: "builds_on", share: 0.1, why: "The camera lens formed the image the silvered plate recorded." },
    { from: "gunpowder", to: "dynamite", type: "builds_on", share: 0.1, why: "Dynamite was made to replace black powder for blasting." },
    { from: "gunpowder", to: "maxim-gun", type: "builds_on", share: 0.05, why: "The Maxim gun fired cartridges descended from gunpowder firearms." },
    { from: "antonie-van-leeuwenhoek", to: "germ-theory", type: "originated", share: 0.05, why: "Leeuwenhoek first saw microorganisms, the evidence germ theory later explained; Pasteur and Koch established the theory." },
    { from: "radio", to: "television", type: "builds_on", share: 0.15, why: "Television pictures are broadcast on radio waves." },
    { from: "radio", to: "gps", type: "builds_on", share: 0.1, why: "GPS satellites broadcast their navigation and timing signals by radio." },
    { from: "electric-generator", to: "nuclear-power", type: "builds_on", share: 0.05, why: "A reactor's heat makes electricity only through turbine generators." },
    { from: "smallpox-vaccine", to: "polio-vaccine", type: "builds_on", share: 0.1, why: "Salk and Sabin applied to polio the vaccination method that began with Jenner." },
    { from: "germ-theory", to: "polio-vaccine", type: "builds_on", share: 0.05, why: "Immunising against a virus depends on knowing that specific microbes cause specific diseases." },
    { from: "smallpox-vaccine", to: "mrna-vaccine", type: "builds_on", share: 0.05, why: "mRNA vaccines deliver the same principle of training immunity with an antigen." },
    { from: "germ-theory", to: "mrna-vaccine", type: "builds_on", share: 0.03, why: "mRNA vaccines target pathogens that germ theory identified as causes of disease." },
    { from: "irrigation", to: "high-yielding-variety", type: "builds_on", share: 0.1, why: "High-yielding varieties gave their gains only with irrigation, alongside fertiliser." },
  ],
};
