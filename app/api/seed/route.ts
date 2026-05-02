import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// ── Helpers ──────────────────────────────────────────────────────────────────
function slug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

// ── Image URLs (Unsplash CDN — free, no key needed) ──────────────────────────
const IMAGES = {
  ai:           "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  design:       "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
  typescript:   "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  color:        "https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1200&q=80",
  desk:         "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=1200&q=80",
  darkmode:     "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=1200&q=80",
  typography:   "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
  a11y:         "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
  opensource:   "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  database:     "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
}

// ── Post data ─────────────────────────────────────────────────────────────────
const POSTS = [
  {
    title: "The State of Artificial Intelligence in 2025",
    excerpt: "AI is no longer a distant concept — it's reshaping how we work, create, and communicate. Here's where things stand today.",
    image: IMAGES.ai,
    category: "Technology",
    tags: ["ai", "machine-learning", "future"],
    content: `
<h2>From Science Fiction to Daily Reality</h2>
<p>Artificial intelligence has moved out of research labs and into everyday tools. In 2025, AI is embedded in everything from the apps on your phone to the way hospitals diagnose disease. But what does that actually mean, and where are we headed?</p>
<p>The last three years have seen a step-change in capability. Large language models can now write code, draft legal documents, generate images from text, and hold nuanced conversations. What was impossible in 2020 is now a free tier feature.</p>

<h2>The Big Players and What They're Building</h2>
<p>The AI landscape is dominated by a handful of well-funded labs — OpenAI, Anthropic, Google DeepMind, and Meta AI — each racing to push the frontier of what's possible. Their models are getting cheaper, faster, and more capable with every release cycle.</p>
<ul>
  <li><strong>OpenAI</strong> continues to iterate on the GPT family, with multimodal capabilities becoming standard.</li>
  <li><strong>Anthropic</strong> has focused on safety-first development, with Claude leading in reasoning and long-context tasks.</li>
  <li><strong>Google DeepMind</strong> is deeply embedded in search and productivity tools through Gemini.</li>
  <li><strong>Meta AI</strong> has open-sourced Llama, making powerful models available to anyone with a GPU.</li>
</ul>

<h2>Where AI Is Having Real Impact</h2>
<p>Beyond the hype, AI is genuinely transforming a few industries in measurable ways:</p>
<h3>Healthcare</h3>
<p>AI models trained on medical imaging can detect cancers earlier than human radiologists in controlled studies. Drug discovery timelines, once measured in decades, are being compressed to years using AI-guided protein folding and compound screening.</p>
<h3>Software Development</h3>
<p>Tools like GitHub Copilot and Cursor have changed how developers write code. Studies suggest experienced developers write 40–55% more code per day with AI assistance — though the quality gate remains human.</p>
<h3>Creative Work</h3>
<p>Image generation, music composition, and video synthesis are now available to anyone. This has sparked both extraordinary creative work and serious debates about authorship, copyright, and economic displacement for creatives.</p>

<h2>The Challenges We're Still Working Through</h2>
<p>Progress hasn't come without friction. Hallucination — where AI models confidently produce false information — remains an unsolved problem. Bias in training data leads to bias in outputs. Energy consumption for large model training is significant and growing.</p>
<p>There's also the economic question. As AI automates tasks that previously required humans, the nature of work will shift. Some jobs will disappear; many new roles will emerge. The transition won't be frictionless.</p>

<h2>What Comes Next</h2>
<p>The next frontier is agentic AI — models that don't just answer questions but take actions in the world. Book a flight, write and deploy code, negotiate a price, run a scientific experiment. We're in early days, but the building blocks are in place.</p>
<p>AI in 2025 is powerful, imperfect, and accelerating. The most important skill isn't learning to use any particular tool — it's developing the judgment to know when and how to trust machine output, and when human oversight is essential.</p>
    `.trim(),
  },
  {
    title: "10 Design Principles Every Designer Should Know",
    excerpt: "From contrast to hierarchy, these 10 timeless principles separate good design from great design.",
    image: IMAGES.design,
    category: "Design",
    tags: ["ui", "ux", "design-principles"],
    content: `
<p>Design is not decoration. It's a system of decisions that shapes how people experience the world. Whether you're designing a button or a city, the same principles apply. Here are ten that every designer should have internalized.</p>

<h2>1. Hierarchy</h2>
<p>Visual hierarchy is the order in which the eye reads a composition. Size, color, weight, and position all contribute to telling the viewer what matters most. If everything is important, nothing is. Design with intention about what you want seen first, second, and third.</p>

<h2>2. Contrast</h2>
<p>Contrast creates distinction. Without it, elements blur together and meaning is lost. Contrast works across color, size, shape, and texture. High contrast between text and background isn't just aesthetic — it's an accessibility requirement.</p>

<h2>3. Alignment</h2>
<p>Nothing should be placed arbitrarily. Every element should have a visual connection to something else on the page. Grid systems exist to enforce alignment, giving layouts a sense of order even when content varies wildly.</p>

<h2>4. Proximity</h2>
<p>Elements that are close together are perceived as related. Group related information; separate unrelated information. Labels should be adjacent to their inputs. A caption should sit tight beneath its image. Proximity communicates structure without words.</p>

<h2>5. Repetition</h2>
<p>Repetition creates visual consistency and strengthens identity. If you use a particular color for all primary actions, the user learns that color means "do something." Breaking that pattern creates confusion; maintaining it builds trust.</p>

<h2>6. White Space</h2>
<p>Space is not empty — it's a design element. Generous white space makes content easier to read, highlights what matters, and signals quality. Crowded interfaces feel cheap. Space gives ideas room to breathe.</p>

<h2>7. Color Theory</h2>
<p>Color carries meaning — cultural, psychological, and contextual. Red signals urgency or danger; green signals success or nature; blue builds trust. Understand the context you're designing for before reaching for the color palette.</p>

<h2>8. Typography</h2>
<p>The choice of typeface, size, weight, line height, and letter spacing affects readability more than almost any other decision. Good typography is often invisible — it guides the eye without drawing attention to itself.</p>

<h2>9. Affordance</h2>
<p>Affordance is the perceived property of an element that tells you how to use it. A button looks pressable. A slider looks draggable. When affordance is wrong — when an interactive element doesn't look interactive — users get frustrated and abandon tasks.</p>

<h2>10. Feedback</h2>
<p>Every action should produce a reaction. A button press should change state. A form submission should confirm success or explain failure. Without feedback, users don't know if their action was registered — and they'll keep clicking.</p>

<h2>The Meta-Principle</h2>
<p>Behind all ten principles is a single question: <em>does this serve the user?</em> Principles are tools, not rules. The best designers know when to apply them and — equally important — when to break them intentionally.</p>
    `.trim(),
  },
  {
    title: "Why TypeScript Has Won",
    excerpt: "TypeScript now powers the majority of large-scale JavaScript projects. Here's why it became the default choice for modern development.",
    image: IMAGES.typescript,
    category: "Technology",
    tags: ["typescript", "javascript", "programming"],
    content: `
<p>In 2012, Microsoft released TypeScript to a JavaScript world that was deeply skeptical. "We already have a language," was the common response. Thirteen years later, TypeScript is the default choice for every major framework, used by millions of developers, and has fundamentally changed how we think about JavaScript at scale.</p>

<h2>What TypeScript Actually Is</h2>
<p>TypeScript is a superset of JavaScript — every valid JavaScript file is a valid TypeScript file. It adds a type system on top of JavaScript's dynamic foundation, which gets compiled away at build time. The runtime is still plain JavaScript. No browser or Node.js runtime changes required.</p>
<p>That elegance — types as a layer you opt into, not a completely different language — is a big part of why adoption happened so smoothly.</p>

<h2>The Turning Point: Framework Adoption</h2>
<p>The inflection point for TypeScript wasn't a single event — it was a series of framework teams choosing it as their default:</p>
<ul>
  <li><strong>Angular</strong> rewrote itself in TypeScript in 2016</li>
  <li><strong>Next.js</strong> added zero-config TypeScript support in 2019</li>
  <li><strong>Deno</strong> was built from scratch with TypeScript as a first-class citizen</li>
  <li><strong>tRPC, Zod, Prisma</strong> — the modern full-stack toolkit — are TypeScript-native</li>
</ul>
<p>Once the ecosystem momentum reached critical mass, choosing plain JavaScript for a new project started to feel like a deliberate downgrade.</p>

<h2>What You Actually Get</h2>
<h3>Autocomplete That Works</h3>
<p>With TypeScript, your editor knows the shape of every object, the signature of every function, the values of every enum. Autocomplete goes from guessing to knowing. This alone pays back the learning curve within a week.</p>
<h3>Refactoring Confidence</h3>
<p>Rename a property in a JavaScript codebase and you'll spend hours hunting for the places that broke. In TypeScript, the compiler finds them instantly. Large refactors that would take days become safe, fast operations.</p>
<h3>Self-Documenting Code</h3>
<p>Types are documentation that stays in sync with the code, because they have to. A function signature tells you what goes in and what comes out — without reading the implementation or hoping the JSDoc comment was updated.</p>

<h2>The Honest Cost</h2>
<p>TypeScript isn't free. There's a learning curve. Build steps get more complex. Sometimes the type system fights you on perfectly valid patterns. The compiler errors can be cryptic until you've internalized the mental model.</p>
<p>For small projects or quick prototypes, the overhead genuinely might not be worth it. But for any project that will grow, that multiple people will touch, that needs to survive longer than six months — TypeScript earns back its cost many times over.</p>

<h2>The Bottom Line</h2>
<p>TypeScript has won not because Microsoft forced it on the ecosystem, but because developers who used it didn't want to go back. That's the most honest signal an engineering tool can send. If you're still on the fence, the fence is increasingly lonely ground.</p>
    `.trim(),
  },
  {
    title: "The Psychology of Color in UI Design",
    excerpt: "Colors are silent communicators. Understanding how they influence emotion is one of the most powerful tools in a designer's toolkit.",
    image: IMAGES.color,
    category: "Design",
    tags: ["color", "psychology", "branding"],
    content: `
<p>Before a user reads a single word, before they interact with a single element, color has already made an impression. It communicates mood, establishes hierarchy, signals status, and triggers associations built from a lifetime of experience. Understanding this is fundamental to intentional design.</p>

<h2>How Color Processing Works</h2>
<p>Color perception starts in the eye and finishes in the brain — and the brain is not a neutral processor. It carries millions of years of evolved associations (red as danger, green as life) layered with cultural conditioning and personal experience. A designer can't fully control how color is received, but they can work with the probabilities.</p>

<h2>The Major Colors and Their Associations</h2>
<h3>Red</h3>
<p>Red is the highest-energy color in the visible spectrum. It accelerates heart rate and creates urgency — which is why it appears on error states, sale badges, and notification dots. Used sparingly, it commands attention. Used everywhere, it creates anxiety.</p>
<h3>Blue</h3>
<p>Blue is the world's most popular "favorite color" and the default choice for trust-sensitive industries: banking, healthcare, social networks. It reads as calm, reliable, and professional. Its ubiquity in tech UI is a feature — users associate it with interactivity.</p>
<h3>Green</h3>
<p>Green signals success, safety, and permission — the color of "go" signals, checkmarks, and confirmation states. It also carries strong associations with nature and sustainability, making it a common choice for environmental brands.</p>
<h3>Orange</h3>
<p>Orange sits between the urgency of red and the optimism of yellow. It's warm, energetic, and approachable — strong for calls to action and brand personality without the danger associations of red. It's a color that invites, rather than demands.</p>
<h3>Black and White</h3>
<p>Black communicates sophistication, authority, and finality. White communicates space, cleanliness, and possibility. Together they provide maximum contrast. Many of the most respected brands live in this space because neutrality lets the work speak.</p>

<h2>Color in UI: Practical Rules</h2>
<ul>
  <li><strong>60-30-10 Rule:</strong> 60% dominant color (usually a neutral), 30% secondary, 10% accent. Keeps palettes balanced without feeling random.</li>
  <li><strong>Semantic consistency:</strong> Use red for errors, green for success, yellow for warnings — always. Breaking this confuses users who've built up expectations from every other interface they've used.</li>
  <li><strong>Contrast ratios:</strong> WCAG AA requires a minimum 4.5:1 contrast ratio between text and background. This isn't aesthetic guidance — it's accessibility law in many jurisdictions.</li>
  <li><strong>Test in context:</strong> Colors look different next to each other than in isolation. Always test your palette in the real interface, not in a color swatch grid.</li>
</ul>

<h2>Dark Mode and Color</h2>
<p>Dark mode forces a rethinking of color relationships. Pure white on pure black creates halation — an uncomfortable glow effect. Successful dark themes use off-white text on dark-but-not-black backgrounds. Accent colors often need desaturation; the vivid orange that works on white can feel garish against dark backgrounds.</p>

<h2>The Takeaway</h2>
<p>Color is never just decoration. Every hue is a decision with psychological, cultural, and accessibility implications. The best approach is to be intentional: choose colors for reasons, test them rigorously, and treat accessibility as a constraint that makes your work better, not an afterthought that makes it harder.</p>
    `.trim(),
  },
  {
    title: "Building a Minimal Home Office That Actually Works",
    excerpt: "A cluttered desk is a cluttered mind. Here's how to set up a workspace that keeps you focused, comfortable, and calm.",
    image: IMAGES.desk,
    category: "Design",
    tags: ["workspace", "productivity", "minimalism"],
    content: `
<p>The home office has gone from novelty to necessity for millions of people. But most home offices are a compromise — a corner of a bedroom, a kitchen table, a sofa with a laptop. It doesn't have to be that way. A small, intentional setup can outperform a corporate cubicle.</p>

<h2>Start With the Chair</h2>
<p>If you spend six or eight hours a day in a chair, it's the most important piece of furniture you own. A bad chair leads to back pain that will cost you far more — in discomfort, medical bills, and lost productivity — than a good chair ever will.</p>
<p>You don't need the most expensive ergonomic chair on the market. You need one with lumbar support, adjustable seat height, and armrests that bring your shoulders to a natural, relaxed position. Sit in it before you buy it.</p>

<h2>Screen Position Is Everything</h2>
<p>The top of your monitor should be at or slightly below eye level. If you're looking down at a laptop screen for hours, you'll develop neck and shoulder strain. A laptop stand and external keyboard is a $40 fix to a problem that otherwise costs you in pain and physio appointments.</p>
<p>Distance matters too. Your screen should be roughly an arm's length away — close enough to read clearly, far enough that your eyes aren't working harder than they need to.</p>

<h2>Control Your Light</h2>
<p>Natural light is excellent — but not directly on your screen. Position your desk perpendicular to the window, not facing it or with it behind you. Glare is the enemy of sustained focus.</p>
<p>For artificial light, avoid harsh overhead lighting that casts shadows on your work surface. A simple desk lamp with a warm-to-neutral bulb positioned to the side of your screen is enough. If you do video calls, a small ring light or a lamp positioned in front of you (not behind) makes a significant visual difference.</p>

<h2>The One Plant Rule</h2>
<p>Research consistently shows that having at least one plant in a workspace improves mood, reduces stress, and increases perceived air quality. You don't need a garden — one medium-sized plant is enough. A snake plant or pothos works well in low-light conditions and requires almost no maintenance.</p>

<h2>Cable Management Is Worth the Hour</h2>
<p>A desk with visible cable chaos is harder to work at, not just harder to look at. Spend an hour with some velcro ties, a cable tray mounted under the desk, and a short extension lead. The result is a surface that feels organized and invites work rather than resisting it.</p>

<h2>Keep the Surface Clear</h2>
<p>Everything on your desk should earn its place. If you haven't used it in the past week, move it. A notebook, a pen, your input devices, and your drink. That's it. The desktop on your computer screen follows the same principle — a clean desktop lowers cognitive load before you even start working.</p>

<h2>The Setup You Have vs. The Setup You Need</h2>
<p>The best setup is the one you'll actually use, not the one in the YouTube video with the perfect RGB lighting and cable-managed dream. Start with what you have, fix the most painful problems first (usually chair and screen height), and iterate. Perfectionism about workspace setup is often a form of productive procrastination.</p>
    `.trim(),
  },
  {
    title: "Dark Mode: More Than Just an Aesthetic Choice",
    excerpt: "Dark mode reduces eye strain, saves battery, and looks premium — but there's a right way and a wrong way to implement it.",
    image: IMAGES.darkmode,
    category: "Design",
    tags: ["dark-mode", "accessibility", "ui"],
    content: `
<p>Dark mode went from a power-user preference to a mainstream expectation in a remarkably short time. iOS 13 and Android 10 added system-level dark mode in 2019 and overnight, every app was expected to support it. But what started as a stylistic trend has deeper foundations in human factors, accessibility, and battery performance.</p>

<h2>Why People Actually Want Dark Mode</h2>
<p>The most commonly cited reason is eye strain — and there's real basis to it. In dark environments, a bright white screen forces your pupils to constrict, which is fatiguing over time. Dark mode reduces that contrast between screen and surroundings, making extended reading more comfortable in low light.</p>
<p>Battery savings are real but context-dependent. On OLED and AMOLED displays, black pixels are literally switched off, so dark UIs consume significantly less power. On LCD displays, the backlight is always on, so the savings are minimal. As OLED screens dominate the mobile market, this benefit becomes more universally relevant.</p>

<h2>The Accessibility Angle</h2>
<p>For users with certain visual conditions — photophobia, migraine disorders, or some forms of dyslexia — dark mode isn't a preference, it's a necessity. Others have the opposite experience: for many users with dyslexia, dark text on a light background is significantly more readable than the reverse.</p>
<p>This tension is why the right implementation gives users a choice, doesn't just pick one side. The best products respect <code>prefers-color-scheme</code> by default and let users override it.</p>

<h2>Getting Dark Mode Right</h2>
<h3>Don't Use Pure Black</h3>
<p>Pure <code>#000000</code> backgrounds with pure white text create halation — a blurring or glowing effect caused by the extreme contrast. Use slightly elevated dark tones: <code>#141413</code>, <code>#1e1d1b</code>, <code>#121212</code>. They read as "black" but are far more comfortable to look at.</p>
<h3>Colors Behave Differently in the Dark</h3>
<p>Saturated accent colors that look great on white backgrounds can feel garish, even aggressive, against dark backgrounds. Reduce saturation slightly for dark mode variants of your brand colors. Orange and red in particular benefit from this treatment.</p>
<h3>Watch Your Shadows</h3>
<p>Box shadows — the workhorse of depth cues in light UIs — are nearly invisible against dark backgrounds. In dark mode, use subtle background color elevation instead: make a raised element slightly lighter than its parent, rather than adding a shadow beneath it.</p>
<h3>Images and Media Don't Invert</h3>
<p>When you implement dark mode, your UI colors change — but images don't. A photograph looks the same on a dark or light background. Make sure your image containers and padding values work aesthetically in both contexts.</p>

<h2>The CSS Implementation</h2>
<p>The modern approach is a single CSS variable set with two definitions — one under <code>:root</code> and one under <code>:root.dark</code> (or using <code>prefers-color-scheme</code> media query for auto-switching). Every color in your system references a variable, never a hard-coded value. Switching themes becomes a single class toggle on the HTML element.</p>

<h2>Test, Then Test Again</h2>
<p>Dark mode bugs are invisible until you look for them. Hardcoded colors that looked fine in light mode become glaring problems in dark mode. Schedule explicit dark mode QA passes. Check every state — hover, focus, disabled, error — in both modes before shipping.</p>
    `.trim(),
  },
  {
    title: "The Art of Typography: Choosing Fonts That Speak",
    excerpt: "Typography is 95% of web design. The wrong font choice undermines even the most polished interface.",
    image: IMAGES.typography,
    category: "Design",
    tags: ["typography", "fonts", "visual-design"],
    content: `
<p>The web designer Jeffery Zeldman once said that "web design is 95% typography." That number is debatable, but the underlying point is not. The primary medium of communication on the web is text, and how that text is set is one of the most consequential design decisions you'll make.</p>

<h2>The Two Jobs of a Typeface</h2>
<p>Every typeface has two jobs: to convey the information it contains, and to communicate the personality of the brand or author behind it. When these two jobs are in conflict — when a typeface is expressive but illegible, or readable but tonally wrong — it fails. The best type choices do both simultaneously, invisibly.</p>

<h2>Typeface Categories and What They Signal</h2>
<h3>Serif</h3>
<p>Serifs — the small strokes at the ends of letterforms — originated in stone carving and calligraphy. They signal tradition, authority, and editorial credibility. The New York Times uses serif type because it wants to project hundreds of years of journalistic heritage. Serif type is also often more readable at longer line lengths, which is why it dominates printed books.</p>
<h3>Sans-Serif</h3>
<p>Remove the serifs and you get clean, modern letterforms that signal clarity, efficiency, and modernity. The entire tech industry defaults to sans-serif — Helvetica, SF Pro, Inter, Roboto — because it reads as forward-thinking and accessible. At small sizes and on screens, sans-serif often outperforms serif for legibility.</p>
<h3>Display and Decorative</h3>
<p>Some typefaces aren't meant for body text at all. They're designed for headlines, posters, and brand marks — maximum personality at large sizes, often illegible or exhausting at small sizes. Use them for impact, never for reading.</p>
<h3>Monospace</h3>
<p>Every character in a monospace typeface occupies the same horizontal width. This makes them ideal for code — you can align characters vertically and count characters easily. They also signal "technical" and "developer-facing" when used deliberately in UI design.</p>

<h2>The Rules of Pairing</h2>
<p>Most sophisticated typographic systems use two typefaces: one for headings and one for body text. The pairing should create contrast without conflict. Classic approaches:</p>
<ul>
  <li><strong>Serif heading + sans-serif body:</strong> Editorial authority meets modern readability. Used by major publications worldwide.</li>
  <li><strong>Display heading + neutral body:</strong> Strong personality at the top, letting content take centre stage in the body.</li>
  <li><strong>Same typeface family, different weights:</strong> The safest pairing. A bold heading weight and regular body weight from the same family creates coherence with built-in contrast.</li>
</ul>

<h2>What Actually Makes Text Readable</h2>
<p>The typeface itself is only part of readability. The settings matter as much or more:</p>
<ul>
  <li><strong>Line length:</strong> 60–75 characters per line is the reading sweet spot. Too short and the eye moves too fast; too long and it struggles to find the next line.</li>
  <li><strong>Line height:</strong> Body text typically needs 1.5–1.8× the font size to breathe properly. Tight line height looks stylish in headlines; in body text it makes reading fatiguing.</li>
  <li><strong>Font size:</strong> 16px is the minimum for comfortable body text on screen. Many designers go to 17–18px, especially for editorial contexts.</li>
  <li><strong>Font weight:</strong> Body text should sit between 400 and 500 weight. Below 400, text disappears against colored backgrounds. Above 500, it feels heavy to sustain across paragraphs.</li>
</ul>

<h2>Google Fonts: The Best Free Starting Points</h2>
<p>For web projects without budget for licensed type, <strong>Inter</strong> (clean, highly legible sans-serif), <strong>Lora</strong> (elegant editorial serif), <strong>Poppins</strong> (geometric, modern), and <strong>Source Serif 4</strong> (professional, readable) cover most use cases well. They're battle-tested, widely used, and free.</p>
    `.trim(),
  },
  {
    title: "Web Accessibility: Building for Everyone",
    excerpt: "Over a billion people have some form of disability. Accessible design isn't a feature — it's a baseline.",
    image: IMAGES.a11y,
    category: "Technology",
    tags: ["accessibility", "a11y", "inclusive-design"],
    content: `
<p>Approximately 1.3 billion people — 16% of the global population — live with some form of disability. Visual impairments, motor limitations, cognitive differences, and hearing loss all affect how people interact with digital products. And yet, accessibility is treated as an afterthought on the majority of websites built today.</p>
<p>This isn't just a moral issue. It's a legal one in many jurisdictions, a business case in every market, and — when you actually understand it — a force that makes products better for everyone.</p>

<h2>What Accessibility Actually Covers</h2>
<p>Accessibility isn't just about screen readers, though that's the most commonly cited use case. It covers:</p>
<ul>
  <li><strong>Visual:</strong> Blindness, low vision, color blindness</li>
  <li><strong>Motor:</strong> Limited fine motor control, inability to use a mouse, switch control users</li>
  <li><strong>Cognitive:</strong> Dyslexia, ADHD, memory limitations</li>
  <li><strong>Auditory:</strong> Deafness, hard of hearing (primarily affects video/audio content)</li>
  <li><strong>Situational:</strong> Bright sunlight on a phone screen, using one hand while carrying something, watching a video in a noisy environment without headphones</li>
</ul>
<p>That last category — situational limitations — is the one that makes clear why accessibility isn't niche. We all encounter it regularly.</p>

<h2>The WCAG Standard</h2>
<p>The Web Content Accessibility Guidelines (WCAG) are the internationally recognized standard for web accessibility. The current version — WCAG 2.1 — organizes its criteria under four principles: Perceivable, Operable, Understandable, and Robust (POUR).</p>
<p>WCAG has three levels: A (minimum), AA (standard legal requirement in most contexts), and AAA (aspirational). Building to AA compliance is the practical target for most products.</p>

<h2>The High-Impact Basics</h2>
<h3>Color Contrast</h3>
<p>Text must have a contrast ratio of at least 4.5:1 against its background (3:1 for large text). Tools like the WebAIM Contrast Checker make this easy to verify. It's a 30-second check that meaningfully improves readability for everyone, not just users with low vision.</p>
<h3>Keyboard Navigation</h3>
<p>Every interactive element — buttons, links, form fields — must be reachable and operable via keyboard alone. Tab through your own site. If you get stuck anywhere, so does every keyboard-only user. Focus indicators must be visible; removing the outline without providing an alternative is a common and serious mistake.</p>
<h3>Semantic HTML</h3>
<p>Use the right HTML elements for the right purposes. A button should be a <code>&lt;button&gt;</code>, not a <code>&lt;div&gt;</code> with a click handler. Headings should follow a logical hierarchy (<code>h1</code> → <code>h2</code> → <code>h3</code>). Landmark elements (<code>main</code>, <code>nav</code>, <code>aside</code>) give screen reader users a map of the page.</p>
<h3>Alternative Text</h3>
<p>Every meaningful image needs descriptive alt text. Decorative images should have empty alt attributes (<code>alt=""</code>) so screen readers skip them. Complex images — charts, diagrams — need descriptions that convey the meaning, not just what you see.</p>
<h3>Form Labels</h3>
<p>Every form input needs a visible, associated label. Placeholder text is not a label — it disappears when the user starts typing, leaving them unable to verify what a field is for. Labels should be explicit and persistent.</p>

<h2>The Business Case</h2>
<p>Accessible products reach a larger audience, rank better in search engines (accessibility and SEO share many best practices), and reduce legal risk. In the US, ADA web accessibility lawsuits have increased significantly year over year. In the EU, the European Accessibility Act comes into full effect in 2025.</p>
<p>Beyond compliance: accessible products are better products. The constraints of accessibility push designers and developers toward clearer information architecture, cleaner code, and more thoughtful interaction design. The curb cut effect is real — features built for people with disabilities end up benefiting everyone.</p>
    `.trim(),
  },
  {
    title: "How Open Source Changed Software Forever",
    excerpt: "From Linux to React, the software the world runs on was built by volunteers. Here's the story of the movement that changed everything.",
    image: IMAGES.opensource,
    category: "Technology",
    tags: ["open-source", "linux", "community"],
    content: `
<p>In 1991, a Finnish computer science student named Linus Torvalds posted a message to an internet newsgroup: "I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones." That hobby became Linux — the operating system that now runs the majority of the world's servers, phones, and supercomputers.</p>
<p>The Linux kernel is the most significant piece of software ever built by volunteers. But it's one node in a vast network of open source projects that collectively power the modern world.</p>

<h2>What Open Source Means</h2>
<p>Open source software is software whose source code is publicly available for anyone to read, modify, and distribute. The key insight of open source is that when code is open, more people can find bugs, propose improvements, and adapt it for uses the original author never imagined.</p>
<p>The Open Source Initiative defines open source through a set of criteria: free redistribution, access to source code, the right to create modifications, and non-discrimination in who can use it. These properties distinguish open source from "freeware" (free to use but not to modify) and "source-available" (readable but not freely modifiable).</p>

<h2>The Infrastructure of the Internet</h2>
<p>The internet runs on open source software to a degree most people don't appreciate. Consider the stack behind a typical web request:</p>
<ul>
  <li>Linux (operating system on most servers)</li>
  <li>Nginx or Apache (web server)</li>
  <li>PostgreSQL or MySQL (database)</li>
  <li>OpenSSL (encryption)</li>
  <li>Python, Ruby, Node.js (application runtime)</li>
  <li>Git (version control)</li>
</ul>
<p>Every item on that list is open source. The commercial internet was built on a foundation created by volunteers, academics, and later, employees of companies that recognized the value of contributing to shared infrastructure.</p>

<h2>The Business Model Question</h2>
<p>The most common question about open source has always been: how do you make money if you give everything away? The answer, it turns out, is that open source and commercial success aren't opposites.</p>
<p>Red Hat built a billion-dollar business on Linux support and enterprise services before being acquired by IBM for $34 billion. MongoDB, Elastic, and HashiCorp built commercial products on open source cores. GitHub made developer tooling around open source into a product Microsoft acquired for $7.5 billion.</p>
<p>The insight is that code is rarely the scarce resource — expertise, support, hosting, and integration are. Open sourcing the code while commercializing the services around it has become a mature, well-understood business model.</p>

<h2>The Modern Ecosystem</h2>
<p>Today's open source landscape is dominated by a handful of massive projects with thousands of contributors:</p>
<ul>
  <li><strong>React</strong> — Meta's UI library, now the most widely used frontend framework</li>
  <li><strong>Kubernetes</strong> — Google's container orchestration system, now run by the Cloud Native Computing Foundation</li>
  <li><strong>VS Code</strong> — Microsoft's code editor, open sourced and now the most popular IDE in the world</li>
  <li><strong>Python</strong> — the language powering most of modern data science and AI research</li>
  <li><strong>TensorFlow and PyTorch</strong> — the frameworks behind most of the AI models in production today</li>
</ul>

<h2>The Paradox of Maintenance</h2>
<p>Open source has a sustainability problem. Critical infrastructure projects are often maintained by a handful of volunteers, or a single maintainer, for free. The Log4Shell vulnerability in 2021 exposed the fragility: a critical security flaw in a library maintained by two volunteers was embedded in thousands of commercial applications used by billions of people.</p>
<p>The solution isn't abandoning open source — it's funding it. GitHub Sponsors, Open Collective, and direct corporate contributions are growing, but the gap between the value open source creates and the resources flowing back to maintainers remains vast.</p>
    `.trim(),
  },
  {
    title: "Supabase vs Firebase: The Real Comparison",
    excerpt: "Both promise a backend-as-a-service experience, but they take very different approaches. Here's what actually matters for your next project.",
    image: IMAGES.database,
    category: "Technology",
    tags: ["supabase", "firebase", "backend", "database"],
    content: `
<p>If you're building a web app without a dedicated backend team, you'll quickly encounter two names: Firebase and Supabase. Both promise to handle authentication, a database, file storage, and real-time subscriptions. But they're built on fundamentally different philosophies, and the choice between them matters more than most comparisons acknowledge.</p>

<h2>The Origin Story</h2>
<p><strong>Firebase</strong> started as a real-time database startup, was acquired by Google in 2014, and has since grown into a broad suite of app development tools. It's been battle-tested at massive scale and benefits from Google's infrastructure and distribution.</p>
<p><strong>Supabase</strong> launched in 2020 with an explicit mission: be the open source Firebase alternative. It's built on PostgreSQL, a mature and trusted relational database engine, and wraps it in a developer-friendly API layer with authentication, storage, and real-time features.</p>

<h2>The Database: NoSQL vs Relational</h2>
<p>This is the most consequential difference. Firebase's Firestore is a NoSQL document database. Supabase is PostgreSQL.</p>
<p>NoSQL offers flexibility — you can store any shape of data without defining a schema upfront. This is genuinely useful in early-stage projects where the data model is still evolving. But it comes at a cost: complex queries become complex code, relationships are hard to enforce, and as your data grows, inconsistencies multiply.</p>
<p>PostgreSQL is a relational database. Data has structure, relationships are enforced, and you can write SQL queries to answer complex questions across your data in a single round-trip. If you know SQL (and you should), Supabase is immediately productive. If you don't, the learning curve is steeper but the payoff is real.</p>
<p>For most serious applications — anything with user data, transactions, related entities — relational is the right choice. Supabase wins this category on long-term maintainability.</p>

<h2>Authentication</h2>
<p>Both platforms offer email/password auth, OAuth providers (Google, GitHub, Apple, etc.), and magic link / OTP flows. Both handle session management, JWT tokens, and integrations with your database's permission system.</p>
<p>Firebase Auth is more mature and has broader OAuth provider support out of the box. Supabase Auth (built on the open source GoTrue project) has caught up significantly and integrates more elegantly with its Row Level Security system — which is a significant architectural advantage for data access control.</p>

<h2>Pricing: The Real Numbers</h2>
<p>Firebase's pricing is consumption-based and can surprise you at scale. Firestore charges per read, write, and delete — if your app does a lot of reads (most do), costs can escalate quickly. The free tier is generous for prototyping but the jump to paid usage can be steep.</p>
<p>Supabase's free tier is extremely generous: 500MB database, 1GB storage, 50MB file uploads, 2GB bandwidth. Paid tiers are flat-rate ($25/month for Pro), making costs predictable. For most small-to-medium apps, Supabase is significantly cheaper to operate.</p>

<h2>Open Source and Vendor Lock-In</h2>
<p>Firebase is proprietary Google infrastructure. If Google discontinues it, raises prices, or changes terms, your migration options are limited and painful. The data is in a proprietary format on Google's servers.</p>
<p>Supabase is fully open source. You can self-host it on your own infrastructure — the same codebase, the same API. Your data is in PostgreSQL, the world's most widely supported open source database, exportable in standard formats. Lock-in risk is minimal.</p>

<h2>When to Choose Each</h2>
<p>Choose <strong>Firebase</strong> if: you're prototyping rapidly, your data model is genuinely hierarchical or document-oriented, you need deep Google Cloud integration, or you're already in the Google ecosystem.</p>
<p>Choose <strong>Supabase</strong> if: you want SQL and relational data modeling, you care about open source and avoiding lock-in, you want predictable pricing, or you're building anything where data integrity and complex queries matter.</p>
<p>For most production web applications in 2025, Supabase is the better starting point. It gives you the power of PostgreSQL with the convenience of a managed platform — and an escape hatch if you ever need it.</p>
    `.trim(),
  },
]

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seed is disabled in production." }, { status: 403 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated. Please log in at /admin first, then revisit /api/seed." },
      { status: 401 }
    )
  }

  const results: string[] = []

  // ── 1. Ensure categories exist ──────────────────────────────────────────────
  const categoryNames = ["Technology", "Design"]
  const categoryMap: Record<string, string> = {}

  for (const name of categoryNames) {
    const catSlug = slug(name)
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", catSlug)
      .maybeSingle()

    if (existing) {
      categoryMap[name] = existing.id
    } else {
      const { data: created, error } = await supabase
        .from("categories")
        .insert({ name, slug: catSlug })
        .select("id")
        .single()
      if (error) {
        results.push(`⚠️  Category "${name}" failed: ${error.message}`)
        continue
      }
      categoryMap[name] = created.id
      results.push(`✅ Category created: ${name}`)
    }
  }

  // ── 2. Create each post ─────────────────────────────────────────────────────
  for (const post of POSTS) {
    const postSlug = slug(post.title)

    // Skip if already exists
    const { data: existing } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", postSlug)
      .maybeSingle()

    if (existing) {
      results.push(`⏭️  Skipped (exists): ${post.title}`)
      continue
    }

    // Insert post
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
        published_at:   new Date().toISOString(),
        view_count:     Math.floor(Math.random() * 800) + 50, // realistic-looking counts
      })
      .select("id")
      .single()

    if (postError || !created) {
      results.push(`❌ Post failed: ${post.title} — ${postError?.message}`)
      continue
    }

    // Link category
    const catId = categoryMap[post.category]
    if (catId) {
      await supabase
        .from("post_categories")
        .insert({ post_id: created.id, category_id: catId })
    }

    // Upsert & link tags
    for (const tagName of post.tags) {
      const tagSlug = slug(tagName)
      const { data: tag } = await supabase
        .from("tags")
        .upsert({ name: tagName, slug: tagSlug }, { onConflict: "slug" })
        .select("id")
        .single()
      if (tag) {
        await supabase
          .from("post_tags")
          .insert({ post_id: created.id, tag_id: tag.id })
      }
    }

    results.push(`✅ Created: ${post.title}`)
  }

  // ── 3. Respond ──────────────────────────────────────────────────────────────
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Seed Results — Bloggie</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 60px auto; padding: 0 24px; background: #faf9f5; color: #141413; }
    h1 { font-size: 1.5rem; margin-bottom: 8px; }
    p  { color: #b0aea5; font-size: 0.875rem; margin-bottom: 24px; }
    ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    li { background: white; border: 1px solid #e8e6dc; border-radius: 12px; padding: 12px 16px; font-size: 0.875rem; }
    a  { display: inline-block; margin-top: 28px; background: #141413; color: white; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 0.875rem; }
    a:hover { background: #d97757; }
  </style>
</head>
<body>
  <h1>🌱 Seed complete</h1>
  <p>${results.length} operations finished. Your blog is ready.</p>
  <ul>${results.map((r) => `<li>${r}</li>`).join("")}</ul>
  <a href="/admin">← Go to Admin Dashboard</a>
</body>
</html>
  `.trim()

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  })
}
