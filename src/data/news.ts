export type Category = 'military' | 'economic' | 'diplomatic' | 'legislative' | 'spotlight';

export interface NewsDispatch {
  id: string;
  headline: string;
  dateline: string;
  date: string;
  category: Category;
  priority: 'breaking' | 'standard' | 'archival';
  classification: string;
  paragraphs: string[];
  author: string;
}

export const categoryColors: Record<Category, string> = {
  military: '#DC2626',
  economic: '#059669',
  diplomatic: '#D4AF37',
  legislative: '#7C3AED',
  spotlight: '#2563EB',
};

export const categoryLabels: Record<Category, string> = {
  military: 'Military',
  economic: 'Economic',
  diplomatic: 'Diplomatic',
  legislative: 'Legislative',
  spotlight: 'Town Spotlight',
};

export const dispatches: NewsDispatch[] = [
  {
    id: '001',
    headline: 'Imperial Coalition Declares State of Emergency Along Eastern Frontier',
    dateline: 'AURORA PRIME',
    date: 'June 14, 2026',
    category: 'military',
    priority: 'breaking',
    classification: 'FOR IMMEDIATE RELEASE',
    paragraphs: [
      'In a dramatic escalation of hostilities along the eastern frontier, the Imperial Coalition has formally declared a state of emergency across all territories bordering the Crimson Reach. The declaration, signed by Chancellor Aldric Voss at the Grand Chancellery this morning, grants emergency powers to regional governors and authorizes the mobilization of the Third and Fifth Legions.',
      'The decision follows three weeks of increasingly aggressive incursions by allied factions of the Crimson Reach into disputed border territories. Intelligence reports suggest that the construction of forward operating bases within the demilitarized zone has been underway since the previous lunar cycle.',
      '"We have exhausted all diplomatic avenues," Chancellor Voss stated in a brief address broadcast across the coalition\'s communication network. "The sovereignty of our member states will not be compromised by unilateral aggression. Let this serve as notice to all parties: the Coalition stands unified."',
      'Military analysts within the coalition estimate that full mobilization will require approximately seventy-two hours. Supply depots at Fort Meridian and Bastion Keep have reportedly been placed on high alert. Civilian populations in border settlements have been advised to prepare evacuation protocols.',
      'The Crimson Reach has yet to issue an official response. However, sources within their diplomatic corps suggest that a counter-declaration may be imminent. Observers note that this marks the most significant military escalation on the server in over four months.',
    ],
    author: 'Correspondent Elara Vex',
  },
  {
    id: '002',
    headline: 'Trade Consortium Announces Historic Tariff Reform Across Twelve Nations',
    dateline: 'PORT VERIDIAN',
    date: 'June 13, 2026',
    category: 'economic',
    priority: 'standard',
    classification: 'STATE DEPARTMENT COMMUNIQUÉ',
    paragraphs: [
      'The Intercontinental Trade Consortium has ratified a sweeping tariff reform agreement that will eliminate import duties on raw materials across twelve signatory nations, effective immediately. The accord, negotiated over six months at the Port Veridian Exchange Hall, represents the most significant economic liberalization in the server\'s recorded history.',
      'Under the terms of the agreement, member states will phase out all tariffs on iron ore, gold ingots, diamond, redstone, and enchanted materials over a period of thirty days. Agricultural goods, including wheat, carrots, and animal products, will see a fifty percent reduction in duties.',
      'Consortium Director Helena Ashford described the agreement as "a new era of prosperity built on mutual trust and shared prosperity." The reforms are expected to increase inter-nation trade volume by an estimated forty percent within the first quarter.',
      'Not all nations have signed the accord. The Northern Compact has expressed reservations, citing concerns about domestic market stability. Their representatives have requested a ninety-day review period before committing to the agreement.',
      'Market analysts predict that the reforms will particularly benefit smaller nations with abundant natural resources but limited manufacturing capacity. The free flow of raw materials is expected to spur construction booms in developing territories.',
    ],
    author: 'Economic Desk — Marcus Thorne',
  },
  {
    id: '003',
    headline: 'Republic of Solhaven Extends Formal Diplomatic Recognition to New Kingdom of Thalassia',
    dateline: 'SOLHAVEN CITY',
    date: 'June 12, 2026',
    category: 'diplomatic',
    priority: 'standard',
    classification: 'MINISTRY OF FOREIGN AFFAIRS DISPATCH',
    paragraphs: [
      'The Republic of Solhaven has formally extended diplomatic recognition to the newly established Kingdom of Thalassia, marking a significant shift in the regional balance of power. The recognition was conveyed through an official letter of credence delivered by Ambassador Corwin Dael to King Theron I at the Thalassian Royal Court.',
      'The Kingdom of Thalassia, proclaimed just three weeks ago by a coalition of maritime settlements along the Sapphire Coast, has rapidly established itself as a formidable naval power. Their fleet, reportedly numbering over forty vessels, controls key shipping lanes that connect the eastern and western continents.',
      '"Solhaven recognizes the sovereignty of Thalassia and looks forward to building a relationship based on mutual respect and shared maritime interests," Ambassador Dael stated during the formal ceremony at the Crystal Throne Hall.',
      'The recognition is expected to pave the way for a mutual defense pact and trade agreement between the two nations. Solhaven\'s merchant fleet will gain preferential access to Thalassian ports, while the Kingdom gains a powerful ally in continental diplomacy.',
      'Other nations are watching closely. The Commonwealth of Ashenmoor has indicated it may follow Solhaven\'s lead, while the Iron Confederacy has remained conspicuously silent on the matter.',
    ],
    author: 'Diplomatic Bureau — Isolde Crane',
  },
  {
    id: '004',
    headline: 'Grand Assembly Passes Landmark Digital Property Rights Act',
    dateline: 'CAPITOL NEXUS',
    date: 'June 11, 2026',
    category: 'legislative',
    priority: 'standard',
    classification: 'LEGISLATIVE RECORD — ACT NO. 47',
    paragraphs: [
      'The Grand Assembly has passed the Digital Property Rights Act by a vote of thirty-four to twelve, with six abstentions. The landmark legislation establishes comprehensive legal protections for player-built structures, terraformed landscapes, and automated redstone systems within recognized national territories.',
      'The Act defines three categories of protected property: sovereign structures (government buildings, fortifications, and public works), private holdings (residences, farms, and commercial establishments), and cultural heritage sites (monuments, memorials, and historically significant constructions).',
      'Under the new law, unauthorized destruction or modification of protected property within recognized territories will constitute an act of aggression, subject to sanctions determined by the Assembly\'s judicial committee. Repeat offenders may face expulsion from coalition territories.',
      'The legislation also creates a Digital Heritage Registry, administered by the Office of the Cartographer, which will maintain detailed records of all protected sites. Nations will have sixty days to submit their initial registries.',
      'Critics of the Act argue that it may complicate territorial disputes and limit military operations during declared conflicts. Proponents counter that clear property protections will encourage investment and long-term development across all member states.',
    ],
    author: 'Legislative Correspondent — Aldous Finch',
  },
  {
    id: '005',
    headline: 'The Floating City of Aethermere: Engineering Marvel of the Northern Reaches',
    dateline: 'AETHERMERE',
    date: 'June 10, 2026',
    category: 'spotlight',
    priority: 'standard',
    classification: 'FEATURE DISPATCH',
    paragraphs: [
      'Suspended three hundred meters above the frozen tundra of the Northern Reaches, the city of Aethermere stands as perhaps the most audacious construction project in the server\'s history. Connected to the surface by a single chain of enchanted platforms, this aerial settlement houses over two hundred citizens and serves as the capital of the Skyward Dominion.',
      'The city\'s chief architect, Master Builder Caelum Frost, spent four months designing the structural framework that supports Aethermere\'s weight. Using a combination of obsidian foundations, end rod lighting, and carefully positioned shulker boxes, the city achieves both stability and an ethereal aesthetic that has drawn visitors from across the known world.',
      '"Every block was placed with intention," Frost explained during a rare public tour. "The people of Aethermere believe that a city should not merely shelter its citizens—it should inspire them. To live among the clouds is to be reminded that there are no limits to what we can achieve."',
      'The city features a central marketplace, a grand library containing over three thousand written volumes, residential quarters arranged in concentric rings, and a defensive perimeter of end crystal arrays capable of repelling aerial assault. The Skyward Dominion\'s navy, composed of elytra-equipped pilots, operates from hangars at the city\'s cardinal points.',
      'Despite its remote location, Aethermere has become a hub of diplomatic activity. Its neutral airspace and strategic altitude have made it a preferred venue for high-stakes negotiations between rival factions.',
    ],
    author: 'Special Correspondent — Rowan Ashby',
  },
  {
    id: '006',
    headline: 'Coalition Intelligence Reports Unusual Naval Movements in the Cerulean Straits',
    dateline: 'FORT MERIDIAN',
    date: 'June 9, 2026',
    category: 'military',
    priority: 'breaking',
    classification: 'FOR IMMEDIATE RELEASE — SECURITY ADVISORY',
    paragraphs: [
      'Coalition Intelligence Command has issued a security advisory following the detection of significant naval movements through the Cerulean Straits, a critical waterway connecting the Inner Sea to the Open Ocean. At least fifteen warships, flying unidentified colors, were observed transiting the strait under cover of darkness.',
      'The vessels, described as large galleons with reinforced hulls and mounted cannon positions, were tracked by coalition observation posts on the Windward Isles before disappearing beyond the horizon to the southwest. Naval analysts believe they may be headed for the uncharted waters beyond the Cartographer\'s Limit.',
      'Coalition Admiral Petra Stormwind has ordered increased patrols along the southern maritime border and has placed the Second Fleet on heightened readiness. "We are monitoring the situation closely," Admiral Stormwind stated. "Any unauthorized vessel entering coalition waters will be intercepted and identified."',
      'The incident has raised concerns about potential violations of the Maritime Sovereignty Accords, which require all nations to declare naval movements through shared waterways. If the unidentified fleet belongs to a foreign power, their failure to declare transit could constitute a diplomatic incident.',
      'The coalition has formally requested information from all signatory nations regarding the origin and destination of the vessels. Responses are expected within forty-eight hours.',
    ],
    author: 'Military Desk — Captain Dorian Vale',
  },
  {
    id: '007',
    headline: 'Emerald Standard Stabilizes as Central Bank Announces New Reserve Policy',
    dateline: 'GILDED HARBOR',
    date: 'June 8, 2026',
    category: 'economic',
    priority: 'standard',
    classification: 'CENTRAL BANK OFFICIAL NOTICE',
    paragraphs: [
      'The Central Bank of the Gilded Harbor has announced a new reserve policy designed to stabilize the Emerald Standard—the server\'s de facto currency—after weeks of volatility driven by speculative trading and resource hoarding. The policy establishes a minimum reserve ratio of thirty percent for all chartered banking institutions.',
      'Under the new rules, banks must maintain emerald reserves equal to at least thirty percent of their outstanding deposit liabilities. Institutions found in violation will face progressive penalties, including suspension of their banking charters and seizure of assets.',
      'The announcement came as the exchange rate between emeralds and traded goods reached its most stable level in two months. A stack of iron ingots, which peaked at twelve emeralds during the crisis, has settled at approximately seven emeralds—still elevated by historical standards but showing signs of normalization.',
      'Central Bank Governor Thaddeus Goldmere called the new policy "a necessary step to restore confidence in our financial system." He emphasized that the bank stands ready to provide liquidity to solvent institutions facing temporary shortfalls.',
      'The reforms have been broadly welcomed by the merchant community, though some smaller banking operations have expressed concern about the compliance burden. The Bank has announced a sixty-day grace period before full enforcement begins.',
    ],
    author: 'Economic Desk — Sylvia Penn',
  },
  {
    id: '008',
    headline: 'Peace Talks Resume Between Ashenmoor and the Iron Confederacy After Month-Long Hiatus',
    dateline: 'NEUTRAL GROUND — THE OBSIDIAN TABLE',
    date: 'June 7, 2026',
    category: 'diplomatic',
    priority: 'standard',
    classification: 'UNITED NATIONS MEDIATION SERVICE',
    paragraphs: [
      'Diplomatic negotiations between the Commonwealth of Ashenmoor and the Iron Confederacy have resumed at the Obsidian Table, the neutral mediation ground maintained by the United Nations of Diplomatica. The talks, which broke down last month over territorial disputes in the Grey Marches, have been reconvened under the facilitation of Ambassador Seraphina Lux.',
      'The primary sticking point remains control of the Grey Marches, a resource-rich borderland claimed by both nations. Ashenmoor bases its claim on historical settlement dating to the server\'s founding era, while the Iron Confederacy points to military control established during the March Conflict of the previous year.',
      'Ambassador Lux has proposed a novel solution: the establishment of a jointly-administered free trade zone within the disputed territory, with sovereignty questions deferred to international arbitration. Both delegations have expressed cautious interest in the proposal.',
      '"The stakes are too high for either side to walk away," Ambassador Lux told reporters outside the mediation chamber. "These two nations share a border that stretches across an entire continent. Their future must be one of coexistence, not perpetual conflict."',
      'The next session is scheduled for three days hence. Observers note that the presence of coalition peacekeepers along the Grey Marches border has reduced the risk of accidental escalation while talks proceed.',
    ],
    author: 'Diplomatic Bureau — Cassian Wren',
  },
];

export const breakingHeadlines = dispatches
  .filter(d => d.priority === 'breaking')
  .map(d => `⚡ ${d.headline}`);

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE DATA FETCHING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch dispatches from the live news.json file
 * Falls back to hardcoded data if fetch fails
 */
export async function fetchDispatches(): Promise<NewsDispatch[]> {
  try {
    const response = await fetch('./news.json');
    if (!response.ok) throw new Error('Failed to fetch news.json');
    
    const data = await response.json();
    
    // If we have live data, use it; otherwise fall back to hardcoded
    if (data.dispatches && data.dispatches.length > 0) {
      // Map live data to match our interface
      return data.dispatches.map((d: any) => ({
        id: d.id,
        headline: d.headline,
        dateline: d.dateline,
        date: d.date,
        category: d.category as Category,
        priority: d.priority as 'breaking' | 'standard' | 'archival',
        classification: d.classification,
        paragraphs: d.paragraphs,
        author: d.author,
        source: d.source,
        messageUrl: d.messageUrl,
        timestamp: d.timestamp,
        images: d.images,
      }));
    }
    
    // Fall back to hardcoded data
    return dispatches;
  } catch (error) {
    console.warn('Failed to fetch live dispatches, using hardcoded data:', error);
    return dispatches;
  }
}
