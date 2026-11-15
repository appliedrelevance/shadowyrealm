/**
 * Coverage batch a1: aviation, from the hot air balloon to the jet airliner.
 * Drafted against Wikipedia's Timeline of historic inventions.
 */
import type { InventionsContent, InventionsLink } from "../types";

export const coverageA1: InventionsContent = {
  entities: [
    // ---------- Balloons, parachutes and airships ----------
    {
      slug: "hot-air-balloon",
      name: "Hot air balloon",
      type: "invention",
      wiki: "Hot air balloon",
      description: "A lighter-than-air aircraft lifted by heated air in an envelope, the first technology to carry people in flight.",
      metadata: { invented_date: "1783", place: "Annonay, France", field: "aviation" },
      periods: [
        {
          label: "The Montgolfier balloons",
          start: 1783,
          end: 1794,
          description: "The Montgolfier brothers flew hot air balloons in public in 1783, and on 21 November Pilâtre de Rozier and the marquis d'Arlandes made the first free flight by humans, over Paris; in 1794 the French observed the battle of Fleurus from the balloon l'Entreprenant.",
        },
        {
          label: "Propane balloons",
          start: 1960,
          end: 1998,
          description: "Ed Yost and Jim Winker flew the first modern balloon with an onboard heat source on 22 October 1960, Britain built the Bristol Belle in 1967, and in 1991 Lindstrand and Branson crossed from Japan to Canada at 394 km/h; in 1989 two balloons collided at Alice Springs, killing all 13 aboard one.",
        },
        {
          label: "Records and tourist flights",
          start: 1999,
          end: 2026,
          description: "Vijaypat Singhania flew a hot air balloon to 21,027 metres in 2005, and balloons now fly mainly for recreation and tourism; the 2013 crash at Luxor killed 19 of the 21 aboard, the deadliest balloon accident.",
        },
      ],
    },
    {
      slug: "montgolfier-brothers",
      name: "Montgolfier brothers",
      type: "person",
      wiki: "Montgolfier brothers",
      description: "Joseph-Michel and Jacques-Étienne Montgolfier, paper makers of Annonay, France, who invented the hot air balloon that carried the first humans into free flight in 1783.",
      metadata: {
        birth_date: "1740 (Joseph-Michel), 1745 (Jacques-Étienne)",
        death_date: "1810 (Joseph-Michel), 1799 (Jacques-Étienne)",
        nationality: "French",
        field: "aviation",
      },
      periods: [
        {
          label: "Paper makers of Annonay",
          start: 1772,
          end: 1781,
          description: "Étienne took over the family paper mills at Annonay in 1772 and brought in the latest Dutch methods, and Joseph built parachutes from 1775.",
        },
        {
          label: "Balloons",
          start: 1782,
          end: 1784,
          description: "Joseph lifted a taffeta-covered box on the heat of burning paper in November 1782; the brothers flew a balloon in public at Annonay on 4 June 1783, sent a sheep, a duck and a rooster aloft at Versailles on 19 September, and launched the first free human flight over Paris on 21 November.",
        },
        {
          label: "The hydraulic ram and Canson",
          start: 1785,
          end: 1810,
          description: "Joseph invented the self-acting hydraulic ram in 1796; Étienne died in 1799 and his son-in-law took over the firm, which became Canson-Montgolfier in 1807, and Joseph died in 1810.",
        },
      ],
    },
    {
      slug: "parachute",
      name: "Parachute",
      type: "invention",
      wiki: "Parachute",
      description: "A fabric canopy that slows a fall through the air by drag, used to escape aircraft, drop troops and cargo, and land spacecraft.",
      metadata: { invented_date: "1783", place: "France", field: "aviation" },
      periods: [
        {
          label: "Renaissance designs",
          start: 1470,
          end: 1616,
          description: "A manuscript of the 1470s attributed to Francesco di Giorgio Martini shows a conical parachute, Leonardo da Vinci drew a pyramidal one in his Codex Atlanticus, and Faust Vrančić published a framed sail canopy as Homo Volans in Machinae Novae.",
        },
        {
          label: "Balloon jumps",
          start: 1783,
          end: 1910,
          description: "Louis-Sébastien Lenormand made the first public jump in 1783 and named the parachute in 1785, André Garnerin made the first descent under a frameless silk canopy in 1797, and in 1907 Charles Broadwick packed his parachute into a backpack pulled open by a static line.",
        },
        {
          label: "Aviators",
          start: 1911,
          end: 1938,
          description: "Grant Morton made the first jump from an aeroplane in 1911, Franz Reichelt died jumping from the Eiffel Tower in a parachute of his own in 1912, and artillery observers parachuted from hydrogen observation balloons in World War I. The US Army's Type-A backpack parachute with a ripcord, tested by Leslie Irvin in 1919, went into production, and the Soviet Union formed airborne troops in 1931.",
        },
        {
          label: "Paratroops, nylon and sport",
          start: 1939,
          end: 2026,
          description: "German paratroops made the first large opposed airborne landings, at Fort Eben-Emael and The Hague, Operation Market Garden was the largest airborne operation ever, and after Adeline Gray's first nylon jump in 1942 the industry switched from silk to nylon. Parachutes also drop cargo, slow aircraft and return space capsules, and US jumps in 2017 had one death per 133,571.",
        },
      ],
    },
    {
      slug: "airship",
      name: "Airship",
      type: "invention",
      wiki: "Airship",
      description: "A lighter-than-air aircraft that flies under its own power, lifted by hydrogen or helium and steered by engines and rudders.",
      metadata: { invented_date: "1852", field: "aviation" },
      periods: [
        {
          label: "First powered dirigibles",
          start: 1852,
          end: 1899,
          description: "Henri Giffard flew 27 km in a steam-powered airship in 1852, Paul Haenlein flew the first aircraft driven by an internal combustion engine in 1872, and La France made the first fully controllable flight in 1884 on an electric motor; Wölfert's Daimler-engined Deutschland caught fire in flight in 1897, killing both aboard.",
        },
        {
          label: "Rigid airships and the first air war",
          start: 1900,
          end: 1918,
          description: "Zeppelin's LZ 1 flew in 1900 and Santos-Dumont flew around the Eiffel Tower in 1901; Italy flew the first airship bombing mission in 1912, and airships scouted and bombed in World War I until aeroplanes replaced them as bombers.",
        },
        {
          label: "Airliners and disasters",
          start: 1919,
          end: 1945,
          description: "R34 made the first Atlantic crossing by a passenger aircraft in 1919 and Norge the first flight over the North Pole in 1926, but crashes killed 48 aboard the R101 in 1930, 73 aboard USS Akron in 1933 and 35 of the 97 aboard the Hindenburg in 1937. Goodyear built 154 airships for the US Navy from 1942 to 1945, which escorted coastal convoys against submarines.",
        },
        {
          label: "Blimps",
          start: 1946,
          end: 2026,
          description: "Helium-filled non-rigid airships, the rule since the 1960s, carry advertising, television cameras, sightseers and surveillance equipment, and the Zeppelin company returned with the Zeppelin NT, first flown in 1997.",
        },
      ],
    },
    {
      slug: "zeppelin",
      name: "Zeppelin",
      type: "product",
      wiki: "Zeppelin",
      description: "Ferdinand von Zeppelin's rigid airship, a metal-framed hull of hydrogen gas cells, flown by the first airline and as a bomber in World War I.",
      metadata: { introduced_date: "1900", maker: "Luftschiffbau Zeppelin" },
      periods: [
        {
          label: "LZ 1 and DELAG",
          start: 1899,
          end: 1913,
          description: "Count Zeppelin's LZ 1 first flew over Lake Constance on 2 July 1900, and after LZ 4 burned at Echterdingen in 1908 public donations of over six million marks founded Luftschiffbau Zeppelin; its airline DELAG carried 10,197 fare-paying passengers on 1,588 flights before the war, and the loss of L 1 in 1913 drowned 14, the first deaths in a zeppelin accident.",
        },
        {
          label: "World War I",
          start: 1914,
          end: 1918,
          description: "The German Army and Navy flew zeppelins as scouts and bombers, 84 of them built during the war and over 60 lost; 51 raids on England dropped 5,806 bombs, killing 557 people and injuring 1,358.",
        },
        {
          label: "Graf Zeppelin and Hindenburg",
          start: 1919,
          end: 1940,
          description: "Under Hugo Eckener the company built LZ 126 for the US Navy in 1924 and the Graf Zeppelin, which circled the globe in 1929 and flew a regular Frankfurt–Recife service; the hydrogen-filled Hindenburg burned at Lakehurst on 6 May 1937, killing 35 of the 97 aboard and one of the ground crew, and the last zeppelins were scrapped in 1940.",
        },
        {
          label: "Zeppelin NT",
          start: 1997,
          end: 2026,
          description: "Luftschiffbau Zeppelin returned with the helium-filled, semi-rigid Zeppelin NT, flown for sightseeing, advertising and passenger service, and Goodyear put three into service between 2014 and 2018.",
        },
      ],
    },

    // ---------- The aeroplane ----------
    {
      slug: "george-cayley",
      name: "George Cayley",
      type: "person",
      wiki: "George Cayley",
      description: "English baronet and engineer who set out the modern aeroplane in 1799 and built the first glider reliably reported to carry a person.",
      metadata: { birth_date: "1773", death_date: "1857", nationality: "English", field: "aeronautics" },
      periods: [
        {
          label: "On Aerial Navigation",
          start: 1799,
          end: 1810,
          description: "Cayley set out the modern aeroplane as a fixed-wing machine with separate systems for lift, propulsion and control in 1799, flew a model glider with a modern tail in 1804, and published On Aerial Navigation in 1809 and 1810, naming the four forces of flight.",
        },
        {
          label: "Engines and the Polytechnic",
          start: 1811,
          end: 1842,
          description: "Cayley built hot air engines, the second of them in 1837 a forerunner of the internal combustion engine, sat as MP for Scarborough from 1832 to 1835, and helped found the Royal Polytechnic Institution in 1838.",
        },
        {
          label: "Piloted gliders",
          start: 1843,
          end: 1857,
          description: "Cayley proposed the convertiplane in 1843, flew a ten-year-old boy in a biplane before 1849, and in 1853 sent an adult across Brompton Dale in a larger glider; he died in 1857.",
        },
      ],
    },
    {
      slug: "otto-lilienthal",
      name: "Otto Lilienthal",
      type: "person",
      wiki: "Otto Lilienthal",
      description: "German engineer, the 'flying man', who made the first well-documented, repeated glider flights and died in a gliding crash in 1896.",
      metadata: { birth_date: "1848", death_date: "1896", nationality: "German", field: "aviation" },
      periods: [
        {
          label: "Boilers and Birdflight",
          start: 1867,
          end: 1890,
          description: "Lilienthal began experiments on the force of air in 1867, founded a company making boilers and steam engines, and published Birdflight as the Basis of Aviation in 1889.",
        },
        {
          label: "First glides",
          start: 1891,
          end: 1893,
          description: "Lilienthal made his first glides in the spring of 1891 near Derwitz, flew from a tower on the Maihöhe in Berlin in 1892, and in 1893 glided 250 metres in the Rhinow Hills, a distance no one beat in his lifetime.",
        },
        {
          label: "The flying man",
          start: 1894,
          end: 1896,
          description: "Lilienthal built the Fliegeberg, a 15-metre artificial hill, in 1894, his Berlin works built the Normalsegelapparat, the first aeroplane in series production, and he made over 2,000 flights in all. On 9 August 1896 his glider stalled and fell 15 metres, and he died of a broken neck the next day, the first person recorded killed in a glider accident.",
        },
      ],
    },
    {
      slug: "aeroplane",
      name: "Aeroplane",
      type: "invention",
      wiki: "Airplane",
      description: "A powered fixed-wing aircraft, held up by its wings and driven by propellers or jet engines.",
      metadata: { invented_date: "1903", place: "Kill Devil Hills, North Carolina", field: "aviation" },
      periods: [
        {
          label: "Concept and gliders",
          start: 1799,
          end: 1902,
          description: "George Cayley set out the fixed-wing aeroplane in 1799 and flew a passenger-carrying glider in 1853, Clément Ader's steam-powered Éole made an uncontrolled hop in 1890, and Otto Lilienthal made repeated glides from 1891.",
        },
        {
          label: "First powered aeroplanes",
          start: 1903,
          end: 1913,
          description: "The Wright brothers made the first sustained and controlled powered flight in 1903 and flew the fully controllable Flyer III in 1905; Santos-Dumont flew 220 metres in 1906, and Blériot's monoplanes of 1908 and 1909 set the modern tractor layout and crossed the Channel.",
        },
        {
          label: "War and airmail",
          start: 1914,
          end: 1938,
          description: "Aeroplanes served as observation platforms and then as weapons in World War I, with the first aerial victory by a synchronised machine gun in 1915; in 1919 Alcock and Brown crossed the Atlantic non-stop and the first international commercial flights ran between the United States and Canada.",
        },
        {
          label: "Jets and mass air travel",
          start: 1939,
          end: 2026,
          description: "The Heinkel He 178 flew on a jet engine in 1939, aeroplanes fought in every major battle of World War II, and airliners now carry more than four billion passengers a year. Aircraft emit carbon dioxide, soot and contrails and make noise around airports, and most light piston aircraft burn avgas containing tetraethyllead.",
        },
      ],
    },
    {
      slug: "helicopter",
      name: "Helicopter",
      type: "invention",
      wiki: "Helicopter",
      description: "A rotorcraft lifted and driven by powered horizontal rotors, able to take off vertically and hover.",
      metadata: { invented_date: "1936", place: "Germany", field: "aviation" },
      periods: [
        {
          label: "Rotor models",
          start: 1754,
          end: 1906,
          description: "Mikhail Lomonosov demonstrated a spring-driven coaxial rotor model in 1754, George Cayley built rotor models of feathers and tin, Gustave de Ponton d'Amécourt coined the word helicopter in 1861, and Enrico Forlanini's steam-powered helicopter rose 13 metres in 1877.",
        },
        {
          label: "First lifts",
          start: 1907,
          end: 1935,
          description: "The Breguet brothers' Gyroplane No. 1 lifted its pilot in 1907 and Paul Cornu made the first free piloted flight on 13 November that year; Oehmichen and Pescara set the first FAI helicopter records in 1924, while Juan de la Cierva's autogyro became the first practical rotorcraft.",
        },
        {
          label: "Practical helicopters",
          start: 1936,
          end: 1950,
          description: "Heinrich Focke's Fw 61 flew in June 1936, Germany used helicopters for observation, transport and evacuation in World War II, and Sikorsky's R-4 of 1942 was the first mass-produced helicopter; the Bell 47 was the first certified for US civil use, in 1946.",
        },
        {
          label: "Turbine helicopters",
          start: 1951,
          end: 2026,
          description: "The Kaman K-225 flew on a turboshaft in 1951, and helicopters have since evacuated casualties from Korea onward, carried troops and cargo, fought fires and, as attack helicopters, fired missiles and miniguns at ground targets; the civil and government fleet numbered 38,570 in 2018.",
        },
      ],
    },
    {
      slug: "igor-sikorsky",
      name: "Igor Sikorsky",
      type: "person",
      wiki: "Igor Sikorsky",
      description: "Russian-American aircraft designer who built the first four-engine aeroplane and the VS-300, the pattern for the modern single-rotor helicopter.",
      metadata: { birth_date: "1889", death_date: "1972", nationality: "Russian-American", field: "aviation" },
      periods: [
        {
          label: "First machines",
          start: 1909,
          end: 1911,
          description: "Sikorsky's helicopters of 1909 and 1910 could not lift a pilot, but his S-2 biplane flew on 3 June 1910 and his S-5 earned him FAI pilot's licence No. 64 in 1911.",
        },
        {
          label: "Russky Vityaz and Ilya Muromets",
          start: 1912,
          end: 1918,
          description: "As chief aircraft engineer of the Russian Baltic Railroad Car Works, Sikorsky flew the Russky Vityaz, the first successful four-engine aircraft, on 13 May 1913, and redesigned his Ilya Muromets airliner as the world's first four-engined bomber for World War I; he fled the Bolsheviks in 1918.",
        },
        {
          label: "Flying boats",
          start: 1919,
          end: 1938,
          description: "In the United States Sikorsky founded the Sikorsky Manufacturing Company in 1923, which joined United Aircraft and Transport in 1929 and built Pan Am's ocean-crossing flying boats, among them the S-42 Clipper of 1934.",
        },
        {
          label: "The VS-300 and R-4",
          start: 1939,
          end: 1972,
          description: "Sikorsky flew the VS-300 on 14 September 1939, with the single main rotor and tail rotor most helicopters now use, and developed it into the R-4 of 1942, the first mass-produced helicopter; he died in 1972.",
        },
      ],
    },

    // ---------- The jet ----------
    {
      slug: "jet-engine",
      name: "Jet engine",
      type: "invention",
      wiki: "Jet engine",
      description: "An air-breathing reaction engine, usually a gas turbine, that drives an aircraft forward with a jet of hot exhaust.",
      metadata: { invented_date: "1937", place: "England and Germany", field: "aviation" },
      periods: [
        {
          label: "Patents",
          start: 1921,
          end: 1936,
          description: "Maxime Guillaume patented an aircraft gas turbine in 1921 that was never built, Frank Whittle patented a turbojet in England in 1930, and Hans von Ohain began a similar design in Germany in 1935.",
        },
        {
          label: "First jets",
          start: 1937,
          end: 1945,
          description: "Whittle's engine first ran in 1937 and von Ohain's HeS 3b flew the Heinkel He 178 on 27 August 1939; the Junkers Jumo 004 went into mass production in 1944 for the Me 262, the first operational jet fighter, which made the first jet ground attacks and air victories.",
        },
        {
          label: "Jet age",
          start: 1946,
          end: 1969,
          description: "By the 1950s jet engines powered almost every combat aircraft, and by the 1960s every large civil aircraft, leaving the piston engine to niche roles.",
        },
        {
          label: "Turbofans",
          start: 1970,
          end: 2026,
          description: "High-bypass turbofans from the 1970s matched the fuel efficiency of the best piston engines, the GE90 of the 1990s reached 115,000 lbf of thrust, and in-flight shutdowns fell from 40 to fewer than one per 100,000 engine hours; jet engines also power cruise missiles and drones.",
        },
      ],
    },
    {
      slug: "frank-whittle",
      name: "Frank Whittle",
      type: "person",
      wiki: "Frank Whittle",
      description: "English RAF engineer who patented the turbojet in 1930 and ran the first jet engine in 1937.",
      metadata: { birth_date: "1907", death_date: "1996", nationality: "English", field: "aeronautical engineering" },
      periods: [
        {
          label: "The turbojet patent",
          start: 1928,
          end: 1935,
          description: "As an RAF cadet at Cranwell Whittle put his turbojet ideas to his superiors in 1928 and patented the engine in January 1930, but the Air Ministry showed no interest and let the patent lapse in 1935.",
        },
        {
          label: "Power Jets",
          start: 1936,
          end: 1945,
          description: "Whittle co-founded Power Jets in 1936, ran the WU, the first jet engine, on 12 April 1937, and flew his W.1 in the Gloster E.28/39 on 15 May 1941; the strain brought nervous breakdowns in 1940 and 1944, the year the government nationalised Power Jets.",
        },
        {
          label: "After the jet",
          start: 1946,
          end: 1996,
          description: "Whittle received £100,000 and a knighthood in 1948 and retired from the RAF, then worked for BOAC, for Shell on a turbine-driven drill and for Bristol Aero Engines; he taught at the US Naval Academy from 1977 to 1979 and died in 1996.",
        },
      ],
    },
    {
      slug: "hans-von-ohain",
      name: "Hans von Ohain",
      type: "person",
      wiki: "Hans von Ohain",
      description: "German physicist who designed the engine of the first jet aircraft, the Heinkel He 178 of 1939.",
      metadata: { birth_date: "1911", death_date: "1998", nationality: "German-American", field: "aeronautical engineering" },
      periods: [
        {
          label: "Göttingen",
          start: 1933,
          end: 1935,
          description: "As a Göttingen physics student von Ohain conceived an engine without a propeller in 1933, and after his PhD in 1935 had the mechanic Max Hahn build a model, which could not run without an electric motor.",
        },
        {
          label: "Heinkel",
          start: 1936,
          end: 1945,
          description: "Hired by Ernst Heinkel in April 1936, von Ohain ran the hydrogen-fuelled HeS 1 in 1937, and his HeS 3b powered the He 178, the first jet aircraft, on 27 August 1939; none of his later engines reached production.",
        },
        {
          label: "Wright-Patterson",
          start: 1947,
          end: 1998,
          description: "Brought to the United States by Operation Paperclip in 1947, von Ohain directed the Air Force Aeronautical Research Laboratory from 1956 and was chief scientist of the Aero Propulsion Laboratory by 1975; he shared the 1991 Draper Prize with Whittle and died in 1998.",
        },
      ],
    },
    {
      slug: "jet-airliner",
      name: "Jet airliner",
      type: "invention",
      wiki: "Jet airliner",
      description: "A commercial airliner propelled by jet engines, the vehicle of mass air travel since the 1950s.",
      metadata: { invented_date: "1949", place: "Britain", field: "aviation" },
      periods: [
        {
          label: "The Comet",
          start: 1948,
          end: 1957,
          description: "The Nene-powered Vickers Viking flew as the first jet-only airliner on 6 April 1948, and the de Havilland Comet entered service with BOAC in 1952 carrying 36 passengers at 450 mph, until metal fatigue caused serious structural problems within two years.",
        },
        {
          label: "The 707 and the narrow-bodies",
          start: 1958,
          end: 1969,
          description: "The Boeing 707, Douglas DC-8 and Caravelle followed the Comet into service, turbofans replaced turbojets in the 1960s, and the Boeing 737 of that decade became the most produced jet, with 11,395 delivered by April 2023; the supersonic Concorde first flew in 1969 and proved an economic disaster.",
        },
        {
          label: "Wide-bodies",
          start: 1970,
          end: 2002,
          description: "The Boeing 747 entered service with Pan Am in January 1970, seating up to 400 and cutting fares, followed by the DC-10, TriStar and Airbus A300; ETOPS rules from the 1980s let twinjets fly ocean routes.",
        },
        {
          label: "Composite twinjets",
          start: 2003,
          end: 2026,
          description: "Boeing began the composite 787 in 2003 and flew it in 2009, while Airbus built 251 A380s before ending production in 2019; by June 2023 Boeing had produced 1,054 787s.",
        },
      ],
    },
    {
      slug: "boeing",
      name: "Boeing",
      type: "organization",
      wiki: "Boeing",
      description: "American aerospace company founded in Seattle in 1916, maker of the B-17 and B-29 bombers, the 707, 737 and 747 jetliners, and missiles and bombs.",
      metadata: { founded_date: "1916", headquarters: "Arlington County, Virginia", organization_type: "company" },
      periods: [
        {
          label: "Seaplanes and airmail",
          start: 1916,
          end: 1933,
          description: "William Boeing founded Pacific Aero Products in Seattle in 1916, renamed it Boeing Airplane Company in 1917 and sold the Navy training seaplanes in World War I; its Model 40A won the San Francisco–Chicago airmail contract in 1927, and its 247 of 1933, the first twin-engine airliner able to fly on one engine, set the standard for passenger aircraft.",
          wiki: "History of Boeing",
        },
        {
          label: "Bombers",
          start: 1934,
          end: 1954,
          description: "Split from United Airlines by the Air Mail Act of 1934, Boeing built the 314 Clipper flying boat and the pressurised 307 Stratoliner, then B-17 and B-29 bombers through World War II, over 350 aircraft a month by March 1944. When the bomber orders were cancelled 70,000 workers lost their jobs, and Boeing turned to the B-47 and B-52 jet bombers.",
          wiki: "History of Boeing",
        },
        {
          label: "Jetliners",
          start: 1955,
          end: 1996,
          description: "Boeing delivered its 707 from 1958, the 727, the first jetliner to reach 1,000 sales, the 737, the best-selling jet airliner, and the 747 from 1970, and built the Saturn V's first stage and the Chinook helicopter; in the slump of the early 1970s its airliner workforce fell from 83,700 in 1968 to 20,750 in 1971.",
          wiki: "History of Boeing",
        },
        {
          label: "McDonnell Douglas and the 737 MAX",
          start: 1997,
          end: 2026,
          description: "Boeing absorbed McDonnell Douglas in 1997; two 737 MAX crashes in 2018 and 2019 killed 346 people and grounded 387 aircraft, and in 2021 Boeing paid over $2.5 billion to settle a charge of hiding information from safety regulators. Its missiles were used in indiscriminate attacks that killed civilians in Yemen, and Israel dropped its GBU-39 bombs on a Rafah refugee camp in the Gaza war.",
        },
      ],
    },
  ],

  links: [
    // ---------- Balloons, parachutes and airships ----------
    { from: "montgolfier-brothers", to: "hot-air-balloon", type: "originated", share: 0.6, why: "The Montgolfiers built and flew the first hot air balloons in 1782 and 1783, and their balloon carried the first free flight by humans on 21 November 1783. Rivals: Bartolomeu de Gusmão, whose 1709 Passarola the FAI does not recognise, and the Chinese sky lantern, a precursor." },
    { from: "paper", to: "hot-air-balloon", type: "builds_on", share: 0.05, why: "The first hot air balloons were paper: Gusmão's 1709 model was thick brown paper, and the Montgolfiers, paper makers, lined their 1783 sackcloth envelope with three layers of paper." },
    { from: "montgolfier-brothers", to: "parachute", type: "originated", share: 0.03, why: "Joseph Montgolfier built parachutes from 1775 and once jumped from the family house. Lenormand, who made the first public jump in 1783 and named the device, is credited with the modern parachute, after designs by Leonardo and Vrančić." },
    { from: "hot-air-balloon", to: "parachute", type: "builds_on", share: 0.1, why: "The parachute grew up as a way down from balloons: Blanchard demonstrated it in 1785 as a means of leaving a hot-air balloon, and Broadwick jumped from hot air balloons at fairs." },
    { from: "aeroplane", to: "parachute", type: "builds_on", share: 0.05, why: "The backpack parachute with a ripcord was developed for aviators escaping disabled aeroplanes, from Grant Morton's first jump from an aeroplane in 1911 to the US Army's Type-A of 1919." },
    { from: "silk", to: "parachute", type: "builds_on", share: 0.05, why: "Blanchard made parachutes of folded silk from the late 1790s, Garnerin's 1797 frameless canopy was silk, and most parachutes were silk until World War II." },
    { from: "hot-air-balloon", to: "airship", type: "builds_on", share: 0.1, why: "The airship began as a balloon given propulsion and steering: Meusnier designed one in December 1783, weeks after the first balloon flights, and Blanchard fitted a propeller to a balloon in 1784. Rival ancestor: Jacques Charles's hydrogen balloon of 1783, whose lifting gas airships used." },
    { from: "internal-combustion-engine", to: "airship", type: "builds_on", share: 0.1, why: "Haenlein's airship of 1872 was the first aircraft driven by an internal combustion engine, Wölfert's flew on Daimler petrol engines from 1888, and zeppelins flew on Daimler and Maybach engines. Rivals: Giffard's steam engine of 1852 and the electric motors of Tissandier and La France." },
    { from: "airship", to: "zeppelin", type: "embodies", share: 0.3, why: "A zeppelin is a rigid airship: a fabric-covered metal frame enclosing separate gas cells, driven by engines in gondolas hung beneath the hull." },
    { from: "internal-combustion-engine", to: "zeppelin", type: "embodies", share: 0.1, why: "LZ 1 flew on two 15-horsepower Daimler engines, and the wartime R class on six 240-horsepower Maybach engines." },

    // ---------- The aeroplane ----------
    { from: "wright-brothers", to: "aeroplane", type: "originated", share: 0.35, why: "The FAI recognises the Wrights' 1903 flights as the first sustained and controlled heavier-than-air powered flight, and their Flyer III of 1905 was fully controllable. Rivals: Cayley and Lilienthal, whose work they built on; Hiram Maxim, whose 1894 rig had the lift to rise; Ader, whose Éole hopped in 1890; and Santos-Dumont, who flew in 1906." },
    { from: "george-cayley", to: "aeroplane", type: "originated", share: 0.15, why: "Cayley set out the aeroplane in 1799 as a fixed-wing machine with separate systems for lift, propulsion and control, named its four forces and built a glider that carried a man in 1853; modern aeroplane design rests on his work, and the Wrights acknowledged it." },
    { from: "otto-lilienthal", to: "aeroplane", type: "originated", share: 0.1, why: "Lilienthal made over 2,000 glider flights from 1891, the first well-documented repeated heavier-than-air flights, built the first aeroplane in series production and inspired the Wrights, who dropped his lift data after two seasons." },
    { from: "internal-combustion-engine", to: "aeroplane", type: "builds_on", share: 0.1, why: "Cayley predicted that sustained flight would wait for a light engine; the Wright Flyer flew on a 12-horsepower petrol engine, and piston engines powered aeroplanes until gas turbines took over." },
    { from: "aeroplane", to: "wright-flyer", type: "embodies", share: 0.1, why: "The Flyer was the first aeroplane to make a sustained, controlled powered flight: fixed wings for lift, propellers for thrust and separate controls, the layout Cayley set out in 1799." },
    { from: "airship", to: "aeroplane", type: "supersedes", share: 0, why: "Aeroplanes had almost entirely replaced airships as bombers by the end of World War I, and the airship's last advantage, on intercontinental routes, had vanished by the end of World War II." },
    { from: "igor-sikorsky", to: "helicopter", type: "originated", share: 0.25, why: "Sikorsky's VS-300 of 1939 set the single main rotor and tail rotor layout most helicopters use, and his R-4 of 1942 was the first mass-produced helicopter. Rivals: Heinrich Focke, whose Fw 61 of 1936 was the first practical helicopter; the Breguet brothers and Paul Cornu, who lifted pilots in 1907; Pescara; and Cierva's autogyro." },
    { from: "george-cayley", to: "helicopter", type: "originated", share: 0.03, why: "Cayley built rotor models of feathers and then tin, powered by rubber bands and springs, and diagrammed the elements of vertical flight; his writings influenced later pioneers." },
    { from: "internal-combustion-engine", to: "helicopter", type: "builds_on", share: 0.1, why: "Helicopters needed more engine power for their weight than aeroplanes: Cornu's 1907 machine lifted on a 24-horsepower Antoinette engine, and better fuels and engines were a critical factor in the helicopter's development." },
    { from: "jet-engine", to: "helicopter", type: "builds_on", share: 0.05, why: "Turboshafts, gas turbines related to the jet, gave the Kaman K-225 the first turbine-powered helicopter flight in 1951 and are the preferred helicopter powerplant today." },

    // ---------- The jet ----------
    { from: "frank-whittle", to: "jet-engine", type: "originated", share: 0.3, why: "Whittle patented a turbojet in 1930 and ran the first jet engine on 12 April 1937, and his centrifugal engines powered every Allied jet of World War II. Rivals: von Ohain, whose engine flew first, in 1939; Maxime Guillaume, who patented an unbuildable turbojet in 1921; and Anselm Franz, whose axial Jumo 004 was the first in production." },
    { from: "hans-von-ohain", to: "jet-engine", type: "originated", share: 0.2, why: "Von Ohain's HeS 3b powered the He 178, the first jet aircraft, on 27 August 1939, developed apart from Whittle though he had read Whittle's patent; his radial designs never reached production, and the axial engines of Franz and Oestrich did." },
    { from: "internal-combustion-engine", to: "jet-engine", type: "builds_on", share: 0.05, why: "The jet is an internal combustion engine: Whittle began with a motorjet whose compressor a piston engine drove, then asked why not substitute a turbine for the piston engine." },
    { from: "frank-whittle", to: "hans-von-ohain", type: "rivalry", share: 0, why: "Whittle and von Ohain built the first turbojets independently on opposite sides of the war, and von Ohain had to narrow his patent claims around Whittle's; they later shared the 1991 Draper Prize." },
    { from: "boeing", to: "jet-airliner", type: "originated", share: 0.15, why: "Boeing's 707, delivered from 1958, was the first widely successful commercial jet and, with Douglas and Convair designs, set the podded-engine, swept-wing layout most jetliners follow; its 747 of 1970 began the wide-body. Rivals: de Havilland, whose Comet entered service in 1952 as the first jet airliner, Tupolev and Sud Aviation." },
    { from: "jet-engine", to: "jet-airliner", type: "builds_on", share: 0.3, why: "A jetliner is an airliner propelled by jet engines: the first flew on turbojets and from the 1960s on quieter, more efficient turbofans." },
    { from: "aeroplane", to: "jet-airliner", type: "builds_on", share: 0.2, why: "Jetliners put jet engines on the fixed-wing airliner; the first jet-powered airliners were conversions of the piston-engined Avro Lancastrian." },
  ],
};

/** Links to or from entries assigned to other batches (see MASTER LIST), merged later. */
export const crossLinksA1: InventionsLink[] = [
  { from: "electric-motor", to: "airship", type: "builds_on", share: 0.05, why: "Tissandier flew an airship on a Siemens electric motor in 1883, and La France made the first fully controllable free flight in 1884 on an 8.5-horsepower electric motor." },
  { from: "nylon", to: "parachute", type: "builds_on", share: 0.05, why: "After Adeline Gray made the first jump with a nylon parachute in June 1942, when the war cut off Japanese silk, the industry switched to nylon." },
  { from: "nylon", to: "hot-air-balloon", type: "builds_on", share: 0.03, why: "Modern sport balloon envelopes are generally nylon fabric, with fire-resistant Nomex at the mouth nearest the burner." },
  { from: "boeing", to: "apollo-program", type: "collaboration", share: 0, why: "Boeing built the S-IC first stage of the Saturn V, Apollo's Moon rocket, under a 1961 contract at the Michoud Assembly Facility in New Orleans." },
  { from: "boeing", to: "international-space-station", type: "collaboration", share: 0, why: "Boeing was the first contractor for the International Space Station programme, serves as its prime contractor and built several of its major components." },
];
