import { useEffect, useState } from "react";
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
      className={`mood-decision-card text-left border border-l-4 rounded-xl p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4 ${
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
          <span className="decision-detail decision-problem">
            <span className="block font-semibold text-zinc-900">Problem</span>
            {item.problem}
          </span>
          <span className="decision-detail decision-choice">
            <span className="block font-semibold text-zinc-900">Decision</span>
            {item.decision}
          </span>
          <span className="decision-detail decision-why">
            <span className="block font-semibold text-zinc-900">Why</span>
            {item.why}
          </span>
          <span className="decision-detail decision-tradeoff">
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
    <div className="mood-case-study space-y-12 sm:space-y-16">
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
                className={`mood-evolution-stage rounded-xl border border-l-4 p-5 ${
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

        <div className="mood-architecture border border-zinc-200 rounded-2xl p-8 sm:p-10">
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

export function TimeManagementCaseStudyLegacy() {
  const themes = ["Lack of structure & organization", "Overloaded schedules & prioritizing", "Procrastination & last-minute work", "Distraction & maintaining focus", "Stress & mental exhaustion", "Wellness habits under pressure"];
  const moments = [
    ["What do I need to do today?", "Plan", "Assignments, tasks, deadlines, study sessions, and breaks are organized together so the next step is easier to see."],
    ["I need to actually focus.", "Focus", "A timer-led study session gives concentrated work a clear start and finish while keeping the interaction lightweight."],
    ["I've been working too long.", "Recover", "Break and self-care prompts make recovery part of the flow instead of an afterthought students must remember."],
    ["How am I doing?", "Reflect", "Progress, streak, and quick mood or stress input make consistency and wellbeing visible without becoming another obligation."],
  ];

  return <div className="time-case-study">
    <section className="time-case-hero">
      <div className="time-case-art" aria-hidden="true"><i /><i /><i /><b /><em /></div>
      <div><p className="eyebrow">UX case study · Student productivity</p><h1 className="display">Time Management &amp;<br />Burnout Prevention</h1><p>Designing a student productivity experience that treats time management and wellbeing as connected problems.</p></div>
    </section>
    <section className="time-overview" aria-label="Project overview"><div><span>Role</span><strong>UX/UI Designer</strong></div><div><span>Project type</span><strong>UX Research + Product Design</strong></div><div><span>Tools</span><strong>Figma</strong></div><div><span>Methods</span><strong>Surveys, Contextual Inquiry, Brainstorming, Personas, Crazy 8s, Wireframing, Prototyping</strong></div></section>
    <section className="time-case-section time-problem"><span>01 · The problem</span><div><h2 className="display">Productivity was not the whole story.</h2><div><p>Initial student research surfaced overloaded schedules, procrastination, difficulty prioritizing, and the challenge of balancing academics with personal activities. It also surfaced stress, mental exhaustion, and wellbeing habits that dropped away during demanding periods.</p><strong>Time management wasn’t isolated from burnout—poor organization, competing responsibilities, distraction, and stress reinforced one another.</strong></div></div></section>
    <section className="time-case-section"><span>02 · Research</span><h2 className="display">Listening before narrowing the product.</h2><div className="time-methods"><article><b>01</b><h3>Survey</h3><p>Used to understand broad struggles experienced by university students and narrow the research focus.</p></article><i /><article><b>02</b><h3>Contextual Inquiry</h3><p>Interviews were conducted with university students from different schools and programs, with an additional student observed during their daily routine.</p></article><i /><article><b>03</b><h3>Brainstorming</h3><p>Small sessions with students were used to surface recurring challenges and themes.</p></article></div></section>
    <section className="time-patterns"><span>03 · Synthesis</span><h2 className="display">Patterns started<br />repeating.</h2><div className="time-theme-cloud">{themes.map((theme, index) => <b key={theme} className={`time-theme theme-${index}`}>{theme}</b>)}</div><div className="time-impact"><div><b>Disorganization</b><i>↓</i><b>Procrastination / overload</b><i>↓</i><b>Stress</b><i>↓</i><b>Reduced wellbeing</b></div><p><strong>The productivity problem was also a wellbeing problem.</strong> Students frequently connected poor organization with stress, concentration problems, and difficulty maintaining healthy routines.</p></div></section>
    <section className="time-case-section"><span>04 · Student contexts</span><h2 className="display">Two moments of student life, one connected need.</h2><div className="time-contexts"><article><small>Upper-year context</small><h3>The multitasking upper-year student</h3><p>Balancing full-time study with work and academic, financial, social, and career responsibilities. They want structure without sacrificing wellbeing.</p></article><article><small>First-year context</small><h3>The first-year student adjusting to independence</h3><p>Developing new routines amid distraction and noisy environments while learning to balance school and social life.</p></article></div><div className="time-refined"><span>Refined problem</span><strong>Students need an integrated support system focused on time management, reducing burnout, and improving wellness.</strong></div></section>
    <section className="time-case-section"><span>05 · Product direction</span><h2 className="display">One experience, three ways to help.</h2><div className="time-pillars"><article><b>Plan</b><p>Organize assignments, tasks, study sessions, deadlines, and breaks.</p></article><article><b>Focus</b><p>Create focused study sessions and reduce distractions.</p></article><article><b>Recover</b><p>Encourage breaks, self-care activities, and awareness of wellbeing.</p></article></div></section>
    <section className="time-process"><span>06 · Exploring the flow</span><div><h2 className="display">Before polishing screens,<br />we explored possibilities.</h2><p>Crazy 8 sketches and paper low-fidelity screens helped the team explore several interface approaches before consolidating them into a mobile flow.</p></div><div className="time-progression"><b>Crazy 8s</b><i>→</i><b>Low fidelity</b><i>→</i><b>Wireframes</b><i>→</i><b>Interactive prototype</b></div></section>
    <section className="time-case-section"><span>07 · Interface rationale</span><h2 className="display">Research shaped the interface—not just the feature list.</h2><div className="time-decisions"><article><h3>Direct manipulation</h3><p>Tasks, timers, and interactive elements use simple actions such as tapping and toggling to keep progress visible and actions immediate.</p></article><article><h3>Familiar metaphors</h3><p>Calendar for scheduling, clock for focus sessions, fire for streaks, and emoji for quick mood and stress input reduce the effort required to learn the system.</p></article><article><h3>Less cognitive load</h3><p>Whitespace, hierarchy, and familiar patterns deliberately make the experience easier to scan when students already feel overloaded.</p></article><article><h3>Motivation without complexity</h3><p>Bright accents and lightweight gamification support engagement without making productivity feel like another demanding system.</p></article></div></section>
    <section className="time-final"><span>08 · The prototype</span><h2 className="display">Designed around the moments<br />that make a day feel manageable.</h2><div>{moments.map(([need, label, response]) => <article key={need}><small>{label}</small><h3>“{need}”</h3><div className="time-screen-label">Screen: {label}</div><p><strong>Design response → </strong>{response}</p></article>)}</div></section>
    <section className="time-reflection"><div><span>09 · Reflection</span><h2 className="display">What this process clarified.</h2></div><div><p>Research can reveal a different underlying problem than the one a project starts with. Here, it showed that productivity and wellbeing should not necessarily be designed as separate experiences.</p><p>It also reinforced how familiar interactions can lower cognitive effort, and how early sketching creates room to explore before committing to polished UI.</p><h3>What I would explore next</h3><ul><li>Which wellness interventions feel useful rather than annoying?</li><li>When does productivity gamification motivate—and when does it become pressure itself?</li><li>Which dashboard information helps without adding cognitive overload?</li></ul></div></section>
  </div>;
}

function TimeManagementCaseStudy() {
  const themes = ["Lack of structure and organization", "Overloaded schedules", "Procrastination and last-minute work", "Difficulty prioritizing assignments", "Distraction and focus problems", "Stress and mental exhaustion", "Wellness neglected during busy periods"];
  const moments = [
    ["What do I need to do today?", "Dashboard, schedule, and task organization"],
    ["I need to focus.", "Focus timer and study session"],
    ["I'm getting overwhelmed.", "Breaks, mood input, and wellness support"],
    ["How am I doing?", "Streaks, progress, and mood tracking"],
  ];
  const designUrl = "https://www.figma.com/design/WJOgtxbWFXWlRFDGTTZPQ7/Time-Management-Burnout-App?node-id=2-2009";
  const designEmbedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(designUrl)}`;
  const prototypeUrl = "https://www.figma.com/proto/WJOgtxbWFXWlRFDGTTZPQ7/Time-Management%2FBurnout-App?node-id=1-2&t=yrWGZMz9ftHDLHq4-1";
  const prototypeEmbedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(prototypeUrl)}`;
  const [activeArtifact, setActiveArtifact] = useState<{ src: string; alt: string; caption: string } | null>(null);

  useEffect(() => {
    const figures = Array.from(document.querySelectorAll<HTMLElement>(".time-evidence-case figure"));
    const cleanups = figures.map((figure) => {
      const image = figure.querySelector("img");
      if (!image) return () => undefined;
      const open = () => setActiveArtifact({
        src: image.currentSrc || image.src,
        alt: image.alt,
        caption: figure.querySelector("figcaption")?.textContent ?? image.alt,
      });
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      };
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", `Open enlarged artifact: ${image.alt}`);
      figure.addEventListener("click", open);
      figure.addEventListener("keydown", onKeyDown);
      return () => {
        figure.removeEventListener("click", open);
        figure.removeEventListener("keydown", onKeyDown);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveArtifact(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return <div className="time-evidence-case">
    <section className="time-case-hero"><div className="time-case-art" aria-hidden="true"><i /><i /><i /><b /><em /></div><div><p className="eyebrow">UX case study &middot; Student productivity</p><h1 className="display">Time Management &amp;<br />Burnout Prevention</h1><p>Designing a student productivity experience that treats time management and wellbeing as connected problems.</p></div></section>
    <section className="time-overview"><div><span>Role</span><strong>UX/UI Designer</strong></div><div><span>Project type</span><strong>UX Research + Product Design</strong></div><div><span>Tools</span><strong>Figma</strong></div><div><span>Methods</span><strong>Surveys, Contextual Inquiry, Brainstorming, Personas, Crazy 8s, Wireframing, Prototyping</strong></div></section>
    <section className="time-evidence-section time-problem"><span>01 &middot; The problem</span><div><h2 className="display">Productivity was not the whole story.</h2><div><p>Across the student research, overloaded schedules, procrastination, difficulty prioritizing, balancing academics and personal activities, stress, and mental exhaustion were interconnected. During demanding periods, physical and mental wellbeing often slipped behind academic demands.</p><strong>Time management was not isolated from burnout. Poor organization, competing responsibilities, distraction, and stress reinforced one another.</strong></div></div></section>
    <section className="time-evidence-section"><span>02 &middot; Research</span><h2 className="display">Listening before narrowing the product.</h2><div className="time-methods"><article><b>01</b><h3>Survey</h3><p>Used to identify broad struggles university students faced before narrowing the problem space.</p></article><i /><article><b>02</b><h3>Contextual Inquiry</h3><p>Four university students from different schools and programs were interviewed; one student was observed through a day in their life while being interviewed.</p></article><i /><article><b>03</b><h3>Brainstorming</h3><p>Small sessions with 3-5 university students surfaced shared challenges and recurring terms.</p></article></div><div className="time-evidence-grid"><figure><img src="/images/time-management/research-artifact-4.png" alt="Original student interview notes" /><figcaption>Original interview notes. The research began with broad student problems rather than a predetermined app feature.</figcaption></figure><figure><img src="/images/time-management/research-artifact-3.png" alt="Original contextual inquiry notes" /><figcaption>Original contextual inquiry notes from students in different programs and living situations.</figcaption></figure></div></section>
    <section className="time-patterns"><span>03 &middot; Synthesis</span><h2 className="display">Patterns started<br />repeating.</h2><figure className="time-affinity"><img src="/images/time-management/research-artifact-2.png" alt="Original brainstorming affinity map of student problems" /><figcaption>Original brainstorming map. Time management, distraction and focus, wellness, finances, and support were mapped as connected student problems.</figcaption></figure><div className="time-theme-cloud">{themes.map((theme, index) => <b key={theme} className={`time-theme theme-${index}`}>{theme}</b>)}</div><div className="time-impact"><div><b>Disorganization</b><i>&darr;</i><b>Procrastination / overload</b><i>&darr;</i><b>Stress</b><i>&darr;</i><b>Reduced wellbeing</b></div><p><strong>The productivity problem was also a wellbeing problem.</strong> Students connected poor organization with stress, concentration problems, and difficulty maintaining healthy routines.</p></div></section>
    <section className="time-evidence-section"><span>04 &middot; Personas and problem statement</span><h2 className="display">Two specific student contexts shaped the direction.</h2><div className="time-personas"><article><small>Sophia &middot; 22 &middot; Fourth year</small><h3>Off campus and working part time</h3><p>Balancing school, work, finances, and wellness. Her need for a daily structure that still makes room for recovery informed the combined schedule, task, and wellness direction.</p></article><article><small>Marcus &middot; 18 &middot; First year</small><h3>In a dorm, adjusting to independence</h3><p>Managing distraction, routine, budgeting, focus, and a new social environment. His context reinforced simple mobile interactions, focus sessions, and reminders.</p></article></div><div className="time-refined"><span>Original problem statement</span><strong>Students need an integrated student support system focused on time management, reducing burnout, and improving wellness.</strong></div></section>
    <section className="time-evidence-section"><span>05 &middot; Product direction</span><h2 className="display">Research narrowed the opportunities.</h2><div className="time-pillars"><article><b>Plan</b><p>Organize assignments, schedules, deadlines, and breaks.</p></article><article><b>Focus</b><p>Support study sessions and reduce distractions.</p></article><article><b>Recover</b><p>Use reminders, self-care suggestions, and mood or stress awareness to protect wellbeing.</p></article></div></section>
    <section className="time-process"><span>06 &middot; From rough ideas to a mobile flow</span><div><h2 className="display">Before polishing screens,<br />we explored possibilities.</h2><p>The original sketches and paper screens explored task planning, focus sessions, progress, and wellness before the direction was consolidated into Figma.</p></div><div className="time-progression"><b>Crazy 8 sketches</b><i>&rarr;</i><b>Paper prototype</b><i>&rarr;</i><b>Low-fidelity wireframes</b></div><div className="time-process-images"><figure><img src="/images/time-management/presentation-extracts/image-00.jpg" alt="Original Crazy 8 sketch sheet" /><figcaption>Crazy 8 sketches</figcaption></figure><figure><img src="/images/time-management/presentation-extracts/image-02.jpg" alt="Original paper prototype" /><figcaption>Paper prototype</figcaption></figure><figure><img src="/images/time-management/presentation-extracts/image-03.jpg" alt="Original low-fidelity wireframe sheet" /><figcaption>Low-fidelity wireframes</figcaption></figure></div><div className="time-lowfi"><div><h3>Testing the core flow in low fidelity.</h3><p>These wireframes defined the structure and interaction flow before visual polish.</p></div><div className="time-lowfi-gallery">{moments.map(([need], index) => <figure key={need}><img src={["/images/time-management/final-screens/dashboard.jpg", "/images/time-management/final-screens/focus.jpg", "/images/time-management/final-screens/break.jpg", "/images/time-management/final-screens/progress.jpg"][index]} alt={`Low-fidelity wireframe: ${need}`} /><figcaption>{need}</figcaption></figure>)}</div></div></section>
    <section className="time-evidence-section"><span>07 &middot; Interface rationale</span><h2 className="display">The interface was designed for overloaded students.</h2><div className="time-decisions"><article><h3>Direct manipulation</h3><p>Tasks, timers, charts, and toggles use direct touch. Simple taps start sessions, update tasks, and respond to alerts or notifications.</p></article><article><h3>Recognizable metaphors</h3><p>Calendar for scheduling, clock and progress bars for time, fire for streaks, and emoji for mood or stress input make the interface easier to interpret.</p></article><article><h3>Reducing cognitive load</h3><p>White space and a clear hierarchy improve readability when students feel overwhelmed or mentally exhausted.</p></article><article><h3>Guiding attention</h3><p>Bright colors guide attention and maintain engagement without turning the experience into another demanding system.</p></article></div><figure className="time-moodboard"><img src="/images/time-management/presentation-extracts/image-05.jpg" alt="Original Time Management and Burnout System moodboard" /><figcaption>Original moodboard: palette, icon metaphors, interaction references, and interface inspiration.</figcaption></figure></section>
    <section className="time-final"><span>08 &middot; Hi-Fi Prototype</span><h2 className="display">From structure to the final experience.</h2><p>The high-fidelity design brings the research, scheduling, focus, and wellness flows together into one cohesive student experience.</p><div className="time-design-preview"><div className="time-design-preview-header"><div><h3>Hi-Fi Design Preview</h3><p>Explore the polished interface and final visual system.</p></div><a className="time-figma-link" href={designUrl} target="_blank" rel="noopener noreferrer">Open design in Figma <span aria-hidden="true">{"\u2197"}</span></a></div><div className="time-figma-embed"><iframe title="Time Management and Burnout Prevention high-fidelity Figma design" src={designEmbedUrl} loading="lazy" allowFullScreen /></div></div><div className="time-design-preview time-interactive-preview"><div className="time-design-preview-header"><div><h3>Interactive Prototype</h3><p>Try the clickable flow and experience the key interactions.</p></div><a className="time-figma-link" href={prototypeUrl} target="_blank" rel="noopener noreferrer">Open interactive prototype <span aria-hidden="true">{"\u2197"}</span></a></div><div className="time-figma-embed"><iframe title="Time Management and Burnout Prevention interactive Figma prototype" src={prototypeEmbedUrl} loading="lazy" allowFullScreen /></div></div></section>
    <section className="time-reflection"><div><span>09 &middot; Reflection</span><h2 className="display">What this process clarified.</h2></div><div><p>Research revealed that productivity and wellbeing should not necessarily be designed as separate experiences. Familiar interaction patterns and early sketching helped reduce cognitive effort before the UI became polished.</p><h3>What I would explore next</h3><ul><li>Which wellness interventions feel useful rather than annoying?</li><li>How much gamification motivates before it becomes pressure itself?</li><li>Which dashboard information helps without creating additional cognitive overload?</li></ul></div></section>
    {activeArtifact && <div className="artifact-lightbox" role="presentation" onMouseDown={() => setActiveArtifact(null)}><div className="artifact-lightbox-dialog" role="dialog" aria-modal="true" aria-label={activeArtifact.alt} onMouseDown={(event) => event.stopPropagation()}><button type="button" onClick={() => setActiveArtifact(null)} className="artifact-lightbox-close" aria-label="Close enlarged artifact">Close <span aria-hidden="true">&times;</span></button><img src={activeArtifact.src} alt={activeArtifact.alt} /><p>{activeArtifact.caption}</p></div></div>}
  </div>;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const isMoodMusicProject = project?.slug === "mood-music-app";
  const isTimeManagementProject = project?.slug === "burnout-app";

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="site-shell">
      <Navbar />

      <main className={`mx-auto px-6 py-16 sm:px-8 sm:py-24 lg:py-28 ${isTimeManagementProject ? "max-w-6xl time-project-page" : "max-w-4xl"} ${isMoodMusicProject ? "mood-project-page" : ""}`}>
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4 rounded-sm"
        >
          <span className="mr-2">&larr;</span>
          Back to Projects
        </Link>

        {isTimeManagementProject ? <div className="mt-10 sm:mt-14"><TimeManagementCaseStudy /></div> : <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-16">
          <div className={`space-y-6 ${isMoodMusicProject ? "mood-project-hero" : ""}`}>
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

          {project.figma && !isTimeManagementProject && (
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
                className="button-primary rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4"
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
        </div>}
      </main>
      <Footer />
    </div>
  );
}
