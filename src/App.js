import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://petexirslmjvjefzfcuv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldGV4aXJzbG1qdmplZnpmY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTAwMjMsImV4cCI6MjA4ODY4NjAyM30.qb3-i72WQQW7rgKsVICv5Oe1sPzOPNp5HmC7U4hxKBM";

async function sbFetch(path, options = {}) {
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
  if (options.method === "POST") {
    headers["Prefer"] = "return=representation";
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text ? JSON.parse(text) : [];
}

const GOOGLE_FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Petit+Formal+Script&display=swap');
`;

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F7F0E3;
    --parchment: #EDE0C4;
    --brown-deep: #2A1A0E;
    --brown-mid: #5C3A1E;
    --amber: #B8751A;
    --amber-light: #D4A55A;
    --sage: #7A9068;
    --sage-light: #A8BB98;
    --blush: #C8897A;
    --text: #2A1A0E;
    --text-soft: #6B4C2A;
    --border: rgba(92,58,30,0.18);
  }

  body { background: var(--cream); font-family: 'Lora', Georgia, serif; color: var(--text); }

  .blog-wrap {
    min-height: 100vh;
    background: var(--cream);
    background-image:
      radial-gradient(ellipse at 10% 0%, rgba(184,117,26,0.07) 0%, transparent 60%),
      radial-gradient(ellipse at 90% 80%, rgba(122,144,104,0.08) 0%, transparent 60%);
  }

  /* HEADER */
  .site-header {
    background: var(--brown-deep);
    padding: 0;
    position: relative;
    overflow: hidden;
  }
  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 40px 36px;
    position: relative;
    z-index: 2;
    text-align: center;
  }
  .header-flourish {
    color: var(--amber-light);
    font-size: 18px;
    letter-spacing: 6px;
    margin-bottom: 12px;
    opacity: 0.7;
  }
  .site-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 6vw, 68px);
    font-weight: 300;
    color: var(--parchment);
    letter-spacing: 2px;
    line-height: 1.1;
  }
  .site-title span {
    color: var(--amber-light);
    font-style: italic;
  }
  .site-tagline {
    font-family: 'Lora', serif;
    font-style: italic;
    color: var(--sage-light);
    font-size: 15px;
    margin-top: 12px;
    letter-spacing: 1px;
    opacity: 0.85;
  }
  .header-nav {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid rgba(212,165,90,0.2);
  }
  .nav-btn {
    background: none;
    border: none;
    color: var(--amber-light);
    font-family: 'Lora', serif;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s, color 0.2s;
    padding: 4px 0;
  }
  .nav-btn:hover, .nav-btn.active { opacity: 1; color: #F7F0E3; }
  .header-bg-ornament {
    position: absolute;
    top: -30px; right: -40px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(184,117,26,0.12), transparent 70%);
    pointer-events: none;
  }

  /* MAIN LAYOUT */
  .main-layout {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px;
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 48px;
    align-items: start;
  }

  /* SIDEBAR */
  .sidebar {
    position: sticky;
    top: 24px;
  }
  .sidebar-section {
    background: white;
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(42,26,14,0.05);
  }
  .sidebar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }
  .archive-year {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--brown-mid);
    margin: 12px 0 6px;
    letter-spacing: 1px;
  }
  .archive-month {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px dotted rgba(92,58,30,0.1);
    cursor: pointer;
    transition: color 0.2s;
  }
  .archive-month:hover { color: var(--amber); }
  .archive-month span { font-size: 13px; color: var(--text-soft); }
  .archive-month .count {
    background: var(--parchment);
    color: var(--amber);
    font-size: 11px;
    padding: 2px 7px;
    border-radius: 20px;
    font-weight: 500;
  }
  .about-text {
    font-size: 13px;
    line-height: 1.8;
    color: var(--text-soft);
    font-style: italic;
  }
  .write-btn {
    width: 100%;
    background: var(--brown-deep);
    color: var(--parchment);
    border: none;
    padding: 13px;
    font-family: 'Lora', serif;
    font-size: 13px;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.2s;
    margin-top: 4px;
  }
  .write-btn:hover { background: var(--brown-mid); }

  /* POSTS LIST */
  .posts-area { min-width: 0; }
  .section-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-heading::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .post-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 36px 40px;
    margin-bottom: 28px;
    box-shadow: 0 2px 12px rgba(42,26,14,0.04);
    cursor: pointer;
    transition: box-shadow 0.25s, transform 0.25s;
    position: relative;
    overflow: hidden;
  }
  .post-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--amber-light);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 0.3s;
  }
  .post-card:hover { box-shadow: 0 6px 28px rgba(42,26,14,0.1); transform: translateY(-2px); }
  .post-card:hover::before { transform: scaleY(1); }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }
  .post-date {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--amber);
    font-weight: 500;
  }
  .post-tag {
    font-size: 10px;
    background: var(--parchment);
    color: var(--brown-mid);
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 500;
  }
  .post-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--brown-deep);
    line-height: 1.3;
    margin-bottom: 14px;
  }
  .post-excerpt {
    font-size: 14.5px;
    line-height: 1.85;
    color: var(--text-soft);
    margin-bottom: 20px;
  }
  .read-more {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--amber);
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: gap 0.2s;
  }
  .post-card:hover .read-more { gap: 10px; }

  /* FULL POST VIEW */
  .post-full {
    background: white;
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 48px 52px;
    box-shadow: 0 2px 12px rgba(42,26,14,0.04);
  }
  .back-btn {
    background: none;
    border: none;
    color: var(--amber);
    font-family: 'Lora', serif;
    font-size: 13px;
    cursor: pointer;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: 1px;
    padding: 0;
    transition: gap 0.2s;
  }
  .back-btn:hover { gap: 10px; }
  .full-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 300;
    color: var(--brown-deep);
    line-height: 1.25;
    margin-bottom: 16px;
  }
  .full-body {
    font-size: 16px;
    line-height: 2;
    color: var(--text);
    margin-top: 28px;
  }
  .full-body p { margin-bottom: 20px; }
  .divider {
    text-align: center;
    color: var(--amber-light);
    letter-spacing: 8px;
    margin: 40px 0;
    font-size: 18px;
    opacity: 0.6;
  }

  /* COMMENTS */
  .comments-section {
    margin-top: 48px;
    border-top: 1px solid var(--border);
    padding-top: 36px;
  }
  .comments-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--brown-deep);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .comment-count {
    background: var(--parchment);
    color: var(--amber);
    font-family: 'Lora', serif;
    font-size: 13px;
    padding: 2px 10px;
    border-radius: 20px;
  }
  .comment-item {
    padding: 20px 0;
    border-bottom: 1px dotted var(--border);
  }
  .comment-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .comment-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: var(--parchment);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    color: var(--brown-mid);
    font-weight: 600;
    flex-shrink: 0;
  }
  .comment-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--brown-mid);
    letter-spacing: 0.5px;
  }
  .comment-time {
    font-size: 11px;
    color: var(--amber);
    letter-spacing: 1px;
    margin-left: auto;
  }
  .comment-text {
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-soft);
    padding-left: 44px;
    font-style: italic;
  }
  .comment-delete-btn {
    background: none;
    border: none;
    color: var(--amber);
    font-size: 14px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 2px;
    opacity: 0.5;
    transition: opacity 0.2s, color 0.2s;
    margin-left: 8px;
  }
  .comment-delete-btn:hover {
    opacity: 1;
    color: var(--blush);
  }

  /* COMMENT FORM */
  .comment-form {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 28px;
    margin-top: 28px;
  }
  .form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: var(--brown-mid);
    margin-bottom: 18px;
    font-style: italic;
  }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  .form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .form-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--amber);
    font-weight: 500;
  }
  .form-input, .form-textarea {
    border: 1px solid var(--border);
    background: white;
    padding: 10px 14px;
    font-family: 'Lora', serif;
    font-size: 14px;
    color: var(--text);
    border-radius: 2px;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus, .form-textarea:focus { border-color: var(--amber-light); }
  .form-textarea { resize: vertical; min-height: 100px; line-height: 1.7; }
  .submit-btn {
    background: var(--amber);
    color: white;
    border: none;
    padding: 12px 28px;
    font-family: 'Lora', serif;
    font-size: 13px;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 2px;
    margin-top: 12px;
    transition: background 0.2s;
  }
  .submit-btn:hover { background: var(--brown-mid); }

  /* WRITE POST MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(42,26,14,0.6);
    backdrop-filter: blur(2px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .modal {
    background: white;
    border-radius: 2px;
    padding: 40px;
    max-width: 640px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(42,26,14,0.25);
  }
  .modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    color: var(--brown-deep);
    margin-bottom: 24px;
  }
  .modal-close {
    float: right;
    background: none;
    border: none;
    font-size: 22px;
    color: var(--text-soft);
    cursor: pointer;
    margin-top: -4px;
  }
  .tag-options { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
  .tag-chip {
    padding: 5px 14px;
    border-radius: 20px;
    border: 1px solid var(--border);
    font-size: 12px;
    cursor: pointer;
    background: white;
    color: var(--text-soft);
    transition: all 0.2s;
  }
  .tag-chip.selected { background: var(--parchment); color: var(--amber); border-color: var(--amber-light); }

  /* EMPTY STATE */
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-soft);
  }
  .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.5; }
  .empty-text { font-style: italic; font-size: 15px; }

  /* FOOTER */
  .site-footer {
    background: var(--brown-deep);
    padding: 52px 24px 36px;
    text-align: center;
    margin-top: 48px;
    position: relative;
  }
  .footer-ornament {
    color: var(--amber-light);
    letter-spacing: 10px;
    font-size: 14px;
    opacity: 0.4;
    margin-bottom: 24px;
  }
  .footer-verse {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 13px;
    color: var(--parchment);
    opacity: 0.55;
    letter-spacing: 1px;
    line-height: 1.9;
    max-width: 480px;
    margin: 0 auto;
  }
  .footer-verse-ref {
    display: block;
    margin-top: 8px;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--amber-light);
    opacity: 0.5;
    font-style: normal;
  }
  .footer-copy {
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--amber-light);
    opacity: 0.25;
    margin-top: 28px;
    text-transform: uppercase;
  }
  .admin-dot {
    position: absolute;
    bottom: 14px;
    right: 20px;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(184,117,26,0.18);
    cursor: pointer;
    transition: background 0.3s;
  }
  .admin-dot:hover { background: var(--amber); }

  /* ADMIN PANEL */
  .admin-bar {
    background: #1a1008;
    border-bottom: 2px solid var(--amber);
    padding: 10px 32px;
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--amber-light);
  }
  .admin-badge {
    background: var(--amber);
    color: white;
    padding: 3px 10px;
    border-radius: 2px;
    font-size: 9px;
    letter-spacing: 2px;
    font-weight: 600;
  }
  .admin-logout {
    margin-left: auto;
    background: none;
    border: 1px solid rgba(184,117,26,0.3);
    color: var(--amber-light);
    font-size: 10px;
    letter-spacing: 2px;
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 2px;
    font-family: 'Lora', serif;
    transition: border-color 0.2s;
  }
  .admin-logout:hover { border-color: var(--amber); }

  /* PASSWORD MODAL */
  .pw-modal {
    background: white;
    border-radius: 2px;
    padding: 40px;
    max-width: 360px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(42,26,14,0.3);
    text-align: center;
  }
  .pw-icon { font-size: 28px; margin-bottom: 16px; }
  .pw-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    color: var(--brown-deep);
    margin-bottom: 6px;
  }
  .pw-sub { font-size: 12px; color: var(--text-soft); font-style: italic; margin-bottom: 24px; }
  .pw-error { font-size: 12px; color: var(--blush); margin-top: 8px; font-style: italic; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .main-layout { grid-template-columns: 1fr; }
    .sidebar { position: static; }
    .post-full { padding: 28px 24px; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

const SAMPLE_POSTS = [
  {
    id: 1,
    title: "When the Rod Felt Dry",
    date: "March 2, 2025",
    monthKey: "2025-03",
    tag: "Faith",
    excerpt: "There are seasons when prayer feels like speaking into a hollow room. No echo. No answer. Just your own voice bouncing back. I want to talk about those seasons honestly — because I lived in one for three years and nobody told me it was okay.",
    body: `There are seasons when prayer feels like speaking into a hollow room. No echo. No answer. Just your own voice bouncing back. I want to talk about those seasons honestly — because I lived in one for three years and nobody told me it was okay.

I grew up in a church where doubt was treated like a disease. You caught it, and you kept it quiet, and you hoped nobody noticed the dark circles under your spiritual eyes. So when the silence came for me — that thick, heavy silence where God seemed absent — I did what I was trained to do. I smiled through it.

But something in me knew that a rod doesn't bloom by staying in the ground forever. Aaron's staff was dead wood. Completely dry. Left overnight with no water, no sunlight, no human effort. And yet by morning — buds, blossoms, almonds.

That is the God I am learning to trust. Not the one who blooms you when you perform well, but the one who blooms you in the dark.

If you are in that hollow-room season right now, I want you to know: your dryness is not your failure. The silence is not His absence. Sometimes the most miraculous thing is happening precisely when it feels like nothing is happening at all.`,
  },
  {
    id: 2,
    title: "Letters to the Child I Was",
    date: "February 14, 2025",
    monthKey: "2025-02",
    tag: "Childhood",
    excerpt: "I found a photograph of myself at seven years old. Bowl cut, gap-toothed grin, holding a trophy for a spelling bee I barely remember. I stared at that little face for a long time and thought: what would I tell him? What would I need to say?",
    body: `I found a photograph of myself at seven years old. Bowl cut, gap-toothed grin, holding a trophy for a spelling bee I barely remember. I stared at that little face for a long time and thought: what would I tell him? What would I need to say?

The honest answer is: everything.

I would tell him that the loudness in the house isn't his fault. That the way he learned to become invisible — to shrink himself into the walls when voices rose — was a survival skill, and survival skills are gifts even when they leave scars.

I would tell him that God sees him. Not the performance, not the spelling bee trophy, not the good-boy mask he learned to wear so well. The real him. The one who cried under the covers and didn't know why.

Healing from childhood isn't a straight line. I've come to believe it's more like that rod — a slow, quiet, often invisible process where something alive is working through something that looked dead. You might not see the buds for a long time. But they are coming.

I'm writing these letters because maybe someone out there is staring at an old photograph of themselves and feeling that same ache. You are not alone. And the child you were deserved more than they got. That grief is real. And so is the hope.`,
  },
  {
    id: 3,
    title: "On Struggling With Church",
    date: "January 8, 2025",
    monthKey: "2025-01",
    tag: "Struggle",
    excerpt: "I still go. Every Sunday, I still go. But I want to be honest about how complicated that has become — and why I think the complication might actually be a form of faithfulness.",
    body: `I still go. Every Sunday, I still go. But I want to be honest about how complicated that has become — and why I think the complication might actually be a form of faithfulness.

There was a time when church was simple. You went, you sang, you felt the warmth, you left. The belonging was uncomplicated. Somewhere in my late twenties, something shifted. I started asking questions that the room didn't seem to have space for. I started noticing gaps between what was preached and what was practiced. I started feeling — slowly, then all at once — like a stranger in a place I used to call home.

I didn't leave. But part of me grieved the version of faith that didn't require so much navigation.

Here's what I've come to: the struggle with the Church is not the same as the struggle with God. Sometimes I think we confuse the two, and the confusion costs us everything. People walk away from both when perhaps they only needed to walk away from one — or walk toward a different expression of the other.

My faith has gotten smaller in some ways. Less triumphant. More quiet. But it has also gotten more honest. And I have come to believe that God prefers my honest struggle to my performed certainty.

That feels like something worth writing down.`,
  },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TAGS = ["Faith", "Childhood", "Struggle", "God", "Prayer", "Healing", "Community", "Reflection"];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Blog() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [view, setView] = useState("home");
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showWrite, setShowWrite] = useState(false);
  const [filterMonth, setFilterMonth] = useState(null);
  const [newComment, setNewComment] = useState({ name: "", message: "" });
  const [newPost, setNewPost] = useState({ title: "", body: "", tag: "Faith" });
  const [activeNav, setActiveNav] = useState("stories");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const ADMIN_PASSWORD = "rodthatbloomed2025";
  const loaded = useRef(false);

  // Load saved posts from storage
  useEffect(() => {
    (async () => {
      try {
        const pr = await window.storage.get("rtb-posts");
        if (pr?.value) {
          const saved = JSON.parse(pr.value);
          if (saved.length) setPosts([...SAMPLE_POSTS, ...saved]);
        }
      } catch {}
      loaded.current = true;
    })();
  }, []);

  // Fetch comments from Supabase when a post is opened
  async function fetchComments(postId) {
    setCommentsLoading(true);
    setComments([]);
    try {
      const data = await sbFetch(`/comments?post_id=eq.${postId}&order=created_at.asc`);
      setComments(data);
    } catch (e) {
      console.error("Could not load comments:", e);
    }
    setCommentsLoading(false);
  }

  // Compute archive
  const archive = {};
  posts.forEach(p => {
    const [y, m] = (p.monthKey || "2025-01").split("-");
    if (!archive[y]) archive[y] = {};
    if (!archive[y][m]) archive[y][m] = 0;
    archive[y][m]++;
  });

  const displayedPosts = filterMonth
    ? posts.filter(p => p.monthKey === filterMonth)
    : posts;

  function openPost(post) {
    setActivePost(post);
    setView("post");
    setSubmitSuccess(false);
    fetchComments(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitComment(postId) {
    if (!newComment.name.trim() || !newComment.message.trim()) return;
    setCommentError("");
    try {
      const data = await sbFetch("/comments", {
        method: "POST",
        body: JSON.stringify({
          post_id: postId,
          name: newComment.name.trim(),
          message: newComment.message.trim(),
        }),
      });
      setComments(prev => [...prev, ...(Array.isArray(data) ? data : [data])]);
      setNewComment({ name: "", message: "" });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (e) {
      setCommentError("Couldn't post your reflection — " + (e.message || "please try again."));
    }
  }

  async function deleteComment(commentId) {
    try {
      await sbFetch(`/comments?id=eq.${commentId}`, { method: "DELETE" });
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (e) {
      setCommentError("Couldn't delete reflection — " + (e.message || "please try again."));
    }
  }

  async function publishPost() {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    const p = {
      id: Date.now(),
      title: newPost.title,
      date: formatDate(now.toISOString()),
      monthKey,
      tag: newPost.tag,
      excerpt: newPost.body.slice(0, 180) + (newPost.body.length > 180 ? "…" : ""),
      body: newPost.body,
    };
    const existing = posts.filter(x => !SAMPLE_POSTS.find(s => s.id === x.id));
    const updatedSaved = [...existing, p];
    setPosts([...SAMPLE_POSTS, ...updatedSaved]);
    try { await window.storage.set("rtb-posts", JSON.stringify(updatedSaved)); } catch {}
    setNewPost({ title: "", body: "", tag: "Faith" });
    setShowWrite(false);
  }

  function tryAdminLogin() {
    if (pwInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPwModal(false);
      setPwInput("");
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  const postComments = comments;

  return (
    <>
      <style>{GOOGLE_FONTS + styles}</style>
      <div className="blog-wrap">

        {/* HEADER */}
        <header className="site-header">
          <div className="header-bg-ornament" />
          <div className="header-inner">
            <div className="header-flourish">✦ ✦ ✦</div>
            <h1 className="site-title">rod that <span>bloomed</span></h1>
            <p className="site-tagline">a journal of faith, childhood, struggle, and the God who meets us in the dark</p>
            <nav className="header-nav">
              {["stories","about"].map(n => (
                <button key={n} className={`nav-btn${activeNav===n?" active":""}`}
                  onClick={() => { setActiveNav(n); setView("home"); setFilterMonth(null); setActivePost(null); }}>
                  {n}
                </button>
              ))}
              {isAdmin && <button className="nav-btn" onClick={() => setShowWrite(true)}>+ New Entry</button>}
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <div className="main-layout">

          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">About This Space</div>
              <p className="about-text">
                A place to write honestly about faith, the wounds of childhood,
                the wrestling with God, and the slow bloom that comes
                from being held even when you can't feel it.
              </p>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Archive</div>
              {Object.keys(archive).sort((a,b)=>b-a).map(year => (
                <div key={year}>
                  <div className="archive-year">{year}</div>
                  {Object.keys(archive[year]).sort((a,b)=>b-a).map(m => {
                    const label = MONTHS[parseInt(m,10)-1];
                    const key = `${year}-${m}`;
                    return (
                      <div key={m} className="archive-month"
                        onClick={() => { setFilterMonth(filterMonth===key?null:key); setView("home"); setActivePost(null); }}>
                        <span style={filterMonth===key?{color:"var(--amber)"}:{}}>{label}</span>
                        <span className="count">{archive[year][m]}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
              {filterMonth && (
                <button onClick={() => setFilterMonth(null)}
                  style={{background:"none",border:"none",color:"var(--blush)",fontSize:"12px",cursor:"pointer",marginTop:"12px",letterSpacing:"1px"}}>
                  ✕ Clear filter
                </button>
              )}
            </div>

            {isAdmin && (
              <button className="write-btn" onClick={() => setShowWrite(true)}>
                ✦ Write New Entry
              </button>
            )}
          </aside>

          {/* CONTENT */}
          <main className="posts-area">
            {view === "home" && (
              <>
                <div className="section-heading">
                  {filterMonth ? `${MONTHS[parseInt(filterMonth.split("-")[1],10)-1]} ${filterMonth.split("-")[0]}` : "Recent Entries"}
                </div>
                {displayedPosts.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">🌿</div>
                    <p className="empty-text">No entries for this period yet.</p>
                  </div>
                )}
                {[...displayedPosts].reverse().map(post => (
                  <article key={post.id} className="post-card" onClick={() => openPost(post)}>
                    <div className="post-meta">
                      <span className="post-date">{post.date}</span>
                      <span className="post-tag">{post.tag}</span>
                    </div>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <span className="read-more">Continue Reading →</span>
                  </article>
                ))}
              </>
            )}

            {view === "post" && activePost && (
              <article className="post-full">
                <button className="back-btn" onClick={() => setView("home")}>← Back to entries</button>
                <div className="post-meta">
                  <span className="post-date">{activePost.date}</span>
                  <span className="post-tag">{activePost.tag}</span>
                </div>
                <h1 className="full-title">{activePost.title}</h1>
                <div className="divider">✦ ✦ ✦</div>
                <div className="full-body">
                  {activePost.body.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                <div className="divider" style={{marginBottom:0}}>✦</div>

                  {/* COMMENTS */}
                <div className="comments-section">
                  <h3 className="comments-title">
                    Conversations
                    <span className="comment-count">{postComments.length}</span>
                  </h3>

                  {commentsLoading && (
                    <p style={{fontStyle:"italic",color:"var(--text-soft)",fontSize:"14px",marginBottom:"20px",opacity:0.7}}>
                      Loading reflections...
                    </p>
                  )}

                  {!commentsLoading && postComments.length === 0 && (
                    <p style={{fontStyle:"italic",color:"var(--text-soft)",fontSize:"14px",marginBottom:"20px"}}>
                      Be the first to share a reflection on this entry.
                    </p>
                  )}

                  {postComments.map(c => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-avatar">{c.name[0].toUpperCase()}</div>
                        <span className="comment-name">{c.name}</span>
                        <span className="comment-time">
                          {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {isAdmin && (
                          <button className="comment-delete-btn" onClick={() => deleteComment(c.id)} title="Delete reflection">
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="comment-text">{c.message}</p>
                    </div>
                  ))}

                  <div className="comment-form">
                    <p className="form-title">Leave a reflection or share your own story...</p>
                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label">Your Name</label>
                        <input className="form-input" placeholder="e.g. Grace"
                          value={newComment.name}
                          onChange={e => setNewComment(p => ({...p, name: e.target.value}))} />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Also Known As (optional)</label>
                        <input className="form-input" placeholder="a sojourner, a friend..." />
                      </div>
                    </div>
                    <div className="form-field" style={{marginBottom:0}}>
                      <label className="form-label">Your Reflection</label>
                      <textarea className="form-textarea" placeholder="This resonated with me because..."
                        value={newComment.message}
                        onChange={e => setNewComment(p => ({...p, message: e.target.value}))} />
                    </div>
                    {commentError && (
                      <p style={{color:"var(--blush)",fontSize:"12px",fontStyle:"italic",marginTop:"8px"}}>{commentError}</p>
                    )}
                    {submitSuccess && (
                      <p style={{color:"var(--sage)",fontSize:"12px",fontStyle:"italic",marginTop:"8px"}}>
                        ✦ Your reflection has been shared. Thank you.
                      </p>
                    )}
                    <button className="submit-btn" onClick={() => submitComment(activePost.id)}>
                      Share Reflection →
                    </button>
                  </div>
                </div>
              </article>
            )}
          </main>
        </div>

        {/* WRITE MODAL — admin only */}
        {showWrite && isAdmin && (
          <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) setShowWrite(false); }}>
            <div className="modal">
              <button className="modal-close" onClick={() => setShowWrite(false)}>✕</button>
              <h2 className="modal-title">New Entry</h2>

              <div className="form-field" style={{marginBottom:"16px"}}>
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="Give this entry a name..."
                  value={newPost.title}
                  onChange={e => setNewPost(p => ({...p, title: e.target.value}))} />
              </div>

              <div className="form-field" style={{marginBottom:"16px"}}>
                <label className="form-label">Tag</label>
                <div className="tag-options">
                  {TAGS.map(t => (
                    <button key={t} className={`tag-chip${newPost.tag===t?" selected":""}`}
                      onClick={() => setNewPost(p => ({...p, tag: t}))}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field" style={{marginBottom:"20px"}}>
                <label className="form-label">Your Story</label>
                <textarea className="form-textarea" style={{minHeight:"220px"}}
                  placeholder="Write from your heart. Use double line breaks to separate paragraphs..."
                  value={newPost.body}
                  onChange={e => setNewPost(p => ({...p, body: e.target.value}))} />
              </div>

              <div style={{display:"flex",gap:"12px"}}>
                <button className="submit-btn" onClick={publishPost}>Publish Entry →</button>
                <button onClick={() => setShowWrite(false)}
                  style={{background:"none",border:"1px solid var(--border)",padding:"12px 20px",cursor:"pointer",fontFamily:"Lora,serif",fontSize:"13px",color:"var(--text-soft)",borderRadius:"2px"}}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>{/* end blog-wrap */}

      {/* ADMIN TOP BAR */}
      {isAdmin && (
        <div style={{position:"fixed",top:0,left:0,right:0,zIndex:200}} className="admin-bar">
          <span className="admin-badge">ADMIN</span>
          <span>rod that bloomed — back end</span>
          <button className="admin-logout" onClick={() => setIsAdmin(false)}>Sign Out</button>
        </div>
      )}
      {isAdmin && <div style={{height:36}} />}

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-ornament">✦ ✦ ✦</div>
        <p className="footer-verse">
          "And it came to pass, that on the morrow Moses went into the tabernacle of witness;
          and, behold, the rod of Aaron for the house of Levi had budded,
          and brought forth buds, and bloomed blossoms, and yielded almonds."
          <span className="footer-verse-ref">Numbers 17 : 8</span>
        </p>
        <p className="footer-copy">© rodthatbloomed.blog</p>
        {/* Hidden admin dot — only you know it's here */}
        <div className="admin-dot" title="" onClick={() => setShowPwModal(true)} />
      </footer>

      {/* PASSWORD MODAL */}
      {showPwModal && (
        <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget){ setShowPwModal(false); setPwError(false); setPwInput(""); }}}>
          <div className="pw-modal">
            <div className="pw-icon">🗝️</div>
            <h2 className="pw-title">Admin Access</h2>
            <p className="pw-sub">Enter your password to manage the blog</p>
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={pwInput}
              style={{width:"100%",marginBottom:"4px"}}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={e => e.key==="Enter" && tryAdminLogin()}
            />
            {pwError && <p className="pw-error">That's not quite right. Try again.</p>}
            <button className="submit-btn" style={{width:"100%",marginTop:"16px"}} onClick={tryAdminLogin}>
              Enter →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

