/**
 * The second wave: 500 entities drafted, loaded, scored and published on 2026-11-07.
 * Every Wikipedia title was checked against the API, duplicates of the launch
 * set were removed, and the links fit the 1.00 incoming-credit cap together
 * with the launch links. Loaded with:
 *
 *   MCP_URL=https://shadowyrealm.com/mcp MCP_API_KEY=… bun tools/realm-load.ts content/next-500.ts --publish --concurrency 4
 */
import type { RealmContent } from "./types";

const content: RealmContent = {
  "entities": [
    {
      "slug": "indus-valley-civilisation",
      "name": "Indus Valley Civilisation",
      "type": "organization",
      "wiki": "Indus Valley Civilisation",
      "description": "The Indus Valley Civilisation was a Bronze Age urban culture of the northwestern Indian subcontinent known for the planned cities of Harappa and Mohenjo-daro and an undeciphered script.",
      "metadata": {
        "founded_date": "c. 3300 BCE",
        "dissolved_date": "c. 1300 BCE",
        "headquarters": "Harappa and Mohenjo-daro",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Early Harappan",
          "start": -3300,
          "end": -2600,
          "description": "Farming settlements along the Indus grew into towns."
        },
        {
          "label": "Mature Harappan cities",
          "start": -2600,
          "end": -1900,
          "description": "Planned cities with standard bricks, weights and drainage traded as far as Mesopotamia."
        }
      ],
      "why": "It was the most extensive of the first urban civilisations, and its cities pioneered planned drainage and sanitation."
    },
    {
      "slug": "cuneiform",
      "name": "Invention of cuneiform",
      "type": "event",
      "wiki": "Cuneiform",
      "description": "Cuneiform, the wedge-shaped script pressed into clay, was developed in Sumer and is the earliest known writing system, later used for Akkadian, Hittite, Old Persian and other languages.",
      "metadata": {
        "start_date": "c. 3300 BCE",
        "end_date": "75",
        "location": "Mesopotamia",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Invention in Uruk",
          "start": -3300,
          "end": -3000,
          "description": "Accounting signs in Uruk developed into a full script."
        },
        {
          "label": "Use across the Near East",
          "start": -3000,
          "end": 75,
          "description": "The script recorded law, literature, science and diplomacy across Mesopotamia and beyond."
        }
      ],
      "why": "The invention of writing made recorded history, law, literature and science possible."
    },
    {
      "slug": "sumer",
      "name": "Sumer",
      "type": "organization",
      "wiki": "Sumer",
      "description": "Sumer was the civilisation of southern Mesopotamia in which the first cities, cuneiform writing, the wheel and written law appeared.",
      "metadata": {
        "founded_date": "c. 3300 BCE",
        "dissolved_date": "c. 1900 BCE",
        "headquarters": "Uruk and Ur",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Sumerian city-states",
          "start": -3300,
          "end": -1900,
          "description": "City-states such as Uruk, Ur, Lagash and Nippur developed writing, temples, schools and law codes."
        }
      ],
      "why": "Writing, cities, schools and codified law, the foundations of civilisation, first appear in its record."
    },
    {
      "slug": "ancient-egypt",
      "name": "Ancient Egypt",
      "type": "organization",
      "wiki": "Ancient Egypt",
      "description": "Ancient Egypt was the pharaonic civilisation of the lower Nile, from the unification of Upper and Lower Egypt to its annexation by Rome, which built the pyramids and wrote in hieroglyphs.",
      "metadata": {
        "founded_date": "c. 3100 BCE",
        "dissolved_date": "30 BCE",
        "headquarters": "Memphis and Thebes",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Pharaonic state",
          "start": -3100,
          "end": -30,
          "description": "Dynasties of pharaohs ruled the Nile valley through the Old, Middle and New Kingdoms and later periods."
        }
      ],
      "why": "It produced one of the first writing systems, monumental architecture, the solar calendar and medicine that later civilisations inherited."
    },
    {
      "slug": "akkadian-empire",
      "name": "Akkadian Empire",
      "type": "organization",
      "wiki": "Akkadian Empire",
      "description": "The Akkadian Empire was the first empire to unite the Akkadian- and Sumerian-speaking peoples of Mesopotamia under a single dynasty.",
      "metadata": {
        "founded_date": "c. 2334 BCE",
        "dissolved_date": "c. 2154 BCE",
        "headquarters": "Akkad",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Akkadian dynasty",
          "start": -2334,
          "end": -2154,
          "description": "Sargon and his successors ruled Mesopotamia and campaigned into Syria, Anatolia and Elam."
        }
      ],
      "why": "It set the pattern of imperial rule in the Near East and made Akkadian the region's language of diplomacy for two millennia."
    },
    {
      "slug": "sargon-of-akkad",
      "name": "Sargon of Akkad",
      "type": "person",
      "wiki": "Sargon of Akkad",
      "description": "Sargon of Akkad conquered the Sumerian city-states and founded the Akkadian Empire, the first empire to unite Mesopotamia under one ruler.",
      "metadata": {
        "nationality": "Akkadian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -2334,
          "end": -2279,
          "description": "Conquered Sumer and campaigned from the Persian Gulf to the Mediterranean."
        }
      ],
      "why": "He created the first known multi-ethnic empire, a model invoked by Mesopotamian rulers for two thousand years."
    },
    {
      "slug": "enheduanna",
      "name": "Enheduanna",
      "type": "person",
      "wiki": "Enheduanna",
      "description": "Enheduanna was the high priestess of the moon god Nanna at Ur, daughter of Sargon of Akkad, and the earliest known author identified by name.",
      "metadata": {
        "nationality": "Akkadian"
      },
      "periods": [
        {
          "label": "High priestess at Ur",
          "start": -2285,
          "end": -2250,
          "description": "Composed hymns to Inanna and the temple hymns that joined Sumerian and Akkadian religion."
        }
      ],
      "why": "As the first named author in history, she marks the beginning of literature attributed to an individual."
    },
    {
      "slug": "gilgamesh",
      "name": "Gilgamesh",
      "type": "person",
      "wiki": "Gilgamesh",
      "description": "Gilgamesh was a legendary king of Uruk and the hero of the Epic of Gilgamesh, the oldest surviving epic poem, which contains a flood story parallel to the one in Genesis.",
      "metadata": {
        "nationality": "Sumerian"
      },
      "periods": [
        {
          "label": "Mesopotamian epic tradition",
          "start": -2100,
          "end": -100,
          "description": "Sumerian poems and the Akkadian epic of his deeds were copied and retold across the Near East."
        },
        {
          "label": "Rediscovered epic",
          "start": 1872,
          "end": 2026,
          "description": "George Smith's 1872 translation of the flood tablet returned the epic to world literature."
        }
      ],
      "why": "His epic is the earliest surviving story of mortality and friendship, and its flood narrative is the oldest known parallel to Noah."
    },
    {
      "slug": "maya-civilization",
      "name": "Maya civilization",
      "type": "organization",
      "wiki": "Maya civilization",
      "description": "The Maya civilization was a Mesoamerican civilisation of city-states that developed the most complete writing system of the pre-Columbian Americas, positional numbers with zero, and the Long Count calendar.",
      "metadata": {
        "founded_date": "c. 2000 BCE",
        "dissolved_date": "1697",
        "headquarters": "Yucatán Peninsula",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Preclassic and Classic city-states",
          "start": -2000,
          "end": 900,
          "description": "Kingdoms such as El Mirador, Tikal, Calakmul and Palenque built cities, monuments and inscriptions."
        },
        {
          "label": "Postclassic states",
          "start": 900,
          "end": 1697,
          "description": "Northern centres such as Chichen Itza and Mayapan flourished until the Spanish conquest of Nojpetén."
        }
      ],
      "why": "It developed the Americas' most complete writing system and an independent concept of zero, and its languages are still spoken by millions."
    },
    {
      "slug": "abraham",
      "name": "Abraham",
      "type": "person",
      "wiki": "Abraham",
      "description": "Abraham is the patriarch of the Hebrew Bible whose covenant with God founds Judaism and who is revered as a forefather in Christianity and Islam.",
      "metadata": {
        "nationality": "Hebrew"
      },
      "periods": [
        {
          "label": "Patriarch in biblical tradition",
          "start": -1900,
          "end": -1800,
          "description": "Genesis tells of his migration from Ur to Canaan and his covenant with God."
        }
      ],
      "why": "Judaism, Christianity and Islam all trace their faith to him and are named the Abrahamic religions after him."
    },
    {
      "slug": "shang-dynasty",
      "name": "Shang dynasty",
      "type": "organization",
      "wiki": "Shang dynasty",
      "description": "The Shang dynasty ruled the Yellow River valley and left the oracle bone inscriptions, the earliest known Chinese writing, along with bronze ritual vessels.",
      "metadata": {
        "founded_date": "c. 1600 BCE",
        "dissolved_date": "1046 BCE",
        "headquarters": "Yin (Anyang)",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Shang rule",
          "start": -1600,
          "end": -1046,
          "description": "Kings ruled through ancestor worship, divination and bronze-age warfare."
        }
      ],
      "why": "Its script is the direct ancestor of the Chinese characters used by over a billion people today."
    },
    {
      "slug": "bantu-expansion",
      "name": "Bantu expansion",
      "type": "event",
      "wiki": "Bantu expansion",
      "description": "The Bantu expansion was a series of migrations of Bantu-speaking farmers from West-Central Africa across Central, Eastern and Southern Africa, spreading agriculture, iron working and the Bantu languages.",
      "metadata": {
        "start_date": "c. 1500 BCE",
        "end_date": "c. 500",
        "location": "Sub-Saharan Africa",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Migrations",
          "start": -1500,
          "end": 500,
          "description": "Farming communities moved through the rainforest and savanna to East and Southern Africa."
        }
      ],
      "why": "It shaped the languages and peoples of most of sub-Saharan Africa, where hundreds of millions speak Bantu languages today."
    },
    {
      "slug": "hinduism",
      "name": "Hinduism",
      "type": "organization",
      "wiki": "Hinduism",
      "description": "Hinduism is a family of Indian religious traditions grounded in the Vedas, dharma, karma and rebirth, and is the world's third-largest religion.",
      "metadata": {
        "founded_date": "c. 1500 BCE",
        "headquarters": "Indian subcontinent",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Vedic religion",
          "start": -1500,
          "end": -500,
          "description": "Vedic hymns and sacrificial ritual formed the oldest layer of the tradition."
        },
        {
          "label": "Classical and living Hinduism",
          "start": -500,
          "end": 2026,
          "description": "The epics, Puranas, temple worship and devotional movements shaped Hindu practice."
        }
      ],
      "why": "Over a billion people practise it, and it shaped the culture, law and philosophy of South and Southeast Asia."
    },
    {
      "slug": "hatshepsut",
      "name": "Hatshepsut",
      "type": "person",
      "wiki": "Hatshepsut",
      "description": "Hatshepsut was a pharaoh of the Eighteenth Dynasty who ruled Egypt in her own right, sponsored the trading expedition to Punt, and built the temple at Deir el-Bahari.",
      "metadata": {
        "birth_date": "c. 1507 BCE",
        "death_date": "1458 BCE",
        "nationality": "Egyptian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -1479,
          "end": -1458,
          "description": "Ruled as regent for Thutmose III and then as crowned pharaoh."
        }
      ],
      "why": "She is the best-documented woman to rule an ancient state as a full monarch, and her reign was among Egypt's most prosperous."
    },
    {
      "slug": "late-bronze-age-collapse",
      "name": "Late Bronze Age collapse",
      "type": "event",
      "wiki": "Late Bronze Age collapse",
      "description": "The Late Bronze Age collapse was the destruction of palace states across the eastern Mediterranean and Near East in the 12th century BCE, including the Hittite Empire and Mycenaean Greece.",
      "metadata": {
        "start_date": "c. 1200 BCE",
        "end_date": "c. 1150 BCE",
        "location": "Eastern Mediterranean and Near East",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Collapse",
          "start": -1200,
          "end": -1150,
          "description": "Cities were destroyed, trade networks failed and the Hittite and Mycenaean states disappeared."
        }
      ],
      "why": "It ended the Bronze Age world and opened the Iron Age in which Greece, Israel and Phoenicia took shape."
    },
    {
      "slug": "olmecs",
      "name": "Olmecs",
      "type": "organization",
      "wiki": "Olmecs",
      "description": "The Olmecs were the earliest major civilisation of Mesoamerica, on the Gulf Coast of Mexico, known for colossal stone heads and early forms of the ballgame, calendar and writing.",
      "metadata": {
        "founded_date": "c. 1200 BCE",
        "dissolved_date": "c. 400 BCE",
        "headquarters": "San Lorenzo and La Venta",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Olmec centres",
          "start": -1200,
          "end": -400,
          "description": "San Lorenzo and then La Venta led a culture whose art and ritual spread across Mesoamerica."
        }
      ],
      "why": "Later Mesoamerican cultures, from the Maya to the Aztecs, inherited its religion, art and calendar."
    },
    {
      "slug": "zoroaster",
      "name": "Zoroaster",
      "type": "person",
      "wiki": "Zoroaster",
      "description": "Zoroaster was an Iranian prophet who composed the Gathas and founded Zoroastrianism, teaching a cosmic struggle between good and evil, a final judgement and an afterlife.",
      "metadata": {
        "nationality": "Iranian"
      },
      "periods": [
        {
          "label": "Prophetic ministry",
          "start": -1100,
          "end": -1000,
          "description": "Preached a reform of ancient Iranian religion centred on Ahura Mazda."
        }
      ],
      "why": "His ideas of heaven, hell, judgement and a saviour passed into Judaism, Christianity and Islam."
    },
    {
      "slug": "kingdom-of-kush",
      "name": "Kingdom of Kush",
      "type": "organization",
      "wiki": "Kingdom of Kush",
      "description": "The Kingdom of Kush was a Nubian state on the Nile whose kings ruled Egypt as the Twenty-fifth Dynasty and whose later capital, Meroë, was a centre of iron working and the Meroitic script.",
      "metadata": {
        "founded_date": "c. 1070 BCE",
        "dissolved_date": "c. 350",
        "headquarters": "Napata and Meroë",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Kushite kingdom",
          "start": -1070,
          "end": 350,
          "description": "Ruled Nubia from Napata and then Meroë, and for a time Egypt itself."
        }
      ],
      "why": "It was the first great state of sub-Saharan Africa and ruled Egypt itself as the Twenty-fifth Dynasty."
    },
    {
      "slug": "phoenician-alphabet",
      "name": "Phoenician alphabet",
      "type": "event",
      "wiki": "Phoenician alphabet",
      "description": "The Phoenician alphabet was a 22-letter consonantal script developed in the Levant and spread by Phoenician traders across the Mediterranean.",
      "metadata": {
        "start_date": "c. 1050 BCE",
        "end_date": "c. 150 BCE",
        "location": "Phoenicia (Levant)",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Development and spread",
          "start": -1050,
          "end": -150,
          "description": "Phoenician scribes and traders carried the alphabet to Greece, Anatolia, North Africa and Spain."
        }
      ],
      "why": "It is the ancestor of the Greek, Latin, Cyrillic, Hebrew and Arabic alphabets used by most of humanity."
    },
    {
      "slug": "zhou-dynasty",
      "name": "Zhou dynasty",
      "type": "organization",
      "wiki": "Zhou dynasty",
      "description": "The Zhou dynasty was the longest-ruling Chinese dynasty, which introduced the Mandate of Heaven and under which Confucianism, Taoism and the Hundred Schools of Thought arose.",
      "metadata": {
        "founded_date": "1046 BCE",
        "dissolved_date": "256 BCE",
        "headquarters": "Haojing and Luoyi",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Zhou rule",
          "start": -1046,
          "end": -256,
          "description": "Ruled through a system of vassal states that fragmented in the Spring and Autumn and Warring States periods."
        }
      ],
      "why": "The classics, rituals and political ideas of Chinese civilisation took their lasting form under the Zhou."
    },
    {
      "slug": "king-david",
      "name": "David",
      "type": "person",
      "wiki": "David",
      "description": "David was the second king of the united Kingdom of Israel who, according to the Hebrew Bible, made Jerusalem its capital and founded the royal line from which the Messiah is expected.",
      "metadata": {
        "nationality": "Israelite"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -1010,
          "end": -970,
          "description": "Ruled Judah and Israel and established Jerusalem as the political and religious centre."
        }
      ],
      "why": "Jerusalem's sacred status, the Psalms and the messianic hope of Judaism and Christianity all trace back to him."
    },
    {
      "slug": "zoroastrianism",
      "name": "Zoroastrianism",
      "type": "organization",
      "wiki": "Zoroastrianism",
      "description": "Zoroastrianism is an Iranian religion based on the teachings of Zoroaster that worships Ahura Mazda and was the dominant faith of three Persian empires.",
      "metadata": {
        "founded_date": "c. 1000 BCE",
        "headquarters": "Iran",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Religion of ancient Iran",
          "start": -1000,
          "end": 651,
          "description": "Was the dominant faith of the Achaemenid, Parthian and Sasanian empires."
        },
        {
          "label": "Iranian and Parsi communities",
          "start": 651,
          "end": 2026,
          "description": "Survived as a minority faith in Iran and among the Parsis of India."
        }
      ],
      "why": "Its dualism, angels, final judgement and messianic saviour passed into Judaism, Christianity and Islam."
    },
    {
      "slug": "neo-assyrian-empire",
      "name": "Neo-Assyrian Empire",
      "type": "organization",
      "wiki": "Neo-Assyrian Empire",
      "description": "The Neo-Assyrian Empire was a Mesopotamian empire that conquered the Near East from Iran to Egypt, deported subject peoples including the northern Israelites, and kept the library of Ashurbanipal at Nineveh.",
      "metadata": {
        "founded_date": "911 BCE",
        "dissolved_date": "609 BCE",
        "headquarters": "Nineveh",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Imperial era",
          "start": -911,
          "end": -609,
          "description": "Assyrian kings built a professional army and provincial system that ruled the Near East."
        }
      ],
      "why": "It was the largest empire the world had yet seen, and its destruction of Israel and siege of Jerusalem shaped the Hebrew Bible."
    },
    {
      "slug": "ancient-carthage",
      "name": "Carthage",
      "type": "organization",
      "wiki": "Ancient Carthage",
      "description": "Carthage was a Phoenician city-state in North Africa that built a maritime empire across the western Mediterranean until Rome destroyed it in 146 BCE.",
      "metadata": {
        "founded_date": "814 BCE",
        "dissolved_date": "146 BCE",
        "headquarters": "Carthage",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Carthaginian state",
          "start": -814,
          "end": -146,
          "description": "Traded and colonised across North Africa, Sicily, Sardinia and Spain."
        }
      ],
      "why": "Its rivalry with Rome in the Punic Wars decided which power would shape the Mediterranean world."
    },
    {
      "slug": "ancient-olympic-games",
      "name": "Ancient Olympic Games",
      "type": "organization",
      "wiki": "Ancient Olympic Games",
      "description": "The ancient Olympic Games were athletic and religious festivals held every four years at Olympia in honour of Zeus, from 776 BCE until their suppression under Theodosius I.",
      "metadata": {
        "founded_date": "776 BCE",
        "dissolved_date": "393",
        "headquarters": "Olympia",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Olympic festivals",
          "start": -776,
          "end": 393,
          "description": "Athletes from across the Greek world competed under a sacred truce."
        }
      ],
      "why": "They united the Greek world through competition and inspired the modern Olympic Games, the world's largest sporting event."
    },
    {
      "slug": "sappho",
      "name": "Sappho",
      "type": "person",
      "wiki": "Sappho",
      "description": "Sappho was a lyric poet from Lesbos whose poems of love and desire the ancient Greeks ranked alongside Homer.",
      "metadata": {
        "birth_date": "c. 630 BCE",
        "death_date": "c. 570 BCE",
        "nationality": "Greek (Lesbos)"
      },
      "periods": [
        {
          "label": "Poetic career",
          "start": -610,
          "end": -570,
          "description": "Composed lyric poetry for performance on Lesbos."
        }
      ],
      "why": "She shaped Western lyric poetry, and the words sapphic and lesbian derive from her name and island."
    },
    {
      "slug": "babylonian-captivity",
      "name": "Babylonian captivity",
      "type": "event",
      "wiki": "Babylonian captivity",
      "description": "The Babylonian captivity was the exile of Judeans to Babylon after Nebuchadnezzar II conquered Jerusalem and destroyed Solomon's Temple, ended by Cyrus the Great.",
      "metadata": {
        "start_date": "597 BCE",
        "end_date": "538 BCE",
        "location": "Babylon",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Exile in Babylon",
          "start": -597,
          "end": -538,
          "description": "Judean elites lived in Babylonia until Cyrus allowed their return."
        }
      ],
      "why": "In exile the Judeans compiled much of the Hebrew Bible and turned a temple cult into the text-centred religion of Judaism."
    },
    {
      "slug": "cyrus-the-great",
      "name": "Cyrus the Great",
      "type": "person",
      "wiki": "Cyrus the Great",
      "description": "Cyrus II founded the Achaemenid Empire, conquering Media, Lydia and Babylon, and permitted the exiled Judeans to return and rebuild the Temple in Jerusalem.",
      "metadata": {
        "birth_date": "c. 600 BCE",
        "death_date": "530 BCE",
        "nationality": "Persian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -559,
          "end": -530,
          "description": "Built an empire stretching from Anatolia to Central Asia."
        }
      ],
      "why": "He created the first world empire and its model of tolerant imperial rule, and ended the Babylonian exile of the Jews."
    },
    {
      "slug": "mahavira",
      "name": "Mahavira",
      "type": "person",
      "wiki": "Mahavira",
      "description": "Mahavira was the 24th Tirthankara of Jainism, who reformed and organised the Jain community on the vows of nonviolence, truthfulness, non-stealing, chastity and non-possession.",
      "metadata": {
        "birth_date": "c. 599 BCE",
        "death_date": "c. 527 BCE",
        "nationality": "Indian (Vajji)"
      },
      "periods": [
        {
          "label": "Ministry",
          "start": -557,
          "end": -527,
          "description": "Taught across the Ganges plain after attaining omniscience and organised monks, nuns and lay followers."
        }
      ],
      "why": "His doctrine of ahimsa shaped Jainism, Indian ethics and, through Gandhi, modern nonviolent politics."
    },
    {
      "slug": "achaemenid-empire",
      "name": "Achaemenid Empire",
      "type": "organization",
      "wiki": "Achaemenid Empire",
      "description": "The Achaemenid Empire was the first Persian Empire, founded by Cyrus the Great, stretching from the Balkans and Egypt to the Indus valley.",
      "metadata": {
        "founded_date": "550 BCE",
        "dissolved_date": "330 BCE",
        "headquarters": "Persepolis, Susa and Pasargadae",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Imperial era",
          "start": -550,
          "end": -330,
          "description": "Ruled a multi-ethnic empire through satraps, royal roads and a common administrative language."
        }
      ],
      "why": "It pioneered provincial administration, royal roads and religious tolerance across a multi-ethnic empire that later states imitated."
    },
    {
      "slug": "laozi",
      "name": "Laozi",
      "type": "person",
      "wiki": "Laozi",
      "description": "Laozi was a Chinese sage of the Zhou court, author of the Tao Te Ching and the founding figure of Taoism, venerated as a deity in Taoist religion.",
      "metadata": {
        "birth_date": "6th century BCE",
        "nationality": "Chinese (Zhou dynasty)"
      },
      "periods": [
        {
          "label": "Archivist and sage",
          "start": -550,
          "end": -500,
          "description": "Kept the archives of the Zhou court and taught the doctrine of the Tao."
        }
      ],
      "why": "The Tao Te Ching is among the most translated books in the world and grounds Taoism and much of East Asian thought."
    },
    {
      "slug": "pythagoras",
      "name": "Pythagoras",
      "type": "person",
      "wiki": "Pythagoras",
      "description": "Pythagoras was a Greek philosopher from Samos who founded a religious and mathematical community at Croton and taught that number underlies the order of the cosmos.",
      "metadata": {
        "birth_date": "c. 570 BCE",
        "death_date": "c. 495 BCE",
        "nationality": "Greek (Samos)"
      },
      "periods": [
        {
          "label": "School at Croton",
          "start": -530,
          "end": -495,
          "description": "Led the Pythagorean brotherhood in southern Italy."
        }
      ],
      "why": "The theorem named after him and the idea of a mathematical universe run from Plato to modern physics."
    },
    {
      "slug": "jainism",
      "name": "Jainism",
      "type": "organization",
      "wiki": "Jainism",
      "description": "Jainism is an Indian religion that teaches liberation of the soul through strict nonviolence, truth and non-possession, guided by twenty-four Tirthankaras.",
      "metadata": {
        "founded_date": "6th century BCE",
        "headquarters": "India",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Religious community",
          "start": -527,
          "end": 2026,
          "description": "Monastic orders and lay communities preserved Jain doctrine across India."
        }
      ],
      "why": "Its ethic of ahimsa influenced Indian vegetarianism, Gandhi's nonviolence and modern animal ethics."
    },
    {
      "slug": "darius-the-great",
      "name": "Darius the Great",
      "type": "person",
      "wiki": "Darius the Great",
      "description": "Darius I reorganised the Achaemenid Empire into satrapies, built the Royal Road, introduced standard gold coinage, and launched the first Persian invasion of Greece.",
      "metadata": {
        "birth_date": "c. 550 BCE",
        "death_date": "486 BCE",
        "nationality": "Persian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -522,
          "end": -486,
          "description": "Consolidated and administered the Achaemenid Empire at its greatest extent."
        }
      ],
      "why": "His administrative system became the template for later empires, and his war on Athens began the Greco-Persian conflict."
    },
    {
      "slug": "sun-tzu",
      "name": "Sun Tzu",
      "type": "person",
      "wiki": "Sun Tzu",
      "description": "Sun Tzu was a general of the state of Wu and the author of The Art of War, a treatise on military strategy.",
      "metadata": {
        "birth_date": "544 BCE",
        "death_date": "496 BCE",
        "nationality": "Chinese (Qi, Wu)"
      },
      "periods": [
        {
          "label": "Service to King Helü of Wu",
          "start": -512,
          "end": -496,
          "description": "Commanded Wu armies and set down the principles of The Art of War."
        }
      ],
      "why": "The Art of War shaped East Asian warfare for two millennia and remains standard reading in military and business strategy."
    },
    {
      "slug": "roman-republic",
      "name": "Roman Republic",
      "type": "organization",
      "wiki": "Roman Republic",
      "description": "The Roman Republic was the state of ancient Rome governed by elected magistrates and a senate, which conquered the Mediterranean before civil wars turned it into an empire.",
      "metadata": {
        "founded_date": "509 BCE",
        "dissolved_date": "27 BCE",
        "headquarters": "Rome",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Republican Rome",
          "start": -509,
          "end": -27,
          "description": "Consuls, senate and assemblies governed Rome as it conquered Italy and the Mediterranean."
        }
      ],
      "why": "Its senate, consuls, checks on power and law became the model for modern republics, including the United States."
    },
    {
      "slug": "athenian-democracy",
      "name": "Athenian democracy",
      "type": "organization",
      "wiki": "Athenian democracy",
      "description": "Athenian democracy was the government of classical Athens in which adult male citizens voted directly in the Assembly and served on councils and juries chosen by lot.",
      "metadata": {
        "founded_date": "508 BCE",
        "dissolved_date": "322 BCE",
        "headquarters": "Athens",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Democratic Athens",
          "start": -508,
          "end": -322,
          "description": "The Assembly, Council and popular courts governed Athens until Macedon abolished the democracy."
        }
      ],
      "why": "It was the first known democracy, and the word and idea of rule by the people descend from it."
    },
    {
      "slug": "cleisthenes",
      "name": "Cleisthenes",
      "type": "person",
      "wiki": "Cleisthenes",
      "description": "Cleisthenes was an Athenian statesman who in 508 BCE reorganised the citizen body into ten tribes and created the institutions of Athenian democracy.",
      "metadata": {
        "birth_date": "c. 570 BCE",
        "nationality": "Athenian"
      },
      "periods": [
        {
          "label": "Democratic reforms",
          "start": -508,
          "end": -507,
          "description": "Reorganised the Athenian tribes, created the Council of Five Hundred and introduced ostracism."
        }
      ],
      "why": "Called the father of Athenian democracy, he built the first system of government by citizen assembly."
    },
    {
      "slug": "greco-persian-wars",
      "name": "Greco-Persian Wars",
      "type": "event",
      "wiki": "Greco-Persian Wars",
      "description": "The Greco-Persian Wars were a series of conflicts in which Athens, Sparta and allied Greek city-states repelled Achaemenid invasions at Marathon, Thermopylae, Salamis and Plataea.",
      "metadata": {
        "start_date": "499 BCE",
        "end_date": "449 BCE",
        "location": "Greece, Aegean and Anatolia",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Wars",
          "start": -499,
          "end": -449,
          "description": "From the Ionian Revolt to the Peace of Callias, Greek states fought the Persian Empire."
        }
      ],
      "why": "Greek victory preserved the independent city-states whose culture became the basis of Western civilisation."
    },
    {
      "slug": "confucianism",
      "name": "Confucianism",
      "type": "organization",
      "wiki": "Confucianism",
      "description": "Confucianism is a system of ethical and political thought based on the teachings of Confucius, which served as the official ideology of the Chinese state from the Han dynasty into the 20th century.",
      "metadata": {
        "founded_date": "5th century BCE",
        "headquarters": "China",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Confucian tradition",
          "start": -479,
          "end": 2026,
          "description": "Scholars transmitted and expanded Confucian teaching, which became state orthodoxy and the basis of the imperial examinations."
        }
      ],
      "why": "It governed the state, family and education of China, Korea, Vietnam and Japan for two thousand years."
    },
    {
      "slug": "warring-states-period",
      "name": "Warring States period",
      "type": "event",
      "wiki": "Warring States period",
      "description": "The Warring States period was an era of war among seven Chinese states, marked by mass infantry armies and iron tools, that ended with Qin's unification of China.",
      "metadata": {
        "start_date": "475 BCE",
        "end_date": "221 BCE",
        "location": "China",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Warring States",
          "start": -475,
          "end": -221,
          "description": "Seven major states fought for supremacy until Qin conquered the rest."
        }
      ],
      "why": "Its competition produced the Hundred Schools of Thought and the centralised state that became imperial China."
    },
    {
      "slug": "pericles",
      "name": "Pericles",
      "type": "person",
      "wiki": "Pericles",
      "description": "Pericles was the leading statesman of Athens at the height of its power, who extended its democracy, built the Parthenon, and led Athens into the Peloponnesian War.",
      "metadata": {
        "birth_date": "c. 495 BCE",
        "death_date": "429 BCE",
        "nationality": "Athenian"
      },
      "periods": [
        {
          "label": "Leadership of Athens",
          "start": -461,
          "end": -429,
          "description": "Dominated Athenian politics, the Delian League and the building programme on the Acropolis."
        }
      ],
      "why": "His Athens produced the Parthenon, drama and philosophy that became the reference point for Western civic culture."
    },
    {
      "slug": "twelve-tables",
      "name": "Twelve Tables",
      "type": "event",
      "wiki": "Twelve Tables",
      "description": "The Law of the Twelve Tables was the first written code of Roman law, displayed publicly in the Roman Forum.",
      "metadata": {
        "start_date": "451 BCE",
        "end_date": "450 BCE",
        "location": "Rome",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Codification",
          "start": -451,
          "end": -450,
          "description": "Commissions of ten men drafted and published the laws."
        }
      ],
      "why": "It began the Roman legal tradition from which the civil law systems of most of the world descend."
    },
    {
      "slug": "herodotus",
      "name": "Herodotus",
      "type": "person",
      "wiki": "Herodotus",
      "description": "Herodotus of Halicarnassus wrote the Histories, an inquiry into the Greco-Persian Wars and the first major prose work of history in the Western tradition.",
      "metadata": {
        "birth_date": "c. 484 BCE",
        "death_date": "c. 425 BCE",
        "nationality": "Greek (Halicarnassus)"
      },
      "periods": [
        {
          "label": "Travels and the Histories",
          "start": -450,
          "end": -425,
          "description": "Travelled through the eastern Mediterranean gathering material and wrote the Histories."
        }
      ],
      "why": "Called the father of history, he founded history as a written discipline of inquiry."
    },
    {
      "slug": "hippocrates",
      "name": "Hippocrates",
      "type": "person",
      "wiki": "Hippocrates",
      "description": "Hippocrates of Kos was a Greek physician who taught that disease has natural rather than divine causes, and whose school produced the Hippocratic Corpus and Oath.",
      "metadata": {
        "birth_date": "c. 460 BCE",
        "death_date": "c. 370 BCE",
        "nationality": "Greek (Kos)"
      },
      "periods": [
        {
          "label": "Medical practice and teaching",
          "start": -440,
          "end": -370,
          "description": "Practised and taught medicine at Kos and across Greece."
        }
      ],
      "why": "Known as the father of medicine, his oath and clinical method still frame medical ethics."
    },
    {
      "slug": "peloponnesian-war",
      "name": "Peloponnesian War",
      "type": "event",
      "wiki": "Peloponnesian War",
      "description": "The Peloponnesian War was a war between Athens and its empire and the Spartan-led Peloponnesian League that ended in the defeat of Athens.",
      "metadata": {
        "start_date": "431 BCE",
        "end_date": "404 BCE",
        "location": "Ancient Greece",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "War",
          "start": -431,
          "end": -404,
          "description": "Athens and Sparta fought across Greece, Sicily and the Aegean until Athens surrendered."
        }
      ],
      "why": "It ended Athens's imperial age and, through Thucydides' account, became the founding case study of power politics."
    },
    {
      "slug": "krishna",
      "name": "Krishna",
      "type": "person",
      "wiki": "Krishna",
      "description": "Krishna is a major Hindu deity, worshipped as the eighth avatar of Vishnu and as the Supreme God, and is the teacher of the Bhagavad Gita in the Mahabharata.",
      "metadata": {
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Worship and devotional tradition",
          "start": -400,
          "end": 2026,
          "description": "Worshipped as Vasudeva-Krishna, celebrated in the epics and Puranas, and central to the bhakti movements and the Hare Krishna movement."
        }
      ],
      "why": "As speaker of the Bhagavad Gita and object of bhakti devotion he shapes the religious life of hundreds of millions."
    },
    {
      "slug": "panini",
      "name": "Pāṇini",
      "type": "person",
      "wiki": "Pāṇini",
      "description": "Pāṇini was a Sanskrit grammarian whose Aṣṭādhyāyī described the Sanskrit language in a complete system of formal rules.",
      "metadata": {
        "nationality": "Indian (Gandhara)"
      },
      "periods": [
        {
          "label": "Composition of the Aṣṭādhyāyī",
          "start": -400,
          "end": -350,
          "description": "Codified Sanskrit grammar in a generative system of rules."
        }
      ],
      "why": "His grammar fixed Classical Sanskrit and anticipated formal linguistics and the notation of computer languages."
    },
    {
      "slug": "taoism",
      "name": "Taoism",
      "type": "organization",
      "wiki": "Taoism",
      "description": "Taoism is a Chinese philosophical and religious tradition centred on living in harmony with the Tao, organised as a religion from the Celestial Masters movement of the 2nd century CE.",
      "metadata": {
        "founded_date": "4th century BCE",
        "headquarters": "China",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Philosophical Taoism",
          "start": -400,
          "end": 142,
          "description": "The Tao Te Ching and Zhuangzi set out its teachings."
        },
        {
          "label": "Religious Taoism",
          "start": 142,
          "end": 2026,
          "description": "Zhang Daoling's Way of the Celestial Masters began organised Taoist religion with priests, temples and scriptures."
        }
      ],
      "why": "It shaped Chinese medicine, martial arts, alchemy, art and folk religion, and Chan Buddhism."
    },
    {
      "slug": "mencius",
      "name": "Mencius",
      "type": "person",
      "wiki": "Mencius",
      "description": "Mencius was a Confucian philosopher who argued that human nature is good and that rulers who neglect the people forfeit the Mandate of Heaven.",
      "metadata": {
        "birth_date": "372 BCE",
        "death_date": "289 BCE",
        "nationality": "Chinese (Zou)"
      },
      "periods": [
        {
          "label": "Teaching and travels to the courts",
          "start": -350,
          "end": -289,
          "description": "Advised rulers of the Warring States and taught the doctrines collected in the Mencius."
        }
      ],
      "why": "Ranked second only to Confucius, his book was one of the Four Books required for the imperial examinations from 1313 to 1905."
    },
    {
      "slug": "zhuang-zhou",
      "name": "Zhuang Zhou (Zhuangzi)",
      "type": "person",
      "wiki": "Zhuang Zhou",
      "description": "Zhuang Zhou was a Chinese philosopher of the Warring States period and author of the Zhuangzi, one of the two foundational texts of Taoism.",
      "metadata": {
        "birth_date": "c. 369 BCE",
        "death_date": "c. 286 BCE",
        "nationality": "Chinese (Song)"
      },
      "periods": [
        {
          "label": "Philosophical career",
          "start": -340,
          "end": -286,
          "description": "Wrote parables on spontaneity, relativity and freedom from convention."
        }
      ],
      "why": "His work shaped Taoism, Chan and Zen Buddhism, and Chinese literature and painting."
    },
    {
      "slug": "chanakya",
      "name": "Chanakya",
      "type": "person",
      "wiki": "Chanakya",
      "description": "Chanakya was a teacher and minister who guided Chandragupta Maurya to power and wrote the Arthashastra, a treatise on statecraft and economics.",
      "metadata": {
        "birth_date": "c. 375 BCE",
        "death_date": "c. 283 BCE",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Adviser to Chandragupta",
          "start": -325,
          "end": -297,
          "description": "Planned the overthrow of the Nandas and served as chief minister of the new Maurya state."
        }
      ],
      "why": "The Arthashastra is the founding text of Indian political theory, and his name is a byword for statecraft in South Asia."
    },
    {
      "slug": "chandragupta-maurya",
      "name": "Chandragupta Maurya",
      "type": "person",
      "wiki": "Chandragupta Maurya",
      "description": "Chandragupta Maurya overthrew the Nanda dynasty, founded the Maurya Empire and united most of the Indian subcontinent for the first time.",
      "metadata": {
        "birth_date": "c. 340 BCE",
        "death_date": "c. 295 BCE",
        "nationality": "Indian (Magadha)"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -322,
          "end": -297,
          "description": "Conquered Magadha and the northwest and made a treaty with Seleucus I."
        }
      ],
      "why": "He built the first empire to unify most of India, the base for Ashoka's spread of Buddhism."
    },
    {
      "slug": "maurya-empire",
      "name": "Maurya Empire",
      "type": "organization",
      "wiki": "Maurya Empire",
      "description": "The Maurya Empire was the first empire to unify most of the Indian subcontinent, governed from Pataliputra and patron of Buddhism under Ashoka.",
      "metadata": {
        "founded_date": "322 BCE",
        "dissolved_date": "185 BCE",
        "headquarters": "Pataliputra",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Maurya rule",
          "start": -322,
          "end": -185,
          "description": "Ruled most of the subcontinent through a centralised bureaucracy and army."
        }
      ],
      "why": "It created India's first pan-subcontinental state and launched Buddhism's spread across Asia."
    },
    {
      "slug": "epicurus",
      "name": "Epicurus",
      "type": "person",
      "wiki": "Epicurus",
      "description": "Epicurus was a Greek philosopher who founded the Garden in Athens, teaching an atomist physics and an ethics of tranquil pleasure free from fear of the gods and death.",
      "metadata": {
        "birth_date": "341 BCE",
        "death_date": "270 BCE",
        "nationality": "Greek (Samos, Athens)"
      },
      "periods": [
        {
          "label": "The Garden in Athens",
          "start": -306,
          "end": -270,
          "description": "Led his school and community in Athens."
        }
      ],
      "why": "Through Lucretius his atomism and ethics fed Renaissance science, Enlightenment materialism and modern secular thought."
    },
    {
      "slug": "euclid",
      "name": "Euclid",
      "type": "person",
      "wiki": "Euclid",
      "description": "Euclid was a Greek mathematician at Alexandria whose Elements organised geometry and number theory into a system of axioms, definitions and proofs.",
      "metadata": {
        "nationality": "Greek (Alexandria)"
      },
      "periods": [
        {
          "label": "Work at Alexandria",
          "start": -300,
          "end": -270,
          "description": "Compiled the Elements under the early Ptolemies."
        }
      ],
      "why": "The Elements was the standard mathematics textbook until the early 20th century and set the model of deductive proof."
    },
    {
      "slug": "stoicism",
      "name": "Stoicism",
      "type": "organization",
      "wiki": "Stoicism",
      "description": "Stoicism was a school of Hellenistic philosophy founded in Athens that taught virtue as the sole good and acceptance of what lies outside one's control.",
      "metadata": {
        "founded_date": "c. 300 BCE",
        "headquarters": "Athens",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Ancient Stoic school",
          "start": -300,
          "end": 250,
          "description": "Taught in Athens and then Rome, through Seneca, Epictetus and Marcus Aurelius."
        }
      ],
      "why": "It shaped Roman law, Christian ethics and natural-law theory, and modern cognitive behavioural therapy draws on it."
    },
    {
      "slug": "zeno-of-citium",
      "name": "Zeno of Citium",
      "type": "person",
      "wiki": "Zeno of Citium",
      "description": "Zeno of Citium was a philosopher from Cyprus who founded the Stoic school, teaching at the Painted Porch in Athens.",
      "metadata": {
        "birth_date": "c. 334 BCE",
        "death_date": "c. 262 BCE",
        "nationality": "Greek (Citium, Cyprus)"
      },
      "periods": [
        {
          "label": "Teaching at the Stoa Poikile",
          "start": -300,
          "end": -262,
          "description": "Taught a philosophy of virtue, reason and acceptance of nature."
        }
      ],
      "why": "The Stoic school he founded shaped Roman ethics, Christian thought and natural law."
    },
    {
      "slug": "ashoka",
      "name": "Ashoka",
      "type": "person",
      "wiki": "Ashoka",
      "description": "Ashoka was the third emperor of the Maurya Empire who, after the Kalinga War, adopted Buddhism, issued rock and pillar edicts on moral conduct across the subcontinent, and sent Buddhist missions to Sri Lanka and beyond.",
      "metadata": {
        "birth_date": "c. 304 BCE",
        "death_date": "232 BCE",
        "nationality": "Mauryan (Indian)"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -268,
          "end": -232,
          "description": "Ruled most of the Indian subcontinent and spread Buddhism through edicts and missions."
        }
      ],
      "why": "His patronage turned Buddhism from a regional sect into a pan-Asian religion, and his lion capital is India's national emblem."
    },
    {
      "slug": "punic-wars",
      "name": "Punic Wars",
      "type": "event",
      "wiki": "Punic Wars",
      "description": "The Punic Wars were three wars between Rome and Carthage that ended with the destruction of Carthage and Roman control of the western Mediterranean.",
      "metadata": {
        "start_date": "264 BCE",
        "end_date": "146 BCE",
        "location": "Western Mediterranean",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Three wars",
          "start": -264,
          "end": -146,
          "description": "Rome and Carthage fought over Sicily, Spain, Italy and Africa."
        }
      ],
      "why": "Victory made Rome the dominant Mediterranean power and set it on the road to empire."
    },
    {
      "slug": "archimedes",
      "name": "Archimedes",
      "type": "person",
      "wiki": "Archimedes",
      "description": "Archimedes of Syracuse was a mathematician, physicist and engineer who calculated areas and volumes by the method of exhaustion, formulated the law of the lever and the principle of buoyancy, and designed war machines.",
      "metadata": {
        "birth_date": "c. 287 BCE",
        "death_date": "212 BCE",
        "nationality": "Greek (Syracuse)"
      },
      "periods": [
        {
          "label": "Scientific career",
          "start": -260,
          "end": -212,
          "description": "Worked in Syracuse and defended it against the Roman siege in which he died."
        }
      ],
      "why": "His methods anticipated integral calculus and his principles founded statics and hydrostatics."
    },
    {
      "slug": "hannibal",
      "name": "Hannibal",
      "type": "person",
      "wiki": "Hannibal",
      "description": "Hannibal Barca was a Carthaginian general who led an army with elephants over the Alps into Italy and destroyed Roman armies at Trebia, Lake Trasimene and Cannae in the Second Punic War.",
      "metadata": {
        "birth_date": "247 BCE",
        "death_date": "c. 183 BCE",
        "nationality": "Carthaginian"
      },
      "periods": [
        {
          "label": "Command in the Second Punic War",
          "start": -221,
          "end": -201,
          "description": "Commanded Carthage's forces in Spain and Italy until his defeat at Zama."
        },
        {
          "label": "Suffete and exile",
          "start": -196,
          "end": -183,
          "description": "Reformed Carthage's government and then advised Rome's enemies in the Hellenistic east."
        }
      ],
      "why": "Cannae is still studied as the model battle of encirclement, and his war set Rome on the path to Mediterranean dominance."
    },
    {
      "slug": "qin-dynasty",
      "name": "Qin dynasty",
      "type": "organization",
      "wiki": "Qin dynasty",
      "description": "The Qin dynasty was the first imperial dynasty of China, which unified the warring states and standardised script, currency, weights, measures and law.",
      "metadata": {
        "founded_date": "221 BCE",
        "dissolved_date": "206 BCE",
        "headquarters": "Xianyang",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Qin empire",
          "start": -221,
          "end": -206,
          "description": "Governed China through commanderies, roads, canals and walls under Legalist law."
        }
      ],
      "why": "It created the unified Chinese imperial state that lasted until 1912 and gave China its Western name."
    },
    {
      "slug": "emperor-gaozu-of-han",
      "name": "Liu Bang (Emperor Gaozu of Han)",
      "type": "person",
      "wiki": "Emperor Gaozu of Han",
      "description": "Liu Bang was a peasant-born rebel who defeated Xiang Yu after the fall of Qin and founded the Han dynasty as its first emperor.",
      "metadata": {
        "birth_date": "256 BCE",
        "death_date": "195 BCE",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Rebellion and reign",
          "start": -209,
          "end": -195,
          "description": "Rose against Qin, won the Chu-Han Contention and ruled as emperor from 202 BCE."
        }
      ],
      "why": "The dynasty he founded gave the Han Chinese, the world's largest ethnic group, their name."
    },
    {
      "slug": "han-dynasty",
      "name": "Han dynasty",
      "type": "organization",
      "wiki": "Han dynasty",
      "description": "The Han dynasty ruled China for four centuries, adopting Confucianism as state ideology, opening the Silk Road and producing paper.",
      "metadata": {
        "founded_date": "202 BCE",
        "dissolved_date": "220",
        "headquarters": "Chang'an and Luoyang",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Western Han",
          "start": -202,
          "end": 9,
          "description": "Ruled from Chang'an and expanded into Central Asia, Korea and Vietnam."
        },
        {
          "label": "Eastern Han",
          "start": 25,
          "end": 220,
          "description": "Ruled from Luoyang until the empire split into the Three Kingdoms."
        }
      ],
      "why": "Its institutions defined imperial China, and the Han Chinese, the world's largest ethnic group, take their name from it."
    },
    {
      "slug": "emperor-wu-of-han",
      "name": "Emperor Wu of Han",
      "type": "person",
      "wiki": "Emperor Wu of Han",
      "description": "Emperor Wu of Han made Confucianism the state ideology, expanded Han rule into Korea, Vietnam and Central Asia, fought the Xiongnu, and sent Zhang Qian to the western regions.",
      "metadata": {
        "birth_date": "156 BCE",
        "death_date": "87 BCE",
        "nationality": "Chinese (Han)"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -141,
          "end": -87,
          "description": "Centralised the state, founded the Imperial Academy and campaigned against the Xiongnu."
        }
      ],
      "why": "His reign fixed Confucian orthodoxy and the territorial and diplomatic shape of imperial China."
    },
    {
      "slug": "zhang-qian",
      "name": "Zhang Qian",
      "type": "person",
      "wiki": "Zhang Qian",
      "description": "Zhang Qian was a Han envoy whose missions to Central Asia brought China its first reports of the western regions and led to the opening of the Silk Road.",
      "metadata": {
        "death_date": "113 BCE",
        "nationality": "Chinese (Han)"
      },
      "periods": [
        {
          "label": "Missions to the western regions",
          "start": -138,
          "end": -115,
          "description": "Travelled to the Yuezhi, Bactria and Ferghana, and later to the Wusun."
        }
      ],
      "why": "His journeys linked China to Central Asia and the Mediterranean world, beginning two millennia of Silk Road exchange."
    },
    {
      "slug": "silk-road",
      "name": "Silk Road",
      "type": "event",
      "wiki": "Silk Road",
      "description": "The Silk Road was a network of overland trade routes linking China, Central Asia, Persia, India and the Mediterranean, carrying silk, spices, religions and technologies.",
      "metadata": {
        "start_date": "130 BCE",
        "end_date": "1453",
        "location": "Eurasia",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Trade network",
          "start": -130,
          "end": 1453,
          "description": "Caravans and merchants moved goods, ideas and peoples between East Asia and the Mediterranean."
        }
      ],
      "why": "It carried Buddhism, Christianity, Islam, paper and gunpowder across Eurasia, as well as the Black Death."
    },
    {
      "slug": "sima-qian",
      "name": "Sima Qian",
      "type": "person",
      "wiki": "Sima Qian",
      "description": "Sima Qian was the Grand Historian of the Han court who wrote the Records of the Grand Historian, a history of China from the Yellow Emperor to his own time.",
      "metadata": {
        "birth_date": "c. 145 BCE",
        "death_date": "c. 86 BCE",
        "nationality": "Chinese (Han)"
      },
      "periods": [
        {
          "label": "Grand Historian",
          "start": -108,
          "end": -86,
          "description": "Compiled the Shiji, completing it after his castration for defending a disgraced general."
        }
      ],
      "why": "His Shiji set the form of the official dynastic histories that China kept for two thousand years."
    },
    {
      "slug": "teotihuacan",
      "name": "Teotihuacan",
      "type": "organization",
      "wiki": "Teotihuacan",
      "description": "Teotihuacan was a city in the Valley of Mexico, among the largest in the world at its peak, whose Pyramids of the Sun and Moon and trade network dominated Mesoamerica.",
      "metadata": {
        "founded_date": "c. 100 BCE",
        "dissolved_date": "c. 550",
        "headquarters": "Valley of Mexico",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "City-state",
          "start": -100,
          "end": 550,
          "description": "Built monumental avenues and pyramids and projected power as far as the Maya lowlands."
        }
      ],
      "why": "It was the first great metropolis of the Americas, and its influence reached the Maya cities and the later Aztecs, who named it."
    },
    {
      "slug": "cicero",
      "name": "Cicero",
      "type": "person",
      "wiki": "Cicero",
      "description": "Cicero was a Roman statesman, lawyer and orator whose speeches, letters and philosophical works defined classical Latin prose and defended the Republic against Caesar and Antony.",
      "metadata": {
        "birth_date": "106 BCE",
        "death_date": "43 BCE",
        "nationality": "Roman"
      },
      "periods": [
        {
          "label": "Legal and political career",
          "start": -81,
          "end": -43,
          "description": "Pleaded in the courts, served as consul in 63 BCE and opposed the dictators of the late Republic."
        }
      ],
      "why": "His prose became the model of Latin style, and his republican and natural-law ideas shaped the Renaissance and the American founders."
    },
    {
      "slug": "cleopatra",
      "name": "Cleopatra",
      "type": "person",
      "wiki": "Cleopatra",
      "description": "Cleopatra VII was the last active ruler of Ptolemaic Egypt, whose alliances with Julius Caesar and Mark Antony ended in Egypt's annexation by Rome.",
      "metadata": {
        "birth_date": "69 BCE",
        "death_date": "30 BCE",
        "nationality": "Ptolemaic Egyptian (Macedonian Greek)"
      },
      "periods": [
        {
          "label": "Reign",
          "start": -51,
          "end": -30,
          "description": "Ruled Egypt and allied with Caesar and then Antony against Octavian."
        }
      ],
      "why": "Her fall closed three thousand years of pharaonic Egypt, and she remains one of the most retold figures in art, theatre and film."
    },
    {
      "slug": "virgil",
      "name": "Virgil",
      "type": "person",
      "wiki": "Virgil",
      "description": "Virgil was a Roman poet whose Aeneid gave Rome its national epic and whose Eclogues and Georgics shaped pastoral and didactic poetry.",
      "metadata": {
        "birth_date": "70 BCE",
        "death_date": "19 BCE",
        "nationality": "Roman"
      },
      "periods": [
        {
          "label": "Poetic career",
          "start": -42,
          "end": -19,
          "description": "Wrote the Eclogues, the Georgics and the Aeneid under the patronage of Augustus."
        }
      ],
      "why": "The Aeneid was the central text of Latin education for two millennia and Dante's guide through the Divine Comedy."
    },
    {
      "slug": "mary-mother-of-jesus",
      "name": "Mary, mother of Jesus",
      "type": "person",
      "wiki": "Mary, mother of Jesus",
      "description": "Mary was a Jewish woman of Nazareth and the mother of Jesus, venerated in Christianity as the Mother of God and honoured in Islam as the mother of the prophet Isa.",
      "metadata": {
        "nationality": "Jewish (Galilee)"
      },
      "periods": [
        {
          "label": "Life with Jesus",
          "start": -4,
          "end": 30,
          "description": "Raised Jesus in Nazareth and was present at his crucifixion."
        }
      ],
      "why": "Marian devotion shapes the prayer, art, pilgrimage and festivals of the Catholic and Orthodox churches worldwide."
    },
    {
      "slug": "hindu-arabic-numeral-system",
      "name": "Hindu–Arabic numeral system",
      "type": "event",
      "wiki": "Hindu–Arabic numeral system",
      "description": "The Hindu–Arabic numeral system is the decimal positional system with a symbol for zero that Indian mathematicians developed and that reached Europe through Arabic scholars.",
      "metadata": {
        "start_date": "1st century",
        "end_date": "5th century",
        "location": "India",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Development in India",
          "start": 1,
          "end": 500,
          "description": "Indian mathematicians combined the Brahmi digits with place value and a sign for zero."
        }
      ],
      "why": "It is the number system used by nearly every person, business and computer in the world today."
    },
    {
      "slug": "saint-peter",
      "name": "Saint Peter",
      "type": "person",
      "wiki": "Saint Peter",
      "description": "Peter was a Galilean fisherman who became the leading apostle of Jesus and is regarded by the Catholic Church as the first bishop of Rome.",
      "metadata": {
        "death_date": "c. 64",
        "nationality": "Jewish (Galilee)"
      },
      "periods": [
        {
          "label": "Apostleship",
          "start": 28,
          "end": 64,
          "description": "Followed Jesus, led the Jerusalem church, and preached in Antioch and Rome before his execution."
        }
      ],
      "why": "The papacy's claim to authority rests on succession from him, and St Peter's Basilica stands over his tomb."
    },
    {
      "slug": "kushan-empire",
      "name": "Kushan Empire",
      "type": "organization",
      "wiki": "Kushan Empire",
      "description": "The Kushan Empire was a Central and South Asian empire formed by the Yuezhi that controlled Silk Road routes and patronised Buddhism and Gandharan art.",
      "metadata": {
        "founded_date": "30",
        "dissolved_date": "375",
        "headquarters": "Purushapura and Mathura",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Kushan rule",
          "start": 30,
          "end": 375,
          "description": "Ruled from Bactria to the Ganges plain and linked Han China, Parthia and Rome by trade."
        }
      ],
      "why": "Under Kanishka it carried Mahayana Buddhism toward China, and its artists made the first images of the Buddha in human form."
    },
    {
      "slug": "first-jewish-roman-war",
      "name": "First Jewish–Roman War",
      "type": "event",
      "wiki": "First Jewish–Roman War",
      "description": "The First Jewish–Roman War was a revolt of Judea against Rome that ended with the siege of Jerusalem and the destruction of the Second Temple in 70 CE.",
      "metadata": {
        "start_date": "66",
        "end_date": "73",
        "location": "Judea",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Revolt and siege",
          "start": 66,
          "end": 73,
          "description": "Judean rebels fought Roman legions until the fall of Jerusalem in 70 and Masada in 73."
        }
      ],
      "why": "The loss of the Temple produced rabbinic Judaism and the diaspora, and hastened Christianity's separation from Judaism."
    },
    {
      "slug": "cai-lun",
      "name": "Cai Lun",
      "type": "person",
      "wiki": "Cai Lun",
      "description": "Cai Lun was an Eastern Han court eunuch who in 105 CE presented to Emperor He a papermaking process using tree bark, hemp, rags and fishing nets, which made paper manufacture possible at scale.",
      "metadata": {
        "death_date": "121",
        "nationality": "Chinese (Han)"
      },
      "periods": [
        {
          "label": "Imperial official",
          "start": 89,
          "end": 121,
          "description": "Oversaw the imperial workshops and presented the papermaking process to the throne in 105."
        }
      ],
      "why": "Paper made cheap writing possible, carried learning across Asia and the Islamic world, and later enabled the printing press."
    },
    {
      "slug": "ban-zhao",
      "name": "Ban Zhao",
      "type": "person",
      "wiki": "Ban Zhao",
      "description": "Ban Zhao was the first known female Chinese historian, who completed the Book of Han and wrote Lessons for Women.",
      "metadata": {
        "birth_date": "45",
        "death_date": "c. 117",
        "nationality": "Chinese (Han)"
      },
      "periods": [
        {
          "label": "Court historian and tutor",
          "start": 92,
          "end": 116,
          "description": "Completed the Book of Han after her brother Ban Gu's death and taught at the imperial court."
        }
      ],
      "why": "The Book of Han became the model for Chinese dynastic histories, and Lessons for Women shaped the education of Chinese women for centuries."
    },
    {
      "slug": "kingdom-of-aksum",
      "name": "Kingdom of Aksum",
      "type": "organization",
      "wiki": "Kingdom of Aksum",
      "description": "The Kingdom of Aksum was a trading empire of the Horn of Africa that minted its own coins, adopted Christianity under King Ezana, and developed the Ge'ez script.",
      "metadata": {
        "founded_date": "1st century",
        "dissolved_date": "c. 960",
        "headquarters": "Aksum",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Aksumite kingdom",
          "start": 100,
          "end": 960,
          "description": "Controlled Red Sea trade between the Roman world, Arabia and India."
        }
      ],
      "why": "It made Ethiopia one of the first Christian states and linked Rome, Persia and India through Red Sea trade."
    },
    {
      "slug": "ptolemy",
      "name": "Ptolemy",
      "type": "person",
      "wiki": "Ptolemy",
      "description": "Claudius Ptolemy was an Alexandrian astronomer and geographer whose Almagest set out the geocentric model of the universe and whose Geography mapped the known world by coordinates.",
      "metadata": {
        "birth_date": "c. 100",
        "death_date": "c. 170",
        "nationality": "Greco-Roman (Alexandria)"
      },
      "periods": [
        {
          "label": "Astronomical and geographical work",
          "start": 127,
          "end": 170,
          "description": "Made observations at Alexandria and wrote the Almagest, Geography and Tetrabiblos."
        }
      ],
      "why": "His geocentric system governed astronomy in Europe and the Islamic world until Copernicus."
    },
    {
      "slug": "galen",
      "name": "Galen",
      "type": "person",
      "wiki": "Galen",
      "description": "Galen of Pergamon was a Greek physician in Rome whose anatomical experiments and writings on physiology and humoral theory became the medical canon.",
      "metadata": {
        "birth_date": "129",
        "death_date": "c. 216",
        "nationality": "Greek (Pergamon)"
      },
      "periods": [
        {
          "label": "Medical career",
          "start": 157,
          "end": 216,
          "description": "Treated gladiators at Pergamon and then served as physician to emperors in Rome."
        }
      ],
      "why": "His writings dominated European and Islamic medicine until the 17th century."
    },
    {
      "slug": "nagarjuna",
      "name": "Nagarjuna",
      "type": "person",
      "wiki": "Nagarjuna",
      "description": "Nagarjuna was an Indian Buddhist philosopher who founded the Madhyamaka school and its doctrine of emptiness.",
      "metadata": {
        "birth_date": "c. 150",
        "death_date": "c. 250",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Teaching",
          "start": 180,
          "end": 250,
          "description": "Wrote the Mūlamadhyamakakārikā and systematised Mahayana philosophy."
        }
      ],
      "why": "Tibetan and East Asian Mahayana Buddhism revere him as a second Buddha and build their philosophy on his work."
    },
    {
      "slug": "three-kingdoms",
      "name": "Three Kingdoms",
      "type": "event",
      "wiki": "Three Kingdoms",
      "description": "The Three Kingdoms was the period after the fall of the Han dynasty in which the states of Wei, Shu and Wu fought for control of China.",
      "metadata": {
        "start_date": "220",
        "end_date": "280",
        "location": "China",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Three Kingdoms",
          "start": 220,
          "end": 280,
          "description": "Wei, Shu and Wu contended until the Jin dynasty reunified China."
        }
      ],
      "why": "Through the Romance of the Three Kingdoms it became the most retold story in East Asian literature, theatre and games."
    },
    {
      "slug": "sasanian-empire",
      "name": "Sasanian Empire",
      "type": "organization",
      "wiki": "Sasanian Empire",
      "description": "The Sasanian Empire was the last pre-Islamic Persian empire, a rival of Rome and Byzantium for four centuries and a patron of Zoroastrianism.",
      "metadata": {
        "founded_date": "224",
        "dissolved_date": "651",
        "headquarters": "Ctesiphon",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Imperial era",
          "start": 224,
          "end": 651,
          "description": "Ruled Iran and Mesopotamia until the Arab conquest."
        }
      ],
      "why": "Its court culture, administration and art passed into the Islamic caliphates and shaped medieval Persian and Islamic civilisation."
    },
    {
      "slug": "gupta-empire",
      "name": "Gupta Empire",
      "type": "organization",
      "wiki": "Gupta Empire",
      "description": "The Gupta Empire ruled northern India in an era of Sanskrit literature, Hindu temple building, and advances in mathematics and astronomy.",
      "metadata": {
        "founded_date": "c. 240",
        "dissolved_date": "c. 550",
        "headquarters": "Pataliputra",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Gupta rule",
          "start": 240,
          "end": 550,
          "description": "Ruled northern India and patronised Sanskrit learning, temples and science."
        }
      ],
      "why": "Classical Hindu culture, Sanskrit drama and the decimal place-value numerals took shape under its rule."
    },
    {
      "slug": "mani",
      "name": "Mani",
      "type": "person",
      "wiki": "Mani (prophet)",
      "description": "Mani was an Iranian prophet in the Sasanian Empire who founded Manichaeism, a dualist religion of light and darkness.",
      "metadata": {
        "birth_date": "216",
        "death_date": "274",
        "nationality": "Iranian (Parthian)"
      },
      "periods": [
        {
          "label": "Prophetic mission",
          "start": 240,
          "end": 274,
          "description": "Preached across the Sasanian Empire and into India until his execution under Bahram I."
        }
      ],
      "why": "His religion spread from Roman North Africa to China and was among the largest faiths of late antiquity."
    },
    {
      "slug": "manichaeism",
      "name": "Manichaeism",
      "type": "organization",
      "wiki": "Manichaeism",
      "description": "Manichaeism was a dualist world religion founded by Mani in the Sasanian Empire that spread from the Roman West to China.",
      "metadata": {
        "founded_date": "c. 240",
        "headquarters": "Ctesiphon",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Active religion",
          "start": 240,
          "end": 1400,
          "description": "Spread through the Roman Empire, Central Asia and China, and was the state religion of the Uyghur Khaganate."
        }
      ],
      "why": "It was a major rival of Christianity in late antiquity and one of the most widespread religions before modern times."
    },
    {
      "slug": "anthony-the-great",
      "name": "Anthony the Great",
      "type": "person",
      "wiki": "Anthony the Great",
      "description": "Anthony the Great was an Egyptian Christian hermit whose withdrawal into the desert, recorded in Athanasius's Life of Anthony, made him the father of Christian monasticism.",
      "metadata": {
        "birth_date": "c. 251",
        "death_date": "356",
        "nationality": "Egyptian"
      },
      "periods": [
        {
          "label": "Desert asceticism",
          "start": 270,
          "end": 356,
          "description": "Lived as a hermit and spiritual guide to communities of monks in the Egyptian desert."
        }
      ],
      "why": "The monastic movement he inspired built the monasteries that preserved learning and shaped Christian life for fifteen centuries."
    },
    {
      "slug": "constantine-the-great",
      "name": "Constantine the Great",
      "type": "person",
      "wiki": "Constantine the Great",
      "description": "Constantine I was the first Roman emperor to convert to Christianity, who legalised the faith with the Edict of Milan, convened the Council of Nicaea, and founded Constantinople.",
      "metadata": {
        "birth_date": "c. 272",
        "death_date": "337",
        "nationality": "Roman"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 306,
          "end": 337,
          "description": "Reunited the empire, favoured the Church and moved the capital to Constantinople."
        }
      ],
      "why": "He turned Christianity from a persecuted sect into the favoured religion of the empire and built the capital that ruled the East for a thousand years."
    },
    {
      "slug": "first-council-of-nicaea",
      "name": "First Council of Nicaea",
      "type": "event",
      "wiki": "First Council of Nicaea",
      "description": "The First Council of Nicaea was the first ecumenical council of the Christian Church, convened by Constantine, which condemned Arianism and adopted the Nicene Creed.",
      "metadata": {
        "start_date": "325",
        "end_date": "325",
        "location": "Nicaea, Bithynia",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Council",
          "start": 325,
          "end": 325,
          "description": "Bishops from across the empire defined the divinity of Christ and set the date of Easter."
        }
      ],
      "why": "The Nicene Creed it produced is still professed by the Catholic, Orthodox and most Protestant churches."
    },
    {
      "slug": "huns",
      "name": "Huns",
      "type": "organization",
      "wiki": "Huns",
      "description": "The Huns were a nomadic people from Central Asia whose arrival on the Volga by 370 drove the Goths into the Roman Empire and who under Attila built an empire on the Danube.",
      "metadata": {
        "founded_date": "c. 370",
        "dissolved_date": "469",
        "headquarters": "Pannonian Basin",
        "organization_type": "military"
      },
      "periods": [
        {
          "label": "Hunnic expansion and empire",
          "start": 370,
          "end": 469,
          "description": "Raided and extracted tribute from both Roman empires and invaded Gaul and Italy under Attila."
        }
      ],
      "why": "Their westward push set off the migrations that brought down the Western Roman Empire."
    },
    {
      "slug": "fall-of-the-western-roman-empire",
      "name": "Fall of the Western Roman Empire",
      "type": "event",
      "wiki": "Fall of the Western Roman Empire",
      "description": "The fall of the Western Roman Empire was the loss of central Roman control over the western provinces to Germanic kingdoms, ending with the deposition of Romulus Augustulus in 476.",
      "metadata": {
        "start_date": "376",
        "end_date": "476",
        "location": "Western Europe and North Africa",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Collapse in the West",
          "start": 376,
          "end": 476,
          "description": "Gothic, Vandal and other invasions, including the sack of Rome in 410, dismantled imperial rule in the West."
        }
      ],
      "why": "It ended antiquity in the West and gave rise to the kingdoms of medieval Europe and the political role of the papacy."
    },
    {
      "slug": "theodosius-i",
      "name": "Theodosius I",
      "type": "person",
      "wiki": "Theodosius I",
      "description": "Theodosius I was the last emperor to rule both halves of the Roman Empire, who made Nicene Christianity the state religion by the Edict of Thessalonica and banned pagan sacrifice.",
      "metadata": {
        "birth_date": "347",
        "death_date": "395",
        "nationality": "Roman (Hispania)"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 379,
          "end": 395,
          "description": "Settled the Goths in the empire, enforced Nicene orthodoxy and suppressed pagan cults."
        }
      ],
      "why": "His edicts made the Roman state officially Christian and ended the public practice of the old religions."
    },
    {
      "slug": "jerome",
      "name": "Jerome",
      "type": "person",
      "wiki": "Jerome",
      "description": "Jerome was a priest and scholar who translated the Bible from Hebrew and Greek into Latin, producing the Vulgate.",
      "metadata": {
        "birth_date": "c. 342",
        "death_date": "420",
        "nationality": "Roman (Dalmatia)"
      },
      "periods": [
        {
          "label": "Biblical translation",
          "start": 382,
          "end": 420,
          "description": "Revised the Latin Gospels in Rome and translated the Hebrew scriptures in Bethlehem."
        }
      ],
      "why": "The Vulgate was the Bible of Western Christianity for over a thousand years and the official text of the Catholic Church."
    },
    {
      "slug": "augustine-of-hippo",
      "name": "Augustine of Hippo",
      "type": "person",
      "wiki": "Augustine of Hippo",
      "description": "Augustine was a North African bishop and theologian whose Confessions and City of God formulated the doctrines of original sin, grace and just war.",
      "metadata": {
        "birth_date": "354",
        "death_date": "430",
        "nationality": "Roman North African (Numidia)"
      },
      "periods": [
        {
          "label": "Conversion and episcopate",
          "start": 386,
          "end": 430,
          "description": "Converted in Milan and served as bishop of Hippo Regius from 395."
        }
      ],
      "why": "His theology of sin and grace underlies medieval Catholicism and the Protestant Reformation."
    },
    {
      "slug": "hypatia",
      "name": "Hypatia",
      "type": "person",
      "wiki": "Hypatia",
      "description": "Hypatia was a Neoplatonist philosopher, astronomer and mathematician who taught in Alexandria until a Christian mob murdered her in 415.",
      "metadata": {
        "death_date": "415",
        "nationality": "Greek (Alexandria)"
      },
      "periods": [
        {
          "label": "Teaching in Alexandria",
          "start": 390,
          "end": 415,
          "description": "Led the Neoplatonist school of Alexandria and advised the city's officials."
        }
      ],
      "why": "She is the first female mathematician whose life is well recorded and an enduring symbol of learning against fanaticism."
    },
    {
      "slug": "kumarajiva",
      "name": "Kumārajīva",
      "type": "person",
      "wiki": "Kumārajīva",
      "description": "Kumārajīva was a Buddhist monk from Kucha who led a translation bureau in Chang'an that rendered the Lotus, Diamond and Amitabha sutras into Chinese.",
      "metadata": {
        "birth_date": "344",
        "death_date": "413",
        "nationality": "Kuchean"
      },
      "periods": [
        {
          "label": "Translation work in Chang'an",
          "start": 401,
          "end": 413,
          "description": "Directed a state-sponsored team that translated Mahayana scriptures and treatises."
        }
      ],
      "why": "His translations remain the standard scriptures of East Asian Buddhism, read by hundreds of millions."
    },
    {
      "slug": "aryabhata",
      "name": "Aryabhata",
      "type": "person",
      "wiki": "Aryabhata",
      "description": "Aryabhata was an Indian mathematician and astronomer whose Aryabhatiya used a place-value system, gave pi as 3.1416, and described the rotation of the Earth on its axis.",
      "metadata": {
        "birth_date": "476",
        "death_date": "550",
        "nationality": "Indian (Gupta Empire)"
      },
      "periods": [
        {
          "label": "Aryabhatiya and astronomical work",
          "start": 499,
          "end": 550,
          "description": "Wrote the Aryabhatiya at Kusumapura and founded a school of Indian astronomy."
        }
      ],
      "why": "His work founded classical Indian mathematical astronomy and passed through Arabic translation into world science."
    },
    {
      "slug": "justinian-i",
      "name": "Justinian I",
      "type": "person",
      "wiki": "Justinian I",
      "description": "Eastern Roman emperor who codified Roman law in the Corpus Juris Civilis, reconquered Italy and North Africa, and built the Hagia Sophia.",
      "metadata": {
        "birth_date": "482",
        "death_date": "565",
        "nationality": "Byzantine"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 527,
          "end": 565,
          "description": "He issued the Code, Digest and Institutes, suppressed the Nika riots, sent Belisarius to retake Africa and Italy, and rebuilt the Hagia Sophia."
        }
      ],
      "why": "His legal code is the foundation of the civil law used across continental Europe, Latin America and much of the world."
    },
    {
      "slug": "benedict-of-nursia",
      "name": "Benedict of Nursia",
      "type": "person",
      "wiki": "Benedict of Nursia",
      "description": "Italian monk who founded Monte Cassino and wrote the Rule of Saint Benedict, the model for monastic life in western Europe.",
      "metadata": {
        "birth_date": "c. 480",
        "death_date": "c. 547",
        "nationality": "Italian"
      },
      "periods": [
        {
          "label": "Monte Cassino",
          "start": 529,
          "end": 547,
          "description": "He founded the abbey of Monte Cassino in 529 and wrote his Rule there."
        }
      ],
      "why": "Benedictine monasteries preserved Latin learning through the early Middle Ages and organized the farming and schooling of Europe."
    },
    {
      "slug": "plague-of-justinian",
      "name": "Plague of Justinian",
      "type": "event",
      "wiki": "Plague of Justinian",
      "description": "The first Old World pandemic of bubonic plague, which struck the Byzantine Empire and the Mediterranean world from 541 and recurred until 750.",
      "metadata": {
        "start_date": "541",
        "end_date": "549",
        "location": "Mediterranean and Near East",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "First outbreak",
          "start": 541,
          "end": 549,
          "description": "Plague spread from Egypt to Constantinople in 542, killed a large share of the capital's population, and swept the Mediterranean and Persia."
        }
      ],
      "why": "It struck the Byzantine and Sasanian empires before the Arab conquests and began a plague pandemic that recurred for two centuries."
    },
    {
      "slug": "bhakti-movement",
      "name": "Bhakti movement",
      "type": "event",
      "wiki": "Bhakti movement",
      "description": "The devotional movement in Hinduism, begun by Tamil poet-saints and spread across India, that taught personal love of God over ritual and caste.",
      "metadata": {
        "start_date": "7th century",
        "end_date": "17th century",
        "location": "India",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Tamil Alvars and Nayanars",
          "start": 600,
          "end": 900,
          "description": "Tamil poet-saints composed devotional hymns to Vishnu and Shiva in the vernacular."
        },
        {
          "label": "North Indian saints",
          "start": 1400,
          "end": 1650,
          "description": "Kabir, Mirabai, Chaitanya and Tulsidas spread devotional worship in Hindi, Bengali and other languages."
        }
      ],
      "why": "It produced the devotional poetry, temple worship and vernacular literature practiced by hundreds of millions of Hindus."
    },
    {
      "slug": "imperial-examination",
      "name": "Imperial examination",
      "type": "organization",
      "wiki": "Imperial examination",
      "description": "The Chinese civil service examinations that selected officials by written tests on the Confucian classics from the Sui dynasty until 1905.",
      "metadata": {
        "founded_date": "605",
        "dissolved_date": "1905",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Examination system",
          "start": 605,
          "end": 1905,
          "description": "Exams at county, provincial and palace levels recruited the bureaucracy of the Sui, Tang, Song, Ming and Qing dynasties and were copied in Korea and Vietnam."
        }
      ],
      "why": "For 1,300 years it set what educated East Asians studied and inspired merit-based civil services in Europe."
    },
    {
      "slug": "tang-dynasty",
      "name": "Tang dynasty",
      "type": "organization",
      "wiki": "Tang dynasty",
      "description": "The Chinese dynasty that ruled from Chang'an, expanded into Central Asia, and spread Chinese law, script, Buddhism and city planning to Korea, Japan and Vietnam.",
      "metadata": {
        "founded_date": "618",
        "dissolved_date": "907",
        "headquarters": "Chang'an",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Tang rule",
          "start": 618,
          "end": 907,
          "description": "Tang emperors ruled a cosmopolitan empire on the Silk Road, expanded the imperial examinations, and declined after the An Lushan rebellion."
        }
      ],
      "why": "Its legal code, institutions and poetry became the classical model for all of East Asia."
    },
    {
      "slug": "early-muslim-conquests",
      "name": "Early Muslim conquests",
      "type": "event",
      "wiki": "Early Muslim conquests",
      "description": "The Arab military expansion that carried Islamic rule from Arabia to Iberia, North Africa, Persia and the Indus valley between 622 and 750.",
      "metadata": {
        "start_date": "622",
        "end_date": "750",
        "location": "Middle East, North Africa, Iberia and Central Asia",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Arab conquests",
          "start": 622,
          "end": 750,
          "description": "Muslim armies united Arabia, destroyed the Sasanian Empire, took Syria, Egypt and North Africa from Byzantium, and crossed into Iberia and Sindh."
        }
      ],
      "why": "It made Islam and Arabic the religion and language of a band of the world from the Atlantic to Central Asia."
    },
    {
      "slug": "rashidun-caliphate",
      "name": "Rashidun Caliphate",
      "type": "organization",
      "wiki": "Rashidun Caliphate",
      "description": "The first caliphate, ruled by four successors of Muhammad from Medina and Kufa, which conquered the Sasanian Empire and the Byzantine provinces of Syria and Egypt.",
      "metadata": {
        "founded_date": "632",
        "dissolved_date": "661",
        "headquarters": "Medina",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Rule of the four caliphs",
          "start": 632,
          "end": 661,
          "description": "Abu Bakr, Umar, Uthman and Ali governed in turn, fought the Ridda wars, conquered Persia, Syria and Egypt, and issued the standard text of the Quran."
        }
      ],
      "why": "It turned a religious community in Arabia into an empire and fixed the canonical text of the Quran."
    },
    {
      "slug": "shia-islam",
      "name": "Shia Islam",
      "type": "organization",
      "wiki": "Shia Islam",
      "description": "The second-largest branch of Islam, which holds that leadership of the Muslim community belonged to Ali and the imams descended from him.",
      "metadata": {
        "founded_date": "632",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Shia community",
          "start": 632,
          "end": 2026,
          "description": "Shia Muslims followed the line of Ali's descendants, commemorated the death of Husayn at Karbala, and became the state religion of Iran in 1501."
        }
      ],
      "why": "It is the faith of the majority in Iran, Iraq, Azerbaijan and Bahrain and shapes the politics of the Middle East."
    },
    {
      "slug": "ali",
      "name": "Ali",
      "type": "person",
      "wiki": "Ali",
      "description": "Cousin and son-in-law of Muhammad and the fourth Rashidun caliph, whom Shia Muslims hold to be the first imam.",
      "metadata": {
        "birth_date": "c. 600",
        "death_date": "661",
        "nationality": "Arab"
      },
      "periods": [
        {
          "label": "Caliphate",
          "start": 656,
          "end": 661,
          "description": "He ruled as caliph from Kufa, fought the first Muslim civil war against Aisha, Talha, Zubayr and Muawiya, and was assassinated in 661."
        }
      ],
      "why": "The dispute over his right to succeed Muhammad split Islam into its Sunni and Shia branches."
    },
    {
      "slug": "wu-zetian",
      "name": "Wu Zetian",
      "type": "person",
      "wiki": "Wu Zetian",
      "description": "The only woman to rule China as emperor in her own right, founding her own Zhou dynasty within the Tang era.",
      "metadata": {
        "birth_date": "624",
        "death_date": "705",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Power and reign",
          "start": 660,
          "end": 705,
          "description": "She governed through her husband Gaozong and her sons from 660, reigned as emperor from 690 to 705, and widened recruitment of officials through the examinations."
        }
      ],
      "why": "She ruled the Tang state for 45 years and remains the only female emperor in Chinese history."
    },
    {
      "slug": "umayyad-caliphate",
      "name": "Umayyad Caliphate",
      "type": "organization",
      "wiki": "Umayyad Caliphate",
      "description": "The Arab dynasty ruling from Damascus that extended the caliphate from Iberia to the Indus and made Arabic the language of its administration.",
      "metadata": {
        "founded_date": "661",
        "dissolved_date": "750",
        "headquarters": "Damascus",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Caliphate in Damascus",
          "start": 661,
          "end": 750,
          "description": "Umayyad caliphs conquered North Africa, Iberia, Transoxiana and Sindh, built the Dome of the Rock, and Arabized the bureaucracy and coinage."
        }
      ],
      "why": "It built one of the largest empires in history and set the Arabic-speaking map of the Middle East and North Africa."
    },
    {
      "slug": "battle-of-karbala",
      "name": "Battle of Karbala",
      "type": "event",
      "wiki": "Battle of Karbala",
      "description": "The battle on 10 October 680 in which the Umayyad army killed Husayn ibn Ali, grandson of Muhammad, with most of his family and companions.",
      "metadata": {
        "start_date": "680",
        "end_date": "680",
        "location": "Karbala, Iraq",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Battle",
          "start": 680,
          "end": 680,
          "description": "Troops of the caliph Yazid I surrounded Husayn's small party, cut it off from the Euphrates, and killed it on the day of Ashura."
        }
      ],
      "why": "Its annual commemoration at Ashura is the central ritual of Shia Islam and its model of martyrdom."
    },
    {
      "slug": "adi-shankara",
      "name": "Adi Shankara",
      "type": "person",
      "wiki": "Adi Shankara",
      "description": "Indian philosopher who consolidated Advaita Vedanta, the non-dualist school of Hindu thought, through his commentaries on the Upanishads.",
      "metadata": {
        "birth_date": "c. 700",
        "death_date": "c. 750",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Teaching and writing",
          "start": 700,
          "end": 750,
          "description": "He wrote commentaries on the Upanishads, the Bhagavad Gita and the Brahma Sutras and debated rival Buddhist and Hindu schools across India."
        }
      ],
      "why": "Advaita Vedanta became the most influential school of Hindu philosophy and the basis of modern Hinduism's image abroad."
    },
    {
      "slug": "zen",
      "name": "Zen",
      "type": "organization",
      "wiki": "Zen",
      "description": "The school of Mahayana Buddhism that arose in Tang China as Chan, teaching meditation and direct insight over scripture, and spread to Korea, Vietnam and Japan.",
      "metadata": {
        "founded_date": "7th century",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Chan in China",
          "start": 700,
          "end": 1279,
          "description": "Chan lineages formed in Tang China and became the dominant monastic school of the Song."
        },
        {
          "label": "Zen in Japan",
          "start": 1191,
          "end": 2026,
          "description": "Eisai and Dogen brought Rinzai and Soto Zen to Japan, where Zen monasteries shaped samurai culture, the tea ceremony and garden design."
        }
      ],
      "why": "It shaped East Asian monastic life and Japanese arts and is the root of the Western meditation movement."
    },
    {
      "slug": "abbasid-caliphate",
      "name": "Abbasid Caliphate",
      "type": "organization",
      "wiki": "Abbasid Caliphate",
      "description": "The caliphate that overthrew the Umayyads, founded Baghdad in 762, and presided over the translation movement and the Islamic Golden Age.",
      "metadata": {
        "founded_date": "750",
        "dissolved_date": "1258",
        "headquarters": "Baghdad",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Caliphate in Baghdad",
          "start": 750,
          "end": 1258,
          "description": "Abbasid caliphs ruled from Baghdad and Samarra, sponsored the translation of Greek, Persian and Indian learning into Arabic, and lost political power to regional dynasties before the Mongol sack of 1258."
        }
      ],
      "why": "Its courts produced the science, law and literature that the medieval Islamic and Christian worlds inherited."
    },
    {
      "slug": "an-lushan-rebellion",
      "name": "An Lushan rebellion",
      "type": "event",
      "wiki": "An Lushan rebellion",
      "description": "A revolt by the Tang general An Lushan and his successors that devastated northern China and broke the power of the Tang dynasty.",
      "metadata": {
        "start_date": "755",
        "end_date": "763",
        "location": "Northern China",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Rebellion",
          "start": 755,
          "end": 763,
          "description": "Rebel armies took Luoyang and Chang'an, the emperor fled to Sichuan, and the Tang recovered only with Uyghur help."
        }
      ],
      "why": "The registered population fell by tens of millions, and the war shifted China's economic center to the south."
    },
    {
      "slug": "charlemagne",
      "name": "Charlemagne",
      "type": "person",
      "wiki": "Charlemagne",
      "description": "King of the Franks who conquered most of western Europe and was crowned emperor by Pope Leo III in 800.",
      "metadata": {
        "birth_date": "748",
        "death_date": "814",
        "nationality": "Frankish"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 768,
          "end": 814,
          "description": "He conquered the Lombards and Saxons, was crowned emperor in Rome in 800, and sponsored the Carolingian revival of learning."
        }
      ],
      "why": "He united western Europe for the first time since Rome and founded the idea of a Christian European empire."
    },
    {
      "slug": "viking-age",
      "name": "Viking Age",
      "type": "event",
      "wiki": "Viking Age",
      "description": "The period of Scandinavian raiding, trade and settlement from the attack on Lindisfarne in 793 to 1066, reaching from Newfoundland to the Caspian Sea.",
      "metadata": {
        "start_date": "793",
        "end_date": "1066",
        "location": "Northern Europe and the North Atlantic",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Raids and settlement",
          "start": 793,
          "end": 1066,
          "description": "Norse raiders and settlers attacked Britain and Francia, settled Iceland, Greenland and Normandy, founded the Rus' state, and reached Newfoundland."
        }
      ],
      "why": "It created Normandy, Iceland and the Kievan Rus' state and shaped the languages and politics of Britain and Russia."
    },
    {
      "slug": "khmer-empire",
      "name": "Khmer Empire",
      "type": "organization",
      "wiki": "Khmer Empire",
      "description": "The Hindu-Buddhist empire of mainland Southeast Asia ruled from Angkor, which built Angkor Wat and one of the largest pre-industrial cities.",
      "metadata": {
        "founded_date": "802",
        "dissolved_date": "1431",
        "headquarters": "Angkor",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Angkorian era",
          "start": 802,
          "end": 1431,
          "description": "Khmer kings ruled Cambodia and much of Thailand, Laos and southern Vietnam, built Angkor Wat and Angkor Thom, and abandoned Angkor after Ayutthaya's attack in 1431."
        }
      ],
      "why": "It set the cultural and religious template of Cambodia, Thailand and Laos."
    },
    {
      "slug": "al-khwarizmi",
      "name": "Al-Khwarizmi",
      "type": "person",
      "wiki": "Al-Khwarizmi",
      "description": "Persian mathematician at the House of Wisdom in Baghdad whose books founded algebra and introduced Indian numerals to the Islamic world and Europe.",
      "metadata": {
        "birth_date": "c. 780",
        "death_date": "c. 850",
        "nationality": "Persian"
      },
      "periods": [
        {
          "label": "House of Wisdom",
          "start": 813,
          "end": 833,
          "description": "Under the caliph al-Ma'mun he wrote The Compendious Book on Calculation by Completion and Balancing, a treatise on Indian numerals, and astronomical tables."
        }
      ],
      "why": "Algebra takes its name from his book and the word algorithm from his name."
    },
    {
      "slug": "muhammad-al-bukhari",
      "name": "Muhammad al-Bukhari",
      "type": "person",
      "wiki": "Muhammad al-Bukhari",
      "description": "Persian scholar whose hadith collection, Sahih al-Bukhari, Sunni Muslims hold to be the most authoritative book after the Quran.",
      "metadata": {
        "birth_date": "810",
        "death_date": "870",
        "nationality": "Persian"
      },
      "periods": [
        {
          "label": "Hadith collection",
          "start": 826,
          "end": 870,
          "description": "He travelled across the Islamic world gathering reports of the sayings and acts of Muhammad and compiled the Sahih from them."
        }
      ],
      "why": "His collection is a primary source of Sunni law and practice for over a billion people."
    },
    {
      "slug": "gunpowder",
      "name": "Gunpowder",
      "type": "event",
      "wiki": "Gunpowder",
      "description": "The explosive mixture of saltpeter, sulfur and charcoal, discovered in China in the 9th century, which spread across Eurasia and transformed warfare.",
      "metadata": {
        "start_date": "9th century",
        "location": "China",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Invention and Chinese military use",
          "start": 850,
          "end": 1279,
          "description": "Chinese alchemists found the mixture and Song armies developed fire arrows, bombs and fire lances with it, recording the first formulas in 1044."
        }
      ],
      "why": "Cannon and firearms built on it ended the age of castles and armored cavalry and armed the empires of the early modern world."
    },
    {
      "slug": "fatima-al-fihriya",
      "name": "Fatima al-Fihriya",
      "type": "person",
      "wiki": "Fatima al-Fihriya",
      "description": "Woman from Kairouan who founded the al-Qarawiyyin mosque in Fez in 857, whose school became the oldest continuously operating institution of higher learning.",
      "metadata": {
        "birth_date": "c. 800",
        "death_date": "c. 880",
        "nationality": "Arab"
      },
      "periods": [
        {
          "label": "Founding of al-Qarawiyyin",
          "start": 857,
          "end": 859,
          "description": "She used her inheritance to found and build the al-Qarawiyyin mosque and its school in Fez."
        }
      ],
      "why": "The institution she founded has taught students for over eleven centuries and is a model for the madrasa and the university."
    },
    {
      "slug": "cyrillic-script",
      "name": "Cyrillic script",
      "type": "event",
      "wiki": "Cyrillic script",
      "description": "The alphabet developed in the First Bulgarian Empire in the 9th century from Greek letters and the Glagolitic script of Cyril and Methodius.",
      "metadata": {
        "start_date": "9th century",
        "location": "First Bulgarian Empire",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Preslav Literary School",
          "start": 886,
          "end": 927,
          "description": "Disciples of Cyril and Methodius at Preslav created the alphabet and used it to translate scripture and liturgy into Old Church Slavonic."
        }
      ],
      "why": "It is the writing system of Russian, Ukrainian, Bulgarian, Serbian and other languages used by 250 million people."
    },
    {
      "slug": "song-dynasty",
      "name": "Song dynasty",
      "type": "organization",
      "wiki": "Song dynasty",
      "description": "The Chinese dynasty under which paper money, movable type, the magnetic compass and gunpowder weapons came into use and China's population passed 100 million.",
      "metadata": {
        "founded_date": "960",
        "dissolved_date": "1279",
        "headquarters": "Kaifeng",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Song rule",
          "start": 960,
          "end": 1279,
          "description": "Song emperors ruled from Kaifeng and then Hangzhou, governed through examination-selected officials, and fell to the Mongols in 1279."
        }
      ],
      "why": "Its paper money, printing and navigation technology spread across Eurasia and changed trade and warfare."
    },
    {
      "slug": "holy-roman-empire",
      "name": "Holy Roman Empire",
      "type": "organization",
      "wiki": "Holy Roman Empire",
      "description": "The elective monarchy of German, Italian and Central European lands whose emperors claimed the succession of ancient Rome from Otto I's coronation in 962 until 1806.",
      "metadata": {
        "founded_date": "962",
        "dissolved_date": "1806",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Empire",
          "start": 962,
          "end": 1806,
          "description": "Emperors and princes governed a decentralized realm, contested power with the papacy, and fought out the Reformation and the Thirty Years' War on its soil."
        }
      ],
      "why": "For eight centuries it was the political frame of Central Europe and of the German and Italian states that came after it."
    },
    {
      "slug": "vladimir-the-great",
      "name": "Vladimir the Great",
      "type": "person",
      "wiki": "Vladimir the Great",
      "description": "Grand Prince of Kiev who adopted Byzantine Orthodox Christianity in 988 and had his subjects baptized.",
      "metadata": {
        "birth_date": "c. 958",
        "death_date": "1015",
        "nationality": "Kievan Rus'"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 980,
          "end": 1015,
          "description": "He ruled Kievan Rus', married the Byzantine princess Anna, baptized Kiev in 988, and built churches across his realm."
        }
      ],
      "why": "His conversion made Russia, Ukraine and Belarus Orthodox Christian nations."
    },
    {
      "slug": "avicenna",
      "name": "Avicenna",
      "type": "person",
      "wiki": "Avicenna",
      "description": "Persian physician and philosopher whose Canon of Medicine was a standard medical textbook in the Islamic world and Europe until the 17th century.",
      "metadata": {
        "birth_date": "980",
        "death_date": "1037",
        "nationality": "Persian"
      },
      "periods": [
        {
          "label": "Physician and philosopher",
          "start": 997,
          "end": 1037,
          "description": "He served as physician and vizier to Samanid and Buyid rulers and wrote the Canon of Medicine and The Book of Healing."
        }
      ],
      "why": "His Canon trained physicians from Spain to India for six centuries."
    },
    {
      "slug": "murasaki-shikibu",
      "name": "Murasaki Shikibu",
      "type": "person",
      "wiki": "Murasaki Shikibu",
      "description": "Lady-in-waiting at the Heian court of Japan who wrote The Tale of Genji, a long prose narrative of court life and one of the earliest novels.",
      "metadata": {
        "birth_date": "c. 973",
        "death_date": "c. 1014",
        "nationality": "Japanese"
      },
      "periods": [
        {
          "label": "Court service and writing",
          "start": 1000,
          "end": 1012,
          "description": "Serving Empress Shoshi, she wrote The Tale of Genji and her diary."
        }
      ],
      "why": "Genji set the model for Japanese literature and aesthetics for a thousand years."
    },
    {
      "slug": "eastern-orthodox-church",
      "name": "Eastern Orthodox Church",
      "type": "organization",
      "wiki": "Eastern Orthodox Church",
      "description": "The second-largest Christian church, a communion of self-governing churches in the Byzantine tradition that separated from Rome in the schism of 1054.",
      "metadata": {
        "founded_date": "1054",
        "headquarters": "Istanbul",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Separate communion",
          "start": 1054,
          "end": 2026,
          "description": "The patriarchates of Constantinople, Alexandria, Antioch and Jerusalem and the national churches of Russia, Serbia, Bulgaria and Romania kept the Byzantine liturgy and creed."
        }
      ],
      "why": "It is the faith of over 200 million people and the cultural foundation of Russia, Greece, Ukraine, Serbia and Romania."
    },
    {
      "slug": "norman-conquest",
      "name": "Norman Conquest",
      "type": "event",
      "wiki": "Norman Conquest",
      "description": "The invasion and conquest of England by William, Duke of Normandy, beginning with his victory at Hastings in 1066.",
      "metadata": {
        "start_date": "1066",
        "end_date": "1071",
        "location": "England",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Conquest",
          "start": 1066,
          "end": 1071,
          "description": "William defeated Harold II at Hastings, was crowned, crushed revolts with the Harrying of the North, and replaced the English aristocracy with Normans."
        }
      ],
      "why": "It joined England to continental Europe and transformed the English language with French vocabulary."
    },
    {
      "slug": "al-ghazali",
      "name": "Al-Ghazali",
      "type": "person",
      "wiki": "Al-Ghazali",
      "description": "Persian theologian whose Revival of the Religious Sciences joined Sufism to Sunni law and whose Incoherence of the Philosophers attacked Aristotelian philosophy.",
      "metadata": {
        "birth_date": "c. 1058",
        "death_date": "1111",
        "nationality": "Persian"
      },
      "periods": [
        {
          "label": "Teaching and writing",
          "start": 1091,
          "end": 1111,
          "description": "He taught at the Nizamiyya in Baghdad, left in 1095 to live as a Sufi, and wrote his major works in Damascus, Jerusalem and Tus."
        }
      ],
      "why": "He set the terms of Sunni theology and its relation to mysticism for the following nine centuries."
    },
    {
      "slug": "crusades",
      "name": "Crusades",
      "type": "event",
      "wiki": "Crusades",
      "description": "The religious wars sanctioned by the Latin Church to conquer the Holy Land and fight other enemies of the papacy between 1095 and 1291.",
      "metadata": {
        "start_date": "1095",
        "end_date": "1291",
        "location": "Levant, Iberia and the Baltic",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Crusading era",
          "start": 1095,
          "end": 1291,
          "description": "Crusaders founded the Kingdom of Jerusalem and other states, fought Saladin and the Mamluks, sacked Constantinople in 1204, and lost Acre in 1291."
        }
      ],
      "why": "They shaped Christian-Muslim relations, Western trade with the East, and a vocabulary of holy war still in use."
    },
    {
      "slug": "king-arthur",
      "name": "King Arthur",
      "type": "person",
      "wiki": "King Arthur",
      "description": "Legendary British king of the Round Table, first named in early Welsh sources and made famous by Geoffrey of Monmouth's History of the Kings of Britain in 1136.",
      "metadata": {
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Medieval Arthurian romance",
          "start": 1136,
          "end": 1485,
          "description": "Geoffrey of Monmouth, Chretien de Troyes and Thomas Malory built the legend of Camelot, the Round Table and the Holy Grail."
        }
      ],
      "why": "The Arthurian legend set the ideals of chivalry and courtly love and remains a source for literature, film and fantasy."
    },
    {
      "slug": "zhu-xi",
      "name": "Zhu Xi",
      "type": "person",
      "wiki": "Zhu Xi",
      "description": "Song-dynasty philosopher who synthesized Neo-Confucianism and whose commentaries on the Four Books became the basis of the imperial examinations.",
      "metadata": {
        "birth_date": "1130",
        "death_date": "1200",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Teaching and writing",
          "start": 1163,
          "end": 1200,
          "description": "He taught at the White Deer Grotto Academy, served in local office, and wrote his commentaries on the Four Books."
        }
      ],
      "why": "His reading of Confucius was official orthodoxy in China, Korea and Japan for six centuries."
    },
    {
      "slug": "maimonides",
      "name": "Maimonides",
      "type": "person",
      "wiki": "Maimonides",
      "description": "Sephardic rabbi, philosopher and physician in Egypt whose Mishneh Torah codified Jewish law and whose Guide for the Perplexed joined Judaism to Aristotelian philosophy.",
      "metadata": {
        "birth_date": "1138",
        "death_date": "1204",
        "nationality": "Sephardic Jewish"
      },
      "periods": [
        {
          "label": "Fustat",
          "start": 1168,
          "end": 1204,
          "description": "He led the Jewish community of Fustat, served as physician to the court of Saladin, and wrote the Mishneh Torah and the Guide for the Perplexed."
        }
      ],
      "why": "His code and his thirteen principles of faith remain foundations of Jewish law and belief."
    },
    {
      "slug": "delhi-sultanate",
      "name": "Delhi Sultanate",
      "type": "organization",
      "wiki": "Delhi Sultanate",
      "description": "The series of five Muslim dynasties that ruled northern India from Delhi between 1206 and 1526.",
      "metadata": {
        "founded_date": "1206",
        "dissolved_date": "1526",
        "headquarters": "Delhi",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Sultanate",
          "start": 1206,
          "end": 1526,
          "description": "Sultans of the Mamluk, Khalji, Tughlaq, Sayyid and Lodi dynasties repelled Mongol invasions, extended rule into the Deccan, and fell to Babur at Panipat."
        }
      ],
      "why": "It established Muslim rule in India and the Indo-Islamic culture the Mughals inherited."
    },
    {
      "slug": "francis-of-assisi",
      "name": "Francis of Assisi",
      "type": "person",
      "wiki": "Francis of Assisi",
      "description": "Italian friar who founded the Franciscan order, preaching poverty and service to the poor.",
      "metadata": {
        "birth_date": "1181",
        "death_date": "1226",
        "nationality": "Italian"
      },
      "periods": [
        {
          "label": "Franciscan mission",
          "start": 1209,
          "end": 1226,
          "description": "He founded the Order of Friars Minor in 1209, founded the Poor Clares with Clare of Assisi in 1212, and preached in Italy and Egypt."
        }
      ],
      "why": "The Franciscan orders became among the largest in the Catholic Church, and he is the patron saint of Italy and of ecology."
    },
    {
      "slug": "mali-empire",
      "name": "Mali Empire",
      "type": "organization",
      "wiki": "Mali Empire",
      "description": "The West African empire founded by Sundiata Keita that controlled the gold fields and trade routes of the western Sahel.",
      "metadata": {
        "founded_date": "1235",
        "dissolved_date": "1670",
        "headquarters": "Niani",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Imperial Mali",
          "start": 1235,
          "end": 1670,
          "description": "Mali's mansas ruled from the Atlantic coast to the Niger bend, taxed the trans-Saharan gold trade, and spread Islam among the ruling class."
        }
      ],
      "why": "It was the largest West African state of its age and a main source of the gold in Mediterranean coinage."
    },
    {
      "slug": "golden-horde",
      "name": "Golden Horde",
      "type": "organization",
      "wiki": "Golden Horde",
      "description": "The Mongol khanate of the western steppe that ruled and taxed the Russian principalities for two centuries.",
      "metadata": {
        "founded_date": "1242",
        "dissolved_date": "1502",
        "headquarters": "Sarai",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Khanate",
          "start": 1242,
          "end": 1502,
          "description": "Founded by Batu Khan, it ruled from Sarai on the Volga, collected tribute from Rus' princes, converted to Islam under Özbeg, and broke apart in the 15th century."
        }
      ],
      "why": "Its rule shaped the rise of Moscow and the Tatar peoples of Russia, Crimea and Kazakhstan."
    },
    {
      "slug": "rumi",
      "name": "Rumi",
      "type": "person",
      "wiki": "Rumi",
      "description": "Persian Sufi poet in Konya whose Masnavi became a central text of Islamic mysticism and whose followers founded the Mevlevi order.",
      "metadata": {
        "birth_date": "1207",
        "death_date": "1273",
        "nationality": "Persian"
      },
      "periods": [
        {
          "label": "Poetry in Konya",
          "start": 1244,
          "end": 1273,
          "description": "After meeting Shams Tabrizi in 1244 he composed the Divan-e Shams and the six books of the Masnavi."
        }
      ],
      "why": "His poetry has been read across the Persian, Turkish and South Asian worlds for 750 years and sells widely in translation today."
    },
    {
      "slug": "thomas-aquinas",
      "name": "Thomas Aquinas",
      "type": "person",
      "wiki": "Thomas Aquinas",
      "description": "Italian Dominican friar whose Summa Theologica joined Aristotle's philosophy to Christian theology.",
      "metadata": {
        "birth_date": "1225",
        "death_date": "1274",
        "nationality": "Italian"
      },
      "periods": [
        {
          "label": "Teaching and writing",
          "start": 1252,
          "end": 1274,
          "description": "He taught at Paris and Naples and wrote the Summa contra Gentiles and the Summa Theologica."
        }
      ],
      "why": "His system became the official theology of the Catholic Church and the basis of natural-law thought."
    },
    {
      "slug": "kublai-khan",
      "name": "Kublai Khan",
      "type": "person",
      "wiki": "Kublai Khan",
      "description": "Grandson of Genghis Khan who became Great Khan, founded the Yuan dynasty, and completed the Mongol conquest of China in 1279.",
      "metadata": {
        "birth_date": "1215",
        "death_date": "1294",
        "nationality": "Mongol"
      },
      "periods": [
        {
          "label": "Great Khan",
          "start": 1260,
          "end": 1294,
          "description": "He ruled from Khanbaliq, conquered the Southern Song, and launched failed invasions of Japan, Vietnam and Java."
        }
      ],
      "why": "He brought all of China under one government again and placed its capital at Beijing."
    },
    {
      "slug": "ethiopian-empire",
      "name": "Ethiopian Empire",
      "type": "organization",
      "wiki": "Ethiopian Empire",
      "description": "The Christian empire of the Solomonic dynasty in the Horn of Africa, which kept Orthodox Tewahedo Christianity and its independence until 1974.",
      "metadata": {
        "founded_date": "1270",
        "dissolved_date": "1974",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Solomonic empire",
          "start": 1270,
          "end": 1974,
          "description": "Solomonic emperors ruled the highlands, defeated the Adal Sultanate with Portuguese help in 1543, and defeated Italy at Adwa in 1896."
        }
      ],
      "why": "It kept an African Christian state independent through the colonial era and became a symbol for Pan-Africanism and Rastafari."
    },
    {
      "slug": "marco-polo",
      "name": "Marco Polo",
      "type": "person",
      "wiki": "Marco Polo",
      "description": "Venetian merchant whose account of his travels through Asia and service at Kublai Khan's court shaped Europe's picture of the East.",
      "metadata": {
        "birth_date": "1254",
        "death_date": "1324",
        "nationality": "Venetian"
      },
      "periods": [
        {
          "label": "Travels in Asia",
          "start": 1271,
          "end": 1295,
          "description": "Marco Polo travelled the Silk Road to Yuan China, served Kublai Khan and returned by sea to Venice."
        },
        {
          "label": "The book of his travels",
          "start": 1298,
          "end": 1324,
          "description": "His dictated account circulated across Europe and later guided explorers including Columbus."
        }
      ],
      "why": "The best-known European window onto Asia for two centuries, and an inspiration to the age of exploration."
    },
    {
      "slug": "yuan-dynasty",
      "name": "Yuan dynasty",
      "type": "organization",
      "wiki": "Yuan dynasty",
      "description": "The Mongol dynasty founded by Kublai Khan that conquered the Song and ruled all of China from Khanbaliq, present-day Beijing.",
      "metadata": {
        "founded_date": "1271",
        "dissolved_date": "1368",
        "headquarters": "Khanbaliq",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Mongol rule of China",
          "start": 1271,
          "end": 1368,
          "description": "Yuan emperors united China under Mongol rule, issued paper money across the empire, opened China to Eurasian travellers, and were driven north by the Red Turban rebels."
        }
      ],
      "why": "It reunified China, made Beijing its capital, and joined it to Eurasian trade."
    },
    {
      "slug": "ibn-taymiyya",
      "name": "Ibn Taymiyya",
      "type": "person",
      "wiki": "Ibn Taymiyya",
      "description": "Hanbali theologian in Mamluk Damascus who called for a return to the practice of the early Muslims and declared the converted Mongol rulers of the Ilkhanate unbelievers.",
      "metadata": {
        "birth_date": "1263",
        "death_date": "1328",
        "nationality": "Arab"
      },
      "periods": [
        {
          "label": "Preaching and fatwas",
          "start": 1293,
          "end": 1328,
          "description": "He issued fatwas for war against the Ilkhanate, fought at Shaqhab in 1303, and was imprisoned several times in Cairo and Damascus, where he died."
        }
      ],
      "why": "His writings are a primary source for Wahhabism, the Salafi movement and modern jihadism."
    },
    {
      "slug": "ottoman-empire",
      "name": "Ottoman Empire",
      "type": "organization",
      "wiki": "Ottoman Empire",
      "description": "The Turkish dynastic empire that ruled Anatolia, the Balkans, the Arab Middle East and North Africa for six centuries and claimed the caliphate from 1517.",
      "metadata": {
        "founded_date": "1299",
        "dissolved_date": "1922",
        "headquarters": "Constantinople",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Ottoman rule",
          "start": 1299,
          "end": 1922,
          "description": "Ottoman sultans took Constantinople in 1453, Egypt in 1517 and Hungary in 1526, governed through the millet system, and lost territory from 1699 until the empire's partition after World War I."
        }
      ],
      "why": "Its six centuries of rule and its partition drew the borders of the modern Balkans and Middle East."
    },
    {
      "slug": "dante-alighieri",
      "name": "Dante Alighieri",
      "type": "person",
      "wiki": "Dante Alighieri",
      "description": "Florentine poet whose Divine Comedy, written in Tuscan rather than Latin, became the foundation of the Italian language.",
      "metadata": {
        "birth_date": "1265",
        "death_date": "1321",
        "nationality": "Florentine"
      },
      "periods": [
        {
          "label": "Exile and the Comedy",
          "start": 1302,
          "end": 1321,
          "description": "Exiled from Florence in 1302, he wrote the Divine Comedy and De vulgari eloquentia and died in Ravenna."
        }
      ],
      "why": "His poem made Tuscan the Italian national language and fixed Christian images of hell, purgatory and heaven."
    },
    {
      "slug": "mansa-musa",
      "name": "Mansa Musa",
      "type": "person",
      "wiki": "Mansa Musa",
      "description": "Emperor of Mali whose 1324 pilgrimage to Mecca, with enough gold to depress prices in Cairo, made West Africa's wealth known in Europe and the Middle East.",
      "metadata": {
        "birth_date": "c. 1280",
        "death_date": "c. 1337",
        "nationality": "Malian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1312,
          "end": 1337,
          "description": "He expanded Mali to Gao and Timbuktu, made the hajj in 1324 and 1325, and built mosques and schools in Timbuktu."
        }
      ],
      "why": "He made Timbuktu a center of Islamic learning and put Mali on the maps of Europe."
    },
    {
      "slug": "ibn-battuta",
      "name": "Ibn Battuta",
      "type": "person",
      "wiki": "Ibn Battuta",
      "description": "Moroccan scholar and traveller whose journeys across Africa, the Middle East and Asia are recorded in the Rihla.",
      "metadata": {
        "birth_date": "1304",
        "death_date": "1369",
        "nationality": "Moroccan"
      },
      "periods": [
        {
          "label": "Travels and the Rihla",
          "start": 1325,
          "end": 1355,
          "description": "Ibn Battuta travelled some 117,000 kilometres across the Islamic world and beyond, then dictated the Rihla."
        }
      ],
      "why": "The most extensive traveller of the pre-modern world and a primary source for fourteenth-century Africa and Asia."
    },
    {
      "slug": "hundred-years-war",
      "name": "Hundred Years' War",
      "type": "event",
      "wiki": "Hundred Years' War",
      "description": "The series of wars between England and France over the French throne, ending with England's expulsion from France except Calais.",
      "metadata": {
        "start_date": "1337",
        "end_date": "1453",
        "location": "France",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "War",
          "start": 1337,
          "end": 1453,
          "description": "English armies won at Crecy, Poitiers and Agincourt, France recovered under Charles VII, and the war ended at Castillon."
        }
      ],
      "why": "It forged English and French national identities and ended the military dominance of armored knights."
    },
    {
      "slug": "renaissance",
      "name": "Renaissance",
      "type": "event",
      "wiki": "Renaissance",
      "description": "The European cultural movement, begun in 14th-century Italy, that revived classical learning and transformed art, architecture, literature and science.",
      "metadata": {
        "start_date": "14th century",
        "end_date": "17th century",
        "location": "Italy and Europe",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Italian and northern Renaissance",
          "start": 1350,
          "end": 1600,
          "description": "Humanist scholars recovered Greek and Latin texts, and artists in Florence, Rome, Venice and northern Europe developed perspective, naturalism and new architecture."
        }
      ],
      "why": "Its humanism, art and scholarship shaped Western education and prepared the Reformation and the Scientific Revolution."
    },
    {
      "slug": "ming-dynasty",
      "name": "Ming dynasty",
      "type": "organization",
      "wiki": "Ming dynasty",
      "description": "The Chinese dynasty founded by Zhu Yuanzhang after Mongol rule, which rebuilt the Great Wall, built the Forbidden City, and sent Zheng He's fleets across the Indian Ocean.",
      "metadata": {
        "founded_date": "1368",
        "dissolved_date": "1644",
        "headquarters": "Beijing",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Ming rule",
          "start": 1368,
          "end": 1644,
          "description": "Ming emperors ruled from Nanjing and then Beijing, drew in much of the world's silver through trade, and fell to rebels and the Manchus in 1644."
        }
      ],
      "why": "It governed China for 276 years and built the Great Wall and Forbidden City that stand today."
    },
    {
      "slug": "timur",
      "name": "Timur",
      "type": "person",
      "wiki": "Timur",
      "description": "Turco-Mongol conqueror who founded the Timurid Empire across Central Asia, Persia and Mesopotamia through campaigns that killed millions.",
      "metadata": {
        "birth_date": "1336",
        "death_date": "1405",
        "nationality": "Turco-Mongol"
      },
      "periods": [
        {
          "label": "Conquests",
          "start": 1370,
          "end": 1405,
          "description": "From Samarkand he campaigned from Delhi to Damascus and Ankara, sacked Baghdad and Delhi, and died marching on Ming China."
        }
      ],
      "why": "His campaigns killed millions across Asia, and his descendant Babur founded the Mughal Empire."
    },
    {
      "slug": "kingdom-of-kongo",
      "name": "Kingdom of Kongo",
      "type": "organization",
      "wiki": "Kingdom of Kongo",
      "description": "The Central African kingdom whose rulers adopted Christianity after Portuguese contact in 1483 and whose wars fed the Atlantic slave trade.",
      "metadata": {
        "founded_date": "c. 1390",
        "dissolved_date": "1914",
        "headquarters": "M'banza-Kongo",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Independent kingdom",
          "start": 1390,
          "end": 1665,
          "description": "Kongo's kings ruled the lower Congo, converted to Christianity under Afonso I, traded with Portugal, and were defeated by Portuguese Angola at Mbwila in 1665."
        }
      ],
      "why": "Its alliance and wars with Portugal opened Central Africa to the Atlantic slave trade, and its people carried Kongo culture to Brazil, the Caribbean and North America."
    },
    {
      "slug": "zheng-he",
      "name": "Zheng He",
      "type": "person",
      "wiki": "Zheng He",
      "description": "Ming admiral and eunuch who commanded seven treasure fleet voyages across the Indian Ocean to Southeast Asia, India, Arabia and East Africa.",
      "metadata": {
        "birth_date": "1371",
        "death_date": "1433",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Treasure voyages",
          "start": 1405,
          "end": 1433,
          "description": "He led fleets of hundreds of ships on seven voyages for the Yongle and Xuande emperors."
        }
      ],
      "why": "His voyages carried Chinese power and trade to East Africa decades before European navigators arrived, and he is honored across Southeast Asia."
    },
    {
      "slug": "age-of-discovery",
      "name": "Age of Discovery",
      "type": "event",
      "wiki": "Age of Discovery",
      "description": "The era of European ocean exploration from the 15th to the 17th century that charted sea routes to Africa, Asia and the Americas.",
      "metadata": {
        "start_date": "1415",
        "end_date": "1600",
        "location": "Atlantic, Indian and Pacific Oceans",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Ocean exploration",
          "start": 1415,
          "end": 1600,
          "description": "Portuguese and Spanish expeditions rounded Africa, crossed the Atlantic and Pacific, and were followed by Dutch, English and French voyages."
        }
      ],
      "why": "It connected the world's continents by sea and began the colonial era and the global economy."
    },
    {
      "slug": "portuguese-empire",
      "name": "Portuguese Empire",
      "type": "organization",
      "wiki": "Portuguese Empire",
      "description": "The maritime empire of Portugal, begun with the capture of Ceuta in 1415, which built a trading and colonial network from Brazil to Africa, India, Malacca and Macau.",
      "metadata": {
        "founded_date": "1415",
        "dissolved_date": "1999",
        "headquarters": "Lisbon",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Portuguese expansion",
          "start": 1415,
          "end": 1999,
          "description": "Portugal explored the African coast, reached India by sea, colonized Brazil, ran the first large-scale Atlantic slave trade, and handed Macau to China in 1999."
        }
      ],
      "why": "It opened the sea route between Europe and Asia and made Portuguese the language of over 250 million people in Brazil, Angola and Mozambique."
    },
    {
      "slug": "sejong-the-great",
      "name": "Sejong the Great",
      "type": "person",
      "wiki": "Sejong the Great",
      "description": "Fourth king of the Joseon dynasty of Korea, who commissioned the Hangul alphabet and sponsored advances in astronomy, agriculture and printing.",
      "metadata": {
        "birth_date": "1397",
        "death_date": "1450",
        "nationality": "Korean"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1418,
          "end": 1450,
          "description": "He founded the Hall of Worthies, promulgated Hangul in 1446, and extended Korea's northern border to the Yalu and Tumen rivers."
        }
      ],
      "why": "The alphabet he commissioned is how 80 million people read and write Korean."
    },
    {
      "slug": "aztec-empire",
      "name": "Aztec Empire",
      "type": "organization",
      "wiki": "Aztec Empire",
      "description": "The Triple Alliance of Tenochtitlan, Texcoco and Tlacopan that dominated central Mexico through tribute and warfare until the Spanish conquest.",
      "metadata": {
        "founded_date": "1428",
        "dissolved_date": "1521",
        "headquarters": "Tenochtitlan",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Triple Alliance",
          "start": 1428,
          "end": 1521,
          "description": "The Mexica and their allies conquered central and southern Mexico, built Tenochtitlan into one of the largest cities in the world, and practiced large-scale human sacrifice."
        }
      ],
      "why": "Its capital became Mexico City, and its language, foods and symbols are part of Mexican national identity."
    },
    {
      "slug": "joan-of-arc",
      "name": "Joan of Arc",
      "type": "person",
      "wiki": "Joan of Arc",
      "description": "French peasant woman who led French troops to lift the siege of Orléans in 1429 and was burned for heresy by an English-backed church court at Rouen.",
      "metadata": {
        "birth_date": "c. 1412",
        "death_date": "1431",
        "nationality": "French"
      },
      "periods": [
        {
          "label": "Campaigns and trial",
          "start": 1429,
          "end": 1431,
          "description": "She relieved Orléans, brought Charles VII to his coronation at Reims, was captured in 1430, and was executed in 1431."
        }
      ],
      "why": "She turned the Hundred Years' War toward France and became the national symbol of France and a Catholic saint."
    },
    {
      "slug": "inca-empire",
      "name": "Inca Empire",
      "type": "organization",
      "wiki": "Inca Empire",
      "description": "The largest empire in pre-Columbian America, ruling the Andes from Ecuador to Chile from its capital at Cusco.",
      "metadata": {
        "founded_date": "1438",
        "dissolved_date": "1572",
        "headquarters": "Cusco",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Inca rule",
          "start": 1438,
          "end": 1572,
          "description": "Inca rulers from Pachacuti onward conquered the Andes, built a road network spanning the mountains, and organized labor through the mit'a system without markets or money."
        }
      ],
      "why": "Its Quechua language and Andean institutions endure among millions in Peru, Bolivia and Ecuador."
    },
    {
      "slug": "hangul",
      "name": "Hangul",
      "type": "event",
      "wiki": "Hangul",
      "description": "The Korean alphabet created at King Sejong's court in 1443 and promulgated in 1446, designed so that commoners could learn to read.",
      "metadata": {
        "start_date": "1443",
        "end_date": "1446",
        "location": "Joseon Korea",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Creation and promulgation",
          "start": 1443,
          "end": 1446,
          "description": "Sejong's scholars designed the 28 letters and published them in the Hunminjeongeum."
        }
      ],
      "why": "It gave Korea mass literacy and a written national identity."
    },
    {
      "slug": "haudenosaunee",
      "name": "Haudenosaunee",
      "type": "organization",
      "wiki": "Haudenosaunee",
      "description": "The confederacy of the Mohawk, Oneida, Onondaga, Cayuga and Seneca nations, later joined by the Tuscarora, governed by the Great Law of Peace.",
      "metadata": {
        "founded_date": "c. 1450",
        "headquarters": "Onondaga",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Five and Six Nations",
          "start": 1450,
          "end": 1783,
          "description": "The confederacy governed its member nations through a council of chiefs, dominated the fur trade and warfare of the Northeast, and allied with Britain until the American Revolution."
        }
      ],
      "why": "It was the most powerful Native American polity of the colonial Northeast and a model of federal union cited by American founders."
    },
    {
      "slug": "fall-of-constantinople",
      "name": "Fall of Constantinople",
      "type": "event",
      "wiki": "Fall of Constantinople",
      "description": "The capture of the Byzantine capital by the Ottoman army of Mehmed II on 29 May 1453, which ended the Roman Empire in the east.",
      "metadata": {
        "start_date": "1453",
        "end_date": "1453",
        "location": "Constantinople",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Siege",
          "start": 1453,
          "end": 1453,
          "description": "The Ottomans besieged the city from 6 April, breached its walls with heavy cannon, and made it their capital."
        }
      ],
      "why": "It ended a state that had lasted since antiquity, made Istanbul an imperial capital again, and sent Greek scholars and manuscripts to Italy."
    },
    {
      "slug": "songhai-empire",
      "name": "Songhai Empire",
      "type": "organization",
      "wiki": "Songhai Empire",
      "description": "The West African empire ruled from Gao that succeeded Mali along the Niger and fell to a Moroccan invasion in 1591.",
      "metadata": {
        "founded_date": "1464",
        "dissolved_date": "1591",
        "headquarters": "Gao",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Imperial Songhai",
          "start": 1464,
          "end": 1591,
          "description": "Sunni Ali and Askia Muhammad conquered the Niger valley, made Timbuktu's Sankore a center of learning, and lost the Battle of Tondibi to Morocco."
        }
      ],
      "why": "It was one of the largest states in African history and the height of Timbuktu's scholarship."
    },
    {
      "slug": "isabella-i-of-castile",
      "name": "Isabella I of Castile",
      "type": "person",
      "wiki": "Isabella I of Castile",
      "description": "Queen of Castile who with Ferdinand II of Aragon united Spain, conquered Granada, expelled Spain's Jews and sponsored Columbus's voyage.",
      "metadata": {
        "birth_date": "1451",
        "death_date": "1504",
        "nationality": "Castilian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1474,
          "end": 1504,
          "description": "She set up the Spanish Inquisition in 1478, conquered Granada in 1492, issued the Alhambra Decree, and funded Columbus."
        }
      ],
      "why": "Her decisions of 1492 launched the Spanish Empire and the Catholic conversion of the Americas."
    },
    {
      "slug": "spanish-empire",
      "name": "Spanish Empire",
      "type": "organization",
      "wiki": "Spanish Empire",
      "description": "The global empire of the Spanish crown that colonized Mexico, Central and South America, the Caribbean and the Philippines.",
      "metadata": {
        "founded_date": "1492",
        "dissolved_date": "1976",
        "headquarters": "Madrid",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Imperial Spain",
          "start": 1492,
          "end": 1898,
          "description": "Spain conquered the Aztec and Inca empires, mined American silver, ran the Manila galleons, lost most of its American colonies in the 1820s and the rest in 1898."
        }
      ],
      "why": "It made Spanish the language and Catholicism the religion of hundreds of millions in the Americas."
    },
    {
      "slug": "vasco-da-gama",
      "name": "Vasco da Gama",
      "type": "person",
      "wiki": "Vasco da Gama",
      "description": "Portuguese navigator who commanded the first European fleet to reach India by sailing around Africa, arriving at Calicut in 1498.",
      "metadata": {
        "birth_date": "c. 1460",
        "death_date": "1524",
        "nationality": "Portuguese"
      },
      "periods": [
        {
          "label": "Voyages to India",
          "start": 1497,
          "end": 1524,
          "description": "He led the 1497 to 1499 voyage to India, a second armed voyage in 1502, and served as viceroy of Portuguese India in 1524."
        }
      ],
      "why": "His route gave Europe direct sea access to Asian trade and began European empire in Asia."
    },
    {
      "slug": "niccolo-machiavelli",
      "name": "Niccolò Machiavelli",
      "type": "person",
      "wiki": "Niccolò Machiavelli",
      "description": "Florentine diplomat and writer whose The Prince described political power as it is exercised rather than as moral philosophy said it should be.",
      "metadata": {
        "birth_date": "1469",
        "death_date": "1527",
        "nationality": "Florentine"
      },
      "periods": [
        {
          "label": "Office and exile",
          "start": 1498,
          "end": 1527,
          "description": "He served as secretary of the Florentine Republic, was exiled after 1512, and wrote The Prince and the Discourses on Livy."
        }
      ],
      "why": "He founded modern political science, and his name became the word for ruthless statecraft."
    },
    {
      "slug": "guru-nanak",
      "name": "Guru Nanak",
      "type": "person",
      "wiki": "Guru Nanak",
      "description": "Punjabi spiritual teacher who founded Sikhism, preaching one God, the equality of all people and the rejection of caste.",
      "metadata": {
        "birth_date": "1469",
        "death_date": "1539",
        "nationality": "Punjabi"
      },
      "periods": [
        {
          "label": "Teaching",
          "start": 1499,
          "end": 1539,
          "description": "After his revelation in 1499 he travelled across South Asia and to Mecca and Baghdad teaching, then founded the community at Kartarpur."
        }
      ],
      "why": "The religion he founded has over 25 million followers."
    },
    {
      "slug": "sikhism",
      "name": "Sikhism",
      "type": "organization",
      "wiki": "Sikhism",
      "description": "The monotheistic religion founded by Guru Nanak in Punjab and shaped by nine successor gurus and the scripture Guru Granth Sahib.",
      "metadata": {
        "founded_date": "1499",
        "headquarters": "Amritsar",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Sikh community",
          "start": 1499,
          "end": 2026,
          "description": "Ten gurus led the community, compiled the Adi Granth in 1604 and founded the Khalsa in 1699, and the faith spread with Punjabi migration worldwide."
        }
      ],
      "why": "It is the world's fifth-largest organized religion and the core of Punjabi identity."
    },
    {
      "slug": "safavid-iran",
      "name": "Safavid Iran",
      "type": "organization",
      "wiki": "Safavid Iran",
      "description": "The Iranian empire founded by Ismail I in 1501 that made Twelver Shia Islam the state religion of Iran.",
      "metadata": {
        "founded_date": "1501",
        "dissolved_date": "1736",
        "headquarters": "Isfahan",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Safavid rule",
          "start": 1501,
          "end": 1736,
          "description": "Safavid shahs conquered Iran, converted its Sunni majority to Shia Islam, fought the Ottomans, and built Isfahan as their capital under Abbas I."
        }
      ],
      "why": "It made Iran a Shia nation, the basis of its identity and its rivalry with Sunni powers ever since."
    },
    {
      "slug": "bartolome-de-las-casas",
      "name": "Bartolomé de las Casas",
      "type": "person",
      "wiki": "Bartolomé de las Casas",
      "description": "Spanish Dominican friar and bishop who documented the abuse of indigenous peoples in the Americas and argued for their rights before the Spanish crown.",
      "metadata": {
        "birth_date": "1484",
        "death_date": "1566",
        "nationality": "Spanish"
      },
      "periods": [
        {
          "label": "Advocacy",
          "start": 1514,
          "end": 1566,
          "description": "After giving up his encomienda in 1514 he campaigned at court, shaped the New Laws of 1542, wrote A Short Account of the Destruction of the Indies, and debated Sepulveda at Valladolid."
        }
      ],
      "why": "His writings opened the debate on the rights of colonized peoples and fed modern human-rights thought."
    },
    {
      "slug": "ferdinand-magellan",
      "name": "Ferdinand Magellan",
      "type": "person",
      "wiki": "Ferdinand Magellan",
      "description": "Portuguese navigator who led the Spanish expedition that made the first circumnavigation of the Earth.",
      "metadata": {
        "birth_date": "1480",
        "death_date": "1521",
        "nationality": "Portuguese"
      },
      "periods": [
        {
          "label": "The westward expedition",
          "start": 1519,
          "end": 1521,
          "description": "Magellan crossed the Atlantic and Pacific, reached the Philippines and was killed at Mactan; his ship completed the circuit in 1522."
        }
      ],
      "why": "His voyage proved the oceans were connected and opened the Pacific to European trade and conquest."
    },
    {
      "slug": "magellan-expedition",
      "name": "Magellan expedition",
      "type": "event",
      "wiki": "Magellan expedition",
      "description": "The Spanish expedition led by Ferdinand Magellan and completed by Juan Sebastián Elcano that made the first circumnavigation of the Earth.",
      "metadata": {
        "start_date": "1519",
        "end_date": "1522",
        "location": "Atlantic, Pacific and Indian Oceans",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Circumnavigation",
          "start": 1519,
          "end": 1522,
          "description": "Five ships left Seville, crossed the Pacific, and reached the Philippines, where Magellan was killed in 1521; one ship returned to Spain in 1522."
        }
      ],
      "why": "It showed the true size of the Earth and the connection of its oceans and led to Spanish rule of the Philippines."
    },
    {
      "slug": "mughal-empire",
      "name": "Mughal Empire",
      "type": "organization",
      "wiki": "Mughal Empire",
      "description": "The Muslim empire founded by Babur in 1526 that ruled most of the Indian subcontinent from Agra and Delhi.",
      "metadata": {
        "founded_date": "1526",
        "dissolved_date": "1857",
        "headquarters": "Delhi",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Imperial era",
          "start": 1526,
          "end": 1707,
          "description": "Mughal emperors from Babur to Aurangzeb conquered northern and central India, built the Taj Mahal and Red Fort, and ran land revenue through the mansabdari system."
        },
        {
          "label": "Decline",
          "start": 1707,
          "end": 1857,
          "description": "Successor states broke away and the emperor in Delhi became a British pensioner until his deposition after the 1857 rebellion."
        }
      ],
      "why": "It shaped the architecture, languages, cuisine and Hindu-Muslim relations of South Asia."
    },
    {
      "slug": "our-lady-of-guadalupe",
      "name": "Our Lady of Guadalupe",
      "type": "person",
      "wiki": "Our Lady of Guadalupe",
      "description": "The Marian apparition of 1531 at Tepeyac near Mexico City, whose image on Juan Diego's cloak became the most venerated Catholic icon in the Americas.",
      "metadata": {
        "birth_date": "1531",
        "nationality": "Mexican"
      },
      "periods": [
        {
          "label": "Devotion",
          "start": 1531,
          "end": 2026,
          "description": "Her image at Tepeyac drew converts in New Spain, became the banner of Mexican independence in 1810, and draws millions of pilgrims a year to her basilica."
        }
      ],
      "why": "She is the central symbol of Mexican Catholicism and national identity, and her basilica is among the most visited Catholic shrines in the world."
    },
    {
      "slug": "spanish-conquest-of-the-inca-empire",
      "name": "Spanish conquest of the Inca Empire",
      "type": "event",
      "wiki": "Spanish conquest of the Inca Empire",
      "description": "The conquest of the Inca Empire by Spanish forces under Francisco Pizarro, from the capture of Atahualpa at Cajamarca in 1532 to the execution of Tupac Amaru in 1572.",
      "metadata": {
        "start_date": "1532",
        "end_date": "1572",
        "location": "Andes",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Conquest",
          "start": 1532,
          "end": 1572,
          "description": "Pizarro's men captured and executed Atahualpa, took Cusco, defeated Inca resistance, and destroyed the last Inca state at Vilcabamba."
        }
      ],
      "why": "It delivered the Andes and the silver of Potosi to Spain, funding its empire and the global silver trade."
    },
    {
      "slug": "church-of-england",
      "name": "Church of England",
      "type": "organization",
      "wiki": "Church of England",
      "description": "The established church of England, which broke from papal authority under Henry VIII in 1534 and became the mother church of the worldwide Anglican Communion.",
      "metadata": {
        "founded_date": "1534",
        "headquarters": "London",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Established church",
          "start": 1534,
          "end": 2026,
          "description": "It was separated from Rome by the Act of Supremacy, defined by the Book of Common Prayer and the Elizabethan Settlement, and spread with the British Empire."
        }
      ],
      "why": "The Anglican Communion it founded has 85 million members, and its liturgy and the King James Bible shaped the English language."
    },
    {
      "slug": "john-calvin",
      "name": "John Calvin",
      "type": "person",
      "wiki": "John Calvin",
      "description": "French theologian whose Institutes of the Christian Religion and leadership of Geneva established Reformed Protestantism.",
      "metadata": {
        "birth_date": "1509",
        "death_date": "1564",
        "nationality": "French"
      },
      "periods": [
        {
          "label": "Geneva",
          "start": 1536,
          "end": 1564,
          "description": "He published the Institutes in 1536 and led the church of Geneva, training ministers who spread Reformed churches to France, Scotland, the Netherlands and England."
        }
      ],
      "why": "His theology shaped the Presbyterian, Reformed and Puritan churches and through them the Dutch Republic, Scotland and New England."
    },
    {
      "slug": "reformed-christianity",
      "name": "Reformed Christianity",
      "type": "organization",
      "wiki": "Reformed Christianity",
      "description": "The Calvinist branch of Protestantism, built on the theology of John Calvin and other Swiss reformers, with Presbyterian and Congregational church governments.",
      "metadata": {
        "founded_date": "1536",
        "headquarters": "Geneva",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Reformed churches",
          "start": 1536,
          "end": 2026,
          "description": "Reformed churches spread from Geneva and Zurich to France, Scotland, the Netherlands, Hungary and New England, and later to Korea and southern Africa."
        }
      ],
      "why": "It formed the national churches of Scotland and the Netherlands and the Puritan colonies of New England."
    },
    {
      "slug": "jesuits",
      "name": "Jesuits",
      "type": "organization",
      "wiki": "Jesuits",
      "description": "The Catholic religious order founded by Ignatius of Loyola in 1540 that became the main agent of Catholic education and overseas missions.",
      "metadata": {
        "founded_date": "1540",
        "headquarters": "Rome",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Society of Jesus",
          "start": 1540,
          "end": 2026,
          "description": "Jesuits founded hundreds of schools and universities, led missions in India, China, Japan and the Americas, were suppressed from 1773 to 1814, and continue today."
        }
      ],
      "why": "Its schools educated Catholic elites for five centuries and its missionaries carried Christianity and European science to Asia and the Americas."
    },
    {
      "slug": "counter-reformation",
      "name": "Counter-Reformation",
      "type": "event",
      "wiki": "Counter-Reformation",
      "description": "The Catholic Church's response to the Protestant Reformation, centered on the Council of Trent, which reformed clergy and doctrine and won back much of central Europe for Catholicism.",
      "metadata": {
        "start_date": "1545",
        "end_date": "1648",
        "location": "Catholic Europe",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Catholic Reformation",
          "start": 1545,
          "end": 1648,
          "description": "The Council of Trent defined Catholic doctrine, new orders founded schools and missions, and Catholic rulers restored the faith in Poland, Austria and Bavaria."
        }
      ],
      "why": "It fixed Catholic worship and doctrine until the Second Vatican Council and kept southern and central Europe Catholic."
    },
    {
      "slug": "akbar",
      "name": "Akbar",
      "type": "person",
      "wiki": "Akbar",
      "description": "The third Mughal emperor, who extended the empire across northern India and built its government on religious tolerance and alliances with Hindu Rajputs.",
      "metadata": {
        "birth_date": "1542",
        "death_date": "1605",
        "nationality": "Mughal"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1556,
          "end": 1605,
          "description": "He conquered Gujarat, Bengal and Kashmir, abolished the jizya tax on non-Muslims, and held interfaith debates at Fatehpur Sikri."
        }
      ],
      "why": "He turned the Mughal conquest into a durable state and a model of pluralist rule in India."
    },
    {
      "slug": "elizabeth-i",
      "name": "Elizabeth I",
      "type": "person",
      "wiki": "Elizabeth I",
      "description": "Queen of England whose reign settled the Church of England, defeated the Spanish Armada, and began English colonization and overseas trade.",
      "metadata": {
        "birth_date": "1533",
        "death_date": "1603",
        "nationality": "English"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1558,
          "end": 1603,
          "description": "She passed the Elizabethan Religious Settlement, backed privateers against Spain, defeated the Armada in 1588, and chartered the East India Company in 1600."
        }
      ],
      "why": "Her reign fixed England as a Protestant sea power and began its overseas expansion."
    },
    {
      "slug": "sun-wukong",
      "name": "Sun Wukong",
      "type": "person",
      "wiki": "Sun Wukong",
      "description": "The Monkey King of the novel Journey to the West, who rebels against heaven and then escorts the monk Xuanzang to India.",
      "metadata": {
        "birth_date": "1592",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Journey to the West and its retellings",
          "start": 1592,
          "end": 2026,
          "description": "He appeared in the 1592 novel and has been retold in Chinese opera, Japanese manga, film, television and video games."
        }
      ],
      "why": "He is one of the most retold characters in East Asian literature and popular culture."
    },
    {
      "slug": "johannes-kepler",
      "name": "Johannes Kepler",
      "type": "person",
      "wiki": "Johannes Kepler",
      "description": "German astronomer who discovered the three laws of planetary motion, showing that planets move in ellipses around the Sun.",
      "metadata": {
        "birth_date": "1571",
        "death_date": "1630",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Astronomy",
          "start": 1594,
          "end": 1630,
          "description": "He worked with Tycho Brahe in Prague, published Astronomia Nova in 1609 and Harmonices Mundi in 1619, and compiled the Rudolphine Tables."
        }
      ],
      "why": "His laws made heliocentrism accurate and gave Newton the regularities he explained with gravitation."
    },
    {
      "slug": "francis-bacon",
      "name": "Francis Bacon",
      "type": "person",
      "wiki": "Francis Bacon",
      "description": "English statesman and philosopher who argued that knowledge should be built by systematic observation and experiment rather than from authority.",
      "metadata": {
        "birth_date": "1561",
        "death_date": "1626",
        "nationality": "English"
      },
      "periods": [
        {
          "label": "Statesman and philosopher",
          "start": 1597,
          "end": 1626,
          "description": "He served as Lord Chancellor of England and wrote The Advancement of Learning and the Novum Organum."
        }
      ],
      "why": "His empirical method became the program of the Royal Society and of modern experimental science."
    },
    {
      "slug": "east-india-company",
      "name": "East India Company",
      "type": "organization",
      "wiki": "East India Company",
      "description": "The English chartered trading company that came to rule most of India with its private army until the British crown took over in 1858.",
      "metadata": {
        "founded_date": "1600",
        "dissolved_date": "1874",
        "headquarters": "London",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Trade and rule",
          "start": 1600,
          "end": 1858,
          "description": "It traded textiles, tea and opium, won at Plassey in 1757, governed Bengal and then most of India, and lost its powers after the 1857 rebellion."
        }
      ],
      "why": "It turned British trade into British rule of India and built the global trade in tea, cotton and opium."
    },
    {
      "slug": "dutch-east-india-company",
      "name": "Dutch East India Company",
      "type": "organization",
      "wiki": "Dutch East India Company",
      "description": "The Dutch chartered company that held a monopoly on Dutch trade in Asia, issued the first publicly traded shares, and ruled the spice islands of Indonesia.",
      "metadata": {
        "founded_date": "1602",
        "dissolved_date": "1799",
        "headquarters": "Amsterdam",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Company rule and trade",
          "start": 1602,
          "end": 1799,
          "description": "The VOC traded spices, textiles and porcelain, conquered the Banda Islands and Java, founded Batavia and the Cape Colony, and was dissolved bankrupt in 1799."
        }
      ],
      "why": "It created the joint-stock corporation and the stock exchange and laid the foundation of colonial Indonesia."
    },
    {
      "slug": "tokugawa-shogunate",
      "name": "Tokugawa shogunate",
      "type": "organization",
      "wiki": "Tokugawa shogunate",
      "description": "The military government of the Tokugawa clan that ruled Japan from Edo, kept two and a half centuries of peace, and restricted foreign contact.",
      "metadata": {
        "founded_date": "1603",
        "dissolved_date": "1868",
        "headquarters": "Edo",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Edo period",
          "start": 1603,
          "end": 1868,
          "description": "Tokugawa shoguns controlled the daimyo through alternate attendance, banned Christianity, limited foreign trade to Nagasaki, and fell in the Meiji Restoration."
        }
      ],
      "why": "Its peace, urban growth and literacy produced the society that modernized under Meiji."
    },
    {
      "slug": "rene-descartes",
      "name": "René Descartes",
      "type": "person",
      "wiki": "René Descartes",
      "description": "French philosopher and mathematician who founded modern rationalist philosophy with 'I think, therefore I am' and invented analytic geometry.",
      "metadata": {
        "birth_date": "1596",
        "death_date": "1650",
        "nationality": "French"
      },
      "periods": [
        {
          "label": "Philosophy and mathematics",
          "start": 1619,
          "end": 1650,
          "description": "Living mostly in the Dutch Republic, he wrote the Discourse on the Method, the Meditations and La Geometrie, and died in Stockholm."
        }
      ],
      "why": "Cartesian coordinates and his method of doubt became foundations of modern mathematics and philosophy."
    },
    {
      "slug": "nzinga-of-ndongo-and-matamba",
      "name": "Nzinga of Ndongo and Matamba",
      "type": "person",
      "wiki": "Nzinga of Ndongo and Matamba",
      "description": "Queen of the Mbundu kingdoms of Ndongo and Matamba in present-day Angola who fought Portuguese colonization for four decades.",
      "metadata": {
        "birth_date": "c. 1583",
        "death_date": "1663",
        "nationality": "Mbundu"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1624,
          "end": 1663,
          "description": "She ruled Ndongo and then Matamba, allied with the Dutch and the Imbangala, and fought Portuguese forces until a treaty in 1657."
        }
      ],
      "why": "She is the defining figure of resistance to colonization in Angola and across the African diaspora."
    },
    {
      "slug": "qing-dynasty",
      "name": "Qing dynasty",
      "type": "organization",
      "wiki": "Qing dynasty",
      "description": "The Manchu dynasty that conquered Ming China and added Mongolia, Xinjiang, Tibet and Taiwan to it, setting most of the borders of modern China.",
      "metadata": {
        "founded_date": "1644",
        "dissolved_date": "1912",
        "headquarters": "Beijing",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Qing rule",
          "start": 1644,
          "end": 1912,
          "description": "Qing emperors conquered China and its Inner Asian frontiers, presided over a population rise to 400 million, and fell in the 1911 revolution."
        }
      ],
      "why": "Its conquests defined the territory that China claims today."
    },
    {
      "slug": "peace-of-westphalia",
      "name": "Peace of Westphalia",
      "type": "event",
      "wiki": "Peace of Westphalia",
      "description": "The treaties signed at Osnabrück and Münster in 1648 that ended the Thirty Years' War and the Eighty Years' War.",
      "metadata": {
        "start_date": "1648",
        "end_date": "1648",
        "location": "Osnabrück and Münster",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Signing",
          "start": 1648,
          "end": 1648,
          "description": "The Emperor, France, Sweden, Spain, the Dutch Republic and the German princes signed treaties recognizing Dutch and Swiss independence and the princes' right to set their territories' religion."
        }
      ],
      "why": "It is the founding reference for the modern system of sovereign states."
    },
    {
      "slug": "aurangzeb",
      "name": "Aurangzeb",
      "type": "person",
      "wiki": "Aurangzeb",
      "description": "The sixth Mughal emperor, who extended the empire to its greatest size and reimposed Islamic law and the jizya on non-Muslims.",
      "metadata": {
        "birth_date": "1618",
        "death_date": "1707",
        "nationality": "Mughal"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1658,
          "end": 1707,
          "description": "He seized the throne from his father, conquered the Deccan sultanates, fought the Marathas for 27 years, and compiled the Fatawa-e-Alamgiri."
        }
      ],
      "why": "His wars and religious policies overstretched the empire, which broke apart after his death and opened India to British conquest."
    },
    {
      "slug": "peter-the-great",
      "name": "Peter the Great",
      "type": "person",
      "wiki": "Peter the Great",
      "description": "Tsar who westernized Russia's state and army, founded Saint Petersburg, and made Russia a European great power by defeating Sweden.",
      "metadata": {
        "birth_date": "1672",
        "death_date": "1725",
        "nationality": "Russian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1682,
          "end": 1725,
          "description": "He toured western Europe, built a navy, won the Great Northern War, created the Table of Ranks, and proclaimed the Russian Empire in 1721."
        }
      ],
      "why": "He set Russia's course as a European empire that lasted until 1917."
    },
    {
      "slug": "glorious-revolution",
      "name": "Glorious Revolution",
      "type": "event",
      "wiki": "Glorious Revolution",
      "description": "The deposition of James II of England in 1688 by Parliament and William of Orange, followed by the Bill of Rights 1689.",
      "metadata": {
        "start_date": "1688",
        "end_date": "1689",
        "location": "England",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Revolution and settlement",
          "start": 1688,
          "end": 1689,
          "description": "William of Orange landed at Torbay, James II fled to France, and Parliament offered the crown to William and Mary on the terms of the Bill of Rights."
        }
      ],
      "why": "It established parliamentary supremacy and constitutional monarchy, the model for later liberal constitutions."
    },
    {
      "slug": "johann-sebastian-bach",
      "name": "Johann Sebastian Bach",
      "type": "person",
      "wiki": "Johann Sebastian Bach",
      "description": "German Baroque composer and organist whose cantatas, passions, keyboard works and Mass in B minor form the foundation of Western harmony and counterpoint.",
      "metadata": {
        "birth_date": "1685",
        "death_date": "1750",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Composing career",
          "start": 1703,
          "end": 1750,
          "description": "Served as organist and court musician in Arnstadt, Weimar and Köthen and as cantor of St. Thomas Church in Leipzig."
        }
      ],
      "why": "Every later tradition of Western music teaches harmony and counterpoint from his works."
    },
    {
      "slug": "montesquieu",
      "name": "Montesquieu",
      "type": "person",
      "wiki": "Montesquieu",
      "description": "French political philosopher whose The Spirit of the Laws set out the separation of executive, legislative and judicial powers.",
      "metadata": {
        "birth_date": "1689",
        "death_date": "1755",
        "nationality": "French"
      },
      "periods": [
        {
          "label": "Writings",
          "start": 1721,
          "end": 1755,
          "description": "Published the Persian Letters and The Spirit of the Laws."
        }
      ],
      "why": "The separation of powers he described is built into the United States Constitution and most constitutions since."
    },
    {
      "slug": "russian-empire",
      "name": "Russian Empire",
      "type": "organization",
      "wiki": "Russian Empire",
      "description": "Empire proclaimed by Peter the Great in 1721 that stretched from the Baltic to the Pacific and was the third-largest empire in history.",
      "metadata": {
        "founded_date": "1721",
        "dissolved_date": "1917",
        "headquarters": "Saint Petersburg",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Empire",
          "start": 1721,
          "end": 1917,
          "description": "Expanded across Siberia, Central Asia, the Caucasus and Poland, freed its serfs in 1861 and fell in the revolutions of 1917."
        }
      ],
      "why": "It built the territorial state that the Soviet Union and modern Russia inherited."
    },
    {
      "slug": "benjamin-franklin",
      "name": "Benjamin Franklin",
      "type": "person",
      "wiki": "Benjamin Franklin",
      "description": "American printer, scientist, inventor and diplomat whose electrical experiments and negotiation of the French alliance shaped both science and the American Revolution.",
      "metadata": {
        "birth_date": "1706",
        "death_date": "1790",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Printer and scientist",
          "start": 1729,
          "end": 1757,
          "description": "Published the Pennsylvania Gazette and Poor Richard's Almanack, founded civic institutions in Philadelphia and showed that lightning is electricity."
        },
        {
          "label": "Statesman and diplomat",
          "start": 1757,
          "end": 1790,
          "description": "Represented the colonies in London, signed the Declaration of Independence, secured the alliance with France and sat in the Constitutional Convention."
        }
      ],
      "why": "He was the American Revolution's leading diplomat and the best-known scientist of electricity in his century."
    },
    {
      "slug": "carl-linnaeus",
      "name": "Carl Linnaeus",
      "type": "person",
      "wiki": "Carl Linnaeus",
      "description": "Swedish botanist who formalized binomial nomenclature and the hierarchical classification of living things in Systema Naturae.",
      "metadata": {
        "birth_date": "1707",
        "death_date": "1778",
        "nationality": "Swedish"
      },
      "periods": [
        {
          "label": "Taxonomic work",
          "start": 1735,
          "end": 1778,
          "description": "Published Systema Naturae and Species Plantarum and sent students on collecting voyages around the world."
        }
      ],
      "why": "Every species named today follows his two-part naming system."
    },
    {
      "slug": "qianlong-emperor",
      "name": "Qianlong Emperor",
      "type": "person",
      "wiki": "Qianlong Emperor",
      "description": "Sixth emperor of the Qing dynasty, whose reign brought China to its largest territorial extent and whose 1793 rejection of the Macartney embassy set the terms of Qing relations with Britain.",
      "metadata": {
        "birth_date": "1711",
        "death_date": "1799",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1735,
          "end": 1796,
          "description": "Conquered the Dzungar Khanate and Xinjiang, sponsored the Siku Quanshu compilation and refused British trade demands."
        }
      ],
      "why": "He ruled the most populous state on earth at its territorial peak."
    },
    {
      "slug": "john-wesley",
      "name": "John Wesley",
      "type": "person",
      "wiki": "John Wesley",
      "description": "English Anglican cleric who led the evangelical revival that became Methodism, preaching in the open air and organizing converts into societies and circuits.",
      "metadata": {
        "birth_date": "1703",
        "death_date": "1791",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Methodist preaching",
          "start": 1738,
          "end": 1791,
          "description": "Preached in the open air across Britain and Ireland and organized the Methodist societies and their lay preachers."
        }
      ],
      "why": "Methodism became one of the largest Protestant traditions and seeded the global evangelical and Pentecostal movements."
    },
    {
      "slug": "methodism",
      "name": "Methodism",
      "type": "organization",
      "wiki": "Methodism",
      "description": "Protestant tradition that grew from John Wesley's evangelical revival within the Church of England into independent churches across the world.",
      "metadata": {
        "founded_date": "1739",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Movement and churches",
          "start": 1739,
          "end": 2026,
          "description": "Spread through lay preachers and circuit riders in Britain and on the American frontier and through missions in Africa and Asia."
        }
      ],
      "why": "With tens of millions of members, it is one of the largest Protestant traditions and the source of the Holiness and Pentecostal movements."
    },
    {
      "slug": "muhammad-ibn-abd-al-wahhab",
      "name": "Muhammad ibn Abd al-Wahhab",
      "type": "person",
      "wiki": "Muhammad ibn Abd al-Wahhab",
      "description": "Arabian Hanbali scholar whose strict monotheist reform movement allied with Muhammad bin Saud in 1744, founding both Wahhabism and the first Saudi state.",
      "metadata": {
        "birth_date": "1703",
        "death_date": "1792",
        "nationality": "Arabian"
      },
      "periods": [
        {
          "label": "Preaching and Saudi alliance",
          "start": 1740,
          "end": 1792,
          "description": "Preached against saint veneration in Najd, made his pact with the House of Saud at Diriyah and guided its religious policy."
        }
      ],
      "why": "His alliance with the Saud family still defines the religious character of Saudi Arabia and of Salafi movements worldwide."
    },
    {
      "slug": "wahhabism",
      "name": "Wahhabism",
      "type": "organization",
      "wiki": "Wahhabism",
      "description": "Sunni Islamic reform movement founded by Muhammad ibn Abd al-Wahhab that demands strict monotheism and has been the official doctrine of the successive Saudi states since 1744.",
      "metadata": {
        "founded_date": "1744",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Movement and Saudi state doctrine",
          "start": 1744,
          "end": 2026,
          "description": "Spread with the three Saudi states across Arabia and, after 1970, through Saudi-funded mosques, schools and media worldwide."
        }
      ],
      "why": "Backed by Saudi oil wealth, it reshaped Sunni Islam worldwide and fed both conservative piety and jihadist movements."
    },
    {
      "slug": "jean-jacques-rousseau",
      "name": "Jean-Jacques Rousseau",
      "type": "person",
      "wiki": "Jean-Jacques Rousseau",
      "description": "Genevan philosopher whose The Social Contract argued that legitimate authority rests on the general will of the people, shaping the French Revolution, modern democracy and Romanticism.",
      "metadata": {
        "birth_date": "1712",
        "death_date": "1778",
        "nationality": "Genevan"
      },
      "periods": [
        {
          "label": "Major works",
          "start": 1750,
          "end": 1778,
          "description": "Wrote the Discourse on Inequality, The Social Contract, Emile and the Confessions."
        }
      ],
      "why": "His theory of popular sovereignty became the vocabulary of the French Revolution and of modern democratic politics."
    },
    {
      "slug": "cao-xueqin",
      "name": "Cao Xueqin",
      "type": "person",
      "wiki": "Cao Xueqin",
      "description": "Chinese novelist who wrote Dream of the Red Chamber, one of the Four Great Classical Novels of China and the subject of its own field of scholarship, Redology.",
      "metadata": {
        "birth_date": "c. 1715",
        "death_date": "c. 1763",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Writing Dream of the Red Chamber",
          "start": 1754,
          "end": 1763,
          "description": "Circulated manuscript chapters of the novel among friends in Beijing until his death left it unfinished."
        }
      ],
      "why": "His novel is the central work of Chinese fiction, read across the Chinese-speaking world and studied as its own discipline."
    },
    {
      "slug": "immanuel-kant",
      "name": "Immanuel Kant",
      "type": "person",
      "wiki": "Immanuel Kant",
      "description": "Prussian philosopher whose Critique of Pure Reason and moral philosophy of the categorical imperative reshaped epistemology, ethics and political theory.",
      "metadata": {
        "birth_date": "1724",
        "death_date": "1804",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Teaching and critical philosophy",
          "start": 1755,
          "end": 1798,
          "description": "Lectured at Königsberg and published the three Critiques and Perpetual Peace."
        }
      ],
      "why": "Modern philosophy divides into before and after Kant, and his ideas of human dignity and perpetual peace underlie human-rights law and international organization."
    },
    {
      "slug": "seven-years-war",
      "name": "Seven Years' War",
      "type": "event",
      "wiki": "Seven Years' War",
      "description": "Global war fought in Europe, North America, India, the Caribbean and West Africa that left Britain the dominant colonial and naval power.",
      "metadata": {
        "start_date": "1756",
        "end_date": "1763",
        "location": "Worldwide",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "War",
          "start": 1756,
          "end": 1763,
          "description": "Pitted Britain and Prussia against France, Austria and Russia and ended with France's loss of Canada and of its position in India."
        }
      ],
      "why": "It made Britain the leading world power and created the debts and grievances that led to the American and French revolutions."
    },
    {
      "slug": "wolfgang-amadeus-mozart",
      "name": "Wolfgang Amadeus Mozart",
      "type": "person",
      "wiki": "Wolfgang Amadeus Mozart",
      "description": "Austrian composer of more than 600 works, including the operas The Marriage of Figaro, Don Giovanni and The Magic Flute, central to the Classical style.",
      "metadata": {
        "birth_date": "1756",
        "death_date": "1791",
        "nationality": "Austrian"
      },
      "periods": [
        {
          "label": "Composing career",
          "start": 1761,
          "end": 1791,
          "description": "Toured Europe as a child prodigy, worked in Salzburg and Vienna, and wrote symphonies, concertos, operas and the unfinished Requiem."
        }
      ],
      "why": "His operas, symphonies and concertos remain at the core of the concert and opera repertoire worldwide."
    },
    {
      "slug": "catherine-the-great",
      "name": "Catherine the Great",
      "type": "person",
      "wiki": "Catherine the Great",
      "description": "Empress of Russia who expanded the empire into Crimea, Ukraine and Poland and promoted Enlightenment culture while tightening serfdom.",
      "metadata": {
        "birth_date": "1729",
        "death_date": "1796",
        "nationality": "Russian"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1762,
          "end": 1796,
          "description": "Annexed Crimea, took part in the partitions of Poland and corresponded with Voltaire and Diderot."
        }
      ],
      "why": "She is the longest-ruling woman in Russian history and fixed Russia's borders on the Black Sea and in the west."
    },
    {
      "slug": "james-cook",
      "name": "James Cook",
      "type": "person",
      "wiki": "James Cook",
      "description": "British naval captain whose three Pacific voyages charted New Zealand, eastern Australia and Hawaii and opened them to European colonization.",
      "metadata": {
        "birth_date": "1728",
        "death_date": "1779",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Pacific voyages",
          "start": 1768,
          "end": 1779,
          "description": "Commanded three expeditions that mapped the Pacific, claimed eastern Australia for Britain and ended with his death in Hawaii."
        }
      ],
      "why": "His charts led directly to British settlement of Australia and New Zealand and to the colonization of the Pacific."
    },
    {
      "slug": "antoine-lavoisier",
      "name": "Antoine Lavoisier",
      "type": "person",
      "wiki": "Antoine Lavoisier",
      "description": "French chemist who identified oxygen's role in combustion, established the conservation of mass and created the modern system of chemical nomenclature.",
      "metadata": {
        "birth_date": "1743",
        "death_date": "1794",
        "nationality": "French"
      },
      "periods": [
        {
          "label": "Chemical research",
          "start": 1772,
          "end": 1794,
          "description": "Disproved phlogiston theory, named oxygen and hydrogen and published the Elementary Treatise of Chemistry before his execution in the Terror."
        }
      ],
      "why": "He turned chemistry into a quantitative science and gave it the language it still uses."
    },
    {
      "slug": "johann-wolfgang-von-goethe",
      "name": "Johann Wolfgang von Goethe",
      "type": "person",
      "wiki": "Johann Wolfgang von Goethe",
      "description": "German poet, novelist, dramatist and scientist whose Faust and The Sorrows of Young Werther made him the central figure of German literature.",
      "metadata": {
        "birth_date": "1749",
        "death_date": "1832",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Literary career",
          "start": 1773,
          "end": 1832,
          "description": "Wrote Werther, Wilhelm Meister and both parts of Faust, published studies of colour and plant morphology and served as a minister at Weimar."
        }
      ],
      "why": "He defined modern German literature and gave Europe the idea of world literature."
    },
    {
      "slug": "usman-dan-fodio",
      "name": "Usman dan Fodio",
      "type": "person",
      "wiki": "Usman dan Fodio",
      "description": "Fulani Islamic scholar who led a jihad across what is now northern Nigeria and founded the Sokoto Caliphate, one of the largest states in nineteenth-century Africa.",
      "metadata": {
        "birth_date": "1754",
        "death_date": "1817",
        "nationality": "Fulani"
      },
      "periods": [
        {
          "label": "Preaching",
          "start": 1774,
          "end": 1803,
          "description": "Preached reform of Islamic practice across the Hausa kingdoms and built a following of students."
        },
        {
          "label": "Jihad and caliphate",
          "start": 1804,
          "end": 1817,
          "description": "Led the Fulani War against the Hausa rulers and established the Sokoto Caliphate."
        }
      ],
      "why": "The caliphate he founded shaped Islam, politics and Hausa-Fulani identity in Africa's most populous country."
    },
    {
      "slug": "george-washington",
      "name": "George Washington",
      "type": "person",
      "wiki": "George Washington",
      "description": "Commander of the Continental Army in the American Revolutionary War and first president of the United States, whose two-term precedent shaped the American presidency.",
      "metadata": {
        "birth_date": "1732",
        "death_date": "1799",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Continental Army commander",
          "start": 1775,
          "end": 1783,
          "description": "Led the Continental Army from the siege of Boston to the British surrender at Yorktown and the end of the war."
        },
        {
          "label": "First president",
          "start": 1789,
          "end": 1797,
          "description": "Served two terms as the first president under the new Constitution and set the precedents of the office."
        }
      ],
      "why": "He won the war that created the United States and defined how its presidency would work."
    },
    {
      "slug": "thomas-jefferson",
      "name": "Thomas Jefferson",
      "type": "person",
      "wiki": "Thomas Jefferson",
      "description": "Principal author of the United States Declaration of Independence and third US president, who doubled the country's territory with the Louisiana Purchase.",
      "metadata": {
        "birth_date": "1743",
        "death_date": "1826",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Revolutionary statesman",
          "start": 1775,
          "end": 1793,
          "description": "Drafted the Declaration of Independence, served as minister to France and became the first secretary of state."
        },
        {
          "label": "President",
          "start": 1801,
          "end": 1809,
          "description": "Served as third president and concluded the Louisiana Purchase in 1803."
        }
      ],
      "why": "His statement of equality and natural rights became the founding creed of the United States and a model for later declarations."
    },
    {
      "slug": "thomas-paine",
      "name": "Thomas Paine",
      "type": "person",
      "wiki": "Thomas Paine",
      "description": "English-born pamphleteer whose Common Sense persuaded American colonists to seek independence and whose Rights of Man defended the French Revolution.",
      "metadata": {
        "birth_date": "1737",
        "death_date": "1809",
        "nationality": "English-American"
      },
      "periods": [
        {
          "label": "Revolutionary pamphleteer",
          "start": 1776,
          "end": 1795,
          "description": "Wrote Common Sense, The American Crisis, Rights of Man and The Age of Reason."
        }
      ],
      "why": "Common Sense was the best-selling pamphlet of the American Revolution and turned colonial protest into a demand for independence."
    },
    {
      "slug": "united-states",
      "name": "United States",
      "type": "organization",
      "wiki": "United States",
      "description": "Federal republic founded by the Declaration of Independence in 1776, which grew from thirteen Atlantic colonies into the world's largest economy and military power.",
      "metadata": {
        "founded_date": "1776",
        "headquarters": "Washington, D.C.",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Republic",
          "start": 1776,
          "end": 2026,
          "description": "Expanded across North America, abolished slavery after a civil war and became the leading global power after 1945."
        }
      ],
      "why": "It is the most powerful state of the modern era, and its constitution, economy and culture reach every country."
    },
    {
      "slug": "hokusai",
      "name": "Katsushika Hokusai",
      "type": "person",
      "wiki": "Hokusai",
      "description": "Japanese ukiyo-e artist whose woodblock series Thirty-six Views of Mount Fuji, including The Great Wave off Kanagawa, became the best-known images of Japanese art.",
      "metadata": {
        "birth_date": "1760",
        "death_date": "1849",
        "nationality": "Japanese"
      },
      "periods": [
        {
          "label": "Artistic career",
          "start": 1779,
          "end": 1849,
          "description": "Produced paintings, the Hokusai Manga sketchbooks and the Mount Fuji print series."
        }
      ],
      "why": "His prints shaped Impressionism and Japonisme in the West and remain the worldwide image of Japanese visual culture."
    },
    {
      "slug": "abolitionism",
      "name": "Abolitionism",
      "type": "event",
      "wiki": "Abolitionism",
      "description": "International movement to end the slave trade and slavery, which achieved abolition across the Atlantic world between 1787 and 1888.",
      "metadata": {
        "start_date": "1787",
        "end_date": "1888",
        "location": "Atlantic world",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Abolition campaigns",
          "start": 1787,
          "end": 1888,
          "description": "Won the British and American slave-trade bans of 1807 and 1808, British emancipation in 1833, US abolition in 1865 and Brazilian abolition in 1888."
        }
      ],
      "why": "It ended a labour system that had held millions in bondage and established the principle that no person may own another."
    },
    {
      "slug": "constitution-of-the-united-states",
      "name": "Constitution of the United States",
      "type": "event",
      "wiki": "Constitution of the United States",
      "description": "Written constitution drafted in Philadelphia in 1787 that created the federal government of the United States with separated powers and is the oldest written national constitution in force.",
      "metadata": {
        "start_date": "1787",
        "end_date": "1789",
        "location": "Philadelphia",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Drafting and ratification",
          "start": 1787,
          "end": 1789,
          "description": "Drafted at the Constitutional Convention, ratified by the states and put into effect in 1789."
        }
      ],
      "why": "It is the model for written constitutions and federal systems around the world."
    },
    {
      "slug": "mary-wollstonecraft",
      "name": "Mary Wollstonecraft",
      "type": "person",
      "wiki": "Mary Wollstonecraft",
      "description": "English writer whose A Vindication of the Rights of Woman argued that women are rational beings entitled to equal education, founding modern feminist philosophy.",
      "metadata": {
        "birth_date": "1759",
        "death_date": "1797",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Writing career",
          "start": 1787,
          "end": 1797,
          "description": "Published A Vindication of the Rights of Men, A Vindication of the Rights of Woman and a history of the French Revolution."
        }
      ],
      "why": "Her case for women's equality is the founding text of the feminist movement."
    },
    {
      "slug": "william-wilberforce",
      "name": "William Wilberforce",
      "type": "person",
      "wiki": "William Wilberforce",
      "description": "British member of Parliament who led the parliamentary campaign that abolished the British slave trade in 1807.",
      "metadata": {
        "birth_date": "1759",
        "death_date": "1833",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Parliamentary abolition campaign",
          "start": 1787,
          "end": 1833,
          "description": "Introduced abolition bills for two decades until the Slave Trade Act of 1807 and lived to see the Slavery Abolition Act of 1833 pass."
        }
      ],
      "why": "Britain's abolition of the slave trade, which he led in Parliament, began the end of the Atlantic slave system."
    },
    {
      "slug": "declaration-of-the-rights-of-man-and-of-the-citizen",
      "name": "Declaration of the Rights of Man and of the Citizen",
      "type": "event",
      "wiki": "Declaration of the Rights of Man and of the Citizen",
      "description": "Charter of individual and collective rights adopted by France's National Constituent Assembly in August 1789.",
      "metadata": {
        "start_date": "1789",
        "end_date": "1789",
        "location": "Versailles",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Adoption",
          "start": 1789,
          "end": 1789,
          "description": "Drafted by Lafayette with advice from Jefferson and adopted on 26 August 1789."
        }
      ],
      "why": "It declared rights universal to all people and is a direct ancestor of modern human-rights law."
    },
    {
      "slug": "haitian-revolution",
      "name": "Haitian Revolution",
      "type": "event",
      "wiki": "Haitian Revolution",
      "description": "Uprising of enslaved Africans in the French colony of Saint-Domingue that abolished slavery, defeated French, Spanish and British forces and founded Haiti in 1804.",
      "metadata": {
        "start_date": "1791",
        "end_date": "1804",
        "location": "Saint-Domingue",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Revolution",
          "start": 1791,
          "end": 1804,
          "description": "Began with the 1791 slave uprising, won the abolition of slavery in 1793 and 1794 and ended with independence in 1804."
        }
      ],
      "why": "It created the first Black republic and showed the Atlantic world that slavery could be overthrown by the enslaved."
    },
    {
      "slug": "toussaint-louverture",
      "name": "Toussaint Louverture",
      "type": "person",
      "wiki": "Toussaint Louverture",
      "description": "Formerly enslaved general who led the Haitian Revolution, governed Saint-Domingue and abolished slavery there before his capture by Napoleon's forces.",
      "metadata": {
        "birth_date": "c. 1743",
        "death_date": "1803",
        "nationality": "Haitian"
      },
      "periods": [
        {
          "label": "Revolutionary leader",
          "start": 1791,
          "end": 1802,
          "description": "Commanded the insurgent armies of Saint-Domingue, defeated Spanish and British forces and issued the colony's 1801 constitution."
        }
      ],
      "why": "He led the slave revolt that produced the first Black republic."
    },
    {
      "slug": "eli-whitney",
      "name": "Eli Whitney",
      "type": "person",
      "wiki": "Eli Whitney",
      "description": "American inventor of the cotton gin, which made short-staple cotton profitable and expanded slavery across the American South.",
      "metadata": {
        "birth_date": "1765",
        "death_date": "1825",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Cotton gin and arms manufacture",
          "start": 1793,
          "end": 1825,
          "description": "Patented the cotton gin in 1794 and ran an armory in Connecticut that promoted interchangeable parts."
        }
      ],
      "why": "His machine made cotton the leading US export and entrenched the slave economy that led to the Civil War."
    },
    {
      "slug": "muhammad-ali-of-egypt",
      "name": "Muhammad Ali of Egypt",
      "type": "person",
      "wiki": "Muhammad Ali of Egypt",
      "description": "Ottoman governor of Egypt who seized power in 1805, built a conscript army and state industries, and founded the dynasty that ruled Egypt until 1952.",
      "metadata": {
        "birth_date": "1769",
        "death_date": "1849",
        "nationality": "Egyptian"
      },
      "periods": [
        {
          "label": "Wali of Egypt",
          "start": 1805,
          "end": 1848,
          "description": "Massacred the Mamluks, introduced cotton cultivation and conscription, and conquered Sudan and Syria."
        }
      ],
      "why": "He began the modernization of the Arab world's most populous state and founded its last royal dynasty."
    },
    {
      "slug": "spanish-american-wars-of-independence",
      "name": "Spanish American wars of independence",
      "type": "event",
      "wiki": "Spanish American wars of independence",
      "description": "Wars across Spain's American empire that produced independent republics from Mexico to Argentina between 1808 and 1833.",
      "metadata": {
        "start_date": "1808",
        "end_date": "1833",
        "location": "Spanish America",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Wars",
          "start": 1808,
          "end": 1833,
          "description": "Began after Napoleon's invasion of Spain and ended Spanish rule on the American mainland, with the decisive battle at Ayacucho in 1824."
        }
      ],
      "why": "They created most of the nation-states of Latin America."
    },
    {
      "slug": "mexican-war-of-independence",
      "name": "Mexican War of Independence",
      "type": "event",
      "wiki": "Mexican War of Independence",
      "description": "Armed conflict from 1810 to 1821 that ended three centuries of Spanish rule in New Spain and created independent Mexico.",
      "metadata": {
        "start_date": "1810",
        "end_date": "1821",
        "location": "New Spain",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "War",
          "start": 1810,
          "end": 1821,
          "description": "Began with Hidalgo's Cry of Dolores, continued under Morelos and guerrilla leaders and ended with the Plan of Iguala and the Treaty of Córdoba."
        }
      ],
      "why": "It created Mexico, now the most populous Spanish-speaking country."
    },
    {
      "slug": "miguel-hidalgo-y-costilla",
      "name": "Miguel Hidalgo y Costilla",
      "type": "person",
      "wiki": "Miguel Hidalgo y Costilla",
      "description": "Mexican Catholic priest whose Cry of Dolores in 1810 launched the Mexican War of Independence.",
      "metadata": {
        "birth_date": "1753",
        "death_date": "1811",
        "nationality": "Mexican"
      },
      "periods": [
        {
          "label": "Insurgency",
          "start": 1810,
          "end": 1811,
          "description": "Called the people of Dolores to revolt and led a peasant army until his capture and execution."
        }
      ],
      "why": "Mexico counts him as the father of the nation, and his call to revolt is reenacted every Independence Day."
    },
    {
      "slug": "simon-bolivar",
      "name": "Simón Bolívar",
      "type": "person",
      "wiki": "Simón Bolívar",
      "description": "Venezuelan military and political leader who led the independence of Venezuela, Colombia, Ecuador, Peru and Bolivia from Spain.",
      "metadata": {
        "birth_date": "1783",
        "death_date": "1830",
        "nationality": "Venezuelan"
      },
      "periods": [
        {
          "label": "Liberation campaigns",
          "start": 1810,
          "end": 1830,
          "description": "Led the wars of independence across northern South America and served as president of Gran Colombia."
        }
      ],
      "why": "He ended Spanish rule over five modern nations and remains the central political symbol of Latin America."
    },
    {
      "slug": "jane-austen",
      "name": "Jane Austen",
      "type": "person",
      "wiki": "Jane Austen",
      "description": "English novelist whose six novels, including Pride and Prejudice, established the realist novel of social observation and courtship.",
      "metadata": {
        "birth_date": "1775",
        "death_date": "1817",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Published novels",
          "start": 1811,
          "end": 1817,
          "description": "Published Sense and Sensibility, Pride and Prejudice, Mansfield Park and Emma, with Northanger Abbey and Persuasion following after her death."
        }
      ],
      "why": "Her novels remain among the most read, adapted and imitated works in English two centuries on."
    },
    {
      "slug": "brothers-grimm",
      "name": "Brothers Grimm",
      "type": "person",
      "wiki": "Brothers Grimm",
      "description": "German scholars Jacob and Wilhelm Grimm, who collected and published Children's and Household Tales, the source of the standard versions of Cinderella, Snow White and Hansel and Gretel.",
      "metadata": {
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Collecting and publishing",
          "start": 1812,
          "end": 1863,
          "description": "Published seven editions of their tale collection, formulated Grimm's law of sound change and began the German Dictionary."
        }
      ],
      "why": "Their tales, through Disney and countless retellings, form the shared fairy-tale canon of children worldwide."
    },
    {
      "slug": "congress-of-vienna",
      "name": "Congress of Vienna",
      "type": "event",
      "wiki": "Congress of Vienna",
      "description": "Conference of European states in 1814 and 1815 that redrew the map of Europe after the defeat of Napoleon and created the Concert of Europe.",
      "metadata": {
        "start_date": "1814",
        "end_date": "1815",
        "location": "Vienna",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Congress",
          "start": 1814,
          "end": 1815,
          "description": "Negotiated by Metternich, Castlereagh, Talleyrand, Alexander I and Hardenberg, it restored monarchies and balanced the great powers."
        }
      ],
      "why": "Its settlement kept the European great powers out of a general war for a century and was the first modern system of international diplomacy."
    },
    {
      "slug": "george-stephenson",
      "name": "George Stephenson",
      "type": "person",
      "wiki": "George Stephenson",
      "description": "English engineer who built the Stockton and Darlington and the Liverpool and Manchester railways, the first public railways to use steam locomotives.",
      "metadata": {
        "birth_date": "1781",
        "death_date": "1848",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Railway engineer",
          "start": 1814,
          "end": 1840,
          "description": "Built his first locomotive in 1814, set the standard gauge and engineered the main early railways with his son Robert."
        }
      ],
      "why": "His railways and his gauge started the railway age that reorganized trade and travel worldwide."
    },
    {
      "slug": "raja-ram-mohan-roy",
      "name": "Ram Mohan Roy",
      "type": "person",
      "wiki": "Raja Ram Mohan Roy",
      "description": "Bengali reformer who campaigned for the abolition of sati, founded the Brahmo Sabha and promoted Western-style education in India.",
      "metadata": {
        "birth_date": "1772",
        "death_date": "1833",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Reformer in Calcutta",
          "start": 1814,
          "end": 1833,
          "description": "Founded the Atmiya Sabha and the Brahmo Sabha, campaigned for the 1829 ban on sati and argued for English and scientific education."
        }
      ],
      "why": "He began the Bengal Renaissance and the modern Indian reform tradition."
    },
    {
      "slug": "mary-shelley",
      "name": "Mary Shelley",
      "type": "person",
      "wiki": "Mary Shelley",
      "description": "English novelist who wrote Frankenstein, the founding work of science fiction.",
      "metadata": {
        "birth_date": "1797",
        "death_date": "1851",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Writing career",
          "start": 1816,
          "end": 1844,
          "description": "Conceived Frankenstein at Lake Geneva in 1816, published it in 1818 and wrote further novels, including The Last Man."
        }
      ],
      "why": "Frankenstein created science fiction as a genre and the enduring story of the creator destroyed by his creation."
    },
    {
      "slug": "shaka",
      "name": "Shaka",
      "type": "person",
      "wiki": "Shaka",
      "description": "King of the Zulu who reorganized warfare in southern Africa and built the Zulu Kingdom into the region's dominant power.",
      "metadata": {
        "birth_date": "c. 1787",
        "death_date": "1828",
        "nationality": "Zulu"
      },
      "periods": [
        {
          "label": "King of the Zulu",
          "start": 1816,
          "end": 1828,
          "description": "Introduced age-regiment armies and close-combat tactics, conquered neighbouring chiefdoms and set off the upheavals of the Mfecane."
        }
      ],
      "why": "His wars redrew the political map of southern Africa and created a lasting Zulu national identity."
    },
    {
      "slug": "frankensteins-monster",
      "name": "Frankenstein's monster",
      "type": "person",
      "wiki": "Frankenstein's monster",
      "description": "The creature assembled and brought to life by Victor Frankenstein in Mary Shelley's 1818 novel, the archetype of the scientific creation that turns on its maker.",
      "periods": [
        {
          "label": "In print, stage and film",
          "start": 1818,
          "end": 2026,
          "description": "Appeared in the novel, in stage adaptations from 1823 and in films from Edison's 1910 short onward."
        }
      ],
      "why": "The monster is the standard image of technology escaping human control, invoked in debates from cloning to artificial intelligence."
    },
    {
      "slug": "michael-faraday",
      "name": "Michael Faraday",
      "type": "person",
      "wiki": "Michael Faraday",
      "description": "English scientist who discovered electromagnetic induction and built the first electric motor and dynamo, laying the basis of electrical technology.",
      "metadata": {
        "birth_date": "1791",
        "death_date": "1867",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Research at the Royal Institution",
          "start": 1821,
          "end": 1861,
          "description": "Demonstrated electromagnetic rotation, discovered induction in 1831, formulated the laws of electrolysis and introduced the concept of the field."
        }
      ],
      "why": "The generators and motors that power the electrical world run on the principles he discovered."
    },
    {
      "slug": "charles-babbage",
      "name": "Charles Babbage",
      "type": "person",
      "wiki": "Charles Babbage",
      "description": "English mathematician who designed the Difference Engine and the Analytical Engine, the first general-purpose computer design.",
      "metadata": {
        "birth_date": "1791",
        "death_date": "1871",
        "nationality": "English"
      },
      "periods": [
        {
          "label": "The calculating engines",
          "start": 1822,
          "end": 1871,
          "description": "Babbage designed mechanical computers, including the programmable Analytical Engine described by Ada Lovelace."
        }
      ],
      "why": "Originated the concept of a programmable computer a century before electronics made it possible."
    },
    {
      "slug": "joseph-smith",
      "name": "Joseph Smith",
      "type": "person",
      "wiki": "Joseph Smith",
      "description": "American religious leader who published the Book of Mormon in 1830 and founded the Latter Day Saint movement.",
      "metadata": {
        "birth_date": "1805",
        "death_date": "1844",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Prophet of the Latter Day Saint movement",
          "start": 1827,
          "end": 1844,
          "description": "Produced the Book of Mormon, organized the church in 1830 and led his followers from New York to Ohio, Missouri and Nauvoo, Illinois, until his killing."
        }
      ],
      "why": "He founded a church that grew to more than 17 million members and shaped the settlement of the American West."
    },
    {
      "slug": "indian-removal",
      "name": "Indian removal",
      "type": "event",
      "wiki": "Indian removal",
      "description": "United States policy, enacted by the Indian Removal Act of 1830, that forced the Cherokee, Muscogee, Seminole, Chickasaw and Choctaw nations from their lands in the Southeast to territory west of the Mississippi.",
      "metadata": {
        "start_date": "1830",
        "end_date": "1850",
        "location": "Southeastern United States"
      },
      "periods": [
        {
          "label": "Forced removals",
          "start": 1830,
          "end": 1850,
          "description": "Carried out by treaty and military force, including the Trail of Tears, during which thousands died."
        }
      ],
      "why": "It became the model for the dispossession of Native American nations across the continent."
    },
    {
      "slug": "church-of-jesus-christ-of-latter-day-saints",
      "name": "The Church of Jesus Christ of Latter-day Saints",
      "type": "organization",
      "wiki": "The Church of Jesus Christ of Latter-day Saints",
      "description": "Restorationist Christian church founded by Joseph Smith in 1830 and led to Utah by Brigham Young, with headquarters in Salt Lake City.",
      "metadata": {
        "founded_date": "1830",
        "headquarters": "Salt Lake City",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Church",
          "start": 1830,
          "end": 2026,
          "description": "Migrated west to Utah in 1847, abandoned polygamy in 1890 and grew through a worldwide missionary program."
        }
      ],
      "why": "It grew from a frontier sect into a global church of more than 17 million members that settled much of the American West."
    },
    {
      "slug": "charles-dickens",
      "name": "Charles Dickens",
      "type": "person",
      "wiki": "Charles Dickens",
      "description": "English novelist whose serialized novels, including Oliver Twist, A Christmas Carol and Great Expectations, exposed poverty in industrial Britain and shaped the modern celebration of Christmas.",
      "metadata": {
        "birth_date": "1812",
        "death_date": "1870",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Writing career",
          "start": 1836,
          "end": 1870,
          "description": "Published fifteen novels in monthly parts, edited magazines and gave public readings in Britain and the United States."
        }
      ],
      "why": "He was the most widely read novelist of the Victorian world and his characters became household words."
    },
    {
      "slug": "queen-victoria",
      "name": "Queen Victoria",
      "type": "person",
      "wiki": "Queen Victoria",
      "description": "Queen of the United Kingdom for 63 years and Empress of India, whose reign spanned the height of British industrial and imperial power.",
      "metadata": {
        "birth_date": "1819",
        "death_date": "1901",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Reign",
          "start": 1837,
          "end": 1901,
          "description": "Reigned through the expansion of the British Empire, became Empress of India in 1876 and married her children into Europe's royal houses."
        }
      ],
      "why": "She gave her name to an era and stood at the head of the largest empire of the nineteenth century."
    },
    {
      "slug": "opium-wars",
      "name": "Opium Wars",
      "type": "event",
      "wiki": "Opium Wars",
      "description": "Two wars in which Britain, joined by France in the second, forced Qing China to open its ports to foreign trade, including opium, and to cede Hong Kong.",
      "metadata": {
        "start_date": "1839",
        "end_date": "1860",
        "location": "China",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "First Opium War",
          "start": 1839,
          "end": 1842,
          "description": "Ended with the Treaty of Nanking, which ceded Hong Kong Island and opened five treaty ports."
        },
        {
          "label": "Second Opium War",
          "start": 1856,
          "end": 1860,
          "description": "Ended with the burning of the Old Summer Palace and treaties that legalized the opium trade."
        }
      ],
      "why": "They opened what China calls its century of humiliation and still shape Chinese nationalism."
    },
    {
      "slug": "frederick-douglass",
      "name": "Frederick Douglass",
      "type": "person",
      "wiki": "Frederick Douglass",
      "description": "American abolitionist, orator and writer who escaped slavery and campaigned for emancipation and Black civil rights for five decades.",
      "metadata": {
        "birth_date": "c. 1818",
        "death_date": "1895",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Abolitionist and statesman",
          "start": 1841,
          "end": 1895,
          "description": "Lectured against slavery, published his Narrative and The North Star, recruited Black soldiers for the Union and served as US minister to Haiti."
        }
      ],
      "why": "His autobiography and speeches made the case against slavery from inside it and set the pattern for Black American protest."
    },
    {
      "slug": "ada-lovelace",
      "name": "Ada Lovelace",
      "type": "person",
      "wiki": "Ada Lovelace",
      "description": "English mathematician whose 1843 notes on Charles Babbage's Analytical Engine contain the first published algorithm intended for a machine and the idea that computers could process more than numbers.",
      "metadata": {
        "birth_date": "1815",
        "death_date": "1852",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Analytical Engine notes",
          "start": 1842,
          "end": 1843,
          "description": "Translated Menabrea's paper on the Analytical Engine and added notes that included a program for computing Bernoulli numbers."
        }
      ],
      "why": "She is the founding figure of computer programming and a lasting symbol for women in science and technology."
    },
    {
      "slug": "great-famine-ireland",
      "name": "Great Famine (Ireland)",
      "type": "event",
      "wiki": "Great Famine (Ireland)",
      "description": "Famine in Ireland caused by potato blight and British policy that killed one million people and drove more than one million to emigrate.",
      "metadata": {
        "start_date": "1845",
        "end_date": "1852",
        "location": "Ireland",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Famine",
          "start": 1845,
          "end": 1852,
          "description": "Followed successive failures of the potato crop while food exports continued and relief was limited."
        }
      ],
      "why": "It permanently reduced Ireland's population and created the Irish diaspora in North America, Britain and Australia."
    },
    {
      "slug": "revolutions-of-1848",
      "name": "Revolutions of 1848",
      "type": "event",
      "wiki": "Revolutions of 1848",
      "description": "Wave of liberal and nationalist revolutions across Europe that overthrew the French monarchy, ended serfdom in Austria and forced short-lived constitutions on German and Italian states.",
      "metadata": {
        "start_date": "1848",
        "end_date": "1849",
        "location": "Europe",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Revolutions",
          "start": 1848,
          "end": 1849,
          "description": "Spread from Palermo and Paris to Vienna, Berlin, Budapest and Frankfurt before conservative forces restored order."
        }
      ],
      "why": "It was the most widespread revolutionary wave in European history and set the agenda of nationalism, liberalism and socialism for the century."
    },
    {
      "slug": "seneca-falls-convention",
      "name": "Seneca Falls Convention",
      "type": "event",
      "wiki": "Seneca Falls Convention",
      "description": "First women's rights convention in the United States, held in 1848, whose Declaration of Sentiments demanded equality for women, including the right to vote.",
      "metadata": {
        "start_date": "1848",
        "end_date": "1848",
        "location": "Seneca Falls, New York",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Convention",
          "start": 1848,
          "end": 1848,
          "description": "Organized by Elizabeth Cady Stanton and Lucretia Mott, it adopted the Declaration of Sentiments on 19 and 20 July 1848."
        }
      ],
      "why": "It launched the organized women's suffrage movement that won women the vote across the world."
    },
    {
      "slug": "harriet-tubman",
      "name": "Harriet Tubman",
      "type": "person",
      "wiki": "Harriet Tubman",
      "description": "American abolitionist who escaped slavery and returned to Maryland repeatedly to lead enslaved people to freedom on the Underground Railroad, later serving as a Union scout and spy.",
      "metadata": {
        "birth_date": "c. 1822",
        "death_date": "1913",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Underground Railroad and Union service",
          "start": 1849,
          "end": 1865,
          "description": "Made thirteen rescue missions from Maryland and guided the Combahee River Raid, which freed more than 700 people."
        }
      ],
      "why": "She became the best-known symbol of resistance to American slavery."
    },
    {
      "slug": "hong-xiuquan",
      "name": "Hong Xiuquan",
      "type": "person",
      "wiki": "Hong Xiuquan",
      "description": "Hakka scholar who declared himself the younger brother of Jesus and led the Taiping Heavenly Kingdom against the Qing dynasty in a civil war that killed tens of millions.",
      "metadata": {
        "birth_date": "1814",
        "death_date": "1864",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Heavenly King",
          "start": 1850,
          "end": 1864,
          "description": "Led the Taiping uprising from Guangxi, took Nanjing as his capital in 1853 and ruled there until its fall."
        }
      ],
      "why": "The war he started was the deadliest of the nineteenth century and fatally weakened imperial China."
    },
    {
      "slug": "taiping-rebellion",
      "name": "Taiping Rebellion",
      "type": "event",
      "wiki": "Taiping Rebellion",
      "description": "Civil war in China between the Qing dynasty and the Taiping Heavenly Kingdom of Hong Xiuquan, which killed tens of millions of people.",
      "metadata": {
        "start_date": "1850",
        "end_date": "1864",
        "location": "China",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Civil war",
          "start": 1850,
          "end": 1864,
          "description": "Began in Guangxi, established a Taiping capital at Nanjing and ended with the city's fall to Qing and provincial armies."
        }
      ],
      "why": "It was the deadliest conflict of the nineteenth century and shifted power in China from the throne to regional armies."
    },
    {
      "slug": "harriet-beecher-stowe",
      "name": "Harriet Beecher Stowe",
      "type": "person",
      "wiki": "Harriet Beecher Stowe",
      "description": "American author whose novel Uncle Tom's Cabin turned Northern public opinion against slavery and was the best-selling novel of the nineteenth century.",
      "metadata": {
        "birth_date": "1811",
        "death_date": "1896",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Uncle Tom's Cabin",
          "start": 1851,
          "end": 1853,
          "description": "Serialized and published Uncle Tom's Cabin and its documentary defence, A Key to Uncle Tom's Cabin."
        }
      ],
      "why": "Her novel brought the reality of slavery to a mass audience on both sides of the Atlantic and hardened the sectional split before the Civil War."
    },
    {
      "slug": "leo-tolstoy",
      "name": "Leo Tolstoy",
      "type": "person",
      "wiki": "Leo Tolstoy",
      "description": "Russian writer of War and Peace and Anna Karenina whose later Christian anarchism and doctrine of nonviolent resistance influenced Mahatma Gandhi.",
      "metadata": {
        "birth_date": "1828",
        "death_date": "1910",
        "nationality": "Russian"
      },
      "periods": [
        {
          "label": "Writing career",
          "start": 1852,
          "end": 1910,
          "description": "Published War and Peace and Anna Karenina, then religious and political works such as The Kingdom of God Is Within You."
        }
      ],
      "why": "He set a standard for the novel and supplied the philosophy of nonviolence to the independence movements of the twentieth century."
    },
    {
      "slug": "lakshmibai-rani-of-jhansi",
      "name": "Lakshmibai, Rani of Jhansi",
      "type": "person",
      "wiki": "Lakshmibai, Rani of Jhansi",
      "description": "Queen of the Maratha state of Jhansi who led its forces against the British East India Company in the Indian Rebellion of 1857 and died in battle.",
      "metadata": {
        "birth_date": "1828",
        "death_date": "1858",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Rani of Jhansi",
          "start": 1853,
          "end": 1858,
          "description": "Governed Jhansi after her husband's death, resisted its annexation by the Company and fought at Jhansi and Gwalior."
        }
      ],
      "why": "She became a central symbol of Indian resistance to British rule and of women in the independence struggle."
    },
    {
      "slug": "florence-nightingale",
      "name": "Florence Nightingale",
      "type": "person",
      "wiki": "Florence Nightingale",
      "description": "British nurse and statistician who reformed military hospitals in the Crimean War and founded professional nursing with her training school at St Thomas' Hospital.",
      "metadata": {
        "birth_date": "1820",
        "death_date": "1910",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Nursing and sanitary reform",
          "start": 1854,
          "end": 1896,
          "description": "Ran the hospital at Scutari, used statistical graphics to argue for sanitary reform and founded the Nightingale Training School in 1860."
        }
      ],
      "why": "She created nursing as a trained profession and pioneered the use of statistics in public health."
    },
    {
      "slug": "james-clerk-maxwell",
      "name": "James Clerk Maxwell",
      "type": "person",
      "wiki": "James Clerk Maxwell",
      "description": "Scottish physicist whose equations unified electricity, magnetism and light as one electromagnetic field.",
      "metadata": {
        "birth_date": "1831",
        "death_date": "1879",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Research career",
          "start": 1855,
          "end": 1879,
          "description": "Formulated the equations of the electromagnetic field, predicted electromagnetic waves, developed the kinetic theory of gases and produced the first colour photograph."
        }
      ],
      "why": "His field equations underpin radio, radar, telecommunications and Einstein's relativity."
    },
    {
      "slug": "third-plague-pandemic",
      "name": "Third plague pandemic",
      "type": "event",
      "wiki": "Third plague pandemic",
      "description": "Bubonic plague pandemic that began in Yunnan, China, in 1855, spread worldwide through shipping and killed more than 12 million people, most of them in India.",
      "metadata": {
        "start_date": "1855",
        "end_date": "1960",
        "location": "China, India and worldwide",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Pandemic",
          "start": 1855,
          "end": 1960,
          "description": "Spread from Yunnan to Hong Kong in 1894 and from there by steamship to every inhabited continent."
        }
      ],
      "why": "It was among the deadliest pandemics in history, and the identification of its bacterium in Hong Kong in 1894 founded modern plague control."
    },
    {
      "slug": "gregor-mendel",
      "name": "Gregor Mendel",
      "type": "person",
      "wiki": "Gregor Mendel",
      "description": "Augustinian friar in Brno whose experiments on pea plants established the laws of heredity and founded genetics.",
      "metadata": {
        "birth_date": "1822",
        "death_date": "1884",
        "nationality": "Austrian"
      },
      "periods": [
        {
          "label": "Pea experiments",
          "start": 1856,
          "end": 1866,
          "description": "Bred and counted thousands of pea plants and published Experiments on Plant Hybridization in 1866."
        }
      ],
      "why": "Genetics, plant and animal breeding and modern medicine rest on the inheritance rules he found."
    },
    {
      "slug": "indian-rebellion-of-1857",
      "name": "Indian Rebellion of 1857",
      "type": "event",
      "wiki": "Indian Rebellion of 1857",
      "description": "Uprising of Indian soldiers and civilians against the British East India Company that ended company rule and brought India under direct British Crown government.",
      "metadata": {
        "start_date": "1857",
        "end_date": "1858",
        "location": "Northern and central India",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Rebellion",
          "start": 1857,
          "end": 1858,
          "description": "Began with the sepoy mutiny at Meerut, spread across the Gangetic plain and was suppressed after the sieges of Delhi, Lucknow and Jhansi."
        }
      ],
      "why": "It ended the East India Company's rule and became the founding episode of Indian nationalism."
    },
    {
      "slug": "british-raj",
      "name": "British Raj",
      "type": "organization",
      "wiki": "British Raj",
      "description": "British Crown rule over the Indian subcontinent from 1858 to 1947, covering present-day India, Pakistan, Bangladesh and, until 1937, Myanmar.",
      "metadata": {
        "founded_date": "1858",
        "dissolved_date": "1947",
        "headquarters": "Calcutta; New Delhi",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Crown rule",
          "start": 1858,
          "end": 1947,
          "description": "Governed through a viceroy and the Indian Civil Service, built railways and irrigation, presided over repeated famines and ended in partition."
        }
      ],
      "why": "It shaped the borders, institutions, language of government and partition of the states of South Asia."
    },
    {
      "slug": "abraham-lincoln",
      "name": "Abraham Lincoln",
      "type": "person",
      "wiki": "Abraham Lincoln",
      "description": "Sixteenth president of the United States, who led the Union through the American Civil War and issued the Emancipation Proclamation.",
      "metadata": {
        "birth_date": "1809",
        "death_date": "1865",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "President",
          "start": 1861,
          "end": 1865,
          "description": "Directed the Union war effort, issued the Emancipation Proclamation and pressed for the Thirteenth Amendment before his assassination."
        }
      ],
      "why": "He held the United States together and turned its civil war into a war to end slavery."
    },
    {
      "slug": "american-civil-war",
      "name": "American Civil War",
      "type": "event",
      "wiki": "American Civil War",
      "description": "War between the United States and eleven seceding Southern slave states that ended in Union victory and the abolition of slavery in the United States.",
      "metadata": {
        "start_date": "1861",
        "end_date": "1865",
        "location": "United States",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "War",
          "start": 1861,
          "end": 1865,
          "description": "Fought from Fort Sumter to Appomattox and killed more than 600,000 soldiers."
        }
      ],
      "why": "It ended American slavery, preserved the Union and set the United States on its path to world power."
    },
    {
      "slug": "emancipation-reform-of-1861",
      "name": "Emancipation reform of 1861",
      "type": "event",
      "wiki": "Emancipation reform of 1861",
      "description": "Reform by Tsar Alexander II that abolished serfdom across the Russian Empire, freeing 23 million privately held serfs.",
      "metadata": {
        "start_date": "1861",
        "end_date": "1861",
        "location": "Russian Empire",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Emancipation manifesto",
          "start": 1861,
          "end": 1861,
          "description": "Proclaimed on 3 March 1861, granting serfs personal freedom and land allotments paid for through redemption payments."
        }
      ],
      "why": "It was the largest single act of emancipation in history and began Russia's modernization."
    },
    {
      "slug": "empress-dowager-cixi",
      "name": "Empress Dowager Cixi",
      "type": "person",
      "wiki": "Empress Dowager Cixi",
      "description": "Manchu empress dowager who controlled the Qing government of China for 47 years, from the Tongzhi Restoration to the aftermath of the Boxer Rebellion.",
      "metadata": {
        "birth_date": "1835",
        "death_date": "1908",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Regent and power behind the throne",
          "start": 1861,
          "end": 1908,
          "description": "Ruled as regent for two emperors, backed the Self-Strengthening Movement, halted the Hundred Days' Reform and supported the Boxers."
        }
      ],
      "why": "She ran the world's most populous state for 47 years as it gave way to Western and Japanese pressure."
    },
    {
      "slug": "otto-von-bismarck",
      "name": "Otto von Bismarck",
      "type": "person",
      "wiki": "Otto von Bismarck",
      "description": "Prussian statesman who unified Germany through three wars, became the first chancellor of the German Empire and created the first state social insurance system.",
      "metadata": {
        "birth_date": "1815",
        "death_date": "1898",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Prussian and imperial chancellor",
          "start": 1862,
          "end": 1890,
          "description": "Waged wars against Denmark, Austria and France, proclaimed the German Empire in 1871 and introduced health, accident and old-age insurance."
        }
      ],
      "why": "He built the German nation-state and the welfare model copied across the industrial world."
    },
    {
      "slug": "alfred-nobel",
      "name": "Alfred Nobel",
      "type": "person",
      "wiki": "Alfred Nobel",
      "description": "Swedish chemist and industrialist who invented dynamite and left his fortune to fund the Nobel Prizes.",
      "metadata": {
        "birth_date": "1833",
        "death_date": "1896",
        "nationality": "Swedish"
      },
      "periods": [
        {
          "label": "Explosives inventor and industrialist",
          "start": 1863,
          "end": 1896,
          "description": "Patented dynamite in 1867, ran explosives factories across Europe, owned the Bofors armaments firm and wrote the will that created the prizes."
        }
      ],
      "why": "Dynamite transformed mining, construction and warfare, and his prizes became the world's leading honour for achievement."
    },
    {
      "slug": "bahai-faith",
      "name": "Baháʼí Faith",
      "type": "organization",
      "wiki": "Baháʼí Faith",
      "description": "Monotheistic religion founded in Persia by Baháʼu'lláh in 1863 that teaches the unity of God, of religion and of humanity.",
      "metadata": {
        "founded_date": "1863",
        "headquarters": "Haifa",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Religion",
          "start": 1863,
          "end": 2026,
          "description": "Spread from Persia and the Ottoman Empire to more than 200 countries despite persecution in Iran."
        }
      ],
      "why": "It is one of the most geographically widespread religions in the world."
    },
    {
      "slug": "international-committee-of-the-red-cross",
      "name": "International Committee of the Red Cross",
      "type": "organization",
      "wiki": "International Committee of the Red Cross",
      "description": "Humanitarian organization founded in Geneva in 1863 at Henry Dunant's initiative, which created the Red Cross movement and the Geneva Conventions on the treatment of war victims.",
      "metadata": {
        "founded_date": "1863",
        "headquarters": "Geneva",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Humanitarian organization",
          "start": 1863,
          "end": 2026,
          "description": "Convened the first Geneva Convention in 1864 and has since protected wounded soldiers, prisoners of war and civilians in armed conflicts."
        }
      ],
      "why": "It founded international humanitarian law and the Red Cross and Red Crescent movement."
    },
    {
      "slug": "international-red-cross-and-red-crescent-movement",
      "name": "Red Cross and Red Crescent Movement",
      "type": "organization",
      "wiki": "International Red Cross and Red Crescent Movement",
      "description": "The worldwide humanitarian movement that cares for the wounded, prisoners and victims of disaster and war.",
      "metadata": {
        "founded_date": "1863",
        "headquarters": "Geneva",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Founding and the Geneva Conventions",
          "start": 1863,
          "end": 1918,
          "description": "The movement was founded in Geneva, won the first Geneva Convention and ran relief through the First World War."
        },
        {
          "label": "Global humanitarian work",
          "start": 1919,
          "end": 2026,
          "description": "National societies in nearly every country run disaster relief, blood services and protection of war victims."
        }
      ],
      "why": "Created the modern humanitarian system and the laws of war that protect the wounded and prisoners."
    },
    {
      "slug": "leopold-ii-of-belgium",
      "name": "Leopold II of Belgium",
      "type": "person",
      "wiki": "Leopold II of Belgium",
      "description": "King of the Belgians who ruled the Congo Free State as his personal property, where forced rubber labour led to the deaths of millions of Congolese.",
      "metadata": {
        "birth_date": "1835",
        "death_date": "1909",
        "nationality": "Belgian"
      },
      "periods": [
        {
          "label": "King and sovereign of the Congo",
          "start": 1865,
          "end": 1909,
          "description": "Gained recognition of his Congo claim at the Berlin Conference, ran the colony for profit through concession companies and ceded it to Belgium in 1908."
        }
      ],
      "why": "His Congo regime was among the deadliest colonial systems and provoked an international reform campaign that exposed colonial abuse."
    },
    {
      "slug": "joseph-lister",
      "name": "Joseph Lister",
      "type": "person",
      "wiki": "Joseph Lister",
      "description": "British surgeon who introduced antiseptic surgery using carbolic acid, cutting deaths from post-operative infection.",
      "metadata": {
        "birth_date": "1827",
        "death_date": "1912",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Antiseptic surgery",
          "start": 1867,
          "end": 1893,
          "description": "Published his antiseptic method in 1867 and taught it in Glasgow, Edinburgh and London."
        }
      ],
      "why": "Safe surgery, and with it most modern operative medicine, began with his antiseptic method."
    },
    {
      "slug": "meiji-restoration",
      "name": "Meiji Restoration",
      "type": "event",
      "wiki": "Meiji Restoration",
      "description": "Political revolution of 1868 that restored imperial rule in Japan, abolished the samurai class and industrialized the country on Western models.",
      "metadata": {
        "start_date": "1868",
        "end_date": "1889",
        "location": "Japan",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Restoration and reforms",
          "start": 1868,
          "end": 1889,
          "description": "Ended the Tokugawa shogunate, abolished the domains and samurai stipends, introduced conscription and promulgated the Meiji Constitution."
        }
      ],
      "why": "It made Japan the first non-Western industrial power and set it on the road to empire."
    },
    {
      "slug": "dmitri-mendeleev",
      "name": "Dmitri Mendeleev",
      "type": "person",
      "wiki": "Dmitri Mendeleev",
      "description": "Russian chemist who formulated the periodic law and the periodic table of elements, predicting the properties of elements not yet discovered.",
      "metadata": {
        "birth_date": "1834",
        "death_date": "1907",
        "nationality": "Russian"
      },
      "periods": [
        {
          "label": "Periodic law and chemistry career",
          "start": 1869,
          "end": 1907,
          "description": "Published the periodic table in 1869, predicted gallium, scandium and germanium and directed Russia's Bureau of Weights and Measures."
        }
      ],
      "why": "His periodic table is the organizing chart of all chemistry."
    },
    {
      "slug": "friedrich-nietzsche",
      "name": "Friedrich Nietzsche",
      "type": "person",
      "wiki": "Friedrich Nietzsche",
      "description": "German philosopher who declared the death of God and developed the ideas of the will to power and the Übermensch, shaping existentialism and postmodernism and, in distorted form, Nazi propaganda.",
      "metadata": {
        "birth_date": "1844",
        "death_date": "1900",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Philosophical career",
          "start": 1869,
          "end": 1889,
          "description": "Taught at Basel and wrote The Birth of Tragedy, Thus Spoke Zarathustra, Beyond Good and Evil and On the Genealogy of Morality before his collapse."
        }
      ],
      "why": "His critique of morality and religion set the agenda of twentieth-century thought, for its humanists and its tyrants alike."
    },
    {
      "slug": "thomas-edison",
      "name": "Thomas Edison",
      "type": "person",
      "wiki": "Thomas Edison",
      "description": "American inventor and businessman who developed the phonograph, a practical incandescent light bulb, the first central power station and an early motion-picture camera.",
      "metadata": {
        "birth_date": "1847",
        "death_date": "1931",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Inventor and industrialist",
          "start": 1869,
          "end": 1931,
          "description": "Ran the Menlo Park and West Orange laboratories, received 1,093 US patents and founded the companies that became General Electric."
        }
      ],
      "why": "He electrified cities and created the industrial research laboratory."
    },
    {
      "slug": "john-d-rockefeller",
      "name": "John D. Rockefeller",
      "type": "person",
      "wiki": "John D. Rockefeller",
      "description": "American businessman who founded Standard Oil, which controlled 90 percent of US oil refining, and became the richest person of his time and a founder of modern philanthropy.",
      "metadata": {
        "birth_date": "1839",
        "death_date": "1937",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Standard Oil",
          "start": 1870,
          "end": 1897,
          "description": "Founded Standard Oil and built it into a refining monopoly through mergers, railroad rebates and the trust structure."
        },
        {
          "label": "Philanthropy",
          "start": 1897,
          "end": 1937,
          "description": "Funded the Rockefeller Institute for Medical Research, the General Education Board and the Rockefeller Foundation."
        }
      ],
      "why": "Standard Oil built the petroleum industry and provoked the antitrust law that governs modern business."
    },
    {
      "slug": "second-industrial-revolution",
      "name": "Second Industrial Revolution",
      "type": "event",
      "wiki": "Second Industrial Revolution",
      "description": "Phase of rapid industrialization from 1870 to 1914 driven by steel, electricity, chemicals, petroleum, the telephone and the internal combustion engine.",
      "metadata": {
        "start_date": "1870",
        "end_date": "1914",
        "location": "Europe, United States and Japan",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Technological revolution",
          "start": 1870,
          "end": 1914,
          "description": "Spread mass production, electric power, railways and telegraphs across the industrial nations."
        }
      ],
      "why": "It built the electrified, motorized and mass-produced world of the twentieth century."
    },
    {
      "slug": "german-empire",
      "name": "German Empire",
      "type": "organization",
      "wiki": "German Empire",
      "description": "Federal monarchy proclaimed in 1871 under the Prussian king, which became Europe's leading industrial power and was a principal belligerent in the First World War.",
      "metadata": {
        "founded_date": "1871",
        "dissolved_date": "1918",
        "headquarters": "Berlin",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Empire",
          "start": 1871,
          "end": 1918,
          "description": "Industrialized rapidly, introduced social insurance, acquired African and Pacific colonies and fought the First World War."
        }
      ],
      "why": "Its rise upset the European balance of power and set the stage for both world wars."
    },
    {
      "slug": "alexander-graham-bell",
      "name": "Alexander Graham Bell",
      "type": "person",
      "wiki": "Alexander Graham Bell",
      "description": "Scottish-born inventor who received the first US patent for the telephone in 1876 and founded the Bell Telephone Company.",
      "metadata": {
        "birth_date": "1847",
        "death_date": "1922",
        "nationality": "Scottish-American"
      },
      "periods": [
        {
          "label": "Telephone and invention",
          "start": 1876,
          "end": 1922,
          "description": "Patented the telephone, founded the Bell Telephone Company and worked on the photophone, hydrofoils and deaf education."
        }
      ],
      "why": "The telephone he patented began the age of instant voice communication."
    },
    {
      "slug": "robert-koch",
      "name": "Robert Koch",
      "type": "person",
      "wiki": "Robert Koch",
      "description": "German physician who identified the bacteria causing anthrax, tuberculosis and cholera and set out the postulates for linking a microbe to a disease.",
      "metadata": {
        "birth_date": "1843",
        "death_date": "1910",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Bacteriology research",
          "start": 1876,
          "end": 1905,
          "description": "Isolated the bacteria of anthrax, tuberculosis and cholera, developed culture and staining methods and won the Nobel Prize in 1905."
        }
      ],
      "why": "He made germ theory a working science and founded medical bacteriology."
    },
    {
      "slug": "rabindranath-tagore",
      "name": "Rabindranath Tagore",
      "type": "person",
      "wiki": "Rabindranath Tagore",
      "description": "Bengali poet, composer and educator who in 1913 became the first non-European Nobel laureate in literature and wrote the national anthems of India and Bangladesh.",
      "metadata": {
        "birth_date": "1861",
        "death_date": "1941",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Poetry, song and Santiniketan",
          "start": 1877,
          "end": 1941,
          "description": "Wrote poems, songs, novels and plays, and founded the school at Santiniketan that became Visva-Bharati University."
        }
      ],
      "why": "Tagore shaped modern Bengali and Indian culture, and his more than two thousand songs are sung across Bengal."
    },
    {
      "slug": "scramble-for-africa",
      "name": "Scramble for Africa",
      "type": "event",
      "wiki": "Scramble for Africa",
      "description": "Invasion, colonization and partition of the African continent by seven European powers between 1881 and 1914, leaving only Ethiopia and Liberia independent.",
      "metadata": {
        "start_date": "1881",
        "end_date": "1914",
        "location": "Africa",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Partition and conquest",
          "start": 1881,
          "end": 1914,
          "description": "Accelerated after the Berlin Conference of 1884 and 1885 as Britain, France, Germany, Belgium, Italy, Portugal and Spain conquered and divided the continent."
        }
      ],
      "why": "It drew the borders of modern Africa and imposed the colonial rule whose effects the continent still lives with."
    },
    {
      "slug": "jose-rizal",
      "name": "José Rizal",
      "type": "person",
      "wiki": "José Rizal",
      "description": "Filipino writer and physician whose novels Noli Me Tángere and El filibusterismo exposed Spanish colonial abuses and whose execution helped ignite the Philippine Revolution.",
      "metadata": {
        "birth_date": "1861",
        "death_date": "1896",
        "nationality": "Filipino"
      },
      "periods": [
        {
          "label": "Writer and reformer",
          "start": 1882,
          "end": 1896,
          "description": "Published his two novels in Europe, founded La Liga Filipina and was executed by the Spanish colonial government."
        }
      ],
      "why": "He is the national hero of the Philippines and an early voice of Asian anticolonial nationalism."
    },
    {
      "slug": "carl-benz",
      "name": "Carl Benz",
      "type": "person",
      "wiki": "Carl Benz",
      "description": "German engineer who built the Benz Patent-Motorwagen of 1885, the first practical automobile powered by an internal combustion engine.",
      "metadata": {
        "birth_date": "1844",
        "death_date": "1929",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Automobile pioneer",
          "start": 1883,
          "end": 1926,
          "description": "Founded Benz & Cie., patented the Motorwagen in 1886 and built the firm into the world's largest car maker by 1900, before its merger into Daimler-Benz."
        }
      ],
      "why": "Every car on the road descends from his motorwagen."
    },
    {
      "slug": "nikola-tesla",
      "name": "Nikola Tesla",
      "type": "person",
      "wiki": "Nikola Tesla",
      "description": "Serbian-American engineer who invented the alternating-current induction motor and the polyphase system on which electric power grids run.",
      "metadata": {
        "birth_date": "1856",
        "death_date": "1943",
        "nationality": "Serbian-American"
      },
      "periods": [
        {
          "label": "Inventing career",
          "start": 1884,
          "end": 1905,
          "description": "Worked for Edison, patented the AC induction motor, licensed it to Westinghouse and experimented with radio and wireless power."
        }
      ],
      "why": "The AC power systems that supply the world's electricity follow his designs."
    },
    {
      "slug": "congo-free-state",
      "name": "Congo Free State",
      "type": "organization",
      "wiki": "Congo Free State",
      "description": "State in Central Africa owned personally by Leopold II of Belgium, where forced labour for rubber caused the deaths of millions until Belgium annexed it in 1908.",
      "metadata": {
        "founded_date": "1885",
        "dissolved_date": "1908",
        "headquarters": "Boma",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Leopold's personal colony",
          "start": 1885,
          "end": 1908,
          "description": "Extracted ivory and rubber through quotas enforced by the Force Publique with hostage-taking and mutilation."
        }
      ],
      "why": "Its atrocities became the defining case of colonial abuse and launched a mass international campaign for reform."
    },
    {
      "slug": "indian-national-congress",
      "name": "Indian National Congress",
      "type": "organization",
      "wiki": "Indian National Congress",
      "description": "Political party founded in 1885 that led India's independence movement and governed independent India for most of the decades after 1947.",
      "metadata": {
        "founded_date": "1885",
        "headquarters": "New Delhi",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Independence movement",
          "start": 1885,
          "end": 1947,
          "description": "Grew from an elite petitioning body into a mass movement under Gandhi and Nehru."
        },
        {
          "label": "Party of government",
          "start": 1947,
          "end": 2026,
          "description": "Governed India under Nehru, Indira Gandhi and their successors for most of its independent history."
        }
      ],
      "why": "It won independence for the world's most populous democracy and shaped its politics for decades."
    },
    {
      "slug": "coca-cola",
      "name": "Coca-Cola",
      "type": "organization",
      "wiki": "Coca-Cola",
      "description": "The soft drink and company that became the world's most recognised brand.",
      "metadata": {
        "founded_date": "1886",
        "headquarters": "Atlanta, Georgia",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "From pharmacy tonic to American icon",
          "start": 1886,
          "end": 1945,
          "description": "Coca-Cola grew from an Atlanta pharmacy into a national brand that followed US troops around the world."
        },
        {
          "label": "Global brand",
          "start": 1946,
          "end": 2026,
          "description": "The drink is sold in nearly every country, a symbol of globalisation and a major source of dietary sugar."
        }
      ],
      "why": "The archetype of global branding and consumer culture, with a large footprint in diet and health."
    },
    {
      "slug": "swami-vivekananda",
      "name": "Swami Vivekananda",
      "type": "person",
      "wiki": "Swami Vivekananda",
      "description": "Indian Hindu monk who introduced Vedanta and yoga to Western audiences at the 1893 Parliament of the World's Religions and founded the Ramakrishna Mission.",
      "metadata": {
        "birth_date": "1863",
        "death_date": "1902",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Monk and teacher",
          "start": 1886,
          "end": 1902,
          "description": "Toured India and the West, spoke at the Chicago Parliament of Religions and founded the Ramakrishna Mission in 1897."
        }
      ],
      "why": "He presented Hinduism as a world religion and fed the cultural confidence of Indian nationalism."
    },
    {
      "slug": "menelik-ii",
      "name": "Menelik II",
      "type": "person",
      "wiki": "Menelik II",
      "description": "Emperor of Ethiopia who defeated the Italian invasion at the Battle of Adwa in 1896, keeping Ethiopia independent during the colonial partition of Africa.",
      "metadata": {
        "birth_date": "1844",
        "death_date": "1913",
        "nationality": "Ethiopian"
      },
      "periods": [
        {
          "label": "Emperor of Ethiopia",
          "start": 1889,
          "end": 1913,
          "description": "Expanded Ethiopia to its modern borders, won at Adwa, made Addis Ababa the capital and introduced the railway and telegraph."
        }
      ],
      "why": "Adwa made Ethiopia the symbol of African independence and an inspiration for pan-Africanism."
    },
    {
      "slug": "sun-yat-sen",
      "name": "Sun Yat-sen",
      "type": "person",
      "wiki": "Sun Yat-sen",
      "description": "Chinese revolutionary who founded the Kuomintang and served as first provisional president of the Republic of China after the fall of the Qing dynasty.",
      "metadata": {
        "birth_date": "1866",
        "nationality": "Chinese",
        "death_date": "1925"
      },
      "periods": [
        {
          "label": "Revolutionary organiser",
          "start": 1894,
          "end": 1911,
          "description": "Founded the Revive China Society and the Tongmenghui to overthrow the Qing."
        },
        {
          "label": "Founder of the Republic",
          "start": 1912,
          "end": 1925,
          "description": "Served as provisional president and led the Kuomintang in its alliance with the Soviet Union."
        }
      ],
      "why": "Both the People's Republic and Taiwan honour him as the founder of modern China."
    },
    {
      "slug": "guglielmo-marconi",
      "name": "Guglielmo Marconi",
      "type": "person",
      "wiki": "Guglielmo Marconi",
      "description": "Italian inventor and businessman who developed long-distance radio telegraphy and sent the first transatlantic radio signal in 1901.",
      "metadata": {
        "birth_date": "1874",
        "death_date": "1937",
        "nationality": "Italian"
      },
      "periods": [
        {
          "label": "Wireless telegraphy",
          "start": 1895,
          "end": 1937,
          "description": "Built radio transmitters, founded the Marconi company and extended wireless to shipping and broadcasting."
        }
      ],
      "why": "Marconi's wireless founded radio, from ship safety to broadcasting; he shared the 1909 Nobel Prize in Physics."
    },
    {
      "slug": "sigmund-freud",
      "name": "Sigmund Freud",
      "type": "person",
      "wiki": "Sigmund Freud",
      "description": "Austrian neurologist who founded psychoanalysis, introducing the unconscious, repression and the talking cure into medicine and Western culture.",
      "metadata": {
        "birth_date": "1856",
        "death_date": "1939",
        "nationality": "Austrian"
      },
      "periods": [
        {
          "label": "Psychoanalysis in Vienna and London",
          "start": 1896,
          "end": 1939,
          "description": "Developed psychoanalytic theory and practice, published The Interpretation of Dreams and built the international psychoanalytic movement."
        }
      ],
      "why": "Psychoanalysis shaped psychiatry, psychotherapy, literature, advertising and the everyday vocabulary of the mind."
    },
    {
      "slug": "count-dracula",
      "name": "Count Dracula",
      "type": "person",
      "wiki": "Count Dracula",
      "description": "The vampire count of Bram Stoker's 1897 novel Dracula, who defined the modern vampire in fiction and film.",
      "periods": [
        {
          "label": "In print, stage and film",
          "start": 1897,
          "end": 2026,
          "description": "Appeared in the novel, the 1922 film Nosferatu, the 1931 Universal film and a long line of later adaptations."
        }
      ],
      "why": "He fixed the vampire as a global figure of horror and is one of the most portrayed characters in film."
    },
    {
      "slug": "wright-brothers",
      "name": "Wright brothers",
      "type": "person",
      "wiki": "Wright brothers",
      "description": "American brothers Wilbur and Orville Wright, who made the first controlled, sustained, powered airplane flight at Kitty Hawk, North Carolina, on 17 December 1903.",
      "metadata": {
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Aircraft development",
          "start": 1899,
          "end": 1915,
          "description": "Built gliders and powered aircraft, solved three-axis flight control and sold airplanes to armies in the US and Europe."
        }
      ],
      "why": "Powered flight led to commercial aviation, air warfare and mass air travel."
    },
    {
      "slug": "pablo-picasso",
      "name": "Pablo Picasso",
      "type": "person",
      "wiki": "Pablo Picasso",
      "description": "Spanish painter and sculptor who co-founded Cubism with Georges Braque and painted Les Demoiselles d'Avignon (1907) and Guernica (1937).",
      "metadata": {
        "birth_date": "1881",
        "death_date": "1973",
        "nationality": "Spanish"
      },
      "periods": [
        {
          "label": "Artistic career in Paris and southern France",
          "start": 1900,
          "end": 1973,
          "description": "Produced paintings, sculpture, ceramics and prints across his Blue, Rose, Cubist and later periods."
        }
      ],
      "why": "Picasso broke with single-point perspective and became the model of the modern artist."
    },
    {
      "slug": "quantum-mechanics",
      "name": "Quantum mechanics",
      "type": "event",
      "wiki": "Quantum mechanics",
      "description": "Physical theory of matter and energy at atomic scales, developed from Max Planck's quantum hypothesis of 1900 to the matrix and wave mechanics of Werner Heisenberg and Erwin Schrödinger in 1925 and 1926.",
      "metadata": {
        "start_date": "1900",
        "end_date": "1927",
        "location": "Germany, Denmark, Austria and Switzerland",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Development of quantum theory",
          "start": 1900,
          "end": 1927,
          "description": "Physicists in Berlin, Copenhagen, Göttingen and Zurich built the theory from Planck's quanta to the uncertainty principle."
        }
      ],
      "why": "Quantum mechanics explains chemistry and solids and underlies the transistor, the laser and nuclear power."
    },
    {
      "slug": "ibn-saud",
      "name": "Ibn Saud",
      "type": "person",
      "wiki": "Ibn Saud",
      "description": "Founder of Saudi Arabia, who united most of the Arabian Peninsula under his rule by 1932 and granted the oil concessions that made the kingdom a global energy power.",
      "metadata": {
        "birth_date": "1875",
        "nationality": "Saudi",
        "death_date": "1953"
      },
      "periods": [
        {
          "label": "Conquest of Arabia",
          "start": 1902,
          "end": 1932,
          "description": "Captured Riyadh, conquered the Hejaz with Wahhabi Ikhwan forces and unified the kingdom."
        },
        {
          "label": "King of Saudi Arabia",
          "start": 1932,
          "end": 1953,
          "description": "Granted the concession to Standard Oil of California and allied the kingdom with the United States."
        }
      ],
      "why": "His state controls Islam's holiest cities and the world's largest oil reserves, and spread Wahhabism globally."
    },
    {
      "slug": "willis-carrier",
      "name": "Willis Carrier",
      "type": "person",
      "wiki": "Willis Carrier",
      "description": "American engineer who designed the first modern electrical air-conditioning system in 1902 and co-founded Carrier Corporation in 1915.",
      "metadata": {
        "birth_date": "1876",
        "death_date": "1950",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Air-conditioning engineering",
          "start": 1902,
          "end": 1950,
          "description": "Designed humidity and temperature control systems for factories, theaters and homes."
        }
      ],
      "why": "Air conditioning changed where people live and work, from the US Sun Belt to Singapore and the Gulf states."
    },
    {
      "slug": "emmeline-pankhurst",
      "name": "Emmeline Pankhurst",
      "type": "person",
      "wiki": "Emmeline Pankhurst",
      "description": "Founder of the Women's Social and Political Union, whose militant suffragette campaign pressed Britain into granting women the vote.",
      "metadata": {
        "birth_date": "1858",
        "nationality": "British",
        "death_date": "1928"
      },
      "periods": [
        {
          "label": "Suffragette leader",
          "start": 1903,
          "end": 1918,
          "description": "Founded the WSPU and led its campaign of marches, hunger strikes and property attacks."
        }
      ],
      "why": "Her movement became the model for militant campaigns for women's political rights worldwide."
    },
    {
      "slug": "henry-ford",
      "name": "Henry Ford",
      "type": "person",
      "wiki": "Henry Ford",
      "description": "American industrialist who founded the Ford Motor Company in 1903, introduced the Model T in 1908 and the moving assembly line in 1913, and published antisemitic propaganda in the 1920s.",
      "metadata": {
        "birth_date": "1863",
        "death_date": "1947",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Ford Motor Company",
          "start": 1903,
          "end": 1945,
          "description": "Ran Ford's mass production of cars and set the five-dollar workday."
        }
      ],
      "why": "Fordism set the template for mass production, mass consumption and the car-centered society."
    },
    {
      "slug": "womens-suffrage",
      "name": "Women's suffrage",
      "type": "event",
      "wiki": "Women's suffrage",
      "description": "Movement for women's right to vote, which won the franchise in New Zealand in 1893, across much of Europe and North America after the First World War, and in most of the world by the 1970s.",
      "metadata": {
        "start_date": "1848",
        "location": "Worldwide",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Suffrage won in the West",
          "start": 1903,
          "end": 1928,
          "description": "Mass campaigns won the vote in Finland, Britain, the United States and much of Europe."
        },
        {
          "label": "Global extension",
          "start": 1944,
          "end": 1971,
          "description": "Women won the vote in France, Italy, India, Japan, China and most newly independent states."
        }
      ],
      "why": "It extended the vote to half the adult population of every democracy."
    },
    {
      "slug": "fifa",
      "name": "FIFA",
      "type": "organization",
      "wiki": "FIFA",
      "description": "International governing body of association football, founded in Paris in 1904, which has organized the FIFA World Cup since 1930.",
      "metadata": {
        "founded_date": "1904",
        "headquarters": "Zurich, Switzerland",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Governing world football",
          "start": 1904,
          "end": 2026,
          "description": "Ran the men's and women's World Cups and governed over 200 national football associations."
        }
      ],
      "why": "The World Cup is the most watched sporting event, and football the most played sport on Earth."
    },
    {
      "slug": "fritz-haber",
      "name": "Fritz Haber",
      "type": "person",
      "wiki": "Fritz Haber",
      "description": "German chemist who devised the synthesis of ammonia from atmospheric nitrogen in 1909 and directed Germany's poison gas program in World War I.",
      "metadata": {
        "birth_date": "1868",
        "death_date": "1934",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Ammonia synthesis and chemical warfare",
          "start": 1905,
          "end": 1933,
          "description": "Developed ammonia synthesis at Karlsruhe, ran the Kaiser Wilhelm Institute for Physical Chemistry and led the first chlorine gas attack at Ypres in 1915."
        }
      ],
      "why": "His ammonia synthesis feeds billions through fertilizer, and he founded chemical warfare."
    },
    {
      "slug": "eugenics",
      "name": "Eugenics",
      "type": "event",
      "wiki": "Eugenics",
      "description": "Movement to improve human heredity by controlling reproduction, which produced forced sterilization laws in the United States, Sweden and other countries and Nazi Germany's racial hygiene program.",
      "metadata": {
        "start_date": "1907",
        "end_date": "1976",
        "location": "United States, Europe and worldwide",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Sterilization laws and racial hygiene",
          "start": 1907,
          "end": 1945,
          "description": "Governments passed sterilization and immigration laws, culminating in Nazi Germany's sterilization and killing of disabled people."
        },
        {
          "label": "Postwar sterilization programs",
          "start": 1946,
          "end": 1976,
          "description": "Sweden, the United States and other countries continued compulsory sterilizations."
        }
      ],
      "why": "Eugenics led to the forced sterilization of hundreds of thousands and supplied the scientific pretext for the Nazi murder of disabled people."
    },
    {
      "slug": "lise-meitner",
      "name": "Lise Meitner",
      "type": "person",
      "wiki": "Lise Meitner",
      "description": "Austrian-Swedish physicist who with her nephew Otto Frisch gave the first explanation of nuclear fission in 1939, after experiments she had begun with Otto Hahn in Berlin.",
      "metadata": {
        "birth_date": "1878",
        "death_date": "1968",
        "nationality": "Austrian-Swedish"
      },
      "periods": [
        {
          "label": "Nuclear physics in Berlin and Stockholm",
          "start": 1907,
          "end": 1960,
          "description": "Researched radioactivity with Otto Hahn in Berlin until fleeing Nazi Germany in 1938, then worked in Stockholm."
        }
      ],
      "why": "Her explanation of fission opened the path to nuclear weapons and nuclear power."
    },
    {
      "slug": "haber-process",
      "name": "Haber process",
      "type": "event",
      "wiki": "Haber process",
      "description": "Industrial synthesis of ammonia from nitrogen and hydrogen, demonstrated by Fritz Haber in 1909 and scaled up by Carl Bosch at BASF in 1913.",
      "metadata": {
        "start_date": "1909",
        "end_date": "1913",
        "location": "Karlsruhe and Oppau, Germany",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Discovery and industrialization",
          "start": 1909,
          "end": 1913,
          "description": "Haber built a laboratory ammonia reactor and Bosch engineered the first industrial plant at Oppau."
        }
      ],
      "why": "Synthetic nitrogen fertilizer from the process feeds billions, and its nitrates supplied explosives for two world wars."
    },
    {
      "slug": "mexican-revolution",
      "name": "Mexican Revolution",
      "type": "event",
      "wiki": "Mexican Revolution",
      "description": "Decade of armed conflict that overthrew Porfirio Díaz, produced the 1917 Constitution with its land and labour reforms, and led to the party that governed Mexico until 2000.",
      "metadata": {
        "start_date": "1910",
        "location": "Mexico",
        "end_date": "1920",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Revolutionary war",
          "start": 1910,
          "end": 1920,
          "description": "Madero, Zapata, Villa and Carranza fought the old regime and each other."
        }
      ],
      "why": "It was the first great social revolution of the twentieth century and set Mexico's course until 2000."
    },
    {
      "slug": "xinhai-revolution",
      "name": "1911 Revolution",
      "type": "event",
      "wiki": "1911 Revolution",
      "description": "Revolution that began with the Wuchang Uprising in October 1911 and ended imperial rule in China with the abdication of the Qing emperor in 1912.",
      "metadata": {
        "start_date": "1911",
        "location": "China",
        "end_date": "1912",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Uprising and abdication",
          "start": 1911,
          "end": 1912,
          "description": "Provincial uprisings forced the Qing court to abdicate and founded the Republic of China."
        }
      ],
      "why": "It ended China's dynastic system and opened four decades of revolution and war."
    },
    {
      "slug": "ibm",
      "name": "IBM",
      "type": "organization",
      "wiki": "IBM",
      "description": "American technology company incorporated in 1911 and renamed International Business Machines in 1924, which dominated punched-card tabulating and mainframe computing and set the standard for the personal computer in 1981.",
      "metadata": {
        "founded_date": "1911",
        "headquarters": "Armonk, New York, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Tabulating, mainframes and services",
          "start": 1911,
          "end": 2026,
          "description": "Built tabulators, the System/360 mainframes, the IBM PC and enterprise software and services."
        }
      ],
      "why": "IBM built the data-processing systems of governments and corporations for most of the twentieth century."
    },
    {
      "slug": "african-national-congress",
      "name": "African National Congress",
      "type": "organization",
      "wiki": "African National Congress",
      "description": "South African political movement founded in 1912 that led the struggle against apartheid and has governed the country since the first universal-suffrage elections in 1994.",
      "metadata": {
        "founded_date": "1912",
        "headquarters": "Johannesburg",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Liberation movement",
          "start": 1912,
          "end": 1994,
          "description": "Led the Defiance Campaign, the Freedom Charter and the armed struggle against white minority rule."
        },
        {
          "label": "Governing party",
          "start": 1994,
          "end": 2026,
          "description": "Governed South Africa under Mandela and his successors."
        }
      ],
      "why": "It led the defeat of apartheid, the most prominent liberation struggle of the late twentieth century."
    },
    {
      "slug": "federal-reserve",
      "name": "Federal Reserve",
      "type": "organization",
      "wiki": "Federal Reserve",
      "description": "Central bank of the United States, whose control of the dollar's interest rates and money supply sets financial conditions for much of the world economy.",
      "metadata": {
        "founded_date": "1913",
        "headquarters": "Washington, D.C.",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "US central bank",
          "start": 1913,
          "end": 2026,
          "description": "Set monetary policy through the Great Depression, the Volcker disinflation and the 2008 and 2020 crises."
        }
      ],
      "why": "Because the dollar is the world's reserve currency, its decisions move economies on every continent."
    },
    {
      "slug": "muhammad-ali-jinnah",
      "name": "Muhammad Ali Jinnah",
      "type": "person",
      "wiki": "Muhammad Ali Jinnah",
      "description": "Leader of the All-India Muslim League whose demand for a separate Muslim homeland produced the creation of Pakistan in 1947.",
      "metadata": {
        "birth_date": "1876",
        "nationality": "Pakistani",
        "death_date": "1948"
      },
      "periods": [
        {
          "label": "Muslim League leader",
          "start": 1913,
          "end": 1947,
          "description": "Led the Muslim League to the 1940 Lahore Resolution and the demand for Pakistan."
        },
        {
          "label": "Governor-General of Pakistan",
          "start": 1947,
          "end": 1948,
          "description": "Served as the first head of the new state of Pakistan."
        }
      ],
      "why": "He founded a nation that now holds more than 240 million people and set the terms of the partition of South Asia."
    },
    {
      "slug": "niels-bohr",
      "name": "Niels Bohr",
      "type": "person",
      "wiki": "Niels Bohr",
      "description": "Danish physicist who proposed the quantum model of the atom in 1913 and made his Copenhagen institute the center of quantum mechanics in the 1920s.",
      "metadata": {
        "birth_date": "1885",
        "death_date": "1962",
        "nationality": "Danish"
      },
      "periods": [
        {
          "label": "Atomic physics in Copenhagen",
          "start": 1913,
          "end": 1962,
          "description": "Developed the quantum atom and the Copenhagen interpretation, trained a generation of physicists and argued for international control of nuclear weapons."
        }
      ],
      "why": "Bohr's atom and Copenhagen school shaped quantum mechanics, on which modern physics, chemistry and electronics rest."
    },
    {
      "slug": "rockefeller-foundation",
      "name": "Rockefeller Foundation",
      "type": "organization",
      "wiki": "Rockefeller Foundation",
      "description": "American philanthropic foundation established by John D. Rockefeller in 1913, which funded hookworm and yellow fever campaigns, the yellow fever vaccine and the crop research behind the Green Revolution.",
      "metadata": {
        "founded_date": "1913",
        "headquarters": "New York City, United States",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Global health and agriculture philanthropy",
          "start": 1913,
          "end": 2026,
          "description": "Funded schools of public health, disease campaigns and agricultural research in Mexico, India and the Philippines."
        }
      ],
      "why": "It created the model of global public-health philanthropy and seeded the Green Revolution."
    },
    {
      "slug": "woodrow-wilson",
      "name": "Woodrow Wilson",
      "type": "person",
      "wiki": "Woodrow Wilson",
      "description": "US president who led the country into the First World War and set out the Fourteen Points and the League of Nations at the Paris Peace Conference.",
      "metadata": {
        "birth_date": "1856",
        "nationality": "American",
        "death_date": "1924"
      },
      "periods": [
        {
          "label": "President of the United States",
          "start": 1913,
          "end": 1921,
          "description": "Created the Federal Reserve, entered the First World War and shaped the Versailles settlement."
        }
      ],
      "why": "His doctrine of national self-determination and collective security set the agenda for twentieth-century international order."
    },
    {
      "slug": "margaret-sanger",
      "name": "Margaret Sanger",
      "type": "person",
      "wiki": "Margaret Sanger",
      "description": "American nurse and activist who founded the birth control movement and the organisation that became Planned Parenthood, and promoted the research that produced the contraceptive pill.",
      "metadata": {
        "birth_date": "1879",
        "nationality": "American",
        "death_date": "1966"
      },
      "periods": [
        {
          "label": "Birth control campaigner",
          "start": 1914,
          "end": 1960,
          "description": "Published on contraception, opened the first US birth control clinic in 1916 and secured funding for the Pill."
        }
      ],
      "why": "The contraceptive access she fought for changed family size, women's work and population growth worldwide."
    },
    {
      "slug": "armenian-genocide",
      "name": "Armenian genocide",
      "type": "event",
      "wiki": "Armenian genocide",
      "description": "Ottoman government's systematic killing and deportation of between 600,000 and 1.5 million Armenians during and after the First World War.",
      "metadata": {
        "start_date": "1915",
        "location": "Ottoman Empire",
        "end_date": "1923",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Deportations and massacres",
          "start": 1915,
          "end": 1923,
          "description": "Ottoman authorities deported Armenians into the Syrian desert and massacred them along the way."
        }
      ],
      "why": "It was a principal case Raphael Lemkin cited when he coined the word genocide, and its denial remains a live international dispute."
    },
    {
      "slug": "haile-selassie",
      "name": "Haile Selassie",
      "type": "person",
      "wiki": "Haile Selassie",
      "description": "Emperor of Ethiopia who resisted Fascist Italy's invasion, helped found the Organisation of African Unity, and is revered as divine in the Rastafari movement.",
      "metadata": {
        "birth_date": "1892",
        "nationality": "Ethiopian",
        "death_date": "1975"
      },
      "periods": [
        {
          "label": "Regent and emperor",
          "start": 1916,
          "end": 1936,
          "description": "Ruled as regent and from 1930 as emperor, and appealed to the League of Nations against Italy."
        },
        {
          "label": "Restored emperor",
          "start": 1941,
          "end": 1974,
          "description": "Returned from exile, hosted the founding of the OAU in Addis Ababa and was deposed by the Derg."
        }
      ],
      "why": "He was Africa's leading statesman of the twentieth century and is the central figure of a worldwide religion."
    },
    {
      "slug": "thomas-midgley-jr",
      "name": "Thomas Midgley Jr.",
      "type": "person",
      "wiki": "Thomas Midgley Jr.",
      "description": "American chemical engineer who introduced tetraethyl lead as a gasoline anti-knock additive in 1921 and chlorofluorocarbon refrigerants in 1928.",
      "metadata": {
        "birth_date": "1889",
        "death_date": "1944",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Industrial chemistry for General Motors",
          "start": 1916,
          "end": 1944,
          "description": "Developed leaded gasoline and Freon refrigerants in the research laboratories run by Charles Kettering."
        }
      ],
      "why": "Leaded gasoline exposed most of humanity to lead for decades and CFCs depleted the ozone layer."
    },
    {
      "slug": "j-r-r-tolkien",
      "name": "J. R. R. Tolkien",
      "type": "person",
      "wiki": "J. R. R. Tolkien",
      "description": "British philologist and writer of The Hobbit (1937) and The Lord of the Rings (1954 to 1955), the works that founded modern fantasy fiction.",
      "metadata": {
        "birth_date": "1892",
        "death_date": "1973",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Middle-earth writing",
          "start": 1917,
          "end": 1973,
          "description": "Built the Middle-earth mythology while teaching Old and Middle English at Leeds and Oxford."
        }
      ],
      "why": "Modern fantasy literature, role-playing games and much of video gaming descend from his Middle-earth."
    },
    {
      "slug": "leon-trotsky",
      "name": "Leon Trotsky",
      "type": "person",
      "wiki": "Leon Trotsky",
      "description": "Marxist revolutionary who organised the Bolshevik seizure of power in 1917, built the Red Army, and was murdered in exile on Stalin's orders.",
      "metadata": {
        "birth_date": "1879",
        "nationality": "Russian",
        "death_date": "1940"
      },
      "periods": [
        {
          "label": "Revolution and Red Army",
          "start": 1917,
          "end": 1925,
          "description": "Led the October insurrection in Petrograd and commanded the Red Army in the Civil War."
        },
        {
          "label": "Exile and opposition",
          "start": 1929,
          "end": 1940,
          "description": "Led the opposition to Stalin from exile and founded the Fourth International."
        }
      ],
      "why": "He built the army that secured the Soviet state and founded the Trotskyist movement that spread worldwide."
    },
    {
      "slug": "louis-armstrong",
      "name": "Louis Armstrong",
      "type": "person",
      "wiki": "Louis Armstrong",
      "description": "American trumpeter and singer whose Hot Five and Hot Seven recordings of 1925 to 1928 made the improvised solo the center of jazz.",
      "metadata": {
        "birth_date": "1901",
        "death_date": "1971",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Performing and recording career",
          "start": 1918,
          "end": 1971,
          "description": "Played in New Orleans, Chicago and New York, then toured the world as a bandleader and US goodwill ambassador."
        }
      ],
      "why": "Jazz, which he shaped, fed swing, rhythm and blues and rock and roll, and became America's first global music."
    },
    {
      "slug": "lu-xun",
      "name": "Lu Xun",
      "type": "person",
      "wiki": "Lu Xun",
      "description": "Chinese writer whose stories A Madman's Diary (1918) and The True Story of Ah Q (1921) founded modern vernacular Chinese literature.",
      "metadata": {
        "birth_date": "1881",
        "death_date": "1936",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Writing career",
          "start": 1918,
          "end": 1936,
          "description": "Wrote stories, essays and translations in Beijing, Xiamen, Guangzhou and Shanghai."
        }
      ],
      "why": "He is the founding figure of modern Chinese literature and standard reading in Chinese schools."
    },
    {
      "slug": "partition-of-the-ottoman-empire",
      "name": "Partition of the Ottoman Empire",
      "type": "event",
      "wiki": "Partition of the Ottoman Empire",
      "description": "Division of the defeated Ottoman Empire's lands among Britain, France and new states after the First World War, which drew the borders of Turkey, Iraq, Syria, Lebanon, Jordan and Mandatory Palestine.",
      "metadata": {
        "start_date": "1918",
        "location": "Middle East",
        "end_date": "1923",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Partition",
          "start": 1918,
          "end": 1923,
          "description": "Armistice, occupation, mandates and the treaties of Sèvres and Lausanne divided the empire."
        }
      ],
      "why": "It drew the map of the modern Middle East and its unresolved conflicts."
    },
    {
      "slug": "b-r-ambedkar",
      "name": "B. R. Ambedkar",
      "type": "person",
      "wiki": "B. R. Ambedkar",
      "description": "Dalit jurist and politician who chaired the drafting committee of India's constitution and led a mass conversion of Dalits to Buddhism in 1956.",
      "metadata": {
        "birth_date": "1891",
        "nationality": "Indian",
        "death_date": "1956"
      },
      "periods": [
        {
          "label": "Dalit rights campaigner",
          "start": 1919,
          "end": 1947,
          "description": "Organised campaigns against untouchability, including the Mahad Satyagraha of 1927."
        },
        {
          "label": "Architect of the Constitution",
          "start": 1947,
          "end": 1956,
          "description": "Chaired the committee that drafted India's constitution and its bans on caste discrimination."
        }
      ],
      "why": "He wrote the legal framework for 1.4 billion people and is the central figure of the Dalit movement."
    },
    {
      "slug": "benito-mussolini",
      "name": "Benito Mussolini",
      "type": "person",
      "wiki": "Benito Mussolini",
      "description": "Founder of Fascism who ruled Italy as dictator from 1922 to 1943 and took it into the Second World War as Hitler's ally.",
      "metadata": {
        "birth_date": "1883",
        "nationality": "Italian",
        "death_date": "1945"
      },
      "periods": [
        {
          "label": "Founding Fascism",
          "start": 1919,
          "end": 1922,
          "description": "Founded the Fasci di Combattimento and led the March on Rome."
        },
        {
          "label": "Dictator of Italy",
          "start": 1922,
          "end": 1943,
          "description": "Built the first fascist one-party state, invaded Ethiopia and allied with Nazi Germany."
        }
      ],
      "why": "He invented fascism as a political model that was copied across Europe, Latin America and Asia."
    },
    {
      "slug": "jawaharlal-nehru",
      "name": "Jawaharlal Nehru",
      "type": "person",
      "wiki": "Jawaharlal Nehru",
      "description": "First prime minister of India, who set the country's course as a secular, democratic, state-planned and non-aligned republic.",
      "metadata": {
        "birth_date": "1889",
        "nationality": "Indian",
        "death_date": "1964"
      },
      "periods": [
        {
          "label": "Independence movement leader",
          "start": 1919,
          "end": 1947,
          "description": "Rose to lead the Indian National Congress alongside Gandhi in the campaign against British rule."
        },
        {
          "label": "Prime Minister of India",
          "start": 1947,
          "end": 1964,
          "description": "Built India's parliamentary democracy, planned economy and non-aligned foreign policy."
        }
      ],
      "why": "He shaped the institutions of the world's largest democracy and co-founded the Non-Aligned Movement."
    },
    {
      "slug": "john-maynard-keynes",
      "name": "John Maynard Keynes",
      "type": "person",
      "wiki": "John Maynard Keynes",
      "description": "British economist whose General Theory argued for government spending to fight unemployment and who co-designed the Bretton Woods monetary system.",
      "metadata": {
        "birth_date": "1883",
        "nationality": "British",
        "death_date": "1946"
      },
      "periods": [
        {
          "label": "Economist and policy adviser",
          "start": 1919,
          "end": 1946,
          "description": "Criticised the Versailles reparations, published the General Theory in 1936 and led Britain's delegation at Bretton Woods."
        }
      ],
      "why": "Keynesian demand management governed Western economic policy from the 1940s to the 1970s and returned in 2008."
    },
    {
      "slug": "mustafa-kemal-ataturk",
      "name": "Mustafa Kemal Atatürk",
      "type": "person",
      "wiki": "Mustafa Kemal Atatürk",
      "description": "Founder and first president of the Republic of Turkey, who built a secular nation-state from the core of the defeated Ottoman Empire.",
      "metadata": {
        "birth_date": "1881",
        "nationality": "Turkish",
        "death_date": "1938"
      },
      "periods": [
        {
          "label": "War of Independence",
          "start": 1919,
          "end": 1923,
          "description": "Led the Turkish nationalist forces that overturned the Treaty of Sèvres."
        },
        {
          "label": "President of Turkey",
          "start": 1923,
          "end": 1938,
          "description": "Abolished the caliphate, replaced Islamic law with secular codes and switched Turkish to the Latin alphabet."
        }
      ],
      "why": "His secularising republic became the model for modernising states across the Muslim world."
    },
    {
      "slug": "treaty-of-versailles",
      "name": "Treaty of Versailles",
      "type": "event",
      "wiki": "Treaty of Versailles",
      "description": "Peace treaty that ended the First World War with Germany, imposing territorial losses, disarmament and reparations, and establishing the League of Nations.",
      "metadata": {
        "start_date": "1919",
        "location": "Versailles, France",
        "end_date": "1920",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Signing and ratification",
          "start": 1919,
          "end": 1920,
          "description": "Signed on 28 June 1919 and in force from January 1920."
        }
      ],
      "why": "Its terms redrew Europe and fed the German grievance that the Nazis exploited."
    },
    {
      "slug": "agatha-christie",
      "name": "Agatha Christie",
      "type": "person",
      "wiki": "Agatha Christie",
      "description": "British writer of 66 detective novels featuring Hercule Poirot and Miss Marple, and the best-selling fiction writer of all time.",
      "metadata": {
        "birth_date": "1890",
        "death_date": "1976",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Writing career",
          "start": 1920,
          "end": 1976,
          "description": "Published detective novels, story collections and plays, including The Mousetrap."
        }
      ],
      "why": "Her books have sold over two billion copies and fixed the form of the detective mystery."
    },
    {
      "slug": "david-ben-gurion",
      "name": "David Ben-Gurion",
      "type": "person",
      "wiki": "David Ben-Gurion",
      "description": "Zionist leader who proclaimed the State of Israel in 1948 and served as its first prime minister.",
      "metadata": {
        "birth_date": "1886",
        "nationality": "Israeli",
        "death_date": "1973"
      },
      "periods": [
        {
          "label": "Zionist labour leader",
          "start": 1920,
          "end": 1948,
          "description": "Led the Histadrut labour federation and the Jewish Agency in building the Jewish community in Palestine."
        },
        {
          "label": "Prime Minister of Israel",
          "start": 1948,
          "end": 1963,
          "description": "Led Israel through the 1948 war and built its army, institutions and immigration system."
        }
      ],
      "why": "He founded the state of Israel and its institutions."
    },
    {
      "slug": "ho-chi-minh",
      "name": "Ho Chi Minh",
      "type": "person",
      "wiki": "Ho Chi Minh",
      "description": "Vietnamese communist revolutionary who declared Vietnam's independence in 1945 and led North Vietnam against France and the United States.",
      "metadata": {
        "birth_date": "1890",
        "nationality": "Vietnamese",
        "death_date": "1969"
      },
      "periods": [
        {
          "label": "Communist organiser",
          "start": 1920,
          "end": 1941,
          "description": "Joined the French Communist Party and founded the Indochinese Communist Party in 1930."
        },
        {
          "label": "Leader of North Vietnam",
          "start": 1945,
          "end": 1969,
          "description": "Led the Viet Minh against France and the Democratic Republic of Vietnam against the United States."
        }
      ],
      "why": "He led the anticolonial war that defeated two Western powers and became a model for national liberation movements."
    },
    {
      "slug": "israeli-palestinian-conflict",
      "name": "Israeli–Palestinian conflict",
      "type": "event",
      "wiki": "Israeli–Palestinian conflict",
      "description": "Conflict between Israel and the Palestinians over land, statehood and Jerusalem, running from the British Mandate through the 1948 war, the 1967 occupation of the West Bank and Gaza, and the Gaza war that began in 2023.",
      "metadata": {
        "start_date": "1920",
        "location": "Israel and Palestine",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Mandate-era conflict",
          "start": 1920,
          "end": 1948,
          "description": "Jewish immigration and Arab resistance produced riots and revolt under British rule."
        },
        {
          "label": "Conflict since 1948",
          "start": 1948,
          "end": 2026,
          "description": "Wars, occupation, intifadas, failed peace processes and the Gaza war."
        }
      ],
      "why": "It has drawn in the great powers since the British Mandate and drives Middle Eastern politics and terrorism."
    },
    {
      "slug": "league-of-nations",
      "name": "League of Nations",
      "type": "organization",
      "wiki": "League of Nations",
      "description": "First worldwide intergovernmental organisation for keeping peace, set up after the First World War, which failed to stop the aggression that led to the Second World War.",
      "metadata": {
        "founded_date": "1920",
        "headquarters": "Geneva",
        "organization_type": "institution",
        "dissolved_date": "1946"
      },
      "periods": [
        {
          "label": "Interwar peacekeeping",
          "start": 1920,
          "end": 1946,
          "description": "Settled minor disputes, ran mandates and refugee work, and failed over Manchuria and Ethiopia."
        }
      ],
      "why": "It was the first attempt at world governance and the direct model for the United Nations."
    },
    {
      "slug": "chinese-communist-party",
      "name": "Chinese Communist Party",
      "type": "organization",
      "wiki": "Chinese Communist Party",
      "description": "Founding and ruling party of the People's Republic of China, which won the Chinese Civil War in 1949 and has governed the country as a one-party state since.",
      "metadata": {
        "founded_date": "1921",
        "headquarters": "Beijing",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Revolutionary party",
          "start": 1921,
          "end": 1949,
          "description": "Organised workers and peasants, survived the Long March and won the civil war."
        },
        {
          "label": "Ruling party of China",
          "start": 1949,
          "end": 2026,
          "description": "Governs the People's Republic through mass campaigns, market reforms and a party-state that controls the army, courts and press."
        }
      ],
      "why": "It rules one-sixth of humanity and the world's second-largest economy."
    },
    {
      "slug": "frederick-banting",
      "name": "Frederick Banting",
      "type": "person",
      "wiki": "Frederick Banting",
      "description": "Canadian physician who with Charles Best, J. J. R. Macleod and James Collip isolated insulin at the University of Toronto in 1921 and 1922, making type 1 diabetes treatable.",
      "metadata": {
        "birth_date": "1891",
        "death_date": "1941",
        "nationality": "Canadian"
      },
      "periods": [
        {
          "label": "Insulin research in Toronto",
          "start": 1921,
          "end": 1941,
          "description": "Isolated insulin with Best, saw it given to the first patient in 1922, and directed medical research in Toronto."
        }
      ],
      "why": "Insulin turned type 1 diabetes from a fatal disease into a manageable condition for millions."
    },
    {
      "slug": "walt-disney-company",
      "name": "The Walt Disney Company",
      "type": "organization",
      "wiki": "The Walt Disney Company",
      "description": "American entertainment company founded by Walt and Roy Disney in 1923, which owns Disney Animation, Pixar, Marvel, Lucasfilm, ABC and ESPN and runs theme parks in the United States, Europe and Asia.",
      "metadata": {
        "founded_date": "1923",
        "headquarters": "Burbank, California, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Studio, parks and media",
          "start": 1923,
          "end": 2026,
          "description": "Produced animated and live-action films, built theme parks and acquired television networks and studios."
        }
      ],
      "why": "Disney is one of the largest media companies and a main exporter of American childhood culture."
    },
    {
      "slug": "umm-kulthum",
      "name": "Umm Kulthum",
      "type": "person",
      "wiki": "Umm Kulthum",
      "description": "Egyptian singer whose monthly live radio concerts from 1934 to 1973 were broadcast across the Arab world.",
      "metadata": {
        "death_date": "1975",
        "nationality": "Egyptian"
      },
      "periods": [
        {
          "label": "Singing career in Cairo",
          "start": 1923,
          "end": 1973,
          "description": "Performed and recorded in Cairo, starred in six films and gave monthly broadcast concerts."
        }
      ],
      "why": "She was the shared voice of Arabic music from Morocco to Iraq; millions attended her funeral in Cairo."
    },
    {
      "slug": "walt-disney",
      "name": "Walt Disney",
      "type": "person",
      "wiki": "Walt Disney",
      "description": "American animator and producer who co-created Mickey Mouse, released Snow White and the Seven Dwarfs in 1937 as the first full-length cel-animated feature film, and opened Disneyland in 1955.",
      "metadata": {
        "birth_date": "1901",
        "death_date": "1966",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Disney studio and parks",
          "start": 1923,
          "end": 1966,
          "description": "Ran the Disney studio, produced animated features and television, and built Disneyland."
        }
      ],
      "why": "He built the animation, merchandising and theme-park model that the Walt Disney Company still runs."
    },
    {
      "slug": "bell-labs",
      "name": "Bell Labs",
      "type": "organization",
      "wiki": "Bell Labs",
      "description": "Research laboratory of AT&T founded in 1925, where researchers invented the transistor, the photovoltaic solar cell, information theory, Unix and the C programming language.",
      "metadata": {
        "founded_date": "1925",
        "headquarters": "Murray Hill, New Jersey, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "AT&T and successor research",
          "start": 1925,
          "end": 2026,
          "description": "Conducted research in physics, electronics, computing and communications for AT&T, Lucent and Nokia."
        }
      ],
      "why": "Its inventions, from the transistor to Unix, are the base of digital electronics and software."
    },
    {
      "slug": "chiang-kai-shek",
      "name": "Chiang Kai-shek",
      "type": "person",
      "wiki": "Chiang Kai-shek",
      "description": "Kuomintang leader who ruled the Republic of China on the mainland, fought Japan and the Communists, and then governed Taiwan from 1949 until his death.",
      "metadata": {
        "birth_date": "1887",
        "nationality": "Chinese",
        "death_date": "1975"
      },
      "periods": [
        {
          "label": "Leader of Nationalist China",
          "start": 1926,
          "end": 1949,
          "description": "Unified China in the Northern Expedition and led it through the war with Japan and the civil war."
        },
        {
          "label": "Ruler of Taiwan",
          "start": 1949,
          "end": 1975,
          "description": "Governed Taiwan under martial law as president of the Republic of China."
        }
      ],
      "why": "He led the world's most populous country for two decades and founded the state that still governs Taiwan."
    },
    {
      "slug": "hirohito",
      "name": "Hirohito",
      "type": "person",
      "wiki": "Hirohito",
      "description": "Emperor of Japan during its expansion across Asia and the Pacific War, who announced Japan's surrender in 1945 and remained on the throne as a constitutional monarch.",
      "metadata": {
        "birth_date": "1901",
        "nationality": "Japanese",
        "death_date": "1989"
      },
      "periods": [
        {
          "label": "Wartime emperor",
          "start": 1926,
          "end": 1945,
          "description": "Reigned over Japan's invasion of China and its war against the Western Allies."
        },
        {
          "label": "Postwar monarch",
          "start": 1945,
          "end": 1989,
          "description": "Renounced divinity and reigned as a symbolic monarch under the postwar constitution."
        }
      ],
      "why": "Japan's wars in Asia were fought in his name, and his surrender ended the Second World War."
    },
    {
      "slug": "john-von-neumann",
      "name": "John von Neumann",
      "type": "person",
      "wiki": "John von Neumann",
      "description": "Hungarian-American mathematician who founded game theory, described the stored-program computer architecture that bears his name, and worked on the atomic and hydrogen bombs.",
      "metadata": {
        "birth_date": "1903",
        "death_date": "1957",
        "nationality": "Hungarian-American"
      },
      "periods": [
        {
          "label": "Mathematics, computing and weapons research",
          "start": 1926,
          "end": 1957,
          "description": "Published foundational work on quantum mechanics, game theory and computer design, and served on the Manhattan Project and the Atomic Energy Commission."
        }
      ],
      "why": "The von Neumann architecture and game theory underpin computing, economics and nuclear strategy."
    },
    {
      "slug": "television",
      "name": "Television",
      "type": "event",
      "wiki": "Television",
      "description": "Technology for transmitting moving images, demonstrated by John Logie Baird in 1926 and in electronic form by Philo Farnsworth in 1927, which became the main mass medium after World War II.",
      "metadata": {
        "start_date": "1926",
        "location": "United Kingdom and United States",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Invention and broadcast era",
          "start": 1926,
          "end": 2026,
          "description": "Broadcast networks spread from Britain and the US to the world, followed by color, cable, satellite and streaming."
        }
      ],
      "why": "Television became the main source of news and entertainment for most of humanity in the late twentieth century."
    },
    {
      "slug": "chinese-civil-war",
      "name": "Chinese Civil War",
      "type": "event",
      "wiki": "Chinese Civil War",
      "description": "War between the Kuomintang-led Republic of China and the Chinese Communist Party that ended in 1949 with the founding of the People's Republic and the Nationalists' retreat to Taiwan.",
      "metadata": {
        "start_date": "1927",
        "location": "China",
        "end_date": "1949",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "First phase",
          "start": 1927,
          "end": 1937,
          "description": "Nationalist purges and encirclement campaigns drove the Communists on the Long March."
        },
        {
          "label": "Final phase",
          "start": 1945,
          "end": 1949,
          "description": "Communist armies defeated the Nationalists after the Japanese surrender."
        }
      ],
      "why": "Its outcome put the world's most populous country under communist rule and created the Taiwan question."
    },
    {
      "slug": "sukarno",
      "name": "Sukarno",
      "type": "person",
      "wiki": "Sukarno",
      "description": "Leader of Indonesia's independence struggle and its first president, who hosted the 1955 Bandung Conference of Asian and African states.",
      "metadata": {
        "birth_date": "1901",
        "nationality": "Indonesian",
        "death_date": "1970"
      },
      "periods": [
        {
          "label": "Independence leader",
          "start": 1927,
          "end": 1949,
          "description": "Founded the Indonesian Nationalist Party and declared independence from the Netherlands in 1945."
        },
        {
          "label": "President of Indonesia",
          "start": 1945,
          "end": 1967,
          "description": "Ruled through Guided Democracy until the army under Suharto took power."
        }
      ],
      "why": "He founded the world's fourth most populous country and led the Asian-African movement that became the Non-Aligned Movement."
    },
    {
      "slug": "mickey-mouse",
      "name": "Mickey Mouse",
      "type": "person",
      "wiki": "Mickey Mouse",
      "description": "Cartoon mouse created by Walt Disney and Ub Iwerks, who debuted in Steamboat Willie in 1928 and became the mascot of the Walt Disney Company.",
      "metadata": {
        "birth_date": "1928",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Disney films, merchandise and parks",
          "start": 1928,
          "end": 2026,
          "description": "Starred in cartoons, comics and television and fronted Disney merchandise and theme parks."
        }
      ],
      "why": "Mickey is one of the most recognized images in the world and the model of character licensing."
    },
    {
      "slug": "muslim-brotherhood",
      "name": "Muslim Brotherhood",
      "type": "organization",
      "wiki": "Muslim Brotherhood",
      "description": "Transnational Sunni Islamist movement founded in Egypt by Hassan al-Banna in 1928, the parent of many Islamist parties and militant offshoots including Hamas.",
      "metadata": {
        "founded_date": "1928",
        "headquarters": "Cairo",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Islamist mass movement",
          "start": 1928,
          "end": 2026,
          "description": "Built a network of branches, charities and parties across the Arab world and briefly governed Egypt in 2012–2013."
        }
      ],
      "why": "It founded modern political Islam and supplied the ideas, including Sayyid Qutb's, behind later jihadist movements."
    },
    {
      "slug": "penicillin",
      "name": "Penicillin",
      "type": "event",
      "wiki": "Penicillin",
      "description": "First antibiotic in wide use, discovered by Alexander Fleming in 1928 and developed into a mass-produced drug by Howard Florey, Ernst Chain and colleagues between 1939 and 1945.",
      "metadata": {
        "start_date": "1928",
        "end_date": "1945",
        "location": "London, Oxford and the United States",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Discovery",
          "start": 1928,
          "end": 1929,
          "description": "Fleming observed that Penicillium mould killed bacteria and published his findings."
        },
        {
          "label": "Development and mass production",
          "start": 1939,
          "end": 1945,
          "description": "Florey and Chain's Oxford team purified penicillin, and US industry mass-produced it for the Allied armies."
        }
      ],
      "why": "Penicillin began the antibiotic era, which made bacterial infections, surgery and childbirth survivable on a mass scale."
    },
    {
      "slug": "wall-street-crash-of-1929",
      "name": "Wall Street crash of 1929",
      "type": "event",
      "wiki": "Wall Street crash of 1929",
      "description": "Collapse of share prices on the New York Stock Exchange in late October 1929, which began a fall of 89 percent in the Dow Jones Industrial Average by July 1932.",
      "metadata": {
        "start_date": "1929",
        "end_date": "1929",
        "location": "New York City, United States",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Crash",
          "start": 1929,
          "end": 1929,
          "description": "Panic selling on Black Thursday, 24 October, and Black Tuesday, 29 October, wiped out share values."
        }
      ],
      "why": "The crash opened the Great Depression, which brought mass unemployment worldwide and aided the rise of fascism."
    },
    {
      "slug": "george-orwell",
      "name": "George Orwell",
      "type": "person",
      "wiki": "George Orwell",
      "description": "British writer whose novels Animal Farm (1945) and Nineteen Eighty-Four (1949) depicted totalitarian rule, surveillance and propaganda.",
      "metadata": {
        "birth_date": "1903",
        "death_date": "1950",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Writing career",
          "start": 1933,
          "end": 1950,
          "description": "Wrote reportage, essays and novels, and fought for the Republic in the Spanish Civil War."
        }
      ],
      "why": "Big Brother, doublethink and Orwellian became common vocabulary for state power worldwide."
    },
    {
      "slug": "francisco-franco",
      "name": "Francisco Franco",
      "type": "person",
      "wiki": "Francisco Franco",
      "description": "Spanish general who led the Nationalist side to victory in the Spanish Civil War and ruled Spain as dictator until his death in 1975.",
      "metadata": {
        "birth_date": "1892",
        "nationality": "Spanish",
        "death_date": "1975"
      },
      "periods": [
        {
          "label": "Spanish Civil War",
          "start": 1936,
          "end": 1939,
          "description": "Led the military uprising and the Nationalist armies against the Republic."
        },
        {
          "label": "Dictator of Spain",
          "start": 1939,
          "end": 1975,
          "description": "Ruled Spain as Caudillo through a single-party state and political repression."
        }
      ],
      "why": "He ruled Spain from 1939 until his death in 1975, and the memory of his regime still divides Spanish politics."
    },
    {
      "slug": "spanish-civil-war",
      "name": "Spanish Civil War",
      "type": "event",
      "wiki": "Spanish Civil War",
      "description": "War in which Francisco Franco's Nationalists, backed by Nazi Germany and Fascist Italy, defeated the Soviet-aided Republic and established a dictatorship that lasted until 1975.",
      "metadata": {
        "start_date": "1936",
        "location": "Spain",
        "end_date": "1939",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Civil war",
          "start": 1936,
          "end": 1939,
          "description": "Nationalist and Republican forces fought a war that included the bombing of Guernica and drew international volunteers."
        }
      ],
      "why": "It was the rehearsal for the Second World War and a defining cause for the international left and right."
    },
    {
      "slug": "claude-shannon",
      "name": "Claude Shannon",
      "type": "person",
      "wiki": "Claude Shannon",
      "description": "American mathematician and Bell Labs engineer whose 1948 paper A Mathematical Theory of Communication founded information theory and made the bit the unit of information.",
      "metadata": {
        "birth_date": "1916",
        "death_date": "2001",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Switching circuits and information theory",
          "start": 1937,
          "end": 1956,
          "description": "Showed that Boolean logic can design relay circuits and set out the limits of reliable data transmission."
        }
      ],
      "why": "Information theory is the mathematics behind digital communication, data compression and the internet."
    },
    {
      "slug": "second-sino-japanese-war",
      "name": "Second Sino-Japanese War",
      "type": "event",
      "wiki": "Second Sino-Japanese War",
      "description": "War between China and the Empire of Japan, from the Marco Polo Bridge Incident to Japan's surrender, that killed millions of Chinese and included the Nanjing Massacre.",
      "metadata": {
        "start_date": "1937",
        "location": "China",
        "end_date": "1945",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Full-scale war",
          "start": 1937,
          "end": 1945,
          "description": "Japan occupied eastern China while Nationalist and Communist forces resisted."
        }
      ],
      "why": "It was the largest Asian war of the twentieth century and weakened the Nationalists enough for the Communists to win."
    },
    {
      "slug": "toyota",
      "name": "Toyota",
      "type": "organization",
      "wiki": "Toyota",
      "description": "Japanese automaker founded by Kiichiro Toyoda in 1937, whose Toyota Production System of just-in-time and lean manufacturing was copied across world industry.",
      "metadata": {
        "founded_date": "1937",
        "headquarters": "Toyota City, Aichi, Japan",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Automobile manufacturing",
          "start": 1937,
          "end": 2026,
          "description": "Built cars and trucks, developed the Toyota Production System and launched the Prius hybrid in 1997."
        }
      ],
      "why": "Lean manufacturing reshaped global industry, and Toyota became the largest automaker by sales."
    },
    {
      "slug": "nuclear-fission",
      "name": "Nuclear fission",
      "type": "event",
      "wiki": "Nuclear fission",
      "description": "Splitting of heavy atomic nuclei with a release of energy, discovered by Otto Hahn and Fritz Strassmann in Berlin in December 1938 and explained by Lise Meitner and Otto Frisch in 1939.",
      "metadata": {
        "start_date": "1938",
        "end_date": "1939",
        "location": "Berlin, Stockholm and Copenhagen",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Discovery and explanation",
          "start": 1938,
          "end": 1939,
          "description": "Hahn and Strassmann detected barium from bombarded uranium, and Meitner and Frisch explained it as a split nucleus."
        }
      ],
      "why": "Fission made the atomic bomb and nuclear power possible."
    },
    {
      "slug": "samsung",
      "name": "Samsung",
      "type": "organization",
      "wiki": "Samsung",
      "description": "South Korean conglomerate founded by Lee Byung-chul in 1938, whose Samsung Electronics is the largest maker of memory chips and a top seller of smartphones and televisions.",
      "metadata": {
        "founded_date": "1938",
        "headquarters": "Seoul, South Korea",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Trading, industry and electronics",
          "start": 1938,
          "end": 2026,
          "description": "Grew from a Daegu trading company into electronics, shipbuilding, construction and insurance."
        }
      ],
      "why": "Samsung drove South Korea's industrialization and supplies much of the world's memory chips and phones."
    },
    {
      "slug": "superman",
      "name": "Superman",
      "type": "person",
      "wiki": "Superman",
      "description": "Comic-book superhero created by Jerry Siegel and Joe Shuster, who first appeared in Action Comics #1 in 1938 and began the superhero genre.",
      "metadata": {
        "birth_date": "1938",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Comics, radio, film and television",
          "start": 1938,
          "end": 2026,
          "description": "Appeared in DC comics, radio serials, cartoons, television series and feature films."
        }
      ],
      "why": "The superhero genre he started became the dominant form of twenty-first-century blockbuster cinema."
    },
    {
      "slug": "charles-de-gaulle",
      "name": "Charles de Gaulle",
      "type": "person",
      "wiki": "Charles de Gaulle",
      "description": "French general who led the Free French in the Second World War and founded the Fifth Republic, which he ruled as president from 1959 to 1969.",
      "metadata": {
        "birth_date": "1890",
        "nationality": "French",
        "death_date": "1970"
      },
      "periods": [
        {
          "label": "Free France",
          "start": 1940,
          "end": 1946,
          "description": "Led the Free French Forces from London and headed the provisional government after liberation."
        },
        {
          "label": "Fifth Republic",
          "start": 1958,
          "end": 1969,
          "description": "Wrote the Fifth Republic's constitution, ended the Algerian War and built France's independent nuclear force."
        }
      ],
      "why": "He restored France as a great power and wrote the constitution under which it is still governed."
    },
    {
      "slug": "mcdonalds",
      "name": "McDonald's",
      "type": "organization",
      "wiki": "McDonald's",
      "description": "American fast-food chain founded by Richard and Maurice McDonald in 1940 and expanded by franchising under Ray Kroc from 1955, with over 40,000 restaurants in over 100 countries.",
      "metadata": {
        "founded_date": "1940",
        "headquarters": "Chicago, Illinois, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Fast-food franchising",
          "start": 1940,
          "end": 2026,
          "description": "Ran and franchised restaurants using the standardized Speedee Service System."
        }
      ],
      "why": "McDonald's industrialized food service and became the emblem of globalization and fast-food diets."
    },
    {
      "slug": "winston-churchill",
      "name": "Winston Churchill",
      "type": "person",
      "wiki": "Winston Churchill",
      "description": "British prime minister who led the United Kingdom through the Second World War against Nazi Germany and warned of the Soviet Iron Curtain in 1946.",
      "metadata": {
        "birth_date": "1874",
        "nationality": "British",
        "death_date": "1965"
      },
      "periods": [
        {
          "label": "Wartime prime minister",
          "start": 1940,
          "end": 1945,
          "description": "Led Britain's war cabinet from the fall of France to victory in Europe."
        },
        {
          "label": "Second premiership",
          "start": 1951,
          "end": 1955,
          "description": "Returned as prime minister during the early Cold War and the end of empire."
        }
      ],
      "why": "Britain's refusal to make peace in 1940 under his leadership kept the war against Hitler alive until the US and USSR joined."
    },
    {
      "slug": "anne-frank",
      "name": "Anne Frank",
      "type": "person",
      "wiki": "Anne Frank",
      "description": "German-born Jewish diarist who hid from the Nazis in Amsterdam from 1942 to 1944 and died in Bergen-Belsen; her diary was published in 1947.",
      "metadata": {
        "birth_date": "1929",
        "death_date": "1945",
        "nationality": "German"
      },
      "periods": [
        {
          "label": "Diary in hiding",
          "start": 1942,
          "end": 1944,
          "description": "Wrote her diary in the Secret Annex in Amsterdam until her arrest in August 1944."
        }
      ],
      "why": "Translated into over 70 languages, her diary is for millions of readers their first encounter with the Holocaust."
    },
    {
      "slug": "lata-mangeshkar",
      "name": "Lata Mangeshkar",
      "type": "person",
      "wiki": "Lata Mangeshkar",
      "description": "Indian playback singer who recorded songs for more than a thousand Hindi films over seven decades.",
      "metadata": {
        "birth_date": "1929",
        "death_date": "2022",
        "nationality": "Indian"
      },
      "periods": [
        {
          "label": "Playback singing career",
          "start": 1942,
          "end": 2019,
          "description": "Recorded film songs in Hindi, Marathi, Bengali and other Indian languages."
        }
      ],
      "why": "Her voice was the sound of Hindi cinema for South Asia and its diaspora for seventy years."
    },
    {
      "slug": "simone-de-beauvoir",
      "name": "Simone de Beauvoir",
      "type": "person",
      "wiki": "Simone de Beauvoir",
      "description": "French philosopher and writer whose The Second Sex (1949) analyzed the subordination of women and became a founding text of second-wave feminism.",
      "metadata": {
        "birth_date": "1908",
        "death_date": "1986",
        "nationality": "French"
      },
      "periods": [
        {
          "label": "Writing and activism",
          "start": 1943,
          "end": 1986,
          "description": "Wrote novels, philosophy and memoirs in Paris and campaigned for abortion rights in France."
        }
      ],
      "why": "The Second Sex gave the women's movement of the 1960s and 1970s its theoretical base."
    },
    {
      "slug": "bretton-woods-system",
      "name": "Bretton Woods system",
      "type": "event",
      "wiki": "Bretton Woods system",
      "description": "Postwar international monetary order agreed in 1944 that pegged currencies to the US dollar and the dollar to gold, and created the IMF and the World Bank, until the US ended gold convertibility in 1971.",
      "metadata": {
        "start_date": "1944",
        "location": "Bretton Woods, New Hampshire",
        "end_date": "1971",
        "event_type": "treaty"
      },
      "periods": [
        {
          "label": "Fixed exchange rates",
          "start": 1944,
          "end": 1971,
          "description": "Governed exchange rates and capital flows among Western economies."
        }
      ],
      "why": "It made the dollar the world's reserve currency and framed the postwar boom."
    },
    {
      "slug": "green-revolution",
      "name": "Green Revolution",
      "type": "event",
      "wiki": "Green Revolution",
      "description": "Spread of high-yield crop varieties, synthetic fertilizer, irrigation and pesticides to developing countries, during which Asia's cereal production doubled between 1970 and 1995.",
      "metadata": {
        "start_date": "1944",
        "end_date": "1985",
        "location": "Mexico, South Asia, Southeast Asia and Latin America",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Mexican wheat program",
          "start": 1944,
          "end": 1964,
          "description": "Rockefeller Foundation researchers in Mexico bred high-yield, disease-resistant wheat."
        },
        {
          "label": "Adoption across Asia",
          "start": 1965,
          "end": 1985,
          "description": "India, Pakistan, the Philippines and other countries planted new wheat and rice varieties with fertilizer and irrigation."
        }
      ],
      "why": "It averted famine in South Asia and fed the late twentieth-century population boom, at a cost in soil, water and pesticide damage."
    },
    {
      "slug": "norman-borlaug",
      "name": "Norman Borlaug",
      "type": "person",
      "wiki": "Norman Borlaug",
      "description": "American agronomist who bred high-yield, disease-resistant semi-dwarf wheat in Mexico and introduced it to India and Pakistan in the 1960s.",
      "metadata": {
        "birth_date": "1914",
        "death_date": "2009",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Wheat breeding in Mexico and South Asia",
          "start": 1944,
          "end": 1979,
          "description": "Led the Rockefeller Foundation's wheat program in Mexico and its successor CIMMYT, and organized seed shipments to South Asia."
        }
      ],
      "why": "His wheat drove the Green Revolution that averted famine in South Asia; he won the 1970 Nobel Peace Prize."
    },
    {
      "slug": "harry-s-truman",
      "name": "Harry S. Truman",
      "type": "person",
      "wiki": "Harry S. Truman",
      "description": "US president who ordered the atomic bombings of Japan and launched the containment of the Soviet Union through the Truman Doctrine, the Marshall Plan and NATO.",
      "metadata": {
        "birth_date": "1884",
        "nationality": "American",
        "death_date": "1972"
      },
      "periods": [
        {
          "label": "President of the United States",
          "start": 1945,
          "end": 1953,
          "description": "Ended the Second World War, founded the Cold War alliance system and fought the Korean War."
        }
      ],
      "why": "He set the structure of the Cold War and of American global power that followed the Second World War."
    },
    {
      "slug": "international-monetary-fund",
      "name": "International Monetary Fund",
      "type": "organization",
      "wiki": "International Monetary Fund",
      "description": "Global financial institution created at Bretton Woods in 1944 that lends to countries in balance-of-payments crises, on condition of economic reforms.",
      "metadata": {
        "founded_date": "1944",
        "headquarters": "Washington, D.C.",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Lender of last resort",
          "start": 1945,
          "end": 2026,
          "description": "Policed fixed exchange rates and later imposed structural adjustment in Latin America, Africa, Asia and Europe."
        }
      ],
      "why": "Its loan conditions have set the economic policies of dozens of governments in crisis."
    },
    {
      "slug": "nuremberg-trials",
      "name": "Nuremberg trials",
      "type": "event",
      "wiki": "Nuremberg trials",
      "description": "Military tribunals held by the Allies in which leading Nazis were tried for crimes against peace, war crimes and crimes against humanity, founding modern international criminal law.",
      "metadata": {
        "start_date": "1945",
        "location": "Nuremberg, Germany",
        "end_date": "1949"
      },
      "periods": [
        {
          "label": "Tribunals",
          "start": 1945,
          "end": 1949,
          "description": "The International Military Tribunal tried 22 leading Nazis, followed by twelve subsequent trials."
        }
      ],
      "why": "It established that leaders can be held personally responsible for atrocities under international law."
    },
    {
      "slug": "ruth-handler",
      "name": "Ruth Handler",
      "type": "person",
      "wiki": "Ruth Handler",
      "description": "American businesswoman who co-founded the toy company Mattel in 1945 and created the Barbie doll, launched in 1959.",
      "metadata": {
        "birth_date": "1916",
        "death_date": "2002",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Mattel",
          "start": 1945,
          "end": 1975,
          "description": "Ran Mattel with her husband Elliot Handler and directed the launch and marketing of Barbie."
        }
      ],
      "why": "Barbie, her creation, became the best-selling doll in history and set the model for marketing toys to children on television."
    },
    {
      "slug": "eva-peron",
      "name": "Eva Perón",
      "type": "person",
      "wiki": "Eva Perón",
      "description": "First Lady of Argentina who led the Peronist Women's Party, campaigned for the women's suffrage law of 1947, and became the central figure of Peronist devotion.",
      "metadata": {
        "birth_date": "1919",
        "nationality": "Argentine",
        "death_date": "1952"
      },
      "periods": [
        {
          "label": "First Lady of Argentina",
          "start": 1946,
          "end": 1952,
          "description": "Ran the Eva Perón Foundation and organised millions of women into the Peronist movement."
        }
      ],
      "why": "She brought working-class women into Argentine politics and remains the most revered figure of Peronism."
    },
    {
      "slug": "juan-peron",
      "name": "Juan Perón",
      "type": "person",
      "wiki": "Juan Perón",
      "description": "Three-time president of Argentina whose labour-based nationalist movement, Peronism, has dominated Argentine politics since the 1940s.",
      "metadata": {
        "birth_date": "1895",
        "nationality": "Argentine",
        "death_date": "1974"
      },
      "periods": [
        {
          "label": "First presidency",
          "start": 1946,
          "end": 1955,
          "description": "Expanded workers' rights, nationalised industries and built the Peronist movement before a coup ousted him."
        },
        {
          "label": "Return to power",
          "start": 1973,
          "end": 1974,
          "description": "Returned from exile and won a third term before his death."
        }
      ],
      "why": "Peronism is the template for Latin American populism and still shapes Argentina."
    },
    {
      "slug": "milton-friedman",
      "name": "Milton Friedman",
      "type": "person",
      "wiki": "Milton Friedman",
      "description": "American economist whose monetarism and free-market advocacy shaped the economic policies of Reagan, Thatcher and Chile's military government.",
      "metadata": {
        "birth_date": "1912",
        "nationality": "American",
        "death_date": "2006"
      },
      "periods": [
        {
          "label": "Chicago School economist",
          "start": 1946,
          "end": 1977,
          "description": "Developed monetarism at the University of Chicago and won the 1976 Nobel Prize in economics."
        }
      ],
      "why": "He supplied the economic doctrine of the neoliberal turn that remade policy worldwide after 1979."
    },
    {
      "slug": "unicef",
      "name": "UNICEF",
      "type": "organization",
      "wiki": "UNICEF",
      "description": "United Nations agency founded in 1946 to aid children after World War II, which buys and delivers vaccines for 45 percent of the world's children under five.",
      "metadata": {
        "founded_date": "1946",
        "headquarters": "New York City, United States",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Child health and welfare",
          "start": 1946,
          "end": 2026,
          "description": "Ran immunization, nutrition, oral rehydration and education programs in over 190 countries and territories."
        }
      ],
      "why": "UNICEF's immunization and child-survival campaigns helped cut deaths of children under five by more than half since 1990."
    },
    {
      "slug": "central-intelligence-agency",
      "name": "Central Intelligence Agency",
      "type": "organization",
      "wiki": "Central Intelligence Agency",
      "description": "Foreign intelligence agency of the United States, which carried out espionage and covert operations including the coups in Iran in 1953 and Guatemala in 1954.",
      "metadata": {
        "founded_date": "1947",
        "headquarters": "Langley, Virginia",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Cold War covert action",
          "start": 1947,
          "end": 1991,
          "description": "Ran coups, paramilitary wars and espionage against the Soviet bloc and leftist governments."
        },
        {
          "label": "Counterterrorism era",
          "start": 1991,
          "end": 2026,
          "description": "Ran rendition, drone strikes and intelligence operations in the War on Terror."
        }
      ],
      "why": "Its covert operations changed governments on four continents during the Cold War."
    },
    {
      "slug": "gabriel-garcia-marquez",
      "name": "Gabriel García Márquez",
      "type": "person",
      "wiki": "Gabriel García Márquez",
      "description": "Colombian novelist and journalist whose One Hundred Years of Solitude (1967) made magic realism and the Latin American Boom known worldwide.",
      "metadata": {
        "birth_date": "1927",
        "death_date": "2014",
        "nationality": "Colombian"
      },
      "periods": [
        {
          "label": "Writing and journalism career",
          "start": 1947,
          "end": 2004,
          "description": "Wrote novels, stories and journalism in Colombia, Mexico and Spain."
        }
      ],
      "why": "He put Latin American literature before a world readership and won the 1982 Nobel Prize in Literature."
    },
    {
      "slug": "jonas-salk",
      "name": "Jonas Salk",
      "type": "person",
      "wiki": "Jonas Salk",
      "description": "American virologist who developed the first effective polio vaccine, an injected inactivated vaccine licensed in 1955 after a field trial involving 1.8 million children.",
      "metadata": {
        "birth_date": "1914",
        "death_date": "1995",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Polio vaccine research in Pittsburgh",
          "start": 1947,
          "end": 1955,
          "description": "Developed and tested the inactivated polio vaccine at the University of Pittsburgh."
        },
        {
          "label": "Salk Institute",
          "start": 1960,
          "end": 1995,
          "description": "Founded and led the Salk Institute for Biological Studies in La Jolla."
        }
      ],
      "why": "His vaccine ended the polio epidemics that paralyzed tens of thousands of American children a year."
    },
    {
      "slug": "kwame-nkrumah",
      "name": "Kwame Nkrumah",
      "type": "person",
      "wiki": "Kwame Nkrumah",
      "description": "Leader who took the Gold Coast to independence as Ghana in 1957 and championed Pan-Africanism and the decolonisation of the continent.",
      "metadata": {
        "birth_date": "1909",
        "nationality": "Ghanaian",
        "death_date": "1972"
      },
      "periods": [
        {
          "label": "Independence campaign",
          "start": 1947,
          "end": 1957,
          "description": "Founded the Convention People's Party and led mass campaigns against British rule."
        },
        {
          "label": "Leader of Ghana",
          "start": 1957,
          "end": 1966,
          "description": "Governed Ghana as prime minister and president and helped found the Organisation of African Unity."
        }
      ],
      "why": "Ghana's independence under him opened the wave that freed most of Africa from colonial rule."
    },
    {
      "slug": "partition-of-india",
      "name": "Partition of India",
      "type": "event",
      "wiki": "Partition of India",
      "description": "Division of British India in 1947 into the independent dominions of India and Pakistan, which displaced between 10 and 20 million people and killed hundreds of thousands in communal violence.",
      "metadata": {
        "start_date": "1947",
        "location": "British India",
        "end_date": "1947"
      },
      "periods": [
        {
          "label": "Partition and migration",
          "start": 1947,
          "end": 1948,
          "description": "Boundary commissions split Punjab and Bengal, and mass migration and massacres followed."
        }
      ],
      "why": "It created the India–Pakistan rivalry, the Kashmir conflict and one of the largest migrations in history."
    },
    {
      "slug": "transistor",
      "name": "Transistor",
      "type": "event",
      "wiki": "Transistor",
      "description": "Semiconductor device for amplifying and switching electrical signals, invented at Bell Labs by John Bardeen, Walter Brattain and William Shockley in 1947.",
      "metadata": {
        "start_date": "1947",
        "end_date": "1948",
        "location": "Murray Hill, New Jersey, United States",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Invention",
          "start": 1947,
          "end": 1948,
          "description": "Bardeen and Brattain built the point-contact transistor in December 1947 and Shockley designed the junction transistor in 1948."
        }
      ],
      "why": "The transistor is the most manufactured device in history and the building block of digital electronics."
    },
    {
      "slug": "apartheid",
      "name": "Apartheid",
      "type": "event",
      "wiki": "Apartheid",
      "description": "System of legislated racial segregation and white minority rule imposed by South Africa's National Party government from 1948 until the first universal-suffrage elections in 1994.",
      "metadata": {
        "start_date": "1948",
        "location": "South Africa",
        "end_date": "1994"
      },
      "periods": [
        {
          "label": "Apartheid state",
          "start": 1948,
          "end": 1994,
          "description": "Classified South Africans by race, removed millions from their homes and banned Black political organisations."
        }
      ],
      "why": "Its rule and its defeat made South Africa a central cause of postwar human rights politics."
    },
    {
      "slug": "israel",
      "name": "Israel",
      "type": "organization",
      "wiki": "Israel",
      "description": "Jewish state proclaimed in 1948 in the former British Mandate of Palestine, whose wars with Arab states and conflict with the Palestinians have shaped Middle Eastern politics since.",
      "metadata": {
        "founded_date": "1948",
        "headquarters": "Jerusalem",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "State of Israel",
          "start": 1948,
          "end": 2026,
          "description": "Fought wars in 1948, 1956, 1967, 1973 and after, absorbed Jewish refugees and occupied the West Bank and Gaza."
        }
      ],
      "why": "It is the first Jewish state in two millennia and the centre of the Middle East's longest-running conflict."
    },
    {
      "slug": "kim-il-sung",
      "name": "Kim Il Sung",
      "type": "person",
      "wiki": "Kim Il Sung",
      "description": "Founder of North Korea who launched the Korean War in 1950 and established the hereditary dictatorship still ruled by his family.",
      "metadata": {
        "birth_date": "1912",
        "nationality": "Korean",
        "death_date": "1994"
      },
      "periods": [
        {
          "label": "Ruler of North Korea",
          "start": 1948,
          "end": 1994,
          "description": "Invaded South Korea, built a personality cult and the Juche state ideology."
        }
      ],
      "why": "He founded the Korean division and the hereditary nuclear-armed state that still threaten war in East Asia."
    },
    {
      "slug": "marshall-plan",
      "name": "Marshall Plan",
      "type": "event",
      "wiki": "Marshall Plan",
      "description": "US programme that gave more than 13 billion dollars in aid to rebuild Western European economies after the Second World War.",
      "metadata": {
        "start_date": "1948",
        "location": "Western Europe",
        "end_date": "1952"
      },
      "periods": [
        {
          "label": "European Recovery Program",
          "start": 1948,
          "end": 1952,
          "description": "Transferred grants and loans to Western European countries through the European Recovery Program."
        }
      ],
      "why": "It rebuilt Western Europe, anchored it to the United States and started European economic integration."
    },
    {
      "slug": "world-trade-organization",
      "name": "World Trade Organization",
      "type": "organization",
      "wiki": "World Trade Organization",
      "description": "Intergovernmental body that sets and enforces the rules of international trade, succeeding the 1947 General Agreement on Tariffs and Trade in 1995.",
      "metadata": {
        "founded_date": "1995",
        "headquarters": "Geneva",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "GATT rounds",
          "start": 1948,
          "end": 1994,
          "description": "Cut tariffs among member states through successive negotiating rounds."
        },
        {
          "label": "World Trade Organization",
          "start": 1995,
          "end": 2026,
          "description": "Ruled on trade disputes and admitted China in 2001."
        }
      ],
      "why": "Its trade rules underpinned the globalisation of manufacturing after 1995."
    },
    {
      "slug": "francis-crick",
      "name": "Francis Crick",
      "type": "person",
      "wiki": "Francis Crick",
      "description": "British molecular biologist who with James Watson proposed the double-helix structure of DNA in 1953 and then worked out how DNA's triplet code specifies proteins.",
      "metadata": {
        "birth_date": "1916",
        "death_date": "2004",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Molecular biology at Cambridge",
          "start": 1949,
          "end": 1976,
          "description": "Co-proposed the DNA double helix, stated the central dogma and helped decipher the genetic code."
        },
        {
          "label": "Neuroscience at the Salk Institute",
          "start": 1976,
          "end": 2004,
          "description": "Researched the neural basis of consciousness in California."
        }
      ],
      "why": "The double helix founded molecular biology, the base of modern genetics, biotechnology and DNA forensics."
    },
    {
      "slug": "nato",
      "name": "NATO",
      "type": "organization",
      "wiki": "NATO",
      "description": "Military alliance founded in 1949 by the United States, Canada and Western European states for collective defence against the Soviet Union, which has since grown to 32 members.",
      "metadata": {
        "founded_date": "1949",
        "headquarters": "Brussels",
        "organization_type": "military"
      },
      "periods": [
        {
          "label": "Cold War alliance",
          "start": 1949,
          "end": 1991,
          "description": "Deterred the Soviet Union in Europe under the US nuclear umbrella."
        },
        {
          "label": "Post-Cold War expansion",
          "start": 1991,
          "end": 2026,
          "description": "Expanded into Central and Eastern Europe and fought in the Balkans, Afghanistan and Libya."
        }
      ],
      "why": "It is the most powerful military alliance in history and the backbone of Western security since 1949."
    },
    {
      "slug": "korean-war",
      "name": "Korean War",
      "type": "event",
      "wiki": "Korean War",
      "description": "War in which North Korea, backed by China and the Soviet Union, fought South Korea and a US-led United Nations force, ending in an armistice that left the peninsula divided.",
      "metadata": {
        "start_date": "1950",
        "location": "Korea",
        "end_date": "1953",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Korean War",
          "start": 1950,
          "end": 1953,
          "description": "Fighting swept the length of the peninsula and settled at the 38th parallel."
        }
      ],
      "why": "It militarised the Cold War worldwide and fixed the division of Korea that persists today."
    },
    {
      "slug": "mother-teresa",
      "name": "Mother Teresa",
      "type": "person",
      "wiki": "Mother Teresa",
      "description": "Albanian-Indian Catholic nun who founded the Missionaries of Charity to care for the destitute and dying.",
      "metadata": {
        "birth_date": "1910",
        "death_date": "1997",
        "nationality": "Albanian-Indian"
      },
      "periods": [
        {
          "label": "Missionaries of Charity",
          "start": 1950,
          "end": 1997,
          "description": "She founded and led the Missionaries of Charity in Kolkata and abroad, and won the 1979 Nobel Peace Prize."
        }
      ],
      "why": "The twentieth century's most famous symbol of charity, and a figure of sharp debate over the care her homes gave."
    },
    {
      "slug": "combined-oral-contraceptive-pill",
      "name": "Combined oral contraceptive pill",
      "type": "event",
      "wiki": "Combined oral contraceptive pill",
      "description": "Hormonal oral contraceptive developed by Gregory Pincus, John Rock and Min Chueh Chang with funding from Katharine McCormick, approved in the United States in 1960.",
      "metadata": {
        "start_date": "1951",
        "end_date": "1960",
        "location": "Shrewsbury, Massachusetts and Puerto Rico",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Research, trials and approval",
          "start": 1951,
          "end": 1960,
          "description": "Pincus and Chang developed the pill at the Worcester Foundation, Rock ran trials in Massachusetts and Puerto Rico, and the FDA approved Enovid."
        }
      ],
      "why": "The pill gave women reliable control of fertility, changing sexuality, marriage, education and women's work."
    },
    {
      "slug": "decolonisation-of-africa",
      "name": "Decolonisation of Africa",
      "type": "event",
      "wiki": "Decolonisation of Africa",
      "description": "Process in which Africa's European colonies won independence, most of them between 1956 and 1975.",
      "metadata": {
        "start_date": "1951",
        "location": "Africa",
        "end_date": "1980",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Independence wave",
          "start": 1951,
          "end": 1980,
          "description": "Colonies from Libya to Zimbabwe became sovereign states through negotiation or war."
        }
      ],
      "why": "It created dozens of new states and shifted the balance of the United Nations General Assembly."
    },
    {
      "slug": "european-union",
      "name": "European Union",
      "type": "organization",
      "wiki": "European Union",
      "description": "Political and economic union of 27 European states that grew from the 1951 Coal and Steel Community into a single market and, for most members, a shared currency.",
      "metadata": {
        "founded_date": "1993",
        "headquarters": "Brussels",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "European Communities",
          "start": 1951,
          "end": 1993,
          "description": "Integrated coal, steel and then a common market among former wartime enemies."
        },
        {
          "label": "European Union",
          "start": 1993,
          "end": 2026,
          "description": "Created the euro, enlarged eastward and set regulations followed worldwide."
        }
      ],
      "why": "It ended war among Europe's great powers and is the largest single market and regulatory power in the world."
    },
    {
      "slug": "rachel-carson",
      "name": "Rachel Carson",
      "type": "person",
      "wiki": "Rachel Carson",
      "description": "American marine biologist whose 1962 book Silent Spring documented the effects of synthetic pesticides such as DDT on wildlife and people.",
      "metadata": {
        "birth_date": "1907",
        "death_date": "1964",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Writing on the sea and pesticides",
          "start": 1951,
          "end": 1964,
          "description": "Published The Sea Around Us and Silent Spring, and testified to the US Congress on pesticide regulation."
        }
      ],
      "why": "Silent Spring launched the modern environmental movement and led to the US DDT ban and the Environmental Protection Agency."
    },
    {
      "slug": "rosalind-franklin",
      "name": "Rosalind Franklin",
      "type": "person",
      "wiki": "Rosalind Franklin",
      "description": "British chemist whose X-ray diffraction images of DNA, including Photo 51, supplied the evidence for the double-helix structure published in 1953.",
      "metadata": {
        "birth_date": "1920",
        "death_date": "1958",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "X-ray crystallography at King's College and Birkbeck",
          "start": 1951,
          "end": 1958,
          "description": "Produced X-ray images of DNA fibers, then mapped the structure of tobacco mosaic virus and poliovirus."
        }
      ],
      "why": "Her data made the DNA structure solvable, and her case changed how science credits women."
    },
    {
      "slug": "gamal-abdel-nasser",
      "name": "Gamal Abdel Nasser",
      "type": "person",
      "wiki": "Gamal Abdel Nasser",
      "description": "President of Egypt who nationalised the Suez Canal in 1956 and led the pan-Arab nationalist movement across the Middle East.",
      "metadata": {
        "birth_date": "1918",
        "nationality": "Egyptian",
        "death_date": "1970"
      },
      "periods": [
        {
          "label": "Free Officers coup",
          "start": 1952,
          "end": 1954,
          "description": "Led the army officers who overthrew King Farouk and ended the monarchy."
        },
        {
          "label": "President of Egypt",
          "start": 1954,
          "end": 1970,
          "description": "Nationalised the Suez Canal, built the Aswan High Dam and fought Israel in 1967."
        }
      ],
      "why": "He defined Arab nationalism and the anticolonial politics of the Middle East for a generation."
    },
    {
      "slug": "ian-fleming",
      "name": "Ian Fleming",
      "type": "person",
      "wiki": "Ian Fleming",
      "description": "British writer and former naval intelligence officer who created James Bond in Casino Royale (1953) and wrote twelve Bond novels.",
      "metadata": {
        "birth_date": "1908",
        "death_date": "1964",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Bond novels",
          "start": 1952,
          "end": 1964,
          "description": "Wrote the James Bond novels and short stories in Jamaica and England."
        }
      ],
      "why": "His James Bond became one of the longest-running film franchises and the template of the spy thriller."
    },
    {
      "slug": "malcolm-x",
      "name": "Malcolm X",
      "type": "person",
      "wiki": "Malcolm X",
      "description": "African American Muslim minister and Black nationalist who became the leading voice of the Nation of Islam before breaking with it, and was assassinated in 1965.",
      "metadata": {
        "birth_date": "1925",
        "nationality": "American",
        "death_date": "1965"
      },
      "periods": [
        {
          "label": "Nation of Islam and after",
          "start": 1952,
          "end": 1965,
          "description": "Preached Black self-defence and separatism, then founded the Organization of Afro-American Unity."
        }
      ],
      "why": "His ideas founded the Black Power movement and shaped Black politics and identity worldwide."
    },
    {
      "slug": "polio-vaccine",
      "name": "Polio vaccine",
      "type": "event",
      "wiki": "Polio vaccine",
      "description": "Vaccines against poliomyelitis: Jonas Salk's injected inactivated vaccine, licensed in 1955, and Albert Sabin's oral live vaccine, licensed in 1961.",
      "metadata": {
        "start_date": "1952",
        "end_date": "1962",
        "location": "United States",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Development and licensing",
          "start": 1952,
          "end": 1962,
          "description": "Salk and Sabin developed, trialed and licensed the two vaccines."
        }
      ],
      "why": "The vaccines have cut polio cases by over 99 percent since 1988 and brought the disease to the edge of eradication."
    },
    {
      "slug": "cuban-revolution",
      "name": "Cuban Revolution",
      "type": "event",
      "wiki": "Cuban Revolution",
      "description": "Armed revolt led by Fidel Castro's 26th of July Movement that overthrew Fulgencio Batista in 1959 and made Cuba the first communist state in the Western Hemisphere.",
      "metadata": {
        "start_date": "1953",
        "location": "Cuba",
        "end_date": "1959",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Revolution",
          "start": 1953,
          "end": 1959,
          "description": "Guerrillas in the Sierra Maestra and urban resistance brought down the Batista government."
        }
      ],
      "why": "It brought Soviet power to the Americas and inspired guerrilla movements across Latin America."
    },
    {
      "slug": "fidel-castro",
      "name": "Fidel Castro",
      "type": "person",
      "wiki": "Fidel Castro",
      "description": "Cuban revolutionary who overthrew Fulgencio Batista in 1959 and ruled Cuba as a one-party communist state until 2008.",
      "metadata": {
        "birth_date": "1926",
        "nationality": "Cuban",
        "death_date": "2016"
      },
      "periods": [
        {
          "label": "Revolutionary insurgency",
          "start": 1953,
          "end": 1959,
          "description": "Led the Moncada attack and the guerrilla war in the Sierra Maestra."
        },
        {
          "label": "Ruler of Cuba",
          "start": 1959,
          "end": 2008,
          "description": "Allied Cuba with the Soviet Union and sent Cuban forces to wars in Africa."
        }
      ],
      "why": "He brought the Cold War to the Western Hemisphere and inspired revolutionary movements across Latin America and Africa."
    },
    {
      "slug": "james-bond",
      "name": "James Bond",
      "type": "person",
      "wiki": "James Bond",
      "description": "Fictional British secret agent created by Ian Fleming in 1953, the hero of twelve novels and twenty-five Eon Productions films since Dr. No (1962).",
      "metadata": {
        "birth_date": "1953",
        "nationality": "British"
      },
      "periods": [
        {
          "label": "Novels and films",
          "start": 1953,
          "end": 2026,
          "description": "Featured in Fleming's novels, continuation novels, and Eon films from Dr. No to No Time to Die."
        }
      ],
      "why": "Bond defined the spy thriller and the image of Cold War espionage in popular culture."
    },
    {
      "slug": "nikita-khrushchev",
      "name": "Nikita Khrushchev",
      "type": "person",
      "wiki": "Nikita Khrushchev",
      "description": "Soviet leader who denounced Stalin's crimes in 1956, crushed the Hungarian uprising, and placed the nuclear missiles in Cuba that set off the 1962 crisis.",
      "metadata": {
        "birth_date": "1894",
        "nationality": "Soviet",
        "death_date": "1971"
      },
      "periods": [
        {
          "label": "Soviet leader",
          "start": 1953,
          "end": 1964,
          "description": "Led de-Stalinisation, the early space programme and the Berlin and Cuban confrontations."
        }
      ],
      "why": "His denunciation of Stalin broke the Stalin cult across the communist world, and his Cuban gamble brought the world to the edge of nuclear war."
    },
    {
      "slug": "algerian-war",
      "name": "Algerian War",
      "type": "event",
      "wiki": "Algerian War",
      "description": "War of independence in which Algeria's National Liberation Front ended French colonial rule, a conflict that brought down France's Fourth Republic.",
      "metadata": {
        "start_date": "1954",
        "location": "Algeria",
        "end_date": "1962",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "War of independence",
          "start": 1954,
          "end": 1962,
          "description": "The FLN fought the French army in a war marked by torture, terrorism and mass displacement."
        }
      ],
      "why": "It was the defining colonial war of independence and a model for guerrilla movements."
    },
    {
      "slug": "elvis-presley",
      "name": "Elvis Presley",
      "type": "person",
      "wiki": "Elvis Presley",
      "description": "American singer whose fusion of rhythm and blues, gospel and country made him the central figure of rock and roll from 1956.",
      "metadata": {
        "birth_date": "1935",
        "death_date": "1977",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Recording and performing career",
          "start": 1954,
          "end": 1977,
          "description": "Recorded for Sun and RCA, starred in 31 feature films and performed in Las Vegas."
        }
      ],
      "why": "He carried rock and roll, built on Black American music, into global youth culture."
    },
    {
      "slug": "malcom-mclean",
      "name": "Malcom McLean",
      "type": "person",
      "wiki": "Malcom McLean",
      "description": "American trucking entrepreneur who developed the intermodal shipping container, first carried on the Ideal X in 1956.",
      "metadata": {
        "birth_date": "1913",
        "death_date": "2001",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Sea-Land and container shipping",
          "start": 1955,
          "end": 1986,
          "description": "Built Sea-Land Service and later United States Lines around standard containers moved between ships, trucks and trains."
        }
      ],
      "why": "Containerization cut shipping costs and made global supply chains and modern globalization possible."
    },
    {
      "slug": "rosa-parks",
      "name": "Rosa Parks",
      "type": "person",
      "wiki": "Rosa Parks",
      "description": "African American activist whose arrest for refusing to give up her bus seat in Montgomery, Alabama, in 1955 launched the Montgomery bus boycott.",
      "metadata": {
        "birth_date": "1913",
        "nationality": "American",
        "death_date": "2005"
      },
      "periods": [
        {
          "label": "Montgomery bus boycott",
          "start": 1955,
          "end": 1956,
          "description": "Refused to move to the back of a segregated bus and became the face of the year-long boycott."
        }
      ],
      "why": "Her act of refusal began the mass phase of the American civil rights movement."
    },
    {
      "slug": "vietnam-war",
      "name": "Vietnam War",
      "type": "event",
      "wiki": "Vietnam War",
      "description": "War in which communist North Vietnam and the Viet Cong fought South Vietnam and the United States, ending with the fall of Saigon in 1975 and Vietnam's reunification under communist rule.",
      "metadata": {
        "start_date": "1955",
        "location": "Vietnam",
        "end_date": "1975",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Vietnam War",
          "start": 1955,
          "end": 1975,
          "description": "US involvement grew from advisers to more than half a million troops before withdrawal in 1973."
        }
      ],
      "why": "It killed millions across Indochina, divided American society and marked the limits of US power."
    },
    {
      "slug": "artificial-intelligence",
      "name": "Artificial intelligence",
      "type": "event",
      "wiki": "Artificial intelligence",
      "description": "Field of building machines that perform tasks requiring intelligence, named at the Dartmouth workshop of 1956 and transformed by deep learning after 2012 and large language models after 2020.",
      "metadata": {
        "start_date": "1956",
        "location": "Worldwide",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Symbolic AI and machine learning",
          "start": 1956,
          "end": 2011,
          "description": "Researchers built logic programs, expert systems and statistical learning methods."
        },
        {
          "label": "Deep learning and generative AI",
          "start": 2012,
          "end": 2026,
          "description": "Neural networks trained on large data sets reached human-level results in vision, language and games."
        }
      ],
      "why": "AI is reshaping work, science, warfare and information, with large benefits and harms."
    },
    {
      "slug": "che-guevara",
      "name": "Che Guevara",
      "type": "person",
      "wiki": "Che Guevara",
      "description": "Argentine Marxist revolutionary who was a commander in the Cuban Revolution and was executed in Bolivia, becoming a global emblem of revolt.",
      "metadata": {
        "birth_date": "1928",
        "nationality": "Argentine",
        "death_date": "1967"
      },
      "periods": [
        {
          "label": "Cuban Revolution",
          "start": 1956,
          "end": 1959,
          "description": "Fought as a guerrilla commander and took Santa Clara in the decisive battle."
        },
        {
          "label": "Exporting revolution",
          "start": 1965,
          "end": 1967,
          "description": "Led guerrilla campaigns in the Congo and Bolivia, where he was captured and killed."
        }
      ],
      "why": "His guerrilla theory and image became the most widespread symbol of revolutionary politics worldwide."
    },
    {
      "slug": "pele",
      "name": "Pelé",
      "type": "person",
      "wiki": "Pelé",
      "description": "Brazilian footballer who won three FIFA World Cups, in 1958, 1962 and 1970, playing for Santos and later the New York Cosmos.",
      "metadata": {
        "birth_date": "1940",
        "death_date": "2022",
        "nationality": "Brazilian"
      },
      "periods": [
        {
          "label": "Playing career",
          "start": 1956,
          "end": 1977,
          "description": "Played for Santos, the Brazil national team and the New York Cosmos."
        }
      ],
      "why": "He became football's first global star of the television age and made Brazil the emblem of the sport."
    },
    {
      "slug": "sputnik-1",
      "name": "Sputnik 1",
      "type": "event",
      "wiki": "Sputnik 1",
      "description": "First artificial Earth satellite, launched by the Soviet Union from Baikonur on 4 October 1957.",
      "metadata": {
        "start_date": "1957",
        "end_date": "1958",
        "location": "Baikonur Cosmodrome, Soviet Union",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Launch and orbit",
          "start": 1957,
          "end": 1958,
          "description": "Orbited Earth for three months broadcasting radio pulses before burning up in January 1958."
        }
      ],
      "why": "Sputnik began the Space Age and the space race, and led the US to create NASA and expand science education."
    },
    {
      "slug": "chinua-achebe",
      "name": "Chinua Achebe",
      "type": "person",
      "wiki": "Chinua Achebe",
      "description": "Nigerian novelist whose Things Fall Apart (1958) became the most widely read African novel and a founding work of modern African literature in English.",
      "metadata": {
        "birth_date": "1930",
        "death_date": "2013",
        "nationality": "Nigerian"
      },
      "periods": [
        {
          "label": "Writing and teaching career",
          "start": 1958,
          "end": 2013,
          "description": "Wrote novels and essays, edited Heinemann's African Writers Series and taught in Nigeria and the United States."
        }
      ],
      "why": "He gave African literature a global readership and changed how the story of colonialism is told."
    },
    {
      "slug": "nasa",
      "name": "NASA",
      "type": "organization",
      "wiki": "NASA",
      "description": "United States space agency, founded in 1958, which landed twelve astronauts on the Moon in the Apollo program and operates space telescopes and planetary probes.",
      "metadata": {
        "founded_date": "1958",
        "headquarters": "Washington, D.C., United States",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Civil space program",
          "start": 1958,
          "end": 2026,
          "description": "Ran the Mercury, Gemini, Apollo, Space Shuttle and International Space Station programs and robotic missions across the solar system."
        }
      ],
      "why": "NASA put humans on the Moon, and its satellites, probes and images changed how people see Earth."
    },
    {
      "slug": "patrice-lumumba",
      "name": "Patrice Lumumba",
      "type": "person",
      "wiki": "Patrice Lumumba",
      "description": "First prime minister of the independent Democratic Republic of the Congo, deposed within months in the Congo Crisis and executed by Katangan secessionists in 1961.",
      "metadata": {
        "birth_date": "1925",
        "nationality": "Congolese",
        "death_date": "1961"
      },
      "periods": [
        {
          "label": "Independence leader and prime minister",
          "start": 1958,
          "end": 1961,
          "description": "Founded the Congolese National Movement and led the Congo to independence from Belgium in 1960."
        }
      ],
      "why": "His killing made him the defining martyr of African independence and of Cold War intervention in Africa."
    },
    {
      "slug": "barbie",
      "name": "Barbie",
      "type": "person",
      "wiki": "Barbie",
      "description": "Fashion doll made by Mattel, launched in 1959 by Ruth Handler and modeled on the German Bild Lilli doll.",
      "metadata": {
        "birth_date": "1959",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Mattel production",
          "start": 1959,
          "end": 2026,
          "description": "Sold as a doll with clothes, careers and accessories, and starred in films including the 2023 Barbie."
        }
      ],
      "why": "Over a billion Barbies have been sold, shaping children's play, debates over body image and toy marketing."
    },
    {
      "slug": "lee-kuan-yew",
      "name": "Lee Kuan Yew",
      "type": "person",
      "wiki": "Lee Kuan Yew",
      "description": "First prime minister of Singapore, who turned the city-state into a high-income trading and financial hub under a tightly controlled one-party-dominant government.",
      "metadata": {
        "birth_date": "1923",
        "nationality": "Singaporean",
        "death_date": "2015"
      },
      "periods": [
        {
          "label": "Prime Minister of Singapore",
          "start": 1959,
          "end": 1990,
          "description": "Led Singapore through self-government, separation from Malaysia and rapid industrialisation."
        }
      ],
      "why": "His model of authoritarian development was studied and copied by Deng's China and across Asia."
    },
    {
      "slug": "opec",
      "name": "OPEC",
      "type": "organization",
      "wiki": "OPEC",
      "description": "Intergovernmental organisation of oil-exporting states founded in Baghdad in 1960 that coordinates production to influence world oil prices.",
      "metadata": {
        "founded_date": "1960",
        "headquarters": "Vienna",
        "organization_type": "institution"
      },
      "periods": [
        {
          "label": "Oil producers' bloc",
          "start": 1960,
          "end": 2026,
          "description": "Took control of pricing from Western oil companies and set production quotas for its members."
        }
      ],
      "why": "It shifted control of the world's most important commodity to producing states."
    },
    {
      "slug": "amnesty-international",
      "name": "Amnesty International",
      "type": "organization",
      "wiki": "Amnesty International",
      "description": "The international organisation that campaigns for prisoners of conscience and against torture and the death penalty.",
      "metadata": {
        "founded_date": "1961",
        "headquarters": "London",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Campaigning for human rights",
          "start": 1961,
          "end": 2026,
          "description": "Amnesty documented abuses worldwide, campaigned for political prisoners and won the 1977 Nobel Peace Prize."
        }
      ],
      "why": "Built the modern human-rights campaigning model of research, publicity and mass letter-writing."
    },
    {
      "slug": "john-f-kennedy",
      "name": "John F. Kennedy",
      "type": "person",
      "wiki": "John F. Kennedy",
      "description": "US president who faced down the Soviet Union in the Cuban Missile Crisis, committed the country to a Moon landing, and was assassinated in 1963.",
      "metadata": {
        "birth_date": "1917",
        "nationality": "American",
        "death_date": "1963"
      },
      "periods": [
        {
          "label": "President of the United States",
          "start": 1961,
          "end": 1963,
          "description": "Handled the Bay of Pigs and the Cuban Missile Crisis, escalated involvement in Vietnam and proposed civil rights legislation."
        }
      ],
      "why": "His handling of the missile crisis kept the Cold War from turning into nuclear war."
    },
    {
      "slug": "yuri-gagarin",
      "name": "Yuri Gagarin",
      "type": "person",
      "wiki": "Yuri Gagarin",
      "description": "Soviet cosmonaut who became the first human to travel into space, in 1961.",
      "metadata": {
        "birth_date": "1934",
        "death_date": "1968",
        "nationality": "Soviet"
      },
      "periods": [
        {
          "label": "Vostok 1 and after",
          "start": 1961,
          "end": 1968,
          "description": "Gagarin orbited the Earth aboard Vostok 1 and became a worldwide symbol of the space age."
        }
      ],
      "why": "The first human in space, the opening of human spaceflight."
    },
    {
      "slug": "cuban-missile-crisis",
      "name": "Cuban Missile Crisis",
      "type": "event",
      "wiki": "Cuban Missile Crisis",
      "description": "Thirteen-day confrontation in October 1962 between the United States and the Soviet Union over Soviet nuclear missiles in Cuba, the closest the Cold War came to nuclear war.",
      "metadata": {
        "start_date": "1962",
        "location": "Cuba",
        "end_date": "1962"
      },
      "periods": [
        {
          "label": "Crisis",
          "start": 1962,
          "end": 1962,
          "description": "A US naval quarantine and secret bargaining ended with the withdrawal of the missiles."
        }
      ],
      "why": "It is the moment humanity came nearest to nuclear war, and it led to the hotline and arms control."
    },
    {
      "slug": "bob-marley",
      "name": "Bob Marley",
      "type": "person",
      "wiki": "Bob Marley",
      "description": "Jamaican singer and songwriter who with the Wailers brought reggae and the Rastafari movement to a worldwide audience.",
      "metadata": {
        "birth_date": "1945",
        "death_date": "1981",
        "nationality": "Jamaican"
      },
      "periods": [
        {
          "label": "The Wailers and solo career",
          "start": 1963,
          "end": 1981,
          "description": "Recorded and toured with the Wailers, releasing Catch a Fire, Exodus and Survival."
        }
      ],
      "why": "He made reggae a world music and his songs anthems of African independence; he played Zimbabwe's 1980 independence celebration."
    },
    {
      "slug": "pol-pot",
      "name": "Pol Pot",
      "type": "person",
      "wiki": "Pol Pot",
      "description": "Leader of the Khmer Rouge who ruled Cambodia from 1975 to 1979, emptying its cities and overseeing the deaths of between 1.5 and 2 million people.",
      "metadata": {
        "birth_date": "1925",
        "nationality": "Cambodian",
        "death_date": "1998"
      },
      "periods": [
        {
          "label": "Khmer Rouge insurgency",
          "start": 1963,
          "end": 1975,
          "description": "Led the Communist Party of Kampuchea in its guerrilla war against the Cambodian state."
        },
        {
          "label": "Ruler of Democratic Kampuchea",
          "start": 1975,
          "end": 1979,
          "description": "Abolished money, cities and religion and directed mass executions and forced labour."
        }
      ],
      "why": "His regime killed a larger share of its own population than any other modern state."
    },
    {
      "slug": "ruhollah-khomeini",
      "name": "Ruhollah Khomeini",
      "type": "person",
      "wiki": "Ruhollah Khomeini",
      "description": "Shia cleric who led the 1979 Iranian Revolution and founded the Islamic Republic of Iran as its first Supreme Leader.",
      "metadata": {
        "birth_date": "1902",
        "nationality": "Iranian",
        "death_date": "1989"
      },
      "periods": [
        {
          "label": "Opposition cleric in exile",
          "start": 1963,
          "end": 1979,
          "description": "Denounced the Shah and developed the doctrine of clerical rule from exile in Iraq and France."
        },
        {
          "label": "Supreme Leader of Iran",
          "start": 1979,
          "end": 1989,
          "description": "Founded the Islamic Republic, led Iran through the war with Iraq and issued the fatwa against Salman Rushdie."
        }
      ],
      "why": "He created the first modern theocratic state and launched political Islam as a governing force."
    },
    {
      "slug": "second-wave-feminism",
      "name": "Second-wave feminism",
      "type": "event",
      "wiki": "Second-wave feminism",
      "description": "Feminist movement of the 1960s to 1980s that campaigned for workplace equality, reproductive rights and legal reform beyond the vote, beginning in the United States and spreading worldwide.",
      "metadata": {
        "start_date": "1963",
        "location": "Worldwide",
        "end_date": "1982",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Movement",
          "start": 1963,
          "end": 1982,
          "description": "Campaigned for equal pay, abortion rights, anti-discrimination law and changes in family law."
        }
      ],
      "why": "It changed the legal and working lives of women across most of the world."
    },
    {
      "slug": "michael-jackson",
      "name": "Michael Jackson",
      "type": "person",
      "wiki": "Michael Jackson",
      "description": "American singer and dancer whose 1982 album Thriller is the best-selling album of all time.",
      "metadata": {
        "birth_date": "1958",
        "death_date": "2009",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Jackson 5 and solo career",
          "start": 1964,
          "end": 2009,
          "description": "Sang with the Jackson 5 and released the solo albums Off the Wall, Thriller, Bad and Dangerous."
        }
      ],
      "why": "He made the music video a global art form and broke MTV's color line."
    },
    {
      "slug": "indira-gandhi",
      "name": "Indira Gandhi",
      "type": "person",
      "wiki": "Indira Gandhi",
      "description": "Prime minister of India who led the country through the 1971 war that created Bangladesh, imposed the 1975–1977 Emergency, and was assassinated in 1984.",
      "metadata": {
        "birth_date": "1917",
        "nationality": "Indian",
        "death_date": "1984"
      },
      "periods": [
        {
          "label": "First premiership",
          "start": 1966,
          "end": 1977,
          "description": "Nationalised banks, backed the Green Revolution, won the 1971 war and ruled by decree during the Emergency."
        },
        {
          "label": "Second premiership",
          "start": 1980,
          "end": 1984,
          "description": "Returned to power and ordered the army assault on the Golden Temple."
        }
      ],
      "why": "She dominated the politics of the world's largest democracy from 1966 to 1984 and redrew the map of South Asia."
    },
    {
      "slug": "intel",
      "name": "Intel",
      "type": "organization",
      "wiki": "Intel",
      "description": "American semiconductor company founded by Robert Noyce and Gordon Moore in 1968, which made the first commercial microprocessor in 1971 and the x86 processors used in most personal computers.",
      "metadata": {
        "founded_date": "1968",
        "headquarters": "Santa Clara, California, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Chip manufacturing",
          "start": 1968,
          "end": 2026,
          "description": "Designed and manufactured memory chips and microprocessors."
        }
      ],
      "why": "Intel's microprocessors and Moore's law set the pace of the computer revolution."
    },
    {
      "slug": "oral-rehydration-therapy",
      "name": "Oral rehydration therapy",
      "type": "event",
      "wiki": "Oral rehydration therapy",
      "description": "Treatment of dehydration from diarrhea with a drink of water, salts and glucose, proven in cholera trials in Dhaka and Kolkata in the late 1960s and adopted by WHO and UNICEF in the 1970s.",
      "metadata": {
        "start_date": "1968",
        "end_date": "1990",
        "location": "Dhaka and Kolkata",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Clinical trials",
          "start": 1968,
          "end": 1971,
          "description": "Researchers at the Cholera Research Laboratory in Dhaka and in Kolkata proved oral rehydration and used it in the 1971 refugee camps."
        },
        {
          "label": "Global rollout",
          "start": 1978,
          "end": 1990,
          "description": "WHO and UNICEF promoted oral rehydration salts through national diarrheal disease programs."
        }
      ],
      "why": "A cheap salt-and-sugar solution, ORT cut child deaths from diarrhea worldwide by more than half after 1980."
    },
    {
      "slug": "apollo-11",
      "name": "Apollo 11",
      "type": "event",
      "wiki": "Apollo 11",
      "description": "NASA spaceflight on which Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon, on 20 July 1969.",
      "metadata": {
        "start_date": "1969",
        "end_date": "1969",
        "location": "The Moon",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Mission",
          "start": 1969,
          "end": 1969,
          "description": "Launched on 16 July 1969, landed in the Sea of Tranquility on 20 July and returned to Earth on 24 July."
        }
      ],
      "why": "Watched live by hundreds of millions, the landing won the Moon race for the United States and became a symbol of human capability."
    },
    {
      "slug": "in-vitro-fertilisation",
      "name": "In vitro fertilisation",
      "type": "event",
      "wiki": "In vitro fertilisation",
      "description": "Fertilization of an egg outside the body, developed by Robert Edwards and Patrick Steptoe, which produced the first IVF baby, Louise Brown, in Oldham, England, in 1978.",
      "metadata": {
        "start_date": "1969",
        "end_date": "1978",
        "location": "Cambridge and Oldham, England",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Development and first birth",
          "start": 1969,
          "end": 1978,
          "description": "Edwards fertilized human eggs in vitro in 1969 and with Steptoe achieved the first IVF birth."
        }
      ],
      "why": "IVF has produced over 12 million babies and changed reproduction, family structure and genetic screening."
    },
    {
      "slug": "internet",
      "name": "Internet",
      "type": "event",
      "wiki": "Internet",
      "description": "Global network of computer networks, grown from the US ARPANET of 1969 and joined by the TCP/IP protocols adopted in 1983.",
      "metadata": {
        "start_date": "1969",
        "location": "Worldwide",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "ARPANET and TCP/IP",
          "start": 1969,
          "end": 1990,
          "description": "US research networks connected universities and laboratories and adopted Vint Cerf and Bob Kahn's TCP/IP."
        },
        {
          "label": "Commercial and global internet",
          "start": 1991,
          "end": 2026,
          "description": "The network opened to commercial use and grew to connect over five billion people."
        }
      ],
      "why": "The internet reorganized commerce, media, politics and social life for most of humanity."
    },
    {
      "slug": "richard-nixon",
      "name": "Richard Nixon",
      "type": "person",
      "wiki": "Richard Nixon",
      "description": "US president who opened relations with Communist China, ended the dollar's convertibility to gold, withdrew US troops from Vietnam, and resigned over the Watergate scandal.",
      "metadata": {
        "birth_date": "1913",
        "nationality": "American",
        "death_date": "1994"
      },
      "periods": [
        {
          "label": "President of the United States",
          "start": 1969,
          "end": 1974,
          "description": "Pursued détente with the Soviet Union, the opening to China and the end of the Bretton Woods system."
        }
      ],
      "why": "His opening to China and end of the gold standard rearranged world politics and finance."
    },
    {
      "slug": "tu-youyou",
      "name": "Tu Youyou",
      "type": "person",
      "wiki": "Tu Youyou",
      "description": "Chinese pharmaceutical chemist who isolated artemisinin from sweet wormwood in 1972 under the secret Project 523, producing the standard modern treatment for malaria.",
      "metadata": {
        "birth_date": "1930",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Project 523",
          "start": 1969,
          "end": 1981,
          "description": "Screened traditional Chinese remedies, extracted artemisinin and ran its first clinical trials."
        }
      ],
      "why": "Artemisinin-based therapies have saved millions of malaria patients in Africa and Asia; she won the 2015 Nobel Prize."
    },
    {
      "slug": "bangladesh-liberation-war",
      "name": "Bangladesh Liberation War",
      "type": "event",
      "wiki": "Bangladesh Liberation War",
      "description": "War in which East Pakistan, aided by India, won independence from Pakistan as Bangladesh, amid a Pakistani army campaign of mass killing.",
      "metadata": {
        "start_date": "1971",
        "location": "Bangladesh",
        "end_date": "1971",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Liberation war",
          "start": 1971,
          "end": 1971,
          "description": "Bengali guerrillas and the Indian army defeated Pakistani forces in December 1971."
        }
      ],
      "why": "It created the world's eighth most populous country and split the state founded at partition."
    },
    {
      "slug": "1973-oil-crisis",
      "name": "1973 oil crisis",
      "type": "event",
      "wiki": "1973 oil crisis",
      "description": "Oil embargo imposed by Arab oil producers on the United States and other supporters of Israel during the 1973 Yom Kippur War, which quadrupled oil prices and ended the postwar economic boom.",
      "metadata": {
        "start_date": "1973",
        "location": "Worldwide",
        "end_date": "1974"
      },
      "periods": [
        {
          "label": "Embargo and price shock",
          "start": 1973,
          "end": 1974,
          "description": "Arab producers cut output and embargoed shipments while prices rose fourfold."
        }
      ],
      "why": "It brought stagflation to the West, enriched the Gulf states and launched energy policy as a security issue."
    },
    {
      "slug": "augusto-pinochet",
      "name": "Augusto Pinochet",
      "type": "person",
      "wiki": "Augusto Pinochet",
      "description": "Chilean general who seized power in the 1973 coup against Salvador Allende and ruled as dictator until 1990, pairing political repression with free-market reforms.",
      "metadata": {
        "birth_date": "1915",
        "nationality": "Chilean",
        "death_date": "2006"
      },
      "periods": [
        {
          "label": "Military ruler of Chile",
          "start": 1973,
          "end": 1990,
          "description": "Directed the killing and disappearance of opponents and the Chicago Boys' economic programme."
        }
      ],
      "why": "His regime was the first test of neoliberal economics and a model for Latin America's military dictatorships."
    },
    {
      "slug": "dj-kool-herc",
      "name": "DJ Kool Herc",
      "type": "person",
      "wiki": "DJ Kool Herc",
      "description": "Jamaican-American DJ whose August 1973 party at 1520 Sedgwick Avenue in the Bronx, extending drum breaks on two turntables, is marked as the birth of hip-hop.",
      "metadata": {
        "birth_date": "1955",
        "nationality": "Jamaican-American"
      },
      "periods": [
        {
          "label": "DJ career in the Bronx",
          "start": 1973,
          "end": 1980,
          "description": "Played block parties and clubs in the Bronx with his Herculoids sound system."
        }
      ],
      "why": "The breakbeat technique he introduced is the foundation of hip-hop music."
    },
    {
      "slug": "hip-hop",
      "name": "Hip-hop",
      "type": "event",
      "wiki": "Hip-hop",
      "description": "Cultural movement of rapping, DJing, breakdancing and graffiti that began among Black and Latino youth in the Bronx in 1973.",
      "metadata": {
        "start_date": "1973",
        "location": "The Bronx, New York City, United States",
        "event_type": "movement"
      },
      "periods": [
        {
          "label": "Origins in New York",
          "start": 1973,
          "end": 1985,
          "description": "DJs, MCs, dancers and graffiti writers built the culture at Bronx parties and on the first rap records."
        },
        {
          "label": "Global spread",
          "start": 1986,
          "end": 2026,
          "description": "Hip-hop music became a mainstream global genre with scenes on every continent."
        }
      ],
      "why": "Hip-hop became a dominant global youth culture and the most consumed music genre in the United States."
    },
    {
      "slug": "mobile-phone",
      "name": "Mobile phone",
      "type": "event",
      "wiki": "Mobile phone",
      "description": "Portable wireless telephone, first demonstrated by Martin Cooper of Motorola in 1973, with the first commercial cellular network opened in Tokyo in 1979.",
      "metadata": {
        "start_date": "1973",
        "location": "Worldwide",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Invention and global adoption",
          "start": 1973,
          "end": 2026,
          "description": "Cellular networks spread from Japan, Scandinavia and the US to the world, and smartphones followed from 2007."
        }
      ],
      "why": "Mobile phones reached more people faster than any earlier technology, bringing telephony, internet and banking to the developing world."
    },
    {
      "slug": "bill-gates",
      "name": "Bill Gates",
      "type": "person",
      "wiki": "Bill Gates",
      "description": "American businessman who co-founded Microsoft in 1975, whose MS-DOS and Windows software ran most personal computers, and who co-founded the Gates Foundation in 2000.",
      "metadata": {
        "birth_date": "1955",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Microsoft",
          "start": 1975,
          "end": 2008,
          "description": "Led Microsoft as chief executive and then as chairman and chief software architect."
        },
        {
          "label": "Gates Foundation",
          "start": 2000,
          "end": 2026,
          "description": "Directed the foundation's spending on vaccines, polio eradication and global health."
        }
      ],
      "why": "He put Microsoft software on most of the world's personal computers and directs one of the largest global health funders."
    },
    {
      "slug": "cambodian-genocide",
      "name": "Cambodian genocide",
      "type": "event",
      "wiki": "Cambodian genocide",
      "description": "Killing of between 1.5 and 2 million Cambodians by the Khmer Rouge regime through execution, forced labour and famine.",
      "metadata": {
        "start_date": "1975",
        "location": "Cambodia",
        "end_date": "1979",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Khmer Rouge rule",
          "start": 1975,
          "end": 1979,
          "description": "The regime emptied cities into labour camps and executed perceived enemies at sites such as Tuol Sleng."
        }
      ],
      "why": "It is the defining case of a revolutionary state destroying its own people."
    },
    {
      "slug": "microsoft",
      "name": "Microsoft",
      "type": "organization",
      "wiki": "Microsoft",
      "description": "American software company founded by Bill Gates and Paul Allen in 1975, whose MS-DOS, Windows and Office became the standard software of personal computers.",
      "metadata": {
        "founded_date": "1975",
        "headquarters": "Redmond, Washington, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Software and cloud",
          "start": 1975,
          "end": 2026,
          "description": "Sold operating systems, office software, Xbox and the Azure cloud, and invested in OpenAI."
        }
      ],
      "why": "Windows and Office put computing on desks worldwide, and Azure makes Microsoft central to cloud and AI."
    },
    {
      "slug": "deng-xiaoping",
      "name": "Deng Xiaoping",
      "type": "person",
      "wiki": "Deng Xiaoping",
      "description": "Paramount leader of the People's Republic of China who opened its economy to markets and foreign investment from 1978 and ordered the 1989 Tiananmen Square crackdown.",
      "metadata": {
        "birth_date": "1904",
        "nationality": "Chinese",
        "death_date": "1997"
      },
      "periods": [
        {
          "label": "Paramount leader",
          "start": 1978,
          "end": 1992,
          "description": "Launched reform and opening up, special economic zones and the one-party market economy."
        }
      ],
      "why": "His reforms turned China into the world's largest manufacturer and the largest poverty reduction in history."
    },
    {
      "slug": "geoffrey-hinton",
      "name": "Geoffrey Hinton",
      "type": "person",
      "wiki": "Geoffrey Hinton",
      "description": "British-Canadian computer scientist who helped popularize backpropagation for training neural networks in 1986 and whose students' 2012 AlexNet image-recognition result started the deep learning boom.",
      "metadata": {
        "birth_date": "1947",
        "nationality": "British-Canadian"
      },
      "periods": [
        {
          "label": "Neural network research",
          "start": 1978,
          "end": 2023,
          "description": "Researched neural networks at Carnegie Mellon, the University of Toronto and Google."
        }
      ],
      "why": "Deep learning, which his work established, is the basis of current AI; he shared the 2024 Nobel Prize in Physics."
    },
    {
      "slug": "iranian-revolution",
      "name": "Iranian Revolution",
      "type": "event",
      "wiki": "Iranian Revolution",
      "description": "Revolution that overthrew Shah Mohammad Reza Pahlavi and replaced the monarchy with an Islamic republic under Ayatollah Ruhollah Khomeini.",
      "metadata": {
        "start_date": "1978",
        "location": "Iran",
        "end_date": "1979",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Revolution",
          "start": 1978,
          "end": 1979,
          "description": "Mass strikes and demonstrations forced the Shah into exile and installed clerical rule."
        }
      ],
      "why": "It made political Islam a governing force and created the regional rivalry that shapes the Middle East."
    },
    {
      "slug": "chinese-economic-reform",
      "name": "Reform and opening up",
      "type": "event",
      "wiki": "Reform and opening up",
      "description": "Programme of market reforms and opening to foreign trade begun under Deng Xiaoping in 1978 that lifted hundreds of millions of Chinese out of extreme poverty and made China the world's largest manufacturer.",
      "metadata": {
        "start_date": "1978",
        "location": "China"
      },
      "periods": [
        {
          "label": "Reform and opening up",
          "start": 1978,
          "end": 1992,
          "description": "Decollectivised farming, created special economic zones and admitted foreign capital."
        },
        {
          "label": "Market expansion",
          "start": 1992,
          "end": 2001,
          "description": "Deepened privatisation and market pricing, culminating in WTO accession."
        }
      ],
      "why": "It was the largest and fastest economic transformation in history."
    },
    {
      "slug": "margaret-thatcher",
      "name": "Margaret Thatcher",
      "type": "person",
      "wiki": "Margaret Thatcher",
      "description": "First female prime minister of the United Kingdom, whose privatisation, trade-union curbs and free-market policies reshaped the British economy.",
      "metadata": {
        "birth_date": "1925",
        "nationality": "British",
        "death_date": "2013"
      },
      "periods": [
        {
          "label": "Prime Minister of the United Kingdom",
          "start": 1979,
          "end": 1990,
          "description": "Privatised state industries, defeated the miners' strike and fought the Falklands War."
        }
      ],
      "why": "Thatcherism became a template for privatisation and market reform copied worldwide."
    },
    {
      "slug": "saddam-hussein",
      "name": "Saddam Hussein",
      "type": "person",
      "wiki": "Saddam Hussein",
      "description": "President of Iraq who launched wars against Iran in 1980 and Kuwait in 1990, was overthrown by the 2003 US-led invasion, and was executed in 2006.",
      "metadata": {
        "birth_date": "1937",
        "nationality": "Iraqi",
        "death_date": "2006"
      },
      "periods": [
        {
          "label": "President of Iraq",
          "start": 1979,
          "end": 2003,
          "description": "Ruled through the Ba'ath Party, fought Iran, gassed the Kurds at Halabja and invaded Kuwait."
        }
      ],
      "why": "His wars set off three decades of conflict in the Gulf and drew the United States into the Middle East."
    },
    {
      "slug": "soviet-afghan-war",
      "name": "Soviet–Afghan War",
      "type": "event",
      "wiki": "Soviet–Afghan War",
      "description": "War in which Soviet troops propped up Afghanistan's communist government against mujahideen backed by the United States, Pakistan and Saudi Arabia, fostering the jihadist networks from which al-Qaeda and the Taliban emerged.",
      "metadata": {
        "start_date": "1979",
        "location": "Afghanistan",
        "end_date": "1989",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Soviet occupation",
          "start": 1979,
          "end": 1989,
          "description": "Soviet forces fought mujahideen guerrillas until their withdrawal in 1989."
        }
      ],
      "why": "It drained the Soviet Union and seeded the global jihadist movement."
    },
    {
      "slug": "hiv-aids-pandemic",
      "name": "HIV/AIDS pandemic",
      "type": "event",
      "wiki": "HIV/AIDS",
      "description": "Pandemic of the human immunodeficiency virus, first recognized in 1981, which has killed more than 40 million people, most of them in sub-Saharan Africa.",
      "metadata": {
        "start_date": "1981",
        "location": "Worldwide, concentrated in sub-Saharan Africa",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Pandemic",
          "start": 1981,
          "end": 2026,
          "description": "HIV spread worldwide, with AIDS deaths peaking in 2004 before antiretroviral therapy cut them."
        }
      ],
      "why": "AIDS reshaped sexual behavior, gay rights activism, drug pricing and global health funding, and cut life expectancy across southern Africa."
    },
    {
      "slug": "mario",
      "name": "Mario",
      "type": "person",
      "wiki": "Mario",
      "description": "Video game character created by Shigeru Miyamoto for Nintendo, who debuted in Donkey Kong in 1981 and starred in Super Mario Bros. in 1985.",
      "metadata": {
        "birth_date": "1981"
      },
      "periods": [
        {
          "label": "Nintendo games and films",
          "start": 1981,
          "end": 2026,
          "description": "Starred in platform, racing and party games on every Nintendo console, and in animated films."
        }
      ],
      "why": "Super Mario is the best-selling video game franchise and revived the home video game industry after the 1983 crash."
    },
    {
      "slug": "ronald-reagan",
      "name": "Ronald Reagan",
      "type": "person",
      "wiki": "Ronald Reagan",
      "description": "US president who cut taxes and regulation, built up the military against the Soviet Union, and signed the first treaty to eliminate a class of nuclear weapons.",
      "metadata": {
        "birth_date": "1911",
        "nationality": "American",
        "death_date": "2004"
      },
      "periods": [
        {
          "label": "President of the United States",
          "start": 1981,
          "end": 1989,
          "description": "Led the conservative turn in US policy and negotiated the INF Treaty with Gorbachev."
        }
      ],
      "why": "His economic and Cold War policies set the direction of American politics for decades."
    },
    {
      "slug": "mikhail-gorbachev",
      "name": "Mikhail Gorbachev",
      "type": "person",
      "wiki": "Mikhail Gorbachev",
      "description": "Last leader of the Soviet Union, whose glasnost and perestroika reforms and refusal to use force in Eastern Europe ended the Cold War and the Soviet state.",
      "metadata": {
        "birth_date": "1931",
        "nationality": "Soviet",
        "death_date": "2022"
      },
      "periods": [
        {
          "label": "Soviet leader",
          "start": 1985,
          "end": 1991,
          "description": "Opened Soviet politics and the economy, signed arms treaties and let Eastern Europe leave the Soviet bloc."
        }
      ],
      "why": "His choices ended the Cold War without a war between the superpowers and freed hundreds of millions from Soviet rule."
    },
    {
      "slug": "chernobyl-disaster",
      "name": "Chernobyl disaster",
      "type": "event",
      "wiki": "Chernobyl disaster",
      "description": "Explosion and fire at reactor 4 of the Chernobyl nuclear power plant in Soviet Ukraine on 26 April 1986, which spread radioactive contamination across Europe and forced the permanent resettlement of over 300,000 people.",
      "metadata": {
        "start_date": "1986",
        "end_date": "1986",
        "location": "Pripyat, Ukrainian SSR, Soviet Union",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Accident and containment",
          "start": 1986,
          "end": 1986,
          "description": "The reactor exploded during a safety test and burned for ten days before workers sealed it in a concrete sarcophagus."
        }
      ],
      "why": "Chernobyl slowed nuclear power worldwide for decades and undermined trust in the Soviet state."
    },
    {
      "slug": "tsmc",
      "name": "TSMC",
      "type": "organization",
      "wiki": "TSMC",
      "description": "Taiwanese company founded by Morris Chang in 1987 as the first dedicated contract chip manufacturer, which produces most of the world's advanced semiconductors.",
      "metadata": {
        "founded_date": "1987",
        "headquarters": "Hsinchu, Taiwan",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Contract chip manufacturing",
          "start": 1987,
          "end": 2026,
          "description": "Manufactured chips designed by Apple, Nvidia, AMD, Qualcomm and other companies."
        }
      ],
      "why": "TSMC makes the chips in smartphones and AI accelerators, making Taiwan central to the global economy and to US-China rivalry."
    },
    {
      "slug": "aung-san-suu-kyi",
      "name": "Aung San Suu Kyi",
      "type": "person",
      "wiki": "Aung San Suu Kyi",
      "description": "Burmese opposition leader and 1991 Nobel Peace laureate who led the democracy movement against military rule, governed Myanmar as State Counsellor from 2016, and was deposed by the 2021 coup.",
      "metadata": {
        "birth_date": "1945",
        "nationality": "Burmese"
      },
      "periods": [
        {
          "label": "Democracy movement leader",
          "start": 1988,
          "end": 2010,
          "description": "Led the National League for Democracy and spent most of 1989 to 2010 under house arrest."
        },
        {
          "label": "State Counsellor of Myanmar",
          "start": 2016,
          "end": 2021,
          "description": "Led Myanmar's civilian government and defended it against genocide charges over the Rohingya."
        }
      ],
      "why": "She was the world's most prominent symbol of nonviolent resistance to military dictatorship."
    },
    {
      "slug": "dissolution-of-the-soviet-union",
      "name": "Dissolution of the Soviet Union",
      "type": "event",
      "wiki": "Dissolution of the Soviet Union",
      "description": "Breakup of the Soviet Union into fifteen independent states, completed on 26 December 1991, which ended the Cold War.",
      "metadata": {
        "start_date": "1988",
        "location": "Soviet Union",
        "end_date": "1991"
      },
      "periods": [
        {
          "label": "Breakup",
          "start": 1988,
          "end": 1991,
          "description": "Republics declared sovereignty, a hardline coup failed and the union was formally dissolved."
        }
      ],
      "why": "It ended the Cold War, created fifteen states and left the United States as the sole superpower."
    },
    {
      "slug": "katalin-kariko",
      "name": "Katalin Karikó",
      "type": "person",
      "wiki": "Katalin Karikó",
      "description": "Hungarian-American biochemist who with Drew Weissman showed in 2005 that modified nucleosides stop synthetic mRNA from triggering inflammation, the basis of the mRNA COVID-19 vaccines.",
      "metadata": {
        "birth_date": "1955",
        "nationality": "Hungarian-American"
      },
      "periods": [
        {
          "label": "mRNA research at Penn and BioNTech",
          "start": 1989,
          "end": 2022,
          "description": "Researched therapeutic mRNA at the University of Pennsylvania and then led mRNA work at BioNTech."
        }
      ],
      "why": "mRNA vaccines were given in billions of doses against COVID-19 and opened a new platform for medicine; she won the 2023 Nobel Prize."
    },
    {
      "slug": "revolutions-of-1989",
      "name": "Revolutions of 1989",
      "type": "event",
      "wiki": "Revolutions of 1989",
      "description": "Wave of revolutions, peaceful everywhere except Romania, that brought down the communist governments of Central and Eastern Europe, symbolised by the fall of the Berlin Wall in November 1989.",
      "metadata": {
        "start_date": "1989",
        "location": "Central and Eastern Europe",
        "end_date": "1991",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Revolutions",
          "start": 1989,
          "end": 1991,
          "description": "Poland, Hungary, East Germany, Czechoslovakia, Bulgaria, Romania and Albania ended communist rule."
        }
      ],
      "why": "It ended the division of Europe and the Soviet empire."
    },
    {
      "slug": "amazon",
      "name": "Amazon",
      "type": "organization",
      "wiki": "Amazon (company)",
      "description": "American company founded by Jeff Bezos in 1994, which became the largest online retailer and, through Amazon Web Services, the largest cloud-computing provider.",
      "metadata": {
        "founded_date": "1994",
        "headquarters": "Seattle, Washington, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "E-commerce and cloud",
          "start": 1994,
          "end": 2026,
          "description": "Sold goods online, built a global logistics network and launched Amazon Web Services in 2006."
        }
      ],
      "why": "Amazon reshaped retail, logistics, work and the infrastructure of the internet."
    },
    {
      "slug": "jeff-bezos",
      "name": "Jeff Bezos",
      "type": "person",
      "wiki": "Jeff Bezos",
      "description": "American businessman who founded Amazon in 1994 as an online bookstore and ran it as chief executive until 2021; he also founded Blue Origin and owns The Washington Post.",
      "metadata": {
        "birth_date": "1964",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "Amazon chief executive",
          "start": 1994,
          "end": 2021,
          "description": "Built Amazon into the largest online retailer and created Amazon Web Services."
        }
      ],
      "why": "Through Amazon he reshaped retail, logistics, warehouse labor and cloud computing worldwide."
    },
    {
      "slug": "rwandan-genocide",
      "name": "Rwandan genocide",
      "type": "event",
      "wiki": "Rwandan genocide",
      "description": "Mass killing of between 500,000 and 800,000 Tutsi and moderate Hutu by Hutu extremist militias and soldiers between April and July 1994.",
      "metadata": {
        "start_date": "1994",
        "location": "Rwanda",
        "end_date": "1994",
        "event_type": "disaster"
      },
      "periods": [
        {
          "label": "Genocide",
          "start": 1994,
          "end": 1994,
          "description": "Interahamwe militias and the army killed Tutsi in a hundred days while the UN withdrew."
        }
      ],
      "why": "It destabilised Central Africa and reshaped international doctrine on intervention."
    },
    {
      "slug": "taliban",
      "name": "Taliban",
      "type": "organization",
      "wiki": "Taliban",
      "description": "Deobandi Islamist movement that ruled Afghanistan from 1996 to 2001, sheltered al-Qaeda, and retook power in 2021 after an insurgency against US-led forces.",
      "metadata": {
        "founded_date": "1994",
        "headquarters": "Kandahar",
        "organization_type": "government"
      },
      "periods": [
        {
          "label": "Rise and first emirate",
          "start": 1994,
          "end": 2001,
          "description": "Seized Kabul and imposed a strict Islamic emirate that hosted Osama bin Laden."
        },
        {
          "label": "Insurgency and second emirate",
          "start": 2001,
          "end": 2026,
          "description": "Fought NATO forces until their withdrawal and reimposed rule that bars girls from secondary school."
        }
      ],
      "why": "It hosted the planners of 9/11 and outlasted the US-led war against it."
    },
    {
      "slug": "elon-musk",
      "name": "Elon Musk",
      "type": "person",
      "wiki": "Elon Musk",
      "description": "South African-born businessman who leads Tesla and SpaceX, which made electric cars and reusable orbital rockets commercial, bought Twitter in 2022 and led the US Department of Government Efficiency in 2025.",
      "metadata": {
        "birth_date": "1971",
        "nationality": "South African-born American"
      },
      "periods": [
        {
          "label": "Zip2, PayPal, Tesla, SpaceX and X",
          "start": 1995,
          "end": 2026,
          "description": "Founded or led Zip2, X.com, SpaceX, Tesla, Neuralink, X and xAI."
        }
      ],
      "why": "Through Tesla, SpaceX, Starlink and X he has reach over transport, space access, communications and politics."
    },
    {
      "slug": "google",
      "name": "Google",
      "type": "organization",
      "wiki": "Google",
      "description": "American technology company founded by Larry Page and Sergey Brin in 1998, which runs the most used web search engine, the Android operating system and YouTube.",
      "metadata": {
        "founded_date": "1998",
        "headquarters": "Mountain View, California, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Search, advertising and Android",
          "start": 1998,
          "end": 2026,
          "description": "Built web search, online advertising, Gmail, Maps, Chrome, Android and the Gemini AI models."
        }
      ],
      "why": "Google search and Android mediate how billions of people find information and use phones."
    },
    {
      "slug": "second-congo-war",
      "name": "Second Congo War",
      "type": "event",
      "wiki": "Second Congo War",
      "description": "War in the Democratic Republic of the Congo that drew in nine African countries and dozens of armed groups and caused millions of deaths, most from disease and starvation.",
      "metadata": {
        "start_date": "1998",
        "location": "Democratic Republic of the Congo",
        "end_date": "2003",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Great War of Africa",
          "start": 1998,
          "end": 2003,
          "description": "Rwandan, Ugandan, Angolan, Zimbabwean and other forces fought over the Congo and its minerals."
        }
      ],
      "why": "It was the widest interstate war in modern African history."
    },
    {
      "slug": "tencent",
      "name": "Tencent",
      "type": "organization",
      "wiki": "Tencent",
      "description": "Chinese technology company founded in Shenzhen in 1998 by Ma Huateng and partners, which runs WeChat, the QQ messenger and the largest video game business in the world.",
      "metadata": {
        "founded_date": "1998",
        "headquarters": "Shenzhen, China",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Messaging, games and payments",
          "start": 1998,
          "end": 2026,
          "description": "Launched QQ in 1999 and WeChat in 2011, and bought or invested in game studios worldwide."
        }
      ],
      "why": "WeChat is the everyday platform for messaging, payments and services for over a billion people in China."
    },
    {
      "slug": "alibaba-group",
      "name": "Alibaba Group",
      "type": "organization",
      "wiki": "Alibaba Group",
      "description": "Chinese technology company founded by Jack Ma and partners in Hangzhou in 1999, which runs the Taobao and Tmall marketplaces and created the Alipay payment service.",
      "metadata": {
        "founded_date": "1999",
        "headquarters": "Hangzhou, China",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "E-commerce and payments",
          "start": 1999,
          "end": 2026,
          "description": "Operated Alibaba.com, Taobao, Tmall, Alipay and Alibaba Cloud."
        }
      ],
      "why": "Alibaba built Chinese e-commerce and helped make China a mobile-payment society."
    },
    {
      "slug": "jack-ma",
      "name": "Jack Ma",
      "type": "person",
      "wiki": "Jack Ma",
      "description": "Chinese businessman who co-founded Alibaba in Hangzhou in 1999 and built the Taobao marketplace and the Alipay payment service.",
      "metadata": {
        "birth_date": "1964",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "Alibaba",
          "start": 1999,
          "end": 2019,
          "description": "Led Alibaba as chief executive and then chairman, through its 2014 New York stock listing."
        }
      ],
      "why": "Alibaba, which he built, brought online shopping and mobile payment to hundreds of millions of Chinese."
    },
    {
      "slug": "vladimir-putin",
      "name": "Vladimir Putin",
      "type": "person",
      "wiki": "Vladimir Putin",
      "description": "Leader of Russia since 1999 as president or prime minister, who centralised power in the Kremlin and launched the full-scale invasion of Ukraine in 2022.",
      "metadata": {
        "birth_date": "1952",
        "nationality": "Russian"
      },
      "periods": [
        {
          "label": "Leader of Russia",
          "start": 1999,
          "end": 2026,
          "description": "Rebuilt a centralised state, fought wars in Chechnya, Georgia, Syria and Ukraine, and annexed Crimea."
        }
      ],
      "why": "He has ruled a nuclear power since 1999 and started the largest war in Europe since 1945."
    },
    {
      "slug": "gates-foundation",
      "name": "Gates Foundation",
      "type": "organization",
      "wiki": "Gates Foundation",
      "description": "American private foundation set up by Bill Gates and Melinda French Gates in 2000, a principal funder of polio eradication, malaria research and the Gavi vaccine alliance.",
      "metadata": {
        "founded_date": "2000",
        "headquarters": "Seattle, Washington, United States",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Global health grant-making",
          "start": 2000,
          "end": 2026,
          "description": "Funded vaccines, disease eradication, agriculture and education in developing countries and the United States."
        }
      ],
      "why": "Its spending sets priorities in global health and vaccine delivery to the developing world."
    },
    {
      "slug": "wikipedia",
      "name": "Wikipedia",
      "type": "organization",
      "wiki": "Wikipedia",
      "description": "Free online encyclopedia launched by Jimmy Wales and Larry Sanger in 2001 and written by volunteers in over 300 languages.",
      "metadata": {
        "founded_date": "2001",
        "headquarters": "San Francisco, California, United States",
        "organization_type": "ngo"
      },
      "periods": [
        {
          "label": "Volunteer encyclopedia",
          "start": 2001,
          "end": 2026,
          "description": "Grew to over six million English articles, hosted by the Wikimedia Foundation."
        }
      ],
      "why": "Wikipedia is the most used reference work in history and a core training source for AI language models."
    },
    {
      "slug": "jennifer-doudna",
      "name": "Jennifer Doudna",
      "type": "person",
      "wiki": "Jennifer Doudna",
      "description": "American biochemist who with Emmanuelle Charpentier showed in 2012 that the CRISPR-Cas9 system can be programmed to cut chosen DNA sequences.",
      "metadata": {
        "birth_date": "1964",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "RNA and CRISPR research at Berkeley",
          "start": 2002,
          "end": 2026,
          "description": "Studied RNA structure and CRISPR systems, co-published the 2012 Cas9 paper and founded the Innovative Genomics Institute."
        }
      ],
      "why": "CRISPR made gene editing cheap and routine; she shared the 2020 Nobel Prize in Chemistry."
    },
    {
      "slug": "iraq-war",
      "name": "Iraq War",
      "type": "event",
      "wiki": "Iraq War",
      "description": "US-led invasion of Iraq that overthrew Saddam Hussein in 2003 and was followed by an insurgency and sectarian civil war that gave rise to the Islamic State.",
      "metadata": {
        "start_date": "2003",
        "location": "Iraq",
        "end_date": "2011",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Invasion and occupation",
          "start": 2003,
          "end": 2011,
          "description": "US-led forces toppled the Ba'athist government and fought insurgents until their withdrawal."
        }
      ],
      "why": "It killed hundreds of thousands, destabilised the Middle East and discredited US interventionism."
    },
    {
      "slug": "islamic-state",
      "name": "Islamic State",
      "type": "organization",
      "wiki": "Islamic State",
      "description": "Jihadist group that grew out of al-Qaeda in Iraq, declared a caliphate across parts of Iraq and Syria in 2014, and directed or inspired mass-casualty attacks worldwide.",
      "metadata": {
        "founded_date": "1999",
        "headquarters": "Raqqa",
        "organization_type": "military"
      },
      "periods": [
        {
          "label": "Iraqi insurgency",
          "start": 2004,
          "end": 2013,
          "description": "Fought US forces and Shia Iraqis as al-Qaeda in Iraq and the Islamic State of Iraq."
        },
        {
          "label": "Self-declared caliphate",
          "start": 2014,
          "end": 2019,
          "description": "Ruled millions in Iraq and Syria, committed genocide against the Yazidis and ran attacks in Europe."
        }
      ],
      "why": "It held territory the size of Britain and drew tens of thousands of foreign fighters from more than eighty countries."
    },
    {
      "slug": "youtube",
      "name": "YouTube",
      "type": "organization",
      "wiki": "YouTube",
      "description": "American video-sharing platform founded in 2005 and bought by Google in 2006, with more than two billion monthly users.",
      "metadata": {
        "founded_date": "2005",
        "headquarters": "San Bruno, California, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "Video platform",
          "start": 2005,
          "end": 2026,
          "description": "Hosted user-uploaded video, shared advertising revenue with creators and added music and streaming services."
        }
      ],
      "why": "YouTube made anyone a broadcaster and became the largest source of online video, music and informal education."
    },
    {
      "slug": "2008-financial-crisis",
      "name": "2008 financial crisis",
      "type": "event",
      "wiki": "2008 financial crisis",
      "description": "Global financial crisis set off by the collapse of the US subprime mortgage market and the failure of Lehman Brothers, which caused the deepest recession since the Great Depression.",
      "metadata": {
        "start_date": "2007",
        "location": "Worldwide",
        "end_date": "2009"
      },
      "periods": [
        {
          "label": "Crisis and bailouts",
          "start": 2007,
          "end": 2009,
          "description": "Banks failed or were rescued across the US and Europe, and output fell worldwide."
        }
      ],
      "why": "It reset global finance, triggered the eurozone crisis and fed the populist politics of the 2010s."
    },
    {
      "slug": "arab-spring",
      "name": "Arab Spring",
      "type": "event",
      "wiki": "Arab Spring",
      "description": "Wave of protests and uprisings that began in Tunisia in December 2010, toppled rulers in Tunisia, Egypt, Libya and Yemen, and set off civil wars in Syria, Libya and Yemen.",
      "metadata": {
        "start_date": "2010",
        "location": "Middle East and North Africa",
        "end_date": "2012",
        "event_type": "revolution"
      },
      "periods": [
        {
          "label": "Uprisings",
          "start": 2010,
          "end": 2012,
          "description": "Mass protests spread across the Arab world, organised in part through social media."
        }
      ],
      "why": "It remade the politics of the Arab world and produced its largest refugee crisis."
    },
    {
      "slug": "crispr-gene-editing",
      "name": "CRISPR gene editing",
      "type": "event",
      "wiki": "CRISPR gene editing",
      "description": "Method for cutting and editing DNA at chosen sites with the CRISPR-Cas9 system, published by Jennifer Doudna and Emmanuelle Charpentier in 2012 and applied to human cells in 2013.",
      "metadata": {
        "start_date": "2012",
        "end_date": "2023",
        "location": "Berkeley, Umeå and Cambridge, Massachusetts",
        "event_type": "discovery"
      },
      "periods": [
        {
          "label": "Development to first approved therapy",
          "start": 2012,
          "end": 2023,
          "description": "Laboratories adapted CRISPR-Cas9 to edit cells, crops and animals, leading to approval of the sickle-cell therapy Casgevy in 2023."
        }
      ],
      "why": "CRISPR made gene editing cheap and routine across biology, medicine and agriculture."
    },
    {
      "slug": "xi-jinping",
      "name": "Xi Jinping",
      "type": "person",
      "wiki": "Xi Jinping",
      "description": "General Secretary of the Chinese Communist Party since 2012, who concentrated party and state power and abolished presidential term limits in 2018.",
      "metadata": {
        "birth_date": "1953",
        "nationality": "Chinese"
      },
      "periods": [
        {
          "label": "General Secretary of the CCP",
          "start": 2012,
          "end": 2026,
          "description": "Led the anti-corruption campaign, the Belt and Road Initiative and the Xinjiang and Hong Kong crackdowns."
        }
      ],
      "why": "He leads the world's second-largest economy and its largest military by personnel."
    },
    {
      "slug": "russo-ukrainian-war",
      "name": "Russo-Ukrainian war",
      "type": "event",
      "wiki": "Russo-Ukrainian war",
      "description": "War that began with Russia's annexation of Crimea and backing of separatists in Donbas in 2014 and escalated into a full-scale Russian invasion of Ukraine in February 2022.",
      "metadata": {
        "start_date": "2014",
        "location": "Ukraine",
        "event_type": "war"
      },
      "periods": [
        {
          "label": "Crimea and Donbas",
          "start": 2014,
          "end": 2021,
          "description": "Russia annexed Crimea and backed separatist forces in eastern Ukraine."
        },
        {
          "label": "Full-scale invasion",
          "start": 2022,
          "end": 2026,
          "description": "Russia invaded Ukraine, starting the largest war in Europe since 1945."
        }
      ],
      "why": "It is the largest interstate war of the century and rearmed Europe and NATO."
    },
    {
      "slug": "openai",
      "name": "OpenAI",
      "type": "organization",
      "wiki": "OpenAI",
      "description": "American artificial intelligence company founded in 2015, whose ChatGPT chatbot, released in November 2022, brought large language models to hundreds of millions of users.",
      "metadata": {
        "founded_date": "2015",
        "headquarters": "San Francisco, California, United States",
        "organization_type": "corporation"
      },
      "periods": [
        {
          "label": "AI research and products",
          "start": 2015,
          "end": 2026,
          "description": "Built the GPT language models, DALL-E and ChatGPT, funded by Microsoft and other investors."
        }
      ],
      "why": "ChatGPT started the generative AI boom that is reshaping work, education and the economy."
    },
    {
      "slug": "donald-trump",
      "name": "Donald Trump",
      "type": "person",
      "wiki": "Donald Trump",
      "description": "US president from 2017 to 2021 and again from 2025, whose nationalist and protectionist politics realigned the Republican Party and US trade and foreign policy.",
      "metadata": {
        "birth_date": "1946",
        "nationality": "American"
      },
      "periods": [
        {
          "label": "First presidency",
          "start": 2017,
          "end": 2021,
          "description": "Imposed tariffs on China, withdrew from the Paris Agreement and Iran deal, and contested his 2020 defeat."
        },
        {
          "label": "Second presidency",
          "start": 2025,
          "end": 2026,
          "description": "Imposed broad tariffs on US trading partners and cut federal agencies and foreign aid."
        }
      ],
      "why": "He has redirected the policies of the world's largest economy and military and inspired nationalist movements abroad."
    }
  ],
  "links": [
    {
      "from": "confucius",
      "to": "confucianism",
      "share": 0.6,
      "why": "Confucius's teachings are the foundation of the Confucian tradition."
    },
    {
      "from": "mencius",
      "to": "confucianism",
      "share": 0.15,
      "why": "Mencius's doctrine of innate goodness became orthodox Confucianism and his book one of its Four Books."
    },
    {
      "from": "emperor-wu-of-han",
      "to": "confucianism",
      "share": 0.05,
      "why": "Emperor Wu made Confucianism the ideology of the Chinese state and its academy."
    },
    {
      "from": "laozi",
      "to": "taoism",
      "share": 0.5,
      "why": "The Tao Te Ching is the founding scripture of Taoism."
    },
    {
      "from": "zhuang-zhou",
      "to": "taoism",
      "share": 0.2,
      "why": "The Zhuangzi is the second foundational text of Taoism."
    },
    {
      "from": "zoroaster",
      "to": "zoroastrianism",
      "share": 0.7,
      "why": "Zoroaster founded the religion and composed its oldest scriptures, the Gathas."
    },
    {
      "from": "mahavira",
      "to": "jainism",
      "share": 0.6,
      "why": "Mahavira reformed and organised the Jain community and its doctrine."
    },
    {
      "from": "mani",
      "to": "manichaeism",
      "share": 0.8,
      "why": "Mani founded Manichaeism and wrote its scriptures."
    },
    {
      "from": "zeno-of-citium",
      "to": "stoicism",
      "share": 0.5,
      "why": "Zeno founded the Stoic school in Athens."
    },
    {
      "from": "cyrus-the-great",
      "to": "achaemenid-empire",
      "share": 0.4,
      "why": "Cyrus founded the Achaemenid Empire by conquering Media, Lydia and Babylon."
    },
    {
      "from": "darius-the-great",
      "to": "achaemenid-empire",
      "share": 0.2,
      "why": "Darius gave the empire its satrapies, roads and coinage."
    },
    {
      "from": "darius-the-great",
      "to": "greco-persian-wars",
      "share": 0.15,
      "why": "Darius launched the first Persian invasion of Greece after the Ionian Revolt."
    },
    {
      "from": "sargon-of-akkad",
      "to": "akkadian-empire",
      "share": 0.6,
      "why": "Sargon founded the Akkadian Empire by conquering the Sumerian city-states."
    },
    {
      "from": "chandragupta-maurya",
      "to": "maurya-empire",
      "share": 0.4,
      "why": "Chandragupta founded the Maurya Empire by overthrowing the Nanda dynasty."
    },
    {
      "from": "chanakya",
      "to": "maurya-empire",
      "share": 0.15,
      "why": "Chanakya planned the Maurya seizure of power and organised the new state."
    },
    {
      "from": "qin-shi-huang",
      "to": "qin-dynasty",
      "share": 0.5,
      "why": "Qin Shi Huang unified China and proclaimed the Qin dynasty as its first emperor."
    },
    {
      "from": "warring-states-period",
      "to": "qin-dynasty",
      "share": 0.15,
      "why": "The Warring States wars ended in Qin's conquest of its rivals and the founding of the empire."
    },
    {
      "from": "emperor-gaozu-of-han",
      "to": "han-dynasty",
      "share": 0.3,
      "why": "Liu Bang founded the Han dynasty after defeating Xiang Yu."
    },
    {
      "from": "emperor-wu-of-han",
      "to": "han-dynasty",
      "share": 0.15,
      "why": "Emperor Wu's reign brought the Han to the height of its territory and power."
    },
    {
      "from": "emperor-wu-of-han",
      "to": "silk-road",
      "share": 0.1,
      "why": "Emperor Wu sent Zhang Qian west and secured the Hexi Corridor for trade."
    },
    {
      "from": "zhang-qian",
      "to": "silk-road",
      "share": 0.25,
      "why": "Zhang Qian's missions opened official Han contact and trade with Central Asia."
    },
    {
      "from": "hannibal",
      "to": "punic-wars",
      "share": 0.3,
      "why": "Hannibal began and led the Second Punic War, the decisive conflict of the series."
    },
    {
      "from": "ancient-carthage",
      "to": "punic-wars",
      "share": 0.2,
      "why": "Carthage's western Mediterranean empire was the stake and the losing side of the Punic Wars."
    },
    {
      "from": "punic-wars",
      "to": "roman-republic",
      "share": 0.15,
      "why": "Victory over Carthage made the Roman Republic master of the Mediterranean."
    },
    {
      "from": "babylonian-captivity",
      "to": "judaism",
      "share": 0.15,
      "why": "The exile shaped the Torah, the synagogue and the diaspora identity of Judaism."
    },
    {
      "from": "first-jewish-roman-war",
      "to": "judaism",
      "share": 0.1,
      "why": "The destruction of the Second Temple turned Judaism into the rabbinic religion of the diaspora."
    },
    {
      "from": "maimonides",
      "to": "judaism",
      "share": 0.1,
      "why": "His legal code and principles of faith became foundations of rabbinic Judaism."
    },
    {
      "from": "huns",
      "to": "fall-of-the-western-roman-empire",
      "share": 0.2,
      "why": "The Hunnic advance drove the Goths and other peoples into Roman territory."
    },
    {
      "from": "krishna",
      "to": "hinduism",
      "share": 0.15,
      "why": "Krishna devotion and the Bhagavad Gita are central to Vaishnava and wider Hindu practice."
    },
    {
      "from": "cleisthenes",
      "to": "athenian-democracy",
      "share": 0.35,
      "why": "Cleisthenes's reforms of 508 BCE created the institutions of Athenian democracy."
    },
    {
      "from": "pericles",
      "to": "athenian-democracy",
      "share": 0.15,
      "why": "Pericles extended democracy with pay for public office and led it at its height."
    },
    {
      "from": "pericles",
      "to": "peloponnesian-war",
      "share": 0.1,
      "why": "Pericles's policy and strategy took Athens into the war with Sparta."
    },
    {
      "from": "ali",
      "to": "shia-islam",
      "share": 0.45,
      "why": "Shia Islam is defined by the claim that Ali and his descendants were the rightful leaders of Islam."
    },
    {
      "from": "battle-of-karbala",
      "to": "shia-islam",
      "share": 0.2,
      "why": "The martyrdom of Husayn at Karbala turned the Shia political faction into a religious community with its central ritual."
    },
    {
      "from": "safavid-iran",
      "to": "shia-islam",
      "share": 0.2,
      "why": "The Safavids converted Iran to Twelver Shia Islam and gave the branch its largest state."
    },
    {
      "from": "rashidun-caliphate",
      "to": "early-muslim-conquests",
      "share": 0.45,
      "why": "The Rashidun caliphs directed the conquest of Persia, Syria and Egypt."
    },
    {
      "from": "umayyad-caliphate",
      "to": "early-muslim-conquests",
      "share": 0.35,
      "why": "The Umayyads carried the conquests to North Africa, Iberia, Transoxiana and Sindh."
    },
    {
      "from": "fall-of-constantinople",
      "to": "ottoman-empire",
      "share": 0.1,
      "why": "Taking Constantinople gave the Ottomans their imperial capital and claim to the Roman succession."
    },
    {
      "from": "mansa-musa",
      "to": "mali-empire",
      "share": 0.3,
      "why": "Mali reached its greatest extent and fame under Mansa Musa."
    },
    {
      "from": "mongol-empire",
      "to": "golden-horde",
      "share": 0.5,
      "why": "The Golden Horde was the western successor khanate of the divided Mongol Empire."
    },
    {
      "from": "mongol-empire",
      "to": "yuan-dynasty",
      "share": 0.3,
      "why": "The Yuan dynasty was the Mongol Empire's eastern successor state, built on its conquest of China."
    },
    {
      "from": "kublai-khan",
      "to": "yuan-dynasty",
      "share": 0.5,
      "why": "Kublai Khan founded the Yuan dynasty and completed its conquest of China."
    },
    {
      "from": "zhu-xi",
      "to": "imperial-examination",
      "share": 0.2,
      "why": "His commentaries were the required curriculum of the examinations from 1313 to 1905."
    },
    {
      "from": "sejong-the-great",
      "to": "hangul",
      "share": 0.8,
      "why": "Sejong commissioned and promulgated the Korean alphabet."
    },
    {
      "from": "guru-nanak",
      "to": "sikhism",
      "share": 0.7,
      "why": "Guru Nanak founded Sikhism and his hymns open its scripture."
    },
    {
      "from": "bhakti-movement",
      "to": "sikhism",
      "share": 0.15,
      "why": "Sikh scripture includes the hymns of bhakti saints such as Kabir, and Sikhism shares the movement's devotion and rejection of caste."
    },
    {
      "from": "akbar",
      "to": "mughal-empire",
      "share": 0.25,
      "why": "Akbar built the administration and alliances that made the Mughal Empire last."
    },
    {
      "from": "aurangzeb",
      "to": "mughal-empire",
      "share": 0.15,
      "why": "Aurangzeb brought the empire to its greatest size and set the course of its decline."
    },
    {
      "from": "vladimir-the-great",
      "to": "eastern-orthodox-church",
      "share": 0.15,
      "why": "The baptism of Kievan Rus' brought the East Slavs, now the church's largest population, into Orthodoxy."
    },
    {
      "from": "isabella-i-of-castile",
      "to": "spanish-empire",
      "share": 0.25,
      "why": "Isabella's union of Spain and sponsorship of Columbus began the Spanish Empire."
    },
    {
      "from": "spanish-conquest-of-the-inca-empire",
      "to": "spanish-empire",
      "share": 0.15,
      "why": "The conquest gave Spain the Andes and the Potosi silver that financed its empire."
    },
    {
      "from": "spanish-conquest-of-the-aztec-empire",
      "to": "spanish-empire",
      "share": 0.15,
      "why": "The conquest of the Aztecs created New Spain, the core of Spain's American empire."
    },
    {
      "from": "isabella-i-of-castile",
      "to": "spanish-inquisition",
      "share": 0.25,
      "why": "Isabella and Ferdinand requested and established the Spanish Inquisition in 1478."
    },
    {
      "from": "vasco-da-gama",
      "to": "portuguese-empire",
      "share": 0.2,
      "why": "His sea route to India founded Portugal's Asian empire."
    },
    {
      "from": "portuguese-empire",
      "to": "atlantic-slave-trade",
      "share": 0.2,
      "why": "Portugal began the Atlantic slave trade and was its largest carrier, shipping most of the enslaved Africans taken to Brazil."
    },
    {
      "from": "age-of-discovery",
      "to": "columbian-exchange",
      "share": 0.25,
      "why": "The ocean routes opened in the Age of Discovery carried the exchange of crops, animals and diseases."
    },
    {
      "from": "magellan-expedition",
      "to": "age-of-discovery",
      "share": 0.15,
      "why": "The first circumnavigation completed the charting of the world's ocean connections."
    },
    {
      "from": "east-india-company",
      "to": "british-empire",
      "share": 0.3,
      "why": "The Company conquered India, which became the center of the British Empire."
    },
    {
      "from": "seven-years-war",
      "to": "british-empire",
      "share": 0.1,
      "why": "Victory gave Britain Canada and dominance in India and made it the leading colonial power."
    },
    {
      "from": "james-cook",
      "to": "british-empire",
      "share": 0.05,
      "why": "Cook's charts and claims led to British colonies in Australia, New Zealand and the Pacific."
    },
    {
      "from": "queen-victoria",
      "to": "british-empire",
      "share": 0.1,
      "why": "Victoria reigned over the empire's greatest expansion and was its symbol as Empress of India."
    },
    {
      "from": "charlemagne",
      "to": "holy-roman-empire",
      "share": 0.3,
      "why": "His imperial coronation in 800 created the title and idea that the Holy Roman Empire continued."
    },
    {
      "from": "john-calvin",
      "to": "reformed-christianity",
      "share": 0.6,
      "why": "Calvin's Institutes and Genevan church became the doctrine and model of the Reformed churches."
    },
    {
      "from": "protestant-reformation",
      "to": "reformed-christianity",
      "share": 0.25,
      "why": "Reformed Christianity was one of the main branches the Reformation produced."
    },
    {
      "from": "protestant-reformation",
      "to": "church-of-england",
      "share": 0.25,
      "why": "The Church of England's break with Rome and Protestant doctrine came out of the Reformation."
    },
    {
      "from": "elizabeth-i",
      "to": "church-of-england",
      "share": 0.15,
      "why": "Her Religious Settlement of 1559 fixed the doctrine and worship of the Church of England."
    },
    {
      "from": "protestant-reformation",
      "to": "counter-reformation",
      "share": 0.4,
      "why": "The Counter-Reformation was the Catholic Church's response to Protestant reform."
    },
    {
      "from": "thirty-years-war",
      "to": "peace-of-westphalia",
      "share": 0.6,
      "why": "The Peace of Westphalia was the settlement that ended the Thirty Years' War."
    },
    {
      "from": "joan-of-arc",
      "to": "hundred-years-war",
      "share": 0.1,
      "why": "Her relief of Orléans and the coronation of Charles VII turned the war toward French victory."
    },
    {
      "from": "rene-descartes",
      "to": "age-of-enlightenment",
      "share": 0.1,
      "why": "His rationalism and method of doubt were a starting point for Enlightenment philosophy."
    },
    {
      "from": "johannes-kepler",
      "to": "scientific-revolution",
      "share": 0.1,
      "why": "His laws of planetary motion were a central result of the Scientific Revolution."
    },
    {
      "from": "francis-bacon",
      "to": "scientific-revolution",
      "share": 0.05,
      "why": "His program of experiment and induction became the method of the new science."
    },
    {
      "from": "toussaint-louverture",
      "to": "haitian-revolution",
      "share": 0.4,
      "why": "Toussaint built and commanded the revolutionary army that turned the slave uprising into a revolution."
    },
    {
      "from": "haitian-revolution",
      "to": "abolitionism",
      "share": 0.1,
      "why": "The success of the enslaved in Saint-Domingue gave abolitionists proof that slavery could end and frightened slaveholding powers."
    },
    {
      "from": "frederick-douglass",
      "to": "abolitionism",
      "share": 0.1,
      "why": "Douglass was the movement's most prominent formerly enslaved speaker and writer."
    },
    {
      "from": "william-wilberforce",
      "to": "abolitionism",
      "share": 0.15,
      "why": "Wilberforce led the British parliamentary campaign that produced the first major national abolition of the slave trade."
    },
    {
      "from": "harriet-beecher-stowe",
      "to": "abolitionism",
      "share": 0.08,
      "why": "Uncle Tom's Cabin brought abolitionist arguments to millions of readers."
    },
    {
      "from": "harriet-tubman",
      "to": "abolitionism",
      "share": 0.05,
      "why": "Tubman's rescues on the Underground Railroad gave the movement its best-known direct action."
    },
    {
      "from": "simon-bolivar",
      "to": "spanish-american-wars-of-independence",
      "share": 0.35,
      "why": "Bolívar led the campaigns that freed northern South America and the final defeat of Spain in Peru."
    },
    {
      "from": "miguel-hidalgo-y-costilla",
      "to": "mexican-war-of-independence",
      "share": 0.3,
      "why": "Hidalgo's Cry of Dolores started the war and his insurgency made independence the goal."
    },
    {
      "from": "george-washington",
      "to": "american-revolution",
      "share": 0.15,
      "why": "Washington commanded the Continental Army through the whole war and kept it in the field."
    },
    {
      "from": "thomas-paine",
      "to": "american-revolution",
      "share": 0.08,
      "why": "Common Sense moved colonial opinion from reconciliation to independence in 1776."
    },
    {
      "from": "thomas-jefferson",
      "to": "american-revolution",
      "share": 0.1,
      "why": "Jefferson wrote the Declaration of Independence that stated the revolution's aims."
    },
    {
      "from": "seven-years-war",
      "to": "american-revolution",
      "share": 0.1,
      "why": "The war's debts led Britain to tax the colonies, and France's defeat removed the threat that had bound them to Britain."
    },
    {
      "from": "george-washington",
      "to": "united-states",
      "share": 0.1,
      "why": "As first president Washington set up the federal government and its lasting precedents."
    },
    {
      "from": "constitution-of-the-united-states",
      "to": "united-states",
      "share": 0.15,
      "why": "The Constitution created the federal government under which the United States has operated since 1789."
    },
    {
      "from": "montesquieu",
      "to": "constitution-of-the-united-states",
      "share": 0.2,
      "why": "The framers built the Constitution on Montesquieu's separation of executive, legislative and judicial powers."
    },
    {
      "from": "jean-jacques-rousseau",
      "to": "french-revolution",
      "share": 0.15,
      "why": "The revolutionaries took their doctrine of popular sovereignty and the general will from Rousseau."
    },
    {
      "from": "declaration-of-the-rights-of-man-and-of-the-citizen",
      "to": "universal-declaration-of-human-rights",
      "share": 0.1,
      "why": "The 1789 Declaration was a direct model for the universal rights language of the 1948 Declaration."
    },
    {
      "from": "abraham-lincoln",
      "to": "american-civil-war",
      "share": 0.3,
      "why": "Lincoln's election triggered secession and his leadership directed the Union to victory and emancipation."
    },
    {
      "from": "george-stephenson",
      "to": "industrial-revolution",
      "share": 0.08,
      "why": "Stephenson's steam railways carried the Industrial Revolution's coal, goods and workers."
    },
    {
      "from": "thomas-edison",
      "to": "second-industrial-revolution",
      "share": 0.15,
      "why": "Edison's electric lighting, power stations and research laboratory drove electrification."
    },
    {
      "from": "nikola-tesla",
      "to": "second-industrial-revolution",
      "share": 0.1,
      "why": "Tesla's alternating-current motor and polyphase system made long-distance power transmission possible."
    },
    {
      "from": "alexander-graham-bell",
      "to": "second-industrial-revolution",
      "share": 0.08,
      "why": "Bell's telephone was one of the defining new technologies of the era."
    },
    {
      "from": "carl-benz",
      "to": "second-industrial-revolution",
      "share": 0.08,
      "why": "Benz's motorwagen introduced the internal-combustion automobile."
    },
    {
      "from": "john-d-rockefeller",
      "to": "second-industrial-revolution",
      "share": 0.06,
      "why": "Rockefeller's Standard Oil organized the petroleum industry that fuelled the era."
    },
    {
      "from": "michael-faraday",
      "to": "second-industrial-revolution",
      "share": 0.1,
      "why": "Faraday's discovery of induction is the principle behind the generators and motors of electrification."
    },
    {
      "from": "hong-xiuquan",
      "to": "taiping-rebellion",
      "share": 0.5,
      "why": "Hong founded the Taiping faith and led the Heavenly Kingdom for the whole of the war."
    },
    {
      "from": "east-india-company",
      "to": "opium-wars",
      "share": 0.15,
      "why": "The Company's Bengal opium monopoly supplied the trade that China tried to ban."
    },
    {
      "from": "east-india-company",
      "to": "british-raj",
      "share": 0.25,
      "why": "The Raj took over the territory, army and administration the Company had built."
    },
    {
      "from": "indian-rebellion-of-1857",
      "to": "british-raj",
      "share": 0.15,
      "why": "The rebellion led Parliament to abolish Company rule and place India under the Crown in 1858."
    },
    {
      "from": "indian-rebellion-of-1857",
      "to": "indian-independence-movement",
      "share": 0.1,
      "why": "The rebellion became the founding memory of Indian resistance to British rule."
    },
    {
      "from": "indian-national-congress",
      "to": "indian-independence-movement",
      "share": 0.3,
      "why": "Congress was the main organization through which the independence movement was conducted."
    },
    {
      "from": "lakshmibai-rani-of-jhansi",
      "to": "indian-rebellion-of-1857",
      "share": 0.1,
      "why": "The Rani led one of the rebellion's principal centres of resistance in central India."
    },
    {
      "from": "meiji-restoration",
      "to": "empire-of-japan",
      "share": 0.5,
      "why": "The Restoration created the centralized imperial state, army and industry of the Empire of Japan."
    },
    {
      "from": "hirohito",
      "to": "empire-of-japan",
      "share": 0.2,
      "why": "Japan's wartime expansion was carried out in Hirohito's name and with his sanction."
    },
    {
      "from": "leopold-ii-of-belgium",
      "to": "congo-free-state",
      "share": 0.6,
      "why": "Leopold founded, owned and directed the Congo Free State."
    },
    {
      "from": "otto-von-bismarck",
      "to": "german-empire",
      "share": 0.35,
      "why": "Bismarck unified Germany through war and designed the constitution of the empire."
    },
    {
      "from": "german-empire",
      "to": "world-war-i",
      "share": 0.15,
      "why": "The German Empire's naval race, alliance with Austria-Hungary and war plans were central causes of the First World War."
    },
    {
      "from": "muhammad-ibn-abd-al-wahhab",
      "to": "wahhabism",
      "share": 0.6,
      "why": "Ibn Abd al-Wahhab founded the movement and wrote its core doctrine."
    },
    {
      "from": "john-wesley",
      "to": "methodism",
      "share": 0.6,
      "why": "Wesley founded and organized the Methodist movement."
    },
    {
      "from": "joseph-smith",
      "to": "church-of-jesus-christ-of-latter-day-saints",
      "share": 0.5,
      "why": "Smith founded the church and produced its scriptures."
    },
    {
      "from": "mary-shelley",
      "to": "frankensteins-monster",
      "share": 0.5,
      "why": "Shelley created the monster in her 1818 novel."
    },
    {
      "from": "peter-the-great",
      "to": "russian-empire",
      "share": 0.3,
      "why": "Peter proclaimed the empire and built its army, navy, bureaucracy and capital."
    },
    {
      "from": "catherine-the-great",
      "to": "russian-empire",
      "share": 0.15,
      "why": "Catherine extended the empire to the Black Sea and into Poland."
    },
    {
      "from": "sun-yat-sen",
      "to": "xinhai-revolution",
      "share": 0.5,
      "why": "Sun's Tongmenghui organised the revolutionary movement that the 1911 uprisings carried out."
    },
    {
      "from": "world-war-i",
      "to": "treaty-of-versailles",
      "share": 0.6,
      "why": "The treaty was the settlement of Germany's defeat in the war."
    },
    {
      "from": "world-war-i",
      "to": "armenian-genocide",
      "share": 0.3,
      "why": "The Ottoman government carried out the genocide under cover of the war."
    },
    {
      "from": "world-war-i",
      "to": "partition-of-the-ottoman-empire",
      "share": 0.5,
      "why": "The Ottoman defeat in the war produced the partition of its territories."
    },
    {
      "from": "world-war-i",
      "to": "league-of-nations",
      "share": 0.2,
      "why": "The war's destruction drove the creation of a body to prevent another."
    },
    {
      "from": "woodrow-wilson",
      "to": "league-of-nations",
      "share": 0.4,
      "why": "Wilson made the League the centrepiece of his Fourteen Points and the peace settlement."
    },
    {
      "from": "treaty-of-versailles",
      "to": "league-of-nations",
      "share": 0.2,
      "why": "The treaty's first part was the Covenant that established the League."
    },
    {
      "from": "treaty-of-versailles",
      "to": "world-war-ii",
      "share": 0.1,
      "why": "German resentment of the treaty's terms fuelled the Nazi rise and its revisionist war."
    },
    {
      "from": "league-of-nations",
      "to": "united-nations",
      "share": 0.2,
      "why": "The UN was designed as a stronger successor to the failed League."
    },
    {
      "from": "mao-zedong",
      "to": "chinese-communist-party",
      "share": 0.25,
      "why": "Mao led the party from the Long March and shaped it into the ruling party of China."
    },
    {
      "from": "russian-revolution",
      "to": "chinese-communist-party",
      "share": 0.2,
      "why": "The Bolshevik victory and the Comintern inspired and organised the founding of the Chinese party."
    },
    {
      "from": "mao-zedong",
      "to": "chinese-civil-war",
      "share": 0.25,
      "why": "Mao commanded the Communist strategy that won the civil war."
    },
    {
      "from": "chiang-kai-shek",
      "to": "chinese-civil-war",
      "share": 0.2,
      "why": "Chiang's purge of the Communists in 1927 began the war, and he led the Nationalist side."
    },
    {
      "from": "francisco-franco",
      "to": "spanish-civil-war",
      "share": 0.3,
      "why": "Franco led the military uprising and the Nationalist side to victory."
    },
    {
      "from": "empire-of-japan",
      "to": "second-sino-japanese-war",
      "share": 0.4,
      "why": "Japan's imperial expansion into China caused and sustained the war."
    },
    {
      "from": "muhammad-ali-jinnah",
      "to": "partition-of-india",
      "share": 0.35,
      "why": "Jinnah's demand for Pakistan made partition the terms of independence."
    },
    {
      "from": "harry-s-truman",
      "to": "atomic-bombings-of-hiroshima-and-nagasaki",
      "share": 0.15,
      "why": "Truman authorised the use of the bombs on Japan."
    },
    {
      "from": "harry-s-truman",
      "to": "marshall-plan",
      "share": 0.2,
      "why": "Truman's administration designed and secured the funding for the plan."
    },
    {
      "from": "world-war-ii",
      "to": "marshall-plan",
      "share": 0.3,
      "why": "The plan existed to rebuild the economies the war had destroyed."
    },
    {
      "from": "harry-s-truman",
      "to": "nato",
      "share": 0.15,
      "why": "Truman committed the United States to its first peacetime alliance in Europe."
    },
    {
      "from": "cold-war",
      "to": "nato",
      "share": 0.3,
      "why": "NATO was formed to counter Soviet power in Europe."
    },
    {
      "from": "world-war-ii",
      "to": "nuremberg-trials",
      "share": 0.4,
      "why": "The trials prosecuted the crimes of the Nazi leadership in the war."
    },
    {
      "from": "world-war-ii",
      "to": "bretton-woods-system",
      "share": 0.25,
      "why": "The Allies designed the system to avoid the economic breakdown that preceded the war."
    },
    {
      "from": "bretton-woods-system",
      "to": "international-monetary-fund",
      "share": 0.5,
      "why": "The Bretton Woods conference created the IMF to manage the new monetary order."
    },
    {
      "from": "world-war-ii",
      "to": "european-union",
      "share": 0.25,
      "why": "European integration was built to make another war between France and Germany impossible."
    },
    {
      "from": "marshall-plan",
      "to": "european-union",
      "share": 0.1,
      "why": "The plan required European cooperation and created the first institutions of economic integration."
    },
    {
      "from": "world-war-ii",
      "to": "decolonisation-of-africa",
      "share": 0.2,
      "why": "The war exhausted the colonial powers and mobilised African soldiers and nationalists."
    },
    {
      "from": "kwame-nkrumah",
      "to": "decolonisation-of-africa",
      "share": 0.15,
      "why": "Ghana's independence under Nkrumah opened the wave and he championed liberation across the continent."
    },
    {
      "from": "cold-war",
      "to": "korean-war",
      "share": 0.3,
      "why": "The superpower division of Korea and their backing of each side made the war."
    },
    {
      "from": "kim-il-sung",
      "to": "korean-war",
      "share": 0.3,
      "why": "Kim launched the invasion of South Korea in June 1950."
    },
    {
      "from": "cold-war",
      "to": "vietnam-war",
      "share": 0.3,
      "why": "US containment policy turned a war of decolonisation into a Cold War battleground."
    },
    {
      "from": "ho-chi-minh",
      "to": "vietnam-war",
      "share": 0.35,
      "why": "Ho led the North Vietnamese state and movement that fought the war."
    },
    {
      "from": "fidel-castro",
      "to": "cuban-revolution",
      "share": 0.45,
      "why": "Castro founded and led the movement that carried out the revolution."
    },
    {
      "from": "che-guevara",
      "to": "cuban-revolution",
      "share": 0.2,
      "why": "Guevara was one of the revolution's principal guerrilla commanders."
    },
    {
      "from": "cuban-revolution",
      "to": "cuban-missile-crisis",
      "share": 0.2,
      "why": "Cuba's alignment with the Soviet Union after the revolution made the missile deployment possible."
    },
    {
      "from": "nikita-khrushchev",
      "to": "cuban-missile-crisis",
      "share": 0.25,
      "why": "Khrushchev decided to place nuclear missiles in Cuba."
    },
    {
      "from": "john-f-kennedy",
      "to": "cuban-missile-crisis",
      "share": 0.2,
      "why": "Kennedy chose the quarantine and the secret bargain that ended the crisis."
    },
    {
      "from": "cold-war",
      "to": "cuban-missile-crisis",
      "share": 0.2,
      "why": "The crisis was the sharpest confrontation of the superpower rivalry."
    },
    {
      "from": "pol-pot",
      "to": "cambodian-genocide",
      "share": 0.5,
      "why": "Pol Pot led the regime and set the policies that carried out the killing."
    },
    {
      "from": "vietnam-war",
      "to": "cambodian-genocide",
      "share": 0.1,
      "why": "The war's spread into Cambodia and US bombing there helped bring the Khmer Rouge to power."
    },
    {
      "from": "ruhollah-khomeini",
      "to": "iranian-revolution",
      "share": 0.45,
      "why": "Khomeini led the revolution and set its Islamist direction."
    },
    {
      "from": "deng-xiaoping",
      "to": "chinese-economic-reform",
      "share": 0.6,
      "why": "Deng launched and directed the reforms."
    },
    {
      "from": "cold-war",
      "to": "soviet-afghan-war",
      "share": 0.3,
      "why": "The superpower rivalry drove both the Soviet intervention and US support for the mujahideen."
    },
    {
      "from": "soviet-union",
      "to": "soviet-afghan-war",
      "share": 0.25,
      "why": "The Soviet leadership decided to invade and occupy Afghanistan."
    },
    {
      "from": "soviet-afghan-war",
      "to": "taliban",
      "share": 0.25,
      "why": "The war's destruction, refugee madrasas and mujahideen networks produced the Taliban."
    },
    {
      "from": "soviet-afghan-war",
      "to": "al-qaeda",
      "share": 0.15,
      "why": "Al-Qaeda was founded from the network of Arab volunteers who fought in the war."
    },
    {
      "from": "mikhail-gorbachev",
      "to": "dissolution-of-the-soviet-union",
      "share": 0.35,
      "why": "Gorbachev's reforms unleashed the forces that broke up the union."
    },
    {
      "from": "revolutions-of-1989",
      "to": "dissolution-of-the-soviet-union",
      "share": 0.2,
      "why": "The fall of the satellite regimes encouraged the Soviet republics to break away."
    },
    {
      "from": "mikhail-gorbachev",
      "to": "revolutions-of-1989",
      "share": 0.3,
      "why": "Gorbachev's refusal to send Soviet troops allowed the revolutions to succeed."
    },
    {
      "from": "war-on-terror",
      "to": "iraq-war",
      "share": 0.3,
      "why": "The Bush administration launched the invasion as part of the War on Terror."
    },
    {
      "from": "george-w-bush",
      "to": "iraq-war",
      "share": 0.25,
      "why": "Bush decided on and ordered the invasion of Iraq."
    },
    {
      "from": "iraq-war",
      "to": "islamic-state",
      "share": 0.4,
      "why": "The occupation and sectarian war in Iraq produced the group and its recruits."
    },
    {
      "from": "al-qaeda",
      "to": "islamic-state",
      "share": 0.25,
      "why": "The Islamic State began as al-Qaeda's franchise in Iraq."
    },
    {
      "from": "vladimir-putin",
      "to": "russo-ukrainian-war",
      "share": 0.4,
      "why": "Putin ordered the annexation of Crimea and the full-scale invasion."
    },
    {
      "from": "dissolution-of-the-soviet-union",
      "to": "russo-ukrainian-war",
      "share": 0.15,
      "why": "The war is a contest over the borders and loyalties left by the Soviet breakup."
    },
    {
      "from": "david-ben-gurion",
      "to": "israel",
      "share": 0.35,
      "why": "Ben-Gurion led the founding of the state and built its institutions."
    },
    {
      "from": "emmeline-pankhurst",
      "to": "womens-suffrage",
      "share": 0.15,
      "why": "Pankhurst's suffragettes made women's votes an unavoidable issue in Britain and abroad."
    },
    {
      "from": "rosa-parks",
      "to": "civil-rights-movement",
      "share": 0.1,
      "why": "Her arrest began the Montgomery bus boycott that launched the mass movement."
    },
    {
      "from": "rwandan-genocide",
      "to": "second-congo-war",
      "share": 0.3,
      "why": "Génocidaires who fled into the Congo and Rwanda's pursuit of them set off the Congo wars."
    },
    {
      "from": "walt-disney",
      "to": "walt-disney-company",
      "share": 0.4,
      "why": "Walt Disney co-founded the company and ran its studio and parks until his death."
    },
    {
      "from": "walt-disney",
      "to": "mickey-mouse",
      "share": 0.5,
      "why": "Walt Disney co-created Mickey Mouse with Ub Iwerks and voiced him until 1947."
    },
    {
      "from": "bill-gates",
      "to": "microsoft",
      "share": 0.35,
      "why": "Gates co-founded Microsoft and led it through the MS-DOS and Windows era."
    },
    {
      "from": "bill-gates",
      "to": "gates-foundation",
      "share": 0.6,
      "why": "Gates co-founded the foundation and supplied most of its endowment."
    },
    {
      "from": "norman-borlaug",
      "to": "green-revolution",
      "share": 0.35,
      "why": "Borlaug's semi-dwarf wheat and seed program in South Asia drove the Green Revolution."
    },
    {
      "from": "rockefeller-foundation",
      "to": "green-revolution",
      "share": 0.2,
      "why": "The foundation funded the Mexican wheat program and the rice institute that produced the high-yield varieties."
    },
    {
      "from": "haber-process",
      "to": "green-revolution",
      "share": 0.15,
      "why": "The high-yield varieties were bred to respond to synthetic nitrogen fertilizer made by the Haber process."
    },
    {
      "from": "alexander-fleming",
      "to": "penicillin",
      "share": 0.45,
      "why": "Fleming discovered penicillin's antibacterial action in 1928."
    },
    {
      "from": "jonas-salk",
      "to": "polio-vaccine",
      "share": 0.5,
      "why": "Salk developed the first licensed polio vaccine."
    },
    {
      "from": "margaret-sanger",
      "to": "combined-oral-contraceptive-pill",
      "share": 0.2,
      "why": "Sanger recruited Gregory Pincus and brought in Katharine McCormick's money for the pill research."
    },
    {
      "from": "bell-labs",
      "to": "transistor",
      "share": 0.5,
      "why": "The transistor was invented by a Bell Labs solid-state physics team."
    },
    {
      "from": "nuclear-fission",
      "to": "manhattan-project",
      "share": 0.25,
      "why": "The discovery of fission showed that a uranium chain reaction and an atomic bomb were possible."
    },
    {
      "from": "nuclear-fission",
      "to": "chernobyl-disaster",
      "share": 0.15,
      "why": "Chernobyl was a runaway fission reaction in a power reactor."
    },
    {
      "from": "sputnik-1",
      "to": "space-race",
      "share": 0.25,
      "why": "Sputnik's launch started the US-Soviet competition in space."
    },
    {
      "from": "sputnik-1",
      "to": "nasa",
      "share": 0.3,
      "why": "Congress created NASA in 1958 in direct response to Sputnik."
    },
    {
      "from": "nasa",
      "to": "apollo-11",
      "share": 0.5,
      "why": "NASA designed, built and flew the Apollo 11 mission."
    },
    {
      "from": "wall-street-crash-of-1929",
      "to": "great-depression",
      "share": 0.3,
      "why": "The crash destroyed wealth and confidence and began the slide into the Depression."
    },
    {
      "from": "openai",
      "to": "artificial-intelligence",
      "share": 0.15,
      "why": "OpenAI's GPT models and ChatGPT launched the generative AI era."
    },
    {
      "from": "geoffrey-hinton",
      "to": "artificial-intelligence",
      "share": 0.15,
      "why": "Hinton's neural network research produced the deep learning methods behind modern AI."
    },
    {
      "from": "fritz-haber",
      "to": "haber-process",
      "share": 0.6,
      "why": "Haber devised and demonstrated the ammonia synthesis that bears his name."
    },
    {
      "from": "jennifer-doudna",
      "to": "crispr-gene-editing",
      "share": 0.4,
      "why": "Doudna co-published the 2012 paper that turned CRISPR-Cas9 into a programmable editing tool."
    },
    {
      "from": "ian-fleming",
      "to": "james-bond",
      "share": 0.7,
      "why": "Fleming created James Bond and wrote the novels the films are based on."
    },
    {
      "from": "ruth-handler",
      "to": "barbie",
      "share": 0.6,
      "why": "Handler conceived Barbie and pushed Mattel to produce and market her."
    },
    {
      "from": "jeff-bezos",
      "to": "amazon",
      "share": 0.4,
      "why": "Bezos founded Amazon and ran it as chief executive for 27 years."
    },
    {
      "from": "jack-ma",
      "to": "alibaba-group",
      "share": 0.4,
      "why": "Ma co-founded Alibaba and led it through the creation of Taobao and Alipay."
    },
    {
      "from": "dj-kool-herc",
      "to": "hip-hop",
      "share": 0.25,
      "why": "Kool Herc's extended breakbeats at Bronx parties started hip-hop music and dance."
    },
    {
      "from": "niels-bohr",
      "to": "quantum-mechanics",
      "share": 0.25,
      "why": "Bohr's quantum atom and his Copenhagen institute drove the development of quantum mechanics."
    },
    {
      "from": "lise-meitner",
      "to": "nuclear-fission",
      "share": 0.3,
      "why": "Meitner began the uranium experiments with Hahn and gave fission its theoretical explanation."
    },
    {
      "from": "united-nations",
      "to": "unicef",
      "share": 0.35,
      "why": "The UN General Assembly created UNICEF in 1946 as one of its agencies."
    },
    {
      "from": "world-health-organization",
      "to": "oral-rehydration-therapy",
      "share": 0.2,
      "why": "WHO set the standard oral rehydration salts formula and promoted it worldwide."
    }
  ]
};

export default content;
