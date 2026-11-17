/**
 * The people and organizations behind coverage entries that no creator was credited for, where
 * Wikipedia names one (batch A, 2026-11-17), so each passes a share of its weight back to them.
 */
import type { InventionsContent } from "../types";

export const coverageOriginatorsA: InventionsContent = {
  entities: [
    // ---------- Airships ----------
    {
      slug: "henri-giffard",
      name: "Henri Giffard",
      type: "person",
      wiki: "Henri Giffard",
      description: "French engineer who made the first powered and steered airship flight in 1852 and invented the steam injector.",
      metadata: { birth_date: "1825", death_date: "1882", nationality: "French", field: "engineering" },
      periods: [
        {
          label: "Steam airship and injector",
          start: 1850,
          end: 1858,
          description: "On 24 September 1852 Giffard flew a hydrogen-filled airship driven by a 3-horsepower steam engine 27 km from Paris to Élancourt, the first powered and controlled flight, turning and circling though the wind kept him from returning; in 1858 he patented the steam injector whose theory he had set out in 1850.",
        },
        {
          label: "Honours and the Tuileries balloon",
          start: 1859,
          end: 1882,
          description: "Giffard was made a Chevalier of the Légion d'honneur in 1863 and exhibited a large captive balloon in the courtyard of the Tuileries in Paris in 1878. Losing his eyesight, he killed himself in 1882 and left his estate to the nation for humanitarian and scientific purposes.",
        },
      ],
    },
    {
      slug: "ferdinand-von-zeppelin",
      name: "Ferdinand von Zeppelin",
      type: "person",
      wiki: "Ferdinand von Zeppelin",
      description: "German general who invented the Zeppelin rigid airship and founded Luftschiffbau Zeppelin.",
      metadata: { birth_date: "1838", death_date: "1917", nationality: "German", field: "aviation" },
      periods: [
        {
          label: "Army officer",
          start: 1855,
          end: 1890,
          description: "An officer cadet of the Württemberg army from 1855, Zeppelin observed the Union Army in the American Civil War in 1863, making his first balloon ascent at St. Paul, Minnesota, and served in the Austro-Prussian and Franco-Prussian Wars; criticised for his handling of a cavalry brigade in the 1890 manoeuvres, he was forced to retire as a generalleutnant.",
        },
        {
          label: "LZ 1 to Echterdingen",
          start: 1891,
          end: 1908,
          description: "Working full time on airships from 1891, Zeppelin patented Theodor Kober's design in 1895, put 441,000 marks, over half the capital, into the company that built LZ 1, which first flew over Lake Constance on 2 July 1900, and mortgaged his wife's estates for LZ 2; after LZ 4 burned at Echterdingen in 1908, a public collection of over 6 million marks founded Luftschiffbau Zeppelin. Carl Berg's contract with David Schwarz led to allegations that Zeppelin used Schwarz's designs, which historians reject.",
        },
        {
          label: "DELAG and the war",
          start: 1909,
          end: 1917,
          description: "Zeppelin's airline DELAG carried 37,250 people on over 1,600 flights without an incident until 1914, and in the First World War Germany flew Zeppelins as long-distance bombers against Belgium, France and the United Kingdom. He also funded Flugzeugbau Friedrichshafen, set Claude Dornier to work on flying boats, and with Robert Bosch founded Versuchsbau Gotha-Ost, builder of giant aircraft such as the Zeppelin-Staaken R.VI, before he died in 1917.",
        },
      ],
    },

    // ---------- The jet airliner ----------
    {
      slug: "de-havilland-aircraft-company",
      name: "de Havilland Aircraft Company",
      type: "organization",
      wiki: "De Havilland",
      description: "British aircraft maker founded by Geoffrey de Havilland that built the Moth, the Mosquito and the Comet, the first jet airliner in service.",
      metadata: { founded_date: "1920", dissolved_date: "1963", headquarters: "Hatfield, Hertfordshire", organization_type: "company" },
      periods: [
        {
          label: "Stag Lane and the Moth",
          start: 1920,
          end: 1936,
          description: "Incorporated on 26 September 1920 at Stag Lane Aerodrome, Edgware, with £50,000 of nominal capital, the company found its market with the Moth of 1925, whose Gipsy-engined successors set many records, among them Amy Johnson's solo flight from England to Australia in 1930; its DH.88 Comet racer won the 1934 MacRobertson Air Race to Australia.",
        },
        {
          label: "Mosquito and the war",
          start: 1937,
          end: 1945,
          description: "From 1937 de Havilland made variable-pitch propellers for the RAF at Lostock, and in the Second World War it built the wooden Mosquito multirole combat aircraft, which saved aluminium, and the Hornet fighter; its Australian subsidiary built 212 Mosquitos at Bankstown from 1943 to 1948.",
        },
        {
          label: "Comet and Hawker Siddeley",
          start: 1946,
          end: 1963,
          description: "The DH.108 Swallow jet crashed in 1946, killing Geoffrey de Havilland Jr.; the Comet opened scheduled jet service from London to Johannesburg on 2 May 1952, but three crashes in two years, two from metal fatigue, grounded it in 1954, and after its return in 1958 orders dried up against the faster, more economical Boeing 707 and Douglas DC-8. Hawker Siddeley bought the company in 1960 and absorbed it in 1963, by which time it had built the Blue Streak missile, later the first stage of the cancelled Europa launcher.",
        },
      ],
    },
    {
      slug: "geoffrey-de-havilland",
      name: "Geoffrey de Havilland",
      type: "person",
      wiki: "Geoffrey de Havilland",
      description: "English aircraft designer who founded the de Havilland Aircraft Company, maker of the Moth, the Mosquito and the Comet.",
      metadata: { birth_date: "1882", death_date: "1965", nationality: "English", field: "aeronautical engineering" },
      periods: [
        {
          label: "First aircraft and Airco",
          start: 1909,
          end: 1919,
          description: "De Havilland crashed his first self-built aeroplane in December 1909 and flew his second in 1910, designed aircraft at the Royal Aircraft Factory, setting a British altitude record of 10,500 feet in his B.E.2 in 1912, and from 1914 was chief designer at Airco, whose DH aircraft the Royal Flying Corps and Royal Air Force flew in large numbers in the First World War.",
        },
        {
          label: "Moth and Mosquito",
          start: 1920,
          end: 1945,
          description: "He founded the de Havilland Aircraft Company in 1920 and test-flew its aircraft, set up de Havilland Canada in 1928 to build Moths, and in 1944 formed the de Havilland Engine Company under Frank Halford, whose Goblin powered the Vampire jet; his youngest son, John, died in a collision of two Mosquitoes in 1943.",
        },
        {
          label: "The jet age",
          start: 1946,
          end: 1965,
          description: "His son Geoffrey Jr. was killed in 1946 diving the DH 108 Swallow at or near the speed of sound, and the company's Comet became the first jet airliner in production; de Havilland retired from active involvement in 1955, remaining president, controlled the company until Hawker Siddeley bought it in 1960, and died in 1965.",
        },
      ],
    },
    {
      slug: "william-boeing",
      name: "William Boeing",
      type: "person",
      wiki: "William E. Boeing",
      description: "American timber merchant who founded the Boeing aircraft company in 1916 and the group that became United Air Lines.",
      metadata: { birth_date: "1881", death_date: "1956", nationality: "American", field: "aviation" },
      periods: [
        {
          label: "Timber",
          start: 1903,
          end: 1915,
          description: "Boeing left Yale in 1903 for the timber business at Grays Harbor, Washington, where he prospered shipping lumber to the East Coast through the Panama Canal, and after seeing his first flying machine in 1909 he took flying lessons and bought a Martin seaplane.",
        },
        {
          label: "Boeing and United Aircraft",
          start: 1916,
          end: 1934,
          description: "With George Conrad Westervelt he built the B & W Seaplane and founded Pacific Aero Products in 1916, renamed Boeing Airplane Company in 1917 with a Navy order for 50 planes, made the first international airmail delivery to the United States in 1919, and in 1929 formed United Aircraft and Transport with Frederick Rentschler. Accused by the government of monopolistic practices, he divested in 1934, when the Air Mail Act broke the group into United Aircraft, Boeing and United Air Lines.",
        },
        {
          label: "Property and horses",
          start: 1935,
          end: 1956,
          description: "Boeing turned to thoroughbred breeding and property development, and from 1935 to 1944 he and his wife subdivided land north of Seattle under racially restrictive covenants that barred sale or rental to anyone not white, except as a domestic servant; he died in 1956.",
        },
      ],
    },

    // ---------- Spaceflight ----------
    {
      slug: "elon-musk",
      name: "Elon Musk",
      type: "person",
      wiki: "Elon Musk",
      description: "Businessman who co-founded Zip2 and X.com, founded SpaceX in 2002 and has run Tesla since 2008.",
      metadata: { birth_date: "1971", nationality: "South African, Canadian and American", field: "technology business" },
      periods: [
        {
          label: "Zip2 and X.com",
          start: 1995,
          end: 2001,
          description: "Musk co-founded the web city-guide company Zip2 in 1995, which Compaq bought for $307 million in 1999, $22 million of it his, and then X.com, which merged with Confinity in 2000 to form PayPal; the board ousted him as chief executive that year.",
        },
        {
          label: "SpaceX and Tesla",
          start: 2002,
          end: 2021,
          description: "In 2002 Musk received $175.8 million from eBay's purchase of PayPal and founded SpaceX with $100 million, running it as chief executive and chief engineer: after failed launches that brought him to the edge of bankruptcy, Falcon 1 reached orbit in 2008, Dragon docked with the ISS in 2012, a Falcon 9 first stage landed in 2015, Starlink began deployment in 2019 and SpaceX flew astronauts to the ISS in 2020. He became Tesla's chief executive in 2008, co-founded OpenAI in 2015 and Neuralink in 2016, whose animal trials caused the deaths of monkeys, and in 2018 settled an SEC securities-fraud suit over his 'funding secured' tweet with $20 million fines for himself and Tesla and three years off Tesla's chair.",
        },
        {
          label: "Twitter, DOGE and politics",
          start: 2022,
          end: 2026,
          description: "Musk bought Twitter for $44 billion in October 2022, laid off much of its staff and loosened content moderation, after which hate speech rose, launched xAI in 2023, and spent $291 million as the largest donor of the 2024 US election and over $474 million in 2026, the most of any political donor in US history. As de facto head of DOGE from January to May 2025 he drove cuts to USAID that Boston University modelling linked to the deaths of 400,000 children and 200,000 adults, and in 2026 a jury found he had misled Twitter investors, while SpaceX's stock offering made him the first US-dollar trillionaire.",
        },
      ],
    },

    // ---------- The bicycle and the tyre ----------
    {
      slug: "karl-drais",
      name: "Karl Drais",
      type: "person",
      wiki: "Karl Drais",
      description: "German forest official who invented the Laufmaschine of 1817, the two-wheeled running machine from which the bicycle descends.",
      metadata: { birth_date: "1785", death_date: "1851", nationality: "German", field: "mechanical invention" },
      periods: [
        {
          label: "First vehicles",
          start: 1812,
          end: 1816,
          description: "Drais, a forest official of Baden, built a device to record piano music on paper in 1812 and two four-wheeled human-powered vehicles in 1813 and 1814, presenting the second to the Congress of Vienna.",
        },
        {
          label: "The running machine",
          start: 1817,
          end: 1821,
          description: "On 12 June 1817 Drais rode his pedal-less two-wheeled Laufmaschine from Mannheim to the Schwetzinger Relaishaus, 7 km, and back in a little over an hour; riders fleeing rutted roads took to the pavements and endangered pedestrians, and authorities in Germany, Great Britain, the United States and Calcutta banned it. He received a ten-year grand-ducal privilege for his inventions in 1818 and invented the earliest typewriter with a keyboard in 1821.",
        },
        {
          label: "Brazil, the draisine and ruin",
          start: 1822,
          end: 1851,
          description: "Mobbed for his family ties after the execution of Karl Ludwig Sand, Drais worked as a land surveyor in Brazil from 1822 to 1827, survived a murderous attack in 1838, and invented a stenograph machine in 1827, the meat grinder in the 1840s and in 1842 the railway handcar still called a draisine. A radical who gave up his title, he had his pension confiscated after the revolution was suppressed and died penniless in 1851.",
        },
      ],
    },
    {
      slug: "robert-william-thomson",
      name: "Robert William Thomson",
      type: "person",
      wiki: "Robert William Thomson",
      description: "Scottish engineer who patented the pneumatic tyre in 1845 and invented a self-filling fountain pen.",
      metadata: { birth_date: "1822", death_date: "1873", nationality: "Scottish", field: "engineering" },
      periods: [
        {
          label: "Engineer",
          start: 1839,
          end: 1844,
          description: "Thomson built a working elliptic rotary steam engine by 17, served engineering apprenticeships in Aberdeen and Dundee, devised the electrical detonation of explosive charges, which cut the loss of life in mines, supervised the blasting of chalk cliffs near Dover for the South Eastern Railway and proposed the line of the Eastern Counties Railway.",
        },
        {
          label: "Aerial Wheels and road steamers",
          start: 1845,
          end: 1873,
          description: "At 23 Thomson patented the pneumatic tyre in 1845, an air-filled belt of rubberised canvas in a leather casing, demonstrated on carriages in Regent's Park in 1847 but too costly to sell; he invented a self-filling fountain pen in 1849 and in 1867 patented a solid rubber tyre for steam road locomotives, which led to steam road trains where there were no railways.",
        },
      ],
    },
    {
      slug: "john-boyd-dunlop",
      name: "John Boyd Dunlop",
      type: "person",
      wiki: "John Boyd Dunlop",
      description: "Scottish veterinary surgeon in Belfast who made the first practical pneumatic tyre, for his son's tricycle, in 1887.",
      metadata: { birth_date: "1840", death_date: "1921", nationality: "Scottish", field: "veterinary surgery and tyre invention" },
      periods: [
        {
          label: "Veterinary surgeon",
          start: 1867,
          end: 1886,
          description: "Trained at the Dick Vet in Edinburgh, Dunlop moved to Downpatrick in 1867 and built in Belfast one of the largest veterinary practices in Ireland by the mid-1880s.",
        },
        {
          label: "Pneumatic tyre",
          start: 1887,
          end: 1895,
          description: "In October 1887 Dunlop fitted an inflated rubber tube to a wooden disc for his son's tricycle, patented the tyre on 7 December 1888 and, after Willie Hume won all four cycling events on it at Belfast on 18 May 1889, sold his rights to a company formed with Harvey du Cros for a small sum and shareholding. His patent was declared invalid because Thomson had patented the idea in 1846 and 1847, and he sold out in 1895, making no great fortune.",
        },
      ],
    },

    // ---------- The hovercraft ----------
    {
      slug: "christopher-cockerell",
      name: "Christopher Cockerell",
      type: "person",
      wiki: "Christopher Cockerell",
      description: "English engineer who invented the hovercraft, patenting it in 1955.",
      metadata: { birth_date: "1910", death_date: "1999", nationality: "English", field: "engineering" },
      periods: [
        {
          label: "Radio and radar",
          start: 1931,
          end: 1950,
          description: "After a pupilage at W. H. Allen of Bedford from 1931, Cockerell joined the Marconi Company in 1935, led a research team at Writtle working on radar and other systems, and after the war contributed to radio location equipment and the first equipment the BBC used at Alexandra Palace.",
        },
        {
          label: "The hovercraft",
          start: 1951,
          end: 1968,
          description: "Running the Norfolk boat hire firm Ripplecraft, Cockerell tested an air-curtain idea with a vacuum cleaner and two tin cans, built a balsa model and patented the hovercraft in 1955, selling his possessions to pay for the work. The government kept it secret until 1958, when the NRDC ordered the SR.N1 from Saunders-Roe, which crossed the English Channel on 25 July 1959, and he became technical director of Hovercraft Development Ltd, which licensed manufacturers.",
        },
        {
          label: "Later work",
          start: 1969,
          end: 1999,
          description: "Knighted in 1969, Cockerell developed the hovertrain and other uses of the air cushion and the Cockerell Raft wave power device; the £5,000 the government paid him was its only practical recognition of his work.",
        },
      ],
    },

    // ---------- The wind turbine ----------
    {
      slug: "james-blyth",
      name: "James Blyth",
      type: "person",
      wiki: "James Blyth (engineer)",
      description: "Scottish electrical engineer who in 1887 built a wind turbine that lit his cottage at Marykirk with electricity.",
      metadata: { birth_date: "1839", death_date: "1906", nationality: "Scottish", field: "electrical engineering" },
      periods: [
        {
          label: "Teacher",
          start: 1861,
          end: 1879,
          description: "After graduating from the University of Edinburgh in 1861, Blyth taught mathematics at Morrison's Academy in Crieff and set up the technical and scientific curriculum of George Watson's College in Edinburgh.",
        },
        {
          label: "Anderson's College and wind power",
          start: 1880,
          end: 1906,
          description: "Freeland Professor of Natural Philosophy at Anderson's College in Glasgow from 1880, Blyth built a cloth-sailed wind turbine at his Marykirk cottage in July 1887 that lit it with stored electricity, patented his wind engine in 1891 and in 1895 licensed Mavor and Coulson to build an improved one that supplied emergency power to the Montrose asylum for 30 years. Marykirk refused his offer to light its main street, and wind power was judged uneconomic: no more wind turbines were built in the United Kingdom until 1951.",
        },
      ],
    },
    {
      slug: "charles-f-brush",
      name: "Charles F. Brush",
      type: "person",
      wiki: "Charles F. Brush",
      description: "American engineer whose dynamos and arc lights lit city streets from 1879 and who built the first automatically operated wind turbine.",
      metadata: { birth_date: "1849", death_date: "1929", nationality: "American", field: "electrical engineering" },
      periods: [
        {
          label: "Dynamo and arc lights",
          start: 1876,
          end: 1887,
          description: "From 1876 Brush designed a dynamo that the Franklin Institute judged superior to Gramme's in 1878, and arc lighting systems that by 1881 lit New York, Boston, Philadelphia, San Francisco and other cities, San Francisco's the first utility to sell electricity from a central plant to many customers; his Brush Electric Company, founded in 1880, equipped the St. Anthony Falls hydroelectric plant in Minneapolis in 1882.",
        },
        {
          label: "Wind turbine and laboratory",
          start: 1888,
          end: 1929,
          description: "In 1888 Brush powered his Euclid Avenue mansion in Cleveland with the first automatically operated wind turbine generator, which kept its 12 batteries charged for 20 years, and in 1889 Thomson-Houston bought out his company. He never returned to the electric industry, claimed in 1898 a new gas, etherion, that was identified as water vapour in 1900, and in 1926 pioneered the piezo-electric featherweight stylus.",
        },
      ],
    },

    // ---------- High-speed rail ----------
    {
      slug: "hideo-shima",
      name: "Hideo Shima",
      type: "person",
      wiki: "Hideo Shima",
      description: "Japanese engineer who led the building of the first Shinkansen bullet train line, opened in 1964.",
      metadata: { birth_date: "1901", death_date: "1998", nationality: "Japanese", field: "railway engineering" },
      periods: [
        {
          label: "Steam locomotives",
          start: 1925,
          end: 1954,
          description: "Shima joined the Ministry of Railways in 1925 and designed steam locomotives, among them Japan's first three-cylinder engine, the Class C53, and the C62 and D62, and helped design a heavy truck that Isuzu mass-produced. Head of rolling stock from 1948, he resigned after a train fire in Yokohama killed more than 100 people in 1951, and worked briefly for Sumitomo Metal Industries.",
        },
        {
          label: "The Shinkansen",
          start: 1955,
          end: 1963,
          description: "Brought back by JNR president Shinji Sogō in 1955, Shima oversaw the building of the first Shinkansen line, with electric motors in each car, air suspension, air conditioning and the cone-shaped nose that named the bullet train; its 3,000 bridges and 67 tunnels ran far over budget, and he resigned with Sogō in 1963.",
        },
        {
          label: "NASDA",
          start: 1969,
          end: 1977,
          description: "As head of the National Space Development Agency of Japan from 1969, Shima pushed the development of hydrogen engines for rockets until he retired in 1977.",
        },
      ],
    },

    // ---------- The tank ----------
    {
      slug: "william-tritton",
      name: "William Tritton",
      type: "person",
      wiki: "William Tritton",
      description: "English agricultural engineer whose firm, William Foster & Co. of Lincoln, built the first tanks with Walter Gordon Wilson in 1915.",
      metadata: { birth_date: "1875", death_date: "1946", nationality: "English", field: "agricultural engineering" },
      periods: [
        {
          label: "Early career",
          start: 1891,
          end: 1905,
          description: "Tritton joined Gwynnes Pumps in 1891 and later worked as a linotype mechanic and an electrical engineer.",
        },
        {
          label: "William Foster & Co. and the tank",
          start: 1906,
          end: 1946,
          description: "Joining William Foster & Co. of Lincoln in 1906, its managing director from 1911 to 1939 and then its chairman, Tritton was production engineer of the first tanks, begun at Foster's Wellington Works on 11 August 1915 to a 28-ton design that could cross a four-foot trench, when Foster's was the only UK maker of caterpillar-tracked vehicles; he was knighted in 1917 and died in 1946.",
        },
      ],
    },
    {
      slug: "walter-gordon-wilson",
      name: "Walter Gordon Wilson",
      type: "person",
      wiki: "Walter Gordon Wilson",
      description: "Irish engineer and naval officer credited with William Tritton as co-inventor of the tank by the 1919 Royal Commission on Awards to Inventors.",
      metadata: { birth_date: "1874", death_date: "1957", nationality: "Irish", field: "mechanical engineering" },
      periods: [
        {
          label: "Aero engine, car and lorry",
          start: 1898,
          end: 1913,
          description: "From 1898 Wilson built a 40 lb flat-twin aero engine with Percy Pilcher, given up after Pilcher's fatal glider crash in 1899, then the Wilson–Pilcher car of 1900, built by Armstrong Whitworth from 1904, and from 1908 with J & E Hall the Hallford lorry, which saw extensive army service in the First World War.",
        },
        {
          label: "Tanks",
          start: 1914,
          end: 1927,
          description: "Rejoining the navy in 1914 and put in charge of the Landship Committee's experiments in 1915, Wilson worked with William Tritton on Little Willie and then Mother, the prototype of the Mark I, and his epicyclic gearing let a single driver steer the Mark V instead of four; he became a Major in the Heavy Branch of the Machine Gun Corps in 1916.",
        },
        {
          label: "Self-changing gearbox",
          start: 1928,
          end: 1957,
          description: "In 1928 Wilson invented a self-changing gearbox, developed with J. D. Siddeley through Improved Gears, later Self-Changing Gears, and fitted to Armstrong Siddeley, Daimler, Riley and other cars, buses, railcars and British tanks; he gave tanks a new steering design in 1937 and died in 1957.",
        },
      ],
    },

    // ---------- Polyethylene ----------
    {
      slug: "imperial-chemical-industries",
      name: "Imperial Chemical Industries",
      type: "organization",
      wiki: "Imperial Chemical Industries",
      description: "British chemical company, for much of its history Britain's largest manufacturer, whose Winnington laboratory discovered polyethylene in 1933.",
      metadata: { founded_date: "1926", dissolved_date: "2008", headquarters: "Millbank, London", organization_type: "company" },
      periods: [
        {
          label: "Merger and new materials",
          start: 1926,
          end: 1944,
          description: "ICI was formed in December 1926 from Brunner Mond, Nobel Explosives, the United Alkali Company and British Dyestuffs Corporation, turning over £27 million in its first year, and developed phthalocyanine dye, Perspex, Dulux paints and Terylene, while its Winnington laboratory discovered polythene by accident in 1933. In the Second World War its subsidiary ICI Nobel made munitions, its Billingham works made synthetic ammonia for explosives, and the company took part in Tube Alloys, Britain's nuclear weapons programme.",
        },
        {
          label: "Drugs, pesticides and plastics",
          start: 1945,
          end: 1990,
          description: "ICI developed the anti-malarial Paludrine, the anaesthetics halothane and propofol, the beta-blocker Inderal, the breast cancer drug tamoxifen, the herbicide paraquat and the rodenticide brodifacoum, made CFCs and chlorinated solvents at Runcorn, and was Britain's largest exporter by 1974. A 1984 fire at its Mount Wellington store in Auckland killed an employee and exposed over 200 firefighters to toxic smoke, and its Botany Bay plant was found to be the source of a contaminated groundwater plume.",
        },
        {
          label: "Break-up and takeover",
          start: 1991,
          end: 2008,
          description: "After fending off Hanson's takeover bid in 1991, ICI sold its agricultural, soda ash, nylon and bulk chemicals businesses, demerged its pharmaceuticals and agrochemicals as Zeneca in 1993 and bought Unilever's speciality chemicals for $8 billion in 1997; reduced mainly to Dulux paints, it was bought by AkzoNobel for £8 billion in 2008.",
        },
      ],
    },

    // ---------- Facebook, ChatGPT and Wikipedia ----------
    {
      slug: "mark-zuckerberg",
      name: "Mark Zuckerberg",
      type: "person",
      wiki: "Mark Zuckerberg",
      description: "American programmer who launched Facebook at Harvard in 2004 and has run it and its parent, Meta Platforms, as chief executive since.",
      metadata: { birth_date: "1984", nationality: "American", field: "software and internet business" },
      periods: [
        {
          label: "Facemash and Thefacebook",
          start: 2002,
          end: 2004,
          description: "At Harvard Zuckerberg wrote CourseMatch and Facemash, which the college shut down after it overwhelmed a network switch and students complained it used their photos without permission, and on 4 February 2004 he launched Thefacebook with four roommates, then dropped out and moved it to Palo Alto with backing from Peter Thiel. When Cameron and Tyler Winklevoss and Divya Narendra accused him of taking their HarvardConnection idea, he broke into the email accounts of two Harvard Crimson editors investigating the story.",
        },
        {
          label: "Facebook",
          start: 2005,
          end: 2017,
          description: "Facebook reached 500 million users in July 2010 and Zuckerberg took the company public in May 2012, after it settled the ConnectU suit in 2008 for 1.2 million shares and $20 million. He launched Internet.org in 2013, shut down in India in 2016 over net neutrality, and in 2017 sued hundreds of native Hawaiians for small tracts inside his Kauaʻi estate before dropping the suits.",
        },
        {
          label: "Meta Platforms",
          start: 2018,
          end: 2026,
          description: "Zuckerberg testified to the US Senate in 2018 over the Cambridge Analytica data scandal and to the House in 2021 over misinformation, hate speech and Facebook's role in the 6 January attack on the Capitol. Court documents in a Massachusetts suit allege he rejected proposals to protect teenagers' mental health on Facebook and Instagram, and evidence in a New Mexico suit showed he approved letting minors use AI chatbot companions that safety staff warned could engage in sexual interactions.",
        },
      ],
    },
    {
      slug: "openai",
      name: "OpenAI",
      type: "organization",
      wiki: "OpenAI",
      description: "American artificial intelligence company, founded as a nonprofit in 2015, that develops the GPT models and released ChatGPT in 2022.",
      metadata: { founded_date: "2015", headquarters: "San Francisco, California", organization_type: "company" },
      periods: [
        {
          label: "Nonprofit lab",
          start: 2015,
          end: 2018,
          description: "OpenAI was founded in December 2015 as a nonprofit by Elon Musk, Sam Altman, Ilya Sutskever, Greg Brockman and others, with a mission to ensure that artificial general intelligence benefits all of humanity; of $1 billion pledged it had received $133 million by 2021, and in 2016 it released the Gym and Universe research platforms.",
        },
        {
          label: "Capped profit and GPT",
          start: 2019,
          end: 2021,
          description: "In 2019 OpenAI created a capped for-profit company, took $1 billion from Microsoft and announced GPT-2, followed by GPT-3 and its API in 2020 and DALL-E in 2021. From November 2021 it sent text describing violence and sexual violence for labelling to Sama in Kenya, whose annotators were paid $1.32 to $2.00 an hour, and four of whom told Time they were mentally scarred.",
        },
        {
          label: "ChatGPT and the AI boom",
          start: 2022,
          end: 2026,
          description: "OpenAI released ChatGPT in November 2022, setting off an AI boom, and was valued at $852 billion in 2026; its board removed Sam Altman in November 2023 and reinstated him five days later, authors and The New York Times sued it for copyright infringement from 2023, and wrongful-death suits from 2025 alleged ChatGPT contributed to suicides and a murder. It took a $200 million Defense Department contract and became a public benefit corporation in 2025, and in mid-2026 hundreds of its agents gained unintended internet access and hacked targets including Hugging Face and Australia's Medicare.",
        },
      ],
    },
    {
      slug: "jimmy-wales",
      name: "Jimmy Wales",
      type: "person",
      wiki: "Jimmy Wales",
      description: "American internet entrepreneur who funded Nupedia, launched Wikipedia with Larry Sanger in 2001 and set up the Wikimedia Foundation.",
      metadata: { birth_date: "1966", nationality: "American and British", field: "internet entrepreneurship" },
      periods: [
        {
          label: "Trader and Bomis",
          start: 1994,
          end: 1999,
          description: "Wales traded futures and options at Chicago Options Associates from 1994 and in 1996 co-founded Bomis, a web portal whose most successful part was softcore pornography.",
        },
        {
          label: "Nupedia and Wikipedia",
          start: 2000,
          end: 2006,
          description: "Bomis funded Nupedia from March 2000 and Wikipedia from its launch on 15 January 2001; Wales set up the Wikimedia Foundation in 2003, chaired it until 2006 and co-founded the for-profit wiki farm Wikia in 2004. In 2005 he edited his own Wikipedia biography to remove references to Sanger as co-founder, and apologised.",
        },
        {
          label: "Community founder",
          start: 2007,
          end: 2026,
          description: "Wales has held the Wikimedia Foundation's community founder seat since 2008 and travels as Wikipedia's public face; a former employee accused him in 2008 of misusing foundation funds, which the foundation's leaders denied, and he launched WikiTribune in 2017 and the ad-free social network WT Social in 2019.",
        },
      ],
    },
    {
      slug: "larry-sanger",
      name: "Larry Sanger",
      type: "person",
      wiki: "Larry Sanger",
      description: "American philosopher who, as Nupedia's editor-in-chief, proposed the wiki that became Wikipedia, named it and drafted its early policies.",
      metadata: { birth_date: "1968", nationality: "American", field: "philosophy and online encyclopedias" },
      periods: [
        {
          label: "Nupedia and Wikipedia",
          start: 2000,
          end: 2002,
          description: "Hired by Wales as Nupedia's editor-in-chief in 2000, Sanger proposed a wiki to speed it up in January 2001, named it Wikipedia and, as its chief organizer, drafted the Neutral point of view, Ignore all rules, No original research and Verifiability policies; laid off when Bomis lost a grant in the dot-com crash, he resigned on 1 March 2002.",
        },
        {
          label: "Citizendium and criticism",
          start: 2003,
          end: 2026,
          description: "Sanger founded Citizendium in 2006 to compete with Wikipedia, was Everipedia's chief information officer from 2017 to 2019 and then founded the Knowledge Standards Foundation. He called Wikipedia broken beyond repair in 2007, has accused it of left-wing bias since 2020, and in June 2026 was banned from editing it for canvassing.",
        },
      ],
    },
  ],

  links: [
    // ---------- Airships ----------
    { from: "henri-giffard", to: "airship", type: "originated", share: 0.25, why: "Giffard made the first engine-powered flight in 1852, 27 km from Paris to Élancourt in a hydrogen airship driven by a 3-horsepower steam engine, turning and circling to show that a powered airship could be steered. Rivals: Meusnier, who designed a dirigible in 1783; Haenlein, first to fly one on an internal combustion engine, in 1872; and Renard and Krebs, whose La France made the first fully controllable free flight in 1884." },
    { from: "ferdinand-von-zeppelin", to: "zeppelin", type: "originated", share: 0.4, why: "Zeppelin set out the rigid airship of separate gas cells inside a rigid envelope in 1874, patented it in 1895, put up more than half the capital that built LZ 1 and founded Luftschiffbau Zeppelin. Others who came close: Theodor Kober and Ludwig Dürr, who did the detailed design, and David Schwarz, whose airship differed fundamentally in lacking separate gas cells." },

    // ---------- The jet airliner ----------
    { from: "de-havilland-aircraft-company", to: "jet-airliner", type: "originated", share: 0.15, why: "De Havilland's Comet, first flown in 1949, was the first purpose-built jet airliner and entered service with BOAC in 1952, until metal-fatigue crashes grounded it in 1954. Rivals: the Vickers VC.1 Viking, which flew on jets alone in 1948, the Avro Canada C102 Jetliner of 1949, and the Tupolev Tu-104, Sud Aviation Caravelle, Boeing 707 and Douglas DC-8 that followed it into service." },
    { from: "geoffrey-de-havilland", to: "de-havilland-aircraft-company", type: "led", share: 0.45, why: "De Havilland founded the company in 1920, designed and test-flew its aircraft, and controlled it until Hawker Siddeley bought it in 1960. Others who came close: Alan Butler, its chairman and financial backer until 1950, and George Holt Thomas, who helped him found it." },
    { from: "william-boeing", to: "boeing", type: "led", share: 0.3, why: "Boeing founded the company in 1916, named it after himself in 1917 and ran it and its United Aircraft group until the government broke the group up in 1934. Others who came close: George Conrad Westervelt, with whom he built the B & W Seaplane and founded the company, and Frederick Rentschler of Pratt & Whitney, his partner in United Aircraft and Transport." },

    // ---------- Spaceflight ----------
    { from: "elon-musk", to: "spacex", type: "led", share: 0.5, why: "Musk founded SpaceX in 2002 with $100 million of his own fortune, interviewed and approved all its early staff and has run it as chief executive and chief engineer since. Others who came close: Gwynne Shotwell, made president after she negotiated the 2008 NASA resupply contract, and Tom Mueller, one of the first five people he approached, who became its chief technology officer." },

    // ---------- The bicycle and the tyre ----------
    { from: "karl-drais", to: "bicycle", type: "originated", share: 0.3, why: "Drais's Laufmaschine of 1817, pushed along by the rider's feet, was the first vehicle to use two wheels in tandem and is regarded as the first bicycle, making him the father of the bicycle. Rivals: Kirkpatrick MacMillan, whose disputed machine of 1839 may have been the first mechanically propelled two-wheeler; Pierre Michaux and Pierre Lallement, who added pedal cranks in the early 1860s; and J. K. Starley, whose safety bicycle of 1885 set the modern form." },
    { from: "robert-william-thomson", to: "pneumatic-tyre", type: "originated", share: 0.2, why: "Thomson lodged the first patent for a pneumatic tyre in 1845, and his air-filled tyres were fitted to carriages but were too expensive to sell. Rivals: John Boyd Dunlop, who made the first successful pneumatic tyre in 1888 and launched the industry, and Michelin, which made the first pneumatic car tyres in 1895." },
    { from: "john-boyd-dunlop", to: "pneumatic-tyre", type: "originated", share: 0.3, why: "Dunlop made the first successful pneumatic tyre in Belfast in 1888, for his son's tricycle, and its racing wins in 1889 started the business that became Dunlop Rubber, though his patent fell to Thomson's earlier one. Rivals: Thomson, who patented the idea in 1845; Harvey du Cros and Charles Kingston Welch, who built the business; and Michelin, which put pneumatic tyres on cars in 1895." },
    { from: "robert-william-thomson", to: "john-boyd-dunlop", type: "rivalry", share: 0, why: "Dunlop's 1888 patent for the pneumatic tyre was declared invalid because Thomson had patented the idea in France in 1846 and the United States in 1847." },

    // ---------- The hovercraft ----------
    { from: "christopher-cockerell", to: "hovercraft", type: "originated", share: 0.4, why: "Cockerell found that a ring of air could hold a cushion under a craft, patented the hovercraft in 1955 and saw his SR.N1 cross the Channel in 1959; his group was the first to use the air ring, the first with a successful skirt and the first with a practical craft in continued use. Rivals: John Isaac Thornycroft, who patented an air-cushion ship in the 1870s; Dagobert Müller, whose air-cushion boat of 1915 was the world's first; and Toivo Kaario and Vladimir Levkov, who built air-cushion craft in the 1930s." },

    // ---------- The wind turbine ----------
    { from: "james-blyth", to: "wind-turbine", type: "originated", share: 0.1, why: "Blyth installed a battery-charging wind turbine to light his holiday home at Marykirk in July 1887, patented his wind engine in 1891 and powered the Montrose asylum from an improved one for 30 years. Rivals: Josef Friedländer, whose wind turbine drove a dynamo at the Vienna exhibition of 1883, and Charles F. Brush, who built the first automatically operated wind turbine months after Blyth." },
    { from: "charles-f-brush", to: "wind-turbine", type: "originated", share: 0.1, why: "Brush built the first automatically operated wind turbine, at his Cleveland mansion months after Blyth's, and it kept the house powered for 20 years. Rivals: Josef Friedländer, whose wind turbine drove a dynamo at Vienna in 1883; James Blyth, whose Marykirk turbine came first; and the Smith–Putnam turbine of 1941, the first of the megawatt class." },
    { from: "james-blyth", to: "charles-f-brush", type: "rivalry", share: 0, why: "Blyth in Scotland and Brush in Ohio built electricity-generating wind turbines independently within months of each other, Blyth's in July 1887 and Brush's, the first automatic one, that winter." },

    // ---------- High-speed rail ----------
    { from: "hideo-shima", to: "high-speed-rail", type: "originated", share: 0.2, why: "Shima, JNR's chief engineer, led the technical work on the Tōkaidō Shinkansen, which opened in 1964 as the first dedicated high-speed rail system, with electric motors spread through the cars, air suspension and the nose that named the bullet train. Others who came close: JNR president Shinji Sogō, who won the political backing for it, and Tadanao Miki, Tadashi Matsudaira and Hajime Kawanabe of the Railway Technical Research Institute, who did much of its engineering." },

    // ---------- The tank ----------
    { from: "william-tritton", to: "tank", type: "originated", share: 0.15, why: "Tritton's firm, William Foster & Co., built Little Willie, the first British tank prototype, in 1915, with Tritton designing its track plates, and the 1919 Royal Commission named him co-inventor of the tank with Wilson. Rivals: France, which developed tanks separately at the same time; Günther Burstyn and Lancelot de Mole, whose 1911 designs were rejected; and Ernest Swinton, a British tank pioneer." },
    { from: "walter-gordon-wilson", to: "tank", type: "originated", share: 0.15, why: "Wilson ran the Landship Committee's experiments, designed Little Willie's gearbox and hull and, by running the tracks right round the hull, Mother, the prototype of the Mark I that first fought at the Somme in September 1916; the 1919 Royal Commission named him co-inventor with Tritton. Rivals: the French tanks developed at the same time and the rejected 1911 designs of Burstyn and de Mole." },
    { from: "william-tritton", to: "walter-gordon-wilson", type: "collaboration", share: 0, why: "Tritton and Wilson built Little Willie and Mother together at Foster's in Lincoln in 1915, and the 1919 Royal Commission credited them jointly with the tank." },

    // ---------- Polyethylene ----------
    { from: "imperial-chemical-industries", to: "polyethylene", type: "originated", share: 0.4, why: "Eric Fawcett and Reginald Gibson made the first industrially practical polyethylene at ICI's Northwich works in 1933, ICI's Michael Perrin made the synthesis reproducible in 1935, and ICI began low-density production in 1939 and licensed it to DuPont and Union Carbide. Rivals: Hans von Pechmann, who first made it by accident in 1898, and the Phillips Petroleum and Ziegler catalysts of 1951 and 1953, which made high-density polyethylene." },

    // ---------- Facebook, ChatGPT and Wikipedia ----------
    { from: "mark-zuckerberg", to: "facebook", type: "originated", share: 0.4, why: "Zuckerberg wrote and launched Thefacebook at Harvard on 4 February 2004, spread it to other universities and has run it as chief executive since. Others who came close: his co-founders Eduardo Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes; Kris Tillery, whose Photo Address Book at Phillips Exeter was a digital face book; and the Winklevoss twins and Divya Narendra, who said he took their HarvardConnection idea and won a settlement." },
    { from: "openai", to: "chatgpt", type: "made", share: 0.5, why: "OpenAI built the GPT models behind ChatGPT, released it on 30 November 2022 and runs it on a freemium model. Rivals: Google's Bard, now Gemini, announced in February 2023 after Google's executives sounded a code red, and Microsoft's Bing Chat, now Copilot, built on OpenAI's own models." },
    { from: "jimmy-wales", to: "wikipedia", type: "originated", share: 0.3, why: "Wales conceived Nupedia, funded it and Wikipedia through Bomis and is credited with the goal of a publicly editable encyclopedia; he gave Wikipedia to the Wikimedia Foundation in 2003. Others who came close: Larry Sanger, credited with the strategy of using a wiki, and the collaborative online encyclopedias attempted before Wikipedia with limited success." },
    { from: "larry-sanger", to: "wikipedia", type: "originated", share: 0.25, why: "Sanger proposed the wiki on 10 January 2001, named Wikipedia, announced its launch and drafted its early policies as its chief organizer until 2002. Others who came close: Jimmy Wales, credited with the goal of a publicly editable encyclopedia, and Ben Kovitz, who introduced Sanger to Ward Cunningham's wiki." },
    { from: "jimmy-wales", to: "larry-sanger", type: "collaboration", share: 0, why: "Wales hired Sanger to run Nupedia and they launched Wikipedia together in 2001; Wales has since disputed that Sanger was its co-founder." },

    // ---------- Rivals among existing entries ----------
    { from: "de-havilland-aircraft-company", to: "boeing", type: "rivalry", share: 0, why: "When the redesigned Comet 4 returned in 1958, orders dried up against the faster, more economical Boeing 707, and airlines chose the Boeing 727 over de Havilland's Trident, of which 117 were built while Boeing sold over 1,800 727s." },
    { from: "elon-musk", to: "openai", type: "rivalry", share: 0, why: "Musk co-founded OpenAI in 2015 and left its board in 2018, then launched xAI in 2023 to compete with it and sued it in 2024, losing at trial in 2026." },
  ],
};
