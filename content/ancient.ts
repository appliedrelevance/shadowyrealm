/** The ancient world, to the end of the Roman Empire in the West and beyond. */
import type { RealmContent } from "./types";

export const ancient: RealmContent = {
  entities: [
    {
      slug: "hammurabi",
      name: "Hammurabi",
      type: "person",
      wiki: "Hammurabi",
      description: "King of Babylon who united Mesopotamia and issued one of the earliest written law codes.",
      metadata: { birth_date: "c. 1810 BCE", death_date: "c. 1750 BCE", nationality: "Babylonian" },
      periods: [
        {
          label: "Reign over Babylon",
          start: -1792,
          end: -1750,
          description: "Hammurabi conquered the Mesopotamian city-states and issued the Code of Hammurabi.",
        },
      ],
    },
    {
      slug: "moses",
      name: "Moses",
      type: "person",
      wiki: "Moses",
      description: "The prophet of the Hebrew Bible who led the Israelites out of Egypt and received the Law at Sinai.",
      metadata: { nationality: "Israelite (traditional)" },
      periods: [
        {
          label: "Exodus and the Law",
          start: -1300,
          end: -1260,
          description: "In the biblical account Moses led the Exodus from Egypt and gave Israel the Ten Commandments.",
        },
      ],
    },
    {
      slug: "judaism",
      name: "Judaism",
      type: "organization",
      wiki: "Judaism",
      description: "The monotheistic religion of the Jewish people, the oldest of the Abrahamic faiths.",
      metadata: { founded_date: "2nd millennium BCE", organization_type: "institution" },
      periods: [
        {
          label: "Kingdoms of Israel and Judah",
          start: -1000,
          end: -587,
          wiki: "History of ancient Israel and Judah",
          description: "Israelite religion took shape under the kingdoms of Israel and Judah until Babylon destroyed the First Temple.",
        },
        {
          label: "Second Temple period",
          start: -538,
          end: 70,
          wiki: "Second Temple period",
          description: "Returning from exile, the Jews rebuilt the Temple, compiled the Hebrew Bible and lived under Persia, Greece and Rome.",
        },
        {
          label: "Rabbinic and modern Judaism",
          start: 71,
          end: 2026,
          wiki: "Rabbinic Judaism",
          description: "After the Temple fell, rabbinic Judaism kept the faith alive in diaspora through the Talmud and the synagogue.",
        },
      ],
    },
    {
      slug: "confucius",
      name: "Confucius",
      type: "person",
      wiki: "Confucius",
      description: "Chinese philosopher whose teachings on ethics, family and government shaped East Asia for two millennia.",
      metadata: { birth_date: "551 BCE", death_date: "479 BCE", nationality: "Lu (China)" },
      periods: [
        {
          label: "Teaching in Lu and travels",
          start: -522,
          end: -479,
          description: "Confucius taught disciples, served in the government of Lu and travelled among the states advising rulers.",
        },
      ],
    },
    {
      slug: "homer",
      name: "Homer",
      type: "person",
      wiki: "Homer",
      description: "The legendary Greek poet credited with the Iliad and the Odyssey, the foundation of Western literature.",
      metadata: { nationality: "Greek" },
      periods: [
        {
          label: "The Iliad and the Odyssey",
          start: -750,
          end: -700,
          description: "The two epics attributed to Homer were composed and became the shared education of the Greek world.",
        },
      ],
    },
    {
      slug: "socrates",
      name: "Socrates",
      type: "person",
      wiki: "Socrates",
      description: "Athenian philosopher who questioned everything, wrote nothing, and was executed for impiety.",
      metadata: { birth_date: "c. 470 BCE", death_date: "399 BCE", nationality: "Athenian" },
      periods: [
        {
          label: "Philosophy in Athens",
          start: -450,
          end: -399,
          description: "Socrates examined Athenians in public dialogue until he was tried and sentenced to death.",
        },
      ],
    },
    {
      slug: "plato",
      name: "Plato",
      type: "person",
      wiki: "Plato",
      description: "Athenian philosopher, student of Socrates, who founded the Academy and wrote the dialogues.",
      metadata: { birth_date: "c. 428 BCE", death_date: "348 BCE", nationality: "Athenian" },
      periods: [
        {
          label: "The Academy and the dialogues",
          start: -399,
          end: -347,
          description: "Plato wrote the dialogues, including the Republic, and founded the Academy in Athens.",
        },
      ],
    },
    {
      slug: "aristotle",
      name: "Aristotle",
      type: "person",
      wiki: "Aristotle",
      description: "Greek philosopher and polymath whose works on logic, science and ethics dominated learning for two thousand years.",
      metadata: { birth_date: "384 BCE", death_date: "322 BCE", nationality: "Greek" },
      periods: [
        {
          label: "Academy, Macedon and the Lyceum",
          start: -367,
          end: -322,
          description: "Aristotle studied at the Academy, tutored Alexander, and taught and wrote at his Lyceum in Athens.",
        },
      ],
    },
    {
      slug: "alexander-the-great",
      name: "Alexander the Great",
      type: "person",
      wiki: "Alexander the Great",
      description: "Macedonian king who conquered the Persian Empire and spread Greek culture from Egypt to India.",
      metadata: { birth_date: "356 BCE", death_date: "323 BCE", nationality: "Macedonian" },
      periods: [
        {
          label: "Conquest of the Persian Empire",
          start: -336,
          end: -323,
          description: "Alexander conquered Persia, Egypt and the lands to the Indus, founding cities across the Near East.",
        },
      ],
    },
    {
      slug: "qin-shi-huang",
      name: "Qin Shi Huang",
      type: "person",
      wiki: "Qin Shi Huang",
      description: "The first emperor of a unified China, who standardised its script, coinage and laws.",
      metadata: { birth_date: "259 BCE", death_date: "210 BCE", nationality: "Qin (China)" },
      periods: [
        {
          label: "Unification of China",
          start: -247,
          end: -210,
          description: "Qin Shi Huang conquered the warring states, unified China and began the Great Wall.",
        },
      ],
    },
    {
      slug: "julius-caesar",
      name: "Julius Caesar",
      type: "person",
      wiki: "Julius Caesar",
      description: "Roman general and dictator whose conquest of Gaul and civil war ended the Roman Republic.",
      metadata: { birth_date: "100 BCE", death_date: "44 BCE", nationality: "Roman" },
      periods: [
        {
          label: "Gaul and the civil war",
          start: -59,
          end: -44,
          description: "Caesar conquered Gaul, crossed the Rubicon, won the civil war and ruled as dictator until his murder.",
        },
      ],
    },
    {
      slug: "augustus",
      name: "Augustus",
      type: "person",
      wiki: "Augustus",
      description: "The first Roman emperor, who turned the Republic into an empire and began the Pax Romana.",
      metadata: { birth_date: "63 BCE", death_date: "14", nationality: "Roman" },
      periods: [
        {
          label: "The Principate",
          start: -27,
          end: 14,
          description: "Augustus ruled as first emperor, reorganising Rome's government, army and provinces.",
        },
      ],
    },
    {
      slug: "roman-empire",
      name: "Roman Empire",
      type: "organization",
      wiki: "Roman Empire",
      description: "The Mediterranean empire whose law, language and roads shaped Europe, and whose eastern half lasted to 1453.",
      metadata: { founded_date: "27 BCE", dissolved_date: "1453", headquarters: "Rome, later Constantinople", organization_type: "government" },
      periods: [
        {
          label: "Pax Romana",
          start: -27,
          end: 180,
          description: "Two centuries of relative peace in which Rome governed the whole Mediterranean world.",
        },
        {
          label: "Crisis and the late empire",
          start: 181,
          end: 476,
          description: "Civil wars, plague and invasions split the empire; Christianity became its religion and the West fell.",
        },
        {
          label: "Byzantine Empire",
          start: 477,
          end: 1453,
          wiki: "Byzantine Empire",
          description: "The eastern empire ruled from Constantinople, preserving Roman law and Greek learning until 1453.",
        },
      ],
    },
    {
      slug: "paul-the-apostle",
      name: "Paul the Apostle",
      type: "person",
      wiki: "Paul the Apostle",
      description: "Early Christian missionary whose letters and journeys carried Christianity to the gentile world.",
      metadata: { birth_date: "c. 5", death_date: "c. 64", nationality: "Roman citizen from Tarsus" },
      periods: [
        {
          label: "Missions and letters",
          start: 34,
          end: 64,
          description: "Paul founded churches across Asia Minor and Greece and wrote the letters that became much of the New Testament.",
        },
      ],
    },
    {
      slug: "saint-nicholas",
      name: "Saint Nicholas",
      type: "person",
      wiki: "Saint Nicholas",
      description: "Fourth-century bishop of Myra, famed for secret gift-giving, the model for Santa Claus.",
      metadata: { birth_date: "c. 270", death_date: "c. 343", nationality: "Greek, of Lycia" },
      periods: [
        {
          label: "Bishop of Myra",
          start: 300,
          end: 343,
          description: "Nicholas served as bishop of Myra and became known for his generosity to the poor and to children.",
        },
      ],
    },
  ],
  links: [
    { from: "moses", to: "judaism", share: 0.5, why: "Moses is the lawgiver of the Torah at the heart of Judaism." },
    { from: "judaism", to: "jesus", share: 0.3, why: "Jesus was a Jewish teacher preaching within Second Temple Judaism." },
    { from: "judaism", to: "islam", share: 0.1, why: "Islam builds on the Abrahamic monotheism and prophets of Judaism." },
    { from: "paul-the-apostle", to: "catholic-church", share: 0.2, why: "Paul's missions and letters made the early Church a gentile, universal faith." },
    { from: "socrates", to: "plato", share: 0.3, type: "mentorship", why: "Plato was Socrates's student and made him the voice of his dialogues." },
    { from: "julius-caesar", to: "roman-empire", share: 0.3, why: "Caesar's dictatorship ended the Republic and his heir founded the empire." },
    { from: "augustus", to: "roman-empire", share: 0.5, why: "Augustus founded the imperial system and ruled as its first emperor." },
  ],
};
