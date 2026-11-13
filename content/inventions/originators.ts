/**
 * The originators of launch-set inventions that had no credit link, so that
 * every entry in Prior Art sits in the lineage graph.
 */
import type { InventionsContent } from "../types";

export const originators: InventionsContent = {
  entities: [
    {
      slug: "gregory-pincus",
      name: "Gregory Pincus",
      type: "person",
      wiki: "Gregory Goodwin Pincus",
      description: "Biologist who co-founded the Worcester Foundation and led the development of the combined oral contraceptive pill.",
      metadata: { birth_date: "1903", death_date: "1967", nationality: "American", field: "reproductive biology" },
      periods: [
        {
          label: "Worcester Foundation and the pill",
          start: 1944,
          end: 1967,
          description: "Pincus co-founded the Worcester Foundation for Experimental Biology and, with Min Chueh Chang and John Rock, developed and trialled the first oral contraceptive.",
        },
      ],
    },
    {
      slug: "carl-djerassi",
      name: "Carl Djerassi",
      type: "person",
      wiki: "Carl Djerassi",
      description: "Chemist whose team at Syntex synthesised norethisterone, one of the first progestins used in oral contraceptives.",
      metadata: { birth_date: "1923", death_date: "2015", nationality: "Austrian-American", field: "chemistry" },
      periods: [
        {
          label: "Syntex and norethisterone",
          start: 1949,
          end: 1959,
          description: "At Syntex in Mexico City, Djerassi's team synthesised cortisone and, in 1951, norethisterone, an orally active progestin.",
        },
        {
          label: "Stanford",
          start: 1959,
          end: 2015,
          description: "Djerassi taught chemistry at Stanford, developed insect-control hormones, and wrote novels and plays about science.",
        },
      ],
    },
    {
      slug: "paul-hermann-muller",
      name: "Paul Hermann Müller",
      type: "person",
      wiki: "Paul Hermann Müller",
      description: "Swiss chemist at Geigy who discovered the insecticidal action of DDT in 1939 and won the 1948 Nobel Prize for it.",
      metadata: { birth_date: "1899", death_date: "1965", nationality: "Swiss", field: "chemistry" },
      periods: [
        {
          label: "Geigy",
          start: 1925,
          end: 1961,
          description: "Müller searched for contact insecticides at J. R. Geigy in Basel and found in 1939 that DDT killed insects on contact.",
        },
      ],
    },
    {
      slug: "jennifer-doudna",
      name: "Jennifer Doudna",
      type: "person",
      wiki: "Jennifer Doudna",
      description: "Biochemist who, with Emmanuelle Charpentier, showed that CRISPR-Cas9 can be programmed to cut chosen DNA.",
      metadata: { birth_date: "1964", nationality: "American", field: "biochemistry" },
      periods: [
        {
          label: "Berkeley and CRISPR",
          start: 2002,
          end: 2026,
          description: "At the University of California, Berkeley, Doudna co-authored the 2012 paper on programmable Cas9 and founded the Innovative Genomics Institute.",
        },
      ],
    },
    {
      slug: "emmanuelle-charpentier",
      name: "Emmanuelle Charpentier",
      type: "person",
      wiki: "Emmanuelle Charpentier",
      description: "Microbiologist who discovered the tracrRNA of the CRISPR-Cas9 system and, with Jennifer Doudna, turned it into a gene-editing tool.",
      metadata: { birth_date: "1968", nationality: "French", field: "microbiology" },
      periods: [
        {
          label: "Bacterial genetics and CRISPR",
          start: 2002,
          end: 2026,
          description: "Charpentier studied bacterial infection in Vienna, Umeå and Berlin, discovered tracrRNA in 2011 and co-authored the 2012 Cas9 paper.",
        },
      ],
    },
    {
      slug: "portland-cement",
      name: "Portland cement",
      type: "invention",
      wiki: "Portland cement",
      description: "The hydraulic cement in almost all modern concrete, made by burning limestone and clay.",
      metadata: { invented_date: "1824", place: "Leeds, England", field: "materials" },
      periods: [
        {
          label: "Aspdin's patent and early cement",
          start: 1824,
          end: 1900,
          description: "Portland cement was patented in 1824 and improved into modern clinker cement, building docks, sewers and foundations.",
        },
        {
          label: "The concrete age",
          start: 1901,
          end: 2026,
          description: "Concrete made with Portland cement became the most used building material on Earth, and cement kilns one of the largest industrial sources of carbon dioxide.",
        },
      ],
    },
    {
      slug: "joseph-aspdin",
      name: "Joseph Aspdin",
      type: "person",
      wiki: "Joseph Aspdin",
      description: "English bricklayer who patented Portland cement in 1824.",
      metadata: { birth_date: "1778", death_date: "1855", nationality: "English", field: "building materials" },
      periods: [
        {
          label: "Cement maker",
          start: 1811,
          end: 1855,
          description: "Aspdin made artificial stone and cement in Leeds and Wakefield and patented Portland cement in 1824.",
        },
      ],
    },
    {
      slug: "john-mauchly",
      name: "John Mauchly",
      type: "person",
      wiki: "John Mauchly",
      description: "Physicist who co-designed ENIAC, the first general-purpose electronic digital computer, and the UNIVAC I.",
      metadata: { birth_date: "1907", death_date: "1980", nationality: "American", field: "physics and computing" },
      periods: [
        {
          label: "ENIAC and UNIVAC",
          start: 1941,
          end: 1959,
          description: "Mauchly proposed ENIAC at the Moore School, built it with Eckert, and co-founded the company that made the UNIVAC I.",
        },
      ],
    },
    {
      slug: "j-presper-eckert",
      name: "J. Presper Eckert",
      type: "person",
      wiki: "J. Presper Eckert",
      description: "Electrical engineer who led the engineering of ENIAC and co-designed the UNIVAC I.",
      metadata: { birth_date: "1919", death_date: "1995", nationality: "American", field: "electrical engineering" },
      periods: [
        {
          label: "ENIAC and UNIVAC",
          start: 1943,
          end: 1966,
          description: "Eckert was chief engineer of ENIAC and co-founded the Eckert–Mauchly Computer Corporation, which built the UNIVAC I.",
        },
      ],
    },
  ],
  links: [
    { from: "gregory-pincus", to: "combined-oral-contraceptive", type: "originated", share: 0.3, why: "Pincus led the work that produced the first oral contraceptive. Others who came close: Min Chueh Chang and John Rock, his collaborators, and Frank Colton at Searle, whose norethynodrel went into Enovid." },
    { from: "carl-djerassi", to: "combined-oral-contraceptive", type: "originated", share: 0.2, why: "Djerassi's team synthesised norethisterone in 1951, one of the two progestins of the first pills. Rival: Frank Colton's norethynodrel, synthesised months later." },
    { from: "paul-hermann-muller", to: "ddt", type: "originated", share: 0.5, why: "Müller discovered DDT's insecticidal action in 1939. Othmar Zeidler had first synthesised the compound in 1874 without finding a use for it." },
    { from: "jennifer-doudna", to: "crispr", type: "originated", share: 0.25, why: "Doudna co-authored the 2012 paper showing Cas9 can be programmed to cut chosen DNA. Rivals: Virginijus Šikšnys, with a parallel result, and Feng Zhang, first to edit human cells." },
    { from: "emmanuelle-charpentier", to: "crispr", type: "originated", share: 0.25, why: "Charpentier discovered tracrRNA and co-authored the 2012 Cas9 paper with Doudna. Rivals: Šikšnys and Zhang." },
    { from: "jennifer-doudna", to: "emmanuelle-charpentier", type: "collaboration", share: 0, why: "They worked out programmable Cas9 together and shared the 2020 Nobel Prize in Chemistry." },
    { from: "joseph-aspdin", to: "portland-cement", type: "originated", share: 0.4, why: "Aspdin patented Portland cement in 1824. Others who came close: Louis Vicat and James Frost, and his son William Aspdin, who made the first modern clinker cement." },
    { from: "roman-concrete", to: "portland-cement", type: "builds_on", share: 0.1, why: "Modern hydraulic cement revived the Roman practice of setting lime-based cement under water." },
    { from: "john-mauchly", to: "eniac", type: "originated", share: 0.35, why: "Mauchly proposed and co-designed ENIAC. Rivals: the Atanasoff–Berry Computer, which a 1973 court ruled came first, and Britain's Colossus." },
    { from: "j-presper-eckert", to: "eniac", type: "originated", share: 0.35, why: "Eckert led ENIAC's engineering with Mauchly. Rivals: the Atanasoff–Berry Computer and Colossus." },
    { from: "john-mauchly", to: "j-presper-eckert", type: "collaboration", share: 0, why: "They designed ENIAC together and founded the Eckert–Mauchly Computer Corporation." },
    { from: "silk", to: "paper", type: "builds_on", share: 0.05, why: "Paper replaced silk as China's writing material, and the character for paper carries the silk radical from its first fibre sheets." },
  ],
};
