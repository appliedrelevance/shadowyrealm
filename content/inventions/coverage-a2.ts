/**
 * Coverage batch a2: the space age, from the gunpowder rocket to the reusable launcher.
 */
import type { InventionsContent, InventionsLink } from "../types";

export const coverageA2: InventionsContent = {
  entities: [
    // ---------- Rockets ----------
    {
      slug: "rocket",
      name: "Rocket",
      type: "invention",
      wiki: "History of rockets",
      description: "A vehicle or weapon driven forward by the exhaust of the propellant it carries, first made with gunpowder in 13th-century China.",
      metadata: { invented_date: "13th century", place: "Song dynasty China", field: "weapons and propulsion" },
      periods: [
        {
          label: "Chinese fire arrows",
          start: 1232,
          end: 1300,
          description: "Reports from 1232 describe Chinese fire arrows, the Song navy fired rockets in an exercise in 1245, and a \"ground-rat\" firework frightened the Empress-Mother Gongsheng at a feast in 1264. The Mongol invasions carried rockets across Eurasia, and Hasan al-Rammah's treatise of the 1270s gave 22 recipes for them.",
        },
        {
          label: "Rocket artillery",
          start: 1301,
          end: 1779,
          description: "Jiao Yu's Huolongjing of the mid-14th century described the first multistage rocket, the Ming army ordered \"wasp nest\" launchers in 1380, the year rockets were reported at Chioggia in Europe, and Joseon Korea made rockets from 1377 and hwacha multiple launchers from 1451. Mughal rockets took metal casings in the 16th century, and Siemienowicz's manual of 1650, with its standard rocket designs, served Europe as its basic artillery text for over two centuries.",
        },
        {
          label: "Mysorean and Congreve rockets",
          start: 1780,
          end: 1918,
          description: "Mysore's iron-cased rockets struck the British East India Company in the 1780s and 1790s; Congreve developed them at Woolwich from 1801, and British rockets were fired in the Napoleonic Wars, at Fort McHenry in 1814 and at Waterloo in 1815, raising the range of war rockets from 100 to 2,000 yards. Hale's spinning rocket of 1844 did away with the guide stick, and French Le Prieur rockets shot down observation balloons from 1916.",
        },
        {
          label: "Rockets in modern war",
          start: 1919,
          end: 2026,
          description: "The Soviet Gas Dynamics Laboratory launched its first solid-propellant rocket in 1928, the prototype of the Katyusha launchers of the Second World War, and the American bazooka fired rockets at tanks. Rockets now propel anti-tank and anti-aircraft missiles, ejection seats, launch escape systems, flares, fireworks and model rockets.",
          wiki: "Rocket",
        },
      ],
    },
    {
      slug: "liquid-propellant-rocket",
      name: "Liquid-propellant rocket",
      type: "invention",
      wiki: "Liquid-propellant rocket",
      description: "A rocket that burns a liquid fuel with a liquid oxidizer, such as kerosene or hydrogen with liquid oxygen, fed into a combustion chamber.",
      metadata: { invented_date: "1926", place: "Auburn, Massachusetts", field: "rocketry" },
      periods: [
        {
          label: "The first liquid rockets",
          start: 1921,
          end: 1933,
          description: "Goddard began testing liquid oxygen and gasoline in 1921 and on 16 March 1926 at Auburn, Massachusetts, flew the first liquid-fuelled rocket, which rose 41 feet in 2.5 seconds. Friedrich Sander flew Europe's first two for Opel RAK in April 1929, and the Soviet GIRD-X flew in November 1933.",
        },
        {
          label: "Rocket planes and the V-2",
          start: 1934,
          end: 1945,
          description: "The German Army took over liquid-rocket work, and the Gestapo jailed Sander for treason in 1935; the Heinkel He 176 made the first crewed liquid-rocket flight on 20 June 1939, and the Me 163 Komet fighter and von Braun's V-2 missile went to war in 1944 and 1945.",
        },
        {
          label: "Missiles and launch vehicles",
          start: 1946,
          end: 2026,
          description: "After the war the United States and the Soviet Union funded liquid rockets as weapons, which began the Space Race: kerosene and liquid oxygen drove the R-7, Atlas, the Saturn V's first stage, Soyuz and Falcon 9, hydrogen drove the Space Shuttle's main engines, and storable nitric acid with hydrazine fuels drove the Scud and other Cold War missiles. Engines were reused on the Space Shuttle and Falcon 9, while ice and foam insulation falling from cryogenic tanks, as in the Columbia disaster, endangered the vehicles.",
        },
      ],
    },
    {
      slug: "robert-goddard",
      name: "Robert H. Goddard",
      type: "person",
      wiki: "Robert H. Goddard",
      description: "American physicist who patented the multi-stage rocket and built and flew the first liquid-fuelled rocket in 1926.",
      metadata: { birth_date: "1882", death_date: "1945", nationality: "American", field: "physics and rocketry" },
      periods: [
        {
          label: "Rocket theory and patents",
          start: 1912,
          end: 1919,
          description: "Goddard worked out the mathematics of rocket flight in 1912, patented the multi-stage rocket and the liquid-fuelled rocket in 1914, and in 1915 raised a powder rocket's efficiency from 2 to 64 percent with a de Laval nozzle. On a $5,000 Smithsonian grant he demonstrated a tube-fired rocket to the Army on 6 November 1918, the forerunner of the bazooka, and in 1919 published A Method of Reaching Extreme Altitudes.",
        },
        {
          label: "First liquid-fuelled flight",
          start: 1920,
          end: 1929,
          description: "Ridiculed by The New York Times in 1920 for proposing a rocket to the Moon, Goddard turned to liquid oxygen and gasoline in 1921, and on 16 March 1926 at Auburn, Massachusetts, he flew the world's first liquid-fuelled rocket, which rose 41 feet in 2.5 seconds.",
        },
        {
          label: "Roswell",
          start: 1930,
          end: 1941,
          description: "With $100,000 from the Guggenheims, arranged by Charles Lindbergh, Goddard tested rockets in near-secrecy at Roswell, New Mexico, adding gyroscopic steering in 1932, flying a rocket to 4,800 feet at 550 miles per hour in 1935, and building the first multi-chamber rocket in 1936 and lightweight turbopumps in 1940 and 1941.",
        },
        {
          label: "Navy rocket engines",
          start: 1942,
          end: 1945,
          description: "At Annapolis Goddard built throttleable liquid rocket engines for the Navy's jet-assisted take-off, the basis of the engine of the Bell X-2 rocket plane. He inspected a captured V-2 in 1945, concluded the Germans had used his work, and died that August; his wife published 212 of his 214 patents after his death.",
        },
      ],
    },
    {
      slug: "v-2-rocket",
      name: "V-2 rocket",
      type: "product",
      wiki: "V-2 rocket",
      description: "Nazi Germany's liquid-fuelled ballistic missile of the Second World War, the first artificial object to reach space and the ancestor of the Cold War's missiles and launch vehicles.",
      metadata: { introduced_date: "1944", maker: "Peenemünde Army Research Center" },
      periods: [
        {
          label: "Aggregat-4",
          start: 1936,
          end: 1942,
          description: "Von Braun and Walter Riedel began a large rocket in 1936 to the Army's demand for a one-ton warhead and a 172-mile range, and Hitler ordered it into mass production after the fourth test rocket made the first successful flight from Peenemünde on 3 October 1942, reaching 84.5 kilometres.",
        },
        {
          label: "Vengeance weapon",
          start: 1943,
          end: 1945,
          description: "Built from 1943 in the underground Mittelwerk by prisoners of Mittelbau-Dora, where 20,000 died, more than 3,000 V-2s were fired at London, Antwerp, Liège and other cities from September 1944 to March 1945, killing 2,754 civilians in London and 567 people in a single strike on Antwerp's Cine Rex. A vertical test launch on 20 June 1944 made it the first artificial object to reach space.",
        },
        {
          label: "Captured rockets",
          start: 1946,
          end: 1948,
          description: "The United States shipped 300 rail cars of V-2 parts to White Sands, where V-2s carried instruments into the upper atmosphere, took the first pictures of Earth from space in 1946 and, in 1947, crashed near Juárez, Mexico. The Soviet Union flew rebuilt V-2s at Kapustin Yar in October 1947 and its copy, the R-1, in 1948, and France's Super V-2 program led to its Véronique, Diamant and Ariane rockets.",
        },
      ],
    },
    {
      slug: "wernher-von-braun",
      name: "Wernher von Braun",
      type: "person",
      wiki: "Wernher von Braun",
      description: "German-American engineer who led the design of the Nazi V-2 missile and later built the Saturn V that carried Apollo astronauts to the Moon.",
      metadata: { birth_date: "1912", death_date: "1977", nationality: "German-American", field: "aerospace engineering" },
      periods: [
        {
          label: "Peenemünde",
          start: 1932,
          end: 1945,
          description: "Funded by the German Army from 1932, von Braun led its rocket team at Kummersdorf and Peenemünde, joined the Nazi Party in 1937 and the SS in 1940, and was technical director of the V-2, which Hitler ordered into production as a vengeance weapon in December 1942. He visited the Mittelwerk factory, where concentration camp prisoners built the rockets, 12 to 15 times; more people died building the V-2 than were killed by it.",
        },
        {
          label: "US Army missiles",
          start: 1945,
          end: 1959,
          description: "Brought to the United States under Operation Paperclip after surrendering in May 1945, von Braun launched captured V-2s at White Sands and from Huntsville built the Redstone, used in the first live US nuclear ballistic missile tests, and the Juno I that launched Explorer 1 on 31 January 1958. His 1952 Collier's articles and Disney's 1955 Man in Space, seen by 40 million viewers, popularised space travel.",
        },
        {
          label: "Marshall and the Saturn V",
          start: 1960,
          end: 1977,
          description: "As first director of NASA's Marshall Space Flight Center from 1 July 1960 to 1970, von Braun built the Saturn rockets, whose Saturn V launched Apollo 11 to the Moon in July 1969. He left NASA in 1972 as Apollo was cut back, joined Fairchild Industries, helped found the National Space Institute in 1975, and died in 1977 after a 1973 diagnosis of kidney cancer.",
        },
      ],
    },
    {
      slug: "sergei-korolev",
      name: "Sergei Korolev",
      type: "person",
      wiki: "Sergei Korolev",
      description: "Soviet rocket engineer and Gulag survivor who, as chief designer, built the R-7 missile and launched Sputnik 1 and the first human into space.",
      metadata: { birth_date: "1907", death_date: "1966", nationality: "Soviet", field: "rocket engineering" },
      periods: [
        {
          label: "GIRD and RNII",
          start: 1930,
          end: 1937,
          description: "Korolev helped found the Group for the Study of Reactive Motion in 1931 and led it from May 1932; GIRD launched the GIRD-09 hybrid rocket in August 1933 and the first Soviet liquid-fuelled rocket, GIRD-X, on 25 November 1933, before merging into RNII, where Korolev worked on cruise missiles and a crewed rocket glider.",
        },
        {
          label: "Purge and prison",
          start: 1938,
          end: 1944,
          description: "Arrested on false charges on 27 June 1938, Korolev was tortured in the Lubyanka and sent to a Kolyma gold mine, where scurvy cost him most of his teeth; from 1940 he worked in prison design bureaus under Tupolev and then Glushko until his release on 27 June 1944.",
        },
        {
          label: "Missiles from the V-2",
          start: 1945,
          end: 1956,
          description: "Sent to Germany in 1945 to recover V-2 technology, Korolev became chief designer of long-range missiles at NII-88, flew rebuilt V-2s at Kapustin Yar in 1947 and built the R-1 copy, the R-2 with the first separable warhead and the R-5, and in 1954 took charge of the R-7 intercontinental missile.",
        },
        {
          label: "Space firsts",
          start: 1957,
          end: 1966,
          description: "Korolev's R-7 flew as the first intercontinental ballistic missile in August 1957 and launched Sputnik 1, Sputnik 2 with the dog Laika, who died in orbit, Luna 2, Yuri Gagarin's Vostok 1 on 12 April 1961 and Leonov's spacewalk of 1965. He died after surgery on 14 January 1966, and his name was kept secret until his obituary.",
        },
      ],
    },
    {
      slug: "r-7-semyorka",
      name: "R-7 Semyorka",
      type: "product",
      wiki: "R-7 Semyorka",
      description: "The Soviet Union's first intercontinental ballistic missile, designed by Korolev's OKB-1, whose descendants launched Sputnik 1, Yuri Gagarin and the Soyuz rockets.",
      metadata: { introduced_date: "1957", maker: "OKB-1" },
      periods: [
        {
          label: "The first ICBM",
          start: 1953,
          end: 1957,
          description: "OKB-1 began designing the R-7 in 1953 to carry a thermonuclear warhead to the United States; after the first launch failed on 15 May 1957, it flew 6,000 km from Baikonur to Kamchatka on 21 August 1957 as the world's first intercontinental ballistic missile, and a modified R-7 put Sputnik 1 into orbit on 4 October.",
        },
        {
          label: "Missile and space launcher",
          start: 1958,
          end: 1965,
          description: "The R-7 went on alert at Plesetsk in December 1959, but it needed 20 hours to prepare, so its planned fifty launch sites were cut to six; US estimates of hundreds of R-7s raised fears of a missile gap, answered by a continuous Strategic Air Command nuclear alert that lasted until 1991. R-7 variants launched Luna 2, Luna 3 and Yuri Gagarin's Vostok.",
        },
        {
          label: "Soyuz family",
          start: 1966,
          end: 2026,
          description: "Standardised as the Soyuz rocket from 1966 and phased out as a missile by mid-1968, the R-7 family became the most launched rocket family ever, with over 2,000 flights by 2026, and its modernised Soyuz-2 still flies from Baikonur, Plesetsk and Vostochny.",
        },
      ],
    },

    // ---------- Satellites ----------
    {
      slug: "satellite",
      name: "Satellite",
      type: "invention",
      wiki: "Satellite",
      description: "An artificial object placed in orbit around the Earth or another body, used for communication, weather, navigation, observation and war.",
      metadata: { invented_date: "1957", place: "Soviet Union", field: "spaceflight" },
      periods: [
        {
          label: "The first satellites",
          start: 1957,
          end: 1969,
          description: "Sputnik 1 of 4 October 1957 set off the Space Race; Sputnik 2 carried the dog Laika with no means of return, Explorer 1 found the Van Allen belts in 1958, TIROS-1 sent the first television pictures of weather from space in 1960, and 115 satellites were in orbit by June 1961.",
        },
        {
          label: "Satellites at work",
          start: 1970,
          end: 1999,
          description: "Satellites took on communications, weather, Earth observation, navigation, early missile warning, nuclear explosion detection and spying, and from 1972 were built on standard buses such as the HS-333; failures such as Kosmos 954 scattered radioactive material on re-entry.",
        },
        {
          label: "Constellations and debris",
          start: 2000,
          end: 2026,
          description: "CubeSats and large constellations led by SpaceX's Starlink, the first to pass 1,000 active satellites in 2020, raised the count to 12,952 satellites in orbit by June 2025. China in 2007, the United States in 2008 and India in 2019 shot down satellites, and the crowding of orbit threatens collisions, brightens the night sky by up to 10 percent and loads the stratosphere with rocket and re-entry pollutants.",
        },
      ],
    },
    {
      slug: "sputnik-1",
      name: "Sputnik 1",
      type: "product",
      wiki: "Sputnik 1",
      description: "The Soviet radio-beeping metal sphere launched on 4 October 1957, the first artificial Earth satellite.",
      metadata: { introduced_date: "1957", discontinued_date: "1958", maker: "OKB-1" },
      periods: [
        {
          label: "Object D",
          start: 1954,
          end: 1956,
          description: "Korolev proposed an artificial satellite in 1954, and in January 1956 the Council of Ministers approved Object D, a scientific satellite of 1,000 to 1,400 kg, but by the end of 1956 its instruments and the R-7's weak engines made it impossible to launch in time.",
        },
        {
          label: "Object PS in orbit",
          start: 1957,
          end: 1958,
          description: "Approved in February 1957 as Object PS, a 58 cm polished sphere with a radio transmitter, Sputnik 1 was launched on 4 October 1957, beeped on 20.005 and 40.002 MHz to radio amateurs around the world for 22 days, and burned up on 4 January 1958 after 1,440 orbits. Its surprise launch set off the Sputnik crisis and the Space Race and led the United States to found ARPA and NASA and pass the National Defense Education Act.",
        },
      ],
    },
    {
      slug: "communications-satellite",
      name: "Communications satellite",
      type: "invention",
      wiki: "Communications satellite",
      description: "A satellite that relays radio, telephone, television and internet signals between distant points on Earth.",
      metadata: { invented_date: "1958", place: "United States", field: "telecommunications" },
      periods: [
        {
          label: "First relays",
          start: 1958,
          end: 1964,
          description: "ARPA's SCORE, the first satellite built to relay messages, broadcast Eisenhower's Christmas greeting in December 1958, NASA's Echo 1, an aluminized balloon, reflected signals in 1960, and AT&T's Telstar carried the first transatlantic television in July 1962 before the Starfish Prime nuclear test knocked it out seven months later. Hughes's Syncom 3 became the first geostationary communications satellite in 1964.",
        },
        {
          label: "Intelsat",
          start: 1965,
          end: 1989,
          description: "Intelsat's Early Bird of 6 April 1965 was the first commercial communications satellite in geosynchronous orbit, the Soviet Molniya series followed that month, and Intelsat completed a global network in 1969 and 1970, carrying intercontinental telephone calls and live television; from the late 1970s satellites fed television to dishes at people's homes.",
        },
        {
          label: "Satellite television and internet",
          start: 1990,
          end: 2026,
          description: "Fibre-optic submarine cables drew some telephone traffic away in the late 20th century, but direct-broadcast satellites such as DirecTV and Sky carried television, Iridium's 66 satellites carried calls from anywhere on Earth, and after the 1990s satellites connected remote users to the internet. In the 2020s low-orbit constellations such as Starlink cut demand for geostationary satellites.",
        },
      ],
    },
    {
      slug: "weather-satellite",
      name: "Weather satellite",
      type: "invention",
      wiki: "Weather satellite",
      description: "An Earth-observing satellite that watches clouds, storms and climate from polar or geostationary orbit.",
      metadata: { invented_date: "1959", place: "United States", field: "meteorology" },
      periods: [
        {
          label: "First weather satellites",
          start: 1959,
          end: 1969,
          description: "Vanguard 2, the first weather satellite, was launched on 17 February 1959, but a poor axis of rotation kept it from returning useful data; NASA's TIROS-1 of 1 April 1960 worked for 78 days and sent the first television pictures of weather from space, and the Soviet Meteor series followed in 1964. From Nimbus 3 in 1969 satellites measured temperature through the atmosphere, which improved forecasts.",
        },
        {
          label: "Geostationary watch",
          start: 1970,
          end: 1999,
          description: "The US GOES geostationary series from the 1970s, Europe's Meteosat-1 and Japan's Himawari from 1977 and China's Fengyun from 1988 joined NOAA's polar-orbiting satellites, sending forecasters continuous pictures of storm systems.",
        },
        {
          label: "Global weather watch",
          start: 2000,
          end: 2026,
          description: "Europe's Meteosat Second Generation from 2002, Metop from 2006 and Meteosat Third Generation from 2022, NOAA's DSCOVR space-weather satellite of 2015 and US, Chinese, Indian, Russian and Japanese fleets keep a global weather watch, tracking fires, dust, volcanic ash, El Niño and the Antarctic ozone hole. Microwave winds from QuikScat and TRMM improved the diagnosis of tropical cyclones in the 2000s and 2010s.",
        },
      ],
    },

    // ---------- Agencies and programs ----------
    {
      slug: "nasa",
      name: "NASA",
      type: "organization",
      wiki: "NASA",
      description: "The United States' civilian space agency, founded in 1958, which ran the Apollo Moon landings, the Space Shuttle and the American part of the International Space Station.",
      metadata: { founded_date: "1958", headquarters: "Washington, D.C.", organization_type: "government" },
      periods: [
        {
          label: "Mercury, Gemini and Apollo",
          start: 1958,
          end: 1972,
          description: "Created on 29 July 1958 in answer to Sputnik, NASA took over NACA's 8,000 employees, the Jet Propulsion Laboratory and von Braun's Army team, flew Shepard and Glenn in Project Mercury, launched TIROS, the first successful weather satellite, in 1960, and landed twelve astronauts on the Moon from 1969 to 1972. The Apollo 1 fire killed three astronauts in 1967.",
        },
        {
          label: "Skylab, probes and the Shuttle",
          start: 1973,
          end: 2002,
          description: "NASA launched Skylab in 1973, landed Viking on Mars in 1976, sent the Voyagers past the outer planets from 1977 and flew the Space Shuttle from 1981, losing Challenger and seven astronauts in 1986; it launched Hubble in 1990, began the International Space Station with Russia in 1998, and with NOAA built the GOES weather satellites and helped discover ozone depletion.",
        },
        {
          label: "Commercial crews and Artemis",
          start: 2003,
          end: 2026,
          description: "Columbia broke up on re-entry in 2003, killing seven, and after the Shuttle retired in 2011 NASA relied on Russian Soyuz spacecraft until SpaceX flew its astronauts in 2020 under the Commercial Crew Program. NASA launched the James Webb Space Telescope in 2021 and leads the Artemis program, whose Artemis II crew flew around the Moon in 2026.",
        },
      ],
    },
    {
      slug: "apollo-program",
      name: "Apollo program",
      type: "project",
      wiki: "Apollo program",
      description: "NASA's human spaceflight program that landed twelve astronauts on the Moon between 1969 and 1972.",
      metadata: { start_date: "1961", end_date: "1972", sponsor: "NASA" },
      periods: [
        {
          label: "Kennedy's goal",
          start: 1961,
          end: 1966,
          description: "Kennedy set the goal of a Moon landing within the decade on 25 May 1961; Apollo adopted lunar orbit rendezvous in 1962, NASA built the Manned Spacecraft Center and Launch Operations Center for it, and at its peak it employed over 400,000 employees and contractors and, in 1963, used 60 percent of US integrated-circuit production.",
        },
        {
          label: "Apollo 1 and Apollo 8",
          start: 1967,
          end: 1968,
          description: "On 27 January 1967 a fire in the pure-oxygen cabin of Apollo 1 killed Grissom, White and Chaffee during a ground test, forcing a redesign; in December 1968 Apollo 8 flew the first crew around the Moon and sent its pictures of the Earth to a quarter of the world's population.",
        },
        {
          label: "Moon landings",
          start: 1969,
          end: 1972,
          description: "Apollo 11 landed Armstrong and Aldrin on 20 July 1969 before 650 million television viewers, and six landings put twelve men on the Moon by December 1972 and returned 382 kg of rock, while an oxygen tank explosion aborted Apollo 13's landing. The program cost $25.4 billion, budget cuts cancelled three missions, and its Blue Marble photograph became a symbol of the environmental movement.",
        },
      ],
    },

    // ---------- Stations, shuttles and telescopes ----------
    {
      slug: "space-station",
      name: "Space station",
      type: "invention",
      wiki: "Space station",
      description: "A spacecraft that stays in orbit and houses crews for long periods, from the Soviet Salyut 1 of 1971 to the International Space Station.",
      metadata: { invented_date: "1971", place: "Soviet Union", field: "spaceflight" },
      periods: [
        {
          label: "Salyut and Skylab",
          start: 1971,
          end: 1985,
          description: "The Soviet Union launched the first space station, Salyut 1, on 19 April 1971, and its Soyuz 11 crew set a 23-day record and died when their capsule depressurised on the way home. Salyut 3 test-fired a cannon in orbit, the American Skylab was occupied in 1973 and 1974, and Salyut 6 and 7, with two docking ports, let crews be relieved and resupplied in orbit.",
        },
        {
          label: "Mir",
          start: 1986,
          end: 2001,
          description: "Mir, the first modular station, was assembled in orbit from 1986 to 1996, held crews continuously for 3,644 days and hosted Valeri Polyakov's record 437-day flight; in 1997 a fire and a Progress cargo ship that crashed into the Spektr module and punctured it endangered the station, which was deorbited in 2001.",
          wiki: "Mir",
        },
        {
          label: "Continuous occupation",
          start: 2002,
          end: 2026,
          description: "The International Space Station, crewed since November 2000, and China's Tiangong, crewed since 2022, held 17 people in orbit at once in 2023, and some paying guests have spent $50 million for a week aboard. Station crews suffer muscle atrophy, bone loss, eyesight disorders and a higher risk of cancer from radiation.",
        },
      ],
    },
    {
      slug: "international-space-station",
      name: "International Space Station",
      type: "project",
      wiki: "International Space Station",
      description: "The modular space station in low Earth orbit built and run by the American, Russian, European, Japanese and Canadian space agencies, crewed without a break since 2000.",
      metadata: { start_date: "1998", sponsor: "NASA, Roscosmos, ESA, JAXA and CSA" },
      periods: [
        {
          label: "Assembly",
          start: 1998,
          end: 2010,
          description: "Assembly began with Russia's Zarya module, launched on a Proton on 20 November 1998, and the American Unity module, joined to it from Space Shuttle Endeavour on 4 December; Zvezda's living quarters let Expedition 1 begin continuous occupation on 2 November 2000, and the loss of Columbia in 2003 halted construction until 2006.",
        },
        {
          label: "Orbital laboratory",
          start: 2011,
          end: 2021,
          description: "With the US segment complete in 2011, the station hosted 3,000 experiments in its first 20 years, from the Alpha Magnetic Spectrometer's search for dark matter to studies of bone loss and muscle atrophy, and Crew Dragon took over American crew flights from Soyuz in 2020. A Russian anti-satellite weapon test forced the crew to shelter in November 2021.",
        },
        {
          label: "Ageing station",
          start: 2022,
          end: 2026,
          description: "After Russia invaded Ukraine in 2022 its space agency threatened to withdraw, air leaks and mould called the ageing station's safety into doubt, and in June 2026 a worsening leak in the Russian segment sent the crew to shelter in a docked Crew Dragon. NASA plans to deorbit the station, the most expensive single object ever built at $150 billion, into the South Pacific in January 2031.",
        },
      ],
    },
    {
      slug: "space-shuttle",
      name: "Space Shuttle",
      type: "product",
      wiki: "Space Shuttle",
      description: "NASA's partially reusable winged spacecraft, which flew 135 missions from 1981 to 2011.",
      metadata: { introduced_date: "1981", discontinued_date: "2011", maker: "NASA and Rockwell International" },
      periods: [
        {
          label: "Design and development",
          start: 1969,
          end: 1980,
          description: "NASA and the Air Force set the Shuttle's requirements from 1969 and Nixon approved it in January 1972; Rockwell built the test orbiter Enterprise, glide-tested from 1977, and Columbia, whose 30,000 heat-shield tiles took two more years to install and replace.",
        },
        {
          label: "Satellite launcher",
          start: 1981,
          end: 1986,
          description: "Columbia flew the first mission on 12 April 1981, and the Shuttle launched commercial satellites, carried Spacelab and in 1984 repaired the Solar Maximum Mission satellite in orbit. On 28 January 1986 a cold-impaired O-ring in a solid rocket booster failed and Challenger broke apart, killing seven astronauts after managers had ignored engineers' warnings.",
        },
        {
          label: "Hubble, Mir and the space station",
          start: 1987,
          end: 2011,
          description: "Back in flight after Challenger, the Shuttle launched Hubble in 1990 and serviced it five times, docked with Mir and carried most of the International Space Station's American modules into orbit. Columbia broke up on re-entry on 1 February 2003, killing seven, and the fleet retired in July 2011 at a program cost of $221 billion.",
        },
        {
          label: "Museum pieces and Artemis parts",
          start: 2012,
          end: 2026,
          description: "The orbiters went on display in Florida, Virginia, Los Angeles and New York, and their RS-25 main engines, booster casings and manoeuvring engines were refurbished for the Space Launch System and Orion; Artemis I flew components from 83 of the 135 Shuttle missions.",
        },
      ],
    },
    {
      slug: "hubble-space-telescope",
      name: "Hubble Space Telescope",
      type: "product",
      wiki: "Hubble Space Telescope",
      description: "NASA's space telescope with a 2.4-metre mirror, launched in 1990 and repaired and upgraded in orbit by Space Shuttle crews.",
      metadata: { introduced_date: "1990", maker: "NASA, with the European Space Agency" },
      periods: [
        {
          label: "Planning and building",
          start: 1968,
          end: 1989,
          description: "NASA planned a 3-metre Large Space Telescope in 1968, and after astronomers lobbied Congress to restore funding cut in 1977 it was built smaller, with a 2.4-metre mirror, by the Marshall Space Flight Center, Perkin-Elmer and Lockheed, with a European instrument and solar cells. The Challenger disaster then kept it in a clean room at $6 million a month until 1990.",
        },
        {
          label: "Flawed mirror",
          start: 1990,
          end: 1993,
          description: "Launched from Discovery on STS-31 in 1990, Hubble returned blurred images because Perkin-Elmer, testing with a wrongly assembled null corrector, had ground its primary mirror 2,200 nanometres too flat at the edge; in December 1993 the Endeavour crew of Servicing Mission 1 installed the COSTAR corrective optics and a new camera.",
        },
        {
          label: "Discoveries and servicing",
          start: 1994,
          end: 2009,
          description: "Restored, Hubble filmed Comet Shoemaker-Levy 9 striking Jupiter in 1994, measured the expansion rate of the universe to within 10 percent, helped show that the expansion is accelerating, a finding that won Nobel Prizes, and took the Deep Field images. Shuttle crews serviced it in 1997, 1999, 2002 and 2009, the last mission first cancelled after the Columbia disaster.",
        },
        {
          label: "Late career",
          start: 2010,
          end: 2026,
          description: "Hubble found the farthest confirmed galaxy, GN-z11, in 2016 and the farthest single star, Earendel, in 2022, and by 2025 over 22,000 peer-reviewed papers drew on its data; its cumulative cost of $11.3 billion in 2015 dollars makes it NASA's most expensive science mission. Gyroscopes failed in 2014 and 2018, its orbit is decaying, and in October 2026 NASA asked industry how to extend its life.",
        },
      ],
    },

    // ---------- Commercial spaceflight ----------
    {
      slug: "spacex",
      name: "SpaceX",
      type: "organization",
      wiki: "SpaceX",
      description: "American launch and satellite company founded by Elon Musk in 2002, builder of the reusable Falcon 9 and operator of the Starlink constellation.",
      metadata: { founded_date: "2002", headquarters: "Starbase, Texas", organization_type: "company" },
      periods: [
        {
          label: "Falcon 1",
          start: 2002,
          end: 2009,
          description: "Musk founded SpaceX in 2002 to cut launch costs and colonise Mars; three Falcon 1 failures between 2006 and 2008 nearly bankrupted it, until the fourth launch, on 28 September 2008, made it the first private company to put a liquid-fuelled rocket in orbit and NASA's $1.6 billion cargo contract that December saved it.",
        },
        {
          label: "Falcon 9 and Dragon",
          start: 2010,
          end: 2019,
          description: "SpaceX flew Falcon 9 from 2010, made Dragon the first commercial spacecraft to deliver cargo to the International Space Station in 2012, broke United Launch Alliance's monopoly on US military launches in 2015 and landed the first orbital-class booster that December. By 2017 it held 45 percent of the world's commercial launch contracts, and in 2019 it began launching Starlink.",
        },
        {
          label: "Crews, Starlink and Starship",
          start: 2020,
          end: 2026,
          description: "SpaceX has flown NASA's astronauts since 2020, built Starlink into 11,100 satellites with 13.6 million subscribers by September 2026, builds spy satellites for the National Reconnaissance Office, and flew Starship to orbit in September 2026 after a string of exploding test flights. Reuters documented at least 600 unreported workplace injuries and one death from 2014, and its June 2026 public offering raised $85.7 billion, the largest in history.",
        },
      ],
    },
    {
      slug: "falcon-9",
      name: "Falcon 9",
      type: "product",
      wiki: "Falcon 9",
      description: "SpaceX's partially reusable two-stage launch vehicle, flown since 2010, whose first stage lands to fly again.",
      metadata: { introduced_date: "2010", maker: "SpaceX" },
      periods: [
        {
          label: "First flights",
          start: 2010,
          end: 2014,
          description: "Developed with SpaceX's own money and $396 million from NASA's COTS program for it and Dragon, Falcon 9 first flew on 4 June 2010, and on its third flight, in 2012, carried the first commercial cargo to the International Space Station; at $56.5 million a launch in 2013 it was the cheapest rocket in the industry.",
        },
        {
          label: "Landing and reuse",
          start: 2015,
          end: 2019,
          description: "A failed strut destroyed the CRS-7 cargo flight in June 2015 and a pad explosion destroyed the $200 million AMOS-6 satellite in September 2016, but Flight 20 made the first landing of an orbital-class booster in December 2015 and SES-10 flew the first reused booster in March 2017. The Block 5 became the standard reusable version in 2018.",
        },
        {
          label: "Crews and Starlink",
          start: 2020,
          end: 2026,
          description: "On 30 May 2020 Falcon 9 became the first commercial rocket to launch astronauts, and by November 2026 it had made 699 successful flights and 660 booster landings, 119 flights that year alone, more than 70 percent of them carrying Starlink satellites. Its falling prices pushed Arianespace, United Launch Alliance and Roscosmos to build cheaper rockets.",
        },
      ],
    },
  ],

  links: [
    // ---------- Rockets ----------
    { from: "gunpowder", to: "rocket", type: "builds_on", share: 0.4, why: "Rockets began as gunpowder-propelled fire arrows in Song China, and gunpowder stayed their propellant through the Mysorean and Congreve rockets." },
    { from: "robert-goddard", to: "rocket", type: "originated", share: 0.05, why: "Goddard fitted a de Laval nozzle to a powder rocket in 1915, raising its efficiency from 2 to 64 percent, and his 1918 tube-fired rocket became the bazooka. The gunpowder rocket itself has no named inventor: the History of Song credits Feng Zhisheng in 969 and Tang Fu in 1000, and Mysore's iron casings and Congreve's designs extended its range." },
    { from: "robert-goddard", to: "liquid-propellant-rocket", type: "originated", share: 0.4, why: "Goddard patented a liquid-fuelled rocket in 1914 and flew the first one on 16 March 1926. Rivals: Tsiolkovsky, who proposed liquid hydrogen and oxygen in 1903; Oberth, who proposed liquid propellants in 1923; Pedro Paulet, who claimed to have tested a liquid engine as a student in Paris; and Sander, whose Opel RAK rockets of 1929 were the second to fly." },
    { from: "rocket", to: "liquid-propellant-rocket", type: "builds_on", share: 0.2, why: "Goddard started from powder rockets, whose combustion chamber and de Laval nozzle he carried over, and switched to liquid propellants in 1921 to cut the rocket's weight." },
    { from: "wernher-von-braun", to: "liquid-propellant-rocket", type: "originated", share: 0.05, why: "Von Braun fired a gasoline and liquid oxygen rocket from his Berlin business, wrote the classified 1934 thesis on the liquid-propellant rocket and made the large liquid rocket practical in the V-2; Goddard flew first." },
    { from: "sergei-korolev", to: "liquid-propellant-rocket", type: "originated", share: 0.03, why: "Korolev headed GIRD, which launched the first Soviet liquid-fuelled rocket, GIRD-X, on 25 November 1933, after Goddard's 1926 flight." },
    { from: "wernher-von-braun", to: "v-2-rocket", type: "originated", share: 0.4, why: "Von Braun was technical director of the Peenemünde team that designed the A-4. Co-claimants: Walter Dornberger, the program's military head; Walter Riedel, who planned the large rocket with him in 1936; Walter Thiel, who redesigned its engine; and Goddard, whose turbopumps, gyroscopic vanes and film cooling it used." },
    { from: "liquid-propellant-rocket", to: "v-2-rocket", type: "embodies", share: 0.2, why: "The V-2 was a liquid-propellant rocket, burning alcohol with liquid oxygen fed by turbopumps." },
    { from: "v-2-rocket", to: "r-7-semyorka", type: "builds_on", share: 0.15, why: "The first Soviet missile, the R-1, was a copy of the V-2, and Korolev's R-2 and R-5 developed its technology toward the R-7." },
    { from: "liquid-propellant-rocket", to: "r-7-semyorka", type: "embodies", share: 0.15, why: "The R-7 burned kerosene with liquid oxygen in Glushko's four-chamber RD-107 and RD-108 engines." },
    { from: "sergei-korolev", to: "r-7-semyorka", type: "originated", share: 0.4, why: "Korolev's OKB-1 designed the R-7 from 1953, and Korolev led the program from 1954. Co-designers: Mikhail Tikhonravov, who proposed the packet of staged rockets in 1947; Dmitry Okhotsimsky's mathematicians, who refined it; and Valentin Glushko, who built its engines." },
    { from: "sergei-korolev", to: "wernher-von-braun", type: "rivalry", share: 0, why: "Korolev and von Braun were the leading architects of the Soviet and American sides of the Space Race: Korolev's R-7 launched the first satellite and the first man, and von Braun's Saturn V took Americans to the Moon." },
    { from: "robert-goddard", to: "wernher-von-braun", type: "rivalry", share: 0, why: "Goddard saw a captured V-2 in 1945 and concluded the Germans had taken his work, which von Braun denied, and Dornberger won the V-2 its priority by telling Hitler Germany was in a race with Goddard and the United States." },

    // ---------- Satellites ----------
    { from: "sergei-korolev", to: "satellite", type: "originated", share: 0.25, why: "Korolev proposed using the R-7 to launch a satellite in 1954, won approval and launched Sputnik 1, the first artificial satellite, on 4 October 1957. Rivals: Mikhail Tikhonravov, whose report he forwarded, and the American Vanguard and Explorer projects; Explorer 1 reached orbit in January 1958." },
    { from: "wernher-von-braun", to: "satellite", type: "originated", share: 0.05, why: "Von Braun proposed a satellite launch in 1954, and his Army team launched Explorer 1, the first American satellite, on 31 January 1958, after Sputnik 1 and 2." },
    { from: "liquid-propellant-rocket", to: "satellite", type: "builds_on", share: 0.15, why: "Tsiolkovsky showed in 1903 that a multi-stage liquid-fuelled rocket could reach orbital speed, and Sputnik 1 reached orbit on a kerosene and liquid oxygen rocket." },
    { from: "r-7-semyorka", to: "satellite", type: "builds_on", share: 0.1, why: "Built to lift a heavy Soviet nuclear warhead, the R-7 had the payload to put the first satellites in orbit, which gave the Soviet Union its head start in space." },
    { from: "radio", to: "satellite", type: "builds_on", share: 0.05, why: "Satellites talk to their ground stations through radio transponders, and Sputnik 1 was tracked around the world by its radio signal." },
    { from: "solar-cell", to: "satellite", type: "builds_on", share: 0.03, why: "Most satellites draw their power from solar panels." },
    { from: "satellite", to: "sputnik-1", type: "embodies", share: 0.25, why: "Sputnik 1 was the first artificial satellite: a radio transmitter placed in orbit." },
    { from: "sergei-korolev", to: "sputnik-1", type: "originated", share: 0.25, why: "Korolev proposed the satellite in 1954, moved its launch two days early for fear of an American one and managed its assembly himself. Co-claimants: Tikhonravov's group, which built it, and its lead and deputy designers, Mikhail Khomyakov and Oleg Ivanovskiy." },
    { from: "r-7-semyorka", to: "sputnik-1", type: "builds_on", share: 0.15, why: "Sputnik 1 was launched by the 8K71PS, a modified R-7, whose core stage followed it into orbit and was what most watchers saw." },
    { from: "radio", to: "sputnik-1", type: "embodies", share: 0.1, why: "Sputnik 1 carried a radio transmitter that beeped on 20.005 and 40.002 MHz to radio amateurs around the world." },
    { from: "satellite", to: "communications-satellite", type: "builds_on", share: 0.3, why: "A communications satellite is a satellite carrying transponders that relay signals around the curve of the Earth." },
    { from: "radio", to: "communications-satellite", type: "builds_on", share: 0.15, why: "Communications satellites relay radio and microwave signals, which travel by line of sight and so cannot follow the curve of the Earth." },
    { from: "bell-labs", to: "communications-satellite", type: "originated", share: 0.1, why: "Telstar, developed under an agreement among AT&T, Bell Telephone Laboratories, NASA and the British and French post offices, was the first active direct-relay commercial communications satellite and carried the first transatlantic television in 1962. Rivals: Arthur C. Clarke, who proposed geostationary relays in 1945; ARPA's SCORE, the first satellite built to relay messages, in 1958; and Hughes's Syncom, the first in geosynchronous orbit." },
    { from: "nasa", to: "communications-satellite", type: "originated", share: 0.1, why: "NASA launched Echo 1, the first passive relay satellite, in 1960 and launched Telstar in 1962. Rivals: ARPA's SCORE and Courier relays, Hughes's Syncom and AT&T's Telstar team." },
    { from: "satellite", to: "weather-satellite", type: "builds_on", share: 0.3, why: "A weather satellite is an Earth-observation satellite whose cameras and radiometers watch clouds, temperature and wind." },
    { from: "nasa", to: "weather-satellite", type: "originated", share: 0.3, why: "NASA's TIROS-1 of 1960 was the first successful weather satellite, and its Nimbus program and, with NOAA, the GOES series followed. Rivals: Vanguard 2, launched in 1959, which returned little useful data, and the Soviet Meteor series of 1964." },
    { from: "television", to: "weather-satellite", type: "builds_on", share: 0.05, why: "TIROS, the Television Infrared Observation Satellite, carried television cameras and sent back the first television footage of weather from space." },
    { from: "satellite", to: "gps", type: "builds_on", share: 0.25, why: "GPS is a constellation of navigation satellites, whose predictable orbits and signal delays let a receiver fix its position." },
    { from: "sputnik-1", to: "gps", type: "builds_on", share: 0.05, why: "Tracking Sputnik 1's radio signal by its Doppler shift, Guier and Weiffenbach of the Applied Physics Laboratory turned to the reverse problem of locating a receiver, which became TRANSIT, the forerunner of GPS." },

    // ---------- Agencies and programs ----------
    { from: "wernher-von-braun", to: "nasa", type: "led", share: 0.05, why: "Von Braun's Army team moved to NASA in 1960, and he directed its Marshall Space Flight Center until 1970 and served as Deputy Associate Administrator for Planning until 1972." },
    { from: "wernher-von-braun", to: "apollo-program", type: "led", share: 0.15, why: "Von Braun directed the Marshall Space Flight Center, which built the Saturn V that launched Apollo to the Moon. Samuel Phillips was the program's director and James Webb NASA's administrator." },
    { from: "nasa", to: "apollo-program", type: "collaboration", share: 0, why: "Apollo was NASA's program: the agency built the Manned Spacecraft Center and the Launch Operations Center for it and spent more than half its 1960s budget on it." },
    { from: "nasa", to: "spacex", type: "collaboration", share: 0, why: "NASA paid SpaceX $396 million under COTS to develop Falcon 9 and Dragon and gave it a $1.6 billion resupply contract in 2008, and SpaceX's Crew Dragon restored American crew launches for NASA in 2020." },

    // ---------- Stations, shuttles and telescopes ----------
    { from: "satellite", to: "space-station", type: "builds_on", share: 0.15, why: "A space station is an artificial satellite with living quarters for its crew." },
    { from: "wernher-von-braun", to: "space-station", type: "originated", share: 0.05, why: "Von Braun published a rotating wheel station in Collier's Weekly and pressed NASA to build a station from its creation, which it did with Skylab. Earlier: Tsiolkovsky, Oberth and Potočnik's 1929 wheel; first built: the Soviet Salyut 1 of 1971." },
    { from: "nasa", to: "space-station", type: "originated", share: 0.1, why: "NASA flew Skylab, the first American space station, in 1973 and led the building of the International Space Station. Rival: the Soviet program, whose Salyut 1 was the first station and whose Mir was the first modular one." },
    { from: "apollo-program", to: "space-station", type: "originated", share: 0.03, why: "Skylab, the first American station, was built from a Saturn V upper stage under the Apollo Applications Program and launched on the last Saturn V." },
    { from: "nasa", to: "international-space-station", type: "collaboration", share: 0, why: "NASA is one of the station's five partner agencies, built the US Orbital Segment with ESA, JAXA and CSA, and paid the largest share of its $150 billion cost." },
    { from: "spacex", to: "international-space-station", type: "collaboration", share: 0, why: "SpaceX's Dragon became the first commercial spacecraft to deliver cargo to the station in 2012 and has carried its crews since 2020, and SpaceX is building the vehicle that will deorbit it." },
    { from: "space-shuttle", to: "international-space-station", type: "collaboration", share: 0, why: "Shuttle crews installed Unity in 1998 and most of the American modules, trusses and solar arrays, and 36 Shuttle flights went to building the station." },
    { from: "nasa", to: "space-shuttle", type: "made", share: 0.45, why: "NASA set the Shuttle's design with the Air Force, ran its orbiter work at the Johnson Space Center and its launch system at Marshall, and flew all 135 missions. Contractors: Rockwell built the orbiters, Rocketdyne the RS-25 engines, Martin Marietta the external tank and Morton Thiokol the solid rocket boosters." },
    { from: "liquid-propellant-rocket", to: "space-shuttle", type: "embodies", share: 0.1, why: "The Shuttle's three RS-25 main engines, the first throttleable reusable engines, burned liquid hydrogen and liquid oxygen from its external tank." },
    { from: "rocket", to: "space-shuttle", type: "embodies", share: 0.05, why: "The Shuttle lifted off on two solid rocket boosters burning alongside its main engines, and the failure of an O-ring in one destroyed Challenger in 1986." },
    { from: "nasa", to: "hubble-space-telescope", type: "made", share: 0.4, why: "NASA funded the telescope, its Marshall center designed and built it and its Goddard center runs it. Co-builders: Perkin-Elmer, which made the optics; Lockheed, which built the spacecraft; and the European Space Agency, which supplied an instrument and the solar cells. Lyman Spitzer proposed it in 1946." },
    { from: "telescope", to: "hubble-space-telescope", type: "embodies", share: 0.15, why: "Hubble is a reflecting telescope with a 2.4-metre primary mirror, placed above the distortion of the atmosphere." },
    { from: "satellite", to: "hubble-space-telescope", type: "embodies", share: 0.05, why: "Hubble is a satellite in low Earth orbit, controlled from the ground by the Goddard Space Flight Center." },
    { from: "space-shuttle", to: "hubble-space-telescope", type: "builds_on", share: 0.1, why: "Hubble was designed to be launched and serviced by the Shuttle: Discovery deployed it on STS-31, and five Shuttle crews repaired and upgraded it from 1993 to 2009." },

    // ---------- Commercial spaceflight ----------
    { from: "spacex", to: "falcon-9", type: "made", share: 0.5, why: "SpaceX designed, builds and flies the Falcon 9, which it developed with its own capital and $396 million from NASA's COTS program for Falcon 9 and Dragon." },
    { from: "liquid-propellant-rocket", to: "falcon-9", type: "embodies", share: 0.15, why: "Both Falcon 9 stages are driven by SpaceX's Merlin engines burning kerosene and liquid oxygen." },
    { from: "space-shuttle", to: "falcon-9", type: "supersedes", share: 0, why: "With Crew Dragon in May 2020, Falcon 9 restored American crew launches, which had relied on Russian Soyuz since the Shuttle's last flight in 2011." },
  ],
};

/** Links to or from entries assigned to other batches (see MASTER LIST), merged later. */
export const crossLinksA2: InventionsLink[] = [
  { from: "thermonuclear-weapon", to: "r-7-semyorka", type: "embodies", share: 0.05, why: "The R-7 was built to carry a thermonuclear warhead of three to five megatons, based on the RDS-37 design, to the United States." },
  { from: "aeroplane", to: "space-shuttle", type: "builds_on", share: 0.05, why: "The orbiter was a winged spaceplane that glided to a runway landing, its shape drawn from NASA's lifting-body aircraft, and it was ferried home on a modified Boeing 747." },
  { from: "electrolysis", to: "space-station", type: "builds_on", share: 0.03, why: "Stations make their crews' oxygen by electrolysis: Mir's Elektron system split water and vented the hydrogen to space." },
  { from: "boeing", to: "international-space-station", type: "collaboration", share: 0, why: "Boeing was NASA's prime contractor for the station, with its contract extended to 2020, and built the US segment's cooling system, whose failed pump forced repair spacewalks in 2010." },
  { from: "google", to: "spacex", type: "collaboration", share: 0, why: "Google invested in SpaceX in 2015, runs Starlink's ground computing under a 2021 agreement and in 2026 bought computing capacity in SpaceX's Colossus data centers." },
];
