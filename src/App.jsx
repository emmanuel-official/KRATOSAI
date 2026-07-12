import React, { useState, useRef, useEffect } from "react";
import {
  Terminal, CheckCircle2, Circle, ChevronRight, ChevronDown, Plus, X,
  Upload, Download, Trash2, Wrench, Layers, Zap, Bot, DollarSign,
  Sparkles, ArrowUpRight, Copy, Check, BookOpen, Target, Flame,
  GitBranch, Package, Rocket, Menu
} from "lucide-react";

/* =========================================================================
   KRATOS AI — dark + phosphor-green control-room theme
   Signature: a live "automation graph" — glowing nodes pulse packets of
   light along connecting lines, like a Make.com/n8n canvas breathing
   in the background. Everything else stays quiet so that reads clean.
   ========================================================================= */

/* ---------------------------- static content ---------------------------- */

const ROADMAP = [
  {
    id: "p1",
    phase: "Phase 01",
    title: "No-Code Foundations",
    blurb: "Learn how triggers, actions, and data actually move between apps.",
    items: [
      "Understand triggers vs actions vs filters",
      "Build a 2-step Zap: form submission → email notification",
      "Build the same flow in Make.com and compare",
      "Map data between apps (variables, mapping panel)",
      "Handle errors: retries, fallback paths, error notifications",
      "Connect Google Sheets as a lightweight database",
    ],
  },
  {
    id: "p2",
    phase: "Phase 02",
    title: "Multi-Step & Logic-Heavy Flows",
    blurb: "Move from single triggers to branching, looping automations.",
    items: [
      "Router / paths for conditional logic",
      "Loops & iterators over arrays of data",
      "Webhooks: sending and receiving custom payloads",
      "Working with JSON responses from APIs",
      "Rate limits, delays, and scheduling logic",
      "Rebuild one Zapier flow natively in n8n (self-hosted mindset)",
    ],
  },
  {
    id: "p3",
    phase: "Phase 03",
    title: "Bringing AI Into the Workflow",
    blurb: "Turn automations from 'move data' into 'think about data.'",
    items: [
      "OpenAI API basics: chat completions, system prompts",
      "Prompt engineering for consistent, structured output",
      "Force structured JSON responses for downstream steps",
      "Plug OpenAI module into a Make.com/n8n scenario",
      "Add AI classification (e.g. sentiment, category, priority)",
      "Add AI summarization of long text (emails, transcripts, docs)",
    ],
  },
  {
    id: "p4",
    phase: "Phase 04",
    title: "Python for Automation",
    blurb: "Escape the no-code ceiling when a scenario can't do it.",
    items: [
      "Python fundamentals for scripting (requests, json, os)",
      "Calling REST APIs directly from Python",
      "Scheduling scripts (cron, or a hosted scheduler)",
      "Reading/writing files, CSVs, and simple databases",
      "Wrapping a Python script as a webhook Make.com/n8n can call",
      "Basic error handling & logging for unattended scripts",
    ],
  },
  {
    id: "p5",
    phase: "Phase 05",
    title: "Agent Frameworks",
    blurb: "Give the automation memory, tools, and multi-step reasoning.",
    items: [
      "Core concepts: agents, tools, memory, chains",
      "Build a single-tool agent in LangChain",
      "Build a multi-agent crew in CrewAI (roles + tasks)",
      "Explore AutoGen for agent-to-agent conversations",
      "Give an agent a real tool: web search, file read/write, API call",
      "Add persistent memory so an agent 'remembers' past runs",
    ],
  },
  {
    id: "p6",
    phase: "Phase 06",
    title: "Productionizing & Selling",
    blurb: "Take an automation from 'works on my machine' to 'client relies on it.'",
    items: [
      "Deploy an n8n instance or scheduled script reliably",
      "Add monitoring / failure alerts (Slack, email, SMS)",
      "Document a build so a non-technical client can run it",
      "Package a repeatable offer (fixed scope, fixed price)",
      "Price and pitch first automation gig",
      "Collect a testimonial and turn it into a case study",
    ],
  },
];

const DIFF = {
  Easy: { label: "Easy", ring: "ring-emerald-400/40", text: "text-emerald-300", bg: "bg-emerald-400/10", dot: "bg-emerald-400", bar: "from-emerald-400 to-emerald-300" },
  Medium: { label: "Medium", ring: "ring-lime-400/40", text: "text-lime-300", bg: "bg-lime-400/10", dot: "bg-lime-400", bar: "from-lime-400 to-emerald-400" },
  Advanced: { label: "Advanced", ring: "ring-amber-400/40", text: "text-amber-300", bg: "bg-amber-400/10", dot: "bg-amber-400", bar: "from-amber-400 to-lime-400" },
};

const CURATED_PROJECTS = [
  {
    id: "c1",
    title: "Inbox First-Response Bot",
    difficulty: "Easy",
    time: "1–2 hrs",
    tools: ["Zapier or Make.com", "Gmail"],
    what: "Watches a Gmail inbox and instantly sends a templated holding reply to any new email, so nobody waits in silence while you're mid-edit.",
    steps: [
      "Trigger: New email in Gmail (matching a label or 'inbox' folder).",
      "Filter: only continue if the sender isn't already in a 'replied' label, to avoid loops.",
      "Action: send a templated reply ('Got your message, replying within 24h').",
      "Action: apply a 'auto-replied' label to the thread so it doesn't fire twice.",
      "Test with a throwaway email address before pointing it at your real inbox.",
    ],
  },
  {
    id: "c2",
    title: "New Upload → Everywhere Poster",
    difficulty: "Easy",
    time: "1–2 hrs",
    tools: ["Make.com", "RSS/YouTube module", "Discord or Twitter/X module"],
    what: "The moment Oloba Visuals publishes a new video, this posts an announcement to your Discord/community and drafts a tweet automatically — no manual cross-posting.",
    steps: [
      "Trigger: RSS module watching your channel's upload feed (or YouTube module if available).",
      "Action: format a message using the video title + link + a fixed hype line.",
      "Action: post that message to a Discord webhook.",
      "Action (parallel branch): create a draft tweet with the same content for you to review before it goes live.",
      "Add a filter so shorts and long-form get slightly different caption templates.",
    ],
  },
  {
    id: "c3",
    title: "Lead Capture → Sheet → Alert",
    difficulty: "Easy",
    time: "2 hrs",
    tools: ["Make.com or Zapier", "Google Forms/Sheets", "Slack or Telegram"],
    what: "Anyone who fills a 'work with me' form gets logged automatically and you get pinged in real time instead of checking a spreadsheet.",
    steps: [
      "Trigger: New Google Form response.",
      "Action: append a row to a 'Leads' Google Sheet with a timestamp.",
      "Action: send yourself a Telegram/Slack message with the lead's name + summary.",
      "Add a status column you update manually as leads move through your pipeline.",
      "Optional: auto-send the lead a confirmation email.",
    ],
  },
  {
    id: "c4",
    title: "AI Caption & Hashtag Generator",
    difficulty: "Easy",
    time: "2–3 hrs",
    tools: ["Make.com", "OpenAI API"],
    what: "Feed it a short description of a clip and it returns a ready-to-post caption plus hashtags in your voice, cutting the 'what do I even write' delay before posting.",
    steps: [
      "Trigger: manual (webhook you call from a form) or scheduled from a Sheet row.",
      "Action: OpenAI module with a system prompt describing your channel's tone and niche.",
      "Prompt for structured output: caption, 5 hashtags, one hook line, as JSON.",
      "Action: write the result back into the Sheet or send it to yourself via Telegram.",
      "Tune the system prompt with 3–4 example captions you've already written, for consistency.",
    ],
  },
  {
    id: "c5",
    title: "AI Email Summarizer & Draft Responder",
    difficulty: "Medium",
    time: "3–4 hrs",
    tools: ["Make.com or n8n", "OpenAI API", "Gmail"],
    what: "Long or messy client emails get summarized into 3 bullet points and a suggested reply draft is created — you just review and send.",
    steps: [
      "Trigger: New email in a specific label (e.g. 'Client').",
      "Action: send the email body to OpenAI with a prompt asking for a 3-bullet summary + urgency score (1–5).",
      "Action: second OpenAI call using the summary to draft a reply in your tone.",
      "Action: create a Gmail draft (not send) with the AI's reply, so you always approve first.",
      "Route: if urgency score ≥ 4, also ping you on Telegram immediately.",
    ],
  },
  {
    id: "c6",
    title: "Long-Form → Multi-Platform Repurposer",
    difficulty: "Medium",
    time: "4–6 hrs",
    tools: ["n8n or Make.com", "OpenAI API", "ElevenLabs (optional)", "Google Drive"],
    what: "Drop in a transcript from a recap video and get back a blog post, three short-form captions, and a Twitter thread — turning one edit into a week of content.",
    steps: [
      "Trigger: new transcript .txt file added to a Google Drive folder.",
      "Action: OpenAI call #1 — condense transcript into a structured outline (JSON: title, sections).",
      "Action: OpenAI call #2 — expand outline into a blog post in your voice.",
      "Action: OpenAI call #3 — generate 3 short-form captions + a 5-tweet thread from the same outline.",
      "Action: save all outputs as separate files back into a 'Repurposed' Drive folder, named by date.",
      "Review manually before publishing — this is a first-draft machine, not an autopilot.",
    ],
  },
  {
    id: "c7",
    title: "Support/Comment Triage Bot",
    difficulty: "Medium",
    time: "4–5 hrs",
    tools: ["Make.com", "OpenAI API", "Airtable or Sheets"],
    what: "Classifies incoming messages (DMs, comments, form replies) into categories — question, collab pitch, spam, urgent — and routes each to the right place automatically.",
    steps: [
      "Trigger: new row in a Sheet (from a form) or a webhook from a comment-scraping tool.",
      "Action: OpenAI call classifying the message into one of 4–5 fixed categories, returned as JSON.",
      "Router: branch based on category.",
      "Branch 'collab pitch' → log to an Airtable base with all pitch details for later review.",
      "Branch 'urgent' → Telegram alert immediately.",
      "Branch 'spam' → archive silently, no action.",
    ],
  },
  {
    id: "c8",
    title: "Enrich-and-Score Lead Pipeline",
    difficulty: "Medium",
    time: "5–6 hrs",
    tools: ["Make.com or n8n", "OpenAI API", "Clearbit/People Data Labs (or manual scrape)", "Airtable"],
    what: "New leads get automatically enriched with extra context, scored by an AI on fit, and assigned a priority — the CRM basically pre-qualifies itself.",
    steps: [
      "Trigger: new lead in a form/Sheet.",
      "Action: call an enrichment API (or scrape a public profile) to pull extra company/person data.",
      "Action: OpenAI call — given the enriched profile, score fit 1–10 and give a one-line reason.",
      "Action: write lead + enrichment + score into Airtable.",
      "Router: score ≥ 7 → notify immediately; score < 4 → auto-tag 'low priority', no notification.",
    ],
  },
  {
    id: "c9",
    title: "Competitor Watch Agent",
    difficulty: "Advanced",
    time: "6–8 hrs",
    tools: ["Python", "LangChain or a single OpenAI agent", "web search / scraping tool", "Sheets or Notion"],
    what: "An agent that checks a list of competitor channels weekly, summarizes what's trending in their recent uploads, and writes you a short brief — the research pass you already do by hand, automated.",
    steps: [
      "Set up a scheduled Python script (weekly cron).",
      "Give the agent a 'search/scrape' tool to pull recent titles/descriptions for a fixed list of channels.",
      "Prompt the agent to identify patterns: recurring formats, hooks, upload cadence changes.",
      "Have it output a structured weekly brief (markdown or JSON).",
      "Action: push the brief into a Notion page or email it to yourself every Monday.",
      "Log each week's brief so you can compare trend shifts over a month.",
    ],
  },
  {
    id: "c10",
    title: "Multi-Agent Content Pipeline (Research → Script → Edit Notes)",
    difficulty: "Advanced",
    time: "8–12 hrs",
    tools: ["CrewAI", "OpenAI API", "Python", "Google Drive"],
    what: "Three agents with distinct roles collaborate: a Researcher pulls plot/context for a film, a Scriptwriter drafts a recap script in your voice, an Editor reviews it against your style guide and flags fixes — mirroring the 'Over Your Dead Body' script workflow, but running itself.",
    steps: [
      "Define 3 CrewAI agents: Researcher, Scriptwriter, Editor — each with a role, goal, and backstory.",
      "Researcher's task: given a movie title, produce a structured plot + key-scene summary.",
      "Scriptwriter's task: turn that summary into a recap script following your existing format (hook, act breaks, CTA).",
      "Editor's task: check the script against a rubric (pacing, spoiler placement, runtime target) and return specific edits.",
      "Chain the tasks so each agent's output feeds the next.",
      "Output: a finished script + an edit-notes doc saved to Drive, ready for voiceover in ElevenLabs.",
    ],
  },
  {
    id: "c11",
    title: "Autonomous Social Performance Agent",
    difficulty: "Advanced",
    time: "10–14 hrs",
    tools: ["Python", "LangChain/AutoGen", "Platform analytics API", "OpenAI API", "Notion or Airtable"],
    what: "An agent that pulls your recent post performance, reasons about what's working, drafts next week's content angles based on the data, and logs its own recommendations for you to approve — a standing strategist, not just a poster.",
    steps: [
      "Build a tool that pulls recent post stats (views, retention, engagement) from the platform's analytics API.",
      "Agent step 1: analyze the stats and identify the top and bottom performers with reasons.",
      "Agent step 2: given the analysis, propose 5 content angles for next week, ranked by expected performance.",
      "Agent step 3: draft titles/hooks for each proposed angle.",
      "Persist memory across runs so the agent references last week's recommendations vs actual results.",
      "Output a weekly strategy doc — you stay the final decision-maker, the agent just does the analysis legwork.",
    ],
  },
  {
    id: "c12",
    title: "Productized Client Automation (End-to-End)",
    difficulty: "Advanced",
    time: "15+ hrs",
    tools: ["n8n (self-hosted)", "Python", "OpenAI API", "A simple front-end (form or dashboard)", "Client's stack"],
    what: "A complete, sellable automation built for a specific client use case (e.g. a small business's lead-to-quote flow), including a lightweight interface so a non-technical client can trigger and monitor it themselves.",
    steps: [
      "Scope the client's exact workflow in plain language before building anything.",
      "Build the core automation in n8n/Python, exactly matching the scoped steps — no extra features.",
      "Add monitoring: a Slack/email alert on failure, and a simple run-log the client can check.",
      "Build a minimal front-end (a form or small dashboard) so the client doesn't need to touch the backend.",
      "Write a one-page 'how this works' doc in plain English for the client.",
      "Deliver, walk them through it live, and set a price for ongoing maintenance if they want it.",
    ],
  },
];

const MONETIZATION_TIERS = [
  {
    name: "Templates & Micro-Products",
    icon: Package,
    range: "$15 – $60 / sale",
    desc: "Package a finished automation (e.g. the caption generator or repurposer) as a ready-made template and sell it on Gumroad or a similar storefront.",
    moves: [
      "Strip client-specific keys, add a setup guide, screen-record a 5-min walkthrough.",
      "Price low to start (build reviews), raise price after the first 10 sales.",
      "Bundle 3 related templates into a 'starter pack' for a higher price point.",
    ],
  },
  {
    name: "Freelance Automation Gigs",
    icon: Wrench,
    range: "$50 – $400 / project",
    desc: "One-off builds for small businesses on Fiverr/Upwork or direct outreach — the 'Easy' and 'Medium' projects in this roadmap are exactly this tier.",
    moves: [
      "List 2–3 fixed-scope gigs ('I will build you a lead-capture automation') instead of open-ended offers.",
      "Use your own built projects as portfolio proof — screen-record the flow running.",
      "Always scope in writing before starting: trigger, actions, what 'done' looks like.",
    ],
  },
  {
    name: "Retainer / Maintenance",
    icon: GitBranch,
    range: "$50 – $200 / month per client",
    desc: "Once a client has a working automation, offer ongoing monitoring and small tweaks as a monthly retainer instead of a one-time fee.",
    moves: [
      "Pitch this right after a successful project delivery, while trust is highest.",
      "Keep scope tight: uptime checks, minor edits, monthly report. Anything bigger is a new project.",
      "Three retainer clients at $100/mo is steadier income than chasing new one-off gigs.",
    ],
  },
  {
    name: "Custom Agent Builds",
    icon: Bot,
    range: "$300 – $1500+ / project",
    desc: "Advanced-tier multi-agent systems (research agents, content pipelines) sold to businesses or creators who need more than a simple Zap.",
    moves: [
      "Target creators/small agencies who already do the workflow manually — you're selling time back.",
      "Lead with a demo of one of your Advanced projects (e.g. the multi-agent content pipeline) as proof of capability.",
      "Price by value delivered (hours saved per week × their rate), not by your build time.",
    ],
  },
];

/* --------------------------------- utils --------------------------------- */

const uid = () => Math.random().toString(36).slice(2, 10);
const STORAGE_KEY = "kratos_ai_state_v1";

/**
 * Two save targets, tried in order:
 *  1. window.storage — Claude.ai's built-in artifact persistence (works when
 *     this component is running as a Claude artifact, where localStorage is
 *     blocked).
 *  2. localStorage — used when this file is running as a normal app in your
 *     own browser (e.g. saved locally, deployed, or run via a dev server).
 * Everything is wrapped in try/catch so a missing API on either side never
 * crashes the app — it just quietly falls through to the next option.
 */
async function loadState() {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const result = await window.storage.get(STORAGE_KEY, false);
      if (result?.value) return JSON.parse(result.value);
      return null;
    }
  } catch (e) {
    /* no saved key yet, or window.storage unavailable — fall through */
  }
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    /* private browsing / storage disabled — fall through to defaults */
  }
  return null;
}

async function saveState(data) {
  const payload = JSON.stringify(data);
  try {
    if (typeof window !== "undefined" && window.storage) {
      await window.storage.set(STORAGE_KEY, payload, false);
      return;
    }
  } catch (e) {
    /* fall through to localStorage */
  }
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, payload);
    }
  } catch (e) {
    /* persistence is a convenience, not a requirement — stay silent */
  }
}

/* ------------------------------ background fx ---------------------------- */

function AutomationGraph() {
  // A quiet, looping node-graph animation: the signature element.
  const nodes = [
    { x: 8, y: 20 }, { x: 30, y: 10 }, { x: 30, y: 42 }, { x: 55, y: 26 },
    { x: 55, y: 62 }, { x: 80, y: 18 }, { x: 80, y: 50 }, { x: 96, y: 34 },
  ];
  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7],
  ];
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-35c"
      viewBox="0 0 100 70"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
          <stop offset="50%" stopColor="#5eead4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="#14532d"
          strokeWidth="0.25"
        />
      ))}
      {edges.map(([a, b], i) => (
        <circle key={"p" + i} r="0.9" fill="url(#edgeGrad)" className="pulse-dot">
          <animateMotion
            dur={`${5 + (i % 4)}s`}
            repeatCount="indefinite"
            begin={`${i * 0.6}s`}
            path={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`}
          />
        </circle>
      ))}
      {nodes.map((n, i) => (
        <circle key={"n" + i} cx={n.x} cy={n.y} r="1.1" fill="#052e1c" stroke="#34d399" strokeWidth="0.35" className="node-glow" />
      ))}
    </svg>
  );
}

/* --------------------------------- shell ---------------------------------- */

const TABS = [
  { id: "roadmap", label: "Roadmap", icon: Target },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "monetize", label: "Monetize", icon: DollarSign },
];

export default function KratosAI() {
  const [tab, setTab] = useState("roadmap");
  const [checked, setChecked] = useState({});
  const [expandedPhase, setExpandedPhase] = useState("p1");
  const [myProjects, setMyProjects] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [saveState_, setSaveState] = useState("idle"); // idle | saving | saved

  // Load once on mount, from whichever storage is available.
  useEffect(() => {
    let cancelled = false;
    loadState().then((saved) => {
      if (cancelled) return;
      if (saved?.checked) setChecked(saved.checked);
      if (saved?.myProjects) setMyProjects(saved.myProjects);
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, []);

  // Save on every change, once the initial load has finished (so we never
  // overwrite a saved state with empty defaults before it's loaded).
  useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    const t = setTimeout(() => {
      saveState({ checked, myProjects }).then(() => setSaveState("saved"));
    }, 300);
    return () => clearTimeout(t);
  }, [checked, myProjects, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const totalItems = ROADMAP.reduce((s, p) => s + p.items.length, 0);
  const doneItems = Object.values(checked).filter(Boolean).length;
  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  const toggleItem = (phaseId, idx) => {
    const key = `${phaseId}-${idx}`;
    setChecked((c) => ({ ...c, [key]: !c[key] }));
  };

  const allProjects = [...CURATED_PROJECTS, ...myProjects];
  const filteredProjects =
    difficultyFilter === "All"
      ? allProjects
      : allProjects.filter((p) => p.difficulty === difficultyFilter);

  const addProject = (proj) => {
    setMyProjects((p) => [{ ...proj, id: uid(), mine: true, addedAt: new Date().toISOString() }, ...p]);
    setShowAdd(false);
    setToast("Project added to your builds");
  };

  const removeMyProject = (id) => {
    setMyProjects((p) => p.filter((x) => x.id !== id));
    setToast("Removed");
  };

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ checked, myProjects }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kratos-ai-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Progress exported");
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.checked) setChecked(parsed.checked);
        if (parsed.myProjects) setMyProjects(parsed.myProjects);
        setToast("Progress imported");
      } catch (err) {
        setToast("Couldn't read that file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const copyGuide = (proj) => {
    const text = `${proj.title}\nDifficulty: ${proj.difficulty}\nTools: ${(proj.tools || []).join(", ")}\n\nWhat it does:\n${proj.what}\n\nSteps:\n${(proj.steps || []).map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(proj.id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-void text-emerald-50 font-sans relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }

        @keyframes floatBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(3%, -4%) scale(1.08); }
          66% { transform: translate(-2%, 3%) scale(0.95); }
        }
        .blob { animation: floatBlob 18s ease-in-out infinite; }
        .blob-2 { animation: floatBlob 22s ease-in-out infinite reverse; }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanline { animation: scanline 6s linear infinite; }

        @keyframes nodeGlow {
          0%, 100% { filter: drop-shadow(0 0 2px #34d399); opacity: 0.7; }
          50% { filter: drop-shadow(0 0 6px #6ee7b7); opacity: 1; }
        }
        .node-glow { animation: nodeGlow 3s ease-in-out infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }

        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
        }
        .pulse-border { animation: pulseBorder 2.4s ease-in-out infinite; }

        .grid-fade {
          background-image:
            linear-gradient(rgba(52,211,153,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.06) 1px, transparent 1px);
          background-size: 42px 42px;
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }

        .progress-fill { transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1); }

        .card-hover { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-3px); border-color: rgba(52,211,153,0.55); box-shadow: 0 12px 30px -12px rgba(16,185,129,0.35); }

        .tab-underline { transition: left 0.3s cubic-bezier(0.22,1,0.36,1), width 0.3s cubic-bezier(0.22,1,0.36,1); }

        ::selection { background: rgba(52,211,153,0.35); }

        /* Plain-CSS fallbacks: arbitrary-value Tailwind classes (bg-[#...], blur-[...],
           w-[...rem]) need a JIT compiler that isn't always available in preview/artifact
           environments, so every custom color, blur, and size lives here instead. */
        html, body, #root { background-color: #050b08; }
        .bg-void { background-color: #050b08; }
        .bg-void-70 { background-color: rgba(5,11,8,0.7); }
        .text-void { color: #050b08; }
        .text-void-deep { color: #052014; }
        .bg-panel { background-color: #071b12; }
        .bg-panel-95 { background-color: rgba(7,27,18,0.95); }
        .hero-gradient { background-image: linear-gradient(to bottom right, rgba(6,78,59,0.6), #061c12, #050b08); }
        .footer-gradient { background-image: linear-gradient(to bottom right, rgba(6,78,59,0.5), #050b08); }
        .blur-110 { filter: blur(110px); }
        .blur-100 { filter: blur(100px); }
        .blob-size-1 { width: 36rem; height: 36rem; }
        .blob-size-2 { width: 30rem; height: 30rem; }
        .blob-size-3 { width: 24rem; height: 24rem; }
        .opacity-35c { opacity: 0.35; }
        .modal-h-88 { max-height: 88vh; }
        .modal-h-90 { max-height: 90vh; }

        @media (prefers-reduced-motion: reduce) {
          .blob, .blob-2, .scanline, .node-glow, .pulse-border, .fade-up { animation: none !important; }
        }
      `}</style>

      {/* ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-void" />
        <div className="grid-fade absolute inset-0" />
        <div className="blob absolute -top-40 -left-32 blob-size-1 rounded-full bg-emerald-600/20 blur-110" />
        <div className="blob-2 absolute top-1/3 -right-40 blob-size-2 rounded-full bg-teal-500/15 blur-110" />
        <div className="absolute bottom-0 left-1/4 blob-size-3 rounded-full bg-lime-500/10 blur-100" />
      </div>

      {/* top nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-void-70 border-b border-emerald-400/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-md bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center pulse-border">
              <Terminal size={16} className="text-void" strokeWidth={2.5} />
            </div>
            <div className="font-display font-bold tracking-tight text-sm sm:text-base">
              KRATOS <span className="text-emerald-400">AI</span>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-emerald-400/10 rounded-full p-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    active ? "text-void" : "text-emerald-100/60 hover:text-emerald-100"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                  )}
                  <Icon size={14} className="relative z-10" />
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-xs text-emerald-100/50 font-display">
              <Flame size={13} className="text-lime-400" />
              {pct}% roadmap
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs font-display text-emerald-100/35">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  saveState_ === "saving" ? "bg-lime-400 animate-pulse" : "bg-emerald-500"
                }`}
              />
              {saveState_ === "saving" ? "Saving…" : hydrated ? "Saved" : ""}
            </div>
            <button
              className="sm:hidden p-2 text-emerald-100/70"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="sm:hidden border-t border-emerald-400/10 px-5 py-3 flex flex-col gap-1 fade-up">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setNavOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    tab === t.id ? "bg-emerald-400/15 text-emerald-300" : "text-emerald-100/60"
                  }`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* hero */}
      <section className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="relative rounded-3xl overflow-hidden border border-emerald-400/15 hero-gradient">
          <div className="absolute inset-0">
            <AutomationGraph />
            <div className="scanline absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-emerald-400/[0.04] to-transparent" />
          </div>
          <div className="relative px-6 sm:px-12 py-12 sm:py-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/25 bg-emerald-400/5 text-xs font-display text-emerald-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LEARNING TRACK · WORKFLOW AUTOMATION &amp; AI AGENTS
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-tight tracking-tight max-w-2xl">
              Every workflow, <span className="bg-gradient-to-r from-emerald-300 via-lime-300 to-teal-300 bg-clip-text text-transparent">a system.</span>
            </h1>
            <p className="mt-4 max-w-xl text-emerald-100/60 text-sm sm:text-base leading-relaxed">
              Track what you've learned, ship automations in order of difficulty, and turn
              the build log into a business. One place for the whole path — Zapier and
              Make to Python, agent frameworks, and paid work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="w-full max-w-sm">
                <div className="flex justify-between text-xs font-display text-emerald-100/50 mb-1.5">
                  <span>ROADMAP PROGRESS</span>
                  <span className="text-emerald-300">{doneItems}/{totalItems}</span>
                </div>
                <div className="h-2 rounded-full bg-emerald-950 border border-emerald-400/10 overflow-hidden">
                  <div
                    className="progress-fill h-full rounded-full bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => setTab("projects")}
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-400 text-void-deep text-sm font-semibold hover:bg-emerald-300 transition-colors"
              >
                Browse builds
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 fade-up">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-400 text-void-deep text-sm font-medium shadow-lg shadow-emerald-900/50">
            <Check size={14} /> {toast}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        {tab === "roadmap" && (
          <RoadmapView
            expandedPhase={expandedPhase}
            setExpandedPhase={setExpandedPhase}
            checked={checked}
            toggleItem={toggleItem}
          />
        )}

        {tab === "projects" && (
          <ProjectsView
            projects={filteredProjects}
            difficultyFilter={difficultyFilter}
            setDifficultyFilter={setDifficultyFilter}
            onOpenGuide={setActiveGuide}
            onAdd={() => setShowAdd(true)}
            onRemoveMine={removeMyProject}
            onExport={exportData}
            onImportClick={() => fileInputRef.current?.click()}
            myCount={myProjects.length}
          />
        )}

        {tab === "monetize" && <MonetizeView />}
      </main>

      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={importData}
        className="hidden"
      />

      {activeGuide && (
        <GuideModal
          project={activeGuide}
          onClose={() => setActiveGuide(null)}
          onCopy={copyGuide}
          copied={copiedId === activeGuide.id}
        />
      )}

      {showAdd && <AddProjectModal onClose={() => setShowAdd(false)} onSave={addProject} />}

      <footer className="border-t border-emerald-400/10 py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-100/35 font-display">
          <span>KRATOS AI — Every Frame, A Conquest.</span>
          <span>Built as a single-file tracker. Your data stays in this browser.</span>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------- roadmap tab ------------------------------ */

function RoadmapView({ expandedPhase, setExpandedPhase, checked, toggleItem }) {
  return (
    <div className="fade-up">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={16} className="text-emerald-400" />
        <h2 className="font-display font-bold text-lg">Learning roadmap</h2>
      </div>
      <div className="space-y-3">
        {ROADMAP.map((phase, pi) => {
          const open = expandedPhase === phase.id;
          const doneInPhase = phase.items.filter((_, idx) => checked[`${phase.id}-${idx}`]).length;
          const phasePct = Math.round((doneInPhase / phase.items.length) * 100);
          const complete = phasePct === 100;
          return (
            <div
              key={phase.id}
              className={`rounded-2xl border overflow-hidden transition-colors ${
                complete ? "border-emerald-400/40 bg-emerald-400/[0.04]" : "border-emerald-400/10 bg-white/[0.02]"
              }`}
            >
              <button
                onClick={() => setExpandedPhase(open ? null : phase.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-display text-xs font-bold ${
                      complete ? "bg-emerald-400 text-void-deep" : "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                    }`}
                  >
                    {complete ? <Check size={16} /> : pi + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-display text-emerald-400/70 tracking-wider">{phase.phase}</span>
                      <h3 className="font-semibold text-sm sm:text-base truncate">{phase.title}</h3>
                    </div>
                    <p className="text-xs text-emerald-100/45 mt-0.5 truncate">{phase.blurb}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:block text-xs font-display text-emerald-300/70 w-10 text-right">{phasePct}%</span>
                  <ChevronDown
                    size={16}
                    className={`text-emerald-300/60 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              {open && (
                <div className="px-5 pb-5 pt-1 fade-up">
                  <div className="h-1.5 rounded-full bg-emerald-950 border border-emerald-400/10 overflow-hidden mb-4">
                    <div
                      className="progress-fill h-full bg-gradient-to-r from-emerald-500 to-lime-400"
                      style={{ width: `${phasePct}%` }}
                    />
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item, idx) => {
                      const key = `${phase.id}-${idx}`;
                      const isChecked = !!checked[key];
                      return (
                        <li key={key}>
                          <button
                            onClick={() => toggleItem(phase.id, idx)}
                            className="w-full flex items-start gap-3 text-left group py-1.5"
                          >
                            {isChecked ? (
                              <CheckCircle2 size={17} className="text-emerald-400 mt-0.5 shrink-0" />
                            ) : (
                              <Circle size={17} className="text-emerald-100/25 group-hover:text-emerald-300/60 mt-0.5 shrink-0 transition-colors" />
                            )}
                            <span className={`text-sm leading-snug ${isChecked ? "text-emerald-100/40 line-through" : "text-emerald-50/85"}`}>
                              {item}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------- projects tab ------------------------------ */

function ProjectsView({
  projects, difficultyFilter, setDifficultyFilter, onOpenGuide, onAdd, onRemoveMine, onExport, onImportClick, myCount,
}) {
  return (
    <div className="fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-emerald-400" />
          <h2 className="font-display font-bold text-lg">Build order</h2>
          <span className="text-xs text-emerald-100/40 font-display">easy → advanced</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white/[0.03] border border-emerald-400/10 rounded-full p-1">
            {["All", "Easy", "Medium", "Advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  difficultyFilter === d ? "bg-emerald-400 text-void-deep" : "text-emerald-100/55 hover:text-emerald-100"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            onClick={onImportClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-400/20 text-emerald-100/70 hover:border-emerald-400/50 hover:text-emerald-100 transition-colors"
          >
            <Upload size={12} /> Import
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-400/20 text-emerald-100/70 hover:border-emerald-400/50 hover:text-emerald-100 transition-colors"
          >
            <Download size={12} /> Export
          </button>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 text-void-deep hover:brightness-110 transition"
          >
            <Plus size={13} /> Add your build
          </button>
        </div>
      </div>

      {myCount > 0 && (
        <p className="text-xs text-emerald-100/40 mb-4 font-display">
          {myCount} project{myCount > 1 ? "s" : ""} added by you — shown with a "MY BUILD" tag below.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => {
          const d = DIFF[p.difficulty] || DIFF.Easy;
          return (
            <div
              key={p.id}
              className={`card-hover relative rounded-2xl border border-emerald-400/10 bg-white/[0.02] p-5 flex flex-col`}
            >
              {p.mine && (
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-lime-400 text-void-deep text-xs font-display font-bold tracking-wider">
                  MY BUILD
                </div>
              )}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-display font-semibold ring-1 ${d.ring} ${d.text} ${d.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
                  {d.label}
                </span>
                {p.mine && (
                  <button
                    onClick={() => onRemoveMine(p.id)}
                    className="text-emerald-100/30 hover:text-red-400 transition-colors"
                    aria-label="Remove project"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <h3 className="font-semibold text-sm leading-snug mb-1.5">{p.title}</h3>
              <p className="text-xs text-emerald-100/55 leading-relaxed mb-4 flex-1 line-clamp-4">{p.what}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(p.tools || []).slice(0, 3).map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-emerald-400/5 border border-emerald-400/10 text-emerald-100/50 font-display">
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onOpenGuide(p)}
                className="mt-auto inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold border border-emerald-400/20 text-emerald-200 hover:bg-emerald-400/10 hover:border-emerald-400/40 transition-colors"
              >
                Open guide <ChevronRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- guide modal ----------------------------- */

function GuideModal({ project, onClose, onCopy, copied }) {
  const d = DIFF[project.difficulty] || DIFF.Easy;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg modal-h-88 overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-emerald-400/20 bg-panel fade-up">
        <div className="sticky top-0 bg-panel-95 backdrop-blur border-b border-emerald-400/10 px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-display font-semibold ring-1 ${d.ring} ${d.text} ${d.bg} mb-2`}>
              <span className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
              {d.label}{project.time ? ` · ${project.time}` : ""}
            </span>
            <h3 className="font-display font-bold text-lg leading-snug pr-4">{project.title}</h3>
          </div>
          <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg text-emerald-100/50 hover:text-emerald-100 hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div>
            <p className="text-sm text-emerald-100/75 leading-relaxed">{project.what}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-display text-emerald-400 mb-2">
              <Wrench size={12} /> TOOLS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(project.tools || []).map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-400/5 border border-emerald-400/15 text-emerald-100/70">
                  {t}
                </span>
              ))}
              {(!project.tools || project.tools.length === 0) && (
                <span className="text-xs text-emerald-100/40 italic">No tools listed for this build yet.</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-display text-emerald-400 mb-3">
              <Rocket size={12} /> HOW TO BUILD IT
            </div>
            {project.steps && project.steps.length > 0 ? (
              <ol className="space-y-3">
                {project.steps.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-md bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-display font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-emerald-50/85 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-emerald-100/40 italic">
                No step-by-step guide added yet — edit this project to add your own build notes.
              </p>
            )}
          </div>

          <button
            onClick={() => onCopy(project)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold border border-emerald-400/25 text-emerald-200 hover:bg-emerald-400/10 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy guide as text"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- add project modal -------------------------- */

function AddProjectModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [what, setWhat] = useState("");
  const [toolsRaw, setToolsRaw] = useState("");
  const [stepsRaw, setStepsRaw] = useState("");
  const [time, setTime] = useState("");

  const canSave = title.trim().length > 0 && what.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      title: title.trim(),
      difficulty,
      what: what.trim(),
      time: time.trim(),
      tools: toolsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      steps: stepsRaw.split("\n").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg modal-h-90 overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-emerald-400/20 bg-panel fade-up">
        <div className="sticky top-0 bg-panel-95 backdrop-blur border-b border-emerald-400/10 px-6 py-4 flex items-center justify-between">
          <h3 className="font-display font-bold text-base flex items-center gap-2">
            <Sparkles size={15} className="text-emerald-400" /> Upload a project
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-emerald-100/50 hover:text-emerald-100 hover:bg-white/5">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field label="Project name">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Client Onboarding Auto-Responder"
              className="input"
            />
          </Field>

          <Field label="What it does (function)">
            <textarea
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              rows={3}
              placeholder="One or two sentences on what this automation does and why it's useful."
              className="input resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Difficulty">
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input">
                <option>Easy</option>
                <option>Medium</option>
                <option>Advanced</option>
              </select>
            </Field>
            <Field label="Time spent (optional)">
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 3 hrs" className="input" />
            </Field>
          </div>

          <Field label="Tools used (comma-separated)">
            <input
              value={toolsRaw}
              onChange={(e) => setToolsRaw(e.target.value)}
              placeholder="Make.com, OpenAI API, Gmail"
              className="input"
            />
          </Field>

          <Field label="Build steps (one per line, optional)">
            <textarea
              value={stepsRaw}
              onChange={(e) => setStepsRaw(e.target.value)}
              rows={4}
              placeholder={"Trigger: new form response\nAction: send to OpenAI for classification\nAction: post result to Slack"}
              className="input resize-none"
            />
          </Field>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 text-void-deep disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition"
          >
            <Plus size={15} /> Save to my builds
          </button>
          <p className="text-xs text-emerald-100/35 text-center">
            Saved in this browser. Use Export on the Projects tab to back it up.
          </p>
        </div>

        <style>{`
          .input {
            width: 100%;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(52,211,153,0.15);
            border-radius: 0.6rem;
            padding: 0.55rem 0.75rem;
            font-size: 0.85rem;
            color: #ecfdf5;
            outline: none;
            transition: border-color 0.2s ease;
          }
          .input::placeholder { color: rgba(236,253,245,0.28); }
          .input:focus { border-color: rgba(52,211,153,0.6); }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-display text-emerald-100/50 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

/* -------------------------------- monetize tab ------------------------------ */

function MonetizeView() {
  return (
    <div className="fade-up">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={16} className="text-emerald-400" />
        <h2 className="font-display font-bold text-lg">Monetization plan</h2>
      </div>
      <p className="text-sm text-emerald-100/50 max-w-2xl mb-8 leading-relaxed">
        Four tiers, roughly in the order you'll unlock them. Start selling as soon as you
        have one working Easy-tier project — you don't need to finish the whole roadmap first.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {MONETIZATION_TIERS.map((tier, i) => {
          const Icon = tier.icon;
          return (
            <div key={tier.name} className="card-hover rounded-2xl border border-emerald-400/10 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                  <Icon size={16} className="text-emerald-300" />
                </div>
                <span className="text-xs font-display text-lime-300 font-semibold">{tier.range}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{tier.name}</h3>
              <p className="text-xs text-emerald-100/55 leading-relaxed mb-3">{tier.desc}</p>
              <ul className="space-y-1.5">
                {tier.moves.map((m, mi) => (
                  <li key={mi} className="flex gap-2 text-xs text-emerald-100/60">
                    <span className="text-emerald-400 mt-0.5">›</span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-emerald-400/15 footer-gradient p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={15} className="text-lime-300" />
          <h3 className="font-display font-bold text-sm">Sequencing it</h3>
        </div>
        <ol className="space-y-3">
          {[
            "Finish 2–3 Easy projects and package one as a $20–$40 template — this is proof you can ship, not just learn.",
            "List one fixed-scope Fiverr/Upwork gig based on an Easy or Medium project. Use your own build as the portfolio piece.",
            "After your first paid delivery, pitch the client a small monthly retainer for upkeep.",
            "Once you've built 1–2 Advanced projects (agents), use them as the anchor demo for higher-ticket custom builds.",
            "Reinvest early income into paid tools (hosting for n8n, better API limits) before scaling outreach.",
          ].map((s, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-400 text-void-deep text-xs font-display font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-emerald-50/85 leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
