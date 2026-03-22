/**
 * Realistic demo data for ShadowyRealm UAT.
 * These entities are historically plausible and populate the platform
 * with meaningful test data that doubles as sales-demo content.
 */

export interface PersonFixture {
  name: string;
  entity_type: "person";
  description: string;
  biography: string;
  nationality: string;
  birth_date?: string;
  death_date?: string;
}

export interface OrganizationFixture {
  name: string;
  entity_type: "organization";
  description: string;
  biography: string;
  headquarters: string;
  founded_date?: string;
  organization_type: string;
}

export interface EventFixture {
  name: string;
  entity_type: "event";
  description: string;
  biography: string;
  location: string;
  start_date?: string;
  end_date?: string;
  event_type: string;
}

export type EntityFixture = PersonFixture | OrganizationFixture | EventFixture;

export interface AssessmentFixture {
  scientific: { score: number; justification: string };
  economic: { score: number; justification: string };
  human_rights: { score: number; justification: string };
  health: { score: number; justification: string };
  cultural: { score: number; justification: string };
  confidence: number;
}

export interface PeriodFixture {
  label: string;
  start_year: number;
  end_year: number;
  description: string;
  reach_factor: number;
  persistence_factor: number;
}

export interface RelationshipFixture {
  sourceIndex: number;
  targetIndex: number;
  type: "influence" | "mentorship" | "collaboration" | "opposition";
  description: string;
  strength: number;
  temporal_overlap: number;
}

// ── Test user credentials ──
// Stable email so global-setup and test specs reference the same user.
export const TEST_USER = {
  email: "uat-tester@shadowyrealm.com",
  password: "UATpass#2026!secure",
};

// ── Entity fixtures ──

export const ENTITIES: EntityFixture[] = [
  {
    name: "Marie Curie",
    entity_type: "person",
    description:
      "Pioneer of radioactivity research. First woman to win a Nobel Prize, and the only person to win Nobel Prizes in two different sciences.",
    biography:
      "Born Maria Sklodowska in Warsaw, Poland, she moved to Paris to study physics and mathematics at the Sorbonne. Together with her husband Pierre, she discovered polonium and radium. Her research laid the groundwork for X-ray technology in medicine and nuclear physics.",
    nationality: "Polish-French",
    birth_date: "1867-11-07",
    death_date: "1934-07-04",
  },
  {
    name: "The Manhattan Project",
    entity_type: "event",
    description:
      "Top-secret U.S. research program that produced the first nuclear weapons during World War II.",
    biography:
      "Running from 1942 to 1946, the Manhattan Project employed over 125,000 people and cost nearly $2 billion (equivalent to $28 billion today). It resulted in the Trinity test and the atomic bombings of Hiroshima and Nagasaki.",
    location: "Los Alamos, New Mexico",
    start_date: "1942-08-13",
    end_date: "1946-01-01",
    event_type: "discovery",
  },
  {
    name: "World Health Organization",
    entity_type: "organization",
    description:
      "United Nations agency responsible for international public health, founded in 1948.",
    biography:
      "The WHO coordinates global health responses, sets health standards, and provides technical assistance to countries. It played a central role in the eradication of smallpox and continues to lead efforts against pandemics, malaria, and tuberculosis.",
    headquarters: "Geneva, Switzerland",
    founded_date: "1948-04-07",
    organization_type: "ngo",
  },
];

// ── Assessment fixtures (one per entity) ──

export const ASSESSMENTS: AssessmentFixture[] = [
  // Marie Curie
  {
    scientific: {
      score: 10,
      justification:
        "Discovered radioactivity, polonium, and radium. Developed techniques for isolating radioactive isotopes. Two Nobel Prizes in Physics and Chemistry.",
    },
    economic: {
      score: 4,
      justification:
        "Radioactivity research enabled the nuclear power industry and medical imaging market worth billions today.",
    },
    human_rights: {
      score: 3,
      justification:
        "Broke gender barriers in science, inspiring generations of women. Mobile X-ray units saved soldiers' lives in WWI.",
    },
    health: {
      score: 8,
      justification:
        "X-ray technology revolutionized medical diagnostics. Radiation therapy became a cornerstone of cancer treatment.",
    },
    cultural: {
      score: 7,
      justification:
        "Symbol of scientific excellence and female empowerment. Her story reshaped cultural expectations of women in science.",
    },
    confidence: 0.95,
  },
  // Manhattan Project
  {
    scientific: {
      score: 9,
      justification:
        "Achieved controlled nuclear fission and produced the first nuclear weapons. Advanced understanding of atomic physics enormously.",
    },
    economic: {
      score: 5,
      justification:
        "Launched the nuclear power industry and post-war military-industrial complex. Massive government spending stimulated new technologies.",
    },
    human_rights: {
      score: -8,
      justification:
        "Atomic bombings of Hiroshima and Nagasaki killed over 200,000 civilians. Initiated the nuclear arms race and Cold War existential threat.",
    },
    health: {
      score: -6,
      justification:
        "Radiation exposure caused long-term health effects for survivors and nuclear test site communities. Nuclear fallout contaminated regions globally.",
    },
    cultural: {
      score: 6,
      justification:
        "Fundamentally altered geopolitics and human self-conception. Inspired the anti-nuclear movement and existential philosophy.",
    },
    confidence: 0.9,
  },
  // WHO
  {
    scientific: {
      score: 6,
      justification:
        "Coordinated global research on disease eradication, set international health standards, and published essential guidelines for medical practice worldwide.",
    },
    economic: {
      score: 5,
      justification:
        "Disease prevention and health system strengthening reduce economic losses from pandemics. Polio and smallpox eradication saved billions in healthcare costs.",
    },
    human_rights: {
      score: 7,
      justification:
        "Championed universal healthcare as a human right. Vaccination campaigns and disease surveillance protect vulnerable populations globally.",
    },
    health: {
      score: 10,
      justification:
        "Led smallpox eradication — the only human disease ever eliminated. Coordinates pandemic response, sets drug safety standards, and fights malaria and tuberculosis.",
    },
    cultural: {
      score: 3,
      justification:
        "Established health as a global governance concern. Shaped public understanding of epidemiology and international cooperation in health emergencies.",
    },
    confidence: 0.85,
  },
];

// ── Period fixture (for Marie Curie) ──

export const PERIOD: PeriodFixture = {
  label: "Research Era (1897-1934)",
  start_year: 1897,
  end_year: 1934,
  description:
    "From her doctoral research on radioactivity through her death, encompassing both Nobel Prize-winning discoveries.",
  reach_factor: 8,
  persistence_factor: 9,
};

// ── Relationship fixture ──

export const RELATIONSHIP: RelationshipFixture = {
  sourceIndex: 0, // Marie Curie
  targetIndex: 1, // Manhattan Project
  type: "influence",
  description:
    "Curie's foundational research on radioactivity directly enabled the nuclear physics that made the Manhattan Project possible.",
  strength: 0.8,
  temporal_overlap: 0.3,
};
