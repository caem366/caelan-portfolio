import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { projects } from "../data/projects";

type DecisionCardData = {
  title: string;
  eyebrow?: string;
  accent?: "mood" | "taste" | "discovery" | "system" | "success" | "danger" | "warning";
  summary: string;
  problem: string;
  decision: string;
  why: string;
  tradeoff: string;
};

const moodWorkflow: DecisionCardData[] = [
  {
    title: "Understand Mood",
    eyebrow: "NLP input",
    accent: "mood",
    summary: "Preset mood buttons were too blunt for the kind of product I wanted to build.",
    problem:
      "Happy, sad, and calm are useful shortcuts, but they flatten a lot of what people actually mean when they ask for music.",
    decision: "Let users describe their mood in plain language.",
    why:
      "DistilRoBERTa can turn that sentence into structured emotion scores the recommender can compare against songs and tags.",
    tradeoff:
      "A task-specific classifier is less flexible than a general-purpose LLM, but it fits this narrow job without a paid LLM call for every mood check.",
  },
  {
    title: "Understand Taste",
    eyebrow: "Personalization",
    accent: "taste",
    summary: "The same mood request should not produce the same playlist for everyone.",
    problem: "Two people can both ask for sad music and want completely different things.",
    decision:
      "Use Spotify listening history as a taste signal: top artists, tracks, and recent listening.",
    why:
      "Starting from the user's actual taste keeps the system from drifting into random songs that only match a mood label.",
    tradeoff:
      "Taste data can make the engine too conservative, so mood relevance still needs its own score.",
  },
  {
    title: "Discover Candidates",
    eyebrow: "Discovery",
    accent: "discovery",
    summary: "Spotify could not be the only discovery source after its developer API changed.",
    problem:
      "The original plan leaned on Spotify audio and recommendation data that became restricted for newer apps.",
    decision:
      "Bring in Last.fm for similar tracks, artist relationships, and crowd-sourced tags.",
    why:
      "Last.fm gives the recommender more ways to expand from a user's taste profile into nearby candidates.",
    tradeoff:
      "Community tags can be noisy, so Last.fm is better as a candidate source than the final judge.",
  },
  {
    title: "Rank Songs",
    eyebrow: "Recommendation logic",
    accent: "system",
    summary: "A song needs evidence for both mood and taste before it should be shown.",
    problem:
      "Personalization alone can recommend an artist the user likes even when the specific track does not match the requested feeling.",
    decision:
      "Separate moodScore and tasteScore, then rank candidates with both in mind.",
    why: "User likes FKA twigs does not mean every FKA twigs song is sad.",
    tradeoff:
      "Stricter gates can reduce the number of results, but fewer good recommendations are better than a full page of weak ones.",
  },
  {
    title: "Listen",
    eyebrow: "Provider handoff",
    accent: "system",
    summary:
      "The recommender should decide what to recommend, not depend on one provider's ranking logic.",
    problem:
      "If the recommendation logic lives inside one streaming API, the product becomes fragile when that API changes.",
    decision:
      "Treat streaming services as destinations for resolving, opening, or saving tracks.",
    why: "That keeps the core recommendation idea separate from where the user listens.",
    tradeoff:
      "Provider independence means each track still has to be resolved against the supported provider catalog.",
  },
];

const productDecisions: DecisionCardData[] = [
  {
    title: "Free-form Mood Input",
    accent: "mood",
    summary: "People often know how they feel before they know what playlist category they want.",
    problem: "Preset categories forced users to translate a messy feeling into one clean label.",
    decision: "Let the mood start as natural language.",
    why:
      "A sentence like I feel drained but I still want something hopeful gives the system more product context than a single button.",
    tradeoff:
      "Free text needs interpretation, so the model output has to be handled carefully instead of treated as perfect truth.",
  },
  {
    title: "Mood Match vs MoodShift",
    accent: "mood",
    summary: "Reflecting a mood and changing a mood are two different listening intents.",
    problem:
      "Sometimes the user wants music that mirrors how they feel. Other times they want help moving toward a different state.",
    decision: "Keep Mood Match as the core flow and label MoodShift as in development.",
    why:
      "Mood Match answers: I want music that reflects how I feel. MoodShift answers: I feel one way now, but I want to move somewhere else.",
    tradeoff:
      "MoodShift needs a more careful progression model, so I am not presenting it as finished.",
  },
  {
    title: "Personalization",
    accent: "taste",
    summary: "Sad music is not universal.",
    problem:
      "Mood-only discovery can return songs that match a label but do not sound like something the user would choose.",
    decision: "Use listening history to keep the recommender close to the user's actual taste.",
    why:
      "The same emotional state should lead to different recommendations for different listeners.",
    tradeoff:
      "Too much personalization can crowd out discovery, so it has to be balanced against mood fit.",
  },
  {
    title: "Explainable Recommendations",
    accent: "system",
    summary: "A reason is more useful than a black-box playlist.",
    problem:
      "If a song appears with no explanation, the user cannot tell whether the system understood their mood or just matched a familiar artist.",
    decision:
      "Show plain-language reasons such as similar to an artist you listen to and matches your melancholic mood.",
    why: "Explanations make the recommendation easier to trust and easier to correct.",
    tradeoff:
      "Explanations have to stay short and honest; they should not imply more certainty than the scoring actually has.",
  },
  {
    title: "Provider Independence",
    accent: "system",
    summary:
      "The recommendation should not fundamentally change because the user listens somewhere else.",
    problem:
      "A provider-owned recommender makes the product hard to adapt across Spotify, Apple Music, or mock data.",
    decision:
      "Keep the recommender focused on what to recommend and use providers for where the user listens.",
    why:
      "This page does not claim Apple Music playlist creation is finished; it describes the boundary I want the architecture to keep.",
    tradeoff:
      "Every provider has different catalog and account behavior, so resolving tracks still needs provider-specific work.",
  },
];

const engineeringDecisions: DecisionCardData[] = [
  {
    title: "Why DistilRoBERTa instead of OpenAI",
    accent: "mood",
    summary:
      "A narrow classifier made more sense than a general-purpose LLM call for every mood input.",
    problem: "Mood detection is a repeated classification task, not an open-ended reasoning task.",
    decision: "Use a task-specific Transformer through Hugging Face for emotion probabilities.",
    why:
      "It can run as a focused model and return structured scores without making every input depend on a paid LLM request.",
    tradeoff:
      "It has less general reasoning ability than a large language model, so the app has to design around classification output.",
  },
  {
    title: "Why Last.fm",
    accent: "discovery",
    summary:
      "I needed another discovery signal after Spotify became a weaker source for this use case.",
    problem: "The first architecture relied more heavily on Spotify audio/recommendation data.",
    decision: "Use Last.fm for similar tracks, artist relationships, and tags.",
    why: "Those signals can expand from known taste into nearby candidates before ranking.",
    tradeoff:
      "Tags are crowd-sourced and inconsistent, so they help generate candidates rather than decide the final order alone.",
  },
  {
    title: "Why Custom Ranking",
    accent: "system",
    summary: "Neither pure mood matching nor pure taste matching was good enough.",
    problem: "Mood-first results could feel random. Taste-first results could miss the requested emotion.",
    decision: "Score mood relevance and taste relevance separately before final ranking.",
    why:
      "Separating the scores made the real failure mode visible instead of hiding it inside one generic relevance number.",
    tradeoff:
      "More scoring rules mean more tuning, especially around how strict the minimum thresholds should be.",
  },
  {
    title: "Why Providers Are Destinations",
    accent: "system",
    summary:
      "Streaming APIs should help play or save music, not own the whole recommendation system.",
    problem:
      "If Spotify is both the source of taste data and the recommendation brain, the app inherits Spotify's product limits.",
    decision:
      "Use providers to resolve and open recommendations while keeping ranking logic in the app.",
    why:
      "This makes it easier to support another provider later without rewriting the recommendation idea.",
    tradeoff:
      "Provider catalogs do not match perfectly, so the same recommendation may need different resolution logic per provider.",
  },
];

const challenges: DecisionCardData[] = [
  {
    title: "Spotify API restrictions",
    accent: "warning",
    summary:
      "The first architecture depended too much on Spotify data that stopped being reliable for newer apps.",
    problem:
      "I originally planned to use Spotify Audio Features like valence, energy, danceability, and acousticness to help map mood to songs.",
    decision:
      "Move emotion understanding into my own model and use Spotify mostly for account, taste, and catalog data.",
    why:
      "That gave the app more control over the recommendation logic and made room for Last.fm as a similarity source.",
    tradeoff:
      "The app has to own more of the ranking work instead of leaning on Spotify's older recommendation features.",
  },
  {
    title: "Mood matched, user taste did not",
    accent: "danger",
    summary: "Early results could match a mood label and still feel wrong for the listener.",
    problem:
      "Generic mood or tag searches returned songs that were technically melancholic, upbeat, or calm, but sometimes obscure or random.",
    decision:
      "Start discovery from the user's Spotify listening history and expand around top artists and tracks.",
    why: "The recommendations became more grounded in what the user actually listens to.",
    tradeoff:
      "A taste-first candidate pool can get repetitive unless the system keeps enough discovery room.",
  },
  {
    title: "Taste matched, mood did not",
    accent: "success",
    summary: "My first fix went too far in the other direction.",
    problem:
      "The engine could recommend artists the user genuinely liked, but some individual tracks did not match the requested emotion.",
    decision:
      "Separate tasteScore and moodScore and require minimum relevance on both dimensions.",
    why:
      "That made the real problem obvious: liking an artist is not the same as wanting every song by that artist for every mood.",
    tradeoff:
      "Dual thresholds can reject familiar songs, but that is better than ignoring the user's actual mood request.",
  },
  {
    title: "Fallback search got too loose",
    accent: "danger",
    summary: "When filters were too strict, fallback results could become generic filler.",
    problem: "Results like Pop Mix or Dance Mix are not meaningful track recommendations.",
    decision:
      "Prefer stricter track validation, better candidate expansion, and fewer strong results over filling the page.",
    why: "The product feels more honest when it admits uncertainty instead of padding the list.",
    tradeoff:
      "Users may see fewer recommendations while the system is tuning candidate discovery.",
  },
  {
    title: "Recommendation latency",
    accent: "system",
    summary: "The full pipeline has several moving parts, so speed has to be treated as product work.",
    problem:
      "A request can involve emotion inference, Last.fm discovery, Spotify resolution, ranking, and optional song-emotion analysis.",
    decision:
      "Treat caching, model reuse, and controlled parallel requests as ongoing optimization work.",
    why:
      "The app needs to feel responsive even when it is combining multiple external and model-based signals.",
    tradeoff:
      "I am not claiming measured latency improvements here because this portfolio does not include benchmark data.",
  },
];

const scoringExamples = {
  accepted: {
    label: "Candidate A",
    status: "Keep",
    statusClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    note:
      "Enough mood fit and enough taste fit. This is the kind of candidate I want the recommender to keep.",
    rows: [
      ["Mood Match", "82%", "mood"],
      ["Taste Match", "76%", "taste"],
    ],
  },
  rejected: {
    label: "Candidate B",
    status: "Reject",
    statusClass: "text-rose-700 bg-rose-50 border-rose-200",
    note:
      "The taste score is high, but mood relevance is too low. Liking the artist is not enough.",
    rows: [
      ["Mood Match", "19%", "mood"],
      ["Taste Match", "94%", "taste"],
    ],
  },
};

const learningCards = [
  "Recommendation systems need both a discovery layer and a ranking layer.",
  "Model output only becomes useful when it is translated into product decisions.",
  "External APIs can change, so the core experience should not depend on one provider.",
  "Personalization works best when current intent and long-term taste are evaluated separately.",
];

const accentStyles = {
  mood: {
    dot: "bg-indigo-500",
    badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
    border: "border-indigo-300 bg-indigo-50/40",
    hover: "hover:border-indigo-200 hover:bg-indigo-50/30",
    rule: "border-l-indigo-200",
  },
  taste: {
    dot: "bg-emerald-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    border: "border-emerald-300 bg-emerald-50/40",
    hover: "hover:border-emerald-200 hover:bg-emerald-50/30",
    rule: "border-l-emerald-200",
  },
  discovery: {
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    border: "border-amber-300 bg-amber-50/40",
    hover: "hover:border-amber-200 hover:bg-amber-50/30",
    rule: "border-l-amber-200",
  },
  system: {
    dot: "bg-blue-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    border: "border-blue-300 bg-blue-50/40",
    hover: "hover:border-blue-200 hover:bg-blue-50/30",
    rule: "border-l-blue-200",
  },
  success: {
    dot: "bg-emerald-600",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    border: "border-emerald-300 bg-emerald-50/40",
    hover: "hover:border-emerald-200 hover:bg-emerald-50/30",
    rule: "border-l-emerald-200",
  },
  danger: {
    dot: "bg-rose-500",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    border: "border-rose-300 bg-rose-50/40",
    hover: "hover:border-rose-200 hover:bg-rose-50/30",
    rule: "border-l-rose-200",
  },
  warning: {
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    border: "border-amber-300 bg-amber-50/40",
    hover: "hover:border-amber-200 hover:bg-amber-50/30",
    rule: "border-l-amber-200",
  },
} satisfies Record<NonNullable<DecisionCardData["accent"]>, Record<string, string>>;

function DecisionCard({
  item,
  isOpen,
  onClick,
}: {
  item: DecisionCardData;
  isOpen: boolean;
  onClick: () => void;
}) {
  const accent = accentStyles[item.accent ?? "system"];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left border border-l-4 rounded-xl p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4 ${
        isOpen ? accent.border : `border-zinc-200 ${accent.rule} ${accent.hover}`
      }`}
      aria-expanded={isOpen}
    >
      <span className="flex flex-wrap items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} aria-hidden="true" />
        {item.eyebrow && (
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${accent.badge}`}>
            {item.eyebrow}
          </span>
        )}
        <span className="text-xs font-medium text-zinc-500">
          {isOpen ? "Expanded" : "Click to expand"}
        </span>
      </span>
      <span className="mt-2 block text-base font-semibold text-zinc-900">{item.title}</span>
      <span className="mt-3 block text-sm leading-relaxed text-zinc-600">{item.summary}</span>

      {isOpen && (
        <span className="mt-5 grid gap-4 text-sm leading-relaxed text-zinc-600">
          <span>
            <span className="block font-semibold text-zinc-900">Problem</span>
            {item.problem}
          </span>
          <span>
            <span className="block font-semibold text-zinc-900">Decision</span>
            {item.decision}
          </span>
          <span>
            <span className="block font-semibold text-zinc-900">Why</span>
            {item.why}
          </span>
          <span>
            <span className="block font-semibold text-zinc-900">Tradeoff</span>
            {item.tradeoff}
          </span>
        </span>
      )}
    </button>
  );
}

function MoodMusicEnhancements({ highlights }: { highlights: string[] }) {
  const [openStep, setOpenStep] = useState(0);
  const [openProductDecision, setOpenProductDecision] = useState(0);
  const [openChallenge, setOpenChallenge] = useState(0);
  const [openEngineeringDecision, setOpenEngineeringDecision] = useState(0);
  const [scoreMode, setScoreMode] = useState<keyof typeof scoringExamples>("accepted");
  const activeScore = scoringExamples[scoreMode];

  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="border-l-4 border-indigo-200 bg-indigo-50/30 pl-8 pr-6 py-5 rounded-r-2xl">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">
          What I Was Trying To Build
        </h2>
        <p className="text-base leading-relaxed text-zinc-700">
          I started this project because mood-based music recommendations often reduce people
          to a few labels like happy, sad, or chill. I wanted someone to describe how they
          actually feel, then get music that fits both that mood and the kind of music they
          already come back to.
        </p>
      </section>

      <section className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            How It Works, And Why Each Step Exists
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            The architecture is simple on purpose: understand the user's mood, understand
            their taste, find candidates, then rank with both signals instead of trusting one
            source too much.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {moodWorkflow.map((step, index) => (
            <DecisionCard
              key={step.title}
              item={{ ...step, eyebrow: `${String(index + 1).padStart(2, "0")} / ${step.eyebrow}` }}
              isOpen={openStep === index}
              onClick={() => setOpenStep(index)}
            />
          ))}
        </div>
      </section>

      <section className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Product Decisions
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            These choices came from one question: what would make a recommendation feel like
            it understood the person, not just the keyword?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {productDecisions.map((decision, index) => (
            <DecisionCard
              key={decision.title}
              item={decision}
              isOpen={openProductDecision === index}
              onClick={() => setOpenProductDecision(index)}
            />
          ))}
        </div>
      </section>

      <section className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Challenges & Iterations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            The recommender did not improve in one straight line. Each fix exposed a
            different failure mode.
          </p>
        </div>

        <div className="grid gap-4">
          {challenges.map((challenge, index) => (
            <DecisionCard
              key={challenge.title}
              item={{ ...challenge, eyebrow: `Challenge ${index + 1}` }}
              isOpen={openChallenge === index}
              onClick={() => setOpenChallenge(index)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-zinc-200 rounded-2xl p-8 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              How The Recommender Evolved
            </h2>
            <div className="flex rounded-xl border border-zinc-200 p-1">
              {(Object.keys(scoringExamples) as Array<keyof typeof scoringExamples>).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setScoreMode(mode)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                    scoreMode === mode
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {scoringExamples[mode].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {[
              [
                "V1 - Mood first",
                "Emotionally relevant candidates.",
                "Too many random or weakly personalized songs.",
              ],
              [
                "V2 - Taste first",
                "Artists and songs made more sense for the user.",
                "Some songs fit the user but not the mood.",
              ],
              [
                "Current - Mood and taste",
                "Candidates need evidence for both.",
                "The system may return fewer songs when quality is low.",
              ],
            ].map(([stage, strength, problem]) => (
              <div
                key={stage}
                className={`rounded-xl border border-l-4 p-5 ${
                  stage.startsWith("V1")
                    ? "border-zinc-200 border-l-indigo-200 bg-indigo-50/20"
                    : stage.startsWith("V2")
                      ? "border-zinc-200 border-l-emerald-200 bg-emerald-50/20"
                      : "border-zinc-200 border-l-blue-200 bg-blue-50/20"
                }`}
              >
                <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      stage.startsWith("V1")
                        ? "bg-indigo-500"
                        : stage.startsWith("V2")
                          ? "bg-emerald-500"
                          : "bg-blue-500"
                    }`}
                    aria-hidden="true"
                  />
                  {stage}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Strength: {strength}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                  Problem: {problem}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-zinc-500">
            The percentages are illustrative. They show the rule, not measured production
            diagnostics.
          </p>
        </div>

        <div className="border border-zinc-200 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Candidate Decision
          </h2>

          <div className="mt-8 space-y-4">
            {activeScore.rows.map(([label, value, accentName]) => {
              const accent = accentStyles[accentName as NonNullable<DecisionCardData["accent"]>];

              return (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-zinc-700">
                    <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} aria-hidden="true" />
                    {label}
                  </span>
                  <span className="text-zinc-500">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100">
                  <div className={`h-2 rounded-full ${accent.dot}`} style={{ width: value }} />
                </div>
              </div>
              );
            })}
          </div>

          <div className={`mt-8 rounded-xl border px-5 py-4 ${activeScore.statusClass}`}>
            <p className="text-sm font-semibold">{activeScore.status}</p>
            <p className="mt-2 text-sm leading-relaxed">{activeScore.note}</p>
          </div>
        </div>
      </section>

      <section className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Engineering Decisions
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            The technical choices were mostly about control: keeping mood analysis, candidate
            discovery, and ranking separate enough that one API change would not sink the
            whole idea.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {engineeringDecisions.map((decision, index) => (
            <DecisionCard
              key={decision.title}
              item={decision}
              isOpen={openEngineeringDecision === index}
              onClick={() => setOpenEngineeringDecision(index)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="border border-zinc-200 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Product Features
          </h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-l-4 border-zinc-200 border-l-indigo-200 bg-indigo-50/20 p-5">
              <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" aria-hidden="true" />
                Mood Match
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                I want music that reflects how I feel. This is the main recommendation flow:
                describe a mood, combine it with taste data, and rank songs that satisfy both.
              </p>
            </div>
            <div className="rounded-xl border border-l-4 border-zinc-200 border-l-blue-200 bg-blue-50/20 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true" />
                  MoodShift
                </h3>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  In development
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                I feel one way now, but I want music that gradually moves me toward another mood.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-zinc-700">
                {["Stressed", "Reflective", "Upbeat", "Energized"].map((mood, index) => (
                  <span key={mood} className="inline-flex items-center gap-2">
                    <span className="rounded-full border border-zinc-200 px-3 py-1">
                      {mood}
                    </span>
                    {index < 3 && <span className="text-zinc-400">-&gt;</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border border-zinc-200 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Architecture
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            The diagram is secondary to the story, but it shows the shape of the current approach.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ["Mood text", "mood"],
              ["DistilRoBERTa -> emotion profile", "mood"],
              ["Spotify listening history -> taste profile", "taste"],
              ["Last.fm -> candidate discovery", "discovery"],
              ["Emotion + taste + candidates", "system"],
              ["Custom ranking", "system"],
              ["Ranked tracks", "success"],
              ["Listening provider", "system"],
            ].map(([item, accentName], index, items) => {
              const accent = accentStyles[accentName as NonNullable<DecisionCardData["accent"]>];

              return (
              <div key={item}>
                <div className={`rounded-xl border border-l-4 border-zinc-200 px-5 py-4 text-sm font-medium text-zinc-800 ${accent.rule}`}>
                  <span className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} aria-hidden="true" />
                  {item}
                  </span>
                </div>
                {index < items.length - 1 && (
                  <div className="mx-5 h-5 border-l border-zinc-300" aria-hidden="true" />
                )}
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          What I Built
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {highlights.map((highlight) => (
            <div key={highlight} className="rounded-xl border border-zinc-200 p-5">
              <p className="text-sm leading-relaxed text-zinc-600">{highlight}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          What I Learned
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {learningCards.map((lesson) => (
            <div key={lesson} className="rounded-xl border border-zinc-200 p-5">
              <p className="text-sm leading-relaxed text-zinc-600">{lesson}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const isMoodMusicProject = project?.slug === "mood-music-app";

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="site-shell">
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-24 lg:py-28">
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4 rounded-sm"
        >
          <span className="mr-2">&larr;</span>
          Back to Projects
        </Link>

        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="display text-5xl leading-[.95] sm:text-7xl">
                {project.title}
              </h1>
              {project.inProgress && (
                <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full whitespace-nowrap mt-1">
                  In Progress
                </span>
              )}
            </div>
            <p className="max-w-3xl text-lg leading-relaxed text-zinc-600">{project.tagline}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm text-zinc-600 border border-zinc-200 rounded-xl"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="border-l-2 border-zinc-200 pl-8 py-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">
              Role
            </h2>
            <p className="text-base text-zinc-900">{project.role}</p>
          </div>

          {isMoodMusicProject ? (
            <MoodMusicEnhancements highlights={project.highlights} />
          ) : (
            <div className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-8">
                Key Highlights
              </h2>
              <ul className="space-y-6">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start leading-relaxed text-zinc-600 text-base"
                  >
                    <span className="mr-4 mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-zinc-400"></span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.figma && (
            <div className="border border-zinc-200 rounded-2xl p-5 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                    Design Preview
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    Explore the interactive Figma design.
                  </p>
                </div>
                <a
                  href={project.figma}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-wide text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Open in Figma ↗
                </a>
              </div>
              <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50" style={{ paddingBottom: "62.5%" }}>
                <iframe
                  src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(project.figma)}`}
                  className="absolute inset-0 h-full w-full border-0"
                  title={`${project.title} Figma design`}
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {project.slides && project.embedSlides && (
            <div className="border border-zinc-200 rounded-2xl p-8 sm:p-12">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-8">
                Project Presentation
              </h2>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    window.location.origin + project.slides,
                  )}`}
                  className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                  frameBorder="0"
                  title="Project Presentation"
                  allowFullScreen
                />
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                <a href={project.slides} download className="hover:text-zinc-900 transition-colors">
                  Download presentation &darr;
                </a>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white bg-zinc-900 rounded-xl transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4"
                aria-label={`View ${project.title} on GitHub (opens in new tab)`}
              >
                View on GitHub
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-zinc-900 border border-zinc-200 rounded-xl transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4"
                aria-label={`View ${project.title} live demo (opens in new tab)`}
              >
                Live Demo
              </a>
            )}
            {project.slides && (
              <a
                href={project.slides}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-zinc-900 border border-zinc-200 rounded-xl transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4"
                aria-label={`Download ${project.title} presentation (opens in new tab)`}
              >
                View Presentation
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
