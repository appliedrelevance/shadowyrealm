/**
 * Inventions coverage batch f: knowledge, measurement and communication.
 * Drafted against Wikipedia's Timeline of historic inventions; every endpoint
 * of `links` is an entity in content/inventions/.
 */
import type { InventionsContent, InventionsLink } from "../types";

export const coverageF: InventionsContent = {
  entities: [
    // ---------- Words and news ----------
    {
      slug: "dictionary",
      name: "Dictionary",
      type: "invention",
      wiki: "Dictionary",
      description: "A reference listing the words of a language, usually in alphabetical order, with their meanings, spellings, pronunciations or translations.",
      metadata: { invented_date: "2300 BCE", place: "Ebla", field: "lexicography" },
      periods: [
        {
          label: "Wordlists and glossaries",
          start: -2300,
          end: 1286,
          description: "The first dictionaries were bilingual Sumerian–Akkadian wordlists on cuneiform tablets from Ebla, from 2300 BCE; China's Erya of the 3rd century BCE is the oldest surviving monolingual dictionary, and Sanskrit, Arabic, Japanese and Irish dictionaries followed by the 9th century CE.",
        },
        {
          label: "Printed dictionaries",
          start: 1287,
          end: 1754,
          description: "Johannes Balbus's Catholicon of 1287 was printed in 1460, among the first printed books, and printed dictionaries followed for Latin, Greek, Spanish, Italian and French, among them the Crusca's of 1612 and the Académie française's of 1694. Robert Cawdrey's Table Alphabeticall of 1604 was the first purely English alphabetical dictionary.",
        },
        {
          label: "National standard dictionaries",
          start: 1755,
          end: 1968,
          description: "Samuel Johnson's dictionary of 1755 was the English standard for over 150 years, Noah Webster's of 1828 introduced American spellings such as color and center, and the Oxford English Dictionary appeared in fascicles from 1884 and complete in 1928, while the Brothers Grimm's German dictionary ran from 1858 to 1961.",
        },
        {
          label: "Corpus and online dictionaries",
          start: 1969,
          end: 2026,
          description: "The American Heritage Dictionary of 1969 was the first dictionary built with corpus linguistics, and dictionaries moved onto computers, the internet and smartphones, the Oxford English Dictionary revising itself every three months.",
        },
      ],
    },
    {
      slug: "newspaper",
      name: "Newspaper",
      type: "invention",
      wiki: "Newspaper",
      description: "A regularly published sheet of current news, opinion and advertising, printed since 1605 and now also published online.",
      metadata: { invented_date: "1605", place: "Strasbourg", field: "journalism" },
      periods: [
        {
          label: "The first newspapers",
          start: 1605,
          end: 1701,
          description: "Johann Carolus printed the Relation in Strasbourg from 1605, the first newspaper, and within decades weekly papers appeared in Amsterdam, London, Paris and Lisbon; most were censored by their governments, and Boston's Publick Occurrences was suppressed in 1690 after one issue.",
        },
        {
          label: "Dailies and colonial papers",
          start: 1702,
          end: 1829,
          description: "The Daily Courant, the first successful English daily, began in 1702, papers followed in Boston in 1704, Quebec in 1764 and Calcutta in 1780, where Hicky's Bengal Gazette attacked British rule, and in 1814 The Times bought a press that made 1,100 impressions an hour.",
        },
        {
          label: "Penny press and telegraph",
          start: 1830,
          end: 1945,
          description: "Penny papers from 1830 made news cheap, telegraph networks carried overnight reports by the late 1840s, and agencies such as Havas, the Associated Press and Reuters sold newspapers telegraphed copy. Yellow journalism sold sensation, French papers took secret payments from banks and foreign governments, and the Nazis shut 1,000 of Germany's 3,000 newspapers and directed the rest.",
          wiki: "History of newspaper publishing",
        },
        {
          label: "Television, the internet and decline",
          start: 1946,
          end: 2026,
          description: "Television and then online news took readers and advertising, so that US household penetration fell below 100 percent in the early 1970s and to 53 percent by 2000. The American Reporter became the first daily internet newspaper in 1995, the US went from 8,891 newspapers in 2005 to 6,377 in 2022, and circulation grew in India, China and Brazil.",
        },
      ],
    },
    {
      slug: "lithography",
      name: "Lithography",
      type: "invention",
      wiki: "Lithography",
      description: "A printing method that prints from a flat stone or metal plate, where a greasy image takes the ink and the wetted blank areas repel it.",
      metadata: { invented_date: "1796", place: "Bavaria", field: "printing" },
      periods: [
        {
          label: "Stone printing",
          start: 1796,
          end: 1836,
          description: "Alois Senefelder invented lithography in Bavaria in 1796 as a cheap way to publish his plays, and it printed first musical scores and maps, among them British army maps in the Peninsular War; Godefroy Engelmann's Paris press solved its technical problems, and Delacroix and Géricault drew on stone in the 1820s.",
        },
        {
          label: "Chromolithography and the poster",
          start: 1837,
          end: 1959,
          description: "Engelmann's chromolithography of 1837 printed colour from one stone per colour, lithography took over English commercial map printing from the 1850s and carried Daumier's prints in newspapers, and Jules Chéret's colour posters of the 1890s made it the medium of the modern poster.",
        },
        {
          label: "Offset lithography",
          start: 1960,
          end: 2026,
          description: "Since the 1960s most books and magazines have been printed by offset lithography from photographic metal plates, web presses print newspapers, and platesetters of the late 20th century expose plates straight from digital files; June Wayne's Tamarind Lithography Workshop, founded in 1960, revived fine-art lithography in the United States.",
        },
      ],
    },

    // ---------- Codes for the wire and the fingertip ----------
    {
      slug: "morse-code",
      name: "Morse code",
      type: "invention",
      wiki: "Morse code",
      description: "A code that spells out text in short and long signals, dots and dashes, devised for the electric telegraph and later sent by radio, light and sound.",
      metadata: { invented_date: "1837", place: "United States", field: "telecommunications" },
      periods: [
        {
          label: "Morse and Vail's code",
          start: 1837,
          end: 1847,
          description: "Samuel Morse devised a numeric telegraph code in 1837, which Alfred Vail expanded in 1840 into letters, giving the shortest signals to the letters most common in the type cases of a Morristown newspaper; it went into use on Morse's telegraph in 1844.",
        },
        {
          label: "International Morse code",
          start: 1848,
          end: 1889,
          description: "Friedrich Gerke's Hamburg alphabet of 1848 dropped American Morse's uneven dashes and spaces, was adopted in Germany and Austria in 1851 and became the International Morse code in 1865, while operators learned to read the receiver's clicks by ear and dropped the paper tape.",
        },
        {
          label: "Radiotelegraphy",
          start: 1890,
          end: 1999,
          description: "From the 1890s radio carried Morse code before it could carry voice, and Morse became the maritime distress standard, the identifier of aviation beacons and the link of warships, patrol planes and the blitzkrieg armies of the Second World War. The maritime standard ended in 1999, and the last US commercial Morse message was sent on 12 July 1999.",
        },
        {
          label: "Amateur and assistive use",
          start: 2000,
          end: 2026,
          description: "Radio amateurs and militaries such as the US Air Force and the Australian Defence Force still send and teach Morse, and people with severe disabilities type in it with switches, sip-and-puff tubes and Android phones.",
        },
      ],
    },
    {
      slug: "braille",
      name: "Braille",
      type: "invention",
      wiki: "Braille",
      description: "A tactile writing system of raised six-dot cells that blind and visually impaired people read by touch.",
      metadata: { invented_date: "1824", place: "France", field: "writing" },
      periods: [
        {
          label: "Louis Braille's code",
          start: 1824,
          end: 1877,
          description: "Louis Braille, blinded by a childhood accident, devised his six-dot code in 1824 at fifteen as an improvement on Charles Barbier's twelve-dot night writing, published it with musical notation in 1829 and revised it in 1837.",
        },
        {
          label: "Braille writers and a common standard",
          start: 1878,
          end: 1959,
          description: "The International Congress on Work for the Blind in Paris proposed an international braille standard in 1878, Frank Haven Hall's braille typewriter came out in 1892, and David Abraham's Perkins Brailler followed in 1951.",
        },
        {
          label: "Computer braille",
          start: 1960,
          end: 2026,
          description: "Robert Mann's DOTSYS software translated print into braille from 1960, and refreshable braille displays now connect to computers and phones. In the US, braille literacy declined after the Rehabilitation Act of 1973 moved blind children into public schools that could seldom afford braille teachers, and in 1998 only 10% of 57,425 legally blind students read braille as their main medium.",
        },
      ],
    },

    // ---------- Time and the sky ----------
    {
      slug: "sundial",
      name: "Sundial",
      type: "invention",
      wiki: "History of sundials",
      description: "A device that tells the time of day from the shadow a gnomon casts on a marked dial as the Sun moves across the sky.",
      metadata: { invented_date: "1500 BCE", place: "Egypt and Babylon", field: "timekeeping" },
      periods: [
        {
          label: "Shadow clocks",
          start: -1500,
          end: -561,
          description: "The earliest known sundials are Egyptian and Babylonian shadow clocks of 1500 BCE, with analemmatic dials of the same era found in modern Russia, and sundials were also made in Kush and in China.",
        },
        {
          label: "Greek and Roman dials",
          start: -560,
          end: 599,
          description: "Greek geometers took the sundial from Babylon and developed many of its forms, which Vitruvius listed in De Architectura; Rome recorded its first sundial in 293 BCE and built the giant Solarium Augusti, and a character of Plautus complained that the dials chopped his day into pieces.",
        },
        {
          label: "Canonical and equal-hour dials",
          start: 600,
          end: 1839,
          description: "Religious orders fixed the times of prayer with canonical sundials from the 7th to the 14th century, Ibn al-Shatir built a polar-axis dial showing equal hours in the 14th century and such dials appeared in Europe from 1446, and early clocks were set from sundials and used with them to find longitude.",
        },
        {
          label: "Ornaments and railway time",
          start: 1840,
          end: 2026,
          description: "The railways of the 1840s ended the sundial's keeping of local time for government and commerce, and dials became ornaments and objects of study, from the hundred Giovanni Francesco Zarbula painted in the French Alps to the park dial that uses Taipei 101, opened in 2004, as its style.",
        },
      ],
    },
    {
      slug: "astrolabe",
      name: "Astrolabe",
      type: "invention",
      wiki: "Astrolabe",
      description: "A metal disc that models the sky, used to measure the altitude of stars, tell the time, find latitude and work out problems in astronomy.",
      metadata: { invented_date: "Antiquity", field: "astronomy" },
      periods: [
        {
          label: "Greek and Syriac astrolabes",
          start: 350,
          end: 749,
          description: "The plane astrolabe, a flat version of the Hellenistic armillary sphere, was described by Theon of Alexandria in the 4th century and taught by his daughter Hypatia, John Philoponus's Greek treatise of the 6th century is the earliest that survives, and Severus Sebokht's Syriac treatise of the 7th describes brass astrolabes.",
        },
        {
          label: "Islamic astrolabes",
          start: 750,
          end: 999,
          description: "Muhammad al-Fazari built the first astrolabe in the Islamic world in the 8th century, Muslim astronomers added azimuth scales and used it to time prayers, find the qibla and set the lunar calendar, and al-Sufi described more than 1,000 uses; the oldest surviving astrolabe dates from 927–928.",
        },
        {
          label: "Medieval Europe and the sea",
          start: 1000,
          end: 1650,
          description: "Gerbert of Aurillac brought the astrolabe north of the Pyrenees, the first known metal astrolabe in Western Europe was made of brass in 11th-century Portugal, astrolabes were batch-produced by Georg Hartmann in the 16th, Chaucer wrote a treatise on it, and Portuguese sailors under Prince Henry took latitude with a simplified one. Abi Bakr of Isfahan built a geared astrolabe in 1235, and Mahendra Suri wrote the first Sanskrit astrolabe manual in 1370.",
        },
        {
          label: "Clock dials and watches",
          start: 1651,
          end: 2026,
          description: "Indian astronomers, Sawai Jai Singh among them, wrote Sanskrit astrolabe manuals into the 18th century, and the astrolabe lives on in the dials of astronomical clocks such as Prague's and in astrolabe watches such as the one Ludwig Oechslin built with Ulysse Nardin in 1985.",
        },
      ],
    },
    {
      slug: "atomic-clock",
      name: "Atomic clock",
      type: "invention",
      wiki: "Atomic clock",
      description: "A clock that keeps time by the resonant frequency of atoms, accurate enough to define the second and to time satellite navigation.",
      metadata: { invented_date: "1955", place: "United Kingdom", field: "timekeeping" },
      periods: [
        {
          label: "Ammonia and caesium clocks",
          start: 1949,
          end: 1967,
          description: "A prototype clock measuring transitions of the ammonia molecule was built in 1949, and Louis Essen and Jack Parry built the first practical caesium atomic clock at Britain's National Physical Laboratory in 1955; the National Radio Company sold more than 50 Atomichrons in the 1950s, and Hewlett-Packard released its 5060 caesium clock in 1964.",
        },
        {
          label: "The atomic second",
          start: 1968,
          end: 1989,
          description: "In 1968 the SI defined the second as 9,192,631,770 vibrations of the caesium-133 atom, so that an ensemble of atomic clocks around the world keeps International Atomic Time, and caesium and rubidium clocks went aboard the GPS satellites.",
        },
        {
          label: "Optical and chip-scale clocks",
          start: 1990,
          end: 2026,
          description: "Lasers and optical frequency combs of the 1990s led to optical clocks that surpassed caesium at NIST in 2010 and reached 19 decimal places in 2025, and NIST's chip-scale atomic clock of 2004 went on sale in 2011. Atomic clocks time GPS, Galileo and BeiDou, the internet and high-frequency trading.",
        },
      ],
    },

    // ---------- Instruments of the earth and the air ----------
    {
      slug: "barometer",
      name: "Barometer",
      type: "invention",
      wiki: "Barometer",
      description: "An instrument that measures air pressure, used to forecast the weather and to measure altitude.",
      metadata: { invented_date: "1643", place: "Italy", field: "meteorology" },
      periods: [
        {
          label: "Torricelli's mercury tube",
          start: 1643,
          end: 1667,
          description: "Evangelista Torricelli, Galileo's amanuensis, explained in 1644 that the weight of the air held up the column in a vacuum tube and built a mercury barometer; Pascal repeated the experiment in 1646, Florin Perier's ascent of the Puy de Dôme in 1648 showed pressure falling with height, and Otto von Guericke forecast a storm from a low reading in 1660.",
        },
        {
          label: "Marine and wheel barometers",
          start: 1668,
          end: 1843,
          description: "Robert Hooke's marine barometer of 1668 sailed with Edmund Halley from 1698 to 1700, Edward Nairne's gimballed barometers went on Cook's second voyage of 1772–1775 and into the Royal Navy, and Italian immigrant craftsmen made the wheel barometers marked Rain, Change and Dry, the first commercial barometer for British farmers and the educated classes.",
        },
        {
          label: "Aneroids and weather maps",
          start: 1844,
          end: 2006,
          description: "Lucien Vidi's aneroid barometer of 1844 needed no liquid, and networks of barometer readings drew the first weather maps in the 19th century and have fed weather forecasts since the late 19th century; collieries logged pressure because a falling barometer lets firedamp escape, as the mines inspector noted after the Trimdon Grange disaster of 1882.",
        },
        {
          label: "MEMS barometers",
          start: 2007,
          end: 2026,
          description: "A European Union directive of 2007 ended the making of new mercury barometers in Europe, and microelectromechanical barometers made by photolithography went into smartphones such as the Galaxy Nexus and the iPhone 6 and later iPhones.",
        },
      ],
    },
    {
      slug: "seismometer",
      name: "Seismometer",
      type: "invention",
      wiki: "Seismometer",
      description: "An instrument that records the ground motion of earthquakes, volcanic eruptions and explosions.",
      metadata: { invented_date: "132", place: "China", field: "seismology" },
      periods: [
        {
          label: "Zhang Heng's seismoscope",
          start: 132,
          end: 1702,
          description: "Zhang Heng's bronze seismoscope of AD 132 dropped a ball from one of eight dragons' mouths into a bronze toad when the ground shook, and seismographic devices stood at Persia's Maragheh observatory, founded in 1259.",
        },
        {
          label: "Mercury and pendulum detectors",
          start: 1703,
          end: 1879,
          description: "Jean de Hautefeuille described a mercury seismoscope in 1703, Nicola Cirillo set up a network of pendulum detectors after the Puglia earthquake of 1731, David Milne-Home coined the word seismometer in 1841, and Luigi Palmieri's seismometer of 1856, whose pendulums closed a circuit to stop a clock, was widely used.",
        },
        {
          label: "Recording seismographs",
          start: 1880,
          end: 1968,
          description: "John Milne, James Ewing and Thomas Gray built horizontal-pendulum seismographs in Japan after the Yokohama earthquake of 1880 and recorded the first seismogram on 3 November 1880; modern seismometers descend from their designs, adapted after the Second World War into the Press-Ewing seismometer.",
        },
        {
          label: "Broadband and planetary networks",
          start: 1969,
          end: 2026,
          description: "Seismometers went to the Moon with Apollo from 1969 and to Mars with InSight in December 2018, and electronic broadband seismometers in worldwide arrays locate earthquakes, image the Earth's interior, prospect for oil and detect underground nuclear tests for the International Monitoring System.",
        },
      ],
    },
    {
      slug: "electron-microscope",
      name: "Electron microscope",
      type: "invention",
      wiki: "Electron microscope",
      description: "A microscope that forms images with a beam of electrons focused by magnetic or electric lenses, resolving detail far finer than light can show.",
      metadata: { invented_date: "1931", place: "Charlottenburg, Berlin", field: "microscopy" },
      periods: [
        {
          label: "Knoll and Ruska's microscope",
          start: 1931,
          end: 1937,
          description: "At the Technische Hochschule in Charlottenburg, Max Knoll and Ernst Ruska made the first electron microscope, with two magnetic lenses, in 1931, and in 1933 built one that beat the resolution of a light microscope. Reinhold Rüdenberg of Siemens-Schuckert patented an electron microscope in 1932, and Manfred von Ardenne pioneered the scanning electron microscope in 1937.",
        },
        {
          label: "Commercial microscopes",
          start: 1938,
          end: 1979,
          description: "Siemens sold the first commercial electron microscope in 1938 and a transmission electron microscope in 1939, high-resolution instruments followed in the 1940s, and Albert Crewe at the University of Chicago introduced the field-emission scanning transmission electron microscope by 1965.",
        },
        {
          label: "Atomic resolution",
          start: 1980,
          end: 2026,
          description: "Higher accelerating voltages and field-emission guns brought atomic-scale imaging of materials in the 1980s, when cryofixed biological specimens also came into wider use, and the invention won the 1986 Nobel prize. Aberration correction sharpened images in the 2000s.",
        },
      ],
    },
    {
      slug: "radiocarbon-dating",
      name: "Radiocarbon dating",
      type: "invention",
      wiki: "Radiocarbon dating",
      description: "A method of dating organic material by measuring how much of its radioactive carbon-14 has decayed since the organism died.",
      metadata: { invented_date: "1949", place: "University of Chicago", field: "archaeology" },
      periods: [
        {
          label: "Carbon-14 and Libby's method",
          start: 1939,
          end: 1949,
          description: "Martin Kamen and Samuel Ruben made carbon-14 with Berkeley's cyclotron in 1939, and Willard Libby at the University of Chicago showed in 1947 that living carbon contains it and in 1949 dated samples from the tombs of the Egyptian kings Zoser and Sneferu.",
        },
        {
          label: "The radiocarbon revolution",
          start: 1950,
          end: 1976,
          description: "More than 20 radiocarbon laboratories opened within 11 years, Libby won the 1960 Nobel Prize in Chemistry, and dates for the Two Creeks forest and the Dead Sea Scrolls gave archaeology a world time scale. Bomb carbon from atmospheric nuclear tests and carbon from fossil fuels distorted the record, and Hans Suess's tree-ring curve of 1967 began calibrating radiocarbon years to calendar years.",
        },
        {
          label: "Accelerator mass spectrometry",
          start: 1977,
          end: 2026,
          description: "From the late 1970s accelerator mass spectrometry counted carbon-14 atoms directly in tiny samples, dating the Shroud of Turin to the 14th century in 1988, and the IntCal curves of 1998 to 2020 calibrated dates against tree rings reaching back 13,910 years before present.",
        },
      ],
    },
  ],

  links: [
    // ---------- Words and news ----------
    { from: "writing", to: "dictionary", type: "builds_on", share: 0.15, why: "Dictionaries list the words of written languages, beginning with the bilingual Sumerian–Akkadian wordlists on cuneiform tablets at Ebla." },
    { from: "printing-press", to: "dictionary", type: "builds_on", share: 0.1, why: "Balbus's Catholicon was printed in 1460, among the first printed books, and print carried the large dictionaries from Calepino's of 1502 to Johnson's of 1755." },
    { from: "printing-press", to: "newspaper", type: "builds_on", share: 0.3, why: "Newspapers grew out of the spread of the printing press, and the first, Carolus's Relation of 1605, was set apart from other printed matter by appearing regularly. Before them: the manuscript newsletters of Venice and the Fuggers." },
    { from: "paper", to: "newspaper", type: "builds_on", share: 0.05, why: "Newspapers are printed on cheap newsprint, whose cost fell when wood-pulp papermaking replaced rags in the 1840s." },
    { from: "electrical-telegraph", to: "newspaper", type: "builds_on", share: 0.1, why: "By the late 1840s telegraph networks carried overnight news, and agencies such as Havas and Reuters sold newspapers telegraphed copy." },
    { from: "lithography", to: "newspaper", type: "builds_on", share: 0.05, why: "Newspapers moved from letterpress to offset lithography from the 1980s and are printed on lithographic web presses." },
    { from: "newspaper", to: "television", type: "rivalry", share: 0, why: "Television news, and from the late 1990s 24-hour news channels, competed with newspapers for readers and advertising." },

    // ---------- Codes for the wire and the fingertip ----------
    { from: "samuel-morse", to: "morse-code", type: "originated", share: 0.2, why: "Morse devised the first code for his telegraph, a numeric one, in 1837. Rivals: Alfred Vail, who turned it into the alphabetic code used from 1844, and Friedrich Gerke, whose 1848 revision became International Morse code." },
    { from: "electrical-telegraph", to: "morse-code", type: "builds_on", share: 0.15, why: "Morse code was devised to send text as the on-off pulses of current of Morse's single-wire telegraph." },
    { from: "morse-code", to: "radio", type: "builds_on", share: 0.05, why: "Radio's first use was wireless telegraphy, sending Morse code from the 1890s before it could carry voice." },
    { from: "writing", to: "braille", type: "builds_on", share: 0.1, why: "Braille is a tactile transcription of the alphabet: Louis Braille assigned his six-dot cells to the letters of the French alphabet in their alphabetical order." },

    // ---------- Time and the sky ----------
    { from: "sundial", to: "clock", type: "builds_on", share: 0.05, why: "Early clocks kept poor time and were reset from sundials for centuries, and in China sundials evolved into the water clocks of 1000 CE." },
    { from: "sundial", to: "clock", type: "supersedes", share: 0, why: "Clocks replaced sundials as timekeepers, and the railways of the 1840s ended the sundial's keeping of local time." },
    { from: "astrolabe", to: "clock", type: "builds_on", share: 0.05, why: "Mechanical astronomical clocks began as clockwork astrolabes, such as Richard of Wallingford's, and many, Prague's among them, keep an astrolabe dial." },
    { from: "clock", to: "atomic-clock", type: "builds_on", share: 0.1, why: "An atomic clock is a clock regulated by atomic resonance, sought because temperature limits the accuracy of mechanical and quartz clocks." },
    { from: "laser", to: "atomic-clock", type: "builds_on", share: 0.1, why: "Lasers and optical frequency combs from the 1990s made the optical atomic clocks that overtook caesium clocks in 2010." },
    { from: "atomic-clock", to: "gps", type: "builds_on", share: 0.15, why: "Each GPS satellite carries caesium and rubidium atomic clocks, and a receiver finds its position from the time delays of the satellites' signals." },

    // ---------- Instruments of the earth and the air ----------
    { from: "galileo-galilei", to: "barometer", type: "originated", share: 0.05, why: "Galileo's Two New Sciences prompted Berti's vacuum experiment in Rome, and his suggestion of mercury led his amanuensis Torricelli to the mercury barometer, though Galileo put the effect down to the force of the vacuum. Rivals: Torricelli, the inventor, Gasparo Berti and René Descartes." },
    { from: "clock", to: "seismometer", type: "builds_on", share: 0.05, why: "Seismographs pair the instrument with a timing device, from Filomarino's of 1796, which started a clock when the ground shook, to Palmieri's of 1856, which stopped one." },
    { from: "electromagnetic-induction", to: "seismometer", type: "builds_on", share: 0.05, why: "Geophones and accelerographs measure ground motion by the current induced in a spring-mounted coil moving in a magnet's field." },
    { from: "microscope", to: "electron-microscope", type: "builds_on", share: 0.2, why: "The electron microscope repeats the light microscope's arrangement with magnetic lenses in place of glass ones, and was built to beat its resolution, which Knoll and Ruska's did in 1933." },
  ],
};

/** Links to or from entries assigned to other batches (see MASTER LIST), merged later. */
export const crossLinksF: InventionsLink[] = [
  { from: "glass", to: "barometer", type: "builds_on", share: 0.05, why: "The mercury barometer is a sealed glass tube standing in mercury, and glass blowers from Liège and Italy made many of the early weather glasses and barometers." },
];
