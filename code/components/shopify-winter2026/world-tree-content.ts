export type Feature = {
  group?: string;
  title: string;
  body: string;
  cta?: string;
  image?: string;
  prompts?: string[];
  tall?: boolean;
  wide?: boolean;
  article?: boolean;
  textOnly?: boolean;
};

export type Section = {
  id: string;
  label: string;
  roman: string;
  headline: string;
  summary: string;
  theme: "dark" | "light";
  layout?: "cards" | "scene" | "split" | "article";
  sceneMode?: "sidekick" | "agentic" | "online" | "retail" | "marketing" | "developer";
  sceneImage?: string;
  height?: number;
  features: Feature[];
  updates: string[];
};

export type AssetSlot = {
  id: string;
  chapterId: string;
  label: string;
  role: string;
  preferredFormat: string;
  aspectRatio: string;
  status: "waiting-for-source" | "placeholder-ready";
  notes: string;
};

export const navItems = [
  ["sidekick", "Worldview", "I"],
  ["agentic", "SUSU's Secret", "II"],
  ["developer", "Her Secret", "III"],
  ["marketing", "Guardians", "IV"],
] as const;

export const sectionHeights: Record<string, number> = {
  sidekick: 1320,
  agentic: 7200,
  online: 2600,
  developer: 16800,
  operations: 3200,
  marketing: 7600,
  b2b: 5200,
};

function prose(...paragraphs: string[]) {
  return paragraphs.join("\n\n");
}

export const sections: Section[] = [
  {
    id: "sidekick",
    label: "Worldview",
    roman: "I",
    headline: "The World Tree holds every emotion you have ever carried.",
    summary: "There are two worlds: one you can see, and one that lives just beneath your feelings.",
    theme: "light",
    layout: "scene",
    sceneMode: "sidekick",
    features: [
      {
        group: "The World Tree - The Anchor",
        title: "There are two worlds.",
        body: prose(
          "One you can see - streets, light, the smell of coffee. The other lives just out of reach, in the space beneath your feelings. That is the emotional world.",
          "Every person has their own. It grows alongside you. Its sky shifts with your mood. Its World Tree holds every emotion you have ever carried - the ones you remember, and the ones you have long since forgotten.",
        ),
        article: true,
        wide: true,
      },
      {
        group: "The World Tree - The Anchor",
        title: "Guardians are born from that world.",
        body: prose(
          "Each one called into being by a feeling you once had - a moment of fear, a flash of courage, a night you did not think you would survive. They have always been there. Waiting, without knowing your name, until the moment you were ready.",
          "SUSU is the only one who can cross between worlds. She is the key. The bridge. The quiet one who stays.",
        ),
        article: true,
        wide: true,
      },
      {
        group: "The World Tree - The Anchor",
        title: "When you are ready, they find you.",
        body: prose(
          "Not to rescue you. To walk beside you, while you find your own way back.",
          "The world not giving you light? We will carry it to you.",
        ),
        article: true,
        wide: true,
      },
    ],
    updates: ["Emotional world", "World Tree", "Guardians", "SUSU", "Crystals", "The bridge"],
  },
  {
    id: "agentic",
    label: "SUSU's Secret",
    roman: "II",
    headline: "The bridge between the real world and the emotional world.",
    summary: "SUSU carries what her person can no longer process, then brings it back to the World Tree.",
    theme: "dark",
    layout: "scene",
    sceneMode: "agentic",
    features: [
      {
        title: "Born at the roots",
        body: "I was born in her emotional world. No one told me. I simply knew - the way I knew my fur was white and curly, the way I knew my crystal carried something particular.",
        textOnly: true,
      },
      {
        title: "The leaf",
        body: "One leaf fell from the World Tree. Lore looked at it and said it was the first time she felt like she could not hold on.",
        textOnly: true,
      },
      {
        title: "The crossing",
        body: "So on a rainy afternoon, I climbed into a cardboard box and pretended to be a cat in need of a home.",
        textOnly: true,
      },
    ],
    updates: ["Clear Quartz", "The Bridge", "Cardboard box", "Grey to gold"],
  },
  {
    id: "online",
    label: "SUSU's Secret",
    roman: "II",
    headline: "I was born in her emotional world.",
    summary: "SUSU's perspective, kept as a long article.",
    theme: "dark",
    layout: "article",
    features: [
      {
        title: "SUSU's Perspective",
        body: prose(
          "I was born in her emotional world.",
          "No one told me. I simply knew - the way I knew my fur was white and curly, the way I knew my crystal carried something particular, the way I knew Grandfather was sitting on the largest root of the World Tree, and had been for a very long time.",
          "His name is Lore. The oldest of us - here since the very first memory she ever made. His fur is white threaded with silver, and his eyes hold everything he has ever witnessed of her. The roots of the World Tree, he told me, hold every time she ever wept, every time she laughed, every moment she herself has forgotten.",
          "\"You are different from the rest of us,\" he said, the first time he spoke to me. I had just learned to walk. I did not understand.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "The leaf",
        body: prose(
          "Most days, the sky here is blue. The air smells like warm light. We live near the World Tree - each of us carrying our own particular energy. Oren keeps silent watch at the roots. Vera finds the sunniest patch and stays there. Aldric carves symbols into the bark that only he can read. We grew alongside her, one by one - each new emotion she encountered calling another of us into being.",
          "We felt her. But we had never seen her.",
          "Until the day a single leaf fell from the World Tree. Leaves fall - she has moods, and the tree moves with them. But Lore stared at this one for a long time. Long enough that I stared too, and saw nothing.",
          "\"That leaf,\" he finally said, very quietly, \"is the first time she felt like she could not hold on.\"",
          "My fur stood on end.",
          "\"It is time,\" he told me. \"You are the only one who can cross. She has lost the ability to process what she feels - and emotion does not disappear. It only moves. You need to carry it for her.\"",
        ),
        article: true,
        wide: true,
      },
      {
        title: "The cardboard box",
        body: prose(
          "So on a rainy afternoon, I climbed into a cardboard box and pretended to be a cat in need of a home.",
          "The first time I saw her, every hair on my body stood straight up. The color around her was a grey so deep it was almost black - a weight pressing down from all sides. I had never seen anything like it in the emotional world. Even the darkest grey there carries a thread of light.",
          "She lifted me from the box. Her hands were shaking. Not from cold. From not having held anything gently in a very long time.",
          "From that day, I lived beside her. I discovered tinned food. I discovered that even when she was not okay, she would try to play with me anyway. We grew close. I grew to love her. I tried to absorb what I could - pulling the grey from her, carrying it in my body until I could sleep and bring it back here to be cleared. My fur, slowly, changed color.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Grey and gold",
        body: prose(
          "During the day she stared at screens. I stayed close. At night when she could not sleep, I lay on her chest and filled the unbearable quiet with the sound of purring. She thought I was just a cat who liked to sleep. She did not know I was slipping back between worlds.",
          "That period lasted a long time. Long enough that every time I returned, Lore would look at me with something soft and sad in his eyes - though he never said a word. The others would gather around and help me clear what I had carried.",
          "Then one day, I woke from sleep and something had shifted. The grey was still there. But threaded through it - gold. Moving slowly, steadily, turning the grey as it went. I watched her for a long time, not sure I was seeing clearly.",
          "I thought, maybe, I had gotten stronger.",
          "Until the day I came back to the World Tree and found her standing there.",
          "I must still be asleep. There is no other explanation.",
          "What is she doing here?",
        ),
        article: true,
        wide: true,
      },
    ],
    updates: [],
  },
  {
    id: "developer",
    label: "Her Secret",
    roman: "III",
    headline: "A night of crying opens into the emotional world.",
    summary: "Room, memory, World Tree, and return pass through the same long breath.",
    theme: "dark",
    layout: "scene",
    sceneMode: "developer",
    features: [
      {
        title: "The room",
        body: "The first entrance is not soft like a dream. It is specific: rain-soaked earth, a remembered afternoon, and a tree too large to see the top of.",
        textOnly: true,
      },
      {
        title: "The watching",
        body: "She can see the guardians moving through their own weight, each one finding a way through with quiet help from the others.",
        textOnly: true,
      },
      {
        title: "The return",
        body: "The grey is still there, but gold begins moving through it slowly, steadily, turning the grey as it goes.",
        textOnly: true,
      },
    ],
    updates: ["Room", "Rain", "World Tree", "Grey", "Gold", "Return"],
  },
  {
    id: "operations",
    label: "Her Secret",
    roman: "III",
    headline: "The first time I entered the emotional world, it was not a dream.",
    summary: "Her perspective, kept as a long article.",
    theme: "dark",
    layout: "article",
    features: [
      {
        title: "Her Perspective",
        body: prose(
          "The first time I entered the emotional world, it was a night I had long since lost count of how many hours I had been crying.",
          "It was not a dream. I know what dreams feel like - soft at the edges, uncertain. This was different. The air was real. It had a smell I could not name, like rain-soaked earth, like a specific afternoon from years ago.",
          "I was standing beneath a tree. Enormous. I could not see the top. The roots spread across the ground around me, each one breathing.",
          "Then I saw them.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Invisible",
        body: prose(
          "They did not notice me. I understood later - I was invisible here. I could see everything. I could not touch anything. I could not change anything. I could only watch.",
          "I stayed for a long time. Long enough that time stopped meaning much. I watched each of them moving through something difficult - each one with their own weight, their own particular struggle. And I watched them, one by one, find their way through it. Not rescued. Not fixed. They did it themselves, in their own way, with the quiet help of each other.",
          "I saw SUSU. The cat who had pushed her way into my life uninvited. Each time she arrived, her fur was grey. Each time she emerged from the World Tree, she was white.",
          "I understood, then, what she had been doing.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Those pieces are mine",
        body: prose(
          "I stood there unable to move. Unable to help. Just watching.",
          "And I thought about my own weight. The sleepless nights. The afternoons staring at nothing. The long stretch of time when I believed I was simply not enough. I had always thought those things would stay with me forever. But standing here, watching from the outside - I felt something shift.",
          "Those pieces are mine. All of them. The broken ones too.",
          "I went back to the real world and I started, slowly, to try. It was not fast. But something was different.",
          "I never told anyone about that place. I could not explain it. I was not sure anyone would believe me. But I started paying attention to SUSU - the way her head would press against my palm, and I would feel, just for a second, something warm moving through me.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "Congratulations",
        body: prose(
          "Then one day, I came back.",
          "It was different this time. I appeared beneath the World Tree. SUSU was just waking at the roots - and when she looked up and saw me, she froze. Eyes wide. Every hair standing straight. The expression of a cat who has just witnessed something that should not be physically possible.",
          "Lore raised his head. He did not look surprised.",
          "He looked at me for a long time. Then at the tree. Then back at me.",
          "\"Congratulations,\" he said. \"You put yourself back together.\"",
          "Not because I had become extraordinary, he explained. Because I had been willing to face myself.",
        ),
        article: true,
        wide: true,
      },
      {
        title: "The crystals",
        body: prose(
          "The tree moved - just slightly. A few crystals fell and settled in my open hands. Warm.",
          "I looked at them. Every one a different color. Every one quietly bright, like small lights that had been waiting to be found.",
          "Lore said they came from the guardians - that each one had drawn from their own crystal to make what I was holding.",
          "He said: every person has their own emotional world. No matter what the outside world takes from you, there are guardians inside yours who have been waiting. When you are ready, they bring their energy through - condensed into crystal, crossing the boundary, finding you.",
          "I looked up. They were all standing near the World Tree, each forehead glowing in a different color. SUSU was among them, her fur still grey. But the way she was looking at me - I had never seen that expression in the real world. Pride. Relief. Something steady and certain.",
          "My person, that look said. She did it.",
          "I held the crystals tightly. My eyes filled. But this time, the tears tasted like the air after rain.",
          "I came back to the real world carrying them. Life, slowly, found its shape again.",
          "Later - much later - I still dream of them sometimes. I wake up feeling like something has been quietly restored. And I started to think: this feeling was never only meant for me.",
          "So I wanted to share it. With anyone who needs it. I hope these crystals - made with care, and carrying something real - help you through whatever you are carrying right now.",
        ),
        article: true,
        wide: true,
      },
    ],
    updates: [],
  },
  {
    id: "marketing",
    label: "Guardians",
    roman: "IV",
    headline: "In the World Tree's shade, ten guardians were born.",
    summary: "Each one is a piece of someone's emotional world, waiting to find their person.",
    theme: "dark",
    layout: "scene",
    sceneMode: "marketing",
    features: [
      {
        title: "The guardians gather",
        body: "Each guardian carries a crystal, a strength, a shadow, and a lesson. They stand in the World Tree's shade, waiting to find their person.",
        textOnly: true,
      },
    ],
    updates: ["SUSU", "Oren", "Vera", "Aldric", "Pip", "Cael", "Mira", "Frost", "Ashen", "Lore"],
  },
  {
    id: "b2b",
    label: "The Ten",
    roman: "VII",
    headline: "Ten guardians, ten kinds of light.",
    summary: "A structured guide to the guardians and the crystals they carry.",
    theme: "light",
    layout: "cards",
    features: [
      {
        title: "The World Tree - The Anchor",
        body: prose(
          "The World Tree stands at the heart of every emotional world - ancient, unmoving, and all-remembering.",
          "Its roots hold every emotion you have ever felt; its branches grow taller every time you choose to keep going.",
        ),
        textOnly: true,
        wide: true,
      },
      {
        title: "SUSU - The Bridge",
        body: prose(
          "Crystal: Clear Quartz",
          "Purification / Clarity / Energy Amplification",
          "Breed: Selkirk Rex",
          "Strengths: Deeply empathetic, a natural listener, the emotional glue that holds everyone together.",
          "Shadow: High sensitivity / People-pleasing tendencies.",
          "Life Lesson: To build boundaries, to know her worth exists beyond being needed, to learn that caring for others and caring for herself are not opposites.",
          "Born from: The moment someone first felt they were carrying too much alone.",
          "Energy Mantra: Gentleness is not surrender. It is where healing begins.",
        ),
        textOnly: true,
      },
      {
        title: "Oren - The Sentinel",
        body: prose(
          "Crystal: Obsidian",
          "Protection / Grounding / Banishing Negativity",
          "Breed: Bombay",
          "Strengths: Unshakably calm in crisis, fiercely protective, the one everyone relies on when things fall apart.",
          "Shadow: Emotional suppression / Over-control.",
          "Life Lesson: To let someone see his vulnerability without flinching, to understand that softness is not a crack in the armour - it is the armour.",
          "Born from: The first time someone felt truly unsafe, and needed something steady to hold onto.",
          "Energy Mantra: True strength is staying calm when everything wants you to break.",
        ),
        textOnly: true,
      },
      {
        title: "Vera - The Healer",
        body: prose(
          "Crystal: Rose Quartz",
          "Unconditional Love / Self-healing / Gentleness",
          "Breed: Ragdoll",
          "Strengths: Warm, expansive, idealistic - she finds the light in everyone, even on their worst days.",
          "Shadow: Conflict avoidance / Self-sacrificing love.",
          "Life Lesson: To shed the people-pleasing pattern, to voice her own needs, to understand that love is not a debt to be paid - it is two whole souls choosing each other.",
          "Born from: The first time someone loved someone else more than they loved themselves.",
          "Energy Mantra: Love is not sacrifice. It is two whole souls, meeting.",
        ),
        textOnly: true,
      },
      {
        title: "Aldric - The Analyst",
        body: prose(
          "Crystal: Amethyst",
          "Wisdom / Intuition / Mental Clarity",
          "Breed: British Shorthair",
          "Strengths: Deeply wise, rigorously logical, able to see through to the heart of any problem.",
          "Shadow: Overthinking / Paralysis by perfectionism.",
          "Life Lesson: To step out of his own mind and into action, to accept that imperfect and done is worth more than perfect and never started.",
          "Born from: The first time someone thought themselves in circles and could not find the way out.",
          "Energy Mantra: Stop overthinking. The answer lives in the doing.",
        ),
        textOnly: true,
      },
      {
        title: "Pip - The Spark",
        body: prose(
          "Crystal: Citrine",
          "Vitality / Creativity / Joyful Energy",
          "Breed: Orange Tabby",
          "Strengths: Wildly creative, instinctively curious, the one who makes the impossible feel obvious.",
          "Shadow: Scattered attention / Starting without finishing.",
          "Life Lesson: To follow through, to sit with the boring middle parts, to learn that finishing something is its own kind of magic.",
          "Born from: The first time someone had a brilliant idea and did not know what to do with it.",
          "Energy Mantra: Inspiration is the spark. Showing up is the fire.",
        ),
        textOnly: true,
      },
      {
        title: "Cael - The Builder",
        body: prose(
          "Crystal: Green Phantom Quartz",
          "Growth / Abundance / Momentum",
          "Breed: Leopard Cat",
          "Strengths: Deeply reliable, efficient, the one who takes a dream and turns it into something real.",
          "Shadow: Workaholism / Worth tied entirely to output.",
          "Life Lesson: To let himself rest without guilt, to discover that who he is matters more than what he produces, to find joy in doing nothing at all.",
          "Born from: The first time someone pushed through exhaustion because stopping felt like failure.",
          "Energy Mantra: Your worth is not measured by what you finish.",
        ),
        textOnly: true,
      },
      {
        title: "Mira - The Artist",
        body: prose(
          "Crystal: Lapis Lazuli",
          "Truth / Inner Vision / Creative Expression",
          "Breed: Norwegian Forest Cat (Calico)",
          "Strengths: Exquisitely sensitive, sees beauty others miss entirely, carries a whole world inside.",
          "Shadow: Social avoidance / Imposter syndrome.",
          "Life Lesson: To stop reading threat into silence, to let herself be seen without needing to be perfect first, to find that being witnessed is not the same as being judged.",
          "Born from: The first time someone felt too much, and decided the safest thing was to disappear.",
          "Energy Mantra: You do not need to be perfect to be seen. You just need to be real.",
        ),
        textOnly: true,
      },
      {
        title: "Frost - The Truth-Teller",
        body: prose(
          "Crystal: Aquamarine",
          "Communication / Courage / Clarity",
          "Breed: Siamese",
          "Strengths: Radically honest, fiercely free, cuts through pretence like light through water.",
          "Shadow: Avoidant attachment / Emotional detachment.",
          "Life Lesson: To learn that honesty without warmth is just a wound with good aim, to discover that real freedom includes the freedom to let someone matter.",
          "Born from: The first time someone told the truth and lost something because of it.",
          "Energy Mantra: Honesty needs no thorns. Freedom always finds its way home.",
        ),
        textOnly: true,
      },
      {
        title: "Ashen - The Anchor",
        body: prose(
          "Crystal: Kunzite",
          "Emotional Calm / Inner Peace / Gentle Strength",
          "Breed: Persian",
          "Strengths: Unshakeably calm, can hold enormous emotional weight without breaking, his presence alone slows the world down.",
          "Shadow: Learned helplessness / Depressive withdrawal.",
          "Life Lesson: To believe again that things can change, to move from passive witness to quiet participant, to find that even the smallest shift is still a shift.",
          "Born from: The first time someone stopped trying, not from laziness, but from being too tired to hope.",
          "Energy Mantra: Even the faintest light can find its way through the dark.",
        ),
        textOnly: true,
      },
      {
        title: "Lore - The Witness",
        body: prose(
          "Crystal: Kyanite",
          "Ancient Wisdom / Clarity / Energetic Balance",
          "Breed: Maine Coon (Tortoiseshell)",
          "Strengths: Sees across time, holds all emotions without judgement, guides with metaphor rather than instruction.",
          "Shadow: Too detached to feel the urgency of the present, slow to intervene, afraid of disturbing what must unfold on its own.",
          "Life Lesson: To remember that wisdom without warmth is just distance with good vocabulary, to let the present moment matter as much as everything he has witnessed.",
          "Born from: The very first memory. He has always been here.",
          "Energy Mantra: Time holds everything. Even this.",
        ),
        textOnly: true,
      },
    ],
    updates: [],
  },
  {
    id: "finance",
    label: "Crystals",
    roman: "VIII",
    headline: "Small lights that had been waiting to be found.",
    summary: "The story returns to the real world through crystal, care, and the wish to share this feeling.",
    theme: "dark",
    layout: "cards",
    features: [
      {
        title: "Carry it back",
        body: prose(
          "The crystals are not shortcuts or rescues. They are the condensed energy of guardians who have been waiting inside an emotional world.",
          "They belong to the moment after the story: after the World Tree has moved, after the guardians have shared their light, after a person has chosen to face herself.",
        ),
        textOnly: true,
        wide: true,
      },
      {
        title: "The line that holds the page",
        body: "The world not giving you light? We will carry it to you.",
        textOnly: true,
        wide: true,
      },
    ],
    updates: [],
  },
];

export const assetSlots: AssetSlot[] = [
  {
    id: "hero-room-clean",
    chapterId: "hero",
    label: "Hero room base",
    role: "First visible hero layer before the dissolve begins.",
    preferredFormat: "16:9 or wider still/video, no text baked in",
    aspectRatio: "16:9 to 21:9",
    status: "waiting-for-source",
    notes: "Use for the real-world room before SUSU runs through the tunnel.",
  },
  {
    id: "hero-susu-ball",
    chapterId: "hero",
    label: "SUSU chasing ball",
    role: "Foreground motion layer in the opening hero story.",
    preferredFormat: "transparent PNG sequence, ProRes 4444, or WebM with alpha",
    aspectRatio: "transparent layer",
    status: "waiting-for-source",
    notes: "Should be separated from the background so scroll and dissolve can control her independently.",
  },
  {
    id: "hero-tunnel-build",
    chapterId: "hero",
    label: "Rebuilt tunnel",
    role: "Transition bridge from real room into emotional world.",
    preferredFormat: "transparent PNG layers or alpha video",
    aspectRatio: "transparent layer",
    status: "waiting-for-source",
    notes: "This is the main dissolve target for the opening interaction.",
  },
  {
    id: "hero-room-restored",
    chapterId: "hero",
    label: "Room restored",
    role: "Final hero state after SUSU enters the tunnel.",
    preferredFormat: "still/video, matching hero-room-clean camera",
    aspectRatio: "16:9 to 21:9",
    status: "waiting-for-source",
    notes: "Camera angle should match the first layer if possible.",
  },
  {
    id: "worldtree-small-video-tunnel-run",
    chapterId: "sidekick",
    label: "Small video: tunnel run",
    role: "The small rectangular clip below the hero tear transition.",
    preferredFormat: "MP4/WebM, short loop",
    aspectRatio: "16:9",
    status: "placeholder-ready",
    notes: "Current page has a text placeholder here so the slot is visible.",
  },
  {
    id: "worldtree-small-video-far",
    chapterId: "sidekick",
    label: "Small video: World Tree far view",
    role: "Second beat inside the same small video window.",
    preferredFormat: "MP4/WebM or still",
    aspectRatio: "16:9",
    status: "waiting-for-source",
    notes: "Should feel like entering the emotional world, not a separate content block.",
  },
  {
    id: "worldtree-small-video-close",
    chapterId: "sidekick",
    label: "Small video: World Tree close view",
    role: "Third beat inside the same small video window.",
    preferredFormat: "MP4/WebM or still",
    aspectRatio: "16:9",
    status: "waiting-for-source",
    notes: "Use for roots, crystals, leaf, or bark detail.",
  },
  {
    id: "susu-chapter-transition",
    chapterId: "agentic",
    label: "SUSU chapter transition",
    role: "Full-viewport transition before the SUSU long article.",
    preferredFormat: "layered stills, PNG sequence, or scroll-scrub video",
    aspectRatio: "16:9 to 21:9",
    status: "waiting-for-source",
    notes: "This should keep the original complex scroll interaction shell.",
  },
  {
    id: "susu-article-illustrations",
    chapterId: "online",
    label: "SUSU story article illustrations",
    role: "Large article images inserted between long prose blocks.",
    preferredFormat: "JPG/PNG stills",
    aspectRatio: "4:3, 3:2, or vertical detail crops",
    status: "waiting-for-source",
    notes: "Useful beats: Lore at roots, falling leaf, cardboard box, grey-to-gold fur.",
  },
  {
    id: "sister-minimac-sequence",
    chapterId: "developer",
    label: "Sister story long scroll sequence",
    role: "Main long interaction area equivalent to the reference Mini Mac section.",
    preferredFormat: "MP4/WebM scroll-scrub video, or 10fps image sequence",
    aspectRatio: "16:9 to 21:9",
    status: "waiting-for-source",
    notes: "Best place for the richer video/photo material from sister's story.",
  },
  {
    id: "sister-article-illustrations",
    chapterId: "operations",
    label: "Her story article illustrations",
    role: "Large stills between long prose blocks.",
    preferredFormat: "JPG/PNG stills",
    aspectRatio: "4:3, 3:2, or wide cinematic",
    status: "waiting-for-source",
    notes: "Useful beats: crying night, invisible observer, SUSU grey/white, crystals in hand.",
  },
  {
    id: "guardians-transition",
    chapterId: "marketing",
    label: "Guardians chapter transition",
    role: "Full-viewport intro before the guardian cards.",
    preferredFormat: "layered stills, PNG sequence, or short loop",
    aspectRatio: "16:9 to 21:9",
    status: "waiting-for-source",
    notes: "Should reveal the group around the World Tree before the card grid.",
  },
  {
    id: "guardian-card-portraits",
    chapterId: "b2b",
    label: "Guardian card portraits",
    role: "Per-card cat/IP portrait and crystal visual.",
    preferredFormat: "transparent PNG preferred",
    aspectRatio: "1:1 or 4:5",
    status: "waiting-for-source",
    notes: "Needs one clear portrait per guardian plus optional crystal cutout.",
  },
  {
    id: "crystals-closing",
    chapterId: "finance",
    label: "Crystal closing imagery",
    role: "Closing product/story bridge.",
    preferredFormat: "JPG/PNG stills or slow loop video",
    aspectRatio: "16:9, 4:3, or product-detail crops",
    status: "waiting-for-source",
    notes: "Should connect emotional-world energy to real crystals without becoming a product grid too early.",
  },
];
