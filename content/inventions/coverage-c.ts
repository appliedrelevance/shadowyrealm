/**
 * Inventions coverage batch c: food and farming, money and commerce. Drafted from a
 * coverage audit against Wikipedia's Timeline of historic inventions.
 */
import type { InventionsContent, InventionsLink } from "../types";

export const coverageC: InventionsContent = {
  entities: [
    // ---------- Farming ----------
    {
      slug: "agriculture",
      name: "Agriculture",
      type: "invention",
      wiki: "History of agriculture",
      description: "The cultivation of domesticated crops and the raising of domesticated animals for food, begun independently in at least eleven regions after the last ice age.",
      metadata: { invented_date: "9500 BCE", place: "Fertile Crescent, China, Mesoamerica and South America", field: "agriculture" },
      periods: [
        {
          label: "Neolithic Revolution",
          start: -10000,
          end: -3301,
          description: "Farmers in West Asia, East Asia, Africa, the Americas and New Guinea domesticated crops and animals independently, and farming took 2,500 years to spread from the Aegean to Britain. Farmers fed larger settled populations but grew shorter than the foragers before them, European men from 178 to 165 centimetres, and caught influenza, smallpox and measles from their animals.",
          wiki: "Neolithic Revolution",
        },
        {
          label: "Farming civilisations",
          start: -3300,
          end: 1491,
          description: "Irrigated grain fed the first cities of Sumer, Egypt, the Indus valley and China, Rome worked great estates with slaves and laid the ground for serfdom, and medieval Europe's heavy plough and three-field rotation raised output. The Arab world spread sugar, rice and cotton to Europe and began the slave-worked sugar plantation.",
        },
        {
          label: "Columbian exchange and agricultural revolution",
          start: 1492,
          end: 1899,
          description: "After 1492 maize, potatoes and cassava crossed to the Old World and wheat, horses and cattle to the Americas, and Britain's enclosure, four-field rotation and selective breeding raised wheat yields from 19 bushels an acre in 1720 to 30 by 1840. Europe's dependence on the potato led to the blight that killed over one million people in Ireland.",
        },
        {
          label: "Industrial agriculture",
          start: 1900,
          end: 2026,
          description: "Tractors replaced draught animals, Haber-Bosch fertiliser and pesticides multiplied yields, and the Green Revolution, credited with saving over a billion people from starvation, carried high-yielding seed to the developing world. Soviet collectivisation brought the famine of 1932–33 and China's Great Leap Forward the famine of 1959–61, and modern farming polluted water and moved most of the world's poultry and eggs into factory farms.",
        },
      ],
    },
    {
      slug: "rice-farming",
      name: "Rice farming",
      type: "invention",
      wiki: "History of rice cultivation",
      description: "The cultivation of domesticated rice, much of it in flooded paddy fields, first in the Yangtze basin and now the staple crop of half the world.",
      metadata: { invented_date: "7000 BCE", place: "Yangtze River basin, China", field: "agriculture" },
      periods: [
        {
          label: "Yangtze domestication",
          start: -7000,
          end: -2501,
          description: "Farmers in the lower and middle Yangtze basin domesticated Asian rice from wild Oryza rufipogon and developed wetland farming, and by 3500 to 2500 BC intensive paddy fields fed fast-growing populations in the Liangzhu and Qujialing-Shijiahe cultures.",
        },
        {
          label: "Spread across Asia and Africa",
          start: -2500,
          end: 1499,
          description: "Austronesian settlers carried rice from Taiwan to the Philippines from 2000 BC and on through Island Southeast Asia, wet-paddy rice reached Korea in 850–550 BC and Japan by 300 BC, and West Africans domesticated African rice on the Niger 3,000 to 3,500 years ago. The Umayyads brought rice to Spain in the 8th century and Sicily grew it from the 9th.",
        },
        {
          label: "Plantation rice in the Americas",
          start: 1500,
          end: 1899,
          description: "The Spanish brought rice to Mexico in the 1520s and the Portuguese and the Africans they enslaved to Brazil, and from 1694 South Carolina and Georgia planters grew rich on rice worked by slaves from Senegambia and Sierra Leone, whose skill raised their price at Charleston, the port for 40% of American slave imports. The plantations declined after slavery ended with the Civil War.",
        },
        {
          label: "Green Revolution paddies",
          start: 1900,
          end: 2026,
          description: "Green Revolution varieties let irrigated paddies in Java bear three crops a year, and India has the largest paddy output and in 2020 was the largest rice exporter. Flooded paddies emit 10% of the world's methane, as much as the aviation industry.",
          wiki: "Paddy field",
        },
      ],
    },

    // ---------- Food and drink ----------
    {
      slug: "cooking",
      name: "Cooking",
      type: "invention",
      wiki: "Cooking",
      description: "The use of heat to make food more palatable, digestible, nutritious or safe, practised in every human society.",
      metadata: { invented_date: "780,000 years ago", field: "food" },
      periods: [
        {
          label: "Hearths and clay ovens",
          start: -10000,
          end: 1491,
          description: "Households built clay ovens at Çatalhöyük by 6600 BC, in Mesopotamia by 4000 BC and in the Indus Valley by 3200 BC, Middle Eastern bakers stuck flatbread to the walls of cylindrical tinuru ovens, and medieval Europeans cooked in cauldrons over fireplaces.",
          wiki: "Oven",
        },
        {
          label: "Columbian exchange",
          start: 1492,
          end: 1799,
          description: "After 1492 potatoes, tomatoes, maize, chili peppers and chocolate changed Old World cooking and cattle, pigs, wheat and rice changed New World cooking, and in the 17th and 18th centuries food became a marker of identity in Europe.",
        },
        {
          label: "Industrial food and national cuisines",
          start: 1800,
          end: 1919,
          description: "The Industrial Revolution brought factory-processed, canned and packaged food and processed breakfast cereals, and in the 19th century national cuisines became symbols of national identity.",
        },
        {
          label: "Fast food and household smoke",
          start: 1920,
          end: 2026,
          description: "Frozen food, cafeterias and fast-food restaurants spread from the 1920s and factory-made meals became common. In 2021 over 2.6 billion people still cooked on open fires or inefficient stoves, whose smoke causes 3.8 million premature deaths a year.",
        },
      ],
    },
    {
      slug: "bread",
      name: "Bread",
      type: "invention",
      wiki: "History of bread",
      description: "A staple food of baked dough made from flour and water, first cooked from wild cereals and then from farmed wheat and barley.",
      metadata: { invented_date: "14,600–11,600 years ago", place: "Shubayqa 1, Jordan", field: "food" },
      periods: [
        {
          label: "First breads",
          start: -10000,
          end: -3001,
          description: "Natufian hunter-gatherers at Shubayqa 1 in Jordan's Black Desert cooked flatbread from wild wheat, wild barley and tubers 14,600 to 11,600 years ago, and bread from farmed wheat appears at Neolithic sites in Turkey and Europe from 9,100 years ago and in Egypt 5,000 to 6,000 years ago.",
        },
        {
          label: "Bakers of the ancient and medieval world",
          start: -3000,
          end: 1799,
          description: "Egypt paid subsistence workers in bread and beer, bakers leavened dough with a piece kept from the day before, Athens had bakers' shops by the 5th century BC, Abbasid cities organised bakers into supervised guilds, and England regulated the price, weight and quality of bread from the 13th century.",
        },
        {
          label: "Adulteration and the Corn Laws",
          start: 1800,
          end: 1899,
          description: "Bread sold in England and the United States was often adulterated with chalk, sawdust, alum and plaster until Britain's Food Adulteration Acts of 1860 and 1899, and the Corn Laws inflated the price of bread in the UK until their repeal in 1846.",
        },
        {
          label: "Factory bread",
          start: 1900,
          end: 2026,
          description: "Bread-baking was industrialised: Otto Rohwedder built a machine that sliced and wrapped bread in 1928, the US has required white flour to be fortified since 1941 after deficiencies were found in military recruits, and Britain's 1961 Chorleywood process cut the time to make a loaf at the cost of taste and nutrition.",
        },
      ],
    },
    {
      slug: "cheese",
      name: "Cheese",
      type: "invention",
      wiki: "Cheese",
      description: "A food made by curdling milk, pressing and salting the curds and often ageing them, which preserves milk for months or years.",
      metadata: { invented_date: "5500 BCE", place: "Kuyavia, Poland", field: "food" },
      periods: [
        {
          label: "Neolithic cheesemaking",
          start: -5500,
          end: -3001,
          description: "Farmers in Kuyavia, Poland, strained cheese curds through vessels left coated with milk fat by 5500 BCE, and farmers on the Dalmatian coast of Croatia by 5200 BCE.",
        },
        {
          label: "Temple quotas and Roman cheesemaking",
          start: -3000,
          end: 499,
          description: "Sumerian herders delivered annual quotas of cheese and butter to Inanna's temple, Egyptian tomb murals show cheese by 2000 BCE, and the dead of Xiaohe in Xinjiang were buried with cheese by 1615 BCE. Columella described rennet coagulation, pressing, salting and ageing in 65 CE, and cheese was an everyday food of the Roman Empire.",
        },
        {
          label: "Named cheeses",
          start: 500,
          end: 1814,
          description: "Anglo-Saxons named a Thames village Ceswican, cheese farm, Vlach shepherds supplied Constantinople with cheese in 1022, and Parmesan in 1597, Gouda in 1697 and Camembert in 1791 were first recorded.",
        },
        {
          label: "Factory cheese",
          start: 1815,
          end: 2026,
          description: "The first cheese factory opened in Switzerland in 1815 and Jesse Williams began assembly-line cheesemaking in New York in 1851; factory cheese overtook traditional cheesemaking in the Second World War era, and world production from cow's milk reached 22.6 million tonnes in 2022. Raw-milk cheeses can carry listeriosis, brucellosis, salmonellosis and tuberculosis, and each kilogram of cheese emits 6 to 12 kilograms of carbon dioxide equivalent.",
        },
      ],
    },
    {
      slug: "wine",
      name: "Wine",
      type: "invention",
      wiki: "History of wine",
      description: "An alcoholic drink made by fermenting grape juice, made since the Neolithic and central to Mediterranean trade and religion.",
      metadata: { invented_date: "6000 BCE", place: "Georgia", field: "food and drink" },
      periods: [
        {
          label: "First wineries",
          start: -6000,
          end: -3201,
          description: "Winemakers near Tbilisi in Georgia left the earliest traces of wine by 6000 BC, Iranians at Hajji Firuz sealed wine jars with pine resin by 5000 BC, and the Areni-1 cave in Armenia held a winery with a press, fermentation vats, jars and cups by 4100 BC.",
        },
        {
          label: "Wine of the ancient world",
          start: -3200,
          end: 499,
          description: "Domesticated grapes spread through the Near East from 3200 BC, a royal winemaking industry grew in Egypt's Nile Delta, and the Phoenicians and Greeks carried vines and the wine trade around the Mediterranean. Rome planted most of Western Europe's wine regions, drunkenness and alcoholism spread among Romans from the 1st century BC, and in AD 92 Domitian banned new vineyards in Italy to protect grain growing.",
        },
        {
          label: "Monks, merchants and missions",
          start: 500,
          end: 1599,
          description: "Benedictine and Cistercian monks planted vineyards across Europe to supply the Mass, Bordeaux shipped its wine to England from 1152 to 1453, and Muslim alchemists distilled wine into ethanol and brandy while the Mamluks banned winemaking in the Levant. Spanish missionaries planted vines in Mexico by 1530 and in Peru by the 1550s.",
        },
        {
          label: "Bottles, phylloxera and appellations",
          start: 1600,
          end: 2026,
          description: "Glass bottles and corks let wine age from the 17th century, and vines reached South Africa in 1655 and Australia in 1788. In the late 19th century the American aphid phylloxera forced the replacement of almost every vine in Europe with vines grafted onto American rootstock, and after prohibitionism and two world wars every major producing country adopted appellation laws like those France's INAO administered from 1947.",
        },
      ],
    },
    {
      slug: "noodle",
      name: "Noodle",
      type: "invention",
      wiki: "Noodles",
      description: "Strips or strings of unleavened dough, usually boiled, first made in China and a staple in Chinese and Italian cuisine.",
      metadata: { invented_date: "2000 BCE", place: "Lajia, China", field: "food" },
      periods: [
        {
          label: "Lajia and Han noodles",
          start: -2000,
          end: 299,
          description: "The Qijia culture left a bowl of noodles at Lajia 4,000 years ago, and noodles of wheat dough became a prominent food of Han China, whose Eastern Han period (25–220 CE) left the earliest written record of noodles.",
        },
        {
          label: "Along the Silk Road",
          start: 300,
          end: 1599,
          description: "Noodles spread along the Silk Road to Persia by the 4th century, Arabs dried them for long journeys in the 5th century, and Japan adapted Chinese wheat noodles as udon by the 9th century. Al-Idrisi recorded in 1154 that itriyya was made and exported from Norman Sicily, and pasta dishes spread through Italy from the 13th century.",
        },
        {
          label: "Pasta factories",
          start: 1600,
          end: 1957,
          description: "Naples had pasta-making machines by the early 17th century, Venice licensed the first pasta factory in 1740, a steam-powered factory opened in Pest in 1859, and artificial drying and extrusion in the early 1900s made pasta an industrial export.",
          wiki: "Pasta",
        },
        {
          label: "Instant noodles",
          start: 1958,
          end: 2026,
          description: "Momofuku Ando of Nissin launched Chikin Ramen, the first instant noodles, on 25 August 1958 and Cup Noodles in 1971, and the world ate 103.62 billion servings in 2018. Frequent eating has been linked to obesity and metabolic syndrome, and India's food regulator banned Nestlé's Maggi noodles over lead contamination in 2015 until a court struck the ban down.",
          wiki: "Instant noodles",
        },
      ],
    },
    {
      slug: "salt-making",
      name: "Salt making",
      type: "invention",
      wiki: "History of salt",
      description: "The extraction of salt by boiling brine, evaporating seawater in ponds or mining rock salt, for preserving and seasoning food and later as an industrial chemical.",
      metadata: { invented_date: "6000 BCE", place: "Poiana Slatinei, Romania", field: "food" },
      periods: [
        {
          label: "Neolithic and Bronze Age saltworks",
          start: -6000,
          end: -1001,
          description: "Neolithic people boiled salt from spring water at Poiana Slatinei in Romania by 6000 BCE, Solnitsata in Bulgaria, the earliest known town in Europe, was built around a salt production facility, and salt pans in Yorkshire date to 3766–3647 BCE. A Chinese work of 2700 BCE set out the kinds of salt and how to extract them.",
        },
        {
          label: "Salt roads, caravans and taxes",
          start: -1000,
          end: 1799,
          description: "Rome built the Via Salaria to bring salt to the city, caravans of up to forty thousand camels carried salt across the Sahara to the Sahel, sometimes trading it for slaves at Timbuktu, and Chinese emperors drew steady revenue from salt monopolies. France's gabelle, enacted in 1286, made salt in Paris 20 times dearer than in Brittany by the 18th century and was one of the reasons for the French Revolution.",
        },
        {
          label: "Mines, monopolies and the Salt March",
          start: 1800,
          end: 1945,
          description: "Liverpool became the entrepôt for much of the world's salt in the 19th century, industrial mining and drilling in its second half cut prices by breaking monopolies, and Gandhi's Salt Satyagraha protested the British salt tax; France abolished its salt tax in 1945.",
        },
        {
          label: "Chemical feedstock and table salt",
          start: 1946,
          end: 2026,
          description: "World production reached 300 million tonnes in 2018, led by China with 68 million, most of it used to make caustic soda, chlorine and PVC. Iodised salt has cut iodine deficiency disorders, while excess salt in diets raises the risk of hypertension, stroke and cardiovascular disease.",
          wiki: "Salt",
        },
      ],
    },
    {
      slug: "water-well",
      name: "Water well",
      type: "invention",
      wiki: "Well",
      description: "A shaft dug, driven or drilled into the ground to draw groundwater from an aquifer, by bucket or by pump.",
      metadata: { invented_date: "8400 BC", place: "Kissonerga-Mylouthkia, Cyprus", field: "water supply" },
      periods: [
        {
          label: "Neolithic wells",
          start: -8400,
          end: -2001,
          description: "Pre-pottery Neolithic Cypriots drove a well 8 metres through limestone at Kissonerga-Mylouthkia by 8400 BC, a stone-lined well served Atlit-Yam off the coast of Israel by 7000 BC, and Linear Pottery farmers lined wells with timber in central Europe from 5300 to 5200 BC.",
        },
        {
          label: "Salt wells, oil wells and stepwells",
          start: -2000,
          end: 1849,
          description: "The Western Zhou Book of Changes described how wells were kept and protected, Sichuan drillers first applied well technology to brine 2,250 years ago to start China's salt industry, and Chinese oil wells reached 240 metres with bamboo-pole bits by 347 CE. Iran dug qanats, India stepwells, and Orvieto sank St Patrick's Well 61 metres in 1527.",
        },
        {
          label: "Drilled and pumped wells",
          start: 1850,
          end: 2026,
          description: "The Woodingdean well, hand-dug between 1858 and 1862, reached 392 metres, and machine-drilled wells cased in steel or PVC with electric pumps now supply rural areas and many cities worldwide. Contaminated wells spread waterborne disease and can carry nitrates, arsenic, radon and uranium, and a study found 9 to 20 percent of 39 million groundwater wells at high risk of running dry if water tables fall by less than five metres.",
        },
      ],
    },

    // ---------- Money and commerce ----------
    {
      slug: "weighing-scale",
      name: "Weighing scale",
      type: "invention",
      wiki: "Weighing scale",
      description: "An instrument for measuring mass or weight, from the two-pan balance of ancient merchants to the spring scale and the electronic load cell.",
      metadata: { invented_date: "2600 BC", place: "Egypt", field: "measurement" },
      periods: [
        {
          label: "Balances and stone weights",
          start: -2600,
          end: -401,
          description: "Egypt's deben balance weights date to the reign of Sneferu, 2600 BC, with weighing stones marked with the sign for gold, Indus Valley towns used polished stone cubes in multiples of a common mass from 2400 to 1800 BC, and Bronze Age merchants from Britain to Mesopotamia used standard weights of 8 to 10.5 grams.",
        },
        {
          label: "Merchants' balances",
          start: -400,
          end: 1668,
          description: "Small merchants and their customers used cheap unequal-armed bismars from 400 BC, a Chu tomb in Hunan held a wooden balance with bronze weights from the 4th to 3rd century BC, and governments worked to standardise weights and make traders use the correct ones.",
        },
        {
          label: "Roberval and spring scales",
          start: 1669,
          end: 1939,
          description: "Gilles de Roberval showed his parallelogram balance to the French Academy of Sciences in 1669, Richard Salter designed a spring scale in 1770, and spring scales spread in Britain after 1840 to weigh letters and parcels for the Uniform Penny Post.",
        },
        {
          label: "Electronic scales",
          start: 1940,
          end: 2026,
          description: "Electronic devices were attached to scales by the 1940s and load cells became widespread in the late 20th century, giving digital bathroom, kitchen and supermarket scales and weighbridges for trucks and rail cars, while most countries regulate and certify scales used in trade.",
        },
      ],
    },
    {
      slug: "coin",
      name: "Coin",
      type: "invention",
      wiki: "Coin",
      description: "A small, standardised disc of metal minted as money, first in China and Lydia and now issued by almost every state.",
      metadata: { invented_date: "7th century BCE", place: "Lydia and Henan, China", field: "finance" },
      periods: [
        {
          label: "Bronze shells, spades and electrum",
          start: -1100,
          end: -481,
          description: "Late Bronze Age China cast bronze replicas of cowrie shells, a factory at Guanzhuang in Henan minted shovel-shaped bronze coins from 640 to 550 BC, and Lydia and Ionia struck the first electrum coins in the late 7th century BC. Croesus, who reigned from 560 to 546 BC, issued the first gold coins of standard purity and the first bimetallic currency, and Cyrus carried coinage into the Persian Empire.",
        },
        {
          label: "Coins of the classical empires",
          start: -480,
          end: 799,
          description: "Greek cities, the Achaemenid Persians, Indian states and Rome, whose first coins were cast bronzes of 289 BC, spread coinage from the Mediterranean to India, Alexander made the ruler's portrait standard, and Qin Shi Huang imposed round coins on all China at the end of the 3rd century BC.",
        },
        {
          label: "Pennies, florins and thalers",
          start: 800,
          end: 1799,
          description: "Charlemagne's silver penny, issued from 800, was Western Europe's only coin until 1200, and debasement by bishops, cities and lords left Venice's with 0.05 grams of silver by 1160. Florence's gold florin and Venice's sequin carried Mediterranean trade, the thaler became the ancestor of the dollar, and the Mexico City mint of 1535 struck the Spanish real.",
        },
        {
          label: "Fiat coins",
          start: 1800,
          end: 2026,
          description: "Coins became base-metal tokens whose value is set by law, circulating alongside banknotes and outlasting them by decades; when metal prices rose above face value they were melted or hoarded, and since 1982 the US penny has been 97.5 percent zinc.",
        },
      ],
    },
    {
      slug: "banknote",
      name: "Banknote",
      type: "invention",
      wiki: "Paper money",
      description: "Paper money payable to the bearer on demand, first issued in Tang and Song China and now printed by central banks.",
      metadata: { invented_date: "7th century", place: "Tang China", field: "finance" },
      periods: [
        {
          label: "Flying money and jiaozi",
          start: 618,
          end: 1259,
          description: "Tang merchants issued receipts of deposit to avoid carrying heavy strings of copper coins, and the Song issued jiaozi, the first generally circulating paper money, at a rate of 26 million strings of cash a year by the early 12th century. The state printed its own notes by woodblock from the 1120s, and its Hangzhou factory employed more than a thousand workers a day in 1175.",
        },
        {
          label: "Yuan notes and nota di banco",
          start: 1260,
          end: 1660,
          description: "The late Song issued a gold- or silver-backed national currency in 1265–1274, Kublai Khan's Jiaochao notes were later issued without time limits as specie ran short, and Italian and Flemish money traders turned registered promissory notes into the bearer nota di banco of the 14th century.",
        },
        {
          label: "Goldsmiths and banks of issue",
          start: 1661,
          end: 1832,
          description: "Stockholms Banco issued Europe's first central-bank notes in 1661 and went bankrupt three years later from overprinting, London goldsmith bankers' bearer receipts became the first modern banknotes, and the Bank of England issued notes from 1695 and the Bank of Scotland from 1696. The French Revolution's assignats soon collapsed in value.",
        },
        {
          label: "Central-bank notes",
          start: 1833,
          end: 2026,
          description: "Central banks took over note issue, and paper money printed without metal behind it fed hyperinflations: by 1922 a 1914 gold krone was worth 14,400 Austro-Hungarian paper kronen. Australia issued the first polymer banknote in 1988 and replaced all its paper notes by 1996, and bisphenol S, an endocrine disruptor absorbed through the skin, is now widely used in making banknotes.",
          wiki: "Banknote",
        },
      ],
    },
    {
      slug: "cheque",
      name: "Cheque",
      type: "invention",
      wiki: "Cheque",
      description: "A written order directing a bank to pay a sum from the drawer's account to a named payee.",
      metadata: { invented_date: "321–185 BCE", place: "Maurya India", field: "finance" },
      periods: [
        {
          label: "Adesha, sakk and bills of exchange",
          start: -321,
          end: 1499,
          description: "Maurya India's adesha ordered a banker to pay a third person, Persian banks issued čak letters of credit from the 3rd century AD that Abbasid traders used as the sakk and could cash abroad by the 9th century, and Ibn Hawqal recorded a cheque worth 42,000 dinars at Aoudaghost. Venice developed the bill of exchange in the 13th century.",
        },
        {
          label: "Cashiers and drawn notes",
          start: 1500,
          end: 1769,
          description: "Dutch cashiers paid depositors' written orders from the early 1500s, the Fula of Senegambia used cheques valued in cattle with European merchants and slave traders in the early 1600s, London's drawn notes survive from 1659, and the Bank of England printed cheque forms on fraud-resistant paper in 1717.",
        },
        {
          label: "Clearing houses and cheque books",
          start: 1770,
          end: 1958,
          description: "London bank clerks began daily clearing at the Five Bells tavern in 1770, the Bank of New York issued cheques from 1784, the Bank of England bound cheque books from 1830, and Britain's Bills of Exchange Act 1882 and the 1931 Geneva Convention codified cheque law.",
        },
        {
          label: "Machine clearing and decline",
          start: 1959,
          end: 2026,
          description: "Magnetic-ink characters agreed in 1959 let machines sort cheques, and billions were written a year until volumes peaked in the late 1980s and early 1990s, Britain's at four billion in 1990. Electronic payments then replaced them, UK cheque payments falling from 300 million to 78 million between 2020 and 2025, while cheques stayed open to kiting, forgery and identity theft.",
        },
      ],
    },
    {
      slug: "corporation",
      name: "Corporation",
      type: "invention",
      wiki: "Corporation",
      description: "A body of people recognised in law as a single person that can own property, make contracts and sue, and outlives its members.",
      metadata: { invented_date: "49–44 BCE", place: "Roman Republic", field: "law and business" },
      periods: [
        {
          label: "Collegia and medieval corporations",
          start: -49,
          end: 1599,
          description: "Under the Lex Julia of 49–44 BC Roman collegia approved by the Senate or emperor could own property, make contracts and sue, and medieval jurists revived the idea: churches and towns such as the City of London were incorporated, and the Stora Kopparberg mining community received a charter in 1347.",
        },
        {
          label: "Chartered companies",
          start: 1600,
          end: 1824,
          description: "Elizabeth I granted the East India Company a monopoly of eastern trade in 1600 and the Dutch East India Company issued tradable shares with limited liability, both serving as instruments of conquest and colonial rule. The South Sea Company's bubble burst in 1720, its shares falling from £1,000 to under £100.",
        },
        {
          label: "Registration and limited liability",
          start: 1825,
          end: 1899,
          description: "Britain repealed the Bubble Act in 1825, let ordinary people incorporate by registration under the Joint Stock Companies Act 1844 and granted limited liability in 1855, setting off a railway boom and then a wave of insolvencies. Germany created the GmbH in 1892, and New Jersey and Delaware passed enabling corporate laws in 1896 and 1899.",
        },
        {
          label: "Conglomerates and privatisation",
          start: 1900,
          end: 2026,
          description: "Holding companies, mergers and conglomerates built ever larger corporations while states passed antitrust laws, incorporation by registration spread worldwide, and privatisation from the 1980s enlarged corporations' political, social and economic power.",
        },
      ],
    },
  ],

  links: [
    // ---------- Farming ----------
    { from: "agriculture", to: "plough", type: "builds_on", share: 0.2, why: "The plough was made to till farm fields; the first appear in Uruk pictographs of 3000 BC, millennia after farming began." },
    { from: "agriculture", to: "irrigation", type: "builds_on", share: 0.3, why: "Irrigation came soon after the Neolithic Revolution, as farmers carried river water to crops on dry plains, first in Mesopotamia." },
    { from: "agriculture", to: "writing", type: "builds_on", share: 0.15, why: "Writing grew out of the Mesopotamian clay tokens used to count and trade farm produce, and its first uses recorded agricultural transactions." },
    { from: "agriculture", to: "silk", type: "builds_on", share: 0.1, why: "Silk comes from sericulture, silk farming: the rearing of domesticated silkworms on mulberry leaves." },
    { from: "agriculture", to: "rice-farming", type: "builds_on", share: 0.2, why: "Rice farming began within China's independent start of agriculture, when Yangtze farmers domesticated wild rice and developed wetland cultivation." },
    { from: "irrigation", to: "rice-farming", type: "builds_on", share: 0.1, why: "Paddy fields need large quantities of irrigation water, carried by canals such as those that feed the Banaue terraces." },
    { from: "rice-farming", to: "high-yielding-variety", type: "builds_on", share: 0.05, why: "IRRI bred IR8, the miracle rice of the Green Revolution, by crossing the rice varieties Dee-geo-woo-gen and Peta in 1962." },

    // ---------- Food and drink ----------
    { from: "agriculture", to: "bread", type: "builds_on", share: 0.25, why: "Bread became a staple with the domestication of wheat in the Fertile Crescent, though Natufian foragers baked flatbread from wild cereals thousands of years before farming." },
    { from: "cooking", to: "bread", type: "builds_on", share: 0.15, why: "Bread is dough cooked by heat, from the Natufians' hearth-baked flatbread to the tinuru and the oven loaf." },
    { from: "agriculture", to: "cheese", type: "builds_on", share: 0.3, why: "Cheesemaking needs domesticated milk animals; the earliest proposed dates for it begin at 8000 BCE, when sheep were first domesticated." },
    { from: "salt-making", to: "cheese", type: "builds_on", share: 0.05, why: "Salting preserves cheese: Columella's method of 65 CE salted the pressed curd before ageing it." },
    { from: "agriculture", to: "wine", type: "builds_on", share: 0.2, why: "Wine came with the domestication of the grapevine, as farmers selected self-pollinating Vitis vinifera after the shift to settled farming." },
    { from: "wine", to: "pasteurization", type: "builds_on", share: 0.05, why: "Pasteurization was devised to keep wine from souring: China heated wine to preserve it from 1117, and Pasteur's work of the 1860s began with wine." },
    { from: "agriculture", to: "noodle", type: "builds_on", share: 0.1, why: "Noodles are dough made from farmed grain, and Han China's wheat made them a prominent food." },
    { from: "cooking", to: "noodle", type: "builds_on", share: 0.1, why: "Noodles are made by boiling strips of dough in water, a method that began in China." },
    { from: "rice-farming", to: "noodle", type: "builds_on", share: 0.05, why: "Rice noodles, the fen of Chinese cooking, are made from rice flour rather than wheat dough." },
    { from: "water-well", to: "irrigation", type: "builds_on", share: 0.05, why: "Wells supply much irrigation water from groundwater, from the vertical wells of qanats to the pumped wells of the Ogallala Aquifer." },
    { from: "water-well", to: "salt-making", type: "builds_on", share: 0.05, why: "Sichuan's salt industry began when well technology was first applied to brine 2,250 years ago, and salt is still pumped from wells as brine." },

    // ---------- Money and commerce ----------
    { from: "weighing-scale", to: "coin", type: "builds_on", share: 0.1, why: "Coins were invented to simplify the weighing of bullion, carrying a standard weight of metal under a mint's stamp." },
    { from: "bronze", to: "coin", type: "builds_on", share: 0.1, why: "The first Chinese coins were cast bronze, from the bronze shells of Anyang to the spade coins of Guanzhuang, and Rome's first coins were heavy cast bronzes." },
    { from: "coin", to: "banknote", type: "builds_on", share: 0.2, why: "Paper money began as receipts for coin: Tang merchants avoided carrying heavy strings of copper cash, and early banknotes promised redemption in gold or silver coin." },
    { from: "paper", to: "banknote", type: "builds_on", share: 0.15, why: "Song China printed its notes on mulberry-bark paper in state paper-money factories, and banknotes have been printed on special paper since." },
    { from: "coin", to: "cheque", type: "builds_on", share: 0.1, why: "A cheque orders a banker to pay out deposited money, sparing merchants from carrying large quantities of gold and coin." },
    { from: "paper", to: "cheque", type: "builds_on", share: 0.05, why: "Cheques are written orders on paper, from the paper sakk of Abbasid traders to the Bank of England's cheque paper of 1717." },
  ],
};

/** Links to or from entries assigned to other batches (see MASTER LIST), merged later. */
export const crossLinksC: InventionsLink[] = [
  { from: "pottery", to: "cooking", type: "builds_on", share: 0.1, why: "Pottery for holding and boiling water expanded the techniques cooks could use." },
  { from: "pottery", to: "salt-making", type: "builds_on", share: 0.05, why: "Neolithic salt makers boiled brine in pans of briquetage, a coarse ceramic." },
  { from: "agriculture", to: "tractor", type: "builds_on", share: 0.1, why: "The tractor was built to mechanise farm work, tillage first, and from the 1923 Farmall it replaced draught animals." },
];
