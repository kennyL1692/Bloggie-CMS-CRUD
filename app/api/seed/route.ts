import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function slug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const IMG = {
  klcc:      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
  tech:      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  startup:   "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  fintech:   "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
  mobile:    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
  food:      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  design:    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
  payment:   "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1200&q=80",
  ecommerce: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
  office:    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  coding:    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  data:      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  culture:   "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
  bank:      "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&q=80",
  remote:    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80",
  qr:        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
  packaging: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
  creative:  "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?auto=format&fit=crop&w=1200&q=80",
  halal:     "https://images.unsplash.com/photo-1564671165093-20688ff1fffa?auto=format&fit=crop&w=1200&q=80",
  mrt:       "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
}

const POSTS = [
  // ── TECHNOLOGY (10 posts) ─────────────────────────────────────────────────
  {
    title: "Malaysia's MyDigital Blueprint: What It Actually Means for Tech Workers",
    excerpt: "The government's RM70 billion digital economy roadmap is one of the most ambitious in ASEAN. But what does it mean on the ground for developers, designers, and tech entrepreneurs?",
    image: IMG.klcc,
    category: "Technology",
    tags: ["malaysia-tech", "digital-economy"],
    content: `<h2>The Blueprint in Plain Language</h2>
<p>Launched in 2022, Malaysia's MyDigital Blueprint is a five-year roadmap targeting a 22.6% digital economy contribution to GDP by 2025. In concrete terms, this means government investment in cloud infrastructure, digital skills training, e-government services, and incentives for high-tech investment into the country. For the tech industry, it translates into genuine tailwinds: more government contracts, a more digitally capable workforce, and a policy environment that takes the sector seriously.</p>
<p>The blueprint sits under the Malaysia Digital Economy Corporation (MDEC), which acts as the primary government body facilitating digital investments. MDEC's role ranges from attracting global tech companies to set up regional headquarters in Malaysia, to running the Malaysia Digital (MD) Status — the successor to MSC Malaysia status — which offers fiscal incentives, talent mobility support, and IP protection for qualifying companies.</p>
<h2>What the Numbers Look Like</h2>
<p>By mid-2024, the digital economy represented approximately 23% of GDP — slightly ahead of target. The ICT sector employs around 500,000 workers, with the government targeting over 800,000 by 2025. Government-linked entities like TM, TNB, and Petronas have each committed to digital transformation initiatives worth billions of ringgit, creating large-scale procurement opportunities for Malaysian tech companies and consultancies.</p>
<p>For individual tech workers, the practical effect is a tighter talent market and rising salaries. Senior engineers, cloud architects, and data scientists command packages that were unthinkable five years ago. The caveat is that much of this growth is concentrated in Kuala Lumpur and the Klang Valley — digital opportunity in East Malaysia and smaller peninsular cities remains significantly more limited.</p>
<h2>The Gaps Worth Watching</h2>
<p>No government blueprint survives contact with implementation perfectly. Malaysia's digital push faces three recurring challenges: a brain drain of senior tech talent to Singapore and beyond, slow bureaucratic processes that frustrate foreign investors, and a mismatch between the skills universities produce and what the industry needs. Coding bootcamps and industry certifications have partially filled this gap, but the structural issue of curriculum relevance in public universities remains unresolved. The blueprint is directionally right — the execution will determine whether Malaysia achieves its ambitions or watches the opportunity shift further south.</p>`,
  },
  {
    title: "Cyberjaya at 25: Has Malaysia's Silicon Valley Dream Come True?",
    excerpt: "Malaysia's purpose-built tech city was envisioned to be Southeast Asia's Silicon Valley. A quarter century later, the reality is more nuanced — and more interesting — than either the optimists or critics predicted.",
    image: IMG.tech,
    category: "Technology",
    tags: ["malaysia-tech", "digital-economy"],
    content: `<h2>The Original Vision</h2>
<p>When Tun Mahathir unveiled the Multimedia Super Corridor in 1996, Cyberjaya was its crown jewel — a planned city built from scratch to house the world's technology companies and grow Malaysia's digital economy. The pitch was compelling: world-class infrastructure, tax incentives via MSC Malaysia status, and a government committed to not censoring the internet (a promise enshrined in the Bill of Guarantees). Global companies including Microsoft, Dell, Ericsson, and Shell set up operations. The optimism was real.</p>
<p>Twenty-five years on, Cyberjaya is home to over 1,000 companies and houses a significant portion of Malaysia's BPO, shared services, and tech industries. It is not Silicon Valley. It is also not a failure — and understanding the difference matters for anyone building or working in Malaysian tech.</p>
<h2>What Cyberjaya Became</h2>
<p>The city found its groove as a hub for global business services and shared services centers (SSCs). Companies like HSBC, Cognizant, DHL, and Motorola Solutions run regional or global operations from Cyberjaya, attracted by the talent pool from nearby universities (Multimedia University, LimKokWing, Cyberjaya University College) and the operational cost advantages versus Singapore or regional alternatives.</p>
<p>For Malaysian tech workers, Cyberjaya represents stable, MNC-adjacent employment with international exposure — often a stepping stone to more senior roles at headquarters or regional offices elsewhere. The startup density never materialised as hoped; most of Malaysia's homegrown tech companies chose KL's Bangsar South, PJ, or Mid Valley over Cyberjaya's planned suburb aesthetic.</p>
<h2>The Honest Assessment</h2>
<p>Cyberjaya succeeded as infrastructure but underdelivered as an innovation ecosystem. It built the roads, the connectivity, and the office parks — but not the density of talent, capital, and ambition that makes places like Singapore's one-north or Bangalore's Electronic City genuinely generative. The lesson isn't that planned tech cities don't work; it's that the ecosystem components matter more than the real estate. What Cyberjaya got right was the long game: 25 years of hosting global operations has built a genuine workforce with international experience that is now seeding Malaysian startups with people who know how scale looks from the inside.</p>`,
  },
  {
    title: "How Grab Started From Malaysia — And What Founders Can Learn From It",
    excerpt: "Anthony Tan pitched Grab (then MyTeksi) at a Harvard Business School competition in 2011. Twelve years later it's a NASDAQ-listed superapp serving 700 cities across eight countries. The Malaysian origin story matters more than most people remember.",
    image: IMG.startup,
    category: "Technology",
    tags: ["malaysia-tech", "startup"],
    content: `<h2>The Problem That Started Everything</h2>
<p>Anthony Tan grew up in a family with deep roots in the Malaysian automotive industry — his grandfather founded Tan Chong Motor. He understood cars, but the problem he noticed was simpler: women in Malaysia didn't feel safe taking taxis. His mother's complaints about unreliable, occasionally threatening cab experiences became the seed of a business idea. Safety, predictability, and accountability — three things street-hailing could never guarantee — became Grab's founding proposition.</p>
<p>The Harvard Business School New Venture Competition in 2011 gave Tan and co-founder Tan Hooi Ling a platform and $25,000 in prize money. They launched MyTeksi in Malaysia in 2012 with six drivers. Within months, they had signed up hundreds of drivers and processed tens of thousands of rides. The product-market fit was immediate and visceral — it solved a real, daily pain point that millions of Malaysians experienced.</p>
<h2>Why Malaysia First Made Sense</h2>
<p>Launching in Malaysia rather than a more obvious market like Singapore or Indonesia turned out to be strategically smart. Malaysia's fragmented taxi regulatory environment, mixed urban-suburban geography, and multi-ethnic market with multiple payment preferences meant that solving Malaysia was genuinely hard. A startup that could crack Malaysian complexity was one that understood the messy realities of Southeast Asia rather than just its most sanitised market.</p>
<p>The fundraising journey was equally instructive. Tan famously approached hundreds of investors before getting his first meaningful check. Vertex Ventures and others eventually came in, and Tiger Global's investment in 2014 signalled the regional inflection point. The company rebranded from MyTeksi to GrabTaxi, then to Grab — each rebrand tracking an expansion in ambition and product scope.</p>
<h2>The Founder's Lesson</h2>
<p>Grab's story contains a lesson that Malaysian founders often overlook: the best market to start in is not necessarily the biggest or the most prestigious — it's the one you understand deeply and where you can iterate quickly. Tan didn't move to Silicon Valley to build Grab. He stayed close to the problem, the customers, and the regulatory reality of Southeast Asia. That local context, combined with world-class execution and fundraising, built something that Silicon Valley money alone couldn't have created from the outside.</p>`,
  },
  {
    title: "Malaysia's 5G Rollout: What's Actually Available and Where",
    excerpt: "Malaysia took a unique single wholesale network approach to 5G. Here's a ground-level look at what coverage actually looks like, what speeds you can expect, and what the Digital Nasional Berhad (DNB) model means for consumers.",
    image: IMG.mobile,
    category: "Technology",
    tags: ["malaysia-tech", "digital-economy"],
    content: `<h2>The DNB Model Explained</h2>
<p>Malaysia chose an unusual path for 5G deployment: a single wholesale network operated by Digital Nasional Berhad, a government-owned entity. Rather than having each telco build its own 5G infrastructure — as happened with 4G — all operators access the same DNB-built network and compete at the service layer. The rationale was to avoid duplicated infrastructure spending and accelerate nationwide coverage. The controversy was immediate: telcos initially resisted, concerned about losing control of a strategic asset.</p>
<p>After prolonged negotiations, the major telcos (Maxis, Celcom Digi, U Mobile, TM) took equity stakes in DNB in 2023, aligning incentives. By mid-2024, DNB reported 5G population coverage exceeding 80% in major urban areas. The Klang Valley, Johor Bahru, Penang, and Kota Kinabalu have the densest coverage. Rural and East Malaysian coverage remains limited, consistent with global 5G rollout patterns.</p>
<h2>Real-World Speeds and Experience</h2>
<p>In well-covered urban areas, Malaysian 5G delivers peak download speeds between 300–900 Mbps on sub-6GHz spectrum, with latency improvements over 4G LTE that matter most for applications like mobile gaming, video calling, and connected devices. The mmWave spectrum — which delivers the multi-gigabit speeds in 5G marketing — has not been deployed at scale anywhere in Malaysia, which is consistent with most markets globally.</p>
<p>The practical experience for most consumers in 2025 is that 5G is noticeably faster than 4G in covered areas, but the transformative applications — autonomous vehicles, smart factories, remote surgery — are still more roadmap than reality. For developers building mobile applications, 5G's consistent low latency is increasingly relevant for real-time features that previously required WiFi.</p>
<h2>What It Means for Businesses</h2>
<p>The most immediate business impact of 5G in Malaysia is in industrial and enterprise applications. Proton and Perodua plants are piloting 5G-connected quality control systems. Port Klang's smart port initiative uses 5G for container tracking and crane automation. For SMEs, the more relevant near-term development is the improved network reliability that comes as operators upgrade backhaul and core infrastructure alongside the 5G rollout — even 4G performance has improved in many areas as a byproduct.</p>`,
  },
  {
    title: "The Malaysian Developer Scene in 2025: Salaries, Stacks, and Opportunities",
    excerpt: "Malaysian developers are in higher demand — and earning more — than at any point in the country's tech history. Here's a clear-eyed look at where salaries stand, which skills command premiums, and how the scene compares regionally.",
    image: IMG.coding,
    category: "Technology",
    tags: ["malaysia-tech", "programming"],
    content: `<h2>Where Salaries Actually Stand</h2>
<p>Malaysian developer salaries have risen significantly over the past five years, driven by regional demand and post-pandemic normalisation of remote work. A mid-level software engineer (3–5 years experience) in Kuala Lumpur now commands RM 7,000–12,000 per month at local companies, with MNCs and well-funded startups paying RM 12,000–18,000 for the same profile. Senior engineers and tech leads at the right companies break RM 20,000–25,000 — figures that would have been exceptional a decade ago.</p>
<p>The caveat is the persistent Singapore gap. The same engineer working remotely for a Singapore company or relocating there earns 2–3× more in SGD terms. Brain drain remains a real structural issue. Malaysia retains talent through lifestyle factors (family ties, lower cost of living, culture), but the economic pull of Singapore and increasingly of European remote roles is significant and growing.</p>
<h2>Which Stacks Command the Premium</h2>
<p>Across Malaysian job listings, the highest-paying technical roles cluster around cloud infrastructure (AWS, Azure, GCP certified engineers), data engineering and ML engineering, mobile development (React Native, Flutter), and full-stack TypeScript/React. Legacy Java and .NET skills remain in demand for banking and government sector work, often paying more than their hype-cycle equivalents due to the scarcity of experienced practitioners willing to work in regulated environments.</p>
<p>Cybersecurity has become a rapidly growing area. Bank Negara's Risk Management in Technology (RMiT) framework and the proliferation of digital banking licences have driven serious demand for security engineers, penetration testers, and compliance-oriented architects. This is a career path that has gone from niche to genuinely competitive in under five years.</p>
<h2>The Remote Work Variable</h2>
<p>Perhaps the most significant change to the Malaysian developer market is normalised remote work for foreign employers. A Malaysian engineer billing in USD or SGD while living in KL or Penang achieves purchasing power that significantly exceeds what local employers can offer. This arbitrage is conscious and growing — and it is gradually exerting upward pressure on local salaries as employers compete to retain people who now have a real alternative. For the individual engineer, developing skills valuable to international markets while maintaining a Malaysian cost base is the most powerful career move available right now.</p>`,
  },
  {
    title: "Malaysia's National AI Roadmap: Ambition vs Ground Reality",
    excerpt: "The government has committed to making Malaysia an AI-ready nation by 2030. Here's what the roadmap actually contains, where the genuine progress is, and where the gaps remain painfully obvious.",
    image: IMG.data,
    category: "Technology",
    tags: ["malaysia-tech", "digital-economy"],
    content: `<h2>What the NAIF Roadmap Says</h2>
<p>Malaysia's National Artificial Intelligence Framework (NAIF) was released in 2021, followed by sector-specific AI action plans covering healthcare, manufacturing, agriculture, and finance. The overarching targets include producing 25,000 AI practitioners by 2025, attracting RM 18 billion in AI-related investments, and positioning Malaysia as a regional AI hub. The Ministry of Science, Technology and Innovation (MOSTI) is the primary coordinating body, with MDEC handling the industry facilitation piece.</p>
<p>On paper, the framework is comprehensive. It addresses talent development, data governance, infrastructure investment, ethical AI principles, and sectoral application roadmaps. The quality of the policy thinking is genuinely good — Malaysia has benefited from exposure to international best practices and has avoided some of the more naive approaches seen in comparable economies.</p>
<h2>Where the Progress Is Real</h2>
<p>In manufacturing, AI adoption has been substantial. Penang's electronics manufacturing cluster — home to Intel, Bosch, Motorola, and dozens of Malaysian component suppliers — has been incorporating machine vision, predictive maintenance, and process optimisation AI tools for several years. This is quiet, unglamorous industrial AI that doesn't make headlines but meaningfully improves output and margins.</p>
<p>In financial services, Bank Negara's regulatory sandbox has allowed banks and fintechs to test AI-driven credit scoring, fraud detection, and customer service applications. CIMB, Maybank, and RHB have all deployed AI in customer-facing and back-office processes. The AI here isn't cutting-edge by global standards, but it's real and in production.</p>
<h2>Where the Gaps Are Obvious</h2>
<p>The talent gap is the most significant constraint. Malaysia does not yet have a deep pool of experienced ML engineers, AI researchers, or data scientists. Universities have added AI curricula, but graduating students often lack the practical skills employers need, and the senior talent pipeline depends heavily on Malaysians trained abroad who may not return. Without addressing brain drain and building genuine research capability — ideally through university-industry collaboration and competitive research grants — Malaysia risks being an AI user rather than an AI maker, consuming tools built elsewhere rather than contributing to the frontier.</p>`,
  },
  {
    title: "Cloud Adoption Among Malaysian SMEs: Where We Are and What's Holding Us Back",
    excerpt: "Malaysian SMEs account for 97% of all businesses and 38% of GDP. Their adoption of cloud tools will determine whether Malaysia's digital economy ambitions reach the broad economy or stay concentrated in large companies.",
    image: IMG.office,
    category: "Technology",
    tags: ["malaysia-tech", "digital-economy"],
    content: `<h2>The Current Adoption Landscape</h2>
<p>Surveys by MDEC and the SME Corporation consistently show that while awareness of cloud computing is high among Malaysian SME owners, adoption beyond basic tools (email, WhatsApp Business, Google Workspace) remains low. Adoption of more sophisticated cloud services — cloud-based accounting, CRM, inventory management, or custom applications — is concentrated among the larger end of the SME spectrum and in sectors like retail, F&B, and professional services that have felt the competitive pressure most acutely.</p>
<p>The pandemic was a significant accelerator. SMEs that had no digital presence or cloud tools struggled to survive 2020–2021. Many adopted basic e-commerce capabilities, digital payment solutions, and cloud accounting tools out of necessity. The question is whether this adoption is sticky — whether businesses that went digital under duress maintain and deepen their digital operations in calmer conditions. Early evidence suggests mixed results: some businesses have deepened their digital engagement, others have reverted to manual processes as the urgency faded.</p>
<h2>The Barriers Worth Addressing</h2>
<p>Three barriers consistently appear in research on Malaysian SME cloud adoption: cost perception, cybersecurity concerns, and capability gaps. Cost perception is often inaccurate — business owners overestimate the cost of cloud tools and underestimate the true cost of manual processes. Cybersecurity concerns are legitimate but disproportionate — the security of cloud platforms typically far exceeds what an SME could achieve with local servers and manual processes.</p>
<p>Capability gaps are the most structural barrier. Many SME owners and their staff lack the digital literacy to evaluate, procure, and implement cloud tools effectively. Government initiatives like SME Corp's digitalisation grants and MDEC's SME Technology Transformation Fund partially address this through subsidised consulting and tool costs. The missing piece is practical, hands-on training that goes beyond awareness to actual implementation support.</p>
<h2>The Opportunity for Builders</h2>
<p>For Malaysian software developers and product builders, the SME segment represents enormous unrealised opportunity. The market is large, underserved, and increasingly motivated. Products that solve specific SME pain points in Bahasa Malaysia, support QR payment integration natively, and offer pricing in the RM 50–200/month range have a genuinely receptive audience. The challenge is distribution — reaching SME decision-makers through channels they trust, which often means industry associations, trade shows, and word of mouth rather than digital acquisition funnels.</p>`,
  },
  {
    title: "Why International Tech Companies Keep Choosing Malaysia for Regional Hubs",
    excerpt: "Kuala Lumpur has quietly become one of the preferred locations for technology companies establishing Southeast Asian or Asia-Pacific operations. Here's the honest case for why — and the real limitations that don't appear in the pitch decks.",
    image: IMG.klcc,
    category: "Technology",
    tags: ["malaysia-tech", "digital-economy"],
    content: `<h2>The Real Advantages</h2>
<p>Malaysia's pitch to international technology companies rests on four genuine advantages: English language proficiency at a high level across the professional workforce, a multilingual talent pool that covers Malay, Mandarin, Tamil, and English natively, operational costs significantly lower than Singapore while maintaining comparable infrastructure quality, and a government that actively courts tech investment with meaningful incentives through the Malaysia Digital programme.</p>
<p>The cost advantage over Singapore is the most quantifiable. Office space in KLCC costs roughly a quarter of equivalent space in Singapore's CBD. Mid-level engineer salaries are 40–60% lower. Expat packages for relocating staff are manageable rather than eye-watering. For companies building regional operations centres, customer support hubs, or engineering offices, the arbitrage is real and significant.</p>
<h2>The Companies That Have Chosen KL</h2>
<p>The list of international technology companies with meaningful Malaysia operations is longer than most people outside the industry realise. Expedia, Agoda, and Booking Holdings have engineering and operations teams in KL. Accenture, Deloitte Digital, and PwC run large delivery centres. Shopee's parent Sea Group has engineering capacity in Malaysia. ByteDance, TikTok's parent, has a significant KL office. In semiconductors, Intel and Infineon have operated major Malaysian facilities for decades, and the supply chain around them has matured into a genuine electronics manufacturing cluster.</p>
<h2>The Limitations That Matter</h2>
<p>The honest version of Malaysia's tech hub story includes its limitations. Visa and work permit processing for foreign talent is slower and less flexible than Singapore's, making it harder to staff up quickly with international hires. The local senior technical talent pool is shallower — experienced technical leaders are harder to find and attract than in Singapore or India. Infrastructure outside major urban areas is inconsistent. And the political environment, while stable, has shown periodic uncertainty that gives some conservative corporate HQs pause. Malaysia wins on cost and quality of life; it competes less successfully on speed, regulatory sophistication, and talent density at the senior end.</p>`,
  },
  {
    title: "Building Apps for the Malaysian Market: A Practical Guide",
    excerpt: "Malaysia's 33 million population is mobile-first, multilingual, and diverse in its payment preferences and connectivity expectations. Building for this market requires design and technical decisions you won't find in Western startup playbooks.",
    image: IMG.mobile,
    category: "Technology",
    tags: ["malaysia-tech", "programming"],
    content: `<h2>Mobile First Means Something Different Here</h2>
<p>Ninety-six percent of Malaysians who access the internet do so via smartphone. Unlike in markets where mobile-first is a design philosophy layered on top of a desktop-first web, Malaysia is a market where many users have never had a meaningful desktop computing experience at all. This changes fundamental assumptions about your product. Navigation must work with one thumb. Data should load gracefully on 4G connections that drop to 3G in elevators and rural areas. Offline states need graceful handling, not error screens.</p>
<p>Battery optimisation matters here more than in developed markets. Users in Malaysia are sensitive to apps that drain battery — it shows up in Play Store and App Store reviews, and it translates directly to uninstalls. Background data usage is also a concern given that many users are still on prepaid data plans with caps. Building a light, efficient app is not just a nice-to-have; it's a competitive requirement.</p>
<h2>The Language and Localisation Reality</h2>
<p>Malaysia has four official and widely used languages: Bahasa Malaysia, English, Mandarin (multiple dialects, with Mandarin as the written standard), and Tamil. Most urban Malaysians code-switch between Bahasa and English constantly — the informal term is Manglish. For a mass-market consumer app, supporting Bahasa Malaysia as the primary language with full English support is the baseline. Mandarin localisation is important for reaching Chinese-Malaysian communities effectively, particularly for apps in finance, e-commerce, or anything adjacent to the significant Chinese-Malaysian business community.</p>
<h2>Payments Are Non-Negotiable</h2>
<p>Do not launch a Malaysian consumer app without DuitNow QR support. The Real-time Retail Payments Platform (RPP), which powers DuitNow, has achieved extraordinary adoption — most Malaysians use QR code payments daily, and many have payment apps from multiple providers. Beyond QR, you need to support major e-wallets (Touch 'n Go, GrabPay, Boost) and FPX (the direct bank transfer gateway that all Malaysian banks support). Credit card penetration is lower than comparable markets; designing your payment flow around cards as the primary method will cost you conversions. Build payment into your app as a core feature, not an afterthought.</p>`,
  },
  {
    title: "The State of Cybersecurity in Malaysia: Threats, Regulations, and Opportunities",
    excerpt: "Malaysia's digital growth has expanded its attack surface significantly. From ransomware attacks on government agencies to data breaches at financial institutions, the cybersecurity challenge is urgent — and creating significant demand for skilled practitioners.",
    image: IMG.tech,
    category: "Technology",
    tags: ["malaysia-tech", "digital-economy"],
    content: `<h2>The Threat Landscape</h2>
<p>CyberSecurity Malaysia, the government agency responsible for cybersecurity, reported over 9,000 cybersecurity incidents in 2023 — an increase of 17% over the previous year. Phishing remains the most common attack vector, exploiting both consumer unfamiliarity with digital security hygiene and the rapid growth of e-commerce and digital banking that has expanded the surface area for credential theft. Ransomware attacks on government agencies and healthcare institutions have escalated; several hospital systems and municipal councils have been affected in incidents that received limited public attention despite their operational severity.</p>
<p>The Personal Data Protection Act (PDPA), now being significantly revised for the first time since its 2010 enactment, is bringing Malaysian data protection requirements closer to GDPR standards. The amendments include mandatory breach notification within 72 hours of discovery, data portability rights, and increased penalties. For any organisation handling personal data — which includes virtually every Malaysian technology company — compliance is no longer optional theatre.</p>
<h2>The Regulatory Push</h2>
<p>Bank Negara Malaysia's Risk Management in Technology (RMiT) framework is among the most comprehensive banking cybersecurity regulation in ASEAN. It mandates specific controls across infrastructure security, access management, incident response, and technology risk governance. The practical effect is that banks and their technology vendors operate under a compliance framework that is detailed, regularly updated, and actively supervised. For technology companies building for or with Malaysian financial institutions, understanding RMiT is a prerequisite.</p>
<h2>The Career Opportunity</h2>
<p>Malaysia faces a significant shortage of cybersecurity professionals — estimated at over 10,000 unfilled positions. This shortage, combined with the regulatory push, has created a market where cybersecurity skills command salary premiums across industries. Penetration testers, security engineers, security operations centre (SOC) analysts, and GRC (governance, risk, compliance) specialists are in acute demand. For developers looking to specialise in a field with strong fundamentals and durable demand, cybersecurity offers a compelling path that requires continuous learning but rewards it generously.</p>`,
  },

  // ── STARTUP / BUSINESS (10 posts) ─────────────────────────────────────────
  {
    title: "From Mamak Table to VC Funding: The Honest Guide to Starting Up in Malaysia",
    excerpt: "Malaysia has a growing startup ecosystem — but it operates differently from Silicon Valley or Singapore. Understanding the local funding landscape, cultural dynamics, and support structures will save you years of misdirected effort.",
    image: IMG.startup,
    category: "Business",
    tags: ["startup", "entrepreneurship"],
    content: `<h2>The Malaysian Funding Landscape</h2>
<p>Malaysia's startup funding ecosystem is anchored by several key institutions. Cradle Fund, a government-backed seed fund under MDEC, provides grants up to RM 500,000 through its CIP programmes for early-stage tech companies. The Collaborative Research in Engineering, Science and Technology (CREST) fund supports deep tech and R&D. PNB, Khazanah, and other GLCs have corporate venture arms that invest in growth-stage Malaysian companies. Private VC activity has grown — Gobi Partners, Vynn Capital, Antler, and 500 Global all run active Malaysia programmes — but the cheque sizes and risk appetite remain more conservative than Singapore counterparts.</p>
<p>The practical reality for Malaysian founders in the seed stage is that government grants and angel investment are more accessible than institutional VC. Grants are non-dilutive (you don't give up equity), but they come with reporting requirements, spending restrictions, and approval processes that can be slow. Building a fundable company in Malaysia often means a hybrid path: government grant to prove concept, angel round to accelerate, regional VC for Series A if the traction is there.</p>
<h2>The Cultural Dynamics That Matter</h2>
<p>Malaysian business culture places significant weight on relationships, seniority, and face. Cold outreach to investors, potential partners, or enterprise customers is less effective here than in markets where transactional directness is the norm. Warm introductions matter enormously. The ecosystem is small enough that your reputation as a founder precedes you — how you treat early employees, whether you deliver on commitments to investors, how you handle failure all circulate through the network quickly.</p>
<p>Building relationships in the Malaysian tech ecosystem happens primarily through events (Sidec's Malaysia Tech Month, MDEC-organised events, and community-organised meetups in KL's Bangsar South and PJ areas), and increasingly through LinkedIn and the various WhatsApp groups that function as informal information channels. Show up consistently. Contribute knowledge generously. The returns are not immediate but they are real.</p>
<h2>The Unfair Advantage of Local Context</h2>
<p>The best opportunity for Malaysian founders is in problems that are specific to Malaysia or Southeast Asia — problems that Silicon Valley companies haven't solved and won't prioritise because the market is too unfamiliar. Halal supply chain verification, multi-language customer service automation for Malaysian SMEs, regulatory technology for Bank Negara compliance, Islamic finance software — these are areas where local knowledge is a genuine moat rather than a consolation prize. Build for the market you understand deeply before worrying about how to tell the story to American VCs.</p>`,
  },
  {
    title: "Carsome: How Malaysia Built Its First Automotive Unicorn",
    excerpt: "Carsome achieved unicorn status in 2022, becoming Malaysia's first automotive tech company to hit a $1 billion valuation. The story behind it is a masterclass in finding the right problem in an overlooked industry.",
    image: IMG.ecommerce,
    category: "Business",
    tags: ["startup", "entrepreneurship"],
    content: `<h2>The Problem With Used Cars in Southeast Asia</h2>
<p>Before Carsome, buying a used car in Malaysia was an exercise in information asymmetry and trust problems. Sellers had every incentive to hide defects; buyers had no reliable way to verify a vehicle's true condition or price history. Prices were opaque, negotiations were adversarial, and the process of transferring ownership through JPJ (the Road Transport Department) was bureaucratically painful. The used car market — worth tens of billions of ringgit annually — was run through a network of informal dealers and classified platforms that provided listings but no trust layer.</p>
<p>Eric Cheng and Teoh Jiun Ee founded Carsome in 2015 with a simple initial proposition: we will inspect your car properly and give you a fair offer within 24 hours. No haggling, no waiting, no uncertainty. The inspection — covering 175 checkpoints — became the trust product. Sellers valued the certainty. Buyers, accessing cars that had passed the Carsome inspection, got more information than the used car market had ever offered.</p>
<h2>The Expansion Playbook</h2>
<p>Carsome's growth followed a deliberate regional expansion path: Malaysia first to prove the model, then Indonesia, Thailand, and Singapore. Each market required adaptation — Indonesia's geographic spread required different logistics, Thailand's different regulatory environment required compliance work, Singapore's smaller market required a premium positioning. The core proposition — inspection-backed trust in used car transactions — translated across all four markets because the underlying problem was consistent throughout Southeast Asia.</p>
<p>The iCar Asia acquisition in 2021 was transformational. iCar operated car classifieds platforms across Southeast Asia, giving Carsome access to consumer audience, brand recognition, and advertising inventory across the region. Combined with Carsome's transaction infrastructure, the merged entity became the most comprehensive automotive marketplace in Southeast Asian history.</p>
<h2>What Founders Can Learn</h2>
<p>Carsome's story offers several transferable lessons. First, trust infrastructure in fragmented markets is a fundable, scalable business — the inspection product created value for both sides of the transaction and justified a margin. Second, regional expansion works best when you've solved the market deeply enough in one country to understand what will and won't translate. Third, acquisitions can accelerate distribution in ways that organic growth cannot — iCar's audience would have taken years to build organically. The insight available to every founder looking at Carsome's trajectory is that unsexy, transaction-heavy industries often harbour the most durable opportunities, precisely because the friction that makes them annoying to consumers also deters competitors who prefer cleaner product problems.</p>`,
  },
  {
    title: "Shopee, Lazada, and TikTok Shop: The Malaysian E-commerce Battle",
    excerpt: "Malaysia's e-commerce market is one of Southeast Asia's most competitive. Three platforms — Shopee, Lazada, and TikTok Shop — are fighting for dominance with different strategies, different economics, and very different user experiences.",
    image: IMG.ecommerce,
    category: "Business",
    tags: ["startup", "ecommerce"],
    content: `<h2>The Market They're Fighting For</h2>
<p>Malaysian e-commerce gross merchandise value exceeded RM 50 billion in 2023 and is growing at roughly 20% annually. The market is driven by a young, mobile-native consumer base, improving logistics infrastructure, and government initiatives to drive SME adoption of digital commerce. Shopee and Lazada have dominated since 2015–2016, but TikTok Shop's explosive entry starting in 2021 has disrupted what looked like a settled duopoly.</p>
<p>Shopee, operated by Sea Limited, holds the leading market position in Malaysia by most measures — monthly active users, seller count, and transaction volume. Its dominance is built on aggressive promotions (the 11.11, 12.12, and birthday sale phenomena are Shopee-created culture in Malaysia), a seller-friendly ecosystem, and deep logistics integration through Shopee Express and its J&T/Ninja Van partnerships.</p>
<h2>Lazada's Struggle and TikTok's Disruption</h2>
<p>Lazada, owned by Alibaba, was the pioneer and market leader before Shopee overtook it. Its challenges since the mid-2010s reflect the difficulty of Alibaba integrating a Southeast Asian platform into its ecosystem without losing the local agility that made Lazada successful. Multiple leadership changes, inconsistent seller relations, and a user experience that has lagged Shopee's continued investment have eroded its position, though it retains strength in specific categories and with certain demographics.</p>
<p>TikTok Shop represents something genuinely new: commerce embedded in entertainment rather than commerce with entertainment bolted on. In Malaysia, TikTok Shop's live selling feature — where sellers broadcast in real time, demonstrate products, answer questions, and close sales within the viewing experience — has created a category of content-creator merchants who couldn't exist on Shopee or Lazada. Fashion, beauty, and food products sell particularly well through live format. For brands, the challenge is that TikTok Shop requires building entertainment competence alongside retail competence.</p>
<h2>What This Means for Sellers</h2>
<p>Malaysian SMEs and brand owners navigating this landscape in 2025 face a multi-platform reality. Being on Shopee alone is insufficient — Shopee's advertising costs have risen as the platform matured. A multi-platform strategy — Shopee for volume, TikTok Shop for discovery and new customer acquisition, potentially Lazada for specific categories — has become the default for serious e-commerce operators. The complexity of managing inventory, pricing, promotions, and customer service across multiple platforms has created a cottage industry of e-commerce enablement services that help brands scale without proportionally scaling headcount.</p>`,
  },
  {
    title: "Funding a Malaysian Startup: Cradle, MDEC, and the VC Landscape in 2025",
    excerpt: "The Malaysian startup funding ecosystem has matured significantly. Here's a practical map of where the money is, what each source expects, and how to navigate the process without wasting years on the wrong path.",
    image: IMG.office,
    category: "Business",
    tags: ["startup", "entrepreneurship"],
    content: `<h2>Government Grants: The Non-Dilutive First Layer</h2>
<p>For pre-seed Malaysian founders, government grants are often the most accessible and least expensive capital available. Cradle Fund's CIP Spark (up to RM 150,000) and CIP 500 (up to RM 500,000) are the most widely used. The Malaysia Digital status from MDEC unlocks additional incentives including stamp duty exemptions, expatriate employment passes, and access to the MDEC-organised investor matching programmes. MOSTI runs the TRGS and PRGS grants for deeper tech and R&D applications.</p>
<p>The realistic assessment of government grants: they are genuinely useful non-dilutive capital, but the process is slow (3–6 months from application to approval is typical), the reporting requirements are bureaucratic, and spending restrictions can limit flexibility. They work best as bridge capital to extend runway while validating a model, not as primary growth capital.</p>
<h2>Angel Investment and Accelerators</h2>
<p>Malaysia has a growing but still shallow angel investor community. The Malaysian Business Angel Network (MBAN) facilitates connections between founders and accredited investors. Ticket sizes from Malaysian angels typically range from RM 50,000–500,000, with syndicates forming for larger rounds. Accelerator programmes — Antler Malaysia, MaGIC's programmes, Slash, and Superb — provide small cheques, mentorship, and cohort networks in exchange for equity (typically 5–10%).</p>
<h2>VC and Growth Capital</h2>
<p>Malaysian-focused VC funds active in 2025 include Vynn Capital (consumer and B2B SaaS), Gobi Partners (Pan-Asian with strong Malaysia presence), and Axiata Digital Innovation Fund (telco-adjacent tech). Regional VCs like 500 Global, Sequoia's Southeast Asia fund, and Golden Gate Ventures also invest in Malaysian companies — typically at Series A and beyond, requiring meaningful regional traction rather than just Malaysia success. The realistic path to a regional VC round involves demonstrating product-market fit in Malaysia, clear evidence of regional scalability, and revenue or engagement metrics that support a valuation in the USD 3–10M range pre-money for Series A.</p>`,
  },
  {
    title: "The Halal Tech Opportunity: Building for a 1.8 Billion Person Market",
    excerpt: "Malaysia is the global benchmark for halal certification and standards. This creates a uniquely positioned opportunity for technology products that serve the world's 1.8 billion Muslim consumers — and most of the opportunity remains untapped.",
    image: IMG.halal,
    category: "Business",
    tags: ["startup", "entrepreneurship"],
    content: `<h2>Why Malaysia Owns This Space</h2>
<p>Halal certification is a complex, multi-jurisdictional challenge. Different countries have different standards, different certification bodies, and different consumer expectations. Malaysia's JAKIM (Department of Islamic Development Malaysia) runs one of the most recognised halal certification programmes in the world — JAKIM-certified halal is accepted or respected in markets from the Middle East to Indonesia to Western Muslim communities. This gives Malaysian companies a credibility advantage in the halal space that is genuinely hard to replicate from other geographies.</p>
<p>The halal economy is estimated at over USD 2 trillion globally, covering food, pharmaceuticals, cosmetics, finance, travel, fashion, and media. Each of these verticals has technology gaps that remain largely unaddressed. Halal supply chain verification — ensuring that ingredients, processing environments, and logistics chains maintain halal integrity from source to consumer — is a particular challenge that blockchain and IoT technology are beginning to address, but where no dominant solution has emerged.</p>
<h2>The Product Opportunities</h2>
<p>Several technology product categories are underserved in the halal space. Halal ingredient verification tools for F&B manufacturers — particularly for the complex challenge of identifying halal status across multi-ingredient processed foods — remain manual and expensive. Halal travel booking platforms that aggregate prayer-room accessible accommodation, halal restaurant databases, and prayer time information into a coherent travel product are fragmented. Islamic finance technology — Shariah-compliant robo-advisors, halal screening tools for investment portfolios, takaful (Islamic insurance) platforms — is growing but still below the sophistication level of conventional fintech.</p>
<h2>The Design Consideration</h2>
<p>Building technology for Muslim consumers requires cultural literacy that goes beyond adding halal certification information to an existing product. Prayer times matter and affect user behavior patterns — a Muslim user's activity drops significantly at Asar (late afternoon prayer) time. Ramadan creates a dramatic shift in consumption patterns — food delivery surges between Iftar and Sahur, shopping patterns change, and emotional context around purchasing shifts. Building for these rhythms, rather than treating them as edge cases, is the difference between a product that feels native to its audience and one that feels adapted from a template designed for someone else.</p>`,
  },
  {
    title: "Malaysian Brands That Won on Social Media: What They Did Right",
    excerpt: "Several Malaysian brands have built outsized audiences and commercial success through social media without the budgets of multinational competitors. Here's what they got right — and what any brand can replicate.",
    image: IMG.creative,
    category: "Business",
    tags: ["startup", "ecommerce"],
    content: `<h2>The Local Advantage</h2>
<p>Global brands operating in Malaysia face a structural disadvantage on social media: their content is often produced elsewhere and adapted, rather than created natively for the Malaysian context. A Malaysian brand creating content in Manglish, referencing local cultural moments, featuring familiar faces and locations, and responding to comments in a mix of Bahasa and English has an authenticity advantage that money cannot easily buy. The brands that have exploited this most effectively have done so by treating social media as a conversation with their community rather than a broadcast channel.</p>
<p>Bonia, the Malaysian leather goods brand, built significant social media traction by leaning into Malaysian heritage and craftsmanship narratives rather than trying to position itself as a generic luxury alternative. Caring Pharmacy created community through health education content rather than product promotion. These approaches work because they give audiences a reason to follow beyond commercial intent.</p>
<h2>The Content Formats That Work in Malaysia</h2>
<p>Short-form video — TikTok and Instagram Reels — dominates Malaysian social media engagement by a significant margin. Within this format, the content types that consistently generate above-average engagement in the Malaysian market include: relatable slice-of-life content that captures everyday Malaysian experiences, food content (Malaysia's food culture makes this universally resonant), behind-the-scenes content that humanises brands, and educational or "did you know" content about topics the audience cares about. Highly produced content does not consistently outperform authentic content — Malaysian social media audiences have developed strong filters for content that feels like an ad regardless of format.</p>
<h2>The Commerce Integration Shift</h2>
<p>The most significant shift in Malaysian social media strategy over the past two years is the integration of commerce directly into content through TikTok Shop live selling. Brands that have built social media audiences and then connected them to live commerce experiences — where the host interacts with viewers, demos products, answers questions, and closes sales in real time — have seen conversion rates that significantly exceed standard e-commerce. The format rewards personality and presentation skills over production quality, which levels the playing field between small authentic brands and large but less charismatic corporations.</p>`,
  },
  {
    title: "Remote Work in Malaysia: Building a Company from KL Without an Office",
    excerpt: "The post-pandemic normalisation of remote work has created a new class of Malaysian company — fully distributed, internationally competitive, and deliberately location-agnostic. Here's what building one actually looks like.",
    image: IMG.remote,
    category: "Business",
    tags: ["startup", "entrepreneurship"],
    content: `<h2>The Structural Opportunity</h2>
<p>Malaysia's remote work moment is unique in one respect: the cost arbitrage between Malaysia and Singapore (and further afield) means that a distributed Malaysian company can hire talent at local rates while selling to international customers at international prices. This is not a new business model — outsourcing and offshoring have worked on this principle for decades — but the normalisation of remote work has made it accessible to small companies and individual founders rather than just large outsourcing firms.</p>
<p>A Malaysian software consultancy billing Singapore clients at SGD rates while paying Malaysian engineers at MYR rates captures a margin that funds quality, benefits, and growth that a purely local business model cannot sustain. Several successful Malaysian product companies are built on this exact foundation, using international revenue to fund product development that eventually competes in those same international markets.</p>
<h2>The Practical Reality of Distributed Work in Malaysia</h2>
<p>Building a remote-first Malaysian company requires solving several practical problems. Connectivity is generally good in major urban areas but inconsistent elsewhere — team members outside KL, PJ, or Penang may face unreliable connections that affect synchronous work. Coworking spaces (Common Ground, Colony, Spaces, and independently run options across KL) have filled the need for team members who prefer a professional environment over a home setup.</p>
<p>The cultural dimension of distributed work in Malaysia is worth attention. Malaysian work culture has traditionally been office-centric, hierarchical, and relationship-driven — dynamics that are harder to maintain and express in asynchronous remote settings. Successful remote-first Malaysian companies have tended to invest in regular in-person gathering (quarterly offsites, monthly team lunches), clear written communication norms, and deliberate relationship-building that replaces the incidental socialising of office life.</p>
<h2>Hiring Internationally</h2>
<p>For Malaysian companies hiring internationally, the legal and compliance picture is complex but manageable. Employer of record (EOR) services like Remote, Deel, and Multiplier allow Malaysian companies to employ people in other countries without establishing local entities. Locally, the Returning Expert Programme (REP) and Malaysia My Second Home (MM2H) provide pathways for foreign talent to live and work in Malaysia. The increasing normalisation of global hiring is a competitive advantage for Malaysian companies willing to navigate the complexity — the talent pool available to a remote-first Malaysian company is genuinely global.</p>`,
  },
  {
    title: "PropertyGuru and the Digital Transformation of Malaysian Real Estate",
    excerpt: "PropertyGuru dominates Malaysian property search. But the more interesting story is how digital platforms are changing the economics of property transactions in a market where agents, developers, and buyers have very different interests.",
    image: IMG.klcc,
    category: "Business",
    tags: ["startup", "ecommerce"],
    content: `<h2>Before and After Digital Property Search</h2>
<p>Before property portals, finding a property in Malaysia meant driving through neighbourhoods looking at signboards, flipping through newspaper classifieds, and relying on agents' verbal descriptions of listings they may not have visited recently. Information asymmetry was extreme — agents controlled access to inventory, pricing data was opaque, and developers set prices with limited competitive pressure from comparable market data. The buyer or tenant was almost entirely dependent on intermediaries who had financial interests in the transaction outcome.</p>
<p>PropertyGuru, which launched in Singapore in 2007 and expanded to Malaysia, fundamentally changed the information balance. Buyers could search tens of thousands of listings, compare prices across developments, read reviews, check crime statistics for areas, and arrive at developer showrooms or agent meetings with more data than ever before. The shift in information power toward buyers changed negotiation dynamics and put pressure on the opacity that had allowed some market participants to extract rents through information control.</p>
<h2>The Agent Economy</h2>
<p>Malaysia has approximately 30,000 registered real estate agents and negotiators under the Board of Valuers, Appraisers, Estate Agents and Property Managers (BOVAEA). The proliferation of property portals was initially seen as a threat to this agent ecosystem — if buyers could find properties directly, why pay a 3% commission to an agent?</p>
<p>The reality has been more nuanced. Digital platforms have expanded the market and made agents more productive (a single agent can market listings to a far larger audience) while also raising quality expectations. Agents who add genuine value — local knowledge, negotiation skill, legal process management, developer relationships — have thrived. Those who added value primarily through information hoarding have struggled. The net effect on the agent economy has been a bifurcation: the strong have gotten stronger, the marginal have left the industry.</p>
<h2>The PropTech Frontier</h2>
<p>Malaysian PropTech beyond property search remains underdeveloped relative to the size of the market. Digital mortgage applications, property valuations, rental deposit management, and smart home integration represent genuinely underserved opportunities. The complexity of strata title laws, the slow digitisation of land registry processes at JUPEM and state land offices, and the large informal rental market are structural challenges. The opportunity is real; the execution requires navigating genuine regulatory and institutional complexity.</p>`,
  },
  {
    title: "AirAsia's Pivot: From Budget Airline to Digital Company",
    excerpt: "Tony Fernandes' transformation of AirAsia from a failing airline into a regional low-cost carrier is one of the greatest business turnarounds in Asian history. The next chapter — building a digital business on top of that aviation base — is less certain, but no less ambitious.",
    image: IMG.startup,
    category: "Business",
    tags: ["startup", "entrepreneurship"],
    content: `<h2>The Aviation Foundation</h2>
<p>When Tony Fernandes and Kamarudin Meranun acquired the near-bankrupt AirAsia from DRB-Hicom in 2001 for the symbolic sum of one ringgit plus RM 40 million in assumed debt, the airline had two aircraft and a mountain of liabilities. Twenty years later, before the pandemic hit, AirAsia was operating 250 aircraft, serving 165 destinations, and carrying over 100 million passengers annually. The low-cost carrier model — stripped-back service, point-to-point routes, transparent ancillary revenue — was executed with consistency and scale that few airlines anywhere in the world have matched.</p>
<p>The pandemic was AirAsia's most severe test. With flights grounded, revenue collapsed and the existential questions about aviation's future — and AirAsia's specifically — were genuine. The capital raises and restructuring that followed were painful, but the airline survived, and the forced digital acceleration that the pandemic triggered became the foundation for the next strategic chapter.</p>
<h2>Capital A and the Super App Ambition</h2>
<p>The rebranding from AirAsia Group to Capital A in 2022 signalled the intention clearly: this would no longer be defined as an airline company. The super app — integrating flights, hotels, food delivery (AirAsia Food), ride-hailing (AirAsia Ride), logistics (Teleport), and financial services (BigPay) — was the vision. The logic was straightforward: AirAsia had built one of the region's largest consumer databases through decades of flight bookings. Converting that audience relationship into engagement across multiple product categories was the digital prize.</p>
<p>The execution has been mixed. BigPay, the fintech arm now spun off as a separate entity, has built a genuine digital banking product with regional presence and meaningful user numbers. AirAsia Food and Ride faced brutal competition from Grab and Foodpanda and ultimately retreated from several markets. Teleport, the logistics platform, has found a viable niche in cargo and cross-border logistics. The super app narrative is more modest than the original ambition, but the underlying assets — brand recognition, consumer database, and operational infrastructure across ASEAN — remain genuinely valuable building blocks.</p>`,
  },

  // ── FINTECH (10 posts) ────────────────────────────────────────────────────
  {
    title: "Touch 'n Go eWallet vs GrabPay vs Boost: Who's Actually Winning?",
    excerpt: "Malaysia's e-wallet wars have been running for years. The consolidation phase is underway. Here's a data-driven look at where the major players stand and what the endgame looks like.",
    image: IMG.payment,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>The State of the Market</h2>
<p>Malaysia's e-wallet landscape peaked at over 50 licensed payment instrument issuers before consolidation began in earnest around 2021–2022. The survivors of the shakeout are now clear: Touch 'n Go eWallet (backed by CIMB and Ant Group) is the market leader by user numbers, transactional volume, and acceptance points. GrabPay, integrated into Southeast Asia's dominant superapp, holds the second position. Boost, now owned by RHB Banking Group after Axiata sold its stake, has repositioned around SME payments and earned a more focused but defensible niche.</p>
<p>The government-mandated QR code standardisation through DuitNow QR has been a market-shaping development. All major e-wallets now support the same QR standard, which means a merchant needs one QR code rather than four or five. This has been good for merchant adoption but reduced switching costs between wallets — users can increasingly pay anywhere with any wallet, reducing the exclusive acceptance advantage that was an early differentiator.</p>
<h2>Why Touch 'n Go Leads</h2>
<p>Touch 'n Go's leadership isn't primarily explained by its e-wallet features — it's explained by the highway and transit toll network. Every Malaysian who uses a highway or rides the LRT/MRT needs a Touch 'n Go card. The migration of that captive audience into the e-wallet drove initial adoption at a scale no competitor could match. Once users were on the platform, the Ant Group partnership brought in consumer credit (PayLater), wealth management (GO+, the money market fund product), and insurance products that deepened the relationship beyond payments.</p>
<h2>The Consolidation Ahead</h2>
<p>Five digital banking licences were awarded by Bank Negara in 2022 to consortiums that include GXS Bank (Grab and Singtel), AEON Bank (AEON and MoneyMatch), KBank (Kasikorn Bank Thailand), Boost Bank (Boost and RHB), and Sea Bank (Shopee's parent). As these digital banks launch, they bring deposit accounts, lending, and savings products into the same ecosystems as existing e-wallets. The future of Malaysian consumer finance is likely a few integrated financial platforms — not dozens of single-purpose payment apps — with the digital banks providing the deposit infrastructure that turns e-wallets into financial accounts.</p>`,
  },
  {
    title: "How DuitNow Changed Malaysian Payments — And What Comes Next",
    excerpt: "DuitNow is Malaysia's real-time payment infrastructure. In four years it has fundamentally changed how Malaysians transfer money and pay for things. The next phase — open finance — could be even more significant.",
    image: IMG.qr,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>What DuitNow Actually Is</h2>
<p>DuitNow is the brand name for Malaysia's real-time retail payments platform, operated by Payments Network Malaysia (PayNet), a consortium owned by Bank Negara and the major Malaysian banks. It comprises several distinct products that are often conflated: DuitNow Transfer (instant bank-to-bank transfers using mobile number, NRIC, or business registration number as proxy), DuitNow QR (the standardised QR code payment standard), and DuitNow AutoDebit (direct debit mandate management). Together, these form the core of Malaysia's retail payment infrastructure.</p>
<p>DuitNow Transfer launched in 2018 as the successor to IBG (Interbank GIRO), replacing a system where transfers could take hours with one where funds arrive in seconds. The mobile number proxy — meaning you can send money to someone's phone number rather than needing their account number — lowered the barrier to peer-to-peer transfers significantly and drove mass adoption faster than any previous banking initiative.</p>
<h2>The Merchant Adoption Story</h2>
<p>DuitNow QR's adoption curve is one of the most remarkable in Malaysian fintech history. From a standing start at launch in 2019, QR payments became ubiquitous in Malaysian retail by 2022 — present at mamak stalls, pasar malam vendors, parking meters, hawker centres, and convenience stores alongside petrol kiosks and department stores. The government's RM30 e-wallet reload incentive programmes accelerated adoption, but the underlying driver was the genuine utility: zero merchant discount rate (MDR) for QR transactions under Bank Negara's regulatory mandate made it more economical for small merchants than card acceptance.</p>
<h2>Open Finance: The Next Chapter</h2>
<p>Bank Negara's Open Finance framework, published in 2023, mandates that banks and financial institutions provide standardised APIs for third parties to access (with customer consent) financial data and initiate transactions. This is Malaysia's version of Open Banking — potentially transformative for financial services competition. When implemented, it will allow fintech companies to build products on top of the banking system with the same data access that banks themselves have. Account aggregation, automated financial management, Shariah-compliant investment automation, and cross-institution lending products become possible. The implementation timeline is 2025–2027 — the next generation of Malaysian fintech products is being designed around these capabilities now.</p>`,
  },
  {
    title: "Malaysia's Five Digital Banking Licences: What They Mean for Consumers",
    excerpt: "Bank Negara awarded five digital banking licences in 2022. As these new banks begin launching products, Malaysian consumers will face a new kind of banking choice. Here's what to expect.",
    image: IMG.bank,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>Who Got the Licences</h2>
<p>After an extensive application process that attracted over a dozen consortiums, Bank Negara Malaysia awarded five digital banking licences in April 2022. The recipients: GXS Bank (Grab and Singtel joint venture), AEON Bank (AEON Group and MoneyMatch), KBank (Kasikorn Bank Thailand), Boost Bank (Axiata's Boost and RHB), and Sea Bank (Sea Limited, parent of Shopee). Each licence came with a RM 1 billion minimum capital requirement and a fund-raising limitation (total deposits capped at RM 3 billion initially) intended to ensure controlled growth during the early operational phase.</p>
<p>The licences represent something genuinely novel in Malaysian banking: institutions without physical branches, legacy technology systems, or the compliance overhead of decades of banking regulation. They can design products from scratch with modern technology stacks, data-driven underwriting, and user experiences built for a mobile-first population.</p>
<h2>What Digital Banks Can Offer That Traditional Banks Can't</h2>
<p>The structural advantage of digital banks is speed and data. A traditional bank's credit decision relies primarily on formal employment records, salary slips, and credit bureau history. Digital banks backed by platforms like Grab or Shopee have transactional data — order history, income patterns, spending behaviour — that paint a more complete picture of creditworthiness. This creates the opportunity to serve the "thin file" segment: gig workers, self-employed individuals, small business owners, and younger consumers who have limited formal credit history but demonstrable financial behaviour through their platform activity.</p>
<h2>The Consumer Impact</h2>
<p>For Malaysian consumers, digital banking competition should drive several improvements: higher savings deposit rates (digital banks with lower operating costs can afford to be more competitive on deposits), better loan products for underserved segments, and improved user experience in banking interfaces that have historically lagged behind consumer tech. The risks are real too — consumers need to understand deposit insurance (PIDM covers deposits up to RM 250,000 at licensed institutions, including digital banks), data privacy implications of consenting to platform data use for banking purposes, and the newness-related risks of institutions without operational track records. Healthy scepticism alongside genuine openness to new products is the right consumer posture.</p>`,
  },
  {
    title: "Buy Now Pay Later in Malaysia: The Opportunity and the Debt Question",
    excerpt: "BNPL has grown explosively in Malaysia. Atome, Split, and GrabPay Later are changing how Malaysians finance purchases. But consumer debt concerns are real — and regulation is coming.",
    image: IMG.payment,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>The BNPL Moment in Malaysia</h2>
<p>Buy Now Pay Later products — which allow consumers to split purchases into three or four interest-free instalments — arrived in Malaysia around 2019 and accelerated dramatically during the pandemic. Atome (backed by Grab), Split (Malaysian-founded), Hoolah (now ShopBack PayLater), GrabPay Later, and Touch 'n Go PayLater are among the major providers. Penetration has been highest among younger consumers (18–35), fashion and beauty e-commerce, electronics, and travel purchases — categories where the desire to purchase often outpaces immediate affordability.</p>
<p>The appeal is straightforward from the consumer perspective: zero interest if repaid on schedule, no credit card required, instant approval via mobile app. For merchants, BNPL increases average order values and conversion rates — customers buy more when payment is deferred. The model is subsidised by merchant fees (typically 3–6% of transaction value), making it free for consumers who pay on time and profitable for providers when merchant volume is sufficient.</p>
<h2>The Debt Concern</h2>
<p>The Bank Negara Financial Stability Review and multiple consumer advocacy groups have flagged concerns about BNPL's impact on Malaysian consumer debt profiles. The core issue is that BNPL obligations don't currently appear on CTOS or CCRIS credit bureau records — meaning a consumer can accumulate multiple BNPL commitments simultaneously without any provider seeing the full picture. This creates the potential for debt accumulation that becomes visible only when repayments fail.</p>
<p>Malaysia's Bank Negara is developing a regulatory framework for BNPL, expected to require BNPL providers to report obligations to credit bureaus and conduct affordability assessments. This is broadly positive for the industry's long-term health — it will reduce bad debt and build BNPL's credibility as a mainstream financial product rather than a regulatory grey zone. Some irresponsible providers will exit; those with sound underwriting will be vindicated.</p>
<h2>For Builders</h2>
<p>The BNPL infrastructure opportunity hasn't been fully exploited in B2B contexts. Trade credit — businesses extending payment terms to other businesses — is a centuries-old practice that is still largely managed through relationships and paper invoices in Malaysia's SME sector. A BNPL-style product for B2B transactions, underwritten using business performance data, represents a significant market opportunity that several Malaysian fintechs are beginning to address.</p>`,
  },
  {
    title: "Islamic Fintech: Why Malaysia Is the World's Best Positioned Market",
    excerpt: "Malaysia's dual financial system — conventional and Islamic banking operating in parallel — has created a unique environment for Islamic fintech innovation. The global opportunity is vast and Malaysia's head start is real.",
    image: IMG.halal,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>The Islamic Finance Foundation</h2>
<p>Malaysia operates the world's most sophisticated dual banking system. Conventional and Islamic banking operate under separate regulatory frameworks, with Islamic financial institutions supervised under the Islamic Financial Services Act (IFSA) and conventional institutions under the Financial Services Act (FSA). Islamic banking assets represent over 30% of Malaysia's total banking assets — a proportion unmatched anywhere outside the Gulf states. This depth creates both a large domestic market and a credibility base for Islamic fintech innovation.</p>
<p>Islamic finance operates on core prohibitions — riba (interest), gharar (excessive uncertainty), and maysir (speculation) — that require genuine structural differences from conventional finance, not just rebranding. Murabaha (cost-plus financing), Musharakah (partnership), Ijarah (leasing), and Wakala (agency) structures underpin the major product categories. Building technology for these structures requires understanding the Shariah requirements deeply — a superficial wrapper on conventional finance won't satisfy the product requirements or the regulatory scrutiny.</p>
<h2>The Fintech Opportunities</h2>
<p>Several Islamic fintech product categories remain underdeveloped relative to their conventional counterparts. Halal investment robo-advisors that automatically screen equities for Shariah compliance, rebalance portfolios to maintain compliance, and provide zakat (Islamic alms) calculation on investment gains are a clear product gap — Wahed Invest (US-founded, Malaysia operational) and a handful of local players are early but the market is far from served. Takaful (Islamic insurance) distribution and claims management is still largely paper-based and agent-driven, representing a significant digitisation opportunity.</p>
<h2>The Global Market</h2>
<p>The global Muslim population of 1.8 billion represents an enormous addressable market for Islamic financial products, but penetration of formal Islamic finance beyond Malaysia, the Gulf states, and Indonesia is very low. Muslim communities in Europe, North America, and Africa are significantly underserved by Shariah-compliant financial products. Malaysian Islamic fintech companies have a credibility and regulatory sophistication advantage in these markets — the JAKIM and BNM backing that comes with a Malaysian-regulated Islamic financial product carries weight in markets where Islamic finance expertise is scarce. The export opportunity for Malaysian Islamic fintech is genuine and largely unseized.</p>`,
  },
  {
    title: "QR Code Payments in Malaysia: A Merchant's Perspective",
    excerpt: "Walk into almost any Malaysian business and you'll see a DuitNow QR sticker. But how do merchants actually experience QR payments? What works, what doesn't, and what's next for Malaysia's most successful payment innovation?",
    image: IMG.qr,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>The Merchant Experience</h2>
<p>For a Malaysian hawker stall owner or mamak proprietor, QR code payments represented the first time cashless transactions were genuinely accessible. Previously, accepting cards required a point-of-sale terminal, a merchant account, and paying a merchant discount rate — all barriers that excluded small informal businesses. DuitNow QR changed this: a printed QR code, zero setup cost, and typically zero transaction fees for small merchants under Bank Negara's early merchant development programme.</p>
<p>The settlement timeline matters enormously to small merchants managing cash flow. DuitNow QR settlements happen on a next-business-day basis for most providers, which is significantly better than card settlements (typically T+2 or T+3) but slower than the instant settlement that merchants optimistically assume when they see money hit the customer's screen. For merchants with very tight cash flow — which describes most hawker-level businesses — this timing matters in ways that restaurant chains or department stores don't experience.</p>
<h2>The Problems Worth Knowing</h2>
<p>QR payments in Malaysia have genuine friction points that are often underdiscussed in promotional narratives. Connectivity dependency is the most significant: a merchant without reliable internet cannot accept QR payments, which creates vulnerability in areas with inconsistent connectivity or during network outages. Reconciliation is more complex than cash — matching QR payment records from multiple e-wallet providers to sales is not trivial, and the tools available to small merchants for this purpose are basic. Fraud, while rare compared to card fraud, does occur — fake QR codes placed over legitimate merchant codes have been reported, though the dynamic QR code generation mandated for higher-value transactions mitigates this risk.</p>
<h2>The Future: Invisible Payments</h2>
<p>The next evolution of Malaysian payments is the move toward transaction initiation without explicit customer action. License plate recognition at parking facilities, face recognition at transit gates, and in-app recurring payment authorisations are emerging directions that reduce friction toward zero. For merchants, the opportunity is context-aware payment — customers who have pre-authorised payment for a specific merchant context complete transactions by completing the purchase behavior rather than explicitly paying. The technology exists; the consumer trust and regulatory framework are the rate-limiting factors.</p>`,
  },
  {
    title: "Robo-Advisors in Malaysia: StashAway, Wahed, and the Wealth Management Disruption",
    excerpt: "Automated investment platforms have made wealth management accessible to Malaysians who were previously excluded by high minimums and opaque fee structures. Here's how the market has evolved and what investors should understand before committing.",
    image: IMG.fintech,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>The Market Before Robo-Advisors</h2>
<p>Before robo-advisory platforms arrived in Malaysia, the accessible investment options for ordinary Malaysians were limited: Amanah Saham Bumiputera (ASB) for Bumiputera investors, EPF investments via i-Invest, unit trusts sold through banks and agents (with substantial upfront sales charges of 3–5%), and direct equity through Bursa Malaysia (requiring a CDS account and enough capital to build a diversified portfolio). The wealthier end of the market accessed discretionary portfolio management through private banking relationships that required substantial minimum investments. The middle segment — working professionals with RM 1,000–50,000 to invest — was chronically underserved.</p>
<p>StashAway, a Singapore-headquartered platform that launched in Malaysia in 2018, was the first to bring the robo-advisory model to the Malaysian mass market. Its positioning — algorithm-driven portfolio management, low fees (0.2–0.8% annual management fee versus 1.5–2% for unit trusts), and no minimum investment — addressed the underserved middle segment directly. MyTunai, Wahed Invest (Shariah-compliant), Kenanga Digital Investing, and KDI (Kenanga's digital platform) followed.</p>
<h2>What Robo-Advisors Actually Do</h2>
<p>The Malaysian robo-advisors share a common model: take a risk profile questionnaire, construct a globally diversified ETF portfolio aligned to that risk profile, automatically rebalance when asset allocation drifts, and reinvest dividends. The value proposition is institutional-quality diversification (global equity exposure, bond allocation, geographic spread) at a fee point that was previously accessible only to high-net-worth investors. Tax reporting is simplified through annual statements; the investment decision complexity is abstracted away.</p>
<h2>The Honest Assessment</h2>
<p>Robo-advisors in Malaysia have succeeded in democratising access to globally diversified investing — a genuine achievement. Their limitations are worth understanding: they don't outperform markets (they're designed to track markets efficiently), they can't account for individual circumstances beyond the questionnaire, and they're not appropriate for all investment goals (home purchase deposits, business capital, and other short-term needs belong in cash or fixed deposits, not equity portfolios). Used appropriately — for long-term wealth building with a time horizon of five years or more — they represent a significant improvement over the alternatives that were available to most Malaysians before their arrival.</p>`,
  },
  {
    title: "Cross-Border Payments Between Malaysia and Singapore: The Friction and the Future",
    excerpt: "Malaysia and Singapore have one of the world's largest bilateral economic relationships. Yet moving money across the Causeway remains more friction-laden than it should be. The next two years will change this dramatically.",
    image: IMG.bank,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>The Scale of the Relationship</h2>
<p>Approximately 300,000–400,000 Malaysians cross the Causeway daily to work in Singapore. Bilateral trade between the two countries exceeds SGD 100 billion annually. The remittance flow from Malaysians working in Singapore back to Malaysia is one of the largest domestic remittance corridors in Southeast Asia. Yet for most of the history of this relationship, moving money between the two countries meant queuing at a money changer in JB or Woodlands, or paying bank wire fees that made small transfers uneconomic.</p>
<p>Digital remittance services — Wise, Western Union, Instarem, and Malaysian-founded BigPay — have substantially improved the cost and convenience of Malaysia-Singapore transfers over the past five years. Wise's exchange rates are typically within 0.3–0.5% of mid-market, with flat fees that make small transfers viable for the first time. The joker in the pack has been the MYR-SGD exchange rate, which creates genuine cost uncertainty for regular cross-border earners regardless of which platform they use.</p>
<h2>The DuitNow-PayNow Linkage</h2>
<p>The most significant development in Malaysia-Singapore cross-border payments is the DuitNow-PayNow linkage, operated under the ASEAN Payment Connectivity initiative. Launched in phases from 2022, this linkage allows instant transfers between Malaysian and Singapore bank accounts using phone numbers — the same proxy-based simplicity that made DuitNow domestic transfers so accessible. The fees are low (typically under RM 3 per transfer) and the settlement is real-time. For the 300,000+ daily cross-border workers, this is a fundamental quality-of-life improvement.</p>
<h2>What's Next</h2>
<p>The DuitNow-PayNow QR cross-border payment linkage — which will allow Malaysians to pay at Singapore merchants using their Malaysian e-wallet QR code, and vice versa — is in active development and expected to deploy more broadly across 2025–2026. When mature, this means a Malaysian tourist in Singapore can pay at a hawker centre with Touch 'n Go, and a Singaporean in KL can pay with PayLah at a Malaysian restaurant. The elimination of foreign currency cash carrying for short regional trips is a genuine consumer quality improvement that will arrive within the planning horizon of any product or service being built today.</p>`,
  },
  {
    title: "The EPF Investment Account: How Malaysians Are Using Their Retirement Savings to Invest",
    excerpt: "EPF's investment panels allow members to invest portions of their Account 1 savings in unit trusts and other instruments. Few financial decisions affect more Malaysians — and few are more misunderstood.",
    image: IMG.fintech,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>How the EPF Investment Scheme Works</h2>
<p>The Employees Provident Fund (EPF) is Malaysia's mandatory retirement savings scheme — essentially a defined contribution pension that covers most formal sector employees. Members contribute 11% of their salary and employers contribute 13%, creating a retirement savings balance that for a median Malaysian employee represents the largest financial asset they will ever accumulate.</p>
<p>The EPF Investment Scheme allows members with Account 1 balances above a specified threshold (the excess above a "basic savings" amount set by EPF, currently RM 110,000–240,000 depending on age) to invest up to 30% of that excess in approved unit trust funds offered by EPF's panel of fund managers. The scheme was designed to allow members to potentially earn higher returns than EPF's guaranteed dividend (historically 5–6% annually) by accepting market risk.</p>
<h2>The Performance Reality</h2>
<p>Research on EPF member investment scheme outcomes consistently shows that the majority of members who invest through the scheme underperform EPF's own dividend. The reasons are structural: unit trust funds sold through the EPF scheme often carry upfront sales charges of 3%, annual management fees of 1.5–2%, and are frequently recommended by financial advisers whose compensation is tied to commission. A fund needs to outperform EPF's dividend by 2–3% annually just to cover these costs before generating net benefit for the member.</p>
<p>This doesn't mean the scheme is always bad — a well-chosen, low-cost index fund through the scheme, held over 10+ years, may outperform EPF dividends. But the default option for most members — a commission-driven adviser recommending an actively managed fund — is statistically unlikely to serve the member's interest better than leaving the money in EPF.</p>
<h2>The Fintech Improvement Opportunity</h2>
<p>The EPF investment ecosystem is ripe for technology-driven improvement. Low-cost index fund options are available through the scheme but rarely recommended by commission-driven advisers. A fintech product that provides objective, data-driven fund selection guidance, fee comparison, and projected outcome modelling for EPF investment decisions would serve an enormous, financially significant, and currently underserved user base. The regulatory pathway exists — it would require Securities Commission licensing and coordination with EPF — but the product opportunity is genuine and significant.</p>`,
  },
  {
    title: "Bank Negara's Regulatory Sandbox: What It Is and How Startups Can Use It",
    excerpt: "Bank Negara Malaysia's Financial Technology Regulatory Sandbox has enabled some of Malaysia's most innovative fintech products to launch and iterate. Here's how it works and how to get in.",
    image: IMG.bank,
    category: "Business",
    tags: ["fintech", "payments"],
    content: `<h2>What the Sandbox Does</h2>
<p>Bank Negara Malaysia's Financial Technology Regulatory Sandbox, launched in 2016, allows fintech companies to test innovative financial products and services in a live but controlled environment, with regulatory requirements temporarily relaxed or modified to enable the innovation. Companies in the sandbox operate under a time-limited approval (typically 12–24 months) that allows them to test with real customers and real transactions while the regulator observes, evaluates, and determines appropriate permanent regulatory treatment.</p>
<p>The sandbox has been used by companies testing digital insurance products, alternative credit scoring using non-traditional data, blockchain-based cross-border payments, AI-driven investment advisory, and peer-to-peer financing models. It has contributed to regulatory frameworks for multiple new financial product categories by generating real-world evidence about how new technologies perform and what consumer protections are needed.</p>
<h2>Who Should Apply</h2>
<p>The sandbox is appropriate for fintech innovations that use or incorporate technology in a materially different way from existing licensed activities, have the potential to improve financial services but cannot be fully tested within existing regulatory frameworks, and are sufficiently developed to generate meaningful data within the sandbox period. Exploratory ideas or features that can be built within existing regulations do not require sandbox participation.</p>
<p>Bank Negara's application process involves a formal submission describing the innovation, the regulatory challenge it presents, the testing parameters and customer safeguards proposed, and the company's financial and operational capacity to manage the risks of live testing. Approval is selective — BNM evaluates both the innovation's merit and the applicant's credibility and risk management capability.</p>
<h2>The Practical Value</h2>
<p>Beyond the regulatory permission, sandbox participation provides direct access to BNM's fintech policy teams, advance visibility into regulatory intent, and a credibility signal to investors and potential partners that the regulator has assessed and engaged with the business model. Several sandbox graduates have used their sandbox experience as a cornerstone of their investor presentations — evidence that the regulatory risk in their model has been directly addressed rather than assumed away. For a Malaysian fintech pursuing a genuinely novel product category, the sandbox is worth the investment of applying.</p>`,
  },

  // ── DESIGN (10 posts) ─────────────────────────────────────────────────────
  {
    title: "Malaysian Design Identity: Finding Our Visual Voice",
    excerpt: "What does Malaysian design actually look like? As the country's creative industry matures, designers are grappling with what it means to build a visual identity that is distinctly Malaysian — not colonial, not borrowed, but genuinely ours.",
    image: IMG.creative,
    category: "Design",
    tags: ["design", "culture"],
    content: `<h2>The Colonial Inheritance</h2>
<p>Malaysian visual culture carries layers of influence that reflect its history: British colonial architecture, Chinese shophouse aesthetics, Indian temple visual grammar, Malay woodcarving traditions, and Orang Asli textile patterns. The postcolonial challenge for Malaysian designers has been to draw on these traditions without either freezing them as museum pieces or dismissing them as incompatible with modernity. The most interesting Malaysian design work of the past decade has been precisely this negotiation — contemporary visual language that carries genuine cultural roots.</p>
<p>The government's design promotion through Badan Warisan Malaysia and Kraftangan Malaysia has preserved craft traditions, but the connection between heritage crafts and contemporary design practice has historically been weak. Younger designers are increasingly bridging this gap — bringing the pattern logic of batik, the spatial sensitivity of Malay architecture, and the visual density of Chinese festival design into digital, fashion, and brand design contexts.</p>
<h2>What Distinctly Malaysian Design Looks Like Now</h2>
<p>The clearest examples of contemporary Malaysian design identity tend to emerge in specific contexts: festival greeting cards and social media graphics that blend the visual vocabularies of Eid, CNY, and Deepavali into something uniquely Malaysian; F&B branding for local food that refuses to be embarrassed about its subject matter and uses visual confidence to elevate the ordinary; and public art and wayfinding in KL that reflects the multilingual, multi-ethnic reality of the city rather than defaulting to a sanitised tourist-board aesthetic.</p>
<h2>The Digital Context</h2>
<p>For UI and product designers, Malaysian design identity plays out differently than in print or physical contexts. A Malaysian banking app or e-commerce platform needs to meet international usability standards — the conventions of mobile UI are global for good reasons. The cultural specificity comes through in illustration style, photography choices, copywriting tone, and colour palette decisions that feel native to the context rather than translated from Silicon Valley templates. The strongest Malaysian product design doesn't announce its identity loudly; it simply feels right to its users in a way that foreign-designed alternatives don't quite achieve.</p>`,
  },
  {
    title: "Designing for Bahasa Malaysia: Typography and Readability Challenges",
    excerpt: "Designing text-heavy interfaces in Bahasa Malaysia presents specific challenges around word length, diacritic support, and font selection. Here's what every Malaysian designer and developer needs to know.",
    image: IMG.design,
    category: "Design",
    tags: ["design", "culture"],
    content: `<h2>The Word Length Problem</h2>
<p>Bahasa Malaysia is an agglutinative language — complex meanings are expressed by affixing prefixes and suffixes to root words, creating long compound words. This creates specific layout challenges in UI design. A button that says "Buy" in English becomes "Beli" in Bahasa — roughly equivalent. But "Settings" becomes "Tetapan," "Notifications" becomes "Pemberitahuan," and "Transaction History" becomes "Sejarah Transaksi" — significantly longer strings that can break button layouts, truncate labels, and overflow containers designed with English in mind.</p>
<p>The practical lesson for developers: never hardcode container widths for text elements when designing for a multilingual Malaysian product. Use flexible layouts, test every UI string in both English and Bahasa before releasing, and build overflow behaviour (truncation with tooltip, or wrapping) into your design system from the start rather than retrofitting it when the Bahasa version breaks in production.</p>
<h2>Font Selection for Bahasa Malaysia</h2>
<p>Modern Bahasa Malaysia uses the Latin alphabet with two diacritics: the circumflex accent (ê, â) and occasionally the tilde (ñ). Most modern Google Fonts and Latin character set fonts include these characters, but not all — verify diacritic support before committing to a typeface for a product that will be used in Bahasa. Additionally, consider readability at the typical screen sizes Malaysian users access — 5.5–6.5 inch smartphone screens at 375px–414px CSS width. Fonts that read beautifully on a 1440px desktop design review may lose their distinction at 16sp on a mid-range Android phone.</p>
<h2>The Multilingual Layout Requirement</h2>
<p>Most Malaysian consumer products need to support at minimum two languages (Bahasa Malaysia and English), with many needing Traditional or Simplified Chinese as well. This has architectural implications beyond just string translation. Bahasa and English can share the same font stack; Chinese requires a separate CJK font. Right-to-left support (Jawi script, for Bahasa Malaysia in Jawi orthography used in Islamic education contexts) is a requirement for products serving religious or educational markets. Building internationalisation into your product from the first design sprint rather than retrofitting it later will save significant development time and prevent the layout brittleness that comes from text containers designed for a single language.</p>`,
  },
  {
    title: "Batik Patterns in Modern UI Design: How to Do It Without the Cringe",
    excerpt: "Batik is one of Malaysia's most powerful visual assets. Used well, it gives digital products a distinctive, rooted identity. Used poorly, it reads as lazy cultural shorthand. Here's the difference.",
    image: IMG.culture,
    category: "Design",
    tags: ["design", "culture"],
    content: `<h2>Understanding What Batik Actually Is</h2>
<p>Batik is a wax-resist dyeing technique applied to cloth, creating patterns through controlled colour application. Malaysian batik (batik Malaysia) is distinct from Javanese batik — while both use the technique, Malaysian batik traditionally uses painting and block printing rather than the tjanting tool dominant in Java, and has evolved distinctive regional pattern vocabularies in Kelantan, Terengganu, and among non-Malay Malaysian batik artists. The patterns are not arbitrary decorations — many carry meaning, often drawn from nature: the pucuk rebung (bamboo shoot), bunga cengkeh (clove flower), and itik pulang petang (ducks returning at dusk) are among the commonly recognised motifs.</p>
<p>This context matters for designers considering batik in UI work. Using a batik pattern as a background tile without understanding what it is or communicates is the visual equivalent of using kanji characters as decoration without knowing their meaning. It's not illegal, but it's lazy, and it tends to produce results that feel culturally borrowed rather than rooted.</p>
<h2>Using Batik Well in Digital Design</h2>
<p>The most successful contemporary uses of batik in Malaysian digital design tend to be highly abstracted rather than literal. Taking the structural logic of batik — its rhythmic repetition, the organic quality of its forms, the controlled asymmetry within overall composition — and expressing it in a contemporary illustration or pattern style produces something that resonates culturally without feeling like a tourism poster. Petronas uses this well in its brand materials. Several Malaysian fashion and lifestyle brands have developed digital pattern languages that are clearly informed by batik without directly reproducing traditional motifs.</p>
<h2>The Practical Application</h2>
<p>For UI designers, the most effective applications of batik-inspired design are: illustration elements in empty states or onboarding flows that use the aesthetic vocabulary without the density of full pattern; brand identity work for Malaysian companies that benefits from a distinctive visual signature; seasonal design work around Hari Raya, where batik associations are culturally apt and contextually welcome; and textured background treatments that add visual warmth without visual noise. The caution is against using batik as a substitute for thinking — layering a batik texture over a generic white-label UI doesn't make it Malaysian, it makes it confused.</p>`,
  },
  {
    title: "Designing for Ramadan Campaigns: What Malaysian Brands Get Right and Wrong",
    excerpt: "Ramadan is Malaysia's most significant marketing season, with brands spending tens of millions on campaigns. The best work is culturally resonant and genuinely moving. The worst is cynical wallpaper. Here's how to tell the difference.",
    image: IMG.culture,
    category: "Design",
    tags: ["design", "culture"],
    content: `<h2>Why Ramadan Campaigns Matter</h2>
<p>Ramadan in Malaysia is not just a religious observance — it is the country's most significant annual cultural moment, touching Malay Muslim communities deeply and, through the festive commercial ecosystem around Hari Raya Aidilfitri that follows, affecting the broader Malaysian economy significantly. Consumer spending on food, clothing, home furnishings, and gifts peaks in the weeks leading up to and immediately following Hari Raya. The major brands — telcos, banks, retailers, F&B companies — invest heavily in Ramadan advertising because the emotional stakes of the season and the commercial volume justify it.</p>
<p>The best Malaysian Ramadan advertising — Petronas's annual films, Maybank's heritage stories, and independent work like those produced by creative studios such as Fishermen and Naga DDB — achieves something that most advertising never does: people seek it out and share it voluntarily, because it captures something true about the Malaysian experience of the season that audiences recognise and are moved by. These campaigns generate earned media reach that dwarfs their paid distribution.</p>
<h2>The Design Language of Ramadan</h2>
<p>Malaysian Ramadan visual design has developed recognisable conventions: warm amber and gold colour temperatures evoking lantern light; crescent moon and ketupat (woven palm leaf rice cake) iconography; kampung (village) and family gathering settings that evoke nostalgia; and a deliberately softer, warmer photographic treatment than the brand's standard commercial visual language. Used thoughtfully, these conventions communicate cultural belonging. Used mechanically, they become the visual equivalent of copy-pasting — the audience recognises the gestures without feeling them.</p>
<h2>What the Best Work Does Differently</h2>
<p>The Ramadan campaigns that resonate most deeply in Malaysia tend to be built around specific emotional truths rather than category conventions. The Petronas films that have achieved genuinely mass emotional impact have done so by finding a very specific human story — a son learning his father's trade, an estranged family reconciling, a foreigner embraced by Malaysian neighbours during the season — that resonates universally while feeling grounded in Malaysian particularity. The design lesson is that cultural specificity and emotional universality are not in tension: the more precisely true a story is to its cultural context, the more broadly it tends to resonate.</p>`,
  },
  {
    title: "UI Design for Malaysian Mobile Users: What the Data Shows",
    excerpt: "Designing for Malaysian mobile users requires understanding specific behavioral patterns, device constraints, and usage contexts that differ from Western benchmarks. Here's what the research shows.",
    image: IMG.mobile,
    category: "Design",
    tags: ["design", "ux"],
    content: `<h2>The Device Landscape</h2>
<p>Malaysia's mobile device market is bifurcated in a way that design systems need to accommodate. A significant segment of the population uses mid-range Android devices — Samsung A-series, Xiaomi Redmi, and Realme — with 4–6GB RAM, 720p–1080p displays, and processors that handle common apps competently but struggle with heavy rendering or background process loads. Another segment, concentrated among higher-income urban users, uses flagship devices where performance constraints disappear entirely. A third segment, particularly in rural and lower-income urban areas, uses entry-level Android devices where every kilobyte of APK size and every frame of animation matters for user experience.</p>
<p>The practical design implication: don't optimise for the device you're using to design and test. Test your product on a RM 600–900 Android device (Redmi Note or similar) to understand what the majority of your users actually experience. Animation that looks elegant on a Pixel 8 can feel laggy and battery-draining on a Redmi. Image loading that is instant on a flagship feels slow on a mid-range device with a congested WiFi connection.</p>
<h2>Malaysian Usage Patterns</h2>
<p>Malaysian mobile users tend toward high social media engagement (among the highest globally per capita), heavy messaging app usage (WhatsApp is dominant across demographics and geographies), and significant time on video content (YouTube and TikTok usage is extensive). E-wallet and payment app usage is high relative to regional peers. Voice assistant and smart home integration is relatively low, particularly outside urban affluent segments.</p>
<p>For consumer app designers, these patterns suggest: social sharing and WhatsApp forwarding functionality needs to be first-class, not an afterthought. Notification strategy should respect the high existing notification volume Malaysian users experience — a product that sends too many or poorly timed notifications gets muted immediately. Video content, even in product contexts (tutorial videos, social proof video testimonials), performs well with Malaysian audiences accustomed to video-native platforms.</p>
<h2>Accessibility in the Malaysian Context</h2>
<p>While global accessibility standards (WCAG) apply universally, the Malaysian context adds specific considerations. Colour contrast standards matter particularly for outdoor usage in Malaysia's bright sunshine — screens that are readable in a European office can be difficult to read in KL midday light even at maximum brightness. Touch target sizes need to be generous for the significant portion of Malaysian users using devices while commuting (LRT/MRT, bus), where precision tapping is compromised by movement. Supporting Malaysia's aging population — 15% of the population is 60+ and this percentage is growing — means testing with users across age ranges, not just the 25–35 demographic that typically dominates tech company user research.</p>`,
  },
  {
    title: "Wayfinding Design in Malaysian Cities: From KLCC to the MRT",
    excerpt: "Wayfinding — the design of how people navigate spaces — is one of design's most underappreciated disciplines. Malaysia has produced some genuinely excellent wayfinding systems and some instructive failures.",
    image: IMG.mrt,
    category: "Design",
    tags: ["design", "ux"],
    content: `<h2>What Wayfinding Is</h2>
<p>Wayfinding design is the system of visual cues, signage, landmarks, and spatial organisation that allows people to navigate through a built environment. At its best, wayfinding is invisible — people find their way without consciously noticing the design work enabling them. At its worst, wayfinding is a navigation nightmare: contradictory signs, absent information at critical decision points, and spatial design that confounds rather than guides.</p>
<p>Malaysia's public spaces span the full range of this quality spectrum. The PETRONAS Twin Towers and KLCC mall system have sophisticated wayfinding informed by international retail design standards. The MRT Putrajaya Line has benefited from thoughtful signage design that handles the complexity of a multi-line, multi-language system more successfully than its predecessor lines. Meanwhile, large portions of KL's older commercial and transit infrastructure — parts of Puduraya, several LRT stations, and much of the Pasa Seni underground — remain genuinely confusing even for regular users.</p>
<h2>The Multilingual Challenge</h2>
<p>Every piece of Malaysian public signage must function for readers across language backgrounds — Bahasa Malaysia (mandatory for official signage), English (universal second language among literate Malaysians), and ideally Chinese and Tamil in contexts where these communities are significant. The information hierarchy challenge this creates — which language appears at what size, in what position — is genuinely complex. The most successful Malaysian public signage systems use visual hierarchy (iconography, colour, spatial arrangement) as the primary wayfinding layer, with language-specific text as a secondary confirmation layer that doesn't require language literacy to navigate effectively.</p>
<h2>Digital Wayfinding</h2>
<p>The integration of digital wayfinding — interactive directories, app-based navigation, digital signage — into Malaysian public spaces is accelerating. KLCC and Pavilion KL use interactive directories that help shoppers find specific tenants. The Rapid KL journey planner app provides multimodal public transit navigation. The opportunity that remains largely untapped is the integration of indoor positioning — using Bluetooth beacons or WiFi triangulation to provide turn-by-turn navigation within complex spaces like hospital campuses, university buildings, or large government complexes. For Malaysian users who frequently navigate large, complex buildings (KLCC, UITM campuses, PPUM hospital), this represents a genuine quality-of-life design opportunity.</p>`,
  },
  {
    title: "Malaysian F&B Branding: How Local Food Businesses Are Finding Their Visual Voice",
    excerpt: "Malaysia's food scene is world-class. Its F&B branding has historically been an afterthought. A new generation of Malaysian food entrepreneurs is changing this — building visual identities that honour the food while competing at international design standards.",
    image: IMG.food,
    category: "Design",
    tags: ["design", "culture"],
    content: `<h2>The Old Model and Why It Limited Growth</h2>
<p>The traditional approach to Malaysian hawker and restaurant branding was functional rather than designed: a name (often the founder's name or a location), printed on a banner or vinyl sign in standard fonts, sometimes with a clip-art illustration of the hero dish. This approach worked for the economic model it served — regulars knew the food was good, and location and word of mouth drove the business. But it imposed a glass ceiling: brands built this way could not expand beyond their original location, attract premium pricing, or build the visual equity needed for retail distribution or franchise models.</p>
<p>The F&B businesses that have broken through this ceiling in Malaysia — Nasi Kandar Pelita, OldTown White Coffee, PappaRich, Madam Kwan's — have done so in part by investing in visual identity systems that communicate quality and can travel. Their logos, interior design languages, packaging systems, and menu design create a consistent experience that customers can recognise and trust across locations.</p>
<h2>The New Generation</h2>
<p>What's different about Malaysian F&B branding in the 2020s is the ambition and sophistication level. Artisan roti bakar brands, specialty kopi concepts, and modern takes on traditional kuih shops are being designed with the same intentionality as high-end café concepts in Tokyo or Melbourne. Brands like Batu Road Roasters, Jibril, and a cohort of Penang-based heritage food concepts have developed visual identities that are unapologetically Malaysian and simultaneously competitive with international design standards. Social media has been the engine: beautiful packaging and interior design generates organic sharing, which drives discovery and foot traffic in a way that traditional advertising cannot match for small businesses.</p>
<h2>What Works for Malaysian F&B</h2>
<p>The visual approaches that resonate most strongly in contemporary Malaysian F&B branding tend to share several qualities: warmth in colour palette (earth tones, warm oranges and yellows that evoke spice and heat), illustration styles that feel hand-drawn or craft-derived rather than corporate-generic, typography that is strong and confident without being aggressive, and packaging materials that are tactilely satisfying as well as visually distinctive. Heritage cues — wax paper wrapping, tin containers, brown kraft packaging — signal quality and tradition in the same breath, particularly effective for products with genuine provenance stories.</p>`,
  },
  {
    title: "The Malaysian Color Palette: Designing With Tropical Warmth",
    excerpt: "Malaysia's visual environment — its food, its festivals, its flora, its market stalls — is saturated with a specific kind of warmth that informs the most distinctly Malaysian design work. Here's how to work with it intentionally.",
    image: IMG.culture,
    category: "Design",
    tags: ["design", "ux"],
    content: `<h2>Reading the Environment</h2>
<p>Step into a Malaysian pasar malam, a Hari Raya bazaar, a Chinese temple, or a Hindu festival and you're immersed in a specific chromatic vocabulary: the deep reds and golds of Chinese New Year decorations, the greens and yellows of ketupat and kuih, the bright blues and whites of mosque tiles, the orange and yellow of turmeric in curry stalls, the vivid magenta of bougainvillea climbing roadside fences. Malaysian colour culture is not subtle. It is celebratory, contrasting, and warm.</p>
<p>This environmental colour richness is an underused resource for Malaysian designers. The most distinctly Malaysian design work — from Petronas's brand palette to the visual language of Nasi Lemak-themed merchandise that somehow appeals globally — draws from this environmental richness deliberately. It doesn't copy wholesale, but it carries the warmth, the saturation, and the cultural associations of the colours that define Malaysian visual experience.</p>
<h2>Building a Malaysian-Inflected Palette</h2>
<p>Several colour relationships recur in Malaysian design that reads as culturally grounded. The pairing of deep forest green with gold feels distinctly Malay — it appears in traditional songket, mosque decoration, and contemporary batik. Terracotta and cream (warm ceramics palette) echoes both Peranakan tile traditions and the interior colour schemes of pre-independence shophouses. Deep red with black and gold is quintessentially Chinese Malaysian — recognisable from restaurant signage to festival packaging to Chinese newspaper aesthetics.</p>
<p>For contemporary product and interface design, the warmest application of Malaysian colour sensibility is in accent and illustration choices rather than primary UI colours. A predominantly neutral interface (grey, white, off-white) with a warm orange-terracotta or forest-green accent reads more distinctly Malaysian than a grey and blue interface — not by announcing its identity but by carrying the warmth of the environment in its most emotionally charged elements.</p>
<h2>What to Avoid</h2>
<p>The failure mode in Malaysian design colour use is the flag palette — red, yellow (from the Malaysian flag's crescent and star), and blue, assembled in a composition that reads as nationalistic rather than culturally resonant. Government design defaults to this palette so consistently that it has become associated with bureaucracy rather than culture. Contemporary Malaysian design that aims for premium positioning or genuine cultural expression tends to find its colour relationships in the environment and heritage described above rather than in the flag's literal colours.</p>`,
  },
  {
    title: "Packaging Design in Malaysia: The Artisan Food Movement",
    excerpt: "Malaysian artisan food producers are creating packaging that competes with the world's best. Here's what's driving the movement and what designers and brand owners can learn from it.",
    image: IMG.packaging,
    category: "Design",
    tags: ["design", "culture"],
    content: `<h2>What Changed</h2>
<p>Five years ago, a Malaysian artisan pineapple tart producer or homemade sambal maker typically packaged their product in a basic plastic container with a printed label from a neighbourhood print shop. Functional, invisible, no premium signal. Today, the same category has producers who invest in custom die-cut boxes, tissue paper wrapping, wax seals, handwritten notes, and photography that makes the product look as beautiful as it tastes. This shift was driven by three converging forces: Instagram and TikTok creating discovery channels that reward visual beauty, the pandemic home-baking boom generating a new cohort of food entrepreneurs who approached the business with design literacy, and consumers increasingly willing to pay premium prices for products whose packaging communicated commensurate quality.</p>
<p>Platforms like Etsy, Shopee, and Instagram gave these producers direct access to consumers willing to pay for quality — circumventing traditional retail channels where shelf placement was expensive and the packaging needed to compete visually at a distance of two metres. In the social media context, packaging needs to look beautiful in a photograph taken on a kitchen table, not in a Jaya Grocer aisle.</p>
<h2>The Design Approaches That Work</h2>
<p>Malaysian artisan food packaging that achieves premium positioning tends to share several characteristics. Restraint in typography — one or two typefaces, confident hierarchy, generous white space — versus the "fill all available space" approach that dominated earlier generations of Malaysian food packaging. Texture and material quality — kraft paper, textured cardstock, matte lamination — that communicates craft values through touch before a word is read. Illustration rather than photography for hero design elements, particularly for producers who cannot access high-end food photography on artisan budgets. And brand story integration — the who, why, and how behind the product — that gives the packaging something to communicate beyond ingredients and price.</p>
<h2>The Practical Challenge</h2>
<p>The economics of artisan packaging present real constraints for small producers. Minimum order quantities for custom printed packaging are typically 500–1,000 units, requiring capital commitment before sales validate demand. Offset printing costs per unit drop dramatically at scale but remain high at low volumes. The solutions that Malaysian artisan producers have developed — blank kraft boxes with custom stickers, digital printing for short runs from local print services, and deliberate minimalism that reduces multi-colour printing costs — have become a recognisable Malaysian artisan aesthetic in their own right: simple, warm, honest materials that communicate craftsmanship without overclaiming.</p>`,
  },
  {
    title: "Malaysia's Graphic Design History: From Independence Posters to Digital Nation",
    excerpt: "Malaysian graphic design has a 67-year history that most practitioners don't know. Understanding where Malaysian visual culture came from illuminates what contemporary designers are working with and against.",
    image: IMG.creative,
    category: "Design",
    tags: ["design", "culture"],
    content: `<h2>The Independence Era</h2>
<p>Malaysian graphic design's formal history begins in 1957, when Independence created an immediate need for national visual identity: flags, official seals, postage stamps, government stationery, and the visual language of a new nation. The designers who created these were predominantly trained in the British tradition — the Commonwealth's Royal College of Art produced many of the senior practitioners — producing work that blended British design conventions with emerging Malaysian visual vocabulary.</p>
<p>The postage stamp archive of the 1960s and 1970s is a remarkable document of Malaysian graphic design history — small canvases where artists found ways to represent Malaysia's biodiversity, cultural heritage, and nation-building ambitions within the constraints of a centimetre-scale format. The Malaysia Philatelic Bureau's stamp designs from this period deserve more attention from contemporary designers than they typically receive.</p>
<h2>The Advertising Age</h2>
<p>The 1980s and 1990s brought the professionalisation of Malaysian advertising and the rise of local creative agencies. Leo Burnett, Ogilvy, and J. Walter Thompson established Malaysian operations, bringing international creative standards and training a generation of Malaysian creatives. The work of this era — particularly the Petronas advertising that began in the 1980s and accelerated around the 1998 Commonwealth Games hosting — represents the point at which Malaysian commercial design reached genuine international competitiveness.</p>
<p>The Petronas Merdeka films, which began as annual TV commercials and have become a cultural institution, represent Malaysian brand storytelling at its most sophisticated. The creative teams behind this work — predominantly Malaysian despite the international agency frameworks — developed a visual and narrative language for Malaysian emotional experience that has influenced a generation of local creatives.</p>
<h2>The Digital Generation</h2>
<p>Contemporary Malaysian graphic design practice has been shaped by the same forces as global design: the democratisation of professional-grade tools (Adobe Creative Suite available to anyone, Figma free at professional level), global design education (Behance, Dribbble, YouTube tutorials accessible from KL as easily as from London), and the social media context that rewards visual distinctiveness above production quality credentials. The result is a generation of Malaysian designers who are more globally aware than any predecessor generation while simultaneously more interested in finding distinctly Malaysian visual voices — a healthy creative tension that is producing the most interesting Malaysian design work in the country's history.</p>`,
  },
]

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seed is disabled in production." }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated. Log in at /admin first, then visit /api/seed." },
      { status: 401 }
    )
  }

  const results: string[] = []

  // ── 1. Ensure categories ────────────────────────────────────────────────────
  const categoryNames = ["Technology", "Business", "Design"]
  const categoryMap: Record<string, string> = {}

  for (const name of categoryNames) {
    const catSlug = slug(name)
    const { data: existing } = await supabase
      .from("categories").select("id").eq("slug", catSlug).maybeSingle()

    if (existing) {
      categoryMap[name] = existing.id
    } else {
      const { data: created, error } = await supabase
        .from("categories").insert({ name, slug: catSlug }).select("id").single()
      if (error) { results.push(`⚠️  Category "${name}": ${error.message}`); continue }
      categoryMap[name] = created.id
      results.push(`✅ Category: ${name}`)
    }
  }

  // ── 2. Create posts ─────────────────────────────────────────────────────────
  for (const post of POSTS) {
    const postSlug = slug(post.title)

    const { data: existing } = await supabase
      .from("posts").select("id").eq("slug", postSlug).maybeSingle()

    if (existing) { results.push(`⏭️  Exists: ${post.title}`); continue }

    const { data: created, error: postError } = await supabase
      .from("posts")
      .insert({
        title:          post.title,
        slug:           postSlug,
        content:        post.content,
        excerpt:        post.excerpt,
        status:         "published",
        featured_image: post.image,
        author_id:      user.id,
        published_at:   new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        view_count:     Math.floor(Math.random() * 1200) + 100,
      })
      .select("id").single()

    if (postError || !created) {
      results.push(`❌ Failed: ${post.title} — ${postError?.message}`)
      continue
    }

    // Link category
    const catId = categoryMap[post.category]
    if (catId) {
      await supabase.from("post_categories").insert({ post_id: created.id, category_id: catId })
    }

    // Upsert & link tags
    for (const tagName of post.tags) {
      const tagSlug = slug(tagName)
      const { data: tag } = await supabase
        .from("tags")
        .upsert({ name: tagName, slug: tagSlug }, { onConflict: "slug" })
        .select("id").single()
      if (tag) {
        await supabase.from("post_tags").insert({ post_id: created.id, tag_id: tag.id })
      }
    }

    results.push(`✅ ${post.title}`)
  }

  const html = `<!DOCTYPE html><html>
<head><meta charset="utf-8"><title>Seed — Bloggie</title>
<style>body{font-family:system-ui,sans-serif;max-width:700px;margin:60px auto;padding:0 24px;background:#faf9f5;color:#141413}
h1{font-size:1.5rem;margin-bottom:6px}p{color:#b0aea5;font-size:.875rem;margin-bottom:24px}
ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:6px}
li{background:white;border:1px solid #e8e6dc;border-radius:10px;padding:10px 14px;font-size:.875rem}
a{display:inline-block;margin-top:24px;background:#141413;color:white;text-decoration:none;padding:10px 20px;border-radius:10px;font-size:.875rem}
a:hover{background:#d97757}</style></head>
<body><h1>🌱 Seed complete</h1>
<p>${results.length} operations · ${POSTS.length} posts attempted · Malaysia context</p>
<ul>${results.map(r => `<li>${r}</li>`).join("")}</ul>
<a href="/">← View Blog</a>
<a href="/admin" style="margin-left:10px">Admin Dashboard →</a>
</body></html>`

  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}
