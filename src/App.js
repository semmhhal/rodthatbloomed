import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "https://petexirslmjvjefzfcuv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBldGV4aXJzbG1qdmplZnpmY3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTAwMjMsImV4cCI6MjA4ODY4NjAyM30.qb3-i72WQQW7rgKsVICv5Oe1sPzOPNp5HmC7U4hxKBM";

function renderLinkedText(text) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (match) {
      return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>;
    }
    return part;
  });
}

async function sbFetch(path, options = {}) {
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
  if (options.method === "POST" || options.method === "PATCH") {
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
  .sidebar-highlight {
    border-left: 3px solid var(--amber);
    background: var(--parchment);
    transition: border-color 0.3s, background 0.3s;
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
  .archive-posts-list {
    margin-top: 10px;
    padding-left: 12px;
    border-left: 2px solid var(--border);
  }
  .archive-post-title {
    font-size: 13px;
    color: var(--text-soft);
    padding: 5px 0;
    cursor: pointer;
    font-style: italic;
    transition: color 0.2s;
  }
  .archive-post-title:hover { color: var(--amber); }
  .search-input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border);
    background: white;
    padding: 10px 14px;
    font-family: 'Lora', serif;
    font-size: 13px;
    color: var(--text);
    border-radius: 2px;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--amber-light); }
  .search-input::placeholder { color: var(--amber-light); font-style: italic; }
  .categories-list { display: flex; flex-direction: column; }
  .category-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 13px;
    color: var(--text-soft);
    cursor: pointer;
    transition: color 0.2s;
    letter-spacing: 0.5px;
  }
  .category-item:hover { color: var(--amber); }
  .about-photo {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
    margin: 0 auto 16px;
    border: 2px solid var(--border);
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
  .edit-post-btn {
    background: none;
    border: 1px solid var(--amber);
    color: var(--amber);
    font-family: 'Lora', serif;
    font-size: 12px;
    cursor: pointer;
    padding: 6px 16px;
    border-radius: 2px;
    letter-spacing: 1px;
    transition: background 0.2s, color 0.2s;
    margin-bottom: 28px;
  }
  .edit-post-btn:hover {
    background: var(--amber);
    color: white;
  }
  .delete-post-btn {
    background: none;
    border: 1px solid var(--blush);
    color: var(--blush);
    font-family: 'Lora', serif;
    font-size: 12px;
    cursor: pointer;
    padding: 6px 16px;
    border-radius: 2px;
    letter-spacing: 1px;
    transition: background 0.2s, color 0.2s;
    margin-bottom: 28px;
  }
  .delete-post-btn:hover {
    background: var(--blush);
    color: white;
  }
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
  .full-body a {
    color: var(--amber);
    text-decoration: none;
    transition: color 0.2s;
  }
  .full-body a:hover { color: var(--brown-mid); }
  .divider {
    text-align: center;
    color: var(--amber-light);
    letter-spacing: 8px;
    margin: 40px 0;
    font-size: 18px;
    opacity: 0.6;
  }

  /* LIKE */
  .like-section {
    text-align: right;
    margin: 20px 0;
  }
  .like-btn {
    background: none;
    border: none;
    color: var(--amber);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'Lora', serif;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 2px;
    transition: color 0.2s, transform 0.2s;
  }
  .like-btn:hover { transform: scale(1.1); }
  .like-btn.liked {
    color: var(--blush);
  }

  /* SHARE */
  .share-icon-btn {
    background: none;
    border: none;
    color: var(--amber);
    cursor: pointer;
    padding: 4px;
    margin-bottom: 28px;
    opacity: 0.6;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
  }
  .share-icon-btn:hover { opacity: 1; }
  .share-copied {
    font-size: 11px;
    color: var(--sage);
    font-style: italic;
    letter-spacing: 0.5px;
    margin-bottom: 28px;
  }
  .share-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid var(--border);
    border-radius: 2px;
    box-shadow: 0 4px 16px rgba(42,26,14,0.12);
    z-index: 100;
    min-width: 160px;
    padding: 6px 0;
  }
  .share-menu-item {
    display: block;
    width: 100%;
    background: none;
    border: none;
    padding: 10px 18px;
    text-align: left;
    font-family: 'Lora', serif;
    font-size: 13px;
    color: var(--text);
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.15s, color 0.15s;
  }
  .share-menu-item:hover {
    background: var(--parchment);
    color: var(--amber);
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
  .reply-btn {
    background: none;
    border: none;
    color: var(--amber);
    font-family: 'Lora', serif;
    font-size: 12px;
    cursor: pointer;
    padding: 0;
    margin-left: 44px;
    margin-top: 4px;
    letter-spacing: 0.5px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .reply-btn:hover { opacity: 1; }
  .reply-form {
    margin-left: 44px;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
  }
  .comment-reply {
    margin-left: 44px;
    padding: 14px 0;
    border-left: 2px solid var(--border);
    padding-left: 16px;
    margin-top: 8px;
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

  /* CONTACT */
  .contact-section { max-width: 640px; }
  .contact-text {
    font-size: 15px;
    line-height: 1.8;
    color: var(--text-soft);
    margin-bottom: 20px;
    font-style: italic;
  }
  .contact-email {
    font-size: 16px;
    margin-top: 28px;
  }
  .contact-email a {
    color: var(--amber);
    text-decoration: none;
    transition: color 0.2s;
  }
  .contact-email a:hover { color: var(--brown-mid); }

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
  /* SUBSCRIBE */
  .subscribe-section {
    text-align: center;
    padding: 48px 24px;
    border-top: 1px solid var(--border);
    max-width: 480px;
    margin: 0 auto;
  }
  .subscribe-ornament {
    color: var(--amber-light);
    font-size: 18px;
    opacity: 0.6;
    margin-bottom: 16px;
  }
  .subscribe-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 300;
    color: var(--brown-deep);
    margin-bottom: 8px;
  }
  .subscribe-text {
    font-size: 14px;
    color: var(--text-soft);
    font-style: italic;
    margin-bottom: 20px;
  }
  .subscribe-form {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .subscribe-input {
    border: 1px solid var(--border);
    background: white;
    padding: 10px 14px;
    font-family: 'Lora', serif;
    font-size: 13px;
    color: var(--text);
    border-radius: 2px;
    outline: none;
    flex: 1;
    max-width: 280px;
    transition: border-color 0.2s;
  }
  .subscribe-input:focus { border-color: var(--amber-light); }
  .subscribe-btn {
    background: var(--amber);
    color: white;
    border: none;
    padding: 10px 20px;
    font-family: 'Lora', serif;
    font-size: 13px;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.2s;
  }
  .subscribe-btn:hover { background: var(--brown-mid); }
  .subscribe-count {
    font-size: 12px;
    color: var(--amber);
    letter-spacing: 1px;
    margin-top: 12px;
  }
  .admin-subs { margin-top: 4px; }
  .subs-list {
    background: white;
    border: 1px solid var(--border);
    border-radius: 2px;
    margin-top: 12px;
    text-align: left;
    max-height: 240px;
    overflow-y: auto;
  }
  .subs-empty {
    padding: 16px;
    font-size: 13px;
    color: var(--text-soft);
    font-style: italic;
  }
  .subs-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px dotted var(--border);
    font-size: 13px;
  }
  .subs-item:last-child { border-bottom: none; }
  .subs-email { color: var(--text); }
  .subs-date {
    color: var(--amber);
    font-size: 11px;
    letter-spacing: 0.5px;
  }

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


const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TAGS = ["Faith", "Childhood", "Struggle", "God", "Prayer", "Healing", "Community", "Reflection"];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("home");
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showWrite, setShowWrite] = useState(false);
  const [filterMonth, setFilterMonth] = useState(null);
  const [newComment, setNewComment] = useState({ name: "", email: "", message: "" });
  const [newPost, setNewPost] = useState({ title: "", body: "", tag: "Faith" });
  const [activeNav, setActiveNav] = useState("stories");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState(null);
  const [likes, setLikes] = useState({});
  const [likedPosts, setLikedPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rtb-liked") || "[]"); } catch { return []; }
  });
  const [commentLikes, setCommentLikes] = useState({});
  const [likedComments, setLikedComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rtb-liked-comments") || "[]"); } catch { return []; }
  });
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [subEmail, setSubEmail] = useState("");
  const [subSuccess, setSubSuccess] = useState(false);
  const [subError, setSubError] = useState("");
  const [subCount, setSubCount] = useState(0);
  const [subscribers, setSubscribers] = useState([]);
  const [showSubs, setShowSubs] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const ADMIN_PASSWORD = "rodthatbloomed2025";
  const loaded = useRef(false);

  // Load saved posts from Supabase
  useEffect(() => {
    (async () => {
      try {
        const saved = await sbFetch("/posts?order=created_at.asc");
        if (saved.length) {
          const formatted = saved.map(p => ({
            ...p,
            date: formatDate(p.created_at),
            monthKey: `${new Date(p.created_at).getFullYear()}-${String(new Date(p.created_at).getMonth()+1).padStart(2,"0")}`,
          }));
          setPosts(formatted);
        }
      } catch (e) {
        console.error("Could not load posts:", e);
      }
      loaded.current = true;
    })();
  }, []);

  // Fetch subscribers
  useEffect(() => {
    (async () => {
      try {
        const data = await sbFetch("/subscribers?order=created_at.desc");
        if (Array.isArray(data)) {
          setSubscribers(data);
          setSubCount(data.length);
        }
      } catch {}
    })();
  }, []);

  async function subscribe() {
    if (!subEmail.trim()) return;
    setSubError("");
    try {
      const data = await sbFetch("/subscribers", {
        method: "POST",
        body: JSON.stringify({ email: subEmail.trim() }),
      });
      const newSub = Array.isArray(data) ? data[0] : data;
      setSubscribers(prev => [newSub, ...prev]);
      setSubEmail("");
      setSubSuccess(true);
      setSubCount(prev => prev + 1);
      setTimeout(() => setSubSuccess(false), 3000);
      // Send welcome email
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/welcome-subscriber`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ email: newSub.email }),
        });
      } catch {}
    } catch (e) {
      if (e.message && e.message.includes("duplicate")) {
        setSubError("You're already subscribed!");
      } else {
        setSubError("Couldn't subscribe — " + (e.message || "please try again."));
      }
    }
  }

  // Fetch all likes counts
  useEffect(() => {
    (async () => {
      try {
        const data = await sbFetch("/likes?select=post_id");
        const counts = {};
        data.forEach(l => { counts[l.post_id] = (counts[l.post_id] || 0) + 1; });
        setLikes(counts);
      } catch {}
    })();
  }, []);

  async function likePost(postId) {
    if (likedPosts.includes(postId)) return;
    try {
      await sbFetch("/likes", {
        method: "POST",
        body: JSON.stringify({ post_id: postId }),
      });
      setLikes(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      const updated = [...likedPosts, postId];
      setLikedPosts(updated);
      localStorage.setItem("rtb-liked", JSON.stringify(updated));
    } catch {}
  }

  async function likeComment(commentId) {
    if (likedComments.includes(commentId)) return;
    try {
      await sbFetch("/comment_likes", {
        method: "POST",
        body: JSON.stringify({ comment_id: commentId }),
      });
      setCommentLikes(prev => ({ ...prev, [commentId]: (prev[commentId] || 0) + 1 }));
      const updated = [...likedComments, commentId];
      setLikedComments(updated);
      localStorage.setItem("rtb-liked-comments", JSON.stringify(updated));
    } catch {}
  }

  // Fetch comments from Supabase when a post is opened
  async function fetchComments(postId) {
    setCommentsLoading(true);
    setComments([]);
    try {
      const data = await sbFetch(`/comments?select=id,post_id,parent_id,name,email,message,created_at&post_id=eq.${postId}&order=created_at.asc`);
      setComments(data);
      // Fetch comment likes
      const commentIds = data.map(c => c.id);
      if (commentIds.length > 0) {
        const likesData = await sbFetch(`/comment_likes?select=comment_id&comment_id=in.(${commentIds.join(",")})`);
        const counts = {};
        likesData.forEach(l => { counts[l.comment_id] = (counts[l.comment_id] || 0) + 1; });
        setCommentLikes(counts);
      } else {
        setCommentLikes({});
      }
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

  const displayedPosts = posts.filter(p => {
    if (filterMonth && p.monthKey !== filterMonth) return false;
    if (filterTag && p.tag !== filterTag) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (p.title || "").toLowerCase().includes(q) ||
             (p.excerpt || "").toLowerCase().includes(q) ||
             (p.body || "").toLowerCase().includes(q) ||
             (p.tag || "").toLowerCase().includes(q);
    }
    return true;
  });

  function openPost(post) {
    setActivePost(post);
    setView("post");
    setSubmitSuccess(false);
    fetchComments(post.id);
    window.location.hash = `post/${post.id}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Open post from URL hash
  useEffect(() => {
    function handleHash() {
      const match = window.location.hash.match(/^#post\/(.+)$/);
      if (match && posts.length > 0) {
        const post = posts.find(p => String(p.id) === match[1]);
        if (post) {
          setActivePost(post);
          setView("post");
          fetchComments(post.id);
        }
      }
    }
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [posts]);

  function getShareUrl(post) {
    return `${window.location.origin}${window.location.pathname}#post/${post.id}`;
  }

  function shareVia(platform, post) {
    const url = getShareUrl(post);
    const encodedUrl = encodeURIComponent(url);
    setShowShareMenu(false);
    switch (platform) {
      case "imessage":
        window.open(`sms:&body=${encodedUrl}`); break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodedUrl}`); break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodedUrl}`); break;
      case "gmail":
        window.open(`https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(post.title)}&body=${encodedUrl}`); break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`); break;
      case "copy":
        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        break;
      default: break;
    }
  }

  async function submitComment(postId) {
    const commentName = isAdmin ? "Semhal" : newComment.name.trim();
    if (!commentName || !newComment.message.trim()) return;
    setCommentError("");
    try {
      const commentBody = {
        post_id: postId,
        name: commentName,
        message: newComment.message.trim(),
      };
      if (!isAdmin && newComment.email.trim()) commentBody.email = newComment.email.trim();
      const data = await sbFetch("/comments", {
        method: "POST",
        body: JSON.stringify(commentBody),
      });
      setComments(prev => [...prev, ...(Array.isArray(data) ? data : [data])]);
      setNewComment({ name: "", email: "", message: "" });
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

  async function submitReply(postId, parentId) {
    const rName = isAdmin ? "Semhal" : replyName.trim();
    if (!replyText.trim() || !rName) return;
    try {
      const data = await sbFetch("/comments", {
        method: "POST",
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId,
          name: rName,
          message: replyText.trim(),
        }),
      });
      setComments(prev => [...prev, ...(Array.isArray(data) ? data : [data])]);
      // Notify parent comment author
      const parentComment = comments.find(c => c.id === parentId);
      if (parentComment && parentComment.email) {
        try {
          await fetch(`${SUPABASE_URL}/functions/v1/notify-reply`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${SUPABASE_KEY}` },
            body: JSON.stringify({
              email: parentComment.email,
              commenterName: parentComment.name,
              replyName: rName,
              replyMessage: replyText.trim(),
              postTitle: activePost.title,
            }),
          });
        } catch {}
      }
      setReplyText("");
      setReplyName("");
      setReplyingTo(null);
    } catch (e) {
      setCommentError("Couldn't post reply — " + (e.message || "please try again."));
    }
  }

  async function publishPost() {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    try {
      const data = await sbFetch("/posts", {
        method: "POST",
        body: JSON.stringify({
          title: newPost.title.trim(),
          tag: newPost.tag,
          excerpt: newPost.body.slice(0, 180) + (newPost.body.length > 180 ? "…" : ""),
          body: newPost.body,
        }),
      });
      const saved = Array.isArray(data) ? data[0] : data;
      const p = {
        ...saved,
        date: formatDate(saved.created_at),
        monthKey: `${new Date(saved.created_at).getFullYear()}-${String(new Date(saved.created_at).getMonth()+1).padStart(2,"0")}`,
      };
      setPosts(prev => [...prev, p]);
      setNewPost({ title: "", body: "", tag: "Faith" });
      setShowWrite(false);
      // Notify subscribers
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/notify-subscribers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({ title: saved.title, excerpt: saved.excerpt }),
        });
      } catch {}
    } catch (e) {
      console.error("Could not publish post:", e);
    }
  }

  async function deletePost(postId) {
    try {
      await sbFetch(`/posts?id=eq.${postId}`, { method: "DELETE" });
    } catch (e) {
      console.error("Could not delete post:", e);
    }
    setPosts(prev => prev.filter(p => p.id !== postId));
    setActivePost(null);
    setView("home");
  }

  function startEditPost(post) {
    setEditingPost(post);
    setNewPost({ title: post.title, body: post.body, tag: post.tag });
    setShowWrite(true);
  }

  async function saveEditPost() {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    const updated = {
      title: newPost.title.trim(),
      tag: newPost.tag,
      excerpt: newPost.body.slice(0, 180) + (newPost.body.length > 180 ? "…" : ""),
      body: newPost.body,
    };
    try {
      await sbFetch(`/posts?id=eq.${editingPost.id}`, {
        method: "PATCH",
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Could not update post:", e);
      return;
    }
    setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...updated } : p));
    setActivePost(prev => prev && prev.id === editingPost.id ? { ...prev, ...updated } : prev);
    setEditingPost(null);
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
              {["stories","about","contact"].map(n => (
                <button key={n} className={`nav-btn${activeNav===n?" active":""}`}
                  onClick={() => { setActiveNav(n); setView("home"); setFilterMonth(null); setActivePost(null); window.scrollTo({top:0,behavior:"smooth"}); }}>
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
            <div className={`sidebar-section${activeNav==="about"?" sidebar-highlight":""}`}>
              <div className="sidebar-title">About This Space</div>
              <img src={`${process.env.PUBLIC_URL}/semhal.jpeg`} alt="Semhal" className="about-photo" />
              <p className="about-text">
                Hi, my name is Semhal. This is my open door — a place where I pour out whatever is sitting heavy on my heart and share what God has been gently teaching me through it all. About faith, childhood, womanhood, relationships, the wrestling, the healing — and the slow bloom that comes from being held even when you can't feel it. No performance, no polish. Just honesty, and the belief that someone out there needed to hear it too.
              </p>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Search</div>
              <input className="search-input" type="text" placeholder="Search entries..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setFilterTag(null); setFilterMonth(null); setView("home"); setActivePost(null); setActiveNav("stories"); }} />
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Archive</div>
              {Object.keys(archive).sort((a,b)=>b-a).map(year => (
                <div key={year}>
                  {Object.keys(archive[year]).sort((a,b)=>b-a).map(m => {
                    const label = MONTHS[parseInt(m,10)-1];
                    const key = `${year}-${m}`;
                    return (
                      <div key={m} className="archive-month"
                        onClick={() => { setFilterMonth(filterMonth===key?null:key); setView("home"); setActivePost(null); }}>
                        <span style={filterMonth===key?{color:"var(--amber)"}:{}}>{label} {year}</span>
                        <span className="count">{archive[year][m]}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
              {filterMonth && (
                <>
                  <div className="archive-posts-list">
                    {posts.filter(p => p.monthKey === filterMonth).map(p => (
                      <div key={p.id} className="archive-post-title" onClick={() => openPost(p)}>
                        {p.title}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setFilterMonth(null)}
                    style={{background:"none",border:"none",color:"var(--blush)",fontSize:"12px",cursor:"pointer",marginTop:"12px",letterSpacing:"1px"}}>
                    ✕ Clear filter
                  </button>
                </>
              )}
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Categories</div>
              <div className="categories-list">
                {TAGS.map(t => (
                  <div key={t} className="category-item"
                    onClick={() => { setFilterTag(filterTag === t ? null : t); setView("home"); setActivePost(null); setActiveNav("stories"); window.scrollTo({top:0,behavior:"smooth"}); }}>
                    <span style={filterTag === t ? {color:"var(--amber)"} : {}}>{t}</span>
                  </div>
                ))}
              </div>
              {filterTag && (
                <button onClick={() => setFilterTag(null)}
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
            {view === "home" && activeNav === "contact" && (
              <div className="contact-section">
                <div className="section-heading">Contact Me</div>
                <p className="contact-text">You don't have to have it all figured out to reach out.</p>
                <p className="contact-text">
                  If something here stirred something in you — a memory, a question, a wound you haven't named yet — I'd love to hear from you. This space exists because none of us are meant to carry our stories alone.
                </p>
                <p className="contact-text">Reach out. I read every message personally.</p>
                <p className="contact-email">📩 <a href="mailto:rodthatbloomed@gmail.com">rodthatbloomed@gmail.com</a></p>
              </div>
            )}

            {view === "home" && activeNav !== "contact" && (
              <>
                <div className="section-heading">
                  {searchQuery.trim() ? `Results for "${searchQuery}"` : filterTag ? filterTag : filterMonth ? `${MONTHS[parseInt(filterMonth.split("-")[1],10)-1]} ${filterMonth.split("-")[0]}` : "Recent Entries"}
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
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <button className="back-btn" onClick={() => { setView("home"); window.location.hash = ""; }}>← Back to entries</button>
                  <div style={{position:"relative",display:"flex",alignItems:"center",gap:"8px"}}>
                    {shareCopied && <span className="share-copied">Link copied!</span>}
                    <button className="share-icon-btn" onClick={() => setShowShareMenu(!showShareMenu)} title="Share this entry">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </button>
                    {showShareMenu && (
                      <div className="share-menu">
                        <button className="share-menu-item" onClick={() => shareVia("imessage", activePost)}>iMessage</button>
                        <button className="share-menu-item" onClick={() => shareVia("whatsapp", activePost)}>WhatsApp</button>
                        <button className="share-menu-item" onClick={() => shareVia("telegram", activePost)}>Telegram</button>
                        <button className="share-menu-item" onClick={() => shareVia("gmail", activePost)}>Gmail</button>
                        <button className="share-menu-item" onClick={() => shareVia("twitter", activePost)}>Twitter / X</button>
                        <button className="share-menu-item" onClick={() => shareVia("copy", activePost)}>Copy Link</button>
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <div style={{display:"flex",gap:"8px"}}>
                      <button className="edit-post-btn" onClick={() => startEditPost(activePost)}>
                        Edit Entry
                      </button>
                      <button className="delete-post-btn" onClick={() => deletePost(activePost.id)}>
                        Delete Entry
                      </button>
                    </div>
                  )}
                </div>
                <div className="post-meta">
                  <span className="post-date">{activePost.date}</span>
                  <span className="post-tag">{activePost.tag}</span>
                </div>
                <h1 className="full-title">{activePost.title}</h1>
                <div className="divider">✦ ✦ ✦</div>
                <div className="full-body">
                  {activePost.body.split("\n\n").map((para, i) => (
                    <p key={i}>{renderLinkedText(para)}</p>
                  ))}
                </div>
                <div className="like-section">
                  <button className={`like-btn${likedPosts.includes(activePost.id) ? " liked" : ""}`}
                    onClick={() => likePost(activePost.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={likedPosts.includes(activePost.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{likes[activePost.id] || 0}</span>
                  </button>
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

                  {postComments.filter(c => !c.parent_id).map(c => (
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
                      <button className="reply-btn" style={{marginTop:"10px"}} onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyName(""); setReplyText(""); }}>
                        Reply
                      </button>
                      <button className={`like-btn${likedComments.includes(c.id) ? " liked" : ""}`} style={{fontSize:"11px",padding:"2px 6px",marginTop:"8px"}}
                        onClick={() => likeComment(c.id)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={likedComments.includes(c.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        {commentLikes[c.id] || 0}
                      </button>
                      {replyingTo === c.id && (
                        <div className="reply-form">
                          {!isAdmin && <input className="form-input" style={{marginBottom:"8px",width:"100%",boxSizing:"border-box"}} placeholder="Your name"
                            value={replyName} onChange={e => setReplyName(e.target.value)} />}
                          <textarea className="form-textarea" style={{minHeight:"60px",width:"100%",boxSizing:"border-box"}} placeholder="Write a reply..."
                            value={replyText} onChange={e => setReplyText(e.target.value)} />
                          <div style={{display:"flex",gap:"8px",marginTop:"8px"}}>
                            <button className="submit-btn" style={{padding:"8px 16px",fontSize:"12px"}} onClick={() => submitReply(activePost.id, c.id)}>
                              Reply →
                            </button>
                            <button onClick={() => { setReplyingTo(null); setReplyName(""); setReplyText(""); }}
                              style={{background:"none",border:"none",color:"var(--text-soft)",fontSize:"12px",cursor:"pointer"}}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Replies */}
                      {postComments.filter(r => r.parent_id === c.id).map(r => (
                        <div key={r.id} className="comment-reply">
                          <div className="comment-header">
                            <div className="comment-avatar">{r.name[0].toUpperCase()}</div>
                            <span className="comment-name">{r.name}</span>
                            <span className="comment-time">
                              {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            {isAdmin && (
                              <button className="comment-delete-btn" onClick={() => deleteComment(r.id)} title="Delete reply">
                                ✕
                              </button>
                            )}
                          </div>
                          <p className="comment-text">{r.message}</p>
                          <button className={`like-btn${likedComments.includes(r.id) ? " liked" : ""}`} style={{fontSize:"11px",padding:"2px 6px",marginTop:"8px"}}
                            onClick={() => likeComment(r.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill={likedComments.includes(r.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            {commentLikes[r.id] || 0}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="comment-form">
                    <p className="form-title">Leave a reflection or share your own story...</p>
                    {!isAdmin && (
                      <div className="form-row">
                        <div className="form-field">
                          <label className="form-label">Your Name</label>
                          <input className="form-input" placeholder="e.g. Grace"
                            value={newComment.name}
                            onChange={e => setNewComment(p => ({...p, name: e.target.value}))} />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Your Email (optional, for reply notifications)</label>
                          <input className="form-input" type="email" placeholder="you@example.com"
                            value={newComment.email}
                            onChange={e => setNewComment(p => ({...p, email: e.target.value}))} />
                        </div>
                      </div>
                    )}
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

        {/* WRITE/EDIT MODAL — admin only */}
        {showWrite && isAdmin && (
          <div className="modal-overlay" onClick={e => { if(e.target===e.currentTarget) { setShowWrite(false); setEditingPost(null); setNewPost({title:"",body:"",tag:"Faith"}); }}}>
            <div className="modal">
              <button className="modal-close" onClick={() => { setShowWrite(false); setEditingPost(null); setNewPost({title:"",body:"",tag:"Faith"}); }}>✕</button>
              <h2 className="modal-title">{editingPost ? "Edit Entry" : "New Entry"}</h2>

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
                <button className="submit-btn" onClick={editingPost ? saveEditPost : publishPost}>
                  {editingPost ? "Save Changes →" : "Publish Entry →"}
                </button>
                <button onClick={() => { setShowWrite(false); setEditingPost(null); setNewPost({title:"",body:"",tag:"Faith"}); }}
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

      {/* SUBSCRIBE */}
      <div className="subscribe-section">
        <div className="subscribe-ornament">✦</div>
        <h3 className="subscribe-title">Stay With Me</h3>
        <p className="subscribe-text">Get notified when a new entry is published. No spam, just stories.</p>
        <div className="subscribe-form">
          <input className="subscribe-input" type="email" placeholder="Your email address"
            value={subEmail} onChange={e => setSubEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && subscribe()} />
          <button className="subscribe-btn" onClick={subscribe}>Subscribe</button>
        </div>
        {subSuccess && (
          <p style={{color:"var(--sage)",fontSize:"12px",fontStyle:"italic",marginTop:"10px"}}>
            ✦ Thank you for following along.
          </p>
        )}
        {subError && (
          <p style={{color:"var(--blush)",fontSize:"12px",fontStyle:"italic",marginTop:"10px"}}>{subError}</p>
        )}
        {isAdmin && (
          <div className="admin-subs">
            <p className="subscribe-count" onClick={() => setShowSubs(!showSubs)} style={{cursor:"pointer"}}>
              {subCount} {subCount === 1 ? "subscriber" : "subscribers"} {showSubs ? "▲" : "▼"}
            </p>
            {showSubs && (
              <div className="subs-list">
                {subscribers.length === 0 && <p className="subs-empty">No subscribers yet.</p>}
                {subscribers.map(s => (
                  <div key={s.id} className="subs-item">
                    <span className="subs-email">{s.email}</span>
                    <span className="subs-date">
                      {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-ornament">✦ ✦ ✦</div>
        <p className="footer-verse">
          "And it came to pass, that on the morrow Moses went into the tabernacle of witness;
          and, behold, the rod of Aaron for the house of Levi had budded,
          and brought forth buds, and bloomed blossoms, and yielded almonds."
          <span className="footer-verse-ref">Numbers 17 : 8</span>
        </p>
        <p className="footer-copy">© rodthatbloomed.com</p>
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
