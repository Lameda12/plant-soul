export type PersonalityType =
  | "dramatic"
  | "resilient"
  | "needy"
  | "chill"
  | "stoic"
  | "attention-seeker";

export interface PlantPersonality {
  personality: PersonalityType;
  personalityDescription: string;
  badges: string[];
}

interface PersonalityTemplate {
  personality: PersonalityType;
  description: string;
  badges: string[];
}

// Keyed by a readable label; selected based on health + issue heuristics
const TEMPLATES: Record<string, PersonalityTemplate> = {
  // Dramatic (40–65, issues present)
  dramatic_wilting: {
    personality: "dramatic",
    description:
      "This plant is in its tragic main character era — every drooping leaf is a cry for the spotlight. It hasn't quite given up, but it wants you to *know* it's suffering. Water it, compliment it, maybe light a small candle for the vibes.",
    badges: ["Drama Queen", "Needs Attention", "Wilting Icon"],
  },
  dramatic_yellowing: {
    personality: "dramatic",
    description:
      "Yellow leaves? That's not decay, that's *aesthetic*. This plant is sending you passive-aggressive signals through its foliage and fully expects you to decode them. A little extra care goes a long way with this one.",
    badges: ["Passive Aggressive", "Yellow Flag", "Emotionally Complex"],
  },
  dramatic_critical: {
    personality: "dramatic",
    description:
      "This plant is on the floor metaphorically — and possibly literally. It's been through something and it wants a full apology, a better pot, and direct sunlight. The good news: plants this dramatic are usually very survivable if you act fast.",
    badges: ["Crisis Mode", "On the Edge", "Needs Rescue"],
  },

  // Resilient (50–75, several issues but hanging on)
  resilient_fighter: {
    personality: "resilient",
    description:
      "Whatever life threw at this plant — overwatering, bad light, a forgotten week — it absorbed it like a pro and came back leafier. This is the plant equivalent of someone who meal preps on Sundays and never complains.",
    badges: ["Survivor", "Comeback Kid", "Battle-Tested"],
  },
  resilient_spotted: {
    personality: "resilient",
    description:
      "A few spots, a few scars — this plant wears its history on its leaves and doesn't apologize for it. It's been through the pest wars, survived questionable watering schedules, and still shows up every morning.",
    badges: ["Battle Scars", "Unbothered", "Veteran"],
  },
  resilient_rootbound: {
    personality: "resilient",
    description:
      "It's been squeezing itself into that pot for months, quietly maxing out its potential. This plant doesn't wait for ideal conditions — it just grows. A bigger pot will unlock the next chapter of this legend.",
    badges: ["Outgrowing Everyone", "Root Riot", "Level Up Needed"],
  },

  // Needy (20–50, multiple issues)
  needy_overwatered: {
    personality: "needy",
    description:
      "This plant checks the window for you every morning. It needs *just the right* amount of everything — water, sun, humidity, emotional support. It's high maintenance in the best way, the kind that rewards patience with lush, dramatic growth.",
    badges: ["High Maintenance", "Thirsty", "Worth It"],
  },
  needy_sundeprived: {
    personality: "needy",
    description:
      "Reaching toward every speck of light like it's trying to escape. This plant has opinions about window placement and it will express them through pale, leggy growth until you listen. Move it closer to the light and watch it transform.",
    badges: ["Sun Chaser", "Stretching for More", "Needs Vitamin D"],
  },
  needy_malnourished: {
    personality: "needy",
    description:
      "This plant has the energy of someone who skipped lunch three days in a row — surviving, but barely vibing. It's not asking for much, just consistent love, decent soil, and maybe a little fertilizer once a month.",
    badges: ["Feed Me", "Running on Empty", "Nutrient Deficit"],
  },

  // Chill (75–90, minimal issues)
  chill_thriving: {
    personality: "chill",
    description:
      "This plant has absolutely no notes. It shows up, does the photosynthesis, minds its business. Zero drama, maximum aesthetic. The kind of plant that would have good credit and a solid sleep schedule.",
    badges: ["Low Maintenance", "Effortlessly Cool", "Stable King"],
  },
  chill_selfmade: {
    personality: "chill",
    description:
      "Thriving with what it's got and not asking for anything extra. This plant figured out its watering schedule before you did and has been quietly flourishing ever since. Honestly a little inspiring.",
    badges: ["Self-Sufficient", "No Complaints", "Laid Back"],
  },
  chill_minimalist: {
    personality: "chill",
    description:
      "Clean lines, calm energy, healthy leaves — this plant would own one piece of art, a linen couch, and a diffuser. It doesn't need much and gives a lot back. A perfect roommate, truly.",
    badges: ["Minimalist", "Aesthetic Only", "Zero Drama"],
  },

  // Stoic (any health, very few issues, slow-growing species feel)
  stoic_ancient: {
    personality: "stoic",
    description:
      "This plant has seen droughts, floods, three different pots, and a forgotten holiday. It processed all of it without a single yellowed leaf. It doesn't need your validation — it was here before you, and it'll be here after.",
    badges: ["Ancient Energy", "Unshakeable", "Elder Vibes"],
  },
  stoic_slowburn: {
    personality: "stoic",
    description:
      "Quiet. Patient. Methodical. This plant grows exactly one new leaf when it feels like it and is not accepting feedback on the timeline. It's on its own schedule and frankly, it's working.",
    badges: ["Slow & Steady", "Stoic Legend", "Long Game"],
  },
  stoic_cacti: {
    personality: "stoic",
    description:
      "Built for hardship. Unfazed by neglect. This plant evolved to outlast civilizations and it knows it. Water it when you remember, leave it in the sun, and it will quietly outlive everyone in the room.",
    badges: ["Desert Veteran", "Zero Neediness", "Built Different"],
  },

  // Attention-seeker (85–100, healthy but 'extra' energy)
  attention_perfect: {
    personality: "attention-seeker",
    description:
      "This plant is *healthy* and it wants everyone to know about it. Look at those glossy leaves. Look at that symmetrical growth. It will absolutely wilt if you stop complimenting it — so keep the praise coming.",
    badges: ["Show-Off", "Leaf Goals", "Validation Required"],
  },
  attention_blooming: {
    personality: "attention-seeker",
    description:
      "Flowering, thriving, and absolutely not being subtle about it. This plant peaked and chose to do it publicly. It's the plant equivalent of posting a gym selfie — earned, but very much on purpose.",
    badges: ["In Bloom", "Main Character", "Doing the Most"],
  },
  attention_variegated: {
    personality: "attention-seeker",
    description:
      "Not content with regular green — this plant went full pattern and expects to be the center of conversation. It probably gets more compliments than most people and has the ego to match. Worth every bit of the hype.",
    badges: ["Rare Find", "Too Pretty", "Collector's Plant"],
  },
  attention_lush: {
    personality: "attention-seeker",
    description:
      "Overflowing with life, spilling out of its pot, demanding to be photographed. This plant lives for the 'before and after' reel and is perpetually in 'after' mode. Do not put it in a corner.",
    badges: ["Overcachiever", "Lush Life", "Center Stage"],
  },
};

const ISSUE_KEYWORDS: Record<string, string[]> = {
  wilting: ["wilt", "droop", "limp", "flop", "weak stem"],
  yellowing: ["yellow", "pale", "chloro", "fade"],
  spotted: ["spot", "lesion", "blight", "fungal", "mildew", "rust"],
  rootbound: ["root bound", "rootbound", "pot bound", "root circl"],
  overwatered: ["overwater", "soggy", "root rot", "mushy"],
  sundeprived: ["etiolat", "leggy", "stretch", "pale", "reaching"],
  malnourished: ["nutrient", "deficien", "starv", "underfed"],
};

function matchesIssue(issues: string[], keywords: string[]): boolean {
  const combined = issues.join(" ").toLowerCase();
  return keywords.some((k) => combined.includes(k));
}

function isSucculentOrCacti(species: string): boolean {
  const s = species.toLowerCase();
  return ["cactus", "cacti", "succulent", "aloe", "agave", "haworthia", "echeveria"].some((k) =>
    s.includes(k)
  );
}

function isSlowGrower(species: string): boolean {
  const s = species.toLowerCase();
  return ["bonsai", "cycad", "zamia", "jade", "crassula", "ficus", "palm"].some((k) =>
    s.includes(k)
  );
}

export function generatePlantPersonality(
  healthScore: number,
  issues: string[],
  species: string = ""
): PlantPersonality {
  const template = selectTemplate(healthScore, issues, species);
  return {
    personality: template.personality,
    personalityDescription: template.description,
    badges: template.badges,
  };
}

function selectTemplate(
  health: number,
  issues: string[],
  species: string
): PersonalityTemplate {
  const hasIssues = issues.length > 0;

  // Cacti / succulents → stoic regardless of health (unless critical)
  if (isSucculentOrCacti(species) && health >= 35) {
    return TEMPLATES.stoic_cacti;
  }

  // Slow growers with decent health → stoic
  if (isSlowGrower(species) && health >= 55 && !hasIssues) {
    return Math.random() > 0.5 ? TEMPLATES.stoic_ancient : TEMPLATES.stoic_slowburn;
  }

  // Critical (0–29)
  if (health < 30) {
    if (matchesIssue(issues, ISSUE_KEYWORDS.overwatered)) return TEMPLATES.needy_overwatered;
    return TEMPLATES.dramatic_critical;
  }

  // Struggling (30–49)
  if (health < 50) {
    if (matchesIssue(issues, ISSUE_KEYWORDS.sundeprived)) return TEMPLATES.needy_sundeprived;
    if (matchesIssue(issues, ISSUE_KEYWORDS.malnourished)) return TEMPLATES.needy_malnourished;
    if (matchesIssue(issues, ISSUE_KEYWORDS.yellowing)) return TEMPLATES.dramatic_yellowing;
    if (matchesIssue(issues, ISSUE_KEYWORDS.wilting)) return TEMPLATES.dramatic_wilting;
    return TEMPLATES.needy_overwatered;
  }

  // Fair (50–64)
  if (health < 65) {
    if (matchesIssue(issues, ISSUE_KEYWORDS.rootbound)) return TEMPLATES.resilient_rootbound;
    if (matchesIssue(issues, ISSUE_KEYWORDS.spotted)) return TEMPLATES.resilient_spotted;
    if (matchesIssue(issues, ISSUE_KEYWORDS.wilting)) return TEMPLATES.dramatic_wilting;
    if (matchesIssue(issues, ISSUE_KEYWORDS.yellowing)) return TEMPLATES.dramatic_yellowing;
    return TEMPLATES.resilient_fighter;
  }

  // Okay (65–74)
  if (health < 75) {
    if (matchesIssue(issues, ISSUE_KEYWORDS.rootbound)) return TEMPLATES.resilient_rootbound;
    if (matchesIssue(issues, ISSUE_KEYWORDS.spotted)) return TEMPLATES.resilient_spotted;
    if (matchesIssue(issues, ISSUE_KEYWORDS.malnourished)) return TEMPLATES.needy_malnourished;
    return TEMPLATES.resilient_fighter;
  }

  // Healthy (75–89)
  if (health < 90) {
    if (!hasIssues) {
      const pick = Math.random();
      if (pick < 0.4) return TEMPLATES.chill_thriving;
      if (pick < 0.7) return TEMPLATES.chill_selfmade;
      return TEMPLATES.chill_minimalist;
    }
    if (matchesIssue(issues, ISSUE_KEYWORDS.rootbound)) return TEMPLATES.resilient_rootbound;
    return TEMPLATES.resilient_fighter;
  }

  // Peak (90–100)
  const pick = Math.random();
  if (pick < 0.35) return TEMPLATES.attention_perfect;
  if (pick < 0.6) return TEMPLATES.attention_lush;
  if (pick < 0.8) return TEMPLATES.attention_blooming;
  return TEMPLATES.attention_variegated;
}
