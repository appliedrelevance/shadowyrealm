/**
 * The people and organizations behind coverage entries that no creator was credited for, where
 * Wikipedia names one (batch B, 2026-11-17), so each passes a share of its weight back to them.
 */
import type { InventionsContent } from "../types";

export const coverageOriginatorsB: InventionsContent = {
  entities: [
    // ---------- Photography ----------
    {
      slug: "louis-daguerre",
      name: "Louis Daguerre",
      type: "person",
      wiki: "Louis Daguerre",
      description: "French painter and theatre designer who created the Diorama and, after a partnership with Nicéphore Niépce, invented the daguerreotype, made public in 1839.",
      metadata: { birth_date: "1787", death_date: "1851", nationality: "French", field: "photography" },
      periods: [
        {
          label: "The Diorama",
          start: 1821,
          end: 1828,
          description: "Daguerre and the painter Charles Marie Bouton opened the Diorama in Paris in July 1822, a revolving auditorium in which shifting light transformed translucent canvases 70 feet wide and 45 feet tall; its Interior of Roslin Chapel of 1824 drew a Times article calling it perfectly magical.",
        },
        {
          label: "Partnership with Niépce",
          start: 1829,
          end: 1838,
          description: "Daguerre went into partnership with Nicéphore Niépce in 1829, and after Niépce's death in 1833 coated silver-plated copper with silver iodide and found that a faint latent image could be developed in mercury vapour heated to 75 °C and fixed in hot salt water. His dioramas earned 200,000 francs a year and led to new diorama theatres in London and Berlin.",
        },
        {
          label: "The daguerreotype",
          start: 1839,
          end: 1851,
          description: "The daguerreotype was announced on 7 January 1839, fire destroyed the Diorama on 8 March, and the French government bought the process for lifetime pensions for Daguerre and Isidore Niépce and gave it free to the world on 19 August 1839. Days before, Daguerre's agent applied for a British patent, the only country where licence fees were required, which held back the process there.",
        },
      ],
    },
    {
      slug: "nicephore-niepce",
      name: "Nicéphore Niépce",
      type: "person",
      wiki: "Nicéphore Niépce",
      description: "French inventor whose heliography made the oldest surviving camera photograph and who co-invented the Pyréolophore engine with his brother Claude.",
      metadata: { birth_date: "1765", death_date: "1833", nationality: "French", field: "photography" },
      periods: [
        {
          label: "The Pyréolophore",
          start: 1795,
          end: 1815,
          description: "Niépce resigned as administrator of the district of Nice in 1795 to pursue research with his brother Claude, and in 1807 they patented the Pyréolophore, one of the first internal combustion engines actually built, which ran on dust explosions of lycopodium powder and drove a boat on the Saône.",
        },
        {
          label: "Heliography",
          start: 1816,
          end: 1833,
          description: "Niépce made small camera negatives on silver chloride paper that he could not stop darkening, turned to light-hardened bitumen of Judea, copied an engraving of Pope Pius VII by heliography in 1822 and made the oldest surviving camera photograph between 1822 and 1827, with an exposure of days. His brother Claude died destitute in England in 1828 after squandering the family fortune on the Pyréolophore, and after working with Daguerre from 1829 Niépce died financially ruined in 1833.",
        },
      ],
    },

    // ---------- mRNA vaccines ----------
    {
      slug: "katalin-kariko",
      name: "Katalin Karikó",
      type: "person",
      wiki: "Katalin Karikó",
      description: "Hungarian-American biochemist who, with Drew Weissman, found the nucleoside modifications that let synthetic mRNA work in the body without setting off inflammation, the basis of mRNA vaccines.",
      metadata: { birth_date: "1955", nationality: "Hungarian-American", field: "biochemistry" },
      periods: [
        {
          label: "Szeged and Temple",
          start: 1978,
          end: 1988,
          description: "Karikó took her biology degree and doctorate at the University of Szeged in 1978 and 1982, while the Communist secret police listed her as an intelligence asset from 1978 to 1985, which she says she was blackmailed into. She left for Temple University in Philadelphia in 1985 and took part in a clinical trial of double-stranded RNA in patients with AIDS, blood diseases and chronic fatigue syndrome.",
        },
        {
          label: "Penn and modified mRNA",
          start: 1989,
          end: 2012,
          description: "At the University of Pennsylvania from 1989 Karikó proposed mRNA-based gene therapy in 1990, was demoted in 1995 after repeated grant rejections, and from 1997 worked with Drew Weissman, finding in 2005 that replacing uridine with pseudouridine kept synthetic mRNA from setting off inflammation. They co-founded RNARx in 2006 and patented modified nucleosides, but the university sold the licence to the company that became Cellscript.",
        },
        {
          label: "BioNTech and the Nobel Prize",
          start: 2013,
          end: 2026,
          description: "Karikó was a vice president and then senior vice president of BioNTech from 2013 to 2022, whose COVID-19 vaccine with Pfizer, like Moderna's, used her and Weissman's modified mRNA and showed over 90% efficacy in 2020. She shared the 2023 Nobel Prize in Physiology or Medicine with Weissman and gave her prize money to the University of Szeged, where she is a professor.",
        },
      ],
    },
    {
      slug: "drew-weissman",
      name: "Drew Weissman",
      type: "person",
      wiki: "Drew Weissman",
      description: "American immunologist who, with Katalin Karikó, modified the nucleosides of synthetic mRNA so that it no longer set off the immune system, the discovery behind the mRNA COVID-19 vaccines.",
      metadata: { birth_date: "1959", nationality: "American", field: "immunology" },
      periods: [
        {
          label: "Training",
          start: 1981,
          end: 1996,
          description: "Weissman studied biochemistry at Brandeis University, took his MD and PhD at Boston University in 1987, and after a residency at Beth Israel Deaconess Medical Center was a fellow at the National Institutes of Health under Anthony Fauci.",
        },
        {
          label: "Penn and modified mRNA",
          start: 1997,
          end: 2019,
          description: "Weissman opened his University of Pennsylvania laboratory in 1997 and began working with Katalin Karikó; from 2005 they published studies showing that modified nucleosides kept synthetic mRNA from triggering immune and inflammatory reactions, and developed its packaging in lipid nanoparticles. They co-founded RNARx in 2006, and their patents, licensed through Cellscript to Moderna and BioNTech, laid the groundwork for RNA therapeutics.",
        },
        {
          label: "COVID-19 vaccines",
          start: 2020,
          end: 2026,
          description: "Their modified RNA became the key component of the Pfizer–BioNTech and Moderna COVID-19 vaccines deployed worldwide from 2020, and Weissman shared the 2023 Nobel Prize in Physiology or Medicine. He directs the Penn Institute for RNA Innovation and works on pan-coronavirus vaccines and, with Chulalongkorn University, on COVID-19 vaccines for Thailand and its neighbours.",
        },
      ],
    },

    // ---------- Television ----------
    {
      slug: "john-logie-baird",
      name: "John Logie Baird",
      type: "person",
      wiki: "John Logie Baird",
      description: "Scottish engineer who gave the first public demonstration of television in 1926 and the first colour television transmission in 1928.",
      metadata: { birth_date: "1888", death_date: "1946", nationality: "Scottish", field: "electrical engineering" },
      periods: [
        {
          label: "Hastings and Frith Street",
          start: 1923,
          end: 1927,
          description: "In Hastings in 1923 Baird built a television set from a hatbox, darning needles, bicycle lenses and a tea chest, survived a 1,000-volt shock in 1924, and at 22 Frith Street in London gave the first public demonstration of television with tonal gradation on 26 January 1926. In 1927 he sent television pictures 438 miles by telephone line from London to Glasgow.",
        },
        {
          label: "Baird Television and the BBC",
          start: 1928,
          end: 1937,
          description: "His Baird Television Development Company made the first transatlantic television transmission in 1928, the year he demonstrated colour and stereoscopic television, and the BBC broadcast on his 30-line system from 1929 to 1935. From November 1936 the BBC alternated his 240-line system with EMI's 405-line one and dropped his in February 1937, after a fire destroyed his Crystal Palace facilities.",
        },
        {
          label: "Electronic colour television",
          start: 1938,
          end: 1946,
          description: "Baird showed hybrid colour television in 1939, three-dimensional television at 500 lines in 1941 and the first practical fully electronic colour television display on 16 August 1944, and persuaded the Hankey Committee to plan a 1,000-line colour standard that was never adopted; his wartime defence work has never been officially acknowledged.",
        },
      ],
    },
    {
      slug: "philo-farnsworth",
      name: "Philo Farnsworth",
      type: "person",
      wiki: "Philo Farnsworth",
      description: "American inventor whose image dissector camera tube transmitted the first image of an all-electronic television system in 1927.",
      metadata: { birth_date: "1906", death_date: "1971", nationality: "American", field: "electronics" },
      periods: [
        {
          label: "The image dissector",
          start: 1926,
          end: 1937,
          description: "Backed with $6,000 by Leslie Gorrell and George Everson, Farnsworth transmitted the first image of an all-electronic television system, a straight line, at 202 Green Street in San Francisco on 7 September 1927, refused David Sarnoff's offer of $100,000 for his patents in 1931, and won the 1934 patent interference case RCA brought against him. Image dissector cameras made under his agreement with Fernseh in Germany helped broadcast the 1936 Berlin Olympics, and he developed radio-wave sterilisation of milk and a fog-penetrating beam for ships and aircraft.",
        },
        {
          label: "Farnsworth Television and ITT",
          start: 1938,
          end: 1966,
          description: "Farnsworth was director of research of the Farnsworth Television and Radio Corporation in Fort Wayne from 1938, RCA agreed in 1939 to license his television patent for $1 million, and ITT bought the company in 1951; at ITT he worked on a defence early-warning signal, submarine detection devices, radar calibration equipment, an infrared telescope, the PPI Projector that led to today's air traffic control, and fusors for nuclear fusion.",
        },
        {
          label: "Fusion in Utah",
          start: 1967,
          end: 1971,
          description: "Farnsworth moved his fusion research to Brigham Young University in 1967 with Philo T. Farnsworth Associates, which won a NASA contract but ran out of financing: the banks called in its loans, the Internal Revenue Service locked the laboratory, and it disbanded in January 1971. Dependent on alcohol in his later years, he died of pneumonia that March.",
        },
      ],
    },
    {
      slug: "vladimir-zworykin",
      name: "Vladimir K. Zworykin",
      type: "person",
      wiki: "Vladimir K. Zworykin",
      description: "Russian-American engineer who led RCA's television development and built its kinescope receiving tube and iconoscope camera tube.",
      metadata: { death_date: "1982", nationality: "Russian-American", field: "electronics" },
      periods: [
        {
          label: "Rosing and Westinghouse",
          start: 1911,
          end: 1929,
          description: "Zworykin and his teacher Boris Rosing sent crude images by wire to a Braun tube in St Petersburg in 1911, and after serving in the Russian Signal Corps he left Russia in 1918. At Westinghouse in Pittsburgh he applied on 29 December 1923 for a television system with cathode-ray tubes as transmitter and receiver, which was never successfully demonstrated, and in 1929 introduced the kinescope receiving tube.",
        },
        {
          label: "RCA",
          start: 1930,
          end: 1954,
          description: "Hired by David Sarnoff in 1930 to lead RCA's television development in Camden, Zworykin's team built the iconoscope camera tube from 1931 on Kálmán Tihanyi's charge-storage principle, while RCA lost its 1934 priority case against Farnsworth; he also worked on infrared image tubes and the electron microscope, and retired in 1954.",
        },
        {
          label: "Medical electronics",
          start: 1955,
          end: 1982,
          description: "Zworykin turned to medical and biological engineering as founder and first president of the International Federation for Medical and Biological Engineering, and received the National Medal of Science in 1966.",
        },
      ],
    },

    // ---------- GPS ----------
    {
      slug: "bradford-parkinson",
      name: "Bradford Parkinson",
      type: "person",
      wiki: "Bradford Parkinson",
      description: "US Air Force colonel and engineer who led the design and development of the NAVSTAR Global Positioning System from 1973.",
      metadata: { birth_date: "1935", nationality: "American", field: "aerospace engineering" },
      periods: [
        {
          label: "Air Force engineer",
          start: 1957,
          end: 1972,
          description: "Commissioned in the US Air Force in 1957, Parkinson studied inertial guidance at MIT and Stanford, taught at the Test Pilot School and the Air Force Academy, and led the final development of the AC-130 gunship's digital fire-control system, flying 26 combat missions over South East Asia in the Vietnam War.",
        },
        {
          label: "NAVSTAR GPS",
          start: 1973,
          end: 1978,
          description: "Assigned to Project 621B in 1973, Parkinson re-architected it at the Labor Day Lonely Halls Meeting in the Pentagon, won approval and budget in December 1973 for a four-satellite demonstration, and directed its satellites, ground control, nine types of receivers and tests, commanding the launch of the first prototype GPS satellite in 1978, 44 months after go-ahead. He told Congress the system would carry a signal for civilian use from the outset.",
        },
        {
          label: "Industry and Stanford",
          start: 1979,
          end: 2026,
          description: "After Rockwell International and Intermetrics, which wrote the Space Shuttle's HAL/S language, Parkinson joined Stanford in 1984, was chief executive of Trimble Navigation in 1999 and co-led Gravity Probe B, launched in 2004 to test general relativity; he shared the Queen Elizabeth Prize for Engineering for GPS in 2019.",
        },
      ],
    },
    {
      slug: "roger-l-easton",
      name: "Roger L. Easton",
      type: "person",
      wiki: "Roger L. Easton",
      description: "Naval Research Laboratory physicist whose TIMATION satellites put precise clocks in orbit for passive navigation, and whose NTS-2 satellite first transmitted GPS signals.",
      metadata: { birth_date: "1921", death_date: "2014", nationality: "American", field: "physics" },
      periods: [
        {
          label: "Satellite tracking",
          start: 1943,
          end: 1959,
          description: "Easton joined the Naval Research Laboratory in 1943 to work on radar beacons and blind-landing systems, co-wrote its Project Vanguard satellite proposal in 1955, invented the Minitrack system in 1957 to track Vanguard and extended it to follow Sputnik, and in 1959 designed the Naval Space Surveillance System, the first to detect and track all types of Earth-orbiting objects.",
        },
        {
          label: "TIMATION",
          start: 1960,
          end: 1980,
          description: "Easton developed navigation by passive ranging from satellites in circular orbits carrying precise clocks, patented as TIMATION and tested on TIMATION I and II in 1967 and 1969 and Navigation Technology Satellites 1 and 2 in 1974 and 1977, NTS-2 being the first satellite to transmit GPS signals; he retired in 1980.",
        },
        {
          label: "New Hampshire",
          start: 1981,
          end: 2014,
          description: "Easton ran for governor of New Hampshire in 1986, served three terms on the board of the New Hampshire Electric Cooperative, and received the National Medal of Technology in 2006 for the work that led to GPS.",
        },
      ],
    },
    {
      slug: "ivan-getting",
      name: "Ivan A. Getting",
      type: "person",
      wiki: "Ivan Getting",
      description: "American physicist who co-led the wartime SCR-584 radar and, as founding president of The Aerospace Corporation, designed and championed the satellite navigation that became GPS.",
      metadata: { birth_date: "1912", death_date: "2003", nationality: "American", field: "physics and electrical engineering" },
      periods: [
        {
          label: "Radiation Laboratory",
          start: 1940,
          end: 1949,
          description: "At the MIT Radiation Laboratory Getting co-led with Louis Ridenour the group that built the SCR-584, the first automatic microwave tracking fire-control radar, which with the proximity fuze let anti-aircraft guns destroy the V-1 flying bombs launched at London: of 104 fired on 28 August 1944, 68 fell to artillery.",
        },
        {
          label: "Air Force and Raytheon",
          start: 1950,
          end: 1959,
          description: "Getting was the Air Force's Assistant for Development Planning during the Korean War and from 1951 vice president for engineering and research at Raytheon, where he oversaw the first three-dimensional time-difference-of-arrival position-finding system, for a rail-mobile ICBM, and work on the Sparrow III and Hawk missiles. On the Navy's Project Nobska he recommended the submarine-launched solid-fuel missile that became the basis of Polaris.",
        },
        {
          label: "The Aerospace Corporation",
          start: 1960,
          end: 1978,
          description: "As founding president of The Aerospace Corporation from 1960 to 1977 Getting oversaw ballistic missile planning, launches for Mercury and Gemini, high-powered chemical lasers and studies of satellite navigation for fast-moving vehicles, and pressed for GPS against Pentagon resistance; he was president of the IEEE in 1978.",
        },
      ],
    },

    // ---------- Plastics and drugs ----------
    {
      slug: "eugen-baumann",
      name: "Eugen Baumann",
      type: "person",
      wiki: "Eugen Baumann",
      description: "German chemist who synthesised polyvinyl chloride in 1872 and, with Carl Schotten, discovered the Schotten–Baumann reaction.",
      metadata: { birth_date: "1846", death_date: "1896", nationality: "German", field: "chemistry" },
      periods: [
        {
          label: "Tübingen and the first PVC",
          start: 1870,
          end: 1875,
          description: "Baumann passed his pharmacy examination in 1870 and took his doctorate under Felix Hoppe-Seyler at Tübingen in 1872, the year he synthesised polyvinyl chloride, a white solid that formed in a flask of vinyl chloride left out of sunlight for four weeks.",
        },
        {
          label: "Berlin and Freiburg",
          start: 1876,
          end: 1896,
          description: "After habilitating at Strasbourg in 1876 Baumann headed the chemistry department of the Institute of Physiology in Berlin, where with Carl Schotten he found the Schotten–Baumann synthesis of amides; he traced the aromatic compounds of urine to amino acids such as tyrosine, synthesised thioacetals and thioketals, showed with his coworkers that thyroxine is the thyroid's active ingredient, and became a professor at Freiburg.",
        },
      ],
    },
    {
      slug: "waldo-semon",
      name: "Waldo Semon",
      type: "person",
      wiki: "Waldo Semon",
      description: "American chemist at B.F. Goodrich who plasticised PVC in 1926, turning it into flexible vinyl, and developed the synthetic rubbers Koroseal and Ameripol.",
      metadata: { birth_date: "1898", death_date: "1999", nationality: "American", field: "chemical engineering" },
      periods: [
        {
          label: "Plasticised vinyl",
          start: 1926,
          end: 1934,
          description: "Semon plasticised PVC at B.F. Goodrich from 1926, blending it with additives and commercialising the first vinyl plasticisers, with dibutyl phthalate by 1933, which made vinyl the world's third most used plastic.",
        },
        {
          label: "Koroseal and Ameripol",
          start: 1935,
          end: 1999,
          description: "Semon made Koroseal from salt, coke and limestone on 11 December 1935 and, after more than 5,000 synthetic rubber compounds, Ameripol in 1940, taking 116 patents in all; after retiring from B.F. Goodrich he was a research professor at Kent State University and gave the land of the Waldo Semon Woods conservation area.",
        },
      ],
    },
    {
      slug: "friedrich-serturner",
      name: "Friedrich Sertürner",
      type: "person",
      wiki: "Friedrich Sertürner",
      description: "German pharmacist who isolated morphine from opium in 1804, the first alkaloid isolated from any plant, and tested it on animals, boys and himself.",
      metadata: { birth_date: "1783", death_date: "1841", nationality: "German", field: "pharmacy" },
      periods: [
        {
          label: "Morphium",
          start: 1803,
          end: 1816,
          description: "Sertürner qualified as a pharmacist in Paderborn in 1803 and from 1804 isolated morphine from opium, the first alkaloid isolated from any plant; his impure extract of 1806 was tested on a mouse and three dogs, one of which died. He opened his own pharmacy in Einbeck in 1809 and from 1812 to 1814 worked on improving guns and cannons for the army and navy.",
        },
        {
          label: "Publication and Hamelin",
          start: 1817,
          end: 1841,
          description: "In 1817 Sertürner published pure morphine crystals after dosing himself and three boys no older than seventeen to near-fatal intoxication, became addicted and warned of the drug's terrible effects, and Merck began selling it a few years later. He ran the main pharmacy in Hamelin from 1822, studied the town's cholera epidemic of 1831 and received the Montyon Prize that year.",
        },
      ],
    },

    // ---------- Medicine ----------
    {
      slug: "hanaoka-seishu",
      name: "Hanaoka Seishū",
      type: "person",
      wiki: "Hanaoka Seishū",
      description: "Edo-period Japanese surgeon who performed the first recorded operation under general anaesthesia, in 1804, with his herbal tsūsensan.",
      metadata: { birth_date: "1760", death_date: "1835", nationality: "Japanese", field: "surgery" },
      periods: [
        {
          label: "Tsūsensan",
          start: 1785,
          end: 1804,
          description: "From 1785 Hanaoka worked to re-create Hua Tuo's lost anaesthetic mafeisan, and his wife, a volunteer in his experiments, lost her sight; his tsūsensan of datura, monkshood and other plants brought unconsciousness for 6 to 24 hours, depending on the dose. On 13 October 1804 he removed a breast cancer from Kan Aiya, aged 60, under it.",
        },
        {
          label: "The Hanaoka method",
          start: 1805,
          end: 1835,
          description: "Patients came from all over Japan, and Hanaoka performed more than 150 breast cancer operations under tsūsensan, removed malignant tumours and bladder stones, amputated limbs, devised surgical instruments and trained many students in his method.",
        },
      ],
    },
    {
      slug: "william-t-g-morton",
      name: "William T. G. Morton",
      type: "person",
      wiki: "William T. G. Morton",
      description: "American dentist who gave the first public demonstration of ether anaesthesia for surgery, at Massachusetts General Hospital in 1846.",
      metadata: { birth_date: "1819", death_date: "1868", nationality: "American", field: "dentistry" },
      periods: [
        {
          label: "Dentist and ether",
          start: 1840,
          end: 1846,
          description: "Morton studied at the Baltimore College of Dental Surgery and with Horace Wells, learned of ether from Charles Jackson at Harvard, and on 30 September 1846 extracted a tooth painlessly under it. On 16 October 1846 at Massachusetts General Hospital he gave ether while John Collins Warren removed a tumour from Edward Gilbert Abbott's neck, news that spread rapidly around the world.",
        },
        {
          label: "Letheon and the ether controversy",
          start: 1847,
          end: 1868,
          description: "Morton tried to disguise ether as Letheon and patented it, a patent the medical profession condemned, and his deceptive tactics and the rival claims of Jackson and Wells sank his petitions to Congress for $100,000 from 1846 to 1853. From 1862 he gave ether to more than 2,000 wounded soldiers of the Army of the Potomac, and he died of a stroke in 1868.",
        },
      ],
    },
    {
      slug: "crawford-long",
      name: "Crawford Long",
      type: "person",
      wiki: "Crawford Long",
      description: "Georgia physician who removed a tumour under inhaled ether on 30 March 1842, four years before Morton's demonstration, but published only in 1849.",
      metadata: { birth_date: "1815", death_date: "1878", nationality: "American", field: "surgery and pharmacy" },
      periods: [
        {
          label: "Jefferson, Georgia",
          start: 1841,
          end: 1849,
          description: "Long took over a rural practice in Jefferson, Georgia, in 1841, experimented with ether on three enslaved people, and on 30 March 1842 removed a tumour from James M. Venable's neck under it, then used ether in amputations and, from 1845, in childbirth. He published his results only in 1849, after Morton's demonstration.",
        },
        {
          label: "Athens",
          start: 1850,
          end: 1878,
          description: "Long moved to Atlanta in 1850 and to Athens in 1851, where he and his brother Robert ran a practice and pharmacy; in 1854 he asked Senator William Crosby Dawson to put his priority claim to Congress, and in the Civil War he treated soldiers of both sides.",
        },
      ],
    },
    {
      slug: "rene-laennec",
      name: "René Laennec",
      type: "person",
      wiki: "René Laennec",
      description: "French physician who invented the stethoscope in 1816 and used it to diagnose diseases of the chest by mediate auscultation.",
      metadata: { birth_date: "1781", death_date: "1826", nationality: "French", field: "medicine" },
      periods: [
        {
          label: "Paris medicine",
          start: 1799,
          end: 1815,
          description: "Laennec studied medicine in Paris from 1799 under Dupuytren and Corvisart, who trained him to use sound as a diagnostic aid, and in 1804 gave the first lecture on melanoma, which led to bitter exchanges with Dupuytren.",
        },
        {
          label: "The stethoscope",
          start: 1816,
          end: 1826,
          description: "At the Necker hospital in 1816 Laennec rolled a quire of paper to listen to a woman's heart, then built a wooden cylinder 25 cm by 2.5 cm, correlated its sounds with autopsy findings, named rales, rhonchi, crepitance and egophony, and published De l'Auscultation Médiate in 1819. He named cirrhosis, became professor of medicine in 1823 and died of tuberculosis in 1826.",
        },
      ],
    },

    // ---------- Sewing and fastening ----------
    {
      slug: "barthelemy-thimonnier",
      name: "Barthélemy Thimonnier",
      type: "person",
      wiki: "Barthélemy Thimonnier",
      description: "French tailor who patented the first sewing machine to replicate hand sewing in 1830 and opened the first machine-based clothing factory.",
      metadata: { birth_date: "1793", death_date: "1857", nationality: "French", field: "tailoring and machinery" },
      periods: [
        {
          label: "The first clothing factory",
          start: 1823,
          end: 1831,
          description: "A tailor near Saint-Étienne from 1823, Thimonnier built a chain-stitch sewing machine in 1829, patented with Auguste Ferrand on 17 July 1830, and opened a workshop of 80 machines in the rue de Sèvres in Paris to sew army uniforms. In 1831 150 to 200 tailors stormed it and destroyed dozens of machines; 75 were arrested, and Thimonnier left the company that year.",
        },
        {
          label: "Amplepuis",
          start: 1832,
          end: 1857,
          description: "Back in Amplepuis as a tailor, Thimonnier patented new machines in 1841, 1845 and 1847 and won prizes at world's fairs, but his machine did not spread and he died in poverty in 1857.",
        },
      ],
    },
    {
      slug: "elias-howe",
      name: "Elias Howe",
      type: "person",
      wiki: "Elias Howe",
      description: "American inventor who patented the lockstitch sewing machine in 1846 and won royalties from the manufacturers who copied it.",
      metadata: { birth_date: "1819", death_date: "1867", nationality: "American", field: "mechanical engineering" },
      periods: [
        {
          label: "The lockstitch machine",
          start: 1838,
          end: 1849,
          description: "Howe conceived the sewing machine in Ari Davis's Cambridge instrument shop, and on 10 September 1846 received US patent 4750 for a lockstitch machine with an eye-pointed needle, a shuttle beneath the cloth and an automatic feed. Finding no American investors, he sold his first machine in London for £250 and returned nearly penniless in 1849, and his wife died soon after.",
        },
        {
          label: "Patent war and royalties",
          start: 1850,
          end: 1867,
          description: "Howe's suit against Isaac Singer for copying his lockstitch ran from 1849 to 1854 and won him royalties from Singer and others, and from 1856 the Sewing Machine Combination paid him a royalty on every machine it made. He patented a clothing closure in 1851, equipped and served in the 17th Connecticut Infantry from 1862 to 1865, and won a gold medal at the Paris Exhibition and the Légion d'honneur in 1867.",
        },
      ],
    },
    {
      slug: "isaac-singer",
      name: "Isaac Singer",
      type: "person",
      wiki: "Isaac Singer",
      description: "American inventor and businessman who patented a practical sewing machine in 1851 and built I. M. Singer & Co. into one of the first American multinational companies.",
      metadata: { birth_date: "1811", death_date: "1875", nationality: "American", field: "manufacturing" },
      periods: [
        {
          label: "Actor and machinist",
          start: 1830,
          end: 1849,
          description: "Singer sold his 1839 patent for a rock drill for $2,000, toured for five years as the actor Isaac Merritt with his Merritt Players, and patented a machine for carving wood and metal in 1849. Married to Catherine Haley from 1830, he began in 1836 a 25-year affair with Mary Ann Sponsler, with whom he had ten children.",
        },
        {
          label: "I. M. Singer & Co.",
          start: 1850,
          end: 1862,
          description: "Singer redesigned the Lerow & Blodgett machine with a straight shuttle and needle, patented on 12 August 1851, lost Howe's suit for infringing his lockstitch patent, and in 1856 joined the Sewing Machine Combination; his company made 2,564 machines in 1856 and 13,000 in 1860, and mass production with interchangeable parts halved the price while instalment plans sold machines to homes. He beat Mary Ann Sponsler senseless, she had him arrested for bigamy, and he fled to London in 1862.",
        },
        {
          label: "The Singer Manufacturing Company",
          start: 1863,
          end: 1875,
          description: "I. M. Singer & Co. was dissolved in 1863 and continued as the Singer Manufacturing Company, with Singer holding 40% of its shares, and in 1871 he settled in Paignton, Devon, and built the 110-room Oldway Mansion. He died in 1875, leaving his $13 million fortune unequally among 20 of the 26 children he had fathered by five women.",
        },
      ],
    },
    {
      slug: "whitcomb-l-judson",
      name: "Whitcomb L. Judson",
      type: "person",
      wiki: "Whitcomb L. Judson",
      description: "American salesman and inventor who patented the clasp locker in 1893, the slide fastener from which the zipper evolved.",
      metadata: { birth_date: "1843", death_date: "1909", nationality: "American", field: "mechanical engineering" },
      periods: [
        {
          label: "Pneumatic street railway",
          start: 1886,
          end: 1890,
          description: "A travelling salesman from Minneapolis, Judson took 14 of his 30 patents on a street railway driven by compressed air, six of them in 1889, and its demonstration line in Washington, D.C., ran for a few weeks in 1890 before technical problems shut it down.",
        },
        {
          label: "The clasp locker",
          start: 1891,
          end: 1909,
          description: "Judson applied in November 1891 for his clasp locker, a hook-and-eye slide fastener for shoes patented on 29 August 1893 and shown at that year's Chicago World's Fair, and founded the Universal Fastener Company with Harry Earle and Lewis Walker to make it. It met little commercial success, and his improved C-curity fastener of 1905 tended to break open.",
        },
      ],
    },
    {
      slug: "gideon-sundback",
      name: "Gideon Sundbäck",
      type: "person",
      wiki: "Gideon Sundback",
      description: "Swedish-American electrical engineer who redesigned Judson's fastener into the modern zipper and built the machine that made it.",
      metadata: { birth_date: "1880", death_date: "1954", nationality: "Swedish-American", field: "electrical engineering" },
      periods: [
        {
          label: "The hookless fastener",
          start: 1906,
          end: 1923,
          description: "Hired in 1906 by the fastener company Judson had founded, Sundbäck registered a German patent in 1909, put a redesigned fastener on sale in 1913 with ten or eleven elements per inch and two facing rows of teeth, and patented it as the Separable Fastener in 1917. He built the S-L machine that made it, set up the Lightning Fastener Co. in St. Catharines, Ontario, and sold his European rights to Martin Othmar Winterhalter in 1923, the year B.F. Goodrich named his fastener the zipper.",
        },
      ],
    },

    // ---------- Writing and printing ----------
    {
      slug: "laszlo-biro",
      name: "László Bíró",
      type: "person",
      wiki: "László Bíró",
      description: "Hungarian-born Argentine journalist who patented the first commercially successful modern ballpoint pen.",
      metadata: { birth_date: "1899", death_date: "1985", nationality: "Hungarian-Argentine", field: "invention" },
      periods: [
        {
          label: "Budapest",
          start: 1930,
          end: 1940,
          description: "A Budapest journalist, Bíró saw that newspaper ink dried quickly, showed a ballpoint pen at the Budapest International Fair in 1931, and with his brother György developed a ball turning in a socket that drew viscous ink from a cartridge, patented in Paris in 1938.",
        },
        {
          label: "Argentina",
          start: 1943,
          end: 1985,
          description: "Having fled the Nazis to Argentina with his brother, Bíró filed a new patent on 17 June 1943 and formed Biro Pens of Argentina, whose pen is called the birome there; in 1945 he sold the patent to Marcel Bich, whose company has sold more than 100 billion ballpoint pens.",
        },
      ],
    },
    {
      slug: "alois-senefelder",
      name: "Alois Senefelder",
      type: "person",
      wiki: "Alois Senefelder",
      description: "German actor and playwright who invented lithography in the 1790s as a cheap way to print his plays.",
      metadata: { birth_date: "1771", death_date: "1834", nationality: "German", field: "printing" },
      periods: [
        {
          label: "Actor and playwright",
          start: 1791,
          end: 1795,
          description: "When his father died in 1791 Senefelder left his law studies at Ingolstadt to support his mother and eight siblings as an actor, wrote the successful play Connoisseur of Girls, and fell into debt over the printing of his Mathilde von Altenstein.",
        },
        {
          label: "Stone printing",
          start: 1796,
          end: 1834,
          description: "Experimenting with greasy ink on Solnhofen limestone, Senefelder found he could print from the flat stone, the first planographic process, and in 1796 started a publishing firm with the composer Franz Gleißner; he became inspector of the Lithographic Institute in Munich in 1809 and set up others in Berlin, Paris, London and Vienna. His manual of 1818, translated into French and English in 1819, stayed in print as late as 1977.",
        },
      ],
    },
    {
      slug: "louis-braille",
      name: "Louis Braille",
      type: "person",
      wiki: "Louis Braille",
      description: "French teacher, blind from childhood, who invented braille, the six-dot reading and writing system for blind people.",
      metadata: { birth_date: "1809", death_date: "1852", nationality: "French", field: "education of the blind" },
      periods: [
        {
          label: "Student at the Royal Institute",
          start: 1819,
          end: 1828,
          description: "Blind from the age of five after an accident with an awl, Braille entered the Royal Institute for Blind Youth in Paris in 1819, learned of Charles Barbier's twelve-dot code in 1821, reduced it to a six-dot cell a fingertip could read at one touch, and presented his system to his peers at fifteen.",
        },
        {
          label: "Professor and organist",
          start: 1829,
          end: 1852,
          description: "Braille published his system with musical notation in 1829 and revised it in 1837, became a full professor at the Institute in 1833, played the organ in Paris churches and published decapoint in 1839. Pierre-Armand Dufau, who opposed teaching braille, forced out its supporter Alexandre-René Pignier in 1840 and the system returned only in 1844; Braille died of a respiratory illness in 1852, two years before the Institute adopted it.",
        },
      ],
    },

    // ---------- Machines and instruments ----------
    {
      slug: "hubert-cecil-booth",
      name: "Hubert Cecil Booth",
      type: "person",
      wiki: "Hubert Cecil Booth",
      description: "English engineer whose Puffing Billy of 1901 was one of the first powered vacuum cleaners, the first to clean by suction alone.",
      metadata: { birth_date: "1871", death_date: "1955", nationality: "English", field: "engineering" },
      periods: [
        {
          label: "Maudslay, Sons and Field",
          start: 1892,
          end: 1900,
          description: "Booth joined the drawing office of Maudslay, Sons and Field in Lambeth in December 1892, designing bridges, Ferris wheels for London, Blackpool, Paris and Vienna, and engines for Royal Navy battleships.",
        },
        {
          label: "Puffing Billy",
          start: 1901,
          end: 1955,
          description: "After watching a dust-blowing machine in 1901, Booth built the Puffing Billy, a horse-drawn, petrol-engined cleaner that sucked dirt through a cloth filter, patented it that year and sold cleaning services from red vans, cleaning Westminster Abbey's carpets for Edward VII's coronation; he faced complaints about the noise and was fined for frightening horses. His company lost the household market to Hoover and turned to industrial cleaners.",
        },
      ],
    },
    {
      slug: "louis-essen",
      name: "Louis Essen",
      type: "person",
      wiki: "Louis Essen",
      description: "English physicist at the National Physical Laboratory who built the first practical caesium atomic clock in 1955 and measured the speed of light.",
      metadata: { birth_date: "1908", death_date: "1997", nationality: "English", field: "physics" },
      periods: [
        {
          label: "Quartz clocks and the speed of light",
          start: 1929,
          end: 1950,
          description: "At the National Physical Laboratory from 1929 Essen developed the quartz ring clock of 1938, a standard at observatories worldwide, worked on radar in World War II, and with A. C. Gordon-Smith measured the speed of light in a microwave cavity in 1946 as 299,792±3 km/s, against fierce criticism; his refined 1950 value of 299,792.5±1 km/s was adopted in 1957.",
        },
        {
          label: "Caesium clock and the atomic second",
          start: 1951,
          end: 1972,
          description: "Essen and Jack Parry built the first practical caesium atomic clock in 1955, and his measurement with William Markowitz of the ephemeris second in caesium frequency became the SI second in 1967. In 1971 he published a book questioning special relativity and said he was warned that persisting would spoil his career prospects; he retired in 1972.",
        },
      ],
    },
    {
      slug: "ernst-ruska",
      name: "Ernst Ruska",
      type: "person",
      wiki: "Ernst Ruska",
      description: "German physicist who built the first electron microscope with Max Knoll and won half the 1986 Nobel Prize in Physics for his work in electron optics.",
      metadata: { birth_date: "1906", death_date: "1988", nationality: "German", field: "physics" },
      periods: [
        {
          label: "Electron lenses",
          start: 1927,
          end: 1933,
          description: "At the Technische Hochschule Berlin Ruska showed in 1931 that a magnetic coil could act as an electron lens, and with several coils in series built an electron microscope in 1933, the year of his doctorate.",
        },
        {
          label: "Fernseh and Siemens",
          start: 1934,
          end: 1954,
          description: "Ruska worked on electron optics at Fernseh AG in Berlin and from 1937 at Siemens-Reiniger-Werke, where he helped develop the first commercially produced electron microscope in 1939 and had Siemens set up a laboratory for visiting researchers, headed by his brother Helmut, who applied it in medicine and biology.",
        },
        {
          label: "Fritz Haber Institute",
          start: 1955,
          end: 1988,
          description: "Ruska directed the Institute for Electron Microscopy of the Fritz Haber Institute until 1974, taught at the Technische Universität Berlin from 1957 to 1974, and won half the 1986 Nobel Prize in Physics.",
        },
      ],
    },
    {
      slug: "max-knoll",
      name: "Max Knoll",
      type: "person",
      wiki: "Max Knoll",
      description: "German electrical engineer who led the Berlin research group in which he and Ernst Ruska invented the electron microscope in 1931.",
      metadata: { birth_date: "1897", death_date: "1969", nationality: "German", field: "electrical engineering" },
      periods: [
        {
          label: "Electron research group",
          start: 1927,
          end: 1931,
          description: "Knoll led the electron research group at the Technische Hochschule Berlin-Charlottenburg, where in 1931 he and Ernst Ruska generated magnified images of mesh grids with two magnetic lenses, the first electron microscope.",
        },
        {
          label: "Telefunken and Munich",
          start: 1932,
          end: 1947,
          description: "Knoll joined Telefunken in Berlin in April 1932 to work on television design and lectured in Berlin, and after World War II became extraordinary professor and director of the Institute for Electromedicine at the University of Munich.",
        },
        {
          label: "Princeton and phosphenes",
          start: 1948,
          end: 1966,
          description: "Knoll worked in Princeton University's electrical engineering department from 1948, and after returning to Munich in 1956 generated phosphenes by electrically stimulating the brains of himself and other subjects; he retired in 1966.",
        },
      ],
    },
    {
      slug: "willard-libby",
      name: "Willard Libby",
      type: "person",
      wiki: "Willard Libby",
      description: "American physical chemist who developed radiocarbon dating at the University of Chicago and won the 1960 Nobel Prize in Chemistry for it.",
      metadata: { birth_date: "1908", death_date: "1980", nationality: "American", field: "physical chemistry" },
      periods: [
        {
          label: "Geiger counters and the Manhattan Project",
          start: 1933,
          end: 1945,
          description: "Libby built sensitive Geiger counters at Berkeley in the 1930s and from December 1941 worked on the Manhattan Project's gaseous diffusion process at Columbia's SAM Laboratories, testing the barrier for the K-25 plant, part of the enrichment chain that fuelled the Little Boy bomb dropped on Hiroshima on 6 August 1945.",
        },
        {
          label: "Radiocarbon and the Atomic Energy Commission",
          start: 1946,
          end: 1959,
          description: "At the University of Chicago Libby published the theory of radiocarbon dating in 1946 and built the detectors to measure it, and as the only scientist among the five Atomic Energy Commissioners from 1954 he defended atmospheric nuclear testing, after siding with Edward Teller on a crash programme for the hydrogen bomb. In 1956 he revealed Project Sunshine, the secret fallout study he had begun in 1953, whose 1,500 cadavers, many of them babies and young children, were often taken without their parents' consent.",
        },
        {
          label: "UCLA",
          start: 1960,
          end: 1980,
          description: "Libby taught chemistry at UCLA until 1976, directed the University of California's Institute of Geophysics and Planetary Physics from 1962 to 1976, started UCLA's first environmental engineering programme in 1972, and worked on California's air pollution standards as a member of its Air Resources Board.",
        },
      ],
    },
    {
      slug: "zhang-heng",
      name: "Zhang Heng",
      type: "person",
      wiki: "Zhang Heng",
      description: "Eastern Han astronomer, poet and official who built the first seismoscope, in AD 132, and the first water-powered armillary sphere.",
      metadata: { birth_date: "78", death_date: "139", nationality: "Chinese", field: "astronomy and engineering" },
      periods: [
        {
          label: "Officer of Merit in Nanyang",
          start: 95,
          end: 111,
          description: "Zhang left home in 95 to study in Chang'an and Luoyang, served as Officer of Merit in Nanyang under Governor Bao De, writing inscriptions and recommending nominees for office, and wrote rhapsodies on the two capitals warning against the luxury of the upper classes.",
        },
        {
          label: "Chief Astronomer",
          start: 112,
          end: 132,
          description: "Summoned to Luoyang in 112, Zhang was Chief Astronomer from 115 to 120 and 126 to 132, turned an armillary sphere by water power, added a tank to the inflow water clock, and opposed a calendar reform of 123 based on apocryphal teachings. In 132 he presented the first seismoscope, which detected an earthquake in Longxi, 400 to 500 km northwest of Luoyang, that no one in the capital had felt.",
        },
        {
          label: "Palace Attendant",
          start: 133,
          end: 139,
          description: "As Palace Attendant to Emperor Shun, on a salary of 2,000 bushels, Zhang persuaded him to curb the court eunuchs, who slandered him, then left the court to administer Hejian until his recall to the capital in 138; he died there in 139.",
        },
      ],
    },
    {
      slug: "john-walker",
      name: "John Walker",
      type: "person",
      wiki: "John Walker (inventor)",
      description: "Stockton-on-Tees chemist who invented the friction light, the first commercially successful friction match, and sold it from 1827.",
      metadata: { birth_date: "1781", death_date: "1859", nationality: "English", field: "chemistry and pharmacy" },
      periods: [
        {
          label: "Friction lights",
          start: 1818,
          end: 1830,
          description: "A chemist and pharmacist at 59 High Street, Stockton, Walker found while making chemical matches for local hunters that his percussion mix ignited when struck, and first recorded a sale of friction lights, sulphur-dipped sticks tipped with antimony trisulfide and potassium chlorate drawn through folded glass-paper, on 7 April 1827. He declined a patent, sold a few hundred sets at 1 shilling 2 pence for 100, and stopped by 1830 when Samuel Jones's cheaper lucifers took the market.",
        },
      ],
    },
  ],

  links: [
    // ---------- Photography ----------
    { from: "louis-daguerre", to: "daguerreotype", type: "originated", share: 0.45, why: "Daguerre found that the faint latent image of a short exposure on an iodised silver plate could be developed in mercury vapour, the process he named after himself and made public in 1839. Rivals: Niépce, whose heliography it built on; Henry Fox Talbot, whose calotype followed in 1841; and Hippolyte Bayard, persuaded to delay his paper process." },
    { from: "nicephore-niepce", to: "daguerreotype", type: "originated", share: 0.15, why: "Niépce made the first permanent camera photographs by heliography and was Daguerre's partner from 1829 until his death, and Daguerre's process built on his experiments, though the iodised silver plate was Daguerre's idea. Rivals: Daguerre, who finished the process after 1833, and Talbot." },
    { from: "louis-daguerre", to: "nicephore-niepce", type: "collaboration", share: 0, why: "They were partners from 1829 until Niépce's death in 1833 and developed the physautotype together; Niépce's son Isidore then took over the contract and shared the government pension of 1839." },

    // ---------- mRNA vaccines ----------
    { from: "katalin-kariko", to: "mrna-vaccine", type: "originated", share: 0.2, why: "Karikó pursued mRNA therapy from 1990 and, with Weissman, found in 2005 that modified nucleosides kept synthetic mRNA from setting off inflammation, the technology the Pfizer–BioNTech and Moderna vaccines used. Others who came close: the researchers who first delivered lab-made mRNA into cells in 1989 and 1990, and BioNTech and Moderna, who made the vaccines." },
    { from: "drew-weissman", to: "mrna-vaccine", type: "originated", share: 0.2, why: "Weissman brought immunology and funding to Karikó's mRNA work from 1997, and together they modified its nucleosides and packaged it in lipid nanoparticles, sharing the 2023 Nobel Prize for it. Others who came close: the mRNA transfection studies of 1989 and 1990, and BioNTech and Moderna." },
    { from: "katalin-kariko", to: "drew-weissman", type: "collaboration", share: 0, why: "They met at a University of Pennsylvania photocopier in 1997, found the nucleoside modifications together, co-founded RNARx in 2006 and shared the 2023 Nobel Prize in Physiology or Medicine." },

    // ---------- Television ----------
    { from: "john-logie-baird", to: "television", type: "originated", share: 0.15, why: "Baird gave the first public demonstration of television images with tonal gradation on 26 January 1926, and the BBC's first television programmes ran on his 30-line system. Rivals: Nipkow, whose disk he scanned with; Farnsworth and Zworykin, whose electronic systems replaced his; Kenjiro Takayanagi; and Kálmán Tihanyi." },
    { from: "philo-farnsworth", to: "television", type: "originated", share: 0.15, why: "Farnsworth built the first working all-electronic television system, which transmitted its first image on 7 September 1927, and won priority for the image dissector over RCA in 1934. Rivals: Zworykin and RCA; Tihanyi, whose charge-storage tube RCA adopted; and Baird's mechanical system." },
    { from: "vladimir-zworykin", to: "television", type: "originated", share: 0.1, why: "Zworykin applied for an electronic television system in 1923 and led RCA's development of the kinescope and the iconoscope, the camera tube of its electronic television. Rivals: Farnsworth, who won the 1934 priority case; Tihanyi, whose charge-storage design the iconoscope used; and Boris Rosing, his teacher." },
    { from: "philo-farnsworth", to: "vladimir-zworykin", type: "rivalry", share: 0, why: "RCA, with Zworykin as head of television, claimed his 1923 patent had priority over Farnsworth's; the Patent Office gave Farnsworth priority for the image dissector in 1934, and in 1939 RCA agreed to license his patents for $1 million." },
    { from: "john-logie-baird", to: "philo-farnsworth", type: "collaboration", share: 0, why: "Baird's company had Farnsworth's image dissector through a patent-sharing agreement and used it to scan cinefilm, and Farnsworth worked at Baird's Crystal Palace laboratories in 1936." },

    // ---------- GPS ----------
    { from: "bradford-parkinson", to: "gps", type: "originated", share: 0.15, why: "Parkinson re-architected the floundering Project 621B at the Lonely Halls Meeting of 1973, won its approval and ran its development to the first prototype satellite in 1978. Rivals: Easton and Getting, credited with him; Gladys West, whose geodetic Earth model fixed the satellites' orbits; and Guier and Weiffenbach, whose TRANSIT work came first." },
    { from: "roger-l-easton", to: "gps", type: "originated", share: 0.1, why: "Easton conceived and patented TIMATION, navigation by passive ranging against precise clocks in orbit, and his NTS-2 satellite first transmitted GPS signals in 1977. Rivals: Parkinson and Getting, and Friedwardt Winterberg, who proposed orbiting atomic clocks in 1955." },
    { from: "ivan-getting", to: "gps", type: "originated", share: 0.05, why: "Getting oversaw the first three-dimensional time-difference-of-arrival position-finding system at Raytheon and satellite navigation studies at The Aerospace Corporation, and pressed for the project against Pentagon resistance. Rivals: Parkinson and Easton, and the LORAN and Decca ground systems GPS was partly based on." },
    { from: "bradford-parkinson", to: "ivan-getting", type: "collaboration", share: 0, why: "The Aerospace Corporation, which Getting founded and led, gave technical support to Parkinson's 621B programme, and the two shared the 2003 Charles Stark Draper Prize for GPS." },

    // ---------- Plastics and drugs ----------
    { from: "eugen-baumann", to: "polyvinyl-chloride", type: "originated", share: 0.15, why: "Baumann synthesised PVC in 1872, a white solid that formed in a flask of vinyl chloride left out of sunlight for four weeks. Others who came close: Ivan Ostromislensky and Fritz Klatte of Griesheim-Elektron, who failed to make products from the brittle polymer, and Semon, who made it workable." },
    { from: "waldo-semon", to: "polyvinyl-chloride", type: "originated", share: 0.2, why: "Semon and B.F. Goodrich plasticised PVC from 1926, with dibutyl phthalate by 1933, making vinyl the world's third most used plastic. Others who came close: Baumann, who first made it, and Ostromislensky and Klatte, who tried to use it first." },
    { from: "friedrich-serturner", to: "morphine", type: "originated", share: 0.5, why: "Sertürner isolated morphine from opium in 1804, named it morphium and tested it on dogs, boys and himself before publishing in 1817. Rivals: Jean-François Derosne and Armand Séguin, both claimed to have found it first." },

    // ---------- Medicine ----------
    { from: "hanaoka-seishu", to: "general-anaesthesia", type: "originated", share: 0.1, why: "Hanaoka performed the first recorded operation under general anaesthesia on 13 October 1804, with his tsūsensan, and more than 150 breast cancer operations under it. Others who came close: Hua Tuo, whose mafeisan he set out to re-create, and Long and Morton, who brought in ether in the 1840s." },
    { from: "william-t-g-morton", to: "general-anaesthesia", type: "originated", share: 0.25, why: "Morton's public demonstration of ether at Massachusetts General Hospital on 16 October 1846 spread rapidly around the world and won the medical world's acceptance of surgical anaesthesia. Rivals: Crawford Long, who used ether in 1842; Horace Wells, his former partner, with nitrous oxide; Charles Jackson, who introduced him to ether; and William Clarke." },
    { from: "crawford-long", to: "general-anaesthesia", type: "originated", share: 0.1, why: "Long removed a tumour under ether on 30 March 1842 and used it in amputations and childbirth, but published only in 1849, after Morton's demonstration had spread. Rivals: Morton, Wells, Jackson and Clarke, who gave ether for a tooth extraction in January 1842." },
    { from: "william-t-g-morton", to: "crawford-long", type: "rivalry", share: 0, why: "Long's priority over Morton's 1846 demonstration drew him into the ether controversy, in which Morton, Wells and Jackson vied for a reward from Congress." },
    { from: "rene-laennec", to: "stethoscope", type: "originated", share: 0.5, why: "Laennec invented and named the stethoscope at the Necker hospital in 1816 and published its use in diagnosis in 1819. Others who came close: Arthur Leared, who invented the binaural stethoscope in 1851, and George Cammann, who perfected it for production in 1852." },

    // ---------- Sewing and fastening ----------
    { from: "barthelemy-thimonnier", to: "sewing-machine", type: "originated", share: 0.15, why: "Thimonnier's chain-stitch machine of 1829, patented in 1830, was the first practical and widely used sewing machine and sewed French Army uniforms in the first machine-based clothing factory. Rivals: Thomas Saint, whose 1790 design came first; Josef Madersperger; and Howe and Singer, whose lockstitch machines prevailed." },
    { from: "elias-howe", to: "sewing-machine", type: "originated", share: 0.2, why: "Howe's 1846 patent combined the eye-pointed needle, a shuttle beneath the cloth for the lockstitch and an automatic feed, the features of most modern machines, and he won royalties from Singer and the rest of the industry. Rivals: Walter Hunt, who built a lockstitch machine in 1832; John Fisher and James Gibbons; Thimonnier; and Singer." },
    { from: "isaac-singer", to: "sewing-machine", type: "originated", share: 0.2, why: "Singer's 1851 machine, with a straight shuttle and needle, was the first to work in a practical way, and his company's mass production, home machines and instalment plans spread it into homes worldwide. Rivals: Howe, whose lockstitch patent he infringed; Hunt; Wheeler & Wilson and Grover & Baker; and Thimonnier." },
    { from: "elias-howe", to: "isaac-singer", type: "rivalry", share: 0, why: "Howe sued Singer for copying his lockstitch and won in 1854; in 1856 Singer's company joined the Sewing Machine Combination, which paid Howe a royalty on every machine." },
    { from: "whitcomb-l-judson", to: "zipper", type: "originated", share: 0.15, why: "Judson patented the clasp locker in 1893, a slide fastener for shoes from which the modern zipper evolved, though it tended to break open. Others who came close: Elias Howe, who patented a clothing closure in 1851 and never marketed it, and Sundbäck, who made the fastener work." },
    { from: "gideon-sundback", to: "zipper", type: "originated", share: 0.4, why: "Sundbäck redesigned Judson's fastener with two facing rows of teeth, put it on sale in 1913, patented it as the Separable Fastener in 1917 and built the machine that made it. Others who came close: Judson; Catharina Kuhn-Moos, who also improved it; and Martin Othmar Winterhalter, who replaced its joints and jaws with ribs and grooves." },

    // ---------- Writing and printing ----------
    { from: "laszlo-biro", to: "ballpoint-pen", type: "originated", share: 0.35, why: "Bíró and his brother György paired quick-drying ink with a ball turning in a socket, patented in 1938, the first commercially successful modern ballpoint pen. Others who came close: John J. Loud, who patented the first ballpoint in 1888; György Bíró; and Marcel Bich, who bought the patent and made the Bic Cristal." },
    { from: "alois-senefelder", to: "lithography", type: "originated", share: 0.5, why: "Senefelder invented lithography in 1796, printing from the flat surface of a limestone, and perfected its chemistry and the press it needed. Others who came close: the André family of music publishers, who helped him make it workable, and Godefroy Engelmann, who solved its technical problems and introduced chromolithography in 1837." },
    { from: "louis-braille", to: "braille", type: "originated", share: 0.55, why: "Louis Braille reduced Charles Barbier's twelve-dot code to a six-dot cell a fingertip could read at one touch and published it with musical notation in 1829. Others who came close: Barbier, whose night writing it was based on, and Valentin Haüy, whose embossed letters the Royal Institute taught before it." },

    // ---------- Machines and instruments ----------
    { from: "hubert-cecil-booth", to: "vacuum-cleaner", type: "originated", share: 0.2, why: "Booth's Puffing Billy of 1901 cleaned by suction alone through a cloth filter, the principle of today's vacuum cleaners, and the company set up to market it first used the term vacuum cleaner. Rivals: David T. Kenney, who invented a suction cleaner independently the same year; John Thurman, whose blown-air machine Booth reversed; and James Spangler, whose portable electric cleaner Hoover sold." },
    { from: "louis-essen", to: "atomic-clock", type: "originated", share: 0.2, why: "Essen and Jack Parry built the first practical caesium atomic clock at the National Physical Laboratory in 1955, and Essen's measurement with William Markowitz set the caesium second adopted in 1967. Others who came close: Isidor Rabi, who built atomic beam resonance equipment in the 1930s; the builders of the ammonia prototype of 1949; and Parry." },
    { from: "ernst-ruska", to: "electron-microscope", type: "originated", share: 0.25, why: "Ruska showed in 1931 that a magnetic coil could act as an electron lens, built the first electron microscope with Knoll and one that beat the light microscope in 1933, and helped develop Siemens's first commercial instrument. Rivals: Knoll; Reinhold Rüdenberg of Siemens-Schuckert, who patented an electron microscope in 1932; and Manfred von Ardenne, who pioneered the scanning electron microscope." },
    { from: "max-knoll", to: "electron-microscope", type: "originated", share: 0.15, why: "Knoll led the Berlin electron research group and with Ruska made the first electron microscope, with two magnetic lenses, in 1931, before leaving for Telefunken in 1932. Rivals: Ruska, who carried the work on, and Rüdenberg." },
    { from: "ernst-ruska", to: "max-knoll", type: "collaboration", share: 0, why: "Knoll led the electron research group at the Technische Hochschule in Berlin-Charlottenburg in which he and his doctoral student Ruska made the first electron microscope in 1931." },
    { from: "willard-libby", to: "radiocarbon-dating", type: "originated", share: 0.5, why: "Libby realised that dead organisms stop taking in carbon-14, published the method in 1946, built the detectors to measure it and tested it against samples of known age, winning the 1960 Nobel Prize. Others who came close: Martin Kamen and Samuel Ruben, who made carbon-14 in 1939, and Serge Korff, who found the cosmic-ray neutrons that create it." },
    { from: "willard-libby", to: "manhattan-project", type: "collaboration", share: 0, why: "Libby worked on the Manhattan Project's gaseous diffusion process for uranium enrichment at Columbia's SAM Laboratories from 1941 to 1945." },
    { from: "zhang-heng", to: "seismometer", type: "originated", share: 0.2, why: "Zhang Heng presented the first seismoscope to the Han court in 132, a bronze urn whose pendulum dropped a ball towards the direction of a distant earthquake; by the Yuan dynasty no example survived, and the modern seismograph is Milne, Gray and Ewing's. Others who came close: Jean de Hautefeuille, Luigi Palmieri, and John Milne, James Ewing and Thomas Gray." },
    { from: "john-walker", to: "match", type: "originated", share: 0.1, why: "Walker sold the first commercially successful friction matches from 1827, but declined a patent and stopped making them by 1830. Rivals: the Chinese sulphur matches of 577, Jean Chancel's dipped match of 1805, Samuel Jones's lucifers, Charles Sauria's white-phosphorus matches and Gustaf Pasch's safety match." },
  ],
};
