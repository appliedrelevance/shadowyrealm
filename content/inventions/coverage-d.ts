/**
 * Prior Art coverage batch d: materials and weapons. Glass, brick, pottery,
 * porcelain, stainless steel and the first plastics, with Wallace Carothers and
 * DuPont; the sword, bow, crossbow and catapult, the bomb, the land mine, the
 * tank and the thermonuclear weapon. Links run into these entries from bronze,
 * ferrous metallurgy, gunpowder, the cannon, the internal combustion engine and
 * the nuclear weapon, and out of them into the lens, eyeglasses, the phonograph
 * and chlorofluorocarbons.
 */
import type { InventionsContent, InventionsLink } from "../types";

export const coverageD: InventionsContent = {
  entities: [
    // ---------- Ceramics and glass ----------
    {
      slug: "pottery",
      name: "Pottery",
      type: "invention",
      wiki: "Pottery",
      description: "Vessels and other objects shaped from clay and fired hard, one of the oldest human inventions, made for storage, cooking, tableware and art.",
      metadata: { invented_date: "18,000 BCE", place: "Jiangxi, China", field: "ceramics" },
      periods: [
        {
          label: "Ice Age and Neolithic pots",
          start: -10000,
          end: -5001,
          description: "Pottery vessels, first made by hunter-gatherers in Jiangxi, China, by 18,000 BC, appeared independently in Jōmon Japan, the Russian Far East, Mali by 9400 BC and South America, and were used to store wild cereals. Fertile Crescent potters made pots from the 7th millennium BC, and by 5000 BC pottery was widespread across the region.",
        },
        {
          label: "The potter's wheel and the kiln",
          start: -5000,
          end: 999,
          description: "The potter's wheel, from the middle of the 5th millennium BC in Ukraine, and kilns firing to 1,200 °C let small groups of potters supply whole cities with storage jars, cooking pots and painted wares. China made glazed stoneware from the 15th century BC, and Roman potteries mass-produced moulded Samian ware.",
        },
        {
          label: "Glazes and fine wares",
          start: 1000,
          end: 1719,
          description: "Song potters perfected high-fired wares, tin-glazed Hispano-Moresque ware from Spain became a luxury for late medieval elites and was adapted in Renaissance Italy as maiolica, and Chinese and Japanese export porcelain set Europe's standard for fine pottery in the 17th century.",
        },
        {
          label: "Factory potteries",
          start: 1720,
          end: 2026,
          description: "British potteries used calcined flint from 1720, whose dust caused the silicosis called potter's rot, and lead glazes poisoned workers, whom UK law first protected in 1864; Stoke-on-Trent's 200 potteries employed 20,000 workers by 1785. In a 2022 study, 55% of 106 UK pottery workers had silicosis.",
        },
      ],
    },
    {
      slug: "porcelain",
      name: "Porcelain",
      type: "invention",
      wiki: "Porcelain",
      description: "A hard, white, translucent ceramic fired from kaolin at 1,200 to 1,400 °C, invented in China and prized worldwide as china.",
      metadata: { invented_date: "Eastern Han dynasty (25–220 CE)", place: "China", field: "ceramics" },
      periods: [
        {
          label: "Chinese porcelain",
          start: 25,
          end: 959,
          description: "Chinese potters developed the glazed proto-porcelain of the Shang into high-fired porcelain by the Eastern Han dynasty, and by the late Sui and early Tang reached the whiteness and translucency of wares exported to the Islamic world.",
        },
        {
          label: "Song kilns and the Ming export trade",
          start: 960,
          end: 1707,
          description: "Song dragon kilns fired as many as 25,000 pieces at a time, and over 100,000 by the dynasty's end; Ming Jingdezhen blue-and-white reached Asia, Africa and Europe by the Silk Road and, from 1517 and 1598, on Portuguese and Dutch ships. Korean potters taken captive in the Japanese invasions of 1592–1598 started Japanese porcelain at Arita.",
        },
        {
          label: "European and industrial porcelain",
          start: 1708,
          end: 2026,
          description: "Tschirnhaus and Böttger made Europe's first hard-paste porcelain in Saxony in 1708, Meissen opened in 1710, and factories followed across Europe, among them Thomas Frye's bone china, patented in 1749. Porcelain has insulated electric lines since 1878, and porcelain tableware was a US$22.1 billion market in 2021.",
        },
      ],
    },
    {
      slug: "brick",
      name: "Brick",
      type: "invention",
      wiki: "Brick",
      description: "A block of clay, sun-dried or fired in a kiln, laid in mortar to build walls, pavements and other masonry.",
      metadata: { invented_date: "7500 BCE", place: "Upper Tigris and southeast Anatolia", field: "construction" },
      periods: [
        {
          label: "Mudbrick",
          start: -7500,
          end: -5001,
          description: "The oldest bricks, shaped mud from before 7500 BC, were found on the upper Tigris and in southeast Anatolia, and sun-dried mudbrick built Çatalhöyük from 7400 BC, Jericho from 7200 BC and Mehrgarh from 7000 BC.",
        },
        {
          label: "Fired brick in the first cities",
          start: -5000,
          end: -1,
          description: "Mesopotamians fired bricks between 5000 and 4500 BC and the Daxi culture at Chengtoushan in China by 4400 BC, Indus cities built the Great Bath at Mohenjo-daro of standard 1:2:4 bricks, and glazed fired bricks built Babylon. The pits of the Terracotta Army were paved with 230,000 bricks, the first mass-produced in China.",
        },
        {
          label: "Roman and Gothic brick",
          start: 1,
          end: 1799,
          description: "Rome mass-produced standardised fired bricks from the early 1st century and its legions ran mobile kilns across the empire, Han China built city walls of fired brick, and brick Gothic architecture flourished in northern European lands without building stone.",
        },
        {
          label: "Machine-made brick",
          start: 1800,
          end: 2026,
          description: "Factory building in the Industrial Revolution made brick England's preferred material, the first brickmaking machines of 1852 and 1855 made up to 25,000 bricks a day, and the Hudson River's 130 brickyards made a billion bricks a year for New York at their peak. Unreinforced brick failed in the 1906 San Francisco and 1933 Long Beach earthquakes, and steel and concrete took over tall buildings.",
        },
      ],
    },
    {
      slug: "glass",
      name: "Glass",
      type: "invention",
      wiki: "Glass",
      description: "A hard, transparent, non-crystalline solid made by melting sand with soda or potash, used for vessels, windows, lenses and optical fibre.",
      metadata: { invented_date: "mid-3rd millennium BCE", place: "Western Asia and Egypt", field: "materials" },
      periods: [
        {
          label: "Bronze Age glass",
          start: -2500,
          end: -1201,
          description: "Glassmakers in Western Asia and Egypt made beads from the mid-third millennium BC, and by the 15th century BC palace workshops in Western Asia, Crete and Egypt produced coloured ingots, core-formed vessels and beads. Glass remained a luxury until the Late Bronze Age collapse halted its making.",
          wiki: "History of glass",
        },
        {
          label: "Glassblowing and Roman glass",
          start: -900,
          end: 999,
          description: "Glassmaking revived in Syria and Cyprus in the 9th century BC, and glassblowing, discovered on the Syro-Palestinian coast in the 1st century BC, made glass vessels cheaper than pottery across the Roman world. Clear glass from Alexandria let Romans glaze windows in their grandest buildings.",
          wiki: "History of glass",
        },
        {
          label: "Stained glass, Murano and lead crystal",
          start: 1000,
          end: 1850,
          description: "From 1000 AD northern glassmakers used potash from wood ash, stained glass filled Romanesque and Gothic churches from the 12th century, and Venice moved its glassmakers to Murano in 1291, where they made clear cristallo for windows, mirrors and lenses. George Ravenscroft's lead crystal of 1674 let England overtake Venice.",
          wiki: "History of glass",
        },
        {
          label: "Float glass and mass production",
          start: 1851,
          end: 2026,
          description: "The Crystal Palace of 1851 made glass a building material, machines from 1887 made 200 bottles an hour, and Pilkington's float glass process of 1953–1957 made the flat glass of modern windows and curtain walls. Glass became optical fibre, laboratory ware, a matrix for immobilising radioactive waste and, in the 21st century, the strengthened screens of smartphones.",
        },
      ],
    },

    // ---------- Steel and plastics ----------
    {
      slug: "stainless-steel",
      name: "Stainless steel",
      type: "invention",
      wiki: "Stainless steel",
      description: "Steel alloyed with at least 10.5% chromium, which forms a self-healing film that keeps it from rusting.",
      metadata: { invented_date: "1912", place: "Essen, Germany, and Sheffield, England", field: "metallurgy" },
      periods: [
        {
          label: "Nirosta and rustless steel",
          start: 1908,
          end: 1915,
          description: "Krupp built the yacht Germania with a chrome-nickel steel hull in 1908, and on 17 October 1912 Krupp engineers Benno Strauss and Eduard Maurer patented the austenitic 18/8 steel as Nirosta. In 1913 Harry Brearley in Sheffield found a martensitic stainless steel while seeking a corrosion-resistant gun barrel.",
        },
        {
          label: "Cutlery and canopies",
          start: 1916,
          end: 1949,
          description: "Brearley and Elwood Haynes formed the American Stainless Steel Corporation in Pittsburgh, a Sheffield cutler named the alloy stainless steel, Firth Vickers' Staybrite clad the Savoy Hotel's entrance canopy in 1929, and the United States made and sold over 25,000 tons that year.",
        },
        {
          label: "Mass production",
          start: 1950,
          end: 2026,
          description: "Argon oxygen decarburization, continuous casting and the Sendzimir mill made large tonnages affordable in the 1950s and 1960s, for cookware, surgical instruments, food and chemical plants and buildings. Each kilogram made emits 2.90 kg of CO2, and welding it gives off fumes linked to lung cancer, welding fumes being classed as a Group 1 carcinogen in 2017.",
        },
      ],
    },
    {
      slug: "polyvinyl-chloride",
      name: "Polyvinyl chloride",
      type: "invention",
      wiki: "Polyvinyl chloride",
      description: "PVC or vinyl, the third most produced plastic, made rigid for pipes and window frames or flexible with plasticizers for cables, flooring and medical tubing.",
      metadata: { invented_date: "1872", field: "polymer chemistry" },
      periods: [
        {
          label: "Baumann's flask",
          start: 1872,
          end: 1925,
          description: "Eugen Baumann synthesised PVC in 1872, a white solid in a flask of vinyl chloride left out of sunlight for four weeks; in the early 20th century Ivan Ostromislensky and Fritz Klatte of Griesheim-Elektron failed to make products from the rigid, brittle polymer.",
        },
        {
          label: "Plasticised vinyl",
          start: 1926,
          end: 1969,
          description: "Waldo Semon of B.F. Goodrich plasticised PVC in 1926, with dibutyl phthalate by 1933, making the flexible vinyl of cable insulation, flooring, rainwear, records and medical tubing.",
        },
        {
          label: "Vinyl chloride and the third plastic",
          start: 1970,
          end: 2026,
          description: "In the early 1970s vinyl chloride was found to cause liver angiosarcoma in workers at a B.F. Goodrich plant near Louisville, and PVC became the third most produced plastic, 40 million tons a year, half of it pipes. Its lead stabilisers leached into drinking water and its phthalate plasticisers out of vinyl goods, and burning it with household waste raises dioxin emissions.",
        },
      ],
    },
    {
      slug: "polyethylene",
      name: "Polyethylene",
      type: "invention",
      wiki: "Polyethylene",
      description: "The most produced plastic, a polymer of ethylene first made by accident in 1898 and made industrially from 1939, used mostly for packaging.",
      metadata: { invented_date: "1933", place: "Northwich, England", field: "polymer chemistry" },
      periods: [
        {
          label: "ICI polythene",
          start: 1933,
          end: 1950,
          description: "Eric Fawcett and Reginald Gibson made polyethylene by accident at ICI's Northwich works in 1933, Michael Perrin made the process reproducible in 1935, and production from 1939 went secretly into insulation for radar cables in the Second World War. DuPont and Union Carbide began licensed large-scale production in 1944.",
        },
        {
          label: "Catalysts and high-density polyethylene",
          start: 1951,
          end: 1975,
          description: "Robert Banks and J. Paul Hogan's chromium catalyst at Phillips Petroleum in 1951 and Karl Ziegler's titanium catalyst in 1953 made polyethylene at mild temperatures and pressures, and by the end of the 1950s high-density polyethylene was made for milk jugs, detergent bottles, garbage containers and water pipes.",
        },
        {
          label: "The most produced plastic",
          start: 1976,
          end: 2026,
          description: "Metallocene catalysts, reported by Walter Kaminsky and Hansjörg Sinn in 1976, widened polyethylene into linear low-density films for bags and wraps, and by 2017 over 100 million tonnes a year made it 34% of the plastics market. It is not readily biodegradable, so discarded polyethylene persists as pollution.",
        },
      ],
    },
    {
      slug: "nylon",
      name: "Nylon",
      type: "invention",
      wiki: "Nylon",
      description: "A family of synthetic polyamides, the first commercially successful synthetic thermoplastic, spun into stockings, parachutes and carpets and moulded into machine parts.",
      metadata: { invented_date: "1935", place: "DuPont Experimental Station, Delaware", field: "polymer chemistry" },
      periods: [
        {
          label: "Nylon 66",
          start: 1935,
          end: 1939,
          description: "Wallace Carothers' team made nylon 66 at the DuPont Experimental Station on 28 February 1935; DuPont patented it in 1938, sold it first in toothbrush bristles, and opened its first nylon plant at Seaford, Delaware, in December 1939.",
        },
        {
          label: "Stockings and parachutes",
          start: 1940,
          end: 1949,
          description: "Nylon stockings sold 64 million pairs in their first year, 1940; from February 1942 nylon went to the military for parachutes, tents and tyres, and shortages after the war caused the nylon riots of 1946, when 40,000 people queued in Pittsburgh for 13,000 pairs.",
        },
        {
          label: "Blends, plastics and microplastics",
          start: 1950,
          end: 2026,
          description: "From 1950 nylon was blended with wool, cotton and polyester, moulded into gears, car engine parts and gun frames, and spun into carpets, fishing line and tyre cord, reaching 8.9 million tons a year in 2020. Discarded nylon fishing nets add to ocean debris, and nylon fragments into lasting microplastics.",
        },
      ],
    },
    {
      slug: "wallace-carothers",
      name: "Wallace Carothers",
      type: "person",
      wiki: "Wallace Carothers",
      description: "American chemist who led DuPont's polymer research, laid the groundwork for neoprene and invented nylon.",
      metadata: { birth_date: "1896", death_date: "1937", nationality: "American", field: "chemistry" },
      periods: [
        {
          label: "Teacher and theorist",
          start: 1920,
          end: 1927,
          description: "Carothers taught chemistry at Tarkio College, South Dakota and Illinois and from 1926 at Harvard, where he began thinking about polymerization.",
        },
        {
          label: "Purity Hall",
          start: 1928,
          end: 1933,
          description: "Carothers began at the DuPont Experimental Station on 6 February 1928, where his team made neoprene, the first synthetic rubber, and a superpolyester, the first synthetic silk, in 1930, and he worked out the theory of step-growth polymerization.",
        },
        {
          label: "Nylon",
          start: 1934,
          end: 1937,
          description: "Carothers turned his team to polyamides in 1934, and on 28 February 1935 Gerard Berchet, under his direction, made polyamide 6-6, nylon. Long troubled by depression, Carothers killed himself with cyanide in April 1937, sixteen months before nylon was announced.",
        },
      ],
    },
    {
      slug: "dupont",
      name: "DuPont",
      type: "organization",
      wiki: "DuPont",
      description: "American chemical company founded in 1802 to make gunpowder, which became the largest chemical company by sales and developed nylon, Teflon and Kevlar.",
      metadata: { founded_date: "1802", headquarters: "Delaware", organization_type: "company" },
      periods: [
        {
          label: "Powder mills",
          start: 1802,
          end: 1901,
          description: "Éleuthère Irénée du Pont founded the company in 1802 to make gunpowder at the Eleutherian Mills on the Brandywine near Wilmington; it supplied a third to half of the Union army's powder in the Civil War and began making dynamite in the 1880s and smokeless powder in the 1890s.",
        },
        {
          label: "Explosives trust to chemical research",
          start: 1902,
          end: 1940,
          description: "DuPont dominated the US explosives market until a 1912 antitrust ruling ordered it broken up, opened the Experimental Station in 1903 and invested $50 million in General Motors by 1919. It formed Kinetic Chemicals with GM in 1930 to make Freon and invented neoprene, nylon and Teflon.",
        },
        {
          label: "War, plutonium and new fibres",
          start: 1941,
          end: 1980,
          description: "In the Second World War DuPont employed up to 37,000 workers making 4.5 billion pounds of explosives and designed, built and ran the Hanford plutonium plant for the Manhattan Project. Afterwards it built the Savannah River Plant for the hydrogen bomb, developed Mylar, Dacron, Lycra and Kevlar, and made Agent Orange for the Vietnam War.",
        },
        {
          label: "CFCs and PFOA",
          start: 1981,
          end: 2026,
          description: "DuPont, the world's largest CFC maker in the 1980s, lobbied against their regulation until 1988, and its PFOA waste contaminated drinking water around Parkersburg, West Virginia, linked to kidney and testicular cancer. It settled 3,550 injury claims for $671 million in 2017, and 34 accidents at its US plants killed eight people between 2007 and 2014.",
        },
      ],
    },

    // ---------- Blades, bows and siege engines ----------
    {
      slug: "sword",
      name: "Sword",
      type: "invention",
      wiki: "Sword",
      description: "A long-bladed weapon for cutting or thrusting, developed from the dagger in the Bronze Age.",
      metadata: { invented_date: "3300 BCE", place: "Arslantepe, Turkey", field: "weapons" },
      periods: [
        {
          label: "Bronze swords",
          start: -3300,
          end: -1201,
          description: "The first swords, arsenical bronze blades 60 cm long, were made at Arslantepe in Turkey from 3300 BC; Minoan Crete made blades over 100 cm long by 1700 BC, and the Naue II sword spread from Northern Italy from the 13th century BC, linked by Robert Drews to the Bronze Age collapse.",
        },
        {
          label: "Iron armies",
          start: -1200,
          end: 899,
          description: "Iron, common from the 13th century BC, for the first time let entire armies carry metal weapons, among them the Greek xiphos, the Roman gladius and spatha, Han China's iron swords and India's high-carbon steel blades. Swords also served for amputation and beheading.",
        },
        {
          label: "Steel, knights and samurai",
          start: 900,
          end: 1769,
          description: "Quenched and tempered steel spread from the 10th century, the Normans added the crossguard from the 11th, the longsword was common by 1400, and Japan forged the katana for its samurai and exported more than 200,000 mass-produced swords in the 15th and 16th centuries. As firearms took over war, Renaissance civilians carried rapiers and small swords for duels.",
        },
        {
          label: "Sidearm and ceremony",
          start: 1770,
          end: 2026,
          description: "English duellists turned to pistols by 1770 and reliable handguns displaced the sword as a sidearm in the 19th century; officers carried swords into the First World War and Japanese officers into battle until 1945, and swords survive in ceremony and as the machete and the kukri.",
        },
      ],
    },
    {
      slug: "bow-and-arrow",
      name: "Bow and arrow",
      type: "invention",
      wiki: "Bow and arrow",
      description: "A ranged weapon of an elastic bow and long-shafted arrows, used for hunting and war since prehistory.",
      metadata: { invented_date: "80,000 years ago", place: "Obi-Rakhmat Grotto, Uzbekistan", field: "weapons" },
      periods: [
        {
          label: "Hunting bows",
          start: -10000,
          end: -3001,
          description: "After the last glacial period the bow spread to every inhabited region but Australasia and most of Oceania; obsidian blades in skeletons at Nataruk, Kenya, record arrows used as weapons 10,000 years ago, and the elm Holmegaard bows of Denmark date to 9,000 BCE.",
        },
        {
          label: "Weapon of armies",
          start: -3000,
          end: 1649,
          description: "Nubian archers gave their land the Egyptian name Ta-Seti, Land of the Bow, the bow was the national weapon of Persian kings, the English longbow was England's main ranged weapon from William the Conqueror to the end of the Middle Ages, and Mongol short bows conquered much of the Eurasian steppe. The bow armed hunters and armies until gunpowder weapons spread in the 16th century.",
        },
        {
          label: "Hunting and sport",
          start: 1650,
          end: 2026,
          description: "Organised warfare with bows ended in Western Europe by the mid-17th century but continued in the East and the Americas into the 19th; archery revived as a sport with London's Toxophilite Society in 1781, and bows remain in hunting, sport and tribal fighting, as in a 2009 clash in Kenya that killed four.",
        },
      ],
    },
    {
      slug: "crossbow",
      name: "Crossbow",
      type: "invention",
      wiki: "Crossbow",
      description: "A bow mounted on a stock, drawn and held by a trigger mechanism and shot by pulling the trigger.",
      metadata: { invented_date: "650 BCE", place: "China", field: "weapons" },
      periods: [
        {
          label: "Chinese and Greek crossbows",
          start: -650,
          end: 220,
          description: "Bronze crossbow locks from China date to 650 BC, Sun Bin's crossbowmen ambushed Pang Juan at Maling in 342 BC, and the Greek gastraphetes fought at Motya in 397 BC. Qin and Han armies fielded crossbows by the tens and hundreds of thousands, with mass-produced bronze triggers interchangeable between bows.",
        },
        {
          label: "Song and medieval crossbows",
          start: 221,
          end: 1524,
          description: "Song armies used crossbows two to one over bows and added a stirrup for loading, and Cham forces sacked Angkor with Chinese siege crossbows in 1177. In Europe the crossbow returned in 947, fought at Hastings in 1066 and replaced hand bows in many armies in the 12th century, until arquebuses supplanted it by 1525.",
        },
        {
          label: "Hunting and special forces",
          start: 1525,
          end: 2026,
          description: "Crossbows stayed a European hunting weapon into the 18th century and a conquistador weapon until the 1570s, and today they serve hunters, sport shooters and special forces in China, Greece, Turkey and Spain; Serbian forces used them in ambushes in the Kosovo War.",
        },
      ],
    },
    {
      slug: "catapult",
      name: "Catapult",
      type: "invention",
      wiki: "Catapult",
      description: "A device that hurls a projectile with stored tension or torsion energy, the main siege engine of ancient and medieval war.",
      metadata: { invented_date: "7th century BCE", place: "Jerusalem, Judah", field: "weapons" },
      periods: [
        {
          label: "Ancient siege engines",
          start: -750,
          end: 499,
          description: "King Uzziah of Judah had machines built to shoot great stones from Jerusalem's walls, Chinese armies used mangonels from the 5th century BC, and Greeks invented the arrow-firing catapult in 399 BC and used it at Motya in 397 BC. Torsion catapults then dominated Greek and Roman artillery, used by Alexander the Great in battle and by Rome against Syracuse and Macedon.",
        },
        {
          label: "Mangonels and trebuchets",
          start: 500,
          end: 1499,
          description: "The mangonel, carried west by the Avars, replaced torsion engines in the eastern Mediterranean by the late 6th century and spread to the Byzantines, Persians, Arabs, Franks and Saxons; trebuchets hurled stones, Greek fire and diseased carcasses at castles, as Edward I's Warwolf did at Stirling Castle in 1304.",
        },
        {
          label: "Slingshots and aircraft catapults",
          start: 1840,
          end: 2026,
          description: "Vulcanized rubber made hand-held slingshots from the 1840s, catapults threw grenades across no man's land in the First World War until mortars replaced them, and from 1917 catapults launched aircraft from warships, as they still do from aircraft carriers.",
        },
      ],
    },

    // ---------- Explosive weapons and armour ----------
    {
      slug: "bomb",
      name: "Bomb",
      type: "invention",
      wiki: "Bomb",
      description: "An explosive weapon, first made in China as cast-iron shells packed with gunpowder, now dropped from aircraft or planted as improvised devices.",
      metadata: { invented_date: "1221", place: "Jin dynasty China", field: "weapons" },
      periods: [
        {
          label: "Thunder crash bombs",
          start: 1221,
          end: 1848,
          description: "A Jurchen Jin army used cast-iron bombs packed with gunpowder against a Song city in 1221, Jin defenders of Kaifeng used thunder crash bombs at the Mongols in 1232, Song arsenals made one to two thousand iron bomb shells a month in 1257, and the Mongols used them in their invasions of Japan. The Ming Huolongjing described poison bombs and fragmentation bombs filled with iron pellets and broken porcelain.",
        },
        {
          label: "Aerial bombing",
          start: 1849,
          end: 1945,
          description: "Austrian balloons dropped bombs on Venice in 1849, Italian airmen bombed Turkish lines in Libya in 1911 and German Zeppelins bombed London from 1915. In the Second World War bombing became a major military feature, from Barnes Wallis's bouncing bomb to his ten-ton Grand Slam earthquake bombs.",
        },
        {
          label: "Guided bombs and IEDs",
          start: 1946,
          end: 2026,
          description: "Bombers and fighter-bombers came to drop cluster bombs, daisy cutters and precision-guided bombs, the most powerful non-nuclear one Russia's Father of All Bombs, while irregular forces used improvised explosive devices, car bombs and suicide vests, as in the Oklahoma City bombing.",
        },
      ],
    },
    {
      slug: "land-mine",
      name: "Land mine",
      type: "invention",
      wiki: "Land mine",
      description: "An explosive weapon concealed on or under the ground that detonates when a person or vehicle passes over or near it.",
      metadata: { invented_date: "14th century", place: "Ming China", field: "weapons" },
      periods: [
        {
          label: "Gunpowder mines",
          start: 1300,
          end: 1845,
          description: "The 14th-century Ming Huolongjing described buried bamboo mines of gunpowder and iron pellets set off by enemy footsteps, Samuel Zimmermann's Fladdermine of 1573 brought the pressure mine to Europe, and the tripwire fougasse defended fortresses in 18th-century European wars and the American Revolution.",
        },
        {
          label: "Pressure mines and high explosives",
          start: 1846,
          end: 1938,
          description: "Percussion caps made pressure mines reliable in the Crimean War, and Confederate general Gabriel Rains laid thousands of shell torpedoes from 1862. Mass-produced guncotton and TNT mines stopped tanks from the end of the First World War, and between the wars Germany built the Tellermine and the S-mine, the first bounding mine.",
        },
        {
          label: "Tens of millions of mines",
          start: 1939,
          end: 1996,
          description: "Tens of millions of mines were laid in the Second World War, half a million at El Alamein and over a million at Kursk, and Nazi forces drove captured civilians across minefields to clear them. In the Cold War mines were scattered from the air: over 37 million gravel mines were made in 1967 and 1968 and dropped unmarked in places like Vietnam.",
        },
        {
          label: "The Ottawa Treaty",
          start: 1997,
          end: 2026,
          description: "The 1997 Ottawa Treaty banned anti-personnel mines and had 162 members by 2016, though not China, Russia or the United States; the Landmine Monitor recorded over 120,000 casualties from 1999 to 2017, 87% of the 2017 casualties were civilians, and Russian and Ukrainian forces laid mines in the 2022 invasion.",
        },
      ],
    },
    {
      slug: "tank",
      name: "Tank",
      type: "invention",
      wiki: "Tank",
      description: "A tracked, armoured fighting vehicle with a heavy gun, first built to break the trench deadlock of the First World War.",
      metadata: { invented_date: "1915", place: "Lincoln, England", field: "weapons" },
      periods: [
        {
          label: "Landships",
          start: 1915,
          end: 1918,
          description: "Churchill's Landship Committee of February 1915 had William Foster & Co. of Lincoln build Little Willie and Mother, and the British Mark I first fought at Flers-Courcelette on 15 September 1916. Britain built 2,600 tanks in the war and France more than 3,000 Renault FTs, whose rotating turret and rear engine became the standard layout.",
        },
        {
          label: "Blitzkrieg",
          start: 1919,
          end: 1945,
          description: "Interwar theorists from Fuller to Guderian argued for massed tanks, which Zhukov used against the Japanese at Khalkhin Gol in 1939 and Germany in the blitzkrieg of 1940. In the Second World War, the first in which armour was critical to victory, the Soviet Union built 65,000 T-34s and the United States 42,000 Shermans.",
        },
        {
          label: "Main battle tanks",
          start: 1946,
          end: 2026,
          description: "Cold War arms races produced the main battle tank, and Cold War tanks fought proxy wars from Korea to the Yom Kippur War, the T-55 alone in 32 conflicts. Cheap anti-tank missiles and rockets, used in the Russo-Ukrainian War, have challenged the tank's future.",
        },
      ],
    },
    {
      slug: "thermonuclear-weapon",
      name: "Thermonuclear weapon",
      type: "invention",
      wiki: "Thermonuclear weapon",
      description: "The hydrogen bomb, a nuclear weapon in which a fission bomb ignites a fusion stage, typically twenty times the yield of the first atomic bombs.",
      metadata: { invented_date: "1952", place: "Enewetak Atoll", field: "nuclear physics" },
      periods: [
        {
          label: "The Super",
          start: 1941,
          end: 1951,
          description: "Enrico Fermi proposed a fusion bomb ignited by a fission bomb to Edward Teller in September 1941, and Teller worked on it through the Manhattan Project. After the first Soviet atomic test, Truman ordered its development in January 1950 over the objection of Oppenheimer's General Advisory Committee, which called it a weapon of genocide, and Teller and Stanisław Ulam devised the staged design tested in the George shot of May 1951.",
        },
        {
          label: "The megaton race",
          start: 1952,
          end: 1991,
          description: "The United States tested the 10.4-megaton Ivy Mike in 1952 and the 15-megaton Castle Bravo in 1954, the Soviet Union followed in 1955, Britain in 1957, China in 1967 and France in 1968, and the Soviet Tsar Bomba reached 50 megatons in 1961. Crashed bombers scattered plutonium over farms at Palomares in 1966 and contaminated the ice at Thule in 1968.",
        },
        {
          label: "Deterrence after the Cold War",
          start: 1992,
          end: 2026,
          description: "After the Soviet collapse Ukraine, Belarus and Kazakhstan gave up their thermonuclear weapons, and after the 1996 test ban most holders kept their stockpiles by simulation. Almost all warheads deployed by the five recognised nuclear states are thermonuclear, and India in 1998 and North Korea in 2016 and 2017 claimed hydrogen bomb tests.",
        },
      ],
    },
  ],

  links: [
    // ---------- Ceramics and glass ----------
    { from: "pottery", to: "porcelain", type: "builds_on", share: 0.3, why: "Porcelain came from centuries of Chinese experiment with high-fired pottery, from Shang proto-porcelain glazed wares to Han high-fired ware, made by the same shaping methods as earthenware and stoneware." },
    { from: "pottery", to: "glass", type: "builds_on", share: 0.1, why: "The first glass beads came out of faience-making, a vitreous glazing process taken from pottery, or from metalworking slag." },
    { from: "glass", to: "lens", type: "builds_on", share: 0.2, why: "Reading stones, the medieval magnifying lenses, were cut from glass spheres, and most lenses since have been ground from glass, though the oldest, such as the Nimrud lens, were rock crystal." },
    { from: "glass", to: "eyeglasses", type: "builds_on", share: 0.1, why: "Spectacle lenses have been ground from optical glass since the Middle Ages, and Murano's clear cristallo was made for lenses." },

    // ---------- Steel and plastics ----------
    { from: "ferrous-metallurgy", to: "stainless-steel", type: "builds_on", share: 0.25, why: "Stainless steel is iron-based steel alloyed with chromium, made in the electric furnaces and rolling mills of the steel industry." },
    { from: "general-electric", to: "stainless-steel", type: "originated", share: 0.05, why: "Christian Dantsizen of General Electric industrialised ferritic stainless steel in the United States. Rivals: Krupp's Benno Strauss and Eduard Maurer, who patented Nirosta in 1912, Harry Brearley of Sheffield, Elwood Haynes, and Frederick Becket of Union Carbide." },
    { from: "polyvinyl-chloride", to: "phonograph", type: "builds_on", share: 0.05, why: "RCA Victor pressed unbreakable records from plasticised PVC from 1931, and the 33 and 45 rpm records were made of vinyl." },
    { from: "wallace-carothers", to: "nylon", type: "originated", share: 0.45, why: "Carothers directed the DuPont polymer group that made nylon 66 in 1935, and he patented it. Rivals: Gerard Berchet, who made the first batch under him, Julian Hill, whose cold-drawing method Carothers used to develop the fibre, and Paul Schlack of IG Farben, who made nylon 6 in 1938." },
    { from: "dupont", to: "nylon", type: "originated", share: 0.3, why: "DuPont funded the fundamental research programme of 1927 that hired Carothers, and its chemical, ammonia and rayon departments together turned nylon 66 into an industrial fibre." },
    { from: "silk", to: "nylon", type: "supersedes", share: 0, why: "Nylon replaced silk in stockings and, in the Second World War, in parachutes, cutting silk imports from Japan." },
    { from: "dupont", to: "chlorofluorocarbons", type: "originated", share: 0.05, why: "DuPont joined Frigidaire and General Motors in the search for a non-toxic refrigerant that produced CFCs, made Freon through Kinetic Chemicals from 1930 and held the key Freon manufacturing patent. Rivals: Thomas Midgley of General Motors, who first synthesised CFCs, and Frigidaire, which held the first patent." },
    { from: "dupont", to: "general-motors", type: "collaboration", share: 0, why: "DuPont invested $50 million in General Motors by 1919, Pierre du Pont was GM's president and chairman, and the two formed Kinetic Chemicals in 1930 to make Freon." },
    { from: "dupont", to: "manhattan-project", type: "collaboration", share: 0, why: "DuPont designed, built and operated the Hanford plutonium production plant for the Manhattan Project from 1943." },

    // ---------- Blades, bows and siege engines ----------
    { from: "bronze", to: "sword", type: "builds_on", share: 0.2, why: "The first swords were arsenical bronze and then tin-bronze blades, which became possible only when bronze could be cast in long blades." },
    { from: "ferrous-metallurgy", to: "sword", type: "builds_on", share: 0.15, why: "Iron, common from the 13th century BC, let whole armies carry metal weapons, and quenched and tempered steel made the medieval and samurai blade." },
    { from: "bow-and-arrow", to: "crossbow", type: "builds_on", share: 0.4, why: "A crossbow is a bow mounted on a stock, whose trigger lets it hold a draw heavier than an archer could." },
    { from: "bronze", to: "crossbow", type: "builds_on", share: 0.05, why: "Chinese crossbows were shot by cast-bronze trigger locks, mass-produced to interchangeable tolerances under the Qin and Han." },
    { from: "crossbow", to: "catapult", type: "builds_on", share: 0.3, why: "Heron of Alexandria wrote that the gastraphetes, a Greek crossbow, was the forerunner of the catapult, and the first Greek catapults were strengthened bows. Rivals: the stone-throwers of Judah and the mangonels of China, built independently." },
    { from: "catapult", to: "cannon", type: "supersedes", share: 0, why: "Cannon broke walls that siege engines could not, and trebuchets fell out of use as gunpowder artillery spread in the late Middle Ages." },

    // ---------- Explosive weapons and armour ----------
    { from: "gunpowder", to: "bomb", type: "builds_on", share: 0.3, why: "The thunder crash bomb was a cast-iron shell packed with gunpowder, and the soft-shelled gunpowder bombs of the Wujing Zongyao came before it." },
    { from: "ferrous-metallurgy", to: "bomb", type: "builds_on", share: 0.05, why: "The first explosive bombs were cast-iron shells, which Song arsenals made by the thousand each month." },
    { from: "gunpowder", to: "land-mine", type: "builds_on", share: 0.25, why: "Mines were charged with gunpowder from the Ming dynasty to the American Civil War, until high explosives replaced it." },
    { from: "bomb", to: "land-mine", type: "builds_on", share: 0.1, why: "The Huolongjing's first mines were cast-iron shells filled with gunpowder, and Confederate torpedoes were artillery shells fitted with pressure caps." },
    { from: "internal-combustion-engine", to: "tank", type: "builds_on", share: 0.15, why: "The internal combustion engine, with armour plate and the continuous track, was one of the three innovations that made the tank, moving heavy armour at speed." },
    { from: "cannon", to: "tank", type: "builds_on", share: 0.05, why: "Male tanks carried naval cannon, and the tank's main armament is a large-calibre gun in a turret." },
    { from: "nuclear-weapon", to: "thermonuclear-weapon", type: "builds_on", share: 0.3, why: "A thermonuclear weapon uses a fission bomb as its primary, whose X-rays compress and ignite the fusion secondary." },
    { from: "nuclear-fission", to: "thermonuclear-weapon", type: "builds_on", share: 0.05, why: "Most of a thermonuclear weapon's yield comes from fast fission of its uranium tamper by fusion neutrons." },
    { from: "manhattan-project", to: "thermonuclear-weapon", type: "originated", share: 0.05, why: "The hydrogen bomb was the subject of basic research in the Manhattan Project, where Teller worked on the Super. Rivals: Teller and Ulam, who devised the working design in 1951, Richard Garwin, who designed Ivy Mike, and Sakharov's independent Soviet design." },
  ],
};

/** Links to or from entries assigned to other batches (see MASTER LIST), merged later. */
export const crossLinksD: InventionsLink[] = [
  { from: "tractor", to: "tank", type: "builds_on", share: 0.1, why: "The French Schneider and Saint-Chamond tanks were built on the Holt tractor, and the first British proposals were to armour the caterpillar tractors the army used to tow guns." },
  { from: "glass", to: "touchscreen", type: "builds_on", share: 0.05, why: "Smartphone and tablet touchscreens are covered with chemically strengthened glass, such as Corning's Gorilla Glass." },
];
