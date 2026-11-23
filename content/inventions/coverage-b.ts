/**
 * Inventions coverage batch b: land and water transport, energy and
 * electricity. Entries found missing by the audit against Wikipedia's
 * Timeline of historic inventions. Links to or from other batches' entries
 * wait in crossLinksB until those batches are merged.
 */
import type { InventionsContent, InventionsLink } from "../types";

export const coverageB: InventionsContent = {
  entities: [
    // ---------- Road vehicles and roads ----------
    {
      slug: "car",
      name: "Car",
      type: "invention",
      wiki: "Car",
      description: "A wheeled motor vehicle that carries one to eight people, mainly on roads, most of them driven by an internal combustion engine.",
      metadata: { invented_date: "1886", place: "Germany", field: "transport" },
      periods: [
        {
          label: "Steam carriages and the first motor cars",
          start: 1769,
          end: 1900,
          description: "Cugnot built a steam tricycle in 1769, and Mary Ward, in Parsonstown in 1869, became one of the first documented car fatalities; Karl Benz patented his Motorwagen in 1886, and in 1899 Benz & Cie was the world's largest carmaker, with 572 cars built.",
        },
        {
          label: "Mass production",
          start: 1901,
          end: 1945,
          description: "Ransom Olds began production-line manufacture in 1901, and Ford's moving assembly line from 1913 let a line worker buy a Model T with four months' pay; of the 200 American carmakers of 1920, 43 survived to 1930 and 17 to 1940.",
        },
        {
          label: "Cars worldwide",
          start: 1946,
          end: 2026,
          description: "Car ownership spread through Europe after the Second World War and later through China and India, to over 1.6 billion cars in use by 2025. Traffic collisions became the largest cause of injury-related deaths worldwide, and cars and vans caused 10% of energy-related carbon dioxide emissions in 2022.",
        },
      ],
    },
    {
      slug: "bicycle",
      name: "Bicycle",
      type: "invention",
      wiki: "Bicycle",
      description: "A pedal-driven, single-track vehicle with two wheels held one behind the other in a frame.",
      metadata: { invented_date: "1817", place: "Mannheim", field: "transport" },
      periods: [
        {
          label: "Draisines and velocipedes",
          start: 1817,
          end: 1869,
          description: "Karl von Drais first rode his two-wheeled running machine from Mannheim in 1817, and several thousand were built before accidents led some cities to ban them; in the 1860s Lallement and Michaux added cranks and pedals, and Michaux et Cie, formed in 1868, was the first company to mass-produce bicycles.",
          wiki: "History of the bicycle",
        },
        {
          label: "The safety bicycle",
          start: 1870,
          end: 1899,
          description: "The chain-driven safety bicycle of 1885 and the pneumatic tyre made cycling everyday transport in the 1890s boom, when bicycle makers placed 10% of all advertising in US periodicals in 1898 and lobbied for better roads. The bicycle gave women a new mobility, and suffragists called it a freedom machine.",
        },
        {
          label: "Mass transport and recreation",
          start: 1900,
          end: 2026,
          description: "Bicycles remained a principal means of transport across much of Asia and Europe, bicycle-sharing schemes spread from Amsterdam's White Bicycle plan of 1965, and by the early 21st century there were more than 1 billion bicycles.",
        },
      ],
    },
    {
      slug: "pneumatic-tyre",
      name: "Pneumatic tyre",
      type: "invention",
      wiki: "Tire",
      description: "An air-filled rubber ring fitted around a wheel's rim that cushions the ride and grips the road, used on bicycles, cars, lorries and aircraft.",
      metadata: { invented_date: "1888", place: "Belfast", field: "transport" },
      periods: [
        {
          label: "Thomson's patent",
          start: 1845,
          end: 1887,
          description: "Robert William Thomson patented a pneumatic tyre in 1845 and fitted it to carriages tested in Hyde Park, but it was expensive and not a commercial success.",
        },
        {
          label: "Dunlop's bicycle tyre",
          start: 1888,
          end: 1894,
          description: "John Boyd Dunlop made the first successful pneumatic tyre in Belfast in 1888 for his son's tricycle, and Willie Hume won its first races in 1889; Dunlop's patent was declared invalid in 1892 because of Thomson's.",
        },
        {
          label: "Motor tyres",
          start: 1895,
          end: 1945,
          description: "Michelin made the first pneumatic tyres for cars and raced them in the 1895 Paris–Bordeaux–Paris race, and Bayer's laboratories invented synthetic rubbers in the 1920s.",
        },
        {
          label: "Radial tyres",
          start: 1946,
          end: 2026,
          description: "Michelin's radial tyre of 1946 spread through Europe and Asia and took all of the North American market in the 1980s. Americans discard 285 million scrap tyres a year, and tyre wear made up 78% of the mass of ocean microplastics in a 2020 study and releases 6PPD-quinone, which is toxic to salmon and trout.",
        },
      ],
    },
    {
      slug: "tractor",
      name: "Tractor",
      type: "invention",
      wiki: "Tractor",
      description: "A vehicle built to pull trailers and machinery at slow speeds with high tractive effort, above all on farms.",
      metadata: { invented_date: "1889", place: "Illinois", field: "agriculture" },
      periods: [
        {
          label: "Steam ploughing engines",
          start: 1859,
          end: 1888,
          description: "Thomas Aveling made a portable steam engine self-propelled in 1859, and steam ploughing engines worked in pairs, hauling ploughs across fields on wire cables, or in the United States hauled them directly.",
        },
        {
          label: "Petrol tractors",
          start: 1889,
          end: 1929,
          description: "John Charter built the first petrol tractors in Illinois in 1889, Dan Albone's Ivel of 1901 was the first commercially successful light petrol tractor, and Henry Ford's mass-produced Fordson of 1917 took 77% of the US market by 1923.",
        },
        {
          label: "Mechanised farming",
          start: 1930,
          end: 2026,
          description: "The share of US farms with tractors rose from 13.5% at the end of the 1920s to 40% during the Great Depression, Ferguson's three-point hitch spread worldwide, and diesel engines took over from the 1960s. Tractor accidents cause 32% of US farm deaths, over half of them overturns, against which Sweden required roll-over protection from 1959 and the United States from 1986.",
        },
      ],
    },
    {
      slug: "wheelbarrow",
      name: "Wheelbarrow",
      type: "invention",
      wiki: "Wheelbarrow",
      description: "A small one-wheeled cart pushed and steered by one person with two handles, which shares its load between the wheel and the operator.",
      metadata: { invented_date: "100 CE", place: "Han China", field: "transport" },
      periods: [
        {
          label: "Chinese wheelbarrows",
          start: 100,
          end: 1169,
          description: "A tomb mural at Chengdu dated 118 shows a man pushing a wheelbarrow, and Zhuge Liang's 'wooden ox' carried Shu Han's military supplies against Cao Wei in 231; after the 3rd century most Chinese barrows carried their loads, as many as six passengers, over a large central wheel.",
        },
        {
          label: "Front-wheeled barrows",
          start: 1170,
          end: 1969,
          description: "Front-wheeled barrows appeared in England, France and the Low Countries between 1170 and 1250, the English king's works at Dover bought several in 1222, and builders, miners and farmers used them, though they stayed rare until the 15th century; in China central-wheeled barrows were still in wide use in the 1960s.",
        },
        {
          label: "Plastic and powered barrows",
          start: 1970,
          end: 2026,
          description: "James Dyson's Ballbarrow of the 1970s ran on a plastic ball, and steel and plastic barrows on pneumatic or solid tyres, some powered by diesel engines or batteries, became standard on building sites and in gardens.",
        },
      ],
    },
    {
      slug: "road",
      name: "Road",
      type: "invention",
      wiki: "Road",
      description: "A built, usually paved thoroughfare for traffic between places, from the first paved streets and Roman roads to macadam and tarmac motorways.",
      metadata: { invented_date: "4000 BCE", place: "Mesopotamia and the Indus Valley", field: "transport" },
      periods: [
        {
          label: "Paved streets and imperial roads",
          start: -4000,
          end: 499,
          description: "Paved streets were laid in Ur and the cities of the Indus Valley from 4000 BCE, and the Minoans paved a 50 km road across Crete in 2000 BCE. Darius's Royal Road let mounted couriers cover 2,699 km in nine days, and Rome built roads of crushed stone and pavers to move its legions.",
          wiki: "History of road transport",
        },
        {
          label: "Medieval roads and turnpikes",
          start: 500,
          end: 1764,
          description: "Roman roads decayed in medieval Europe though many stayed in use, Baghdad paved its roads with tar in the 8th century, and from 1707 English turnpike trusts collected tolls to maintain the main highways.",
          wiki: "History of road transport",
        },
        {
          label: "Engineered roads",
          start: 1765,
          end: 1900,
          description: "Metcalf, Trésaguet, Telford and McAdam made road building an engineering discipline, Telford's Holyhead road cut the London mail coach's journey from 45 to 27 hours, and macadam roads spread across the United States, Australia and Europe from the 1820s. In Wales, turnpike tolls set off the Rebecca Riots of 1839 to 1844, and from the late 1870s American cyclists led the Good Roads Movement.",
          wiki: "History of road transport",
        },
        {
          label: "Motor roads",
          start: 1901,
          end: 2026,
          description: "Hooley patented tarmac in 1901, Italy opened the first controlled-access highway, the Autostrada dei Laghi, in 1924, and the United States built a road network of 4,050,717 miles by 2009. Road runoff is a major source of heavy metals and hydrocarbons in water, and roads are a chief source of noise pollution.",
        },
      ],
    },

    // ---------- The diesel engine ----------
    {
      slug: "diesel-engine",
      name: "Diesel engine",
      type: "invention",
      wiki: "Diesel engine",
      description: "An internal combustion engine that ignites its fuel by the heat of compressed air, with no spark plug, the most thermally efficient practical combustion engine.",
      metadata: { invented_date: "1897", place: "Augsburg", field: "mechanical engineering" },
      periods: [
        {
          label: "Diesel's prototypes",
          start: 1893,
          end: 1897,
          description: "Built under contracts with Maschinenfabrik Augsburg and Krupp, Diesel's first prototype fired on 10 August 1893, and the third, the Motor 250/400, reached an effective efficiency of 26.2% in its main test on 17 February 1897.",
        },
        {
          label: "Ships, submarines and locomotives",
          start: 1898,
          end: 1923,
          description: "The first commercial diesel engine was installed at Kempten in 1898, diesel ships were launched from 1903 and the French diesel submarine Aigrette in 1904, and the first diesel locomotive ran in Switzerland in 1912; by the end of the First World War marine diesels reached 12,200 PS.",
        },
        {
          label: "Lorries, tractors and cars",
          start: 1924,
          end: 1969,
          description: "The first diesel lorries went on sale in 1924 and Sendling began mass-producing diesel tractors in 1925, Mercedes-Benz built the first mass-produced diesel car, the 260 D, from 1936, and the V-2 diesel powered the Soviet T-34 tank. Diesel engines replaced steam on every non-electrified railway in the world.",
        },
        {
          label: "Diesel cars and exhaust",
          start: 1970,
          end: 2026,
          description: "After the 1970s energy crisis most carmakers offered diesel models and a fifth of the world's cars came to run on diesel, but diesel exhaust is an IARC Group 1 carcinogen that causes lung cancer, and in 2015 Volkswagen was found to have programmed its diesel cars to switch on emissions controls only in laboratory tests.",
        },
      ],
    },
    {
      slug: "rudolf-diesel",
      name: "Rudolf Diesel",
      type: "person",
      wiki: "Rudolf Diesel",
      description: "German engineer who invented the compression-ignition engine named after him.",
      metadata: { birth_date: "1858", death_date: "1913", nationality: "German", field: "mechanical engineering" },
      periods: [
        {
          label: "Linde's engineer",
          start: 1880,
          end: 1891,
          description: "Diesel helped Carl von Linde build a refrigeration and ice plant in Paris and became its director a year later, then from 1890 ran Linde's research in Berlin, where an ammonia-vapour engine he built exploded and almost killed him.",
        },
        {
          label: "The rational heat engine",
          start: 1892,
          end: 1897,
          description: "Diesel received his first patents in 1892, published his treatise on a rational heat engine to replace the steam engine in 1893, and developed it at Maschinenfabrik Augsburg with Krupp's support until the first successful engine passed its tests in 1897.",
        },
        {
          label: "Royalties and disappearance",
          start: 1898,
          end: 1913,
          description: "Royalties made Diesel a millionaire by 1898, and he ran his engine on vegetable oil; on 29 September 1913 he vanished from the steamer Dresden on its crossing to London, and ten days later a body carrying his belongings was found in the Eastern Scheldt.",
        },
      ],
    },

    // ---------- Rail ----------
    {
      slug: "tram",
      name: "Tram",
      type: "invention",
      wiki: "Tram",
      description: "A rail vehicle running on tracks laid along or beside city streets, carrying passengers in local public transport.",
      metadata: { invented_date: "1807", place: "Swansea", field: "transport" },
      periods: [
        {
          label: "Horsecars",
          start: 1807,
          end: 1874,
          description: "The Swansea and Mumbles Railway began horse-drawn passenger service in 1807, and street railways followed in New York in 1832, Paris in 1855 and Santiago, Sydney and Alexandria by 1863; many lines kept ten or more horses for each car and had to store and remove their manure.",
        },
        {
          label: "Electric trams",
          start: 1875,
          end: 1929,
          description: "Fyodor Pirotsky ran the first electric tram near Saint Petersburg in 1875 and Siemens opened the first commercially successful line at Lichterfelde in 1881, though its live rails shocked people and animals crossing them; after Frank Sprague's Richmond system of 1888, electric trams replaced horse, cable and steam traction across Europe, the Americas, Australia and Japan.",
        },
        {
          label: "Decline and revival",
          start: 1930,
          end: 2026,
          description: "From the mid-20th century many cities replaced their trams with buses, trolleybuses, cars and rapid transit, and trams had died out in Japan by the 1960s; since the 1980s cities have brought trams back, now mostly articulated low-floor cars with regenerative braking.",
        },
      ],
    },
    {
      slug: "high-speed-rail",
      name: "High-speed rail",
      type: "invention",
      wiki: "High-speed rail",
      description: "Rail transport on dedicated track with specialised trains built to run at 250 km/h or more.",
      metadata: { invented_date: "1964", place: "Japan", field: "transport" },
      periods: [
        {
          label: "Electric speed trials",
          start: 1899,
          end: 1963,
          description: "German electric railcars reached 210.2 km/h on the Marienfelde–Zossen military railway in 1903, and Japan began building the Tōkaidō Shinkansen on new standard-gauge track in 1959.",
        },
        {
          label: "The Shinkansen",
          start: 1964,
          end: 1980,
          description: "The Tōkaidō Shinkansen opened between Tokyo and Osaka in October 1964, its bullet trains averaging 162.8 km/h, and carried its billionth passenger in 1976; the United States began Metroliner services in 1969 and Britain the InterCity 125 in 1976.",
        },
        {
          label: "European networks",
          start: 1981,
          end: 2002,
          description: "Italy's Direttissima and France's TGV, opened between Paris and Lyon in 1981, began Europe's high-speed networks, and air traffic fell or vanished on TGV routes; in 1998 a fractured wheel derailed an ICE train at Eschede, killing 101 people.",
        },
        {
          label: "China's network",
          start: 2003,
          end: 2026,
          description: "China opened its first high-speed line in 2003 and built the world's largest network, over two-thirds of the world's total by 2023 and over 50,000 km by December 2025, carrying $839 billion of debt by 2023; a collision at Wenzhou in 2011 killed 40 people.",
        },
      ],
    },

    // ---------- Water ----------
    {
      slug: "raft",
      name: "Raft",
      type: "invention",
      wiki: "Raft",
      description: "A flat, hull-less structure kept afloat by buoyant materials such as logs, reeds or inflated chambers, used to carry people and goods over water.",
      metadata: { invented_date: "prehistoric", field: "transport" },
      periods: [
        {
          label: "Rafts of wood, reed and skin",
          start: -10000,
          end: 1499,
          description: "People crossed water on rafts of wood, bamboo or reeds, or of inflated animal skins and sealed clay pots lashed together, and sailing rafts of balsa logs carried trade along South America's Pacific coast in pre-Columbian times.",
        },
        {
          label: "Timber rafts",
          start: 1500,
          end: 1950,
          description: "From the 16th century loggers floated felled trunks down Europe's rivers as rafts, those on the Rhine up to 400 m long with crews of 400 to 500, until railways, steamships and lorries ended the trade by the middle of the 20th century.",
          wiki: "Timber rafting",
        },
        {
          label: "Inflatable and heritage rafts",
          start: 1951,
          end: 2026,
          description: "Inflatable rafts of PVC, hypalon and nylon became the craft of whitewater rafting, and in 2022 UNESCO inscribed the timber-rafting traditions of Austria, the Czech Republic, Germany, Latvia, Poland and Spain as intangible heritage.",
        },
      ],
    },
    {
      slug: "sail",
      name: "Sail",
      type: "invention",
      wiki: "Sail",
      description: "A sheet of fabric or other membrane, set on a mast or spar, that uses the wind to propel boats and ships.",
      metadata: { invented_date: "6th millennium BCE", field: "transport" },
      periods: [
        {
          label: "Early sails",
          start: -6000,
          end: -1201,
          description: "Ubaid-period Mesopotamians sailed boats, Egyptian reed boats sailed up the Nile against its current by 3200 BCE, and the Austronesian peoples, whose words for sail date to 3000 BCE, began a Pacific expansion under crab claw sails.",
        },
        {
          label: "Square, lateen and crab claw rigs",
          start: -1200,
          end: 1399,
          description: "Greek and Phoenician traders sailed the Mediterranean under square sails from 1200 BCE, the cheaper lateen sail became common there in the 5th century CE, and Austronesian crab claw sails on outriggers and catamarans carried settlers across Micronesia and Polynesia and to Madagascar.",
        },
        {
          label: "The Age of Sail",
          start: 1400,
          end: 1879,
          description: "Square-rigged carracks and galleons, navigated by compass, carried Vasco da Gama to India, Columbus to the Americas and Magellan's expedition around the world, and sailing warships fought in lines of battle with broadsides of cannon; Baltimore clippers smuggled opium and illegally carried slaves.",
          wiki: "Sailing ship",
        },
        {
          label: "Steam overtakes sail",
          start: 1880,
          end: 2026,
          description: "By the 1880s triple-expansion steamships could compete with sail on all major routes, and the last commercial sailing ships stopped trading by 1960; by 2023, 30 ships used sails or kites to cut their fuel use.",
          wiki: "Sailing ship",
        },
      ],
    },
    {
      slug: "hovercraft",
      name: "Hovercraft",
      type: "invention",
      wiki: "Hovercraft",
      description: "An amphibious craft that rides on a cushion of air blown beneath its hull, over water, land, mud and ice.",
      metadata: { invented_date: "1950s", place: "Somerleyton, Suffolk", field: "transport" },
      periods: [
        {
          label: "Air-cushion boats",
          start: 1915,
          end: 1958,
          description: "Dagobert Müller von Thomamühl built an air-cushion torpedo boat armed with torpedoes and machine guns in 1915, Toivo Kaario and Vladimir Levkov built air-cushion craft in the 1930s, and Christopher Cockerell tested models of his momentum-curtain design at Somerleyton in the early 1950s, which the government put on the secret list.",
        },
        {
          label: "SR.N1 and the skirt",
          start: 1959,
          end: 1967,
          description: "Saunders-Roe's SR.N1 crossed the English Channel on 25 July 1959, Latimer-Needham's flexible skirt let hovercraft ride over waves and obstacles, and passenger services began with the VA-3 in 1962 and Hovertravel's Solent crossing in 1965.",
        },
        {
          label: "Channel ferries and landing craft",
          start: 1968,
          end: 2000,
          description: "From 1968 SR.N4 hovercraft carried up to 418 passengers and 60 cars across the Channel, until rising fuel prices, catamarans and the Channel Tunnel ended the service in 2000; the Soviet Union built the Zubr class landing craft, the most massive hovercraft ever built.",
        },
        {
          label: "Rescue craft",
          start: 2001,
          end: 2026,
          description: "Hovercraft served rescue services on mud, ice and floodwater and carried freight and passengers to remote Alaskan villages, and by 2025 only two year-round public hovercraft services remained, Hovertravel's Solent route and Ōita in Japan.",
        },
      ],
    },

    // ---------- Riding ----------
    {
      slug: "saddle",
      name: "Saddle",
      type: "invention",
      wiki: "Saddle",
      description: "A seat fastened to a riding animal's back by a girth, which supports and steadies the rider.",
      metadata: { invented_date: "727–396 BCE", place: "Turpan basin, Xinjiang", field: "transport" },
      periods: [
        {
          label: "Pads and treeless saddles",
          start: -727,
          end: -207,
          description: "The earliest known saddle, of cushioned cow hide, was buried in a Turpan basin tomb between 727 and 396 BCE, Assyrian cavalry rode on fringed pads in 700 BCE, and Scythian, Sarmatian and Pazyryk riders used padded treeless saddles that became status symbols.",
        },
        {
          label: "Solid trees and stirrups",
          start: -206,
          end: 1499,
          description: "Chinese saddles appear on the cavalry horses of the Terracotta Army, completed by 206 BCE, and the Romans used solid-treed four-horn saddles from the 1st century BCE; the solid tree spread the rider's weight off the horse's spine and carried paired stirrups, and medieval knights' saddles grew high cantles and pommels to keep armoured riders seated in battle.",
        },
        {
          label: "English and Western saddles",
          start: 1500,
          end: 2026,
          description: "Conquistadors brought Spanish saddles to the Americas, where vaqueros and cowboys added the horn for roping cattle, low English saddles spread with 18th-century fox hunting, and the US Cavalry rode the McClellan saddle from the 1850s to the 1940s.",
        },
      ],
    },
    {
      slug: "horseshoe",
      name: "Horseshoe",
      type: "invention",
      wiki: "Horseshoe",
      description: "A metal shoe nailed to a horse's hoof to protect it from wear.",
      metadata: { invented_date: "400 BCE", field: "transport" },
      periods: [
        {
          label: "Hoof wraps and the first shoes",
          start: -400,
          end: 899,
          description: "Riders in ancient Asia wrapped hooves in rawhide and leather and the Romans strapped on hipposandals, while four bronze horseshoes with nail holes were buried in an Etruscan tomb of 400 BCE and a nailed horseshoe with the Frankish king Childeric I at Tournai in the 5th century.",
        },
        {
          label: "Iron horseshoes",
          start: 900,
          end: 1834,
          description: "Written records of nailed iron shoes begin in 910, iron horseshoes were made in large numbers from the 13th century and became common in Yuan China after 1271, and in the Crusades era they were accepted in lieu of coin for taxes; the demand for them made blacksmithing a staple craft that advanced metallurgy.",
        },
        {
          label: "Machine-made shoes",
          start: 1835,
          end: 2026,
          description: "Henry Burden patented a machine in 1835 that made 60 horseshoes an hour, and farriers now fit steel and aluminium shoes to working, racing and sport horses, a trade restricted by law to qualified people in the UK.",
        },
      ],
    },

    // ---------- Electricity and energy ----------
    {
      slug: "electric-motor",
      name: "Electric motor",
      type: "invention",
      wiki: "Electric motor",
      description: "A machine that converts electrical energy into mechanical motion through the interaction of a magnetic field and an electric current.",
      metadata: { invented_date: "1821", place: "Royal Institution", field: "electrical engineering" },
      periods: [
        {
          label: "Electromagnetic rotation",
          start: 1821,
          end: 1863,
          description: "Faraday made a current-carrying wire turn around a magnet at the Royal Institution on 3 September 1821, Jedlik built a motor with stator, rotor and commutator in 1828, and the commutator motors of Sturgeon in 1832 and the Davenports in 1837 drove machine tools and a printing press, but battery costs bankrupted the Davenports.",
        },
        {
          label: "DC and induction motors",
          start: 1864,
          end: 1899,
          description: "Gramme's machines of 1871 became the first commercially successful DC motors, Sprague's motor of 1886 powered the first electric trolley system at Richmond in 1887–88, and Ferraris, Tesla and Dolivo-Dobrovolsky invented the AC induction motors that Westinghouse and General Electric built from the 1890s.",
        },
        {
          label: "Motors everywhere",
          start: 1900,
          end: 2026,
          description: "Electric motors gave each factory machine its own power and replaced muscle in farm work such as pumping water and in housework through washing machines and refrigerators; 800 million motors were sold in 2022, and motors use half the world's electricity.",
        },
      ],
    },
    {
      slug: "wind-turbine",
      name: "Wind turbine",
      type: "invention",
      wiki: "Wind turbine",
      description: "A machine that converts the kinetic energy of wind into electricity.",
      metadata: { invented_date: "1883", place: "Vienna", field: "energy" },
      periods: [
        {
          label: "Wind dynamos",
          start: 1883,
          end: 1930,
          description: "Josef Friedländer's Halladay wind motor drove a dynamo at the 1883 Vienna International Electrical Exhibition, James Blyth lit his Marykirk holiday home by wind in 1887 and Charles Brush built the first automatically operated wind turbine, and by 1908, 72 wind-driven generators ran in the United States.",
        },
        {
          label: "Grid experiments",
          start: 1931,
          end: 1969,
          description: "A 100 kW turbine ran at Yalta in 1931 and the megawatt-class Smith–Putnam turbine joined Vermont's grid in 1941 until a blade snapped off, while rural wind generators declined as power lines reached the countryside.",
        },
        {
          label: "Wind farms",
          start: 1970,
          end: 2026,
          description: "Danish mechanics built small turbines amid anti-nuclear protests in the early 1970s, cooperatives and policies in Denmark, Germany, Spain and the United States grew the industry, and by 2024 wind farms generated over 1,136 GW, with 117 GW added a year. Turbine blades have killed thousands of birds and are hard to recycle.",
        },
      ],
    },
    {
      slug: "fuel-cell",
      name: "Fuel cell",
      type: "invention",
      wiki: "Fuel cell",
      description: "An electrochemical cell that turns the chemical energy of a fuel, often hydrogen, and oxygen into electricity for as long as fuel is supplied.",
      metadata: { invented_date: "1838", field: "electrochemistry" },
      periods: [
        {
          label: "Grove and Schönbein",
          start: 1838,
          end: 1931,
          description: "William Grove described his first crude fuel cells in 1838, Christian Schönbein reported current from hydrogen and oxygen dissolved in water in 1839, and in 1842 Grove sketched a cell of the materials used in today's phosphoric acid fuel cell.",
        },
        {
          label: "Bacon cells and spacecraft",
          start: 1932,
          end: 1999,
          description: "Francis Bacon developed a 5 kW stationary hydrogen–oxygen cell in 1932, General Electric's Grubb–Niedrach membrane cell flew on Project Gemini in the first commercial use of fuel cells, and Bacon's alkaline cells supplied NASA spacecraft with electricity and drinking water from the mid-1960s.",
        },
        {
          label: "Fuel cell vehicles and power plants",
          start: 2000,
          end: 2026,
          description: "Stationary fuel cells came to supply primary and backup power, with 140,000 stacks shipped in 2010, the first fuel-cell trains ran in Germany in 2018, and 18,000 fuel cell cars had been leased or sold by 2019; 95% of hydrogen is still made from fossil fuels, releasing carbon dioxide.",
        },
      ],
    },
    {
      slug: "electrolysis",
      name: "Electrolysis",
      type: "invention",
      wiki: "Electrolysis",
      description: "The use of direct electric current to drive chemical reactions that split compounds into their elements, such as water into hydrogen and oxygen.",
      metadata: { invented_date: "1800", field: "chemistry" },
      periods: [
        {
          label: "Splitting water and isolating elements",
          start: 1785,
          end: 1885,
          description: "Van Marum reduced tin, zinc and antimony from their salts with an electrostatic generator in 1785, Nicholson and Carlisle split water with a voltaic pile in 1800, Davy isolated potassium, sodium, calcium and magnesium by 1808, and Faraday published his laws of electrolysis in 1834. Chemists including Paulin Louyet and Jérôme Nicklès died trying to isolate fluorine by electrolysis.",
        },
        {
          label: "Aluminium and fluorine",
          start: 1886,
          end: 1929,
          description: "Moissan isolated fluorine by electrolysis in 1886, the year Hall and Héroult filed patents for the electrolytic smelting of aluminium, which cut its price from four dollars to thirty cents a pound, and the Castner–Kellner process made sodium hydroxide from 1890.",
        },
        {
          label: "Chlor-alkali and hydrogen",
          start: 1930,
          end: 2026,
          description: "The modern chlor-alkali process of 1930 made the electrolysis of brine the source of most industrial chlorine and sodium hydroxide, and electrolysis refines copper, plates metals and makes 4% of the world's hydrogen, some of it for fuel cell vehicles.",
        },
      ],
    },
  ],

  links: [
    // ---------- Road vehicles and roads ----------
    { from: "karl-benz", to: "car", type: "originated", share: 0.25, why: "Benz patented the Motorwagen in 1886, and many historians credit him as the inventor of the car. Rivals: Cugnot's steam tricycle of 1769, de Rivaz's internal-combustion vehicle of 1808, and Daimler and Maybach." },
    { from: "gottlieb-daimler", to: "car", type: "originated", share: 0.1, why: "Daimler and Maybach sold their first car in 1892, and their engines powered Levassor's and Peugeot's cars, the start of France's motor industry. Rival: Benz, who built and patented his car first." },
    { from: "internal-combustion-engine", to: "car", type: "builds_on", share: 0.2, why: "Benz set out to apply the internal combustion engine to a horseless carriage, and petrol engines dominated cars from the 1910s." },
    { from: "wheel", to: "car", type: "builds_on", share: 0.05, why: "A car is a motor vehicle on wheels, and its name comes from the Gaulish karros, a chariot." },
    { from: "assembly-line", to: "car", type: "builds_on", share: 0.05, why: "Ford's moving assembly line of 1913 made cars affordable and spread through the industry, and by 1930, 250 carmakers without assembly lines had disappeared." },
    { from: "pneumatic-tyre", to: "car", type: "builds_on", share: 0.05, why: "Michelin made the first pneumatic tyres for cars in 1895, and cars have run on them since." },
    { from: "bicycle", to: "car", type: "builds_on", share: 0.05, why: "Ball bearings, pneumatic tyres, chain-driven sprockets and tension-spoked wheels were invented for the bicycle before they were used in the car." },
    { from: "car", to: "benz-patent-motorwagen", type: "embodies", share: 0.1, why: "The Motorwagen was a car, a self-propelled road vehicle carrying its driver and a passenger, and the first one built to be sold. Rivals for the idea: Cugnot's steam tricycle of 1769 and the steam carriages that followed it." },
    { from: "car", to: "ford-model-t", type: "embodies", share: 0.1, why: "The Model T was the first car ordinary families could afford, and Ford built more than fifteen million of them from 1908 to 1927." },
    { from: "wheel", to: "bicycle", type: "builds_on", share: 0.05, why: "The bicycle runs on two wheels in tandem, from the draisine's iron-shod wooden wheels to Meyer's tension-spoked wheel of 1869." },
    { from: "bicycle", to: "pneumatic-tyre", type: "builds_on", share: 0.1, why: "Dunlop made the first successful pneumatic tyre for his son's tricycle in 1888, and cycle races proved it." },
    { from: "wheel", to: "pneumatic-tyre", type: "builds_on", share: 0.1, why: "A tyre surrounds a wheel's rim, and the pneumatic tyre replaced the leather and iron bands fitted around wooden wheels." },
    { from: "bicycle", to: "wright-flyer", type: "builds_on", share: 0.05, why: "The Wrights were bicycle makers, and the Flyer's propellers were driven by sprocket chains borrowed from bicycle technology." },
    { from: "internal-combustion-engine", to: "tractor", type: "builds_on", share: 0.2, why: "John Charter built the first petrol tractors in 1889 by putting Otto engines on a steam engine chassis, and petrol tractors were the norm by the 1920s." },
    { from: "steam-locomotive", to: "tractor", type: "builds_on", share: 0.05, why: "Tuxford's portable farm engine of 1839 was built around a locomotive-style boiler, the ancestor of the steam traction engines that were the first tractors." },
    { from: "henry-ford", to: "tractor", type: "originated", share: 0.1, why: "Ford's light, mass-produced Fordson of 1917 displaced the heavier designs and took 77% of the US market by 1923. Rivals: Charter's and Froelich's petrol tractors, Albone's Ivel, and Hart and Parr." },
    { from: "wheel", to: "wheelbarrow", type: "builds_on", share: 0.15, why: "A wheelbarrow carries its load on a single wheel, which bears all of it in the central-wheeled Chinese barrow." },
    { from: "wheel", to: "road", type: "builds_on", share: 0.1, why: "Wheeled transport created the need for roads firm enough to bear carts and wagons, and the first paved streets followed." },
    { from: "portland-cement", to: "road", type: "builds_on", share: 0.05, why: "Hooley's tarmac of 1901 was modified with Portland cement, and the Long Island Motor Parkway of 1908 was paved with reinforced concrete." },
    { from: "tram", to: "car", type: "supersedes", share: 0, why: "In the mid-20th century many cities replaced their trams with buses, trolleybuses and cars." },

    // ---------- The diesel engine ----------
    { from: "rudolf-diesel", to: "diesel-engine", type: "originated", share: 0.55, why: "Diesel conceived, patented and developed the compression-ignition engine and tested the first successful one in 1897. Rivals: Emil Capitaine, who lost a patent suit against him, and George Brayton, whose air-blast injection Diesel adopted and improved." },
    { from: "internal-combustion-engine", to: "diesel-engine", type: "builds_on", share: 0.2, why: "The diesel engine is an internal combustion engine that ignites its fuel by compression instead of a spark." },
    { from: "diesel-engine", to: "tractor", type: "builds_on", share: 0.05, why: "Tractors were dieselised from the 1960s, and modern farm tractors usually run on diesel engines." },
    { from: "steam-locomotive", to: "diesel-engine", type: "supersedes", share: 0, why: "Diesel engines replaced steam engines on every non-electrified railway in the world." },

    // ---------- Rail ----------
    { from: "electric-motor", to: "tram", type: "builds_on", share: 0.15, why: "Electric motors, from Pirotsky's 1875 line to Sprague's Richmond trams, drove the trams that replaced horse, cable and steam traction." },
    { from: "electric-generator", to: "tram", type: "builds_on", share: 0.05, why: "Electric trams spread rapidly once the production and transmission of electricity had been solved." },
    { from: "electric-motor", to: "high-speed-rail", type: "builds_on", share: 0.1, why: "High-speed rail began with electric railcars on the Marienfelde–Zossen line in 1903 and runs mostly on electric power." },
    { from: "steam-locomotive", to: "high-speed-rail", type: "builds_on", share: 0.1, why: "High-speed rail grew out of the railways, whose express trains averaged 100 km/h by the late 19th century." },

    // ---------- Water ----------
    { from: "raft", to: "sail", type: "builds_on", share: 0.05, why: "Sailing began in warm 'nursery' waters where people travelled on rafts, and sails were set on rafts such as the balsa rafts of South America." },
    { from: "internal-combustion-engine", to: "hovercraft", type: "builds_on", share: 0.05, why: "The SR.N1 was lifted and driven by a 450 hp Alvis Leonides piston engine." },
    { from: "hovercraft", to: "high-speed-rail", type: "rivalry", share: 0, why: "Bertin's air-cushion Aérotrain competed with the SNCF's TGV project until the French government chose the TGV in 1971." },

    // ---------- Riding ----------
    { from: "saddle", to: "stirrup", type: "builds_on", share: 0.2, why: "Stirrups hang from the saddle, and paired stirrups appeared only after the solid saddle tree, which spread the rider's weight in them off the horse's spine." },
    { from: "ferrous-metallurgy", to: "horseshoe", type: "builds_on", share: 0.15, why: "Horseshoes were forged of iron, made in large numbers from the 13th century, and their demand made blacksmithing a staple craft." },
    { from: "bronze", to: "horseshoe", type: "builds_on", share: 0.05, why: "The Etruscan horseshoes of 400 BCE and the shoes common in Europe from 1000 CE were bronze." },

    // ---------- Electricity and energy ----------
    { from: "michael-faraday", to: "electric-motor", type: "originated", share: 0.2, why: "Faraday made the first electromagnetic rotary motion in 1821. Rivals: Jedlik's commutator motor of 1828, Sturgeon's and the Davenports' DC motors, Jacobi, Gramme, Sprague, and Ferraris, Tesla and Dolivo-Dobrovolsky's induction motors." },
    { from: "electromagnetic-induction", to: "electric-motor", type: "builds_on", share: 0.1, why: "The induction motor of Ferraris, Tesla and Dolivo-Dobrovolsky, now used for the vast majority of commercial applications, works by induction." },
    { from: "electric-generator", to: "electric-motor", type: "builds_on", share: 0.1, why: "A motor is a generator run in reverse, as Gramme showed in 1873, and motors found a market only once generators and distribution supplied electricity." },
    { from: "westinghouse-electric", to: "electric-motor", type: "originated", share: 0.05, why: "Westinghouse bought Ferraris's and Tesla's induction-motor patents, employed Tesla and built its first practical induction motor in 1892." },
    { from: "windmill", to: "wind-turbine", type: "builds_on", share: 0.25, why: "Wind turbines descend from the windmills of Persia and Europe, and the first electricity-generating turbine of 1883 was a Halladay wind motor from the U.S. Wind Engine & Pump Company." },
    { from: "electric-generator", to: "wind-turbine", type: "builds_on", share: 0.2, why: "A wind turbine is a rotor driving an electrical generator, from Friedländer's dynamo of 1883 to direct-drive machines." },
    { from: "general-electric", to: "fuel-cell", type: "originated", share: 0.1, why: "GE chemists Grubb and Niedrach made the membrane fuel cell of 1955 to 1958 that GE developed with NASA for Project Gemini, the first commercial use. Rivals: Grove and Schönbein in 1838 and 1839, and Francis Bacon's alkaline cell." },
    { from: "electrolysis", to: "fuel-cell", type: "builds_on", share: 0.1, why: "A hydrogen fuel cell joins hydrogen and oxygen, the gases electrolysis splits water into, and electrolysers make the hydrogen for fuel cells." },
    { from: "michael-faraday", to: "electrolysis", type: "originated", share: 0.1, why: "Faraday named electrolysis, published its two laws in 1834 and coined electrode, anode and cathode. Earlier: van Marum in 1785, Nicholson and Carlisle, who split water in 1800, and Davy." },
  ],
};

/** Links to or from entries assigned to other batches (see MASTER LIST), merged later. */
export const crossLinksB: InventionsLink[] = [
  { from: "brick", to: "road", type: "builds_on", share: 0.05, why: "Brick-paved roads were built in the Indus Valley Civilisation from 3300 BCE." },
  { from: "jet-engine", to: "hovercraft", type: "builds_on", share: 0.05, why: "A Blackburn Marboré turbojet drove the SR.N1 Mk II, and Bristol Proteus turboshafts powered the SR.N4 Channel ferries." },
  { from: "high-speed-rail", to: "jet-airliner", type: "rivalry", share: 0, why: "High-speed trains compete with airliners between cities, and air traffic fell or vanished on routes the TGV took over." },
];
