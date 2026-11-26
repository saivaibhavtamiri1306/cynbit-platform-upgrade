import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Sparkles, ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, CheckCircle2,
  ShieldCheck, Cpu, Layers, Award, Code2, Database, Globe, Users, MapPin,
  Mail, Phone, Send, X, Menu, Search, Terminal, Activity, Download, Copy,
  Trash2, RefreshCw, Play, Sliders, MessageSquare, Wallet, Workflow,
  GraduationCap, GitPullRequest, CheckSquare, Zap, Clock, FileText, PenTool,
  ExternalLink, Compass, Shield, BookOpen, Briefcase, Heart, Star, Building2,
  Rocket, Command, Sun, Moon, Volume2, VolumeX, Mic, MicOff, Bookmark,
  Calendar, ArrowUp, Share2, Lock, Server, SlidersHorizontal, Eye, Check
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

/* ============================================================================
   1. CYNBIT AI ORCHESTRATOR, CURRENCY & WEB AUDIO MICRO-SOUNDS
   ============================================================================ */
const CYNBIT_HQ = '32/115 Pratap Nagar, Jaipur, RJ 302033';
const CYNBIT_COORDS = '26.8012° N, 75.8195° E • ap-south-1';
const CYNBIT_EMAIL = 'opportunities@cynbit.in';
const CYNBIT_PHONES = ['+91 89479 62667', '+91 78912 09777', '+91 83023 37367'];

const appId = typeof __app_id !== 'undefined' ? __app_id : 'cynbit-platform-live';
let firebaseApp = null;
let auth = null;
let db = null;
try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const cfg = typeof __firebase_config === 'string' ? JSON.parse(__firebase_config) : __firebase_config;
    firebaseApp = initializeApp(cfg);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
  }
} catch {
  // Local fallback active when cloud runtime config is absent
}

const AI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const AI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${AI_API_KEY}`;

async function callCynbitAI({ prompt, systemInstruction, responseSchema = null }) {
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  if (systemInstruction) payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  if (responseSchema) {
    payload.generationConfig = { responseMimeType: 'application/json', responseSchema };
  }
  const delays = [800, 1600];
  let lastErr = null;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch(AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if ((res.status === 429 || res.status >= 500) && attempt < delays.length) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty AI response');
      return { ok: true, data: responseSchema ? JSON.parse(text) : text, engine: 'cynbit-neural-core' };
    } catch (err) {
      lastErr = err;
      if (attempt < delays.length) await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  return { ok: false, error: lastErr?.message || 'Fallback active', engine: 'cynbit-edge-fallback' };
}

const CURRENCY_CONFIG = {
  INR: { symbol: '₹', rate: 1, locale: 'en-IN' },
  USD: { symbol: '$', rate: 0.012, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.011, locale: 'de-DE' },
};

function formatMoney(amountInINR, currency = 'INR') {
  const cfg = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  const converted = (Number(amountInINR) || 0) * cfg.rate;
  return new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'INR' ? 0 : 0,
  }).format(converted);
}

function playTactileTone(enabled, type = 'click') {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type === 'success' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(type === 'success' ? 620 : 440, ctx.currentTime);
    if (type === 'success') {
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
    }
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === 'success' ? 0.16 : 0.06));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (type === 'success' ? 0.17 : 0.07));
  } catch {
    // Ignore audio context restrictions
  }
}

/* ============================================================================
   2. NAVIGATION & COMPLETE PLATFORM DATA
   ============================================================================ */
const NAV_DROPDOWNS = {
  company: [
    { id: 'story', title: 'Our Story', sub: '2021–2026 journey.', icon: Compass },
    { id: 'team', title: 'Our Team', sub: 'Meet the architects.', icon: Users },
    { id: 'careers', title: 'Careers', sub: '20 open roles & PPOs.', icon: Briefcase },
    { id: 'impact', title: 'Social Impact', sub: 'Empowering Jaipur tech.', icon: Heart },
  ],
  expertise: [
    { id: 'services', title: 'Services Hub', sub: 'Tailored tech solutions.', icon: Cpu },
    { id: 'products', title: 'Product Suite', sub: 'Next-gen toolkits.', icon: Layers },
    { id: 'cases', title: 'Case Studies', sub: '11 real-world blueprints.', icon: Award },
    { id: 'studio', title: 'Cynbit AI Studio & Labs', sub: 'Live AI scope & sandboxes.', icon: Sparkles },
    { id: 'aitools', title: 'AI Tools Hub (10)', sub: 'Founder & Dev AI utilities.', icon: Terminal },
  ],
  bitelevate: [
    { id: 'bitelevate', title: 'BitElevate Ecosystem', sub: '60-day remote sprints.', icon: GraduationCap },
    { id: 'paths', title: 'Learning Paths', sub: 'Adaptive AI curricula.', icon: Rocket },
    { id: 'diaries', title: 'Student Diaries', sub: 'Real builder stories.', icon: BookOpen },
  ],
};

const STORY_MILESTONES = [
  {
    year: '2021',
    tag: 'THE PREP',
    title: '2021: Preparatory rigor.',
    desc: 'Before the identity, there was the logic. We spent 2021 engineering the invisible—building zero-trust modules and architectural blueprints that would eventually support a global ecosystem.',
    badge: 'SYSTEM LOGIC: PREPARATION',
  },
  {
    year: '2022',
    tag: 'VALIDATION',
    title: '2022: Stress testing.',
    desc: 'We took our internal frameworks to the market. Partnering with enterprise visionaries, we validated that our architectural approach could solve real-world friction at scale.',
    badge: '99.9% UPTIME • ZERO FRICTION',
  },
  {
    year: '2023',
    tag: 'THE PIVOT',
    title: '2023: Finalizing the roadmap.',
    desc: 'The year of intense experimentation. We refined our proprietary Cynbit AI engines and finalized the operational approach for our core suite—BitElevate, Cynbit Studio, and TenantEase.',
    badge: 'APPROACH FINALIZED',
  },
  {
    year: '2024',
    tag: 'BIRTH OF CYNBIT',
    title: '2024: Birth of Cynbit & ISO 9001:2015 certification.',
    desc: 'Cynbit Technologies was officially launched—not as a start, but as an arrival. With BitElevate, Cynbit Studio, TenantEase, and AI Agents launched, we transitioned into global innovation.',
    badge: 'ISO 9001:2015 CERTIFIED',
  },
  {
    year: '2026',
    tag: 'THE NEXT HORIZON',
    title: '2026: Cynbit 2.0 — Live AI Architecture & Global Labs.',
    desc: 'Empowering enterprises with instant AI architectural scoping, zero-CLS platforms, and over 1,000+ BitElevate alumni shipping production code worldwide.',
    badge: 'ACTIVE & SCALING',
  },
];

const CORE_LEADERSHIP = [
  {
    name: 'MOHAK SAINI',
    role: 'FOUNDER & CEO',
    bio: 'Leading technical strategy and systemic design of our core digital ecosystems.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
    initials: 'MS',
    linkedin: 'https://www.linkedin.com',
  },
  {
    name: 'ASHUTOSH UPADHYAY',
    role: 'CO-FOUNDER',
    bio: 'Ensuring intuitive architectures while maintaining rigorous technical integrity.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85',
    initials: 'AU',
    linkedin: 'https://www.linkedin.com',
  },
  {
    name: 'DHAWAN NAMA',
    role: 'CO-FOUNDER & CTO',
    bio: 'Scaling global footprints through strategic partnerships and ecosystem development.',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=85',
    initials: 'DN',
    linkedin: 'https://www.linkedin.com',
  },
];

const HERO_ROTATING_WORDS = [
  'IT systems.',
  'Digital ops.',
  'AI automation.',
  'Software dev.',
  'SaaS platforms.',
  'Cloud solutions.',
  'AI agents.',
  'Web apps.',
  'Dashboards.',
];

const CLIENT_LOGOS = [
  'MARKETING ADDICT', 'EVENTO', 'URBAN WARDROBE', 'CLOUDY TALES',
  'ECONTENTPREP', 'SOFIASA', 'WILD BASIL', 'PRADYA HEALTHS', 'WIZHEALTH',
  'ELITEVOGUE', 'CAREPLUS & GLOBALPAY',
];

const CLIENT_REVIEWS = [
  { id: 'r1', badge: '+40% GROWTH', quote: 'Cynbit transformed our technical infrastructure, resulting in a 40% increase in organic leads. Their approach is revolutionary.', client: 'Marketing Addict', type: 'STRATEGIC PARTNER', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80' },
  { id: 'r2', badge: '50K+ USERS', quote: 'The AI automation handled 50k+ users without a single flicker of latency. True engineering rigor.', client: 'Evento', type: 'ENTERPRISE SAAS', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80' },
  { id: 'r3', badge: '99.9% UPTIME', quote: "Cynbit's cloud architecture gave us the global stability we needed to expand our digital footprint rapidly.", client: 'Urban Wardrobe', type: 'GLOBAL RETAIL', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80' },
  { id: 'r4', badge: '100% SUCCESS', quote: 'From the first blueprint to final deployment, the Cynbit team acted as true architects of our story.', client: 'Cloudy Tales', type: 'CREATIVE STUDIO', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80' },
  { id: 'r5', badge: '25% FASTER TRIAGE', quote: 'Their diagnostic triage AI seamlessly integrated with our clinical workflows and cut urgent consultation wait times immediately.', client: 'WizHealth', type: 'HEALTHTECH', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&q=80' },
  { id: 'r6', badge: '60% FASTER ONBOARDING', quote: 'Re-engineering our legacy ERP with Cynbit reduced onboarding friction by 60% and lifted daily active usage across every branch.', client: 'Sofiasa', type: 'ENTERPRISE ERP', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80' },
];

const BITELEVATE_ENGINEER_REVIEWS = [
  { name: 'Arjun Sen', role: 'Python Backend Engineer', lab: 'Python Backend Lab', quote: 'Most internships just hand you a certificate at the end and don’t care what you did. Here, my PR got sent back for changes three times in week 2 because I forgot proper indexing.', outcome: 'Cleared SDE-1 Screening', initials: 'AS', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=180&q=80' },
  { name: 'Devansh Saxena', role: 'QA & Automation Engineer', lab: 'QA & Automation Lab', quote: 'I joined knowing barely any automated testing. Writing real Playwright scripts that broke our CI build taught me how production deployments actually work.', outcome: 'SDET Associate Role', initials: 'DS', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&q=80' },
  { name: 'Farhan Qureshi', role: 'AI & Vector Systems', lab: 'AI & Vector Systems Lab', quote: 'I thought AI projects were just calling an API with a wrapper. In BitElevate we actually dealt with chunking strategies, vector database latency, and fallback routing.', outcome: 'AI Engineer Intern', initials: 'FQ', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=180&q=80' },
  { name: 'Rohan Sharma', role: 'Cloud & DevOps Intern', lab: 'DevOps & Cloud Lab', quote: 'I used to dread technical interviews because I only knew textbook definitions of Docker and CI/CD. After debugging container crashes and Redis caching issues, I felt unstoppable.', outcome: 'DevOps Intern', initials: 'RS', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=180&q=80' },
  { name: 'Shruti Kulkarni', role: 'Frontend Engineer', lab: 'Frontend Ops Lab', quote: 'Day 12 incident simulation had me sweating—we had to track down a memory leak crashing the browser tab! Finding the issue and opening a hotfix PR was surreal.', outcome: 'Software Developer', initials: 'SK', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=180&q=80' },
  { name: 'Simran Kaur', role: 'Full Stack Engineer', lab: 'Full Stack SaaS Lab', quote: 'The line-by-line PR reviews are the best part. Mentors caught a security bug in my JWT auth flow that no tutorial ever warned about.', outcome: 'Full Stack Developer', initials: 'SK', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=180&q=80' },
  { name: 'Harshvardhan Patel', role: 'Backend Systems Developer', lab: 'Python Backend Lab', quote: 'The daily cadence is intense, I won’t lie. But seeing your GitHub contribution graph turn completely green and having 60 clean PRs merged by the end gives you real confidence.', outcome: 'Backend Developer Offer', initials: 'HP', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=180&q=80' },
  { name: 'Tanya Deshmukh', role: 'Software Engineering Intern', lab: 'Python Backend Lab', quote: 'I went from having an empty GitHub profile to having a production repo with dozens of merged PRs. Recruiters can open my actual code and verify every commit.', outcome: 'SDE Graduate Hire', initials: 'TD', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=180&q=80' },
];

const CORE_DIMENSIONS_16 = [
  { id: '01/16', title: 'Full stack web development', tag: 'CORE', style: 'bg-slate-100 text-slate-900', span: 'md:col-span-4' },
  { id: '02/16', title: 'Digital marketing', tag: 'GROWTH', style: 'bg-white border border-slate-200 text-slate-900', span: 'md:col-span-3' },
  { id: '03/16', title: 'UI/UX design', tag: 'DESIGN', style: 'bg-[#F8F3EC] border border-[#D4A373]/40 text-slate-900', span: 'md:col-span-5' },
  { id: '04/16', title: 'Artificial Intelligence (AI)', sub: 'Adaptive neural frameworks.', tag: 'FLAGSHIP', style: 'bg-[#056368] text-white', span: 'md:col-span-7' },
  { id: '05/16', title: 'Machine learning (ML)', tag: 'AI CORE', style: 'bg-white border border-[#056368]/30 text-slate-900', span: 'md:col-span-5' },
  { id: '06/16', title: 'Data science', tag: 'ANALYTICS', style: 'bg-white border border-slate-200 text-slate-900', span: 'md:col-span-4' },
  { id: '07/16', title: 'Data analytics', tag: 'INSIGHTS', style: 'bg-[#056368] text-white rounded-full', span: 'md:col-span-4' },
  { id: '08/16', title: 'DevOps', sub: 'Continuous integration. Zero friction.', tag: 'INFRA', style: 'bg-[#0B1221] text-white', span: 'md:col-span-4' },
  { id: '09/16', title: 'Cloud computing', sub: 'AWS / Azure / GCP', tag: 'CLOUD', style: 'bg-[#DCEBFF] text-slate-900', span: 'md:col-span-7' },
  { id: '10/16', title: 'Cybersecurity', tag: 'ZERO-TRUST', style: 'bg-slate-100 text-slate-900', span: 'md:col-span-5' },
  { id: '11/16', title: 'Blockchain development', tag: 'WEB3', style: 'bg-slate-100 text-slate-900', span: 'md:col-span-4' },
  { id: '12/16', title: 'Internet of things', tag: 'CONNECTED EDGE', style: 'bg-white border border-slate-200 text-slate-900', span: 'md:col-span-4' },
  {
    id: '13/16',
    title: 'Social media management',
    tag: 'BRAND',
    style: 'bg-slate-100 text-slate-900',
    span: 'md:col-span-4',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    ],
  },
  { id: '14/16', title: 'Deep learning', tag: 'NEURAL', style: 'bg-[#056368] text-white', span: 'md:col-span-7' },
  { id: '15/16', title: 'Natural language processing (NLP)', tag: 'LLMS', style: 'bg-slate-100 text-slate-900', span: 'md:col-span-5' },
  { id: '16/16', title: 'Business analytics', tag: 'STRATEGY', style: 'bg-[#FBE5C8] text-[#6B3E0B]', span: 'md:col-span-4' },
];

const UNHEARD_DIARIES_BENTO = [
  {
    id: 'ud-1',
    quote: 'Attendance became more about survival than learning.',
    headline: 'THE 30-MINUTE ATTENDANCE CHASE NO ONE WARNED ME ABOUT',
    author: 'Anonymous Student',
    role: 'ENGINEERING STUDENT',
    date: 'MAY 20, 2026',
    tags: ['#ATTENDANCE', '#COLLEGELIFE'],
    bg: 'bg-[#DCEBFF] text-slate-900',
    span: 'md:col-span-6',
    body: [
      'Attendance became more about survival than learning.',
      'Every morning felt like a race to avoid getting marked absent. Even inside class, many students weren’t really learning.',
      'Attendance anxiety is real, but it doesn’t define intelligence or growth. College is often more about the stories we collect than the marks we receive.',
    ],
  },
  {
    id: 'ud-2',
    quote: 'I had my entire life planned out when I joined college.',
    headline: 'WHY I STOPPED FOLLOWING THE PERFECT TIMELINE',
    author: 'Anonymous Student',
    role: 'COMPUTER SCIENCE STUDENT',
    date: 'FEBRUARY 15, 2026',
    tags: ['#PERSONALGROWTH', '#LIFEJOURNEY'],
    bg: 'bg-[#056368] text-white',
    span: 'md:col-span-6',
    body: [
      'I had my entire life planned out when I joined college.',
      'But life didn’t follow the timeline I imagined. Internships failed, grades slipped, and comparisons became exhausting.',
      'Eventually I realized I’m not behind, I’m just on my own timeline. Life feels lighter when you stop comparing your clock to someone else’s.',
    ],
  },
  {
    id: 'ud-3',
    quote: 'One sleepless hostel night turned into a deep conversation about fears and dreams.',
    headline: 'HOSTEL NIGHTS AND HEART-TO-HEARTS',
    author: 'Anonymous Student',
    role: 'HOSTEL RESIDENT',
    date: 'NOVEMBER 13, 2025',
    tags: ['#HOSTELLIFE', '#FRIENDSHIP'],
    bg: 'bg-white border border-slate-200 text-slate-900',
    span: 'md:col-span-12',
    body: [
      'One sleepless hostel night turned into a deep conversation about fears and dreams.',
      'We didn’t have solutions, but understanding each other made the future feel less scary.',
      'Hostel life is not just about late-night snacks, but the heart-to-hearts that stay forever.',
    ],
  },
  {
    id: 'ud-4',
    quote: 'The first week of college made me feel behind everyone else.',
    headline: 'THE SILENT BATTLE WITH SELF-DOUBT',
    author: 'Anonymous Student',
    role: '1ST YEAR STUDENT',
    date: 'AUGUST 11, 2025',
    tags: ['#SELFDOUBT', '#CONFIDENCE'],
    bg: 'bg-[#FBE5C8] text-slate-900',
    span: 'md:col-span-7',
    body: [
      'The first week of college made me feel behind everyone else.',
      'People post their highlight reels, not their struggles. Growth isn’t a race and confidence comes from progress, not comparison.',
      'You’re not behind. You’re just on your own timeline.',
    ],
  },
  {
    id: 'ud-5',
    quote: 'Everyone said college would give me clarity.',
    headline: 'FOUR YEARS IN, I STILL DON’T KNOW WHAT I WANT TO DO.',
    author: 'Anonymous Student',
    role: 'FINAL YEAR STUDENT',
    date: 'MARCH 18, 2025',
    tags: ['#CAREERCONFUSION', '#COLLEGE'],
    bg: 'bg-[#1F242D] text-white',
    span: 'md:col-span-5',
    body: [
      'Everyone said college would give me clarity. Four years later, I still don’t know what I’m actually meant to do.',
      'We follow paths everyone says are safe while secretly wondering if they’re ours. Clarity comes from building real things, not waiting for permission.',
    ],
  },
  {
    id: 'ud-6',
    quote: 'Four semesters in, and all I’ve really learned is how to pull all-nighters.',
    headline: 'COLLEGE MADE ME BUSY, NOT SMART.',
    author: 'Anonymous Student',
    role: '4TH SEMESTER STUDENT',
    date: 'FEBRUARY 4, 2025',
    tags: ['#EDUCATION', '#COLLEGEPRESSURE'],
    bg: 'bg-[#CBE1FF] text-slate-900',
    span: 'md:col-span-5',
    body: [
      'Four semesters in, and all I’ve really learned is how to pull all-nighters and meet deadlines.',
      'We copy-paste code we don’t understand and memorize things we forget the next day. Maybe education should be more than a race to keep up.',
    ],
  },
  {
    id: 'ud-7',
    quote: 'Sometimes I wonder if people even know I exist on campus.',
    headline: 'I’VE BEEN IN COLLEGE 3 YEARS. I STILL DON’T KNOW ANYONE.',
    author: 'Anonymous Student',
    role: '3RD YEAR STUDENT',
    date: 'NOVEMBER 2, 2024',
    tags: ['#LONELINESS', '#COLLEGE'],
    bg: 'bg-slate-100 text-slate-900',
    span: 'md:col-span-7',
    body: [
      'Sometimes I wonder if people even know I exist on campus. Classes feel transactional. Group projects are silent WhatsApp chats.',
      'Sometimes what students need most isn’t another lecture. It’s a real community of builders.',
    ],
  },
];

const CONTACT_FAQS = [
  { q: 'HOW CAN I START A PROJECT WITH CYNBIT?', a: 'You can start by reaching out via email, phone, or our AI Scope Studio. We’ll schedule an initial discovery call to understand your requirements and architectural needs.' },
  { q: 'DO YOU OFFER CUSTOM AI AUTOMATION SOLUTIONS?', a: 'Yes, we specialize in building custom AI agents, LLM integrations, and automated business workflows tailored to your specific operations.' },
  { q: 'WHERE IS CYNBIT TECHNOLOGIES LOCATED?', a: 'Our core engineering hub is located in Pratap Nagar, Jaipur, Rajasthan, but we serve visionaries and enterprises globally.' },
  { q: 'CAN I JOIN THE BITELEVATE PROGRAM?', a: 'Absolutely! BitElevate is our flagship 60-day remote training initiative. Visit the BitElevate page or contact us directly for instant cohort enrollment.' },
];

const TEAM_MEMBERS = [
  { name: 'Raghavendra Singh', role: 'Founder & Chief Architect', focus: 'Distributed Systems & Cynbit AI Core', exp: '8+ Yrs', initials: 'RS', avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&q=80' },
  { name: 'Meera Rathore', role: 'Head of AI Engineering', focus: 'Autonomous Agents, RAG & Evaluation', exp: '6+ Yrs', initials: 'MR', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80' },
  { name: 'Kabir Malhotra', role: 'Principal Full-Stack Lead', focus: 'Next.js, NestJS & Zero-Trust Cloud', exp: '7+ Yrs', initials: 'KM', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Neha Agarwal', role: 'Director of BitElevate Labs', focus: 'Engineering Mentorship & Curriculum', exp: '6+ Yrs', initials: 'NA', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
  { name: 'Siddharth Joshi', role: 'Lead Product Designer', focus: 'Cinematic UX, Motion & Design Systems', exp: '5+ Yrs', initials: 'SJ', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
  { name: 'Arjun Verma', role: 'Cloud & DevOps Architect', focus: 'Kubernetes, AWS, CI/CD & Telemetry', exp: '6+ Yrs', initials: 'AV', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
];

const SOCIAL_IMPACT_PILLARS = [
  { title: 'Tier-2 & Tier-3 Engineering Access', metric: '1,000+ Students', desc: 'Making real GitHub workflows, PR reviews, and production cloud deployments accessible to students outside metro hubs for ₹1,499.' },
  { title: 'Open-Source Jaipur Collective', metric: '28+ Repos', desc: 'Publishing starter kits, TypeScript validators, and vector search templates maintained by Cynbit engineers and BitElevate alumni.' },
  { title: 'Women in Systems Engineering', metric: '42% Cohort Share', desc: 'Dedicated mentorship circles and scholarship seats supporting female engineers entering backend, AI, and DevOps tracks.' },
  { title: 'MSME Digital Modernization', metric: '45+ Businesses', desc: 'Helping regional Indian logistics, healthcare, and retail SMEs automate manual billing and support operations.' },
];

const SERVICES_ECOSYSTEM = [
  {
    id: 'ai-suite',
    badge: '01 • INTELLIGENCE',
    title: 'AI Automation & Autonomous Agents',
    desc: 'Custom Cynbit AI agents that triage support tickets, reconcile ERP invoices, and orchestrate complex multi-step business workflows with human-in-the-loop guardrails.',
    drawerTitle: 'AI SUITE INQUIRY',
    cards: [
      ['AUTONOMOUS AGENTS', 'Smart AI assistants that manage leads and coordination.'],
      ['LLM AUTOMATION', 'Automate manual data entry and document handling with Cynbit AI.'],
      ['AI VOICE AGENTS', 'Advanced voice-driven AI for seamless human-machine communication.'],
      ['AI STACK INTEGRATION', 'Embedding elite intelligence into your existing SaaS stack.'],
    ],
  },
  {
    id: 'software-dev',
    badge: '02 • ENGINEERING',
    title: 'Scalable Software & Multi-Tenant SaaS',
    desc: 'High-throughput web applications, internal dashboards, and API ecosystems architected with TypeScript, Next.js, Go, and PostgreSQL for 99.99% reliability.',
    drawerTitle: 'SOFTWARE ARCHITECTURE INQUIRY',
    cards: [
      ['MULTI-TENANT SAAS', 'Row-level security, INR/USD billing, and role-based access control.'],
      ['ENTERPRISE PORTALS', 'Zero-CLS operational consoles built for speed and data density.'],
      ['API ORCHESTRATION', 'Typed REST & GraphQL gateways with Redis caching and rate limits.'],
      ['LEGACY MODERNIZATION', 'Zero-downtime migrations from monoliths to resilient cloud stacks.'],
    ],
  },
  {
    id: 'cloud-devops',
    badge: '03 • INFRASTRUCTURE',
    title: 'Cloud Reliability, QA & Zero-Trust Ops',
    desc: 'Automated CI/CD pipelines, containerized Kubernetes clusters, Playwright E2E test suites, and OpenTelemetry observability dashboards.',
    drawerTitle: 'CLOUD & DEVOPS INQUIRY',
    cards: [
      ['KUBERNETES & DOCKER', 'Multi-stage builds and auto-scaling clusters across ap-south-1.'],
      ['CI/CD AUTOMATION', 'Zero-downtime canary releases with automated rollback gates.'],
      ['SECURITY HARDENING', 'SOC2-aligned IAM policies, PII redaction, and secret management.'],
      ['OBSERVABILITY', 'Real-time latency heatmaps, error budgets, and SLA alerting.'],
    ],
  },
  {
    id: 'growth-seo',
    badge: '04 • DIGITAL MARKETING',
    title: 'Data-Driven Marketing & Technical SEO Engineering',
    desc: 'Performance-led strategies that merge technical SEO with high-impact creative to dominate search rankings, automate CRM funnels, and scale measurable ROI.',
    drawerTitle: 'GROWTH ENGINEERING',
    cards: [
      ['PERFORMANCE ADS', 'Strategic Google & Meta Ads focused on ROI and qualified lead gen.'],
      ['TECHNICAL SEO', 'Core Web Vitals and schema optimization so your platform dominates search.'],
      ['CRM AUTOMATION', 'Engines that nurture leads into loyal advocates automatically.'],
      ['FUNNEL OPTIMIZATION', 'High-conversion landing pages driven by real user telemetry.'],
    ],
  },
];

const PRODUCTS_SUITE = [
  {
    id: 'STUDIO',
    name: 'Cynbit Studio',
    tag: 'AI WORKFLOW & ARCHITECTURE ENGINE',
    desc: 'Design, test, and deploy autonomous Cynbit AI agent pipelines with deterministic JSON schemas, built-in fallback routing, and real-time latency telemetry.',
    metrics: ['320ms Avg Latency', 'Zero-Code + SDK', 'SOC2 Guardrails'],
    features: ['Visual node orchestration & webhook triggers', 'Automatic retry queues & schema validation', 'One-click Markdown & OpenAPI blueprint export'],
  },
  {
    id: 'TENANTEASE',
    name: 'TenantEase',
    tag: 'INDIAN SAAS & PROPERTY BILLING OS',
    desc: 'Complete multi-tenant management, automated GST-compliant INR invoicing, ledger reconciliation, and WhatsApp/email payment reminders for modern operators.',
    metrics: ['GST Ready', '98.4% Collection', 'Multi-Tenant RLS'],
    features: ['Automated recurring INR invoices & late-fee rules', 'Tally/SAP webhook sync & audit trails', 'Self-serve tenant portal with instant receipts'],
  },
  {
    id: 'REVIO',
    name: 'Revio AI',
    tag: 'CUSTOMER SENTIMENT & SUPPORT TRIAGE',
    desc: 'Turn unstructured customer reviews, tickets, and escalations into structured urgency scores, root-cause tags, and brand-aligned responses in seconds.',
    metrics: ['4x Faster SLA', 'Multilingual', '94% CSAT Lift'],
    features: ['Real-time sentiment gauge & SLA breach alerts', 'Executive, Empathetic & Technical reply tones', 'CRM & Slack escalation routing'],
  },
];

const TENANTEASE_MONTHLY_BARS = [
  { month: 'JUL', pct: 84, volume: 1420000 },
  { month: 'AUG', pct: 89, volume: 1680000 },
  { month: 'SEP', pct: 92, volume: 1940000 },
  { month: 'OCT', pct: 95, volume: 2210000 },
  { month: 'NOV', pct: 98, volume: 2560000 },
  { month: 'DEC', pct: 100, volume: 2890000 },
];

const REVIO_BRANCH_DATA = {
  'Jaipur HQ': { sentiment: 94, reviews: 1420, sla: '6m avg' },
  'Bengaluru': { sentiment: 97, reviews: 2180, sla: '4m avg' },
  'Mumbai': { sentiment: 92, reviews: 1890, sla: '7m avg' },
};

const TECH_STACK_GROUPS = [
  { title: 'LANGUAGES', icon: Code2, items: ['TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++'] },
  { title: 'FRAMEWORKS', icon: Layers, items: ['React', 'Next.js', 'NestJS', 'FastAPI', 'Django', 'Tailwind'] },
  { title: 'AI & DATA', icon: Cpu, items: ['Cynbit-Core', 'LangChain', 'PyTorch', 'TensorFlow', 'Pinecone', 'Spark'] },
  { title: 'CLOUD & OPS', icon: Globe, items: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'] },
  { title: 'DATABASES', icon: Database, items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Supabase', 'Neo4j'] },
];

// Full 11-Project Case Study Library (Section 3)
const CASE_STUDIES_DATA = [
  {
    id: 'wizhealth',
    client: 'WIZHEALTH',
    category: 'SOFTWARE DEV',
    title: 'AI Diagnostic Triage: Enhancing Medical Efficiency.',
    subtitle: 'Leveraging machine learning to prioritize patient symptoms and streamline clinical triage workflows.',
    completion: 'May 2026',
    status: 'ACTIVE & SCALED',
    roiMultiplier: 1450,
    img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1000&q=85',
    challenge: 'Clinicians were overwhelmed with a high volume of symptoms, making it difficult to prioritize urgent cases effectively.',
    solution: 'Built a Cynbit AI triage model that categorizes symptoms based on severity and urgency, integrating directly with existing patient records.',
    outcome: 'Improved triage efficiency by 25% and reduced turnaround time for urgent patient consultations.',
    span: 'md:col-span-7',
  },
  {
    id: 'pradya',
    client: 'PRADYA HEALTHS',
    category: 'SOFTWARE DEV',
    title: 'IoT Remote Patient Monitoring for Rural Health.',
    subtitle: 'Connecting rural patients with healthcare providers through a secure, IoT-integrated monitoring platform.',
    completion: 'May 2026',
    status: 'ACTIVE & SCALED',
    roiMultiplier: 1850,
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=85',
    challenge: 'Rural patients lacked consistent vitals monitoring, leading to avoidable emergency situations.',
    solution: 'Developed a mobile app that syncs vitals from wearable devices to a central clinician dashboard with automated alerts.',
    outcome: 'Achieved a 40% reduction in emergency room visits for enrolled patients.',
    span: 'md:col-span-5',
  },
  {
    id: 'wild-basil',
    client: 'WILD BASIL',
    category: 'SOFTWARE DEV',
    title: 'Blockchain-Lite Transparency for Sustainable Food.',
    subtitle: 'Implementing a transparent supply chain tracker to verify the origin and quality of organic ingredients.',
    completion: 'May 2026',
    status: 'LIVE IN PROD',
    roiMultiplier: 1200,
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85',
    challenge: 'Customers were increasingly demanding proof of sourcing for organic labels, which was difficult to provide manually.',
    solution: 'Built a QR-based tracking system that allows customers to scan a meal and see the entire journey from farm to table.',
    outcome: 'Strengthened brand trust and drove a 20% increase in premium subscription orders.',
    span: 'md:col-span-5',
  },
  {
    id: 'sofiasa',
    client: 'SOFIASA',
    category: 'SOFTWARE DEV',
    title: 'Modernizing Legacy ERP for the Digital Era.',
    subtitle: 'Transforming a complex enterprise resource planning tool into a modern, user-centric digital experience.',
    completion: 'May 2026',
    status: 'ACTIVE & SCALED',
    roiMultiplier: 2400,
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=85',
    challenge: 'An outdated UI/UX made the platform difficult to navigate, resulting in slow employee onboarding and high error rates.',
    solution: 'Re-engineered the frontend using React and a custom design system focused on efficiency and cognitive load reduction.',
    outcome: 'Reduced employee onboarding time by 60% and increased daily active users (DAU) by 30%.',
    span: 'md:col-span-7',
  },
  {
    id: 'econtentprep',
    client: 'ECONTENTPREP',
    category: 'AI AUTOMATION',
    title: 'AI-Driven Adaptive Learning Pathways for EdTech.',
    subtitle: 'Building an intelligent learning management system that tailors content to individual student progress.',
    completion: 'May 2026',
    status: 'LIVE IN PROD',
    roiMultiplier: 1650,
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=85',
    challenge: 'Static curriculum paths led to disengagement and lower completion rates among diverse learner groups.',
    solution: 'Created an adaptive engine that analyzes performance data to dynamically adjust lesson difficulty and format.',
    outcome: 'Increased course completion rates by 45% and significantly improved student satisfaction scores.',
    span: 'md:col-span-6',
  },
  {
    id: 'evento',
    client: 'EVENTO',
    category: 'CLOUD & SAAS',
    title: 'Scaling Real-Time Ticketing for Major Entertainment.',
    subtitle: 'High-concurrency ticketing engine handling 50k+ simultaneous bookings with zero flicker.',
    completion: 'Aug 2026',
    status: '99.99% SLA',
    roiMultiplier: 2900,
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85',
    challenge: 'Traffic spikes during concert launches caused checkout timeouts and inventory overselling.',
    solution: 'Architected Redis atomic seat locking, edge-cached queues, and Kubernetes auto-scaling workers.',
    outcome: 'Handled 50,000+ concurrent users at 19ms p95 latency with zero dropped checkouts.',
    span: 'md:col-span-6',
  },
  {
    id: 'urban-wardrobe',
    client: 'URBAN WARDROBE',
    category: 'CLOUD & SAAS',
    title: 'Global D2C Retail Cloud & Omnichannel Sync.',
    subtitle: 'Zero-downtime multi-region commerce mesh powering instant inventory sync across 65+ retail stores.',
    completion: 'Jun 2026',
    status: '99.9% UPTIME',
    roiMultiplier: 2100,
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85',
    challenge: 'Regional flash sales caused warehouse stock drift and slow mobile page loads across tier-2 cities.',
    solution: 'Deployed edge-cached Next.js storefronts backed by event-driven PostgreSQL & Redis inventory streams.',
    outcome: 'Cut checkout latency by 62% and lifted mobile conversion rates by 28%.',
    span: 'md:col-span-4',
  },
  {
    id: 'cloudy-tales',
    client: 'CLOUDY TALES',
    category: 'AI AUTOMATION',
    title: 'Autonomous Creative Asset & Storyboard Studio.',
    subtitle: 'AI-assisted media tagging, automated storyboard generation, and client proofing pipelines.',
    completion: 'Jul 2026',
    status: 'LIVE IN PROD',
    roiMultiplier: 1550,
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
    challenge: 'Manual asset indexing and revision loops delayed campaign deliveries by up to 2 weeks.',
    solution: 'Built a Cynbit AI vision-tagging pipeline and collaborative client review portal with instant versioning.',
    outcome: 'Accelerated creative turnaround by 3.1x with 100% client approval traceability.',
    span: 'md:col-span-4',
  },
  {
    id: 'marketing-addict',
    client: 'MARKETING ADDICT',
    category: 'AI AUTOMATION',
    title: 'Predictive Lead Scoring & Technical SEO Engine.',
    subtitle: 'Automated schema generation, Core Web Vitals optimization, and CRM lead qualification agents.',
    completion: 'Jul 2026',
    status: 'ACTIVE & SCALED',
    roiMultiplier: 2300,
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85',
    challenge: 'High-volume inbound leads overwhelmed sales reps without intent prioritization.',
    solution: 'Engineered an automated AI intent-scoring webhook and programmatic SEO landing page generator.',
    outcome: 'Delivered a +40% surge in qualified organic leads and cut CAC by 31%.',
    span: 'md:col-span-4',
  },
  {
    id: 'elitevogue',
    client: 'ELITEVOGUE',
    category: 'SOFTWARE DEV',
    title: 'High-Fashion Luxury Catalog & Personal Stylist AI.',
    subtitle: 'Bespoke editorial storefront paired with conversational outfit recommendations and VIP concierge.',
    completion: 'Sep 2026',
    status: 'LIVE IN PROD',
    roiMultiplier: 2650,
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85',
    challenge: 'High bounce rates on mobile lookbooks due to heavy unoptimized imagery and generic search.',
    solution: 'Crafted a zero-CLS responsive catalog with vector similarity styling recommendations.',
    outcome: 'Increased average order value (AOV) by 34% and repeat VIP sessions by 48%.',
    span: 'md:col-span-6',
  },
  {
    id: 'careplus-globalpay',
    client: 'CAREPLUS & GLOBALPAY',
    category: 'CLOUD & SAAS',
    title: 'Cross-Border Health & Fintech Settlement Gateway.',
    subtitle: 'Multi-currency INR/USD/EUR escrow reconciliation with DPDP & PCI-aligned audit trails.',
    completion: 'Oct 2026',
    status: '99.99% SLA',
    roiMultiplier: 3400,
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85',
    challenge: 'Manual cross-border medical insurance claims took 9 days to reconcile across currencies.',
    solution: 'Architected idempotent webhook ledgers, automated FX locking, and real-time compliance checks.',
    outcome: 'Reduced settlement time from 9 days to 14 minutes with zero ledger discrepancies.',
    span: 'md:col-span-6',
  },
];

const BITELEVATE_LABS = [
  {
    id: 'fullstack',
    tab: 'FULL-STACK SAAS LAB',
    repo: 'github.com/cynbit-technologies/bitelevate-fullstack-lab',
    title: 'SprintPulse Project Management SaaS',
    subtitle: 'Real-world Kanban SaaS built with Next.js 15, FastAPI & PostgreSQL',
    desc: 'An enterprise Kanban board like Trello/Linear. Implement drag-and-drop state machines, JWT auth, real-time board updates, database migrations, and Dockerized deployment.',
    stack: ['Next.js 15', 'React 19', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    branch: 'task/day-14-api-cache',
    target: 'End-to-end full stack architecture & client-server contracts',
  },
  {
    id: 'backend',
    tab: 'PYTHON BACKEND LAB',
    repo: 'github.com/cynbit-technologies/bitelevate-backend-lab',
    title: 'PulseServe Backend Lab',
    subtitle: 'High-throughput service API with FastAPI, SQLAlchemy 2.0 & Redis',
    desc: 'A high-performance multi-tenant API following Clean Architecture (Router -> Service -> Repository -> Models). Implement Redis caching, database indexing, rate limiting, and 100% automated test coverage.',
    stack: ['Python 3.11+', 'FastAPI', 'SQLAlchemy 2.0', 'PostgreSQL', 'Redis', 'Pytest', 'Alembic'],
    branch: 'task/day-14-api-cache',
    target: 'Clean Architecture, caching & production API resilience',
  },
  {
    id: 'ai',
    tab: 'AI & VECTOR INTELLIGENCE LAB',
    repo: 'github.com/cynbit-technologies/bitelevate-ai-lab',
    title: 'SupportPulse AI Platform',
    subtitle: 'RAG vector search, cosine embeddings & intelligent ticket categorization',
    desc: 'An autonomous support copilot. Generate vector embeddings, chunk enterprise documentation, perform cosine similarity search, build RAG pipelines, and configure fallback routing between Cynbit AI models.',
    stack: ['Python', 'FastAPI', 'Cynbit-SDK', 'Vector Search', 'Cosine Similarity', 'RAG Pipeline', 'Pytest'],
    branch: 'task/day-22-rag-chunking',
    target: 'Enterprise RAG architectures & production AI pipelines',
  },
  {
    id: 'frontend',
    tab: 'FRONTEND OPS DASHBOARD LAB',
    repo: 'github.com/cynbit-technologies/bitelevate-frontend-lab',
    title: 'PulseServe Operations Dashboard',
    subtitle: 'High-performance analytics monitoring built with Next.js 15 & React 19',
    desc: 'A real-time operations dashboard used by managers. Build slide-over drawer sheets, responsive data grids, optimistic UI state updates, KPI summary widgets, and zero-flicker client routing.',
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Lucide Icons', 'Optimistic UI'],
    branch: 'task/day-16-zero-cls-grid',
    target: 'Production React 19 architecture & client performance',
  },
  {
    id: 'qa',
    tab: 'QA & TEST AUTOMATION LAB',
    repo: 'github.com/cynbit-technologies/bitelevate-qa-lab',
    title: 'ApexCart QA Training Lab',
    subtitle: 'End-to-end browser automation with Playwright TypeScript & Pytest',
    desc: 'An enterprise automated test harness. Author headless browser regressions, validate checkout payment flows, detect broken API payloads, and build quality gates for automated CI/CD pipelines.',
    stack: ['TypeScript', 'Playwright', 'Python', 'Pytest', 'Express', 'HTTPX', 'CI/CD Gates'],
    branch: 'task/day-19-e2e-checkout',
    target: 'SDET, QA Automation & CI/CD reliability gates',
  },
  {
    id: 'design',
    tab: 'UI/UX & DESIGN SYSTEMS LAB',
    repo: 'github.com/cynbit-technologies/bitelevate-uiux-lab',
    title: 'ApexDesign System & Lab',
    subtitle: 'Enterprise design tokens, WCAG 2.1 AA accessibility & micro-interactions',
    desc: 'A scalable industrial design system. Define DTCG JSON design tokens, automate 4.5:1 color contrast ratio checkers, build accessible modal focus traps, and create interactive component specifications.',
    stack: ['Figma Variables', 'W3C Design Tokens', 'Tailwind CSS', 'WCAG 2.1 AA', 'Motion UX'],
    branch: 'task/day-15-token-pipeline',
    target: 'Design token architecture & accessible component systems',
  },
];

const BITELEVATE_SYLLABUS_WEEKS = [
  { week: 'Week 1 (Days 1–7)', title: 'Repository Setup, Git Hygiene & First Merged PR', items: ['Fork & clone private production lab repository', 'Configure local Docker/PostgreSQL/Redis environment', 'Submit Day-3 architecture profile & merge first PR'] },
  { week: 'Week 2 (Days 8–14)', title: 'Bug Hunting, Edge Cases & Automated Tests', items: ['Reproduce real production stack traces from logs', 'Write unit & integration tests (Pytest / Playwright)', 'Achieve 95%+ branch coverage in CI pipeline'] },
  { week: 'Weeks 3–4 (Days 15–30)', title: 'Auth, RBAC Schemas & Day-18 War Room', items: ['Implement JWT rotation & Row-Level Security (RLS)', 'Day-18 Live Incident Simulation: resolve OOM & deadlock alerts', 'Senior architect line-by-line PR security review'] },
  { week: 'Weeks 5–6 (Days 31–45)', title: 'Redis Caching, Query Indexing & Concurrency', items: ['Eliminate N+1 queries with composite B-tree indexes', 'Add Redis sliding-window rate limits & cache invalidation', 'Benchmark p95 API latency under 5,000 req/min load'] },
  { week: 'Weeks 7–8 (Days 46–60)', title: 'CI/CD Deployment, Capstone Defense & QR Cert', items: ['Multi-stage Docker builds & GitHub Actions quality gates', 'Final Capstone architecture walkthrough & scoring', 'Issue ISO 9001:2015 QR-verifiable certificate & PPO fast-track'] },
];

const LEARNING_PATHS = [
  { id: 'lp-1', title: 'Full-Stack Systems Architect', duration: '60 Days', level: 'Intermediate', labs: 4, skills: ['Next.js 15', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'] },
  { id: 'lp-2', title: 'Applied AI & Autonomous Agents', duration: '60 Days', level: 'Intermediate', labs: 4, skills: ['Python', 'FastAPI', 'RAG Pipelines', 'JSON Schemas', 'Eval Harnesses'] },
  { id: 'lp-3', title: 'Cloud Reliability & DevOps Engineer', duration: '45 Days', level: 'Advanced', labs: 3, skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Telemetry'] },
  { id: 'lp-4', title: 'Frontend Motion & Design Systems', duration: '45 Days', level: 'Beginner', labs: 3, skills: ['React', 'Tailwind CSS', 'Zero-CLS UI', 'Accessibility', 'SVG'] },
];

const INITIAL_DIARIES = [
  {
    id: 'd1',
    name: 'Rohan Sharma',
    role: 'BitElevate Alumni -> SDE-1 at FinTech Bengaluru',
    date: 'OCT 2026',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=140&q=80',
    title: 'My first Day-18 War Room PR review changed how I write backend code.',
    story: 'Before BitElevate, I only built tutorial clones. Having senior Cynbit architects review my Redis caching PR line-by-line taught me real production debugging and helped me crack two SDE offers.',
  },
  {
    id: 'd2',
    name: 'Ananya Gupta',
    role: 'BitElevate Alumni -> Full-Stack Intern at Cynbit',
    date: 'NOV 2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=140&q=80',
    title: 'From college labs to shipping multi-tenant RBAC in 60 days.',
    story: 'The ₹1,499 sprint gave me 29 merged PRs, a verified QR certificate accepted by my university for 4 credits, and a direct interview loop with the Jaipur engineering squad.',
  },
  {
    id: 'd3',
    name: 'Farhan Qureshi',
    role: 'BitElevate Alumni -> AI Systems Engineer',
    date: 'NOV 2026',
    avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=140&q=80',
    title: 'Building SupportPulse RAG with cosine search & fallback routing.',
    story: 'Learning how to structure deterministic JSON outputs and measure latency budgets gave me a huge edge in technical interviews.',
  },
];

const BLOG_POSTS = [
  {
    id: 'best-automation-2026',
    category: 'AI AUTOMATION',
    readTime: '14 MIN READ',
    date: 'NOV 2026',
    author: 'CYNBIT TECHNOLOGIES',
    featured: true,
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=85',
    title: 'BEST BUSINESS AUTOMATION TOOLS IN 2026',
    excerpt: 'Efficiency isn’t just about working harder; it’s about using the right leverage. Discover the essential autonomous AI and workflow tools transforming enterprise operations.',
    body: 'Modern enterprises win through operational leverage. In 2026, combining deterministic workflow engines with autonomous Cynbit AI agents allows teams to eliminate repetitive CRM reconciliation, support triage, and document extraction—freeing engineers to focus on high-leverage architecture.',
  },
  {
    id: 'ai-support',
    category: 'AI AUTOMATION',
    readTime: '14 MIN READ',
    date: 'FEB 26',
    author: 'CYNBIT TECHNOLOGIES',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85',
    title: 'FUTURE OF AI-POWERED CUSTOMER SUPPORT SYSTEMS',
    excerpt: 'Explore the next frontier of customer service: Multimodal Cynbit AI, emotional intelligence, and proactive problem-solving before tickets even open.',
    body: 'Modern support operations cannot scale on static decision trees. At Cynbit Technologies, we architect hybrid triage systems that combine deterministic JSON schema validation, vector SOP grounding, and human-in-the-loop escalation. By measuring p95 response latency and sentiment shift in real time, teams reduce resolution times by over 65% while maintaining strict brand safety.',
  },
  {
    id: 'web-trends-2026',
    category: 'ENGINEERING',
    readTime: '14 MIN READ',
    date: 'MAR 26',
    author: 'CYNBIT TECHNOLOGIES',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85',
    title: 'TOP WEB DEVELOPMENT TRENDS IN 2026',
    excerpt: 'Static sites are a memory. Explore the transition to AI-native interfaces, zero-CLS dashboards, and the architectural shift toward performance-first React.',
    body: 'Visual stability directly impacts operator trust in enterprise software. We enforce strict aspect-ratio reservations, optimistic state updates, and memoized virtualized tables across every Cynbit platform. Combined with edge caching and lightweight inline SVGs, even telemetry-dense dashboards remain silky smooth on mobile and desktop.',
  },
  {
    id: 'ai-marketing-2026',
    category: 'AI AUTOMATION',
    readTime: '15 MIN READ',
    date: 'APR 26',
    author: 'MOHAK SAINI',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85',
    title: 'HOW AI IS REVOLUTIONIZING DIGITAL MARKETING IN 2026',
    excerpt: 'Marketing has moved from mass-broadcasting to mathematical precision. Discover how AI is transforming technical SEO, content strategy, and paid acquisition.',
    body: 'By uniting technical SEO telemetry with real-time intent scoring and CRM automation, growth teams can cut CAC dramatically while delivering deeply relevant customer journeys.',
  },
  {
    id: 'bitelevate-pr',
    category: 'BITELEVATE',
    readTime: '7 MIN READ',
    date: 'SEP 26',
    author: 'ASHUTOSH UPADHYAY',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85',
    title: 'WHY REAL GITHUB PR REVIEWS BEAT 100 HOURS OF VIDEO TUTORIALS',
    excerpt: 'Inside the 60-day BitElevate engineering sprint: how branch hygiene, failing CI checks, and senior feedback forge job-ready developers.',
    body: 'Passive video consumption creates an illusion of competence. Inside BitElevate, every intern works on feature branches, writes automated tests, and responds to real architectural critiques from senior engineers. By Day 60, graduates possess an auditable GitHub history and ISO 9001:2015 verified credentials.',
  },
  {
    id: 'serverless-mesh',
    category: 'ENGINEERING',
    readTime: '15 MIN READ',
    date: 'OCT 26',
    author: 'DHAWAN NAMA',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85',
    title: 'SERVERLESS MESH: THE FUTURE OF CLOUD SCALING',
    excerpt: 'Moving beyond monolithic serverless to a more resilient, distributed architecture engineered for sub-20ms global latency.',
    body: 'Distributed edge workers paired with connection-pooled PostgreSQL and Redis idempotency layers give modern SaaS platforms enterprise uptime without bloated infrastructure overhead.',
  },
];

const CAREER_OPENINGS = [
  { id: 'c1', title: 'Full Stack Developer Intern', dept: 'Engineering', type: 'Internship', loc: 'REMOTE / JAIPUR', stack: ['React / Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'], desc: 'Join our engineering team to build scalable digital ecosystems using modern tech stacks.' },
  { id: 'c2', title: 'AI/ML Engineer Intern', dept: 'AI Systems', type: 'Internship', loc: 'REMOTE / JAIPUR', stack: ['Python', 'FastAPI', 'Cynbit AI / LLMs', 'RAG'], desc: 'Help us engineer autonomous agents and Cynbit AI-powered solutions for modern businesses.' },
  { id: 'c3', title: 'Backend Developer Intern', dept: 'Engineering', type: 'Internship', loc: 'REMOTE / JAIPUR', stack: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'], desc: 'Focus on building the high-performance core of our software architecture.' },
  { id: 'c4', title: 'UI/UX Design Intern', dept: 'Design', type: 'Internship', loc: 'REMOTE / JAIPUR', stack: ['Figma', 'Design Tokens', 'Motion UX', 'Tailwind'], desc: 'Transform complex workflows into intuitive and high-impact digital experiences.' },
  { id: 'c5', title: 'QA Testing Intern', dept: 'Engineering', type: 'Internship', loc: 'REMOTE / JAIPUR', stack: ['Playwright', 'TypeScript', 'Pytest', 'CI/CD'], desc: 'Ensure the technical rigor and reliability of our proprietary SaaS suite.' },
  { id: 'c6', title: 'Growth Marketing Intern', dept: 'Growth', type: 'Internship', loc: 'REMOTE / JAIPUR', stack: ['Technical SEO', 'Analytics', 'CRM Funnels'], desc: 'Engineer high-impact growth engines and user acquisition funnels.' },
  { id: 'c7', title: 'HR & Talent Acquisition Intern', dept: 'Business', type: 'Internship', loc: 'REMOTE / JAIPUR', stack: ['Talent Ops', 'Campus Relations', 'Sourcing'], desc: 'Help us architect the core team at Cynbit.' },
  { id: 'c8', title: 'Full Stack Developer', dept: 'Engineering', type: 'Full-Time', loc: 'REMOTE / JAIPUR', stack: ['Next.js', 'TypeScript', 'NestJS', 'AWS'], desc: 'Experience: 1–3 Years. Architecting scalable digital ecosystems.' },
  { id: 'c9', title: 'AI Automation Systems Engineer', dept: 'AI Systems', type: 'Full-Time', loc: 'REMOTE / JAIPUR', stack: ['Python / FastAPI', 'Cynbit AI', 'Autonomous Agents', 'Observability'], desc: 'Experience: 1–3 Years. Engineering autonomous agents and RAG pipelines.' },
  { id: 'c10', title: 'DevOps / Cloud Engineer', dept: 'Engineering', type: 'Full-Time', loc: 'REMOTE / JAIPUR', stack: ['AWS / Azure', 'Docker', 'Kubernetes', 'Zero-Trust'], desc: 'Experience: AWS, Docker, Kubernetes, zero-downtime deployment pipelines.' },
  { id: 'c11', title: 'Backend Developer', dept: 'Engineering', type: 'Full-Time', loc: 'REMOTE / JAIPUR', stack: ['Go / Node.js', 'PostgreSQL', 'Microservices'], desc: 'Experience: 1–3 Years. Focused on high-performance APIs and data systems.' },
  { id: 'c12', title: 'Growth Manager', dept: 'Growth', type: 'Full-Time', loc: 'REMOTE / JAIPUR', stack: ['Performance Ads', 'SEO', 'B2B Growth'], desc: 'Experience: Lead generation, technical SEO, and enterprise growth strategies.' },
];

const LIFECYCLE_PHASES = [
  { step: '01', title: 'Discovery & audit', tag: 'STRATEGIC AUDIT', stability: '99.4%', latency: '42ms', desc: 'We deep-dive into your existing workflows and technical debt to identify invisible friction points.', nodes: ['Client Ops', 'Audit Engine', 'Risk Matrix'] },
  { step: '02', title: 'Strategy & blueprinting', tag: 'BLUEPRINT PHASE', stability: '99.7%', latency: '31ms', desc: 'A custom architectural roadmap mapping the logic, Cynbit AI integration, and scalability modules.', nodes: ['Schema Lock', 'AI Guardrails', 'Cloud Spec'] },
  { step: '03', title: 'High-fidelity design', tag: 'CINEMATIC UX', stability: '99.8%', latency: '24ms', desc: 'Cinematic, user-centric systems designed to turn complex technical logic into seamless human experiences.', nodes: ['Design Tokens', 'Motion Curve', 'Zero-CLS UI'] },
  { step: '04', title: 'Technical implementation', tag: 'EXECUTION', stability: '99.9%', latency: '19ms', desc: 'Deployment of robust technical engines and clean, resilient codebases built for enterprise stability.', nodes: ['Next.js UI', 'API Gateway', 'PostgreSQL'] },
  { step: '05', title: 'Quality & integrity check', tag: 'ZERO-DEFECT QA', stability: '99.95%', latency: '16ms', desc: 'Rigorous stress-testing and security audits to ensure your ecosystem is production-ready.', nodes: ['Playwright E2E', 'Load Probe', 'Security Gate'] },
  { step: '06', title: 'Deployment & evolution', tag: 'GLOBAL SCALE', stability: '99.99%', latency: '12ms', desc: 'Live launch followed by ROI-driven optimization and proactive system scaling.', nodes: ['Edge CDN', 'Telemetry Hub', 'Auto-Scale'] },
];

const CORE_WEB_VITALS = [
  { metric: 'LCP', full: 'Largest Contentful Paint', value: '0.9s', pct: 94 },
  { metric: 'CLS', full: 'Cumulative Layout Shift', value: '0.01', pct: 99 },
  { metric: 'INP', full: 'Interaction to Next Paint', value: '36ms', pct: 95 },
  { metric: 'A11Y', full: 'Accessibility Score', value: '100', pct: 100 },
];

const AUDIT_ITEMS = [
  {
    id: 'audit-1', number: '01', categories: ['UX & Conversion', 'AI & Interaction'],
    title: 'Passive Contact Form -> AI Architecture & Scope Studio',
    before: 'Static free-text inquiry form that captures unstructured leads and delays technical estimation by days.',
    after: 'Guided 4-step scoping studio powered by Cynbit AI + Cloud Sync with instant 4-layer architecture, INR bands, Markdown export, and live queue triage.',
    impact: 'Higher Lead Conversion', targetPage: 'studio',
  },
  {
    id: 'audit-2', number: '02', categories: ['UX & Conversion', 'Full-Stack Engineering'],
    title: 'Static Service Cards -> Interactive Live Capability Sandboxes',
    before: 'Text-only service descriptions for AI agents, software engineering, and SaaS platforms without interactive proof.',
    after: 'Four live mini-products visitors operate immediately: AI Support Triage, Code & Performance Auditor (SVG Radar), INR Billing Ledger, and Agent Graph.',
    impact: 'Live Proof of Engineering', targetPage: 'studio',
  },
  {
    id: 'audit-3', number: '03', categories: ['UX & Conversion', 'AI & Interaction'],
    title: 'Informational BitElevate -> Adaptive Lab Matcher & QR Verifier',
    before: 'Static curriculum overview leaving students unsure which track fits their schedule and lacking instant public credential checks.',
    after: '3-variable Lab Track Matcher outputting tailored sprint timelines plus a public QR Certificate Verifier with instant valid/invalid registry checks.',
    impact: 'Self-Serve Enrollment', targetPage: 'bitelevate',
  },
  {
    id: 'audit-4', number: '04', categories: ['Full-Stack Engineering'],
    title: 'External Careers -> Filterable Talent Hub & Cloud Tracker',
    before: 'Disconnected job listings with manual email submissions and zero candidate feedback on submission status.',
    after: 'Multi-axis filterable Talent Hub (Department + Type) with validated Quick Apply modal, cloud persistence, and live Submitted Applications drawer.',
    impact: 'Streamlined Hiring', targetPage: 'careers',
  },
  {
    id: 'audit-5', number: '05', categories: ['AI & Interaction'],
    title: 'Manual Site Browsing -> Aria AI Copilot & Cmd+K Palette',
    before: 'Visitors manually scroll across multiple pages to compare capabilities, timelines, or internship details.',
    after: 'Persistent Cmd/Ctrl+K quick navigation palette and floating Voice + Hinglish Aria AI Copilot powered by real live AI reasoning.',
    impact: 'Instant Discovery', targetPage: 'open-aria',
  },
  {
    id: 'audit-6', number: '06', categories: ['Full-Stack Engineering'],
    title: 'Black-Box Frontend -> Validated Full-Stack API Inspector',
    before: 'No visibility into request validation, latency, or state synchronization during technical evaluation.',
    after: 'Real-time API & Telemetry Inspector drawer logging every cloud CRUD action, Cynbit AI call, validation check, and exportable Audit Summary (.md).',
    impact: '100% Observability', targetPage: 'open-inspector',
  },
];

const SCOPE_TRACKS = [
  { id: 'AI Automation Systems', short: 'AI Automation', desc: 'Autonomous AI agents, LLM triage pipelines, RAG assistants & operational guardrails.', baseWeeks: 4 },
  { id: 'Scalable Digital Platforms', short: 'Digital Platforms', desc: 'Multi-tenant SaaS portals, high-throughput APIs, ERP/CRM sync & cloud architecture.', baseWeeks: 5 },
  { id: 'High-Performance Engineering Labs', short: 'Engineering Labs', desc: 'Rapid R&D prototypes, performance benchmarking, QA automation & security hardening.', baseWeeks: 4 },
];

const SCOPE_MODULES = [
  'Agentic Workflow Triage', 'Multi-Tenant Web Portal', 'ERP / CRM Webhook Sync',
  'Real-Time Telemetry Dashboard', 'RBAC & Security Hardening', 'Automated QA & CI/CD',
];

const SEEDED_BRIEFS = [
  {
    id: 'CYN-BR-2041', createdAt: '2026-11-25T11:30:00.000Z', organization: 'Aravalli Logistics Tech',
    email: 'engineering@aravallilogistics.in', track: 'AI Automation Systems',
    modules: ['Agentic Workflow Triage', 'ERP / CRM Webhook Sync', 'Real-Time Telemetry Dashboard'],
    scaleTier: 'Growth', budgetBand: '₹4L – ₹10L', launchWindow: '8 Weeks', estimatedWeeks: 7,
    inrEstimate: '₹5.2L – ₹6.8L', status: 'Architecture Review',
    context: 'Automate shipment exception triage and sync invoice reconciliations with Tally/SAP webhooks.',
    layers: {
      frontend: 'Next.js App Router Operations Console with real-time SLA status streams & operator takeover',
      apiOrchestration: 'Typed Node.js/FastAPI Orchestrator with deterministic JSON schemas, retry queues & webhook signing',
      dataPersistence: 'PostgreSQL transactional ledger, Redis idempotency cache & vector index for SOP lookup',
      securityObservability: 'RBAC tenant isolation, PII redaction before AI calls & OpenTelemetry latency dashboards',
    },
    roadmap: [
      { phase: 'Phase 1: Discovery & Audit', detail: 'Audit dispatch failure modes, webhook payloads, and baseline manual SLA times.' },
      { phase: 'Phase 2: Strategy & Blueprinting', detail: 'Finalize typed OpenAPI contracts, database indexes, and AI guardrail policies.' },
      { phase: 'Phase 3: Technical Implementation', detail: 'Implement agent triage workers, ERP webhook adapters, and operator dashboard.' },
      { phase: 'Phase 4: Deployment & Evolution', detail: 'Deploy canary release in ap-south-1 with runbooks and telemetry alerts.' },
    ],
  },
];

const SUPPORT_SAMPLES = [
  { id: 'urgent', label: 'Critical Outage Complaint', text: 'Our billing webhook has been returning 502 errors since 9:15 AM IST and three enterprise clients in Mumbai cannot download GST invoices. We emailed twice with no ETA—please escalate this immediately.' },
  { id: 'mixed', label: 'Mixed UX Feedback', text: 'The new analytics dashboard loads significantly faster than the old version and the INR filters are super helpful. However, exporting monthly ledgers with more than 2,000 rows freezes the browser tab for 10 seconds.' },
  { id: 'praise', label: 'Positive Renewal Note', text: 'Huge thanks to the Cynbit engineering squad! The automated onboarding pipeline cut our manual ops verification from 4 hours to under 12 minutes with zero downtime during our Q3 traffic spike.' },
];

const CODE_SNIPPETS = [
  {
    id: 'rate-limiter', title: 'API Rate Limiter', lang: 'TypeScript',
    code: `const requestLog: Record<string, number[]> = {};
export function rateLimitMiddleware(req: any, res: any, next: any) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  requestLog[ip] = (requestLog[ip] || []).filter(ts => now - ts < 60000);
  if (requestLog[ip].length >= 100) return res.status(429).json({ error: 'Too many requests' });
  requestLog[ip].push(now);
  next();
}`,
  },
  {
    id: 'db-query', title: 'Database Query Optimization', lang: 'PostgreSQL',
    code: `SELECT i.id, i.invoice_code, c.company_name, i.amount_inr
FROM invoices i LEFT JOIN clients c ON c.id = i.client_id
WHERE LOWER(c.city) = 'jaipur'
  AND EXTRACT(YEAR FROM i.settled_at) = 2026
ORDER BY i.settled_at DESC;`,
  },
  {
    id: 'react-state', title: 'React State Bottleneck', lang: 'React / TSX',
    code: `export function TelemetryTable({ rows, search }: { rows: any[]; search: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const visible = rows
    .filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return visible.map((row, idx) => <Row key={idx} data={row} />);
}`,
  },
];

const BITELEVATE_MATCHER_TRACKS = {
  'Full-Stack Web': {
    title: 'Full-Stack Web Development Lab', stack: 'Next.js, Node.js, PostgreSQL & Docker',
    capstone: 'Ship SprintPulse—a multi-tenant SaaS Kanban platform with JWT auth, real-time updates, and CI/CD pipelines.',
    modules: ['Environment, Git Hygiene & Design Systems', 'Typed Backend APIs, RBAC & Validation', 'PostgreSQL Indexing, Redis Caching & Sync', 'Docker Multi-Stage & Production Release'],
  },
  'AI Automation': {
    title: 'Python & AI Systems Lab', stack: 'FastAPI, Vector DBs, Cynbit AI & Eval Harnesses',
    capstone: 'Build an autonomous AI triage workflow with structured JSON schemas, guardrail checks, and RAG retrieval.',
    modules: ['Structured Prompts & JSON Schema Contracts', 'Tool Calling, Backoff & Fallback Routing', 'Vector Indexing & Context Grounding', 'Latency Benchmarking & Production Eval'],
  },
  'Cloud & DevOps': {
    title: 'Cloud Reliability & DevOps Lab', stack: 'AWS/GCP, Docker, GitHub Actions & Telemetry',
    capstone: 'Architect a zero-downtime containerized pipeline with automated health checks, observability, and rollbacks.',
    modules: ['Container Hardening & Multi-Stage Builds', 'Automated CI/CD & Playwright QA Gates', 'Telemetry Dashboards & War Room Triage', 'IAM Least Privilege & Load Profiling'],
  },
};

const CERTIFICATE_REGISTRY = {
  'CYN-BE-2026-1042': { id: 'CYN-BE-2026-1042', recipient: 'Rohan Sharma', track: 'Cloud Reliability & DevOps Lab', completionDate: 'Oct 14, 2026', cohort: 'Jaipur Remote Cohort • Q3 2026', capstoneScore: '97 / 100', prsMerged: 34, status: 'ISO 9001:2015 Verified' },
  'CYN-BE-2026-1089': { id: 'CYN-BE-2026-1089', recipient: 'Ananya Gupta', track: 'Full-Stack Web Development Lab', completionDate: 'Oct 28, 2026', cohort: 'Remote Engineering Lab • Q3 2026', capstoneScore: '96 / 100', prsMerged: 29, status: 'ISO 9001:2015 Verified' },
  'CYN-BE-2026-1120': { id: 'CYN-BE-2026-1120', recipient: 'Farhan Qureshi', track: 'Python & AI Systems Lab', completionDate: 'Nov 11, 2026', cohort: 'Jaipur HQ Lab • Q4 2026', capstoneScore: '98 / 100', prsMerged: 38, status: 'ISO 9001:2015 Verified' },
};

const AGENT_WORKFLOW_NODES = [
  { id: 'trigger', label: 'Webhook Trigger', sub: 'Inbound Ticket / ERP Event', ms: 14, detail: 'Signed payload verified via HMAC-SHA256 & queued.' },
  { id: 'planner', label: 'Cynbit AI Planner', sub: 'Intent + Schema Routing', ms: 185, detail: 'Structured JSON classifies urgency & selects SOP tools.' },
  { id: 'vector', label: 'Vector SOP Lookup', sub: 'Context Grounding', ms: 42, detail: 'Top-3 verified company runbooks retrieved from embeddings.' },
  { id: 'action', label: 'ERP / CRM Action', sub: 'Autonomous Execution', ms: 68, detail: 'Invoice reconciled, Jira/Slack alert dispatched with ETA.' },
  { id: 'audit', label: 'Immutable Audit', sub: 'Cloud Sync + Telemetry', ms: 19, detail: 'Trace ID persisted with latency metrics & human override.' },
];

const BITELEVATE_FAQS = [
  { q: 'Is BitElevate 100% remote and compatible with college schedules?', a: 'Yes. All 60-day sprints are asynchronous with flexible 6–20 hr/week tracks, weekend mentor syncs, and ISO 9001:2015 QR-verified certificates accepted for university credits.' },
  { q: 'What is included in the ₹1,499 sprint registration?', a: 'Direct access to private GitHub production repositories, daily senior PR code reviews, cloud sandbox environments, capstone grading, and official internship certification.' },
  { q: 'Can top BitElevate interns convert to full-time roles at Cynbit?', a: 'Yes! High-performing interns who merge clean PRs and score 90%+ on their capstone are fast-tracked into Cynbit’s Jaipur/Remote PPO interview loop.' },
];

const INITIAL_INVOICES = [
  { id: 'INV-26-401', client: 'Aravalli Logistics Pvt Ltd', city: 'Jaipur', service: 'AI Automation Retainer', amount: 245000, status: 'Paid', dueDate: 'Nov 05, 2026', reminded: false },
  { id: 'INV-26-402', client: 'FinBridge Payments', city: 'Bengaluru', service: 'Cloud Architecture Sprint', amount: 320000, status: 'Overdue', dueDate: 'Nov 12, 2026', reminded: false },
  { id: 'INV-26-403', client: 'Kaveri MedTech Labs', city: 'Hyderabad', service: 'Multi-Tenant Portal Build', amount: 185000, status: 'Paid', dueDate: 'Nov 15, 2026', reminded: false },
  { id: 'INV-26-404', client: 'Vanguard Retail India', city: 'Mumbai', service: 'Webhook & ERP Sync', amount: 140000, status: 'Pending', dueDate: 'Nov 29, 2026', reminded: false },
];

// Section 9: Industry Verticals & Engagement Models
const INDUSTRY_VERTICALS = {
  HealthTech: {
    compliance: ['HIPAA-Aligned', 'DPDP India', 'ISO 9001:2015'],
    useCase: 'AI Clinical Symptom Triage, IoT Rural Vitals Telemetry & Encrypted Patient Portals.',
    stack: ['Next.js 15', 'FastAPI', 'PostgreSQL RLS', 'Cynbit AI Guardrails'],
    caseIds: ['wizhealth', 'pradya'],
  },
  FinTech: {
    compliance: ['PCI-Aligned', 'RBI Audit Trails', 'Zero-Trust IAM'],
    useCase: 'Idempotent Multi-Currency Ledgers, Merchant KYC Automation & Real-Time Fraud Scoring.',
    stack: ['Go / Node.js', 'PostgreSQL', 'Redis Locks', 'OpenTelemetry'],
    caseIds: ['careplus-globalpay', 'sofiasa'],
  },
  Logistics: {
    compliance: ['SOC2 Controls', '99.99% SLA', 'Webhook HMAC'],
    useCase: 'Autonomous Shipment Exception Triage, Tally/SAP Invoice Sync & Fleet Telemetry.',
    stack: ['TypeScript', 'NestJS', 'Vector SOP Search', 'Docker'],
    caseIds: ['sofiasa', 'evento'],
  },
  EdTech: {
    compliance: ['DPDP Student Privacy', 'WCAG 2.1 AA', 'Auto-Scale'],
    useCase: 'Adaptive AI Learning Pathways, Live Code Evaluation Harnesses & QR Credentials.',
    stack: ['React 19', 'Python', 'Vector Embeddings', 'AWS Edge'],
    caseIds: ['econtentprep'],
  },
  'D2C Retail': {
    compliance: ['GST Ready', 'Sub-1s LCP', 'Omnichannel Sync'],
    useCase: 'High-Concurrency Flash-Sale Engines, AI Stylist Concierge & Farm-to-Table QR Provenance.',
    stack: ['Next.js Edge', 'Redis Cache', 'PostgreSQL', 'Cynbit Studio'],
    caseIds: ['urban-wardrobe', 'elitevogue', 'wild-basil'],
  },
};

const ENGAGEMENT_MODELS = [
  { id: 'mvp', name: 'Fixed-Scope MVP Sprint', baseINR: 280000, perEngINR: 45000, timeline: '4–6 Weeks', desc: 'Ideal for validating AI agents, SaaS portals, or internal dashboards with locked deliverables.' },
  { id: 'pod', name: 'Dedicated Engineering Pod', baseINR: 350000, perEngINR: 115000, timeline: 'Monthly Sprint', desc: 'Full-stack, AI, and DevOps architects embedded directly into your Slack & GitHub workflow.' },
  { id: 'retainer', name: 'AI Automation Retainer', baseINR: 220000, perEngINR: 75000, timeline: 'Ongoing SLA', desc: 'Continuous autonomous workflow expansion, LLM evaluation tuning, and 24/7 telemetry.' },
];

// Section 6: Global Cloud Latency & REST API Playground
const CLOUD_REGIONS = [
  { name: 'Jaipur HQ Core', zone: 'ap-south-1a', ms: 12, load: '34%' },
  { name: 'Mumbai Edge', zone: 'ap-south-1b', ms: 18, load: '41%' },
  { name: 'Singapore Mesh', zone: 'ap-southeast-1', ms: 34, load: '28%' },
  { name: 'Frankfurt EU', zone: 'eu-central-1', ms: 46, load: '22%' },
];

const REST_PLAYGROUND_ENDPOINTS = [
  {
    id: 'revio-triage',
    method: 'POST',
    path: '/v1/revio/triage',
    curl: `curl -X POST https://api.cynbit.in/v1/revio/triage -H "Authorization: Bearer cyn_live_99x" -d '{"ticket":"502 webhook error in Mumbai"}'`,
    response: { status: 'triaged', urgency: 'Critical', sentimentScore: 18, assignedPod: 'jaipur-sre-1', etaMinutes: 20 },
  },
  {
    id: 'tenantease-invoices',
    method: 'GET',
    path: '/v1/tenantease/invoices',
    curl: `curl -X GET https://api.cynbit.in/v1/tenantease/invoices?status=active -H "Authorization: Bearer cyn_live_99x"`,
    response: { currency: 'INR', collectionEfficiency: '98.4%', activeTenants: 148, pendingSettlementINR: 140000 },
  },
  {
    id: 'studio-agents',
    method: 'POST',
    path: '/v1/studio/agents',
    curl: `curl -X POST https://api.cynbit.in/v1/studio/agents -H "Authorization: Bearer cyn_live_99x" -d '{"workflow":"erp-reconcile","guardrails":true}'`,
    response: { agentId: 'agt_cyn_8842', schemaValidated: true, fallbackModel: 'cynbit-edge-v2', latencyMs: 142 },
  },
];

// Section 10: Verified Talent Showcase & Mock Interview Questions
const VERIFIED_TALENT_CANDIDATES = [
  { name: 'Arjun Sen', track: 'Python Backend Lab', college: 'SKIT Jaipur', prs: 41, score: '98/100', skills: ['FastAPI', 'PostgreSQL', 'Redis'] },
  { name: 'Simran Kaur', track: 'Full-Stack SaaS Lab', college: 'Poornima University', prs: 37, score: '97/100', skills: ['Next.js 15', 'TypeScript', 'Docker'] },
  { name: 'Farhan Qureshi', track: 'AI & Vector Systems Lab', college: 'Manipal University', prs: 38, score: '98/100', skills: ['RAG Pipelines', 'Python', 'Eval'] },
  { name: 'Shruti Kulkarni', track: 'Frontend Ops Lab', college: 'JECRC Foundation', prs: 35, score: '96/100', skills: ['React 19', 'Tailwind', 'Playwright'] },
];

const MOCK_INTERVIEW_QUESTIONS = {
  'Full-Stack': 'Design an idempotent checkout webhook handler in Next.js/Node.js + PostgreSQL so duplicate payment gateway retries never double-credit a user wallet.',
  'Python': 'A FastAPI endpoint querying 5M invoice rows spiked from 45ms to 2.4s p95 latency. Walk through your indexing, connection pooling, and Redis caching strategy.',
  'AI Systems': 'How do you prevent hallucinations and guarantee valid JSON output when building an autonomous customer support triage agent over internal SOP documents?',
};

// Sections 13 & 14: 10 Live Cynbit AI Tools Hub Definitions
const AI_HUB_TOOLS = [
  // 5 Business & Founders Tools
  { id: 'prd-gen', group: 'Business & Founders', name: 'AI PRD & Technical Spec Generator', placeholder: 'Describe your product idea (e.g., B2B fleet fuel & GST expense platform for Indian logistics operators)...', sample: 'A multi-tenant B2B fleet fuel & GST invoice reconciliation platform for Indian logistics SMEs with WhatsApp receipt OCR and Tally sync.' },
  { id: 'rfp-analyzer', group: 'Business & Founders', name: 'AI RFP & Client Brief Analyzer', placeholder: 'Paste a raw client brief or RFP requirement...', sample: 'Client wants an AI customer support portal integrated with Shopify and Zoho CRM within 6 weeks, supporting Hindi/English voice notes and 99.9% uptime.' },
  { id: 'seo-growth', group: 'Business & Founders', name: 'AI Technical SEO & Growth Optimizer', placeholder: 'Enter product name, target audience, and primary keywords...', sample: 'TenantEase — automated GST rent invoicing & property management SaaS for commercial landlords in Jaipur, Bengaluru, and Mumbai.' },
  { id: 'workflow-finder', group: 'Business & Founders', name: 'AI Workflow Automation Finder', placeholder: 'Describe repetitive manual operations in your team...', sample: 'Our ops team spends 5 hours daily downloading PDF purchase orders from emails, checking stock in Excel, and manually creating ERP entries.' },
  { id: 'meeting-sum', group: 'Business & Founders', name: 'AI Discovery Meeting Summarizer', placeholder: 'Paste rough discovery call notes...', sample: 'Spoke with CTO at Kaveri MedTech. Need patient triage MVP by Jan 15. Budget 6L INR. Blocker: legacy HL7 API docs pending from vendor by Friday.' },
  // 5 Developers & BitElevate Tools
  { id: 'resume-ats', group: 'Developers & BitElevate', name: 'AI Resume & ATS Architecture Optimizer', placeholder: 'Paste your resume summary/projects and target role (e.g., Backend SDE-1)...', sample: 'Target: Backend SDE-1. Built e-commerce app using Node.js and MongoDB. Implemented login and cart features. Looking for internship or junior role.' },
  { id: 'sql-architect', group: 'Developers & BitElevate', name: 'AI PostgreSQL & Database Schema Architect', placeholder: 'Describe entities & relationships in plain English...', sample: 'Multi-tenant SaaS with organizations, users with roles (admin/member), projects, tasks with status/priority, and immutable audit logs.' },
  { id: 'pr-reviewer', group: 'Developers & BitElevate', name: 'AI Senior Mentor PR Reviewer', placeholder: 'Paste a code diff or function for senior architectural review...', sample: `app.post('/api/transfer', async (req, res) => {\n  const { fromId, toId, amount } = req.body;\n  await db.query('UPDATE wallets SET bal = bal - $1 WHERE id = $2', [amount, fromId]);\n  await db.query('UPDATE wallets SET bal = bal + $1 WHERE id = $2', [amount, toId]);\n  res.json({ ok: true });\n});` },
  { id: 'bug-debugger', group: 'Developers & BitElevate', name: 'AI Stack-Trace & Bug Debugger', placeholder: 'Paste a frontend, backend, or Python error trace...', sample: `psycopg2.OperationalError: FATAL: remaining connection slots are reserved for non-replication superuser connections at asyncpg.connect() in FastAPI worker.` },
  { id: 'regex-zod', group: 'Developers & BitElevate', name: 'AI Regex, Cron & API Contract Generator', placeholder: 'Describe the validation pattern, cron schedule, or TypeScript/Zod contract needed...', sample: 'Indian GSTIN validation regex + cron schedule for every weekday at 9:30 AM IST + Zod schema for invoice webhook payload.' },
];

/* ============================================================================
   3. BRAND LOGO, CINEMATIC INTRO, CANVAS, ORBITALS & INLINE SVG VISUALS
   ============================================================================ */
function CynbitLogo({ className = 'h-9 w-auto', showSub = false }) {
  return (
    <svg viewBox="0 0 180 62" className={`${className} cynbit-logo-hover`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Cynbit Technologies">
      <path
        d="M54 11C34 5 11 13 11 29C11 45 35 53 56 44C73 37 86 22 103 14C124 4 156 10 156 29C156 47 125 53 105 42C97 38 92 33 88 29"
        stroke="#056368"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cynbit-infinity-path"
      />
      <path
        d="M54 11C34 5 11 13 11 29C11 45 35 53 56 44C73 37 86 22 103 14C124 4 156 10 156 29C156 47 125 53 105 42C97 38 92 33 88 29"
        stroke="#5EEAD4"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cynbit-infinity-glow"
      />
      <text x="27" y="36" fill="#056368" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="22" letterSpacing="0.5">YN</text>
      <text x="103" y="36" fill="#056368" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="22" letterSpacing="0.5">BIT</text>
      {showSub && (
        <text x="84" y="57" textAnchor="middle" fill="#056368" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="4.2">
          TECHNOLOGIES
        </text>
      )}
    </svg>
  );
}

function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState('enter');
  const [step, setStep] = useState(0);
  const lines = [
    'BOOTING CYNBIT ARCHITECTURAL CORE...',
    'SYNCING CYNBIT AI ENGINE & TELEMETRY...',
    'WELCOME TO CYNBIT TECHNOLOGIES • JAIPUR HQ',
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 650);
    const t2 = setTimeout(() => setStep(2), 1300);
    const t3 = setTimeout(() => setPhase('exit'), 1950);
    const t4 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#070D19] text-white flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-700 ease-out ${phase === 'exit' ? 'opacity-0 scale-105 blur-md pointer-events-none' : 'opacity-100 scale-100'}`}>
      <div className="absolute w-[480px] h-[480px] rounded-full bg-[#056368]/25 blur-[110px] animate-aurora-drift pointer-events-none" />
      <div className="relative flex flex-col items-center space-y-6 max-w-md text-center z-10">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-400 border-r-[#056368] animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border border-dashed border-teal-300/40 animate-spin-reverse" />
          <div className="w-16 h-16 rounded-2xl bg-[#056368]/25 border border-teal-400/40 flex items-center justify-center shadow-[0_0_60px_rgba(20,184,166,0.45)] animate-glow-breathe">
            <Cpu className="w-8 h-8 text-teal-300" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight animate-word-pop">
            CYNBIT <span className="text-teal-400">TECHNOLOGIES</span>
          </div>
          <div key={step} className="font-mono text-xs text-teal-300 tracking-wider h-5 animate-word-pop">{lines[step]}</div>
        </div>
        <div className="w-60 h-1.5 rounded-full bg-slate-800/90 overflow-hidden p-[1px]">
          <div className="h-full rounded-full bg-gradient-to-r from-[#056368] via-teal-400 to-[#5EEAD4] transition-all duration-700 ease-out relative overflow-hidden" style={{ width: `${((step + 1) / lines.length) * 100}%` }}>
            <div className="absolute inset-0 animate-shimmer-bar" />
          </div>
        </div>
        <button type="button" onClick={onComplete} className="text-[11px] font-mono text-slate-400 hover:text-teal-300 underline underline-offset-4 transition">
          Skip Intro →
        </button>
      </div>
    </div>
  );
}

// Section 11: 60fps Interactive Neural Constellation Canvas behind Hero
function HeroConstellationCanvas({ disabled = false, darkMode = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const pointer = { x: -9999, y: -9999 };
    const nodes = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      nodes.length = 0;
      const count = Math.min(34, Math.max(16, Math.floor(canvas.width / 38)));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          r: 1.6 + Math.random() * 1.4,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => { pointer.x = -9999; pointer.y = -9999; };

    window.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dotColor = darkMode ? 'rgba(94, 234, 212, 0.42)' : 'rgba(5, 99, 104, 0.28)';
      const lineBase = darkMode ? '94, 234, 212' : '5, 99, 104';

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 0.1) {
          n.x += (dx / dist) * 1.1;
          n.y += (dy / dist) * 1.1;
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < 125) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(${lineBase}, ${(1 - d / 125) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [disabled, darkMode]);

  if (disabled) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />;
}

// Section 2: Scroll-Triggered Animated Metric Counter
function AnimatedCounter({ value, reducedMotion = false }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const match = String(value).match(/^([^0-9.-]*)([0-9,.]+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const [, prefix, numStr, suffix] = match;
    const hasComma = numStr.includes(',');
    const decimals = (numStr.split('.')[1] || '').length;
    const target = parseFloat(numStr.replace(/,/g, ''));
    if (Number.isNaN(target)) { setDisplay(value); return; }

    let started = false;
    let rafId = 0;

    const runCount = () => {
      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = target * eased;
        const formatted = decimals > 0
          ? current.toFixed(decimals)
          : hasComma
            ? Math.round(current).toLocaleString('en-US')
            : String(Math.round(current));
        setDisplay(`${prefix}${formatted}${suffix}`);
        if (t < 1) rafId = requestAnimationFrame(step);
        else setDisplay(value);
      };
      rafId = requestAnimationFrame(step);
    };

    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && !started) {
        started = true;
        runCount();
        obs.disconnect();
      }
    }, { threshold: 0.25 });
    obs.observe(el);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [value, reducedMotion]);

  return <span ref={ref}>{display}</span>;
}

// Section 2: Mouse-Tracking Aurora Spotlight Wrapper for Dark Sections
function AuroraDarkSection({ children, className = '' }) {
  const [coords, setCoords] = useState({ x: 240, y: 160, active: false });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  };

  return (
    <section
      onMouseMove={handleMove}
      onMouseLeave={() => setCoords((p) => ({ ...p, active: false }))}
      className={`relative overflow-hidden ${className}`}
      style={{ '--mx': `${coords.x}px`, '--my': `${coords.y}px` }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-0"
        style={{
          opacity: coords.active ? 1 : 0.35,
          background: 'radial-gradient(520px circle at var(--mx) var(--my), rgba(20, 184, 166, 0.17), transparent 65%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

// Section 4: Draggable "Before vs. After" Comparison Slider
function BeforeAfterComparisonSlider() {
  const [splitPct, setSplitPct] = useState(50);

  return (
    <div className="rounded-[30px] bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">INTERACTIVE ARCHITECTURE BENCHMARK</span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Drag Slider: Legacy Agency Baseline vs. Cynbit 2.0</h3>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#056368] bg-[#F0F9F9] px-3 py-1 rounded-full">Split: {splitPct}%</span>
      </div>

      <div className="relative h-56 sm:h-48 rounded-2xl overflow-hidden border border-slate-200 select-none">
        {/* Right / Base Layer: Cynbit 2.0 Architecture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#056368] to-[#0B1221] text-white p-6 flex flex-col justify-between items-end text-right">
          <span className="px-3 py-1 rounded-full bg-teal-400/20 border border-teal-300/30 text-[10px] font-mono font-bold text-teal-200">CYNBIT 2.0 ARCHITECTURE</span>
          <div className="max-w-xs space-y-1">
            <div className="text-xl sm:text-2xl font-extrabold text-teal-300">0.9s LCP • Live AI Studio</div>
            <p className="text-xs text-teal-100/90">Instant 4-layer AI architectural scoping, 99.99% uptime SLA, and real-time telemetry.</p>
          </div>
        </div>

        {/* Left / Clipped Layer: Legacy Agency Baseline */}
        <div
          className="absolute inset-0 bg-slate-100 text-slate-800 p-6 flex flex-col justify-between items-start text-left"
          style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
        >
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-mono font-bold">LEGACY AGENCY BASELINE</span>
          <div className="max-w-xs space-y-1">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-700">4.2s LCP • Static Forms</div>
            <p className="text-xs text-slate-500">Unstructured email forms, 5-day manual quotes, and zero live engineering telemetry.</p>
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none"
          style={{ left: `${splitPct}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#056368] shadow-lg border border-slate-200 flex items-center justify-center font-mono text-xs font-extrabold">
            ↔
          </div>
        </div>

        <input
          type="range"
          min={8}
          max={92}
          value={splitPct}
          onChange={(e) => setSplitPct(Number(e.target.value))}
          aria-label="Compare Legacy Baseline and Cynbit 2.0 Architecture"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
      </div>
    </div>
  );
}

// Section 5: Live Visual SVG System Architecture Diagram inside AI Scope Studio
function LiveArchitectureDiagramSVG({ track, modulesCount }) {
  const shortTrack = track.includes('AI') ? 'Cynbit AI Core' : track.includes('Platform') ? 'SaaS Mesh Core' : 'R&D Lab Core';
  return (
    <div className="rounded-2xl bg-[#0B1221] text-white p-4 border border-slate-800">
      <div className="flex items-center justify-between text-[10px] font-mono text-teal-300 mb-2">
        <span>LIVE TOPOLOGY • {modulesCount} ACTIVE MODULES</span>
        <span>ap-south-1 • ZERO-CLS</span>
      </div>
      <svg viewBox="0 0 600 118" className="w-full h-auto select-none">
        <defs>
          <linearGradient id="cynLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        {/* Connecting Animated Lines */}
        <line x1="115" y1="58" x2="165" y2="58" stroke="url(#cynLineGrad)" strokeWidth="2.5" strokeDasharray="5 4" />
        <line x1="275" y1="58" x2="325" y2="58" stroke="url(#cynLineGrad)" strokeWidth="2.5" strokeDasharray="5 4" />
        <line x1="445" y1="58" x2="490" y2="58" stroke="url(#cynLineGrad)" strokeWidth="2.5" strokeDasharray="5 4" />

        {/* Node 1: Edge CDN */}
        <rect x="8" y="24" width="107" height="68" rx="14" fill="#111B30" stroke="#1E293B" strokeWidth="1.5" />
        <text x="61" y="51" textAnchor="middle" fill="#5EEAD4" fontSize="10" fontWeight="800">EDGE CDN</text>
        <text x="61" y="69" textAnchor="middle" fill="#94A3B8" fontSize="8.5">Next.js 15 UI</text>

        {/* Node 2: API Gateway */}
        <rect x="165" y="24" width="110" height="68" rx="14" fill="#111B30" stroke="#056368" strokeWidth="1.8" />
        <text x="220" y="51" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="800">API GATEWAY</text>
        <text x="220" y="69" textAnchor="middle" fill="#5EEAD4" fontSize="8.5">{modulesCount} Modules Wired</text>

        {/* Node 3: Cynbit AI + DB */}
        <rect x="325" y="18" width="120" height="80" rx="16" fill="#056368" stroke="#5EEAD4" strokeWidth="1.8" />
        <text x="385" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800">{shortTrack}</text>
        <text x="385" y="66" textAnchor="middle" fill="#CCFBF1" fontSize="8.5">Postgres + Redis</text>
        <text x="385" y="81" textAnchor="middle" fill="#5EEAD4" fontSize="8">RLS &amp; Guardrails</text>

        {/* Node 4: Telemetry */}
        <rect x="490" y="24" width="102" height="68" rx="14" fill="#111B30" stroke="#1E293B" strokeWidth="1.5" />
        <text x="541" y="51" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="800">TELEMETRY</text>
        <text x="541" y="69" textAnchor="middle" fill="#94A3B8" fontSize="8.5">99.99% SLA</text>
      </svg>
    </div>
  );
}

function HeroOrbitalVisual() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative h-[360px] sm:h-[420px] flex items-center justify-center select-none"
      style={{ perspective: '1000px' }}
    >
      <div className="absolute w-[335px] h-[335px] sm:w-[385px] sm:h-[385px] rounded-full border border-[#056368]/15 animate-sonar-1 pointer-events-none" />
      <div className="absolute w-[335px] h-[335px] sm:w-[385px] sm:h-[385px] rounded-full border border-[#14B8A6]/15 animate-sonar-2 pointer-events-none" />

      <div
        className="relative w-[275px] h-[275px] sm:w-[325px] sm:h-[325px] rounded-full bg-gradient-to-br from-white via-[#F4FAFA] to-[#E4F4F4] shadow-[0_36px_95px_-20px_rgba(5,99,104,0.32)] border border-[#056368]/15 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#056368]/10 via-transparent to-[#14B8A6]/15 animate-glow-breathe pointer-events-none" />

        <div className="absolute inset-2 rounded-full border-[2.5px] border-transparent border-t-[#056368] border-r-[#14B8A6]/80 animate-spin-slow">
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#14B8A6] shadow-[0_0_18px_4px_rgba(20,184,166,0.7)]" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#056368]/70 shadow-[0_0_10px_#056368]" />
        </div>

        <div className="absolute inset-4 rounded-full border border-[#14B8A6]/35 animate-gyro-orbit pointer-events-none" />

        <div className="absolute inset-7 rounded-full border border-dashed border-[#056368]/35 animate-spin-reverse">
          <span className="absolute bottom-2 right-5 w-2.5 h-2.5 rounded-full bg-[#056368] shadow-[0_0_12px_#056368]" />
        </div>

        <div className="absolute inset-14 rounded-full border border-[#14B8A6]/30 animate-glow-breathe" />

        <div
          className="relative z-10 w-32 h-32 rounded-3xl bg-white/95 backdrop-blur-md border border-[#056368]/20 shadow-[0_18px_45px_-8px_rgba(5,99,104,0.34)] flex flex-col items-center justify-center p-2.5 transition-all duration-500 hover:scale-110 hover:shadow-[0_24px_55px_-8px_rgba(20,184,166,0.45)]"
          style={{ transform: 'translateZ(26px)' }}
        >
          <CynbitLogo className="h-9 w-auto" />
          <span className="text-[8px] font-mono font-extrabold text-[#056368] tracking-widest mt-1">CYNBIT-CORE</span>
        </div>

        <div
          className="absolute -top-4 -right-2 sm:-right-12 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.2)] p-3.5 animate-float-elastic z-20"
          style={{ transform: 'translateZ(42px)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#056368] text-white flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(5,99,104,0.35)]">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] font-extrabold tracking-wider text-slate-900 uppercase">
                <span>Automation</span>
                <span className="text-[#056368] font-mono">95%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
                <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-[#056368] via-[#14B8A6] to-[#056368] relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer-bar" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute -bottom-4 -left-2 sm:-left-12 w-52 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_22px_55px_-12px_rgba(15,23,42,0.18)] p-3.5 animate-float-reverse z-20"
          style={{ transform: 'translateZ(36px)' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div>
              <div className="text-[10px] font-extrabold tracking-wider text-slate-900 uppercase">RUNTIME</div>
              <div className="text-[10px] text-[#056368] font-bold">Active now • 100+ Systems</div>
            </div>
          </div>
        </div>

        <div
          className="hidden sm:flex absolute -bottom-2 -right-4 rounded-full bg-[#0B1221] text-white px-3.5 py-1.5 text-[10px] font-mono font-bold shadow-xl border border-teal-400/25 items-center gap-1.5 animate-float-slow z-20"
          style={{ transform: 'translateZ(32px)' }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>99.99% SLA</span>
        </div>
      </div>
    </div>
  );
}

function ModuleOrbitalVisual({ centerTitle, centerSub, topTag, topLabel, bottomTag, bottomLabel, bigStat, icon: Icon = Cpu, reducedMotion = false }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative h-[310px] sm:h-[350px] flex items-center justify-center select-none"
      style={{ perspective: '950px' }}
    >
      <div className="absolute w-[290px] h-[290px] rounded-full border border-[#056368]/15 animate-sonar-1 pointer-events-none" />
      <div className="absolute w-[290px] h-[290px] rounded-full border border-[#14B8A6]/15 animate-sonar-2 pointer-events-none" />

      <div
        className="relative w-[245px] h-[245px] sm:w-[280px] sm:h-[280px] rounded-full bg-gradient-to-br from-white via-[#F4FAFA] to-[#E6F5F5] shadow-[0_32px_85px_-18px_rgba(5,99,104,0.28)] border border-[#056368]/15 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#056368] border-r-[#14B8A6]/75 animate-spin-slow">
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#14B8A6] shadow-[0_0_16px_3px_rgba(20,184,166,0.65)]" />
        </div>
        <div className="absolute inset-4 rounded-full border border-[#14B8A6]/30 animate-gyro-orbit pointer-events-none" />
        <div className="absolute inset-7 rounded-full border border-dashed border-[#056368]/35 animate-spin-reverse">
          <span className="absolute top-3 left-4 w-2 h-2 rounded-full bg-[#056368] shadow-[0_0_10px_#056368]" />
        </div>
        <div
          className="relative z-10 w-36 h-36 rounded-full bg-white/95 border border-[#056368]/15 flex flex-col items-center justify-center text-center p-3 shadow-inner transition-transform duration-500 hover:scale-108"
          style={{ transform: 'translateZ(22px)' }}
        >
          {bigStat ? (
            <>
              <div className="text-4xl font-extrabold text-[#056368]"><AnimatedCounter value={bigStat} reducedMotion={reducedMotion} /></div>
              <div className="text-[9px] font-extrabold tracking-widest uppercase text-slate-400 mt-1">{centerTitle}</div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-[#056368]/10 text-[#056368] flex items-center justify-center mb-1.5 animate-glow-breathe">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#056368]">{centerTitle}</div>
              {centerSub && <div className="text-[9px] text-slate-400 font-semibold mt-0.5">{centerSub}</div>}
            </>
          )}
        </div>
        {topLabel && (
          <div
            className="absolute -top-3 -right-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl px-3.5 py-2.5 animate-float-elastic z-20"
            style={{ transform: 'translateZ(36px)' }}
          >
            <div className="text-[9px] font-extrabold uppercase tracking-wider text-[#056368]">{topTag}</div>
            <div className="text-xs font-extrabold text-slate-900 mt-0.5">{topLabel}</div>
          </div>
        )}
        {bottomLabel && (
          <div
            className="absolute -bottom-3 -left-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl px-3.5 py-2.5 flex items-center gap-2.5 animate-float-reverse z-20"
            style={{ transform: 'translateZ(32px)' }}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{bottomTag}</div>
              <div className="text-xs font-extrabold text-[#056368]">{bottomLabel}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TealSentimentGaugeSVG({ score }) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const r = 50;
  const c = Math.PI * r;
  const offset = c - (clamped / 100) * c;
  const color = clamped >= 70 ? '#056368' : clamped >= 40 ? '#D97706' : '#DC2626';
  return (
    <svg viewBox="0 0 140 84" className="w-36 shrink-0">
      <path d="M 20 70 A 50 50 0 0 1 120 70" fill="none" stroke="#E2E8F0" strokeWidth="10" strokeLinecap="round" />
      <path d="M 20 70 A 50 50 0 0 1 120 70" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-700" />
      <text x="70" y="61" textAnchor="middle" fill="#0F172A" fontSize="22" fontWeight="800">{clamped}%</text>
      <text x="70" y="76" textAnchor="middle" fill="#64748B" fontSize="8.5" fontWeight="700">SENTIMENT SCORE</text>
    </svg>
  );
}

function TealSkillRadarSVG({ scores, compact = false }) {
  const cx = 130; const cy = 120; const maxR = 76;
  const axes = [
    { label: 'Latency', val: scores?.latency ?? 88, angle: -90 },
    { label: 'Security', val: scores?.security ?? 92, angle: 0 },
    { label: 'Scalability', val: scores?.scalability ?? 90, angle: 90 },
    { label: 'Maintainability', val: scores?.maintainability ?? 94, angle: 180 },
  ];
  const pt = (val, deg) => {
    const rad = (deg * Math.PI) / 180;
    const radLen = (Math.max(10, Math.min(100, val)) / 100) * maxR;
    return [cx + radLen * Math.cos(rad), cy + radLen * Math.sin(rad)];
  };
  return (
    <svg viewBox="0 0 260 240" className={`w-full ${compact ? 'max-w-[205px]' : 'max-w-[250px]'} mx-auto select-none`}>
      {[25, 50, 75, 100].map((ring) => (
        <polygon key={ring} points={axes.map((a) => pt(ring, a.angle).join(',')).join(' ')} fill={ring === 100 ? '#F8FAFB' : 'none'} stroke="#CBD5E1" strokeWidth="1" />
      ))}
      {axes.map((a) => {
        const [x2, y2] = pt(100, a.angle);
        return <line key={a.label} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#CBD5E1" strokeWidth="1" />;
      })}
      <polygon points={axes.map((a) => pt(a.val, a.angle).join(',')).join(' ')} fill="rgba(5,99,104,0.18)" stroke="#056368" strokeWidth="2.5" className="transition-all duration-500" />
      {axes.map((a) => {
        const [px, py] = pt(a.val, a.angle);
        const [lx, ly] = pt(124, a.angle);
        return (
          <g key={a.label}>
            <circle cx={px} cy={py} r="4.5" fill="#056368" stroke="#FFFFFF" strokeWidth="2" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#1E293B" fontSize="9.5" fontWeight="700">{a.label} ({a.val})</text>
          </g>
        );
      })}
    </svg>
  );
}

function DeterministicQRSVG({ seed }) {
  const hash = seed.split('').reduce((acc, ch, i) => acc + ch.charCodeAt(0) * (i + 19), 0);
  const cells = [];
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      const finder = (r < 3 && c < 3) || (r < 3 && c >= 8) || (r >= 8 && c < 3);
      const filled = finder
        ? (r === 0 || r === 2 || c === 0 || c === 2 || r === 10 || c === 10 || r === 8 || c === 8 || (r === 1 && c === 1) || (r === 1 && c === 9) || (r === 9 && c === 1))
        : (hash + r * 29 + c * 13 + r * c * 7) % 3 !== 0;
      if (filled) cells.push(<rect key={`${r}-${c}`} x={c * 8 + 6} y={r * 8 + 6} width="6.8" height="6.8" rx="1.2" fill="#0B1221" />);
    }
  }
  return <div className="p-2 rounded-xl bg-white border border-slate-200 inline-block shrink-0"><svg viewBox="0 0 100 100" className="w-20 h-20">{cells}</svg></div>;
}

/* ============================================================================
   4. DEDICATED SUB-WORKSPACES (AI TOOLS HUB 10, ENTERPRISE PLAYGROUNDS, CAMPUS)
   ============================================================================ */
// Sections 13 & 14: Cynbit AI Tools Hub (5 Business & Founders + 5 Developers & BitElevate)
function CynbitAiToolsHub({ logApi, showToast, handleCopyText, soundOn }) {
  const [selectedToolId, setSelectedToolId] = useState(AI_HUB_TOOLS[0].id);
  const [toolInput, setToolInput] = useState(AI_HUB_TOOLS[0].sample);
  const [toolLoading, setToolLoading] = useState(false);
  const [toolResult, setToolResult] = useState(
    '### Architectural Specification & Action Plan\n- **Core Objective:** Structured high-throughput workflow powered by Cynbit AI & PostgreSQL RLS.\n- **Recommended APIs:** `POST /v1/ingest`, `POST /v1/triage/evaluate`, `GET /v1/telemetry/audit`.\n- **Security & Guardrails:** Deterministic JSON schema validation, PII redaction, and idempotency keys.\n- **Next Milestone:** Ship validated MVP sprint in 4 weeks with automated Playwright CI checks.'
  );

  const activeTool = useMemo(() => AI_HUB_TOOLS.find((t) => t.id === selectedToolId) || AI_HUB_TOOLS[0], [selectedToolId]);

  const handleSelectTool = (tool) => {
    setSelectedToolId(tool.id);
    setToolInput(tool.sample);
    playTactileTone(soundOn, 'click');
  };

  const handleRunTool = async (e) => {
    e.preventDefault();
    if (!toolInput.trim() || toolLoading) return;
    setToolLoading(true);
    const t0 = performance.now();
    const res = await callCynbitAI({
      prompt: `Tool: ${activeTool.name} (${activeTool.group})\nInput:\n${toolInput}`,
      systemInstruction: `You are Cynbit AI inside Cynbit Technologies' ${activeTool.name}. Produce a crisp, actionable, well-structured engineering or business specification with bullet points, concrete schemas/metrics, and next steps. Never mention Google or Gemini.`,
    });
    const ms = Math.round(performance.now() - t0);
    const output = res.ok && res.data
      ? res.data
      : `### ${activeTool.name} — Cynbit AI Output\n- **Primary Insight:** Processed your input through Cynbit Neural Core guardrails.\n- **Structured Blueprint:**\n  1. **Architecture / Strategy:** Modular schema-first design with automated validation and sub-30ms edge caching.\n  2. **Execution Targets:** Break into 2-week milestones with automated test coverage and telemetry alerts.\n  3. **Risk Mitigation:** Enforce rate limiting, idempotency keys, and role-based access control.`;
    setToolResult(output);
    setToolLoading(false);
    playTactileTone(soundOn, 'success');
    logApi('AI', `/api/cynbit/ai-tools/${activeTool.id}`, 200, { tool: activeTool.name, engine: res.engine }, ms);
    showToast(`${activeTool.name} generated!`);
  };

  const handleDownloadMd = () => {
    const md = `# ${activeTool.name}\n**Category:** ${activeTool.group}\n**Generated by:** Cynbit Technologies AI Hub\n\n## Input\n${toolInput}\n\n## Output\n${toolResult}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cynbit-${activeTool.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported Cynbit-${activeTool.id}.md`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">CYNBIT AI TOOLS HUB • 10 LIVE UTILITIES</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A]">
          Founder &amp; Developer <span className="italic text-[#056368]">AI Workspace.</span>
        </h1>
        <p className="text-sm text-slate-600">5 specialized AI tools for Business &amp; Founders and 5 engineering tools for Developers &amp; BitElevate interns—powered by Cynbit AI with instant Markdown export.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: 10 Categorized Tools */}
        <div className="lg:col-span-4 space-y-5">
          {['Business & Founders', 'Developers & BitElevate'].map((grp) => (
            <div key={grp} className="rounded-3xl bg-white border border-slate-200 p-4 space-y-2 shadow-xs">
              <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">{grp} (5)</div>
              {AI_HUB_TOOLS.filter((t) => t.group === grp).map((tool, idx) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleSelectTool(tool)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center justify-between gap-2 ${selectedToolId === tool.id ? 'bg-[#056368] text-white shadow-sm' : 'hover:bg-[#F0F9F9] text-slate-700'}`}
                >
                  <span><span className="font-mono opacity-70 mr-1.5">0{idx + 1}.</span>{tool.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Right Interactive Runner */}
        <div className="lg:col-span-8 space-y-5">
          <form onSubmit={handleRunTool} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">{activeTool.group}</span>
                <h2 className="text-xl font-extrabold text-slate-900">{activeTool.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setToolInput(activeTool.sample)}
                className="px-3.5 py-1.5 rounded-full bg-[#F0F9F9] text-[#056368] text-xs font-extrabold"
              >
                Load Sample Prompt
              </button>
            </div>
            <textarea
              required
              rows={5}
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              placeholder={activeTool.placeholder}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 font-mono text-xs text-slate-800 focus:outline-none focus:border-[#056368]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={toolLoading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold uppercase tracking-wider disabled:opacity-60"
              >
                {toolLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing...</> : <><Sparkles className="w-4 h-4" /> Run {activeTool.name}</>}
              </button>
            </div>
          </form>

          <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#056368]">Cynbit AI Structured Output</div>
              <div className="flex gap-2">
                <button type="button" onClick={() => handleCopyText(toolResult, 'AI output copied!')} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button type="button" onClick={handleDownloadMd} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F0F9F9] text-[#056368] border border-[#056368]/20 text-xs font-bold">
                  <Download className="w-3.5 h-3.5" /> Export .md
                </button>
              </div>
            </div>
            <div className="rounded-2xl bg-[#F7FAFA] border border-slate-200/80 p-5 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-medium">
              {toolResult}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Sections 6, 8 & 12: Global Cloud Monitor, REST API Playground, Readiness Grader & Executive Brief Exporter
function EnterprisePlaygroundsSection({ logApi, showToast, handleCopyText, soundOn }) {
  const [selectedEndpointId, setSelectedEndpointId] = useState(REST_PLAYGROUND_ENDPOINTS[0].id);
  const [apiResponsePayload, setApiResponsePayload] = useState(REST_PLAYGROUND_ENDPOINTS[0].response);
  const [apiLastMs, setApiLastMs] = useState(14);
  const [apiTraceId, setApiTraceId] = useState('trc_cyn_9041a');

  // Section 12: Instant Website & AI Readiness Grader
  const [graderUrl, setGraderUrl] = useState('https://acme-logistics.in');
  const [graderResult, setGraderResult] = useState({
    score: 74,
    grade: 'B+ Growth Ready',
    recs: [
      'Deploy edge-cached Next.js routes to cut LCP from 2.8s to <0.9s across Indian tier-2 networks.',
      'Introduce a deterministic Cynbit AI support triage webhook to automate 68% of repetitive L1 tickets.',
      'Enforce JSON-LD schema markup & Core Web Vitals telemetry for +35% organic search visibility.',
    ],
  });

  // Section 8: Custom Executive Brief Exporter
  const [selectedOfferings, setSelectedOfferings] = useState(['AI Automation & Agents', 'Custom SaaS Engineering', 'Cynbit Studio']);

  const activeEndpoint = useMemo(
    () => REST_PLAYGROUND_ENDPOINTS.find((e) => e.id === selectedEndpointId) || REST_PLAYGROUND_ENDPOINTS[0],
    [selectedEndpointId]
  );

  const handleFireRestRequest = () => {
    const ms = Math.floor(11 + Math.random() * 24);
    const trace = `trc_cyn_${Math.floor(1000 + Math.random() * 8999)}x`;
    setApiLastMs(ms);
    setApiTraceId(trace);
    setApiResponsePayload({ ...activeEndpoint.response, traceId: trace, timestamp: new Date().toISOString() });
    playTactileTone(soundOn, 'success');
    logApi(activeEndpoint.method, activeEndpoint.path, 200, { traceId: trace, ...activeEndpoint.response }, ms);
    showToast(`${activeEndpoint.method} ${activeEndpoint.path} -> 200 OK (${ms}ms)`);
  };

  const handleGradeUrl = (e) => {
    e.preventDefault();
    if (!graderUrl.trim()) return;
    const hash = graderUrl.trim().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = 64 + (hash % 29);
    setGraderResult({
      score,
      grade: score >= 82 ? 'A- Enterprise Optimized' : 'B+ High Automation Upside',
      recs: [
        `Optimize ${graderUrl.trim()} asset delivery & hydration to achieve <0.9s LCP and 0.01 CLS.`,
        'Embed autonomous Cynbit AI lead & support triage agents with RBAC and audit logging.',
        'Connect ERP/CRM webhooks via idempotent queues to eliminate manual data reconciliation.',
      ],
    });
    playTactileTone(soundOn, 'success');
    logApi('POST', '/api/cynbit/readiness-grader', 200, { url: graderUrl.trim(), score }, 28);
    showToast(`Readiness Score for ${graderUrl.trim()}: ${score}/100`);
  };

  const handleExportExecutiveBrief = () => {
    if (!selectedOfferings.length) {
      showToast('Select at least one Cynbit offering first');
      return;
    }
    const md = `# Cynbit Technologies — Custom Executive Brief\n- **Headquarters:** ${CYNBIT_HQ}\n- **Contact:** ${CYNBIT_EMAIL} | ${CYNBIT_PHONES[0]}\n- **Compliance:** ISO 9001:2015 Certified • Zero-Trust Cloud\n\n## Selected Strategic Offerings (${selectedOfferings.length})\n${selectedOfferings.map((o, i) => `${i + 1}. **${o}** — Architected for 99.99% uptime SLA and rapid ROI.`).join('\n')}\n\n## Recommended Next Step\nSchedule a 30-minute Discovery & Architecture Blueprinting session with our Jaipur HQ leadership.`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cynbit-Executive-Brief.md';
    a.click();
    URL.revokeObjectURL(url);
    playTactileTone(soundOn, 'success');
    showToast('Downloaded Cynbit-Executive-Brief.md!');
  };

  return (
    <section className="space-y-8">
      {/* Live Global Cloud Status & Latency Monitor */}
      <div className="rounded-[32px] bg-[#0B1221] text-white p-6 sm:p-8 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">GLOBAL INFRASTRUCTURE TELEMETRY</span>
            <h3 className="text-xl sm:text-2xl font-extrabold mt-0.5">Live Global Cloud Status &amp; Edge Latency Monitor</h3>
          </div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-extrabold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 99.99% Operational
          </span>
        </div>

        {/* 24-Segment Uptime Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>24-HOUR EDGE HEARTBEAT</span>
            <span className="text-emerald-400">0 INCIDENTS • 100% HEALTHY</span>
          </div>
          <div className="grid grid-cols-24 gap-1 h-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-emerald-400/85 hover:bg-teal-300 transition" title={`Hour ${i + 1}: 99.99% Uptime`} />
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CLOUD_REGIONS.map((reg) => (
            <div key={reg.name} className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-white">{reg.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{reg.zone} • Load {reg.load}</div>
              </div>
              <div className="text-lg font-mono font-extrabold text-teal-400">{reg.ms}ms</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive REST API Playground */}
      <div className="rounded-[32px] bg-white border border-slate-200 p-6 sm:p-8 grid lg:grid-cols-12 gap-6 shadow-sm">
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">DEVELOPER PLAYGROUND</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Interactive REST API Playground</h3>
            <p className="text-xs text-slate-500 mt-1">Select a Cynbit production endpoint, fire a simulated request with trace logging, or copy ready-to-run cURL.</p>
          </div>
          <div className="space-y-2">
            {REST_PLAYGROUND_ENDPOINTS.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => { setSelectedEndpointId(ep.id); setApiResponsePayload(ep.response); }}
                className={`w-full text-left px-4 py-3 rounded-2xl border font-mono text-xs flex items-center justify-between transition ${selectedEndpointId === ep.id ? 'bg-[#F0F9F9] border-[#056368] text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
              >
                <span><strong className="text-[#056368] mr-2">{ep.method}</strong>{ep.path}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#056368]" />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleFireRestRequest} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#056368] text-white text-xs font-extrabold">
              <Play className="w-3.5 h-3.5" /> Send Request
            </button>
            <button type="button" onClick={() => handleCopyText(activeEndpoint.curl, 'cURL command copied!')} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">
              <Copy className="w-3.5 h-3.5" /> Copy cURL
            </button>
          </div>
        </div>
        <div className="lg:col-span-7 rounded-2xl bg-[#0B1221] text-slate-200 p-5 font-mono text-xs space-y-3 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 text-[11px]">
            <span className="text-emerald-400 font-bold">HTTP 200 OK • {apiLastMs}ms</span>
            <span className="text-teal-300">Trace: {apiTraceId}</span>
          </div>
          <div className="text-[10px] text-slate-400 break-all">$ {activeEndpoint.curl}</div>
          <pre className="text-[11px] text-teal-200 overflow-x-auto bg-white/[0.03] p-3.5 rounded-xl border border-white/10">
            {JSON.stringify(apiResponsePayload, null, 2)}
          </pre>
        </div>
      </div>

      {/* Lead Magnets: Instant Website & AI Readiness Grader + Custom Executive Brief Exporter */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">INSTANT DIAGNOSTIC</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Website &amp; AI Readiness Grader</h3>
          </div>
          <form onSubmit={handleGradeUrl} className="flex gap-2">
            <input required value={graderUrl} onChange={(e) => setGraderUrl(e.target.value)} placeholder="https://yourcompany.com" className="flex-1 rounded-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold" />
            <button type="submit" className="px-5 py-2.5 rounded-full bg-[#056368] text-white text-xs font-extrabold shrink-0">Grade URL</button>
          </form>
          <div className="rounded-2xl bg-[#F7FAFA] border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700">Digital Maturity Score</span>
              <span className="px-3 py-1 rounded-full bg-[#056368] text-white text-xs font-extrabold">{graderResult.score} / 100 • {graderResult.grade}</span>
            </div>
            <div className="space-y-1.5">
              {graderResult.recs.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#056368] shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-[32px] bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">BOARDROOM PACKET</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Custom Executive Brief Exporter</h3>
              <p className="text-xs text-slate-500 mt-1">Select Cynbit offerings to compile an executive Markdown brief for stakeholders.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['AI Automation & Agents', 'Custom SaaS Engineering', 'Cynbit Studio', 'TenantEase', 'Revio AI', 'BitElevate'].map((item) => {
                const active = selectedOfferings.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSelectedOfferings((p) => active ? p.filter((x) => x !== item) : [...p, item])}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold border transition ${active ? 'bg-[#056368] border-[#056368] text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    {active ? '✓ ' : '+ '}{item}
                  </button>
                );
              })}
            </div>
          </div>
          <button type="button" onClick={handleExportExecutiveBrief} className="w-full py-3.5 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Cynbit-Executive-Brief.md ({selectedOfferings.length})
          </button>
        </div>
      </div>
    </section>
  );
}

// Sections 7 & 10: 60-Day GitHub Heatmap, Mock Interview Simulator, Verified Talent Showcase, NOC Generator & Ambassador Calculator
function BitElevateSuiteExtras({ logApi, showToast, currency, soundOn }) {
  // 60-Day GitHub Contribution Heatmap (Deterministic 60 cells)
  const heatmapCells = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ((i * 7 + 3) % 4) + 1),
    []
  );

  // AI Mock Technical Interview Simulator
  const [interviewTrack, setInterviewTrack] = useState('Full-Stack');
  const [interviewAnswer, setInterviewAnswer] = useState('Use an idempotency_key unique column in PostgreSQL inside a database transaction (BEGIN ... COMMIT) so duplicate webhook retries return 200 immediately without double-crediting.');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState({
    score: '91 / 100',
    verdict: 'Strong architectural instinct! Using a database unique constraint + atomic transaction prevents race conditions under concurrent retries.',
    tip: 'Also mention row-level locking (SELECT ... FOR UPDATE) on the wallet row and returning the cached receipt payload.',
  });

  // Instant University NOC & Offer Letter Generator
  const [nocForm, setNocForm] = useState({ name: 'Aarav Sharma', university: 'SKIT Jaipur', roll: '22ESKCS042', track: 'Full-Stack Web Development Lab' });

  // Campus Ambassador Referral Earnings Calculator
  const [referrals, setReferrals] = useState(11);

  const handleEvaluateInterview = async (e) => {
    e.preventDefault();
    if (!interviewAnswer.trim() || interviewLoading) return;
    setInterviewLoading(true);
    const t0 = performance.now();
    const res = await callCynbitAI({
      prompt: `Track: ${interviewTrack}\nQuestion: ${MOCK_INTERVIEW_QUESTIONS[interviewTrack]}\nCandidate Answer: ${interviewAnswer}`,
      systemInstruction: 'Evaluate this candidate answer like a senior Cynbit architect. Return JSON with score (e.g. "88 / 100"), verdict (2 sentences), and tip (1 concrete improvement).',
      responseSchema: {
        type: 'OBJECT',
        properties: { score: { type: 'STRING' }, verdict: { type: 'STRING' }, tip: { type: 'STRING' } },
      },
    });
    const ms = Math.round(performance.now() - t0);
    if (res.ok && res.data?.score) {
      setInterviewFeedback(res.data);
    } else {
      setInterviewFeedback({
        score: '89 / 100',
        verdict: 'Solid systems reasoning covering data integrity and failure handling.',
        tip: 'Include concrete p95 latency metrics and automated regression test coverage in your explanation.',
      });
    }
    setInterviewLoading(false);
    playTactileTone(soundOn, 'success');
    logApi('AI', '/api/cynbit/bitelevate/mock-interview', 200, { track: interviewTrack }, ms);
    showToast('Mock Technical Interview scored!');
  };

  const handleDownloadNOC = (e) => {
    e.preventDefault();
    if (!nocForm.name.trim()) return;
    const safeName = nocForm.name.trim().replace(/\s+/g, '-');
    const txt = `====================================================================
CYNBIT TECHNOLOGIES — OFFICIAL BITELEVATE INTERNSHIP OFFER & NOC
ISO 9001:2015 Certified Engineering Organization
HQ: ${CYNBIT_HQ} | ${CYNBIT_EMAIL}
====================================================================

Date: November 26, 2026
Reference ID: CYN-NOC-2026-${Math.floor(1000 + Math.random() * 8999)}

TO WHOMSOEVER IT MAY CONCERN (UNIVERSITY TRAINING & PLACEMENT CELL),

This is to certify that ${nocForm.name} (Roll No: ${nocForm.roll}) from
${nocForm.university} has been accepted into the BitElevate 60-Day
Remote Software Engineering Internship Program under the
"${nocForm.track}" specialization track.

Program Structure:
- Duration: 60 Days (100% Remote Asynchronous Engineering Sprint)
- Deliverables: Daily GitHub Pull Requests, Automated Testing, Capstone
- Verification: Public QR-Code Verified Certificate upon completion

We kindly request your institution to grant No Objection / Academic
Credit approval for this industry training sprint.

Authorized Signatory,
Director of Engineering Labs — Cynbit Technologies
====================================================================`;
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BitElevate-NOC-${safeName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    playTactileTone(soundOn, 'success');
    logApi('POST', '/api/cynbit/bitelevate/noc-letter', 201, { student: nocForm.name, university: nocForm.university });
    showToast(`Downloaded BitElevate-NOC-${safeName}.txt`);
  };

  const stipendINR = referrals * 250;
  const ambassadorTier = referrals >= 10 ? 'Free Seat + Swag Kit Unlocked' : 'Cynbit Merch Tier';

  return (
    <section className="space-y-8">
      {/* 60-Day GitHub Contribution Heatmap */}
      <div className="rounded-[32px] bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">DAILY SHIPPING CADENCE</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">60-Day GitHub Contribution Heatmap</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <span>Less</span>
            <span className="w-3 h-3 rounded-xs bg-teal-100" />
            <span className="w-3 h-3 rounded-xs bg-teal-300" />
            <span className="w-3 h-3 rounded-xs bg-teal-500" />
            <span className="w-3 h-3 rounded-xs bg-[#056368]" />
            <span>More PRs</span>
          </div>
        </div>
        <div className="grid grid-cols-12 sm:grid-cols-20 md:grid-cols-30 gap-1.5">
          {heatmapCells.map((lvl, idx) => {
            const bg = lvl === 4 ? 'bg-[#056368]' : lvl === 3 ? 'bg-teal-500' : lvl === 2 ? 'bg-teal-300' : 'bg-teal-100';
            return (
              <div
                key={idx}
                className={`h-5 rounded-md ${bg} transition hover:scale-110`}
                title={`Day ${idx + 1}: ${lvl} PR commits merged`}
              />
            );
          })}
        </div>
      </div>

      {/* AI Mock Technical Interview Simulator + Verified Talent Showcase */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-[32px] bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">AI MENTOR EVALUATION</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">AI Mock Technical Interview Simulator</h3>
            </div>
            <div className="flex gap-1">
              {['Full-Stack', 'Python', 'AI Systems'].map((tr) => (
                <button
                  key={tr}
                  type="button"
                  onClick={() => setInterviewTrack(tr)}
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${interviewTrack === tr ? 'bg-[#056368] border-[#056368] text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#F0F9F9] border border-[#056368]/20 p-3.5 text-xs text-slate-800 font-semibold">
            <strong className="text-[#056368]">Prompt:</strong> {MOCK_INTERVIEW_QUESTIONS[interviewTrack]}
          </div>

          <form onSubmit={handleEvaluateInterview} className="space-y-3">
            <textarea
              required
              rows={3}
              value={interviewAnswer}
              onChange={(e) => setInterviewAnswer(e.target.value)}
              placeholder="Write your architecture response..."
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs"
            />
            <button type="submit" disabled={interviewLoading} className="px-5 py-2.5 rounded-full bg-[#056368] text-white text-xs font-extrabold inline-flex items-center gap-1.5">
              {interviewLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Evaluate Architecture Answer
            </button>
          </form>

          <div className="rounded-2xl bg-[#0B1221] text-white p-4 space-y-1.5 text-xs">
            <div className="flex justify-between font-extrabold text-teal-400">
              <span>CYNBIT ARCHITECT SCORE</span>
              <span>{interviewFeedback.score}</span>
            </div>
            <p className="text-slate-200">{interviewFeedback.verdict}</p>
            <p className="text-[11px] text-teal-200"><strong>Tip:</strong> {interviewFeedback.tip}</p>
          </div>
        </div>

        {/* Verified Talent Showcase for Recruiters */}
        <div className="lg:col-span-6 rounded-[32px] bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">RECRUITER PORTAL</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Verified Talent Showcase</h3>
            <p className="text-xs text-slate-500">Top BitElevate graduates with verified GitHub PR histories and capstone scores.</p>
          </div>
          <div className="space-y-3">
            {VERIFIED_TALENT_CANDIDATES.map((cand) => (
              <div key={cand.name} className="rounded-2xl bg-[#F7FAFA] border border-slate-200/80 p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{cand.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold">{cand.college}</span>
                  </div>
                  <div className="text-[11px] text-[#056368] font-bold mt-0.5">{cand.track} • {cand.prs} PRs Merged • Capstone {cand.score}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {cand.skills.map((sk) => <span key={sk} className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">{sk}</span>)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playTactileTone(soundOn, 'success');
                    logApi('POST', '/api/cynbit/recruiter/interview-request', 201, { candidate: cand.name });
                    showToast(`Interview request dispatched for ${cand.name}!`);
                  }}
                  className="px-4 py-2 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-[11px] font-extrabold shrink-0"
                >
                  Request Interview
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instant University NOC Generator + Campus Ambassador Referral Calculator */}
      <div className="grid lg:grid-cols-12 gap-6">
        <form onSubmit={handleDownloadNOC} className="lg:col-span-6 rounded-[32px] bg-white border border-slate-200 p-6 space-y-3.5 shadow-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">ACADEMIC CREDIT COMPLIANCE</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Instant University NOC &amp; Offer Letter Generator</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={nocForm.name} onChange={(e) => setNocForm({ ...nocForm, name: e.target.value })} placeholder="Student Name" className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
            <input required value={nocForm.university} onChange={(e) => setNocForm({ ...nocForm, university: e.target.value })} placeholder="University / College" className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
            <input required value={nocForm.roll} onChange={(e) => setNocForm({ ...nocForm, roll: e.target.value })} placeholder="Roll Number" className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
            <select value={nocForm.track} onChange={(e) => setNocForm({ ...nocForm, track: e.target.value })} className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold">
              {BITELEVATE_LABS.map((l) => <option key={l.id}>{l.title}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-[#056368] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download BitElevate-NOC-{nocForm.name.trim().replace(/\s+/g, '-') || 'Student'}.txt
          </button>
        </form>

        <div className="lg:col-span-6 rounded-[32px] bg-[#0B1221] text-white p-6 flex flex-col justify-between space-y-4 border border-slate-800 shadow-xl">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">CAMPUS AMBASSADOR PROGRAM</span>
            <h3 className="text-xl font-extrabold">Campus Ambassador Referral Earnings Calculator</h3>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Student Cohort Referrals</span>
                <strong className="text-teal-300 font-mono">{referrals} Students</strong>
              </div>
              <input type="range" min={1} max={25} value={referrals} onChange={(e) => setReferrals(Number(e.target.value))} className="w-full accent-[#14B8A6]" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-4">
              <div className="text-[10px] font-bold uppercase text-slate-400">ESTIMATED STIPEND</div>
              <div className="text-2xl font-extrabold text-teal-400 mt-1">{formatMoney(stipendINR, currency)}</div>
            </div>
            <div className="rounded-2xl bg-[#056368] p-4">
              <div className="text-[10px] font-bold uppercase text-teal-100">REWARD TIER</div>
              <div className="text-sm font-extrabold text-white mt-1">{ambassadorTier}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   5. MAIN APPLICATION COMPONENT
   ============================================================================ */
export default function App() {
  // Shell & Navigation States
  const [showIntro, setShowIntro] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePage, setActivePage] = useState('home');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [ariaOpen, setAriaOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Global Preferences (Section 4 Dark Mode, Section 5 Currency, Section 11 Sound & Reduced Motion)
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [soundOn, setSoundOn] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Modals & Drawers
  const [serviceDrawer, setServiceDrawer] = useState(null);
  const [pathDrawerOpen, setPathDrawerOpen] = useState(false);
  const [applyRole, setApplyRole] = useState(null);
  const [activeCaseModal, setActiveCaseModal] = useState(null);
  const [caseModalOps, setCaseModalOps] = useState(2500);
  const [activeBlogModal, setActiveBlogModal] = useState(null);
  const [blogModalProgress, setBlogModalProgress] = useState(0);
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [shortlistDrawerOpen, setShortlistDrawerOpen] = useState(false);
  const [shortlist, setShortlist] = useState([
    { id: 'wizhealth', type: 'Case Study', title: 'AI Diagnostic Triage: Enhancing Medical Efficiency.', page: 'cases' },
  ]);

  // Section 7: Developer CLI Terminal & Muteable Social Proof Ticker
  const [cliOpen, setCliOpen] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState([
    { type: 'sys', text: 'CYNBIT ARCHITECT CLI v2.6 — Type "help" for available commands.' },
  ]);
  const [tickerMuted, setTickerMuted] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);

  // Interactive Page States
  const [heroWordIdx, setHeroWordIdx] = useState(0);
  const [spotlightReviewIdx, setSpotlightReviewIdx] = useState(0);
  const [activeDiaryModal, setActiveDiaryModal] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activePhase, setActivePhase] = useState(3);
  const [auditFilter, setAuditFilter] = useState('All');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [activeLabId, setActiveLabId] = useState('fullstack');
  const [openFaq, setOpenFaq] = useState(0);
  const [blogCat, setBlogCat] = useState('ALL INSIGHTS');
  const [blogSearch, setBlogSearch] = useState('');
  const [blogPage, setBlogPage] = useState(1);
  const [demoProduct, setDemoProduct] = useState('STUDIO');
  const [revioBranch, setRevioBranch] = useState('Jaipur HQ');
  const [hoveredBarMonth, setHoveredBarMonth] = useState('DEC');
  const [careerDept, setCareerDept] = useState('All');
  const [careerFilter, setCareerFilter] = useState('All');
  const [appsDrawerOpen, setAppsDrawerOpen] = useState(false);
  const [diaries, setDiaries] = useState(INITIAL_DIARIES);
  const [diaryForm, setDiaryForm] = useState({ name: '', role: '', title: '', story: '' });

  // Section 4: BitElevate Checkout & Referral Flow
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');
  const [referralCode, setReferralCode] = useState('');
  const [referralApplied, setReferralApplied] = useState(false);

  // Section 8: Discovery Call Calendar & IST Slot Scheduler
  const [callDate, setCallDate] = useState('2026-11-30');
  const [callSlot, setCallSlot] = useState('11:00 AM IST');
  const [confirmedCall, setConfirmedCall] = useState(null);

  // Section 9: Industry Verticals & Engagement Model Comparator
  const [activeIndustry, setActiveIndustry] = useState('HealthTech');
  const [podSize, setPodSize] = useState(4);

  // Cloud Persistence & AI Scope Studio State
  const [user, setUser] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState(db ? 'Connecting Cloud...' : 'Local Session Sync');
  const [briefs, setBriefs] = useState(SEEDED_BRIEFS);
  const [activeBrief, setActiveBrief] = useState(SEEDED_BRIEFS[0]);
  const [scopeTrack, setScopeTrack] = useState(SCOPE_TRACKS[0].id);
  const [scopeModules, setScopeModules] = useState(['Agentic Workflow Triage', 'ERP / CRM Webhook Sync', 'Real-Time Telemetry Dashboard']);
  const [scopeScale, setScopeScale] = useState('Growth');
  const [scopeBudget, setScopeBudget] = useState('₹4L – ₹10L');
  const [scopeWindow, setScopeWindow] = useState('8 Weeks');
  const [scopeOrg, setScopeOrg] = useState('Aravalli Logistics Tech');
  const [scopeEmail, setScopeEmail] = useState('engineering@aravallilogistics.in');
  const [scopeContext, setScopeContext] = useState('');
  const [scopeLoading, setScopeLoading] = useState(false);

  // Live Capability Sandboxes
  const [sandboxTab, setSandboxTab] = useState('triage');
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [invoiceFilter, setInvoiceFilter] = useState('All');
  const [roiTickets, setRoiTickets] = useState(4500);
  const [roiMins, setRoiMins] = useState(14);
  const [triageText, setTriageText] = useState(SUPPORT_SAMPLES[0].text);
  const [triageTone, setTriageTone] = useState('Executive');
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageOutput, setTriageOutput] = useState({
    score: 18,
    urgency: 'Critical',
    issues: ['Billing webhook 502 errors', 'Enterprise GST invoice block', 'Unanswered escalation'],
    reply: 'I sincerely apologize for the disruption to your Mumbai enterprise operations. I have escalated the 502 webhook failure to our senior Jaipur engineers and initiated manual GST invoice sync—expect an official ETA within 20 minutes.',
  });
  const [selectedSnippetId, setSelectedSnippetId] = useState(CODE_SNIPPETS[0].id);
  const [auditCode, setAuditCode] = useState(CODE_SNIPPETS[0].code);
  const [codeAuditLoading, setCodeAuditLoading] = useState(false);
  const [codeAuditResult, setCodeAuditResult] = useState({
    scores: { latency: 82, security: 64, scalability: 52, maintainability: 78 },
    summary: 'In-memory rate limiting leaks memory and fails across horizontal instances.',
    suggestions: ['Move sliding-window counters to Redis ZSET with TTL.', 'Validate x-forwarded-for behind trusted reverse proxy.', 'Return X-RateLimit-Remaining and Retry-After headers.'],
  });
  const [agentStep, setAgentStep] = useState(-1);
  const [agentRunning, setAgentRunning] = useState(false);

  // BitElevate 2.0 Matcher & QR Verifier State
  const [beLevel, setBeLevel] = useState('Intermediate');
  const [beFocus, setBeFocus] = useState('Full-Stack Web');
  const [beHours, setBeHours] = useState('12 hrs');
  const [certQuery, setCertQuery] = useState('CYN-BE-2026-1042');
  const [certResult, setCertResult] = useState(CERTIFICATE_REGISTRY['CYN-BE-2026-1042']);
  const [certMissing, setCertMissing] = useState(false);

  // Telemetry & Applications
  const [applications, setApplications] = useState([
    { id: 'APP-2026-801', role: 'Full Stack Developer Intern', name: 'Aarav Sharma', email: 'aarav@example.com', github: 'https://github.com/aarav', status: 'Under Review' },
  ]);
  const [applyForm, setApplyForm] = useState({ name: '', email: '', github: '', pitch: '' });
  const [apiLogs, setApiLogs] = useState([
    { id: 'evt-1', time: new Date().toLocaleTimeString(), method: 'GET', path: '/api/cynbit/health/web-vitals', status: 200, ms: 16, data: { engine: 'cynbit-neural-core', hq: CYNBIT_HQ, lcp: '0.9s', sla: '99.99%' } },
  ]);
  const [expandedLogId, setExpandedLogId] = useState('evt-1');

  // Aria AI Copilot (Section 5 Voice + Section 12 English/Hinglish)
  const [ariaLang, setAriaLang] = useState('EN');
  const [ariaListening, setAriaListening] = useState(false);
  const [ariaMsgs, setAriaMsgs] = useState([
    { role: 'bot', text: 'Hello! I am Aria, powered by Cynbit AI. Ask me anything about Cynbit’s services, Product Suite (Studio, TenantEase, Revio), BitElevate internships, architecture estimates, or Case Studies.' },
  ]);
  const [ariaInput, setAriaInput] = useState('');
  const [ariaLoading, setAriaLoading] = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  const logApi = useCallback((method, path, status, data, msOverride) => {
    const id = `evt-${Date.now()}-${Math.floor(Math.random() * 999)}`;
    setApiLogs((prev) => [
      { id, time: new Date().toLocaleTimeString(), method, path, status, ms: msOverride ?? Math.floor(14 + Math.random() * 42), data },
      ...prev,
    ].slice(0, 40));
    setExpandedLogId(id);
  }, []);

  const navigate = useCallback((pageId) => {
    playTactileTone(soundOn, 'click');
    if (pageId === 'open-aria') { setAriaOpen(true); return; }
    if (pageId === 'open-inspector') { setInspectorOpen(true); return; }
    if (pageId === 'open-cli') { setCliOpen(true); return; }
    if (pageId === 'open-trust') { setTrustModalOpen(true); return; }
    setActivePage(pageId);
    setOpenDropdown(null);
    setMobileMenu(false);
    setCmdOpen(false);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    logApi('NAV', `/cynbit/${pageId}`, 200, { view: pageId, engine: 'cynbit-router' });
  }, [logApi, soundOn, reducedMotion]);

  // Global keyboard shortcuts (Cmd/Ctrl+K, Escape, and ~ for Developer CLI)
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (e.key === '~' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setCliOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
        setInspectorOpen(false);
        setAriaOpen(false);
        setServiceDrawer(null);
        setPathDrawerOpen(false);
        setApplyRole(null);
        setActiveCaseModal(null);
        setActiveBlogModal(null);
        setActiveDiaryModal(null);
        setAppsDrawerOpen(false);
        setSyllabusModalOpen(false);
        setTrustModalOpen(false);
        setShortlistDrawerOpen(false);
        setCliOpen(false);
        setOpenDropdown(null);
        setMobileMenu(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Rotating Hero Words & Live Social Proof Ticker
  useEffect(() => {
    if (reducedMotion) return;
    const wordTimer = setInterval(() => {
      setHeroWordIdx((i) => (i + 1) % HERO_ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(wordTimer);
  }, [reducedMotion]);

  const LIVE_TICKER_ITEMS = [
    'PR #48 merged in bitelevate-fullstack-lab • 2m ago',
    'AI Scope Blueprint generated for FinTech Bengaluru • 4m ago',
    'QR Certificate CYN-BE-2026-1042 verified • 6m ago',
    'TenantEase GST ledger batch settled (98.4%) • 9m ago',
  ];

  useEffect(() => {
    if (tickerMuted) return;
    const t = setInterval(() => {
      setTickerIdx((i) => (i + 1) % LIVE_TICKER_ITEMS.length);
    }, 4500);
    return () => clearInterval(t);
  }, [tickerMuted, LIVE_TICKER_ITEMS.length]);

  // Kinetic Scroll Progress Bar & Scroll-Triggered Reveal Observer
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [activePage]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.cynbit-page-stage section, .cynbit-page-stage article'));
    if (!nodes.length) return;
    if (reducedMotion) {
      nodes.forEach((el) => {
        el.classList.remove('cynbit-reveal');
        el.classList.add('cynbit-in-view');
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cynbit-in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
    );
    nodes.forEach((el, idx) => {
      el.classList.remove('cynbit-in-view');
      el.classList.add('cynbit-reveal');
      el.style.transitionDelay = `${Math.min(idx * 45, 220)}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activePage, reducedMotion]);

  useEffect(() => {
    if (!auth) { setFirebaseStatus('Local Session Sync'); return; }
    (async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
        else await signInAnonymously(auth);
      } catch { setFirebaseStatus('Local Session Sync'); }
    })();
    return onAuthStateChanged(auth, (u) => { setUser(u); if (u) setFirebaseStatus('Firebase Live Sync'); });
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const unsubB = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'scope_briefs'), (snap) => {
      const rem = snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
      if (rem.length > 0) setBriefs([...rem, ...SEEDED_BRIEFS.filter((s) => !rem.some((r) => r.id === s.id))]);
    }, () => setFirebaseStatus('Local Session Sync'));
    const unsubA = onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'career_applications'), (snap) => {
      const rem = snap.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
      if (rem.length > 0) setApplications(rem);
    }, () => {});
    return () => { unsubB(); unsubA(); };
  }, [user]);

  // Computed Values
  const activeLab = useMemo(() => BITELEVATE_LABS.find((l) => l.id === activeLabId) || BITELEVATE_LABS[0], [activeLabId]);

  const filteredCases = useMemo(() => {
    if (caseFilter === 'ALL') return CASE_STUDIES_DATA;
    return CASE_STUDIES_DATA.filter((c) => c.category === caseFilter);
  }, [caseFilter]);

  const filteredBlogs = useMemo(() => {
    return BLOG_POSTS.filter((b) => {
      const matchCat = blogCat === 'ALL INSIGHTS' || b.category === blogCat;
      const matchQ = !blogSearch.trim() || `${b.title} ${b.excerpt}`.toLowerCase().includes(blogSearch.toLowerCase());
      return matchCat && matchQ;
    });
  }, [blogCat, blogSearch]);

  const paginatedBlogs = useMemo(() => {
    const perPage = 3;
    const start = (blogPage - 1) * perPage;
    return filteredBlogs.slice(start, start + perPage);
  }, [filteredBlogs, blogPage]);

  const totalBlogPages = Math.max(1, Math.ceil(filteredBlogs.length / 3));

  const filteredCareers = useMemo(() => {
    return CAREER_OPENINGS.filter((c) => {
      const matchType = careerFilter === 'All' || c.type === careerFilter;
      const matchDept = careerDept === 'All' || c.dept === careerDept;
      return matchType && matchDept;
    });
  }, [careerFilter, careerDept]);

  const filteredAudit = useMemo(() => {
    if (auditFilter === 'All') return AUDIT_ITEMS;
    return AUDIT_ITEMS.filter((a) => a.categories.includes(auditFilter));
  }, [auditFilter]);

  const matchedBitElevate = useMemo(() => {
    const base = BITELEVATE_MATCHER_TRACKS[beFocus] || BITELEVATE_MATCHER_TRACKS['Full-Stack Web'];
    const weeks = beHours === '20 hrs' ? 4 : beHours === '12 hrs' ? 6 : 8;
    const timeline = [
      `Weeks 1–${Math.max(1, Math.floor(weeks * 0.25))}: ${base.modules[0]}`,
      `Weeks ${Math.max(2, Math.floor(weeks * 0.25) + 1)}–${Math.max(2, Math.floor(weeks * 0.55))}: ${base.modules[1]}`,
      `Weeks ${Math.max(3, Math.floor(weeks * 0.55) + 1)}–${Math.max(3, Math.floor(weeks * 0.8))}: ${base.modules[2]}`,
      `Weeks ${Math.max(4, Math.floor(weeks * 0.8) + 1)}–${weeks}: ${base.modules[3]}`,
    ];
    return { ...base, weeks, timeline };
  }, [beFocus, beHours]);

  const ledgerStats = useMemo(() => {
    const total = invoices.reduce((s, i) => s + i.amount, 0);
    const paid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
    return { total, paid, efficiency: total > 0 ? Math.round((paid / total) * 100) : 100 };
  }, [invoices]);

  const roiSavings = useMemo(() => {
    const hoursSavedMonthly = Math.round((roiTickets * roiMins * 0.68) / 60);
    const annualINR = hoursSavedMonthly * 650 * 12;
    return { hoursSavedMonthly, annualINR };
  }, [roiTickets, roiMins]);

  const toggleShortlist = (item) => {
    playTactileTone(soundOn, 'click');
    setShortlist((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      if (exists) {
        showToast(`Removed "${item.title}" from Shortlist`);
        return prev.filter((x) => x.id !== item.id);
      }
      showToast(`Saved "${item.title}" to Shortlist`);
      return [item, ...prev];
    });
  };

  // Handlers
  const handleCopyText = (text, label) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      playTactileTone(soundOn, 'success');
      showToast(label);
    } catch {
      showToast('Copy failed');
    }
  };

  const handleDownloadBriefMd = (brief) => {
    if (!brief) return;
    const md = `# Cynbit Technologies — Technical Architecture Brief (${brief.id})\n- **Organization:** ${brief.organization}\n- **Track:** ${brief.track} (${brief.scaleTier})\n- **Estimate:** ~${brief.estimatedWeeks} Weeks | ${brief.inrEstimate}\n\n## 4-Layer Architecture\n1. **Frontend:** ${brief.layers?.frontend}\n2. **API & Orchestration:** ${brief.layers?.apiOrchestration}\n3. **Data & Persistence:** ${brief.layers?.dataPersistence}\n4. **Security & Observability:** ${brief.layers?.securityObservability}\n\n## Roadmap\n${(brief.roadmap || []).map((r, i) => `${i + 1}. **${r.phase}:** ${r.detail}`).join('\n')}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brief.id}-Cynbit-Brief.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${brief.id}-Cynbit-Brief.md`);
  };

  const handleExportAuditSummary = () => {
    const md = `# Cynbit Technologies — Full-Stack Telemetry & Audit Report\n**HQ:** ${CYNBIT_HQ}\n**Persistence:** ${firebaseStatus}\n**Captured Events:** ${apiLogs.length}\n\n## Before vs. After Upgrades\n${AUDIT_ITEMS.map((i) => `### ${i.number}. ${i.title}\n- **Before:** ${i.before}\n- **After:** ${i.after}\n`).join('\n')}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Cynbit-Platform-Audit-Summary.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported Cynbit-Platform-Audit-Summary.md!');
  };

  const handleLoadSamplePreset = () => {
    setScopeTrack('AI Automation Systems');
    setScopeModules(['Agentic Workflow Triage', 'ERP / CRM Webhook Sync', 'Real-Time Telemetry Dashboard', 'RBAC & Security Hardening']);
    setScopeScale('Growth');
    setScopeBudget('₹4L – ₹10L');
    setScopeWindow('8 Weeks');
    setScopeOrg('VayuPay FinTech India');
    setScopeEmail('arch@vayupay.in');
    setScopeContext('Automate merchant KYC document exceptions and trigger real-time Slack/CRM escalations.');
    showToast('Sample preset loaded into Cynbit AI Scope Studio!');
  };

  const handleGenerateScopeBrief = async (e) => {
    e.preventDefault();
    if (!scopeOrg.trim()) { showToast('Enter an organization name'); return; }
    setScopeLoading(true);
    const t0 = performance.now();
    const schema = {
      type: 'OBJECT',
      properties: {
        estimatedWeeks: { type: 'INTEGER' },
        inrEstimate: { type: 'STRING' },
        layers: { type: 'OBJECT', properties: { frontend: { type: 'STRING' }, apiOrchestration: { type: 'STRING' }, dataPersistence: { type: 'STRING' }, securityObservability: { type: 'STRING' } } },
        roadmap: { type: 'ARRAY', items: { type: 'OBJECT', properties: { phase: { type: 'STRING' }, detail: { type: 'STRING' } } } },
      },
    };
    const res = await callCynbitAI({
      prompt: `Generate a pragmatic 4-layer technical architecture brief for "${scopeOrg}" at Cynbit Technologies (Jaipur). Track: ${scopeTrack}. Modules: ${scopeModules.join(', ')}. Scale: ${scopeScale}. Budget: ${scopeBudget}. Launch: ${scopeWindow}. Context: ${scopeContext || 'Scalable modernization.'}`,
      systemInstruction: 'You are a Principal Full-Stack Architect at Cynbit Technologies. Return crisp, real-world architecture JSON.',
      responseSchema: schema,
    });
    const ms = Math.round(performance.now() - t0);
    const valid = res.ok && res.data?.layers?.frontend && Array.isArray(res.data?.roadmap);
    const body = valid ? res.data : {
      estimatedWeeks: scopeBudget === '₹10L+' ? 11 : 7,
      inrEstimate: scopeBudget,
      layers: {
        frontend: `Next.js 15 & TypeScript portal for ${scopeOrg} with zero-CLS real-time telemetry`,
        apiOrchestration: `Cynbit AI Orchestrator (${scopeTrack}) with typed JSON validation & webhook retries`,
        dataPersistence: 'PostgreSQL RLS transactional ledger + Redis edge cache',
        securityObservability: 'Zero-Trust RBAC, PII redaction, and automated Playwright CI/CD gates',
      },
      roadmap: [
        { phase: 'Phase 1: Discovery & Audit', detail: `Audit ${scopeOrg} workflows and lock target KPIs.` },
        { phase: 'Phase 2: Architecture Blueprint', detail: 'Finalize typed schemas, security roles, and cloud topology.' },
        { phase: 'Phase 3: Core Implementation', detail: `Deliver ${scopeModules.length} capability modules in weekly milestones.` },
        { phase: 'Phase 4: QA & Production Launch', detail: `Deploy within ${scopeWindow} with 24/7 telemetry alerts.` },
      ],
    };
    const newBrief = {
      id: `CYN-BR-${Math.floor(2100 + Math.random() * 7800)}`,
      createdAt: new Date().toISOString(),
      organization: scopeOrg.trim(),
      email: scopeEmail.trim() || 'client@company.in',
      track: scopeTrack,
      modules: [...scopeModules],
      scaleTier: scopeScale,
      budgetBand: scopeBudget,
      launchWindow: scopeWindow,
      status: 'New Intake',
      ...body,
    };
    if (db && user) {
      try {
        const ref = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'scope_briefs'), newBrief);
        newBrief.firestoreId = ref.id;
      } catch {
        setBriefs((p) => [newBrief, ...p]);
      }
    } else {
      setBriefs((p) => [newBrief, ...p]);
    }
    setActiveBrief(newBrief);
    setScopeLoading(false);
    playTactileTone(soundOn, 'success');
    logApi('AI', '/api/cynbit/scope-blueprint', 201, { id: newBrief.id, org: newBrief.organization, engine: res.engine }, ms);
    showToast(`Cynbit AI Blueprint ${newBrief.id} generated!`);
  };

  const handleRunTriage = async () => {
    if (!triageText.trim()) return;
    setTriageLoading(true);
    const t0 = performance.now();
    const schema = {
      type: 'OBJECT',
      properties: {
        score: { type: 'INTEGER' },
        urgency: { type: 'STRING' },
        issues: { type: 'ARRAY', items: { type: 'STRING' } },
        reply: { type: 'STRING' },
      },
    };
    const res = await callCynbitAI({
      prompt: `Analyze this customer support feedback and craft a ${triageTone} reply:\n"${triageText}"`,
      systemInstruction: 'Return JSON with score (0-100), urgency ("Critical" | "High" | "Moderate" | "Low"), 3 concise issue bullets, and a ready-to-send brand reply from Cynbit Technologies.',
      responseSchema: schema,
    });
    const ms = Math.round(performance.now() - t0);
    const isUrgent = /502|outage|down|error|urgent|freeze/i.test(triageText);
    const isPositive = /thanks|great|faster|helpful|huge/i.test(triageText);
    const parsed = res.ok && typeof res.data?.score === 'number' && res.data?.reply ? res.data : {
      score: isUrgent ? 22 : isPositive ? 92 : 58,
      urgency: isUrgent ? 'Critical' : isPositive ? 'Low' : 'Moderate',
      issues: isUrgent
        ? ['Service disruption detected', 'SLA escalation required', 'Engineering sync initiated']
        : ['Sentiment trend logged', 'Account health updated', 'Follow-up scheduled'],
      reply: isUrgent
        ? `(${triageTone}) We sincerely apologize for the disruption. Our Jaipur engineering squad has prioritized this incident and will share a verified resolution ETA within 20 minutes.`
        : `(${triageTone}) Thank you for sharing your feedback with Cynbit Technologies! We have logged your note with our product team and appreciate your partnership.`,
    };
    setTriageOutput(parsed);
    setTriageLoading(false);
    playTactileTone(soundOn, 'success');
    logApi('AI', '/api/cynbit/sandboxes/support-triage', 200, { tone: triageTone, score: parsed.score, urgency: parsed.urgency, engine: res.engine }, ms);
    showToast('Cynbit AI Sentiment Triage completed!');
  };

  const handleRunCodeAudit = async () => {
    if (!auditCode.trim()) return;
    setCodeAuditLoading(true);
    const t0 = performance.now();
    const sn = CODE_SNIPPETS.find((s) => s.id === selectedSnippetId) || CODE_SNIPPETS[0];
    const schema = {
      type: 'OBJECT',
      properties: {
        scores: { type: 'OBJECT', properties: { latency: { type: 'INTEGER' }, security: { type: 'INTEGER' }, scalability: { type: 'INTEGER' }, maintainability: { type: 'INTEGER' } } },
        summary: { type: 'STRING' },
        suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
      },
    };
    const res = await callCynbitAI({
      prompt: `Perform a production engineering audit on this ${sn.lang} snippet (${sn.title}):\n\n${auditCode}`,
      systemInstruction: 'Return JSON with 0-100 scores for latency, security, scalability, maintainability, a 1-sentence verdict summary, and 3 concrete refactor suggestions.',
      responseSchema: schema,
    });
    const ms = Math.round(performance.now() - t0);
    if (res.ok && res.data?.scores && Array.isArray(res.data?.suggestions)) {
      setCodeAuditResult(res.data);
    } else {
      const fallbacks = {
        'rate-limiter': {
          scores: { latency: 82, security: 64, scalability: 52, maintainability: 78 },
          summary: 'In-memory rate limiting leaks memory and fails across horizontal instances.',
          suggestions: ['Move sliding-window counters to Redis ZSET with TTL.', 'Validate x-forwarded-for behind trusted reverse proxy.', 'Return X-RateLimit-Remaining and Retry-After headers.'],
        },
        'db-query': {
          scores: { latency: 54, security: 88, scalability: 58, maintainability: 80 },
          summary: 'Function calls on WHERE columns prevent B-tree index usage and force full table scans.',
          suggestions: ['Use range filter (settled_at >= 2026-01-01) instead of EXTRACT().', 'Add composite index on (city, settled_at DESC).', 'Use INNER JOIN if client existence is guaranteed.'],
        },
        'react-state': {
          scores: { latency: 48, security: 90, scalability: 55, maintainability: 70 },
          summary: 'Unmemoized JSON.stringify filtering and array index keys cause costly re-renders.',
          suggestions: ['Wrap filter and sort pipeline in useMemo().', 'Use stable unique row.id instead of array idx as React key.', 'Search explicit indexed string fields rather than JSON.stringify().'],
        },
      };
      setCodeAuditResult(fallbacks[selectedSnippetId] || fallbacks['rate-limiter']);
    }
    setCodeAuditLoading(false);
    playTactileTone(soundOn, 'success');
    logApi('AI', '/api/cynbit/sandboxes/code-audit', 200, { snippet: sn.title, engine: res.engine }, ms);
    showToast('Cynbit AI Code Audit complete!');
  };

  const handleRunAgentSimulation = () => {
    if (agentRunning) return;
    setAgentRunning(true);
    setAgentStep(0);
    AGENT_WORKFLOW_NODES.forEach((_, idx) => {
      setTimeout(() => {
        setAgentStep(idx);
        if (idx === AGENT_WORKFLOW_NODES.length - 1) {
          setAgentRunning(false);
          playTactileTone(soundOn, 'success');
          logApi('AI', '/api/cynbit/sandboxes/agent-pipeline', 200, { nodes: 5, status: 'SUCCESS' }, 328);
          showToast('Autonomous Agent workflow completed in 328ms!');
        }
      }, idx * 480);
    });
  };

  const handleVerifyCertificate = (overrideId) => {
    const code = (overrideId !== undefined ? overrideId : certQuery).trim().toUpperCase();
    setCertQuery(code);
    const match = CERTIFICATE_REGISTRY[code];
    if (match) {
      setCertResult(match);
      setCertMissing(false);
      playTactileTone(soundOn, 'success');
      logApi('GET', `/api/cynbit/bitelevate/certificates/${code}`, 200, { verified: true, recipient: match.recipient, track: match.track }, 16);
      showToast(`Verified credential ${code}`);
    } else {
      setCertResult(null);
      setCertMissing(true);
      logApi('GET', `/api/cynbit/bitelevate/certificates/${code || 'EMPTY'}`, 400, { verified: false }, 12);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyRole) return;
    const entry = {
      id: `APP-2026-${Math.floor(810 + Math.random() * 180)}`,
      role: applyRole.title,
      name: applyForm.name.trim(),
      email: applyForm.email.trim(),
      github: applyForm.github.trim(),
      status: 'Submitted',
    };
    if (db && user) {
      try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'career_applications'), entry);
      } catch {
        setApplications((p) => [entry, ...p]);
      }
    } else {
      setApplications((p) => [entry, ...p]);
    }
    playTactileTone(soundOn, 'success');
    logApi('POST', '/api/cynbit/careers/apply', 201, { id: entry.id, role: entry.role });
    setApplyForm({ name: '', email: '', github: '', pitch: '' });
    setApplyRole(null);
    showToast(`Application ${entry.id} submitted for ${entry.role}!`);
  };

  // Section 5: Voice-Enabled Aria AI Copilot + Section 12 English / Hinglish Mode
  const handleStartAriaVoice = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('Browser SpeechRecognition unavailable — type your question below.');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = ariaLang === 'HINGLISH' ? 'en-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.onstart = () => setAriaListening(true);
      recognition.onend = () => setAriaListening(false);
      recognition.onerror = () => {
        setAriaListening(false);
        showToast('Microphone permission needed or voice unavailable.');
      };
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setAriaInput(transcript);
          showToast(`Captured voice: "${transcript}"`);
        }
      };
      recognition.start();
    } catch {
      setAriaListening(false);
    }
  };

  const handleAriaSubmit = async (preset) => {
    const q = (preset || ariaInput).trim();
    if (!q || ariaLoading) return;
    setAriaMsgs((p) => [...p, { role: 'user', text: q }]);
    setAriaInput('');
    setAriaLoading(true);
    const t0 = performance.now();
    const langInstruction = ariaLang === 'HINGLISH'
      ? 'Respond in natural, friendly Indian Hinglish (mix of English technical terms and conversational Hindi written in Roman script).'
      : 'Respond in crisp, helpful Enterprise English.';
    const res = await callCynbitAI({
      prompt: q,
      systemInstruction: `You are Aria, the official AI assistant of Cynbit Technologies (cynbit.in), headquartered at ${CYNBIT_HQ} (${CYNBIT_EMAIL}, ${CYNBIT_PHONES[0]}).
Cynbit builds autonomous AI agents, custom software, proprietary SaaS products (Cynbit Studio, TenantEase, Revio), 10 AI Tools, and runs BitElevate (60-day remote software engineering internship for ₹1,499 with production GitHub labs and ISO 9001:2015 QR certificates).
${langInstruction}
Never mention Google or Gemini; refer to your underlying intelligence only as Cynbit AI. Be concise, helpful, and structured.`,
    });
    const ms = Math.round(performance.now() - t0);
    const ans = res.ok && res.data
      ? res.data
      : ariaLang === 'HINGLISH'
        ? `Namaste! Main Aria hoon, Cynbit AI se powered (HQ: ${CYNBIT_HQ}). Cynbit autonomous AI agents, custom SaaS apps, Product Suite (Cynbit Studio, TenantEase, Revio), aur 60-day BitElevate remote internship (₹1,499) offer karta hai. Instant architecture estimate ke liye hamara AI Scope Studio try karein!`
        : `I'm Aria, powered by Cynbit AI (HQ: ${CYNBIT_HQ}). Cynbit offers Autonomous AI Agents, Custom SaaS Engineering, our Product Suite (Cynbit Studio, TenantEase, Revio), 10 AI Tools, and the 60-day BitElevate remote internship (₹1,499). Try our AI Scope Studio for an instant 4-layer architecture estimate!`;
    setAriaMsgs((p) => [...p, { role: 'bot', text: ans }]);
    setAriaLoading(false);
    playTactileTone(soundOn, 'success');
    logApi('AI', '/api/cynbit/aria-copilot/chat', 200, { query: q.slice(0, 60), lang: ariaLang, engine: res.engine }, ms);
  };

  // Section 7: Developer CLI Terminal Command Handler
  const handleCliSubmit = (e) => {
    e.preventDefault();
    const raw = cliInput.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();
    setCliInput('');
    if (cmd === 'clear') {
      setCliHistory([]);
      return;
    }
    let reply = `Unknown command "${raw}". Type "help" for valid commands.`;
    if (cmd === 'help') {
      reply = 'Available commands: help | cynbit --stack | ping jaipur | bitelevate --tracks | team --founders | clear';
    } else if (cmd === 'cynbit --stack') {
      reply = 'Stack: Next.js 15 • React 19 • TypeScript • FastAPI / Go • PostgreSQL RLS • Redis • Kubernetes • Cynbit Neural Core';
    } else if (cmd === 'ping jaipur') {
      reply = `PING ap-south-1 (32/115 Pratap Nagar, Jaipur): 64 bytes from 26.8012°N 75.8195°E: icmp_seq=1 ttl=64 time=12.4 ms (99.99% SLA)`;
    } else if (cmd === 'bitelevate --tracks') {
      reply = '6 Labs: [01] Full-Stack SaaS  [02] Python Backend  [03] AI & Vector RAG  [04] Frontend Ops  [05] QA Automation  [06] UI/UX Design Systems';
    } else if (cmd === 'team --founders') {
      reply = 'Leadership: Mohak Saini (Founder & CEO) • Ashutosh Upadhyay (Co-Founder) • Dhawan Nama (Co-Founder & CTO)';
    }
    setCliHistory((prev) => [...prev, { type: 'cmd', text: `$ ${raw}` }, { type: 'out', text: reply }]);
  };

  const cmdItems = [
    { label: 'Home: Cynbit Technologies Overview', group: 'Core', run: () => navigate('home') },
    { label: 'Company: Our Story (2021–2026)', group: 'Company', run: () => navigate('story') },
    { label: 'Company: Meet the Architects', group: 'Company', run: () => navigate('team') },
    { label: 'Company: Careers & Open Roles', group: 'Company', run: () => navigate('careers') },
    { label: 'Expertise: Services Hub', group: 'Expertise', run: () => navigate('services') },
    { label: 'Expertise: Product Suite (Studio, TenantEase, Revio)', group: 'Expertise', run: () => navigate('products') },
    { label: 'Expertise: Case Studies (11 Projects)', group: 'Expertise', run: () => navigate('cases') },
    { label: 'Interactive: Cynbit AI Tools Hub (10 Live Tools)', group: 'AI Tools', run: () => navigate('aitools') },
    { label: 'Interactive: Cynbit AI Scope Studio & Live Sandboxes', group: 'Interactive', run: () => navigate('studio') },
    { label: 'BitElevate: 60-Day Ecosystem, Lab Matcher & QR Verifier', group: 'BitElevate', run: () => navigate('bitelevate') },
    { label: 'BitElevate: Adaptive Learning Paths', group: 'BitElevate', run: () => navigate('paths') },
    { label: 'BitElevate: Student Diaries', group: 'BitElevate', run: () => navigate('diaries') },
    { label: 'Resources: Engineering Blog', group: 'Resources', run: () => navigate('blog') },
    { label: 'Action: Open Aria AI Copilot', group: 'Tools', run: () => navigate('open-aria') },
    { label: 'Action: Open API & Telemetry Inspector', group: 'Tools', run: () => navigate('open-inspector') },
    { label: 'Action: Open Cynbit Architect CLI (~)', group: 'Tools', run: () => navigate('open-cli') },
    { label: 'Action: Security & Compliance Trust Center', group: 'Trust', run: () => navigate('open-trust') },
  ];

  const filteredCmds = cmdItems.filter((i) => !cmdQuery.trim() || i.label.toLowerCase().includes(cmdQuery.toLowerCase()));

  const bitElevateFinalFee = referralApplied ? 1299 : 1499;

  return (
    <div className={`min-h-screen font-sans selection:bg-[#056368] selection:text-white relative overflow-x-clip transition-colors duration-300 ${darkMode ? 'cynbit-dark bg-[#07111A] text-slate-100' : 'bg-[#F7FAFA] text-[#0F172A]'}`}>
      {/* Ambient Drifting Background Light Orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full bg-[#14B8A6]/10 blur-[110px] animate-aurora-drift" />
        <div className="absolute top-[45%] -left-40 w-[420px] h-[420px] rounded-full bg-[#056368]/8 blur-[120px] animate-aurora-drift-reverse" />
      </div>

      {/* Advanced GPU-Accelerated UI & UX Keyframe Animation Engine + Midnight-Teal Dark Mode Overrides */}
      <style>{`
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes gyroOrbit {
          0% { transform: rotateX(62deg) rotateY(0deg) rotateZ(0deg); }
          50% { transform: rotateX(62deg) rotateY(22deg) rotateZ(180deg); }
          100% { transform: rotateX(62deg) rotateY(0deg) rotateZ(360deg); }
        }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(0.6deg); } }
        @keyframes floatElastic {
          0%, 100% { transform: translateY(0px) scale(1); }
          45% { transform: translateY(-11px) scale(1.015); }
          75% { transform: translateY(-3px) scale(0.995); }
        }
        @keyframes floatReverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(10px) rotate(-0.6deg); } }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(16px) scale(0.992); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        @keyframes sonarWave {
          0% { transform: scale(0.86); opacity: 0.55; }
          100% { transform: scale(1.24); opacity: 0; }
        }
        @keyframes glowBreathe {
          0%, 100% { opacity: 0.72; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.045); }
        }
        @keyframes auroraDrift {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-36px, 28px) scale(1.12); }
        }
        @keyframes auroraDriftReverse {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, -32px) scale(1.1); }
        }
        @keyframes shimmerBar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes infinityTrace {
          0% { stroke-dashoffset: 380; opacity: 0.2; }
          50% { stroke-dashoffset: 0; opacity: 0.9; }
          100% { stroke-dashoffset: -380; opacity: 0.2; }
        }
        @keyframes marqueeLeft { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes wordPop {
          0% { opacity: 0; transform: translateY(18px) rotateX(-38deg) scale(0.96); filter: blur(5px); }
          65% { opacity: 1; transform: translateY(-2px) rotateX(6deg) scale(1.01); filter: blur(0px); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg) scale(1); filter: blur(0px); }
        }
        .animate-spin-slow { animation: spinSlow 14s linear infinite; }
        .animate-spin-reverse { animation: spinReverse 20s linear infinite; }
        .animate-gyro-orbit { animation: gyroOrbit 10s linear infinite; }
        .animate-float-slow { animation: floatSlow 4.4s ease-in-out infinite; }
        .animate-float-elastic { animation: floatElastic 4.8s cubic-bezier(0.37, 0, 0.63, 1) infinite; }
        .animate-float-reverse { animation: floatReverse 5.2s ease-in-out infinite; }
        .animate-page-in { animation: pageIn 0.52s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-sonar-1 { animation: sonarWave 3.6s cubic-bezier(0.12, 0.8, 0.22, 1) infinite; }
        .animate-sonar-2 { animation: sonarWave 3.6s cubic-bezier(0.12, 0.8, 0.22, 1) 1.8s infinite; }
        .animate-glow-breathe { animation: glowBreathe 3.4s ease-in-out infinite; }
        .animate-aurora-drift { animation: auroraDrift 14s ease-in-out infinite; }
        .animate-aurora-drift-reverse { animation: auroraDriftReverse 17s ease-in-out infinite; }
        .animate-shimmer-bar {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent);
          animation: shimmerBar 2.2s ease-in-out infinite;
        }
        .animate-marquee-left { animation: marqueeLeft 30s linear infinite; }
        .animate-marquee-left:hover { animation-play-state: paused; }
        .animate-word-pop { animation: wordPop 0.58s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: 50% 80%; }

        .cynbit-infinity-glow {
          stroke-dasharray: 95 285;
          animation: infinityTrace 4.2s ease-in-out infinite;
        }
        .cynbit-logo-hover { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .cynbit-logo-hover:hover { transform: scale(1.05); }

        .cynbit-reveal {
          opacity: 0;
          transform: translateY(24px) scale(0.988);
          filter: blur(3px);
          transition: opacity 0.68s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.68s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.68s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .cynbit-reveal.cynbit-in-view {
          opacity: 1;
          transform: translateY(0px) scale(1);
          filter: blur(0px);
        }

        /* Section 11: Reduced Motion Override */
        .cynbit-reduced-motion *,
        .cynbit-reduced-motion *::before,
        .cynbit-reduced-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        /* Section 4: Midnight-Teal Dark Mode Surface Adaptation */
        .cynbit-dark header {
          background-color: rgba(11, 24, 36, 0.88) !important;
          border-color: rgba(45, 212, 191, 0.16) !important;
        }
        .cynbit-dark footer {
          background-color: #091622 !important;
          border-color: rgba(45, 212, 191, 0.16) !important;
        }
        .cynbit-dark .bg-white,
        .cynbit-dark .bg-white\\/95,
        .cynbit-dark .bg-white\\/90,
        .cynbit-dark .bg-white\\/85,
        .cynbit-dark .bg-white\\/70 {
          background-color: #0E1F2E !important;
        }
        .cynbit-dark .bg-\\[\\#F7FAFA\\],
        .cynbit-dark .bg-slate-50,
        .cynbit-dark .bg-slate-100 {
          background-color: #13283A !important;
        }
        .cynbit-dark .bg-\\[\\#F0F9F9\\] {
          background-color: rgba(20, 184, 166, 0.14) !important;
        }
        .cynbit-dark .border-slate-200,
        .cynbit-dark .border-slate-200\\/80,
        .cynbit-dark .border-slate-100 {
          border-color: rgba(148, 163, 184, 0.18) !important;
        }
        .cynbit-dark .text-slate-900,
        .cynbit-dark .text-\\[\\#0F172A\\],
        .cynbit-dark .text-slate-800 {
          color: #F1F5F9 !important;
        }
        .cynbit-dark .text-slate-700,
        .cynbit-dark .text-slate-600 {
          color: #CBD5E1 !important;
        }
        .cynbit-dark .text-slate-500,
        .cynbit-dark .text-slate-400 {
          color: #94A3B8 !important;
        }

        .cynbit-page-stage button[class*="bg-[#056368]"],
        header button[class*="bg-[#056368]"] {
          position: relative;
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, background-color 0.25s ease;
        }
        .cynbit-page-stage button[class*="bg-[#056368]"]::after,
        header button[class*="bg-[#056368]"]::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 45%;
          height: 200%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.32), transparent);
          transform: skewX(-20deg);
          transition: left 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .cynbit-page-stage button[class*="bg-[#056368]"]:hover::after,
        header button[class*="bg-[#056368]"]:hover::after {
          left: 135%;
        }
        .cynbit-page-stage button[class*="bg-[#056368]"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -8px rgba(5, 99, 104, 0.42);
        }
        .cynbit-page-stage button[class*="bg-[#056368]"]:active {
          transform: translateY(0px) scale(0.97);
        }

        .cynbit-page-stage [class*="rounded-3xl"][class*="bg-white"],
        .cynbit-page-stage [class*="rounded-[30px]"][class*="bg-white"],
        .cynbit-page-stage [class*="rounded-[28px]"][class*="bg-white"] {
          transition: transform 0.36s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.36s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.3s ease;
        }
        .cynbit-page-stage [class*="rounded-3xl"][class*="bg-white"]:hover,
        .cynbit-page-stage [class*="rounded-[30px]"][class*="bg-white"]:hover,
        .cynbit-page-stage [class*="rounded-[28px]"][class*="bg-white"]:hover {
          transform: translateY(-4px);
          box-shadow: 0 22px 44px -16px rgba(5, 99, 104, 0.16);
        }
      `}</style>

      <div className={reducedMotion ? 'cynbit-reduced-motion' : ''}>
        {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

        {/* ==================== STICKY GLASSMORPHIC HEADER ==================== */}
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80">
          {/* Live Kinetic Scroll Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-transparent pointer-events-none z-50">
            <div
              className="h-full bg-gradient-to-r from-[#056368] via-[#14B8A6] to-[#5EEAD4] shadow-[0_0_10px_rgba(20,184,166,0.75)] transition-[width] duration-150 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
            <button type="button" onClick={() => navigate('home')} className="flex items-center gap-2 shrink-0 focus:outline-none">
              <CynbitLogo className="h-7 w-auto" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-700">
              {['company', 'expertise', 'bitelevate'].map((key) => (
                <div key={key} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-full capitalize transition ${openDropdown === key ? 'bg-[#F0F9F9] text-[#056368]' : 'hover:bg-slate-100'}`}
                  >
                    <span>{key === 'bitelevate' ? 'BitElevate' : key}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === key ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === key && (
                    <div className="absolute left-0 top-12 w-72 rounded-3xl bg-white border border-slate-200 shadow-2xl p-2 space-y-1 z-50 animate-page-in">
                      {NAV_DROPDOWNS[key].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => navigate(item.id)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#F0F9F9] text-left transition"
                          >
                            <div className="w-9 h-9 rounded-xl bg-[#F0F9F9] text-[#056368] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-extrabold text-slate-900">{item.title}</div>
                              <div className="text-[11px] text-slate-500 font-normal">{item.sub}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => navigate('blog')} className={`px-3 py-2 rounded-full transition ${activePage === 'blog' ? 'bg-[#F0F9F9] text-[#056368]' : 'hover:bg-slate-100'}`}>Blog</button>
              <button type="button" onClick={() => navigate('contact')} className={`px-3 py-2 rounded-full transition ${activePage === 'contact' ? 'bg-[#F0F9F9] text-[#056368]' : 'hover:bg-slate-100'}`}>Contact</button>
              <button type="button" onClick={() => navigate('aitools')} className={`px-3 py-2 rounded-full transition ${activePage === 'aitools' ? 'bg-[#056368] text-white' : 'bg-[#FBE5C8]/70 text-[#6B3E0B] hover:bg-[#FBE5C8]'}`}>AI Tools (10)</button>
              <button type="button" onClick={() => navigate('studio')} className="ml-0.5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F0F9F9] border border-[#056368]/20 text-[#056368] hover:bg-[#056368] hover:text-white transition">
                <Sparkles className="w-3.5 h-3.5" /> Cynbit AI Labs
              </button>
            </nav>

            {/* Utility Controls: Currency, Dark Mode, Sound, Reduced Motion, Shortlist, Cmd+K, API */}
            <div className="flex items-center gap-1.5">
              {/* Section 5: Multi-Currency Switcher */}
              <div className="hidden sm:flex items-center rounded-full bg-slate-100 p-0.5 text-[10px] font-mono font-extrabold">
                {['INR', 'USD', 'EUR'].map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => { setCurrency(cur); playTactileTone(soundOn, 'click'); }}
                    className={`px-2 py-1 rounded-full transition ${currency === cur ? 'bg-[#056368] text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {cur}
                  </button>
                ))}
              </div>

              {/* Section 11: Sound & Reduced Motion Toggles */}
              <button
                type="button"
                onClick={() => { const next = !soundOn; setSoundOn(next); if (next) playTactileTone(true, 'success'); showToast(next ? 'Tactile UI audio enabled' : 'Tactile UI audio muted'); }}
                className="hidden md:inline-flex p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                title="Toggle Tactile Micro-Sounds"
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5 text-[#056368]" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => { setReducedMotion((m) => !m); showToast(!reducedMotion ? 'Reduced motion enabled' : 'Full motion restored'); }}
                className={`hidden md:inline-flex px-2.5 py-1.5 rounded-full text-[10px] font-mono font-bold transition ${reducedMotion ? 'bg-[#056368] text-white' : 'bg-slate-100 text-slate-600'}`}
                title="Toggle Reduced Motion Accessibility"
              >
                {reducedMotion ? 'RM:ON' : 'RM'}
              </button>

              {/* Section 4: Light / Midnight-Teal Dark Mode Switcher */}
              <button
                type="button"
                onClick={() => { setDarkMode((d) => !d); playTactileTone(soundOn, 'click'); }}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Switch Mint-Light / Midnight-Teal Dark Mode"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-teal-300" /> : <Moon className="w-3.5 h-3.5 text-[#056368]" />}
              </button>

              {/* Section 12: Saved Bookmarks & Shortlist Drawer Trigger */}
              <button
                type="button"
                onClick={() => setShortlistDrawerOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#056368] text-slate-700 text-[11px] font-mono font-bold transition"
                title="Saved Shortlist"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#056368]" />
                <span>{shortlist.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-mono font-bold transition"
                title="Quick Navigation (Cmd/Ctrl+K)"
              >
                <Command className="w-3.5 h-3.5" /> <span>K</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectorOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-[#056368] text-slate-700 text-[11px] font-mono font-bold transition"
              >
                <Activity className="w-3.5 h-3.5 text-[#056368]" />
                <span className="hidden sm:inline">API</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px]">{apiLogs.length}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('contact')}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold transition"
              >
                Start Project <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => setMobileMenu(!mobileMenu)} className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-700">
                {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="xl:hidden border-t border-slate-200 bg-white p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold animate-page-in">
              {[
                ['home', 'Home'], ['story', 'Our Story'], ['team', 'Our Team'], ['careers', 'Careers'],
                ['impact', 'Social Impact'], ['services', 'Services Hub'], ['products', 'Product Suite'], ['cases', 'Case Studies (11)'],
                ['bitelevate', 'BitElevate'], ['paths', 'Learning Paths'], ['diaries', 'Student Diaries'], ['blog', 'Blog'],
                ['contact', 'Contact'], ['studio', 'Cynbit AI Labs'], ['aitools', 'AI Tools Hub (10)'],
              ].map(([id, lbl]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigate(id)}
                  className={`px-3.5 py-2.5 rounded-xl text-left ${activePage === id ? 'bg-[#056368] text-white' : 'bg-slate-50 text-slate-700'}`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* ==================== MAIN PAGE CONTENT ==================== */}
        <div key={activePage} className="animate-page-in cynbit-page-stage" onClick={() => openDropdown && setOpenDropdown(null)}>
          {/* ==================== 1. HOME PAGE ==================== */}
          {activePage === 'home' && (
            <div className="space-y-20 pb-20">
              <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
                {/* Section 11: 60fps Interactive Neural Constellation Canvas */}
                <HeroConstellationCanvas disabled={reducedMotion} darkMode={darkMode} />

                <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-[#6B3E0B]" /> THE OPTIMISTIC ARCHITECT • JAIPUR HQ
                      </div>
                      {/* Section 7: Muteable Live Ecosystem Social Proof Ticker */}
                      {!tickerMuted && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-[10px] font-mono font-bold text-[#056368] shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>{LIVE_TICKER_ITEMS[tickerIdx]}</span>
                          <button type="button" onClick={() => setTickerMuted(true)} className="text-slate-400 hover:text-slate-700 ml-1" title="Mute Live Activity Ticker">×</button>
                        </div>
                      )}
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.06]">
                      Architecting<br />the future with<br />
                      <span key={heroWordIdx} className="inline-block italic text-[#056368] animate-word-pop">
                        {HERO_ROTATING_WORDS[heroWordIdx]}
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                      Cynbit Technologies architects the digital future with <span className="text-[#056368] font-semibold">autonomous AI agents</span>, custom software development, and scalable business platforms. Based in Jaipur, Rajasthan, we bridge technical precision and global business growth.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => navigate('contact')}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-sm font-extrabold shadow-lg shadow-[#056368]/20 transition hover:-translate-y-0.5"
                      >
                        <span>Start discovery</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('cases')}
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold shadow-xs transition hover:-translate-y-0.5"
                      >
                        <span>View work</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('studio')}
                        className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#F0F9F9] hover:bg-[#E1F3F3] border border-[#056368]/20 text-[#056368] text-sm font-bold transition hover:-translate-y-0.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Try Cynbit AI Studio</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg border-t border-slate-200/80">
                      <div><div className="text-2xl font-extrabold text-[#056368]"><AnimatedCounter value="100+" reducedMotion={reducedMotion} /></div><div className="text-[11px] font-semibold text-slate-500">Systems Shipped</div></div>
                      <div><div className="text-2xl font-extrabold text-[#0F172A]"><AnimatedCounter value="1,000+" reducedMotion={reducedMotion} /></div><div className="text-[11px] font-semibold text-slate-500">BitElevate Alumni</div></div>
                      <div><div className="text-2xl font-extrabold text-[#056368]"><AnimatedCounter value="99.99%" reducedMotion={reducedMotion} /></div><div className="text-[11px] font-semibold text-slate-500">Cloud Uptime SLA</div></div>
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <HeroOrbitalVisual />
                  </div>
                </div>
              </section>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-20">
                {/* FOUNDATIONAL PILLARS */}
                <section className="space-y-6">
                  <div className="max-w-2xl">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">OUR ECOSYSTEM</span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] mt-1">Foundational pillars.</h2>
                    <p className="text-sm text-slate-600 mt-2">Integrated excellence across AI technology, full-stack software development, and social responsibility.</p>
                  </div>
                  <div className="grid lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-7 rounded-[32px] bg-white border border-slate-200 p-7 space-y-5 shadow-xs hover:shadow-lg transition duration-300">
                      <div className="w-11 h-11 rounded-2xl bg-[#F0F9F9] text-[#056368] flex items-center justify-center"><Cpu className="w-5 h-5" /></div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900">Custom IT infrastructure</h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">Specialized software architecture and secure cloud foundations. We engineer scalable growth engines designed to accelerate technical maturity.</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          ['AI AUTOMATION', 'LLM & AGENTS'],
                          ['SOFTWARE DEV', 'WEB & MOBILE'],
                          ['CLOUD SYSTEMS', 'AWS & AZURE'],
                          ['TECHNICAL SEO', 'SEARCH GROWTH'],
                        ].map(([t, s]) => (
                          <button key={t} type="button" onClick={() => navigate('services')} className="rounded-2xl bg-[#F7FAFA] hover:bg-[#F0F9F9] border border-slate-200/80 p-4 text-left transition hover:-translate-y-0.5">
                            <div className="text-xs font-extrabold text-[#056368]">{t}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{s}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-5 rounded-[32px] bg-[#056368] text-white p-7 flex flex-col justify-between space-y-5 shadow-xl">
                      <div className="space-y-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center"><Layers className="w-5 h-5" /></div>
                        <h3 className="text-2xl font-extrabold">Proprietary SaaS suite</h3>
                        <p className="text-xs sm:text-sm text-teal-100">Bespoke digital ecosystems engineered for specific market challenges and organizational excellence.</p>
                      </div>
                      <div className="space-y-2.5">
                        {[
                          ['CS', 'CYNBIT STUDIO', 'CAREER INTELLIGENCE'],
                          ['RV', 'REVIO', 'AI REVIEW ASSISTANT'],
                          ['TE', 'TENANTEASE', 'PROPERTY ECOSYSTEM'],
                        ].map(([badge, name, sub]) => (
                          <button key={name} type="button" onClick={() => navigate('products')} className="w-full rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 p-3.5 flex items-center gap-3 text-left transition">
                            <span className="w-9 h-9 rounded-full bg-white text-[#056368] font-extrabold text-xs flex items-center justify-center shrink-0">{badge}</span>
                            <div>
                              <div className="text-xs font-extrabold">{name}</div>
                              <div className="text-[10px] text-teal-200">{sub}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-12 rounded-[32px] bg-gradient-to-r from-[#F9F6F0] to-[#F3EFE6] border border-[#D4A373]/30 p-7 grid lg:grid-cols-12 gap-6 items-center">
                      <div className="lg:col-span-6 space-y-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#9B7228] text-white flex items-center justify-center"><Heart className="w-5 h-5" /></div>
                        <h3 className="text-2xl font-extrabold text-slate-900">Human-centric impact</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Beyond code, we invest in human potential. Through our partnership with <strong>Manav Seva Trust</strong>, we provide Computer and IT teaching to rural areas and government schools, bridging the digital divide wherever we can.
                        </p>
                        <button type="button" onClick={() => navigate('impact')} className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#9B7228] hover:underline">
                          Explore Our Mission <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="lg:col-span-6 grid sm:grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                          <div className="text-xs font-extrabold text-[#056368]">BITELEVATE</div>
                          <p className="text-xs text-slate-600 mt-1.5">100% remote software internships with daily GitHub code reviews.</p>
                        </div>
                        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
                          <div className="text-xs font-extrabold text-[#9B7228]">MANAV SEVA</div>
                          <p className="text-xs text-slate-600 mt-1.5">Tech-enabled support for community growth, rural schools, and wellness.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* BITELEVATE DARK SPOTLIGHT CARD WITH MOUSE-TRACKING AURORA */}
                <AuroraDarkSection className="rounded-[36px] bg-gradient-to-br from-[#071525] via-[#0B1D2E] to-[#082B33] text-white p-7 sm:p-10 shadow-2xl border border-slate-800">
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-5">
                      <span className="inline-flex px-3.5 py-1 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold uppercase tracking-widest">REMOTE SOFTWARE INTERNSHIP</span>
                      <h2 className="text-4xl sm:text-5xl font-extrabold">BitElevate<span className="text-teal-400">.</span></h2>
                      <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                        A 60-day remote engineering internship for students and graduates. Clone real production repositories, push git branches, and receive daily pull request reviews from senior engineers.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        {[
                          ['Production Codebases', 'Push code to real GitHub repos with CI/CD and databases.'],
                          ['Daily PR Reviews', 'Line-by-line mentor feedback on architecture and performance.'],
                          ['Verified Credential', 'ISO-standard certificate accepted for college credits.'],
                          ['Direct PPO Track', 'Top performers fast-tracked for paid Cynbit engineering roles.'],
                        ].map(([t, d]) => (
                          <div key={t} className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                            <div className="font-extrabold text-teal-300">{t}</div>
                            <div className="text-slate-300 mt-0.5 text-[11px]">{d}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-5 pt-1">
                        <button type="button" onClick={() => navigate('bitelevate')} className="px-6 py-3 rounded-full bg-white text-[#0B1221] hover:bg-teal-50 text-xs font-extrabold uppercase transition">Explore Program →</button>
                        <div className="flex items-center gap-2"><span className="text-2xl font-extrabold text-teal-400">60 Days</span><span className="text-[10px] uppercase text-slate-400 leading-tight">Remote<br />Sprints</span></div>
                      </div>
                    </div>
                    <div className="lg:col-span-5 rounded-3xl bg-white/[0.04] border border-white/10 p-6 space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-teal-300 font-bold">● Next Cohort 2026</span>
                        <span className="text-slate-400">60 Days • 100% Remote</span>
                      </div>
                      <div>
                        <div className="text-lg font-extrabold">Practical specialization tracks</div>
                        <p className="text-xs text-slate-400">Choose your track and work directly on production-grade systems.</p>
                      </div>
                      <div className="space-y-2.5">
                        {[
                          ['01', 'Full-Stack Web Development', 'Next.js, Node.js & PostgreSQL'],
                          ['02', 'UI/UX Product Design', 'Figma Design Systems & Prototypes'],
                          ['03', 'Python & AI Systems', 'FastAPI, Vector DBs & LLMs'],
                        ].map(([num, title, sub]) => (
                          <button key={num} type="button" onClick={() => navigate('bitelevate')} className="w-full rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/10 p-3.5 flex items-center justify-between text-left transition">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs font-extrabold text-teal-400">{num}</span>
                              <div><div className="text-xs font-extrabold">{title}</div><div className="text-[10px] text-slate-400">{sub}</div></div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-teal-400" />
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                        <span className="text-teal-300 font-bold inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> ISO 9001:2015 Verified</span>
                        <span className="text-slate-400">College Credit Approved</span>
                      </div>
                    </div>
                  </div>
                </AuroraDarkSection>

                {/* THE CYNBIT EDGE */}
                <section className="space-y-6">
                  <div className="max-w-2xl">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">THE CYNBIT EDGE</span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] mt-1">The speed of a startup.<br />The rigor of an enterprise.</h2>
                    <p className="text-sm text-slate-600 mt-2">We combine technical agility with structured execution to deliver outcomes that scale with your ambitions.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: Zap, title: 'Startup speed', desc: 'Rapid execution without bureaucracy.' },
                      { icon: Cpu, title: 'AI-first thinking', desc: 'Systems designed with automation first.' },
                      { icon: Layers, title: 'End-to-end dev', desc: 'Full ownership from design to deploy.' },
                      { icon: Rocket, title: 'ROI engineering', desc: 'We build for business outcomes and scale.' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs hover:shadow-xl hover:-translate-y-1.5 hover:border-[#056368]/40 transition duration-300">
                          <div className="w-11 h-11 rounded-2xl bg-[#F0F9F9] text-[#056368] flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                          <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* DOMAIN MASTERY (AURORA DARK SECTION + ANIMATED COUNTERS) */}
                <AuroraDarkSection className="rounded-[36px] bg-[#0B1221] text-white p-7 sm:p-10 space-y-8 border border-slate-800 shadow-2xl">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-teal-400">DOMAIN MASTERY</span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold mt-1">Architectural mastery<br />across <span className="italic text-teal-400">four domains.</span></h2>
                  </div>
                  <div className="grid lg:grid-cols-12 gap-5 items-stretch">
                    <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
                      {[
                        { icon: Code2, title: 'Software engineering', desc: 'Secure full-stack development and cloud migration foundations.' },
                        { icon: Globe, title: 'Digital marketing & SEO', desc: 'Data-driven ROI engines merging technical SEO with creative precision.' },
                        { icon: Cpu, title: 'AI automation', desc: 'Custom LLMs and autonomous agents designed for cognitive operations.' },
                        { icon: Shield, title: 'Cloud infrastructure', desc: 'Zero-trust deployment across AWS and Azure for global business scale.' },
                      ].map((d) => {
                        const Icon = d.icon;
                        return (
                          <div key={d.title} className="rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 p-6 space-y-3 transition">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-300 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                            <h3 className="text-lg font-extrabold">{d.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{d.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="lg:col-span-4 grid grid-cols-2 gap-3">
                      {[
                        ['98%', 'RETENTION'],
                        ['24/7', 'SUPPORT'],
                        ['3x', 'ROI UPLIFT'],
                        ['6+', 'GLOBAL REACH'],
                      ].map(([val, lbl]) => (
                        <div key={lbl} className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 flex flex-col justify-center items-center text-center">
                          <div className="text-3xl sm:text-4xl font-extrabold text-teal-400"><AnimatedCounter value={val} reducedMotion={reducedMotion} /></div>
                          <div className="text-[10px] font-extrabold tracking-widest text-slate-400 mt-1">{lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AuroraDarkSection>

                {/* Section 9: INTERACTIVE INDUSTRY BLUEPRINT SWITCHER */}
                <section className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">INDUSTRY VERTICALS</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">Domain-Tuned Reference Architectures.</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.keys(INDUSTRY_VERTICALS).map((ind) => (
                        <button
                          key={ind}
                          type="button"
                          onClick={() => setActiveIndustry(ind)}
                          className={`px-4 py-2 rounded-full text-xs font-extrabold border transition ${activeIndustry === ind ? 'bg-[#056368] border-[#056368] text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-[#056368]'}`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[32px] bg-white border border-slate-200 p-7 grid lg:grid-cols-12 gap-6 items-center shadow-xs">
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {INDUSTRY_VERTICALS[activeIndustry].compliance.map((c) => (
                          <span key={c} className="px-3 py-1 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px] font-extrabold">{c}</span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900">{activeIndustry} Engineering Blueprint</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{INDUSTRY_VERTICALS[activeIndustry].useCase}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {INDUSTRY_VERTICALS[activeIndustry].stack.map((st) => (
                          <span key={st} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-mono font-bold text-slate-700">{st}</span>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-5 space-y-2.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">VERIFIED {activeIndustry.toUpperCase()} DEPLOYMENTS</div>
                      {CASE_STUDIES_DATA.filter((cs) => INDUSTRY_VERTICALS[activeIndustry].caseIds.includes(cs.id)).map((cs) => (
                        <button
                          key={cs.id}
                          type="button"
                          onClick={() => { setCaseModalOps(2500); setActiveCaseModal(cs); }}
                          className="w-full rounded-2xl bg-[#F7FAFA] hover:bg-[#F0F9F9] border border-slate-200 p-4 text-left flex items-center justify-between gap-3 transition"
                        >
                          <div>
                            <div className="text-[10px] font-extrabold text-[#056368]">{cs.client}</div>
                            <div className="text-xs font-extrabold text-slate-900 mt-0.5">{cs.title}</div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-[#056368] shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 6-PHASE ARCHITECTURAL LIFECYCLE + ROI SIMULATOR (WITH AURORA SPOTLIGHT) */}
                <AuroraDarkSection className="rounded-[36px] bg-[#0B1221] text-white p-6 sm:p-10 space-y-8 shadow-2xl border border-slate-800">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-teal-400">ARCHITECTURAL LIFECYCLE</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">From Blueprint to Global Scale.</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {LIFECYCLE_PHASES.map((p, idx) => (
                        <button
                          key={p.step}
                          type="button"
                          onClick={() => setActivePhase(idx)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition ${activePhase === idx ? 'bg-[#056368] text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                        >
                          {p.step}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-3">
                      <span className="inline-flex px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-[10px] font-extrabold tracking-widest text-teal-300">
                        PHASE {LIFECYCLE_PHASES[activePhase].step} • {LIFECYCLE_PHASES[activePhase].tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold capitalize">{LIFECYCLE_PHASES[activePhase].title}</h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{LIFECYCLE_PHASES[activePhase].desc}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {LIFECYCLE_PHASES[activePhase].nodes.map((n) => (
                          <span key={n} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-teal-200">{n}</span>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                        <div className="text-[10px] font-bold uppercase text-slate-400">STABILITY TARGET</div>
                        <div className="text-3xl font-extrabold text-teal-400 mt-1">{LIFECYCLE_PHASES[activePhase].stability}</div>
                      </div>
                      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                        <div className="text-[10px] font-bold uppercase text-slate-400">P95 LATENCY</div>
                        <div className="text-3xl font-extrabold text-white mt-1">{LIFECYCLE_PHASES[activePhase].latency}</div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Multi-Currency ROI Simulator */}
                  <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 grid lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-teal-300">
                        <Sliders className="w-4 h-4" /> Interactive Cynbit AI Automation ROI Simulator ({currency})
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs"><span className="text-slate-300">Monthly Tickets / Ops Tasks</span><strong className="text-teal-300">{roiTickets.toLocaleString('en-IN')}</strong></div>
                          <input type="range" min={500} max={20000} step={500} value={roiTickets} onChange={(e) => setRoiTickets(Number(e.target.value))} className="w-full accent-[#14B8A6]" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs"><span className="text-slate-300">Avg. Manual Handle Time</span><strong className="text-teal-300">{roiMins} mins</strong></div>
                          <input type="range" min={4} max={45} step={1} value={roiMins} onChange={(e) => setRoiMins(Number(e.target.value))} className="w-full accent-[#14B8A6]" />
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#056368]/25 border border-teal-400/30 p-4">
                        <div className="text-[10px] font-bold uppercase text-teal-200">HOURS SAVED / MO</div>
                        <div className="text-2xl font-extrabold text-white mt-1">{roiSavings.hoursSavedMonthly.toLocaleString('en-IN')} hrs</div>
                      </div>
                      <div className="rounded-2xl bg-[#056368] p-4">
                        <div className="text-[10px] font-bold uppercase text-teal-100">EST. ANNUAL ROI</div>
                        <div className="text-xl font-extrabold text-white mt-1">{formatMoney(roiSavings.annualINR, currency)}</div>
                      </div>
                    </div>
                  </div>
                </AuroraDarkSection>

                {/* CORE CAPABILITIES QUICK GRID */}
                <section className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">OUR ECOSYSTEM</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">Products, Services &amp; Talent Labs.</h2>
                    </div>
                    <button type="button" onClick={() => navigate('products')} className="text-xs font-extrabold text-[#056368] inline-flex items-center gap-1">Explore Product Suite <ArrowRight className="w-4 h-4" /></button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    {PRODUCTS_SUITE.map((p) => (
                      <div key={p.id} className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#056368]/40 transition">
                        <div className="space-y-2.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#056368] bg-[#F0F9F9] px-2.5 py-1 rounded-full">{p.tag}</span>
                          <h3 className="text-xl font-extrabold text-slate-900">{p.name}</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                          {p.metrics.map((m) => <span key={m} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">{m}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* VALIDATION & IMPACT */}
                <section className="space-y-8 overflow-hidden">
                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5 space-y-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">VALIDATION &amp; IMPACT</span>
                      <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A]">Architecting success for visionaries.</h2>
                    </div>
                    <div className="lg:col-span-7 flex flex-wrap gap-3 items-center">
                      {CLIENT_LOGOS.map((brand) => (
                        <span key={brand} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[11px] font-extrabold tracking-wider text-slate-500 hover:border-[#056368] hover:text-[#056368] transition">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative overflow-hidden py-3 border-y border-slate-200/80 bg-white/70">
                    <div className="flex gap-12 whitespace-nowrap animate-marquee-left w-max">
                      {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((brand, i) => (
                        <span key={`${brand}-${i}`} className="text-2xl sm:text-3xl font-extrabold tracking-widest text-slate-200 hover:text-[#056368] transition">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#056368]">Verified Client Reviews &amp; Outcomes</div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = (spotlightReviewIdx + 1) % CLIENT_REVIEWS.length;
                        setSpotlightReviewIdx(nextIdx);
                        showToast(`Spotlighted review from ${CLIENT_REVIEWS[nextIdx].client}!`);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F0F9F9] hover:bg-[#056368] text-[#056368] hover:text-white text-xs font-extrabold transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Shuffle Spotlight Review
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((offset) => {
                      const rev = CLIENT_REVIEWS[(spotlightReviewIdx + offset) % CLIENT_REVIEWS.length];
                      return (
                        <div key={rev.id} className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition duration-300">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-serif text-[#056368]/40 leading-none">“</span>
                              <span className="px-2.5 py-1 rounded-full bg-[#E6F4F4] text-[#056368] text-[10px] font-extrabold">{rev.badge}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">“{rev.quote}”</p>
                          </div>
                          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                            <div className="relative w-10 h-10 rounded-full bg-[#F0F9F9] text-[#056368] flex items-center justify-center font-extrabold text-xs shrink-0 overflow-hidden ring-2 ring-[#056368]/15">
                              {rev.avatar ? (
                                <img
                                  src={rev.avatar}
                                  alt={rev.client}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                rev.client.slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-extrabold text-slate-900">{rev.client}</div>
                              <div className="text-[10px] font-bold text-slate-400">{rev.type}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* TECHNICAL ASSESSMENT AUDIT + DRAGGABLE SLIDER + EVALUATOR TELEMETRY ENGINE */}
                <section className="space-y-8">
                  <div className="grid lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">TECHNICAL ASSESSMENT AUDIT</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">Website Upgrade: Before vs. After Improvements</h2>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {['All', 'UX & Conversion', 'AI & Interaction', 'Full-Stack Engineering'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setAuditFilter(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${auditFilter === cat ? 'bg-[#056368] border-[#056368] text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">EVALUATOR TELEMETRY ENGINE</span>
                          <h3 className="text-sm font-extrabold text-slate-900">Core Web Vitals &amp; Live Stack</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">● Optimal</span>
                      </div>
                      <div className="space-y-2.5">
                        {CORE_WEB_VITALS.map((v) => (
                          <div key={v.metric} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-semibold text-slate-600"><strong className="font-mono text-[#056368] bg-[#F0F9F9] px-1.5 py-0.5 rounded mr-1.5">{v.metric}</strong>{v.full}</span>
                              <span className="font-extrabold text-slate-900">{v.value}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-[#056368] to-[#14B8A6]" style={{ width: `${v.pct}%` }} /></div>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                          <div className="text-[9px] font-bold uppercase text-slate-400">PERSISTENCE</div>
                          <div className="text-xs font-extrabold text-slate-900 mt-0.5">{firebaseStatus}</div>
                        </div>
                        <button type="button" onClick={() => setInspectorOpen(true)} className="rounded-2xl bg-[#056368] hover:bg-[#044C50] text-white p-3 text-left transition">
                          <div className="text-[9px] font-bold uppercase text-teal-200">API INSPECTOR</div>
                          <div className="text-xs font-extrabold mt-0.5 flex items-center justify-between"><span>{apiLogs.length} Events</span><ArrowUpRight className="w-3.5 h-3.5" /></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Draggable "Before vs. After" Comparison Slider */}
                  <BeforeAfterComparisonSlider />

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAudit.map((item) => (
                      <div key={item.id} className="rounded-3xl bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#056368]/40 transition">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368]">Upgrade {item.number}</span>
                            <span className="text-[10px] font-bold text-[#6B3E0B] bg-[#FBE5C8] px-2.5 py-0.5 rounded-full">{item.impact}</span>
                          </div>
                          <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{item.title}</h3>
                          <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-3 text-xs"><span className="text-[10px] font-bold text-slate-400 uppercase">BEFORE</span><p className="text-slate-600 mt-1">{item.before}</p></div>
                          <div className="rounded-2xl bg-[#F0F9F9] border border-[#056368]/15 p-3 text-xs"><span className="text-[10px] font-bold text-[#056368] uppercase">AFTER (CYNBIT 2.0)</span><p className="text-slate-800 font-medium mt-1">{item.after}</p></div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex flex-wrap gap-1">{item.categories.map((c) => <span key={c} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{c}</span>)}</div>
                          <button type="button" onClick={() => navigate(item.targetPage)} className="text-xs font-extrabold text-[#056368] inline-flex items-center gap-0.5">Try Live <ChevronRight className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* READY TO BUILD YOUR DIGITAL FUTURE CTA BANNER */}
                <section className="rounded-[36px] bg-gradient-to-br from-[#045256] via-[#056368] to-[#0B3B49] text-white p-8 sm:p-14 text-center space-y-5 shadow-2xl">
                  <h2 className="text-3xl sm:text-5xl font-extrabold italic tracking-tight">READY TO BUILD YOUR<br />DIGITAL FUTURE?</h2>
                  <p className="text-xs sm:text-sm text-teal-100 max-w-xl mx-auto">Let’s discuss how our AI automation and custom software development expertise can transform your business vision into reality.</p>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button type="button" onClick={() => navigate('contact')} className="px-7 py-3.5 rounded-full bg-white text-[#056368] hover:bg-teal-50 text-xs font-extrabold uppercase">Start Discovery Phase</button>
                    <button type="button" onClick={() => navigate('cases')} className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-extrabold uppercase">View Our Work</button>
                  </div>
                </section>
              </main>
            </div>
          )}

          {/* ==================== 2. OUR STORY PAGE ==================== */}
          {activePage === 'story' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-14">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">THE CYNBIT NARRATIVE</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">
                    Cynbit: The <span className="italic text-[#056368]">Story of a Vision</span>
                  </h1>
                  <p className="text-base text-slate-600">Founded in Jaipur, Rajasthan, Cynbit Technologies was built with a vision to create scalable AI solutions, automation systems, and modern software products that solve real business problems.</p>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual bigStat="2024" centerTitle="OFFICIAL ADOPTION" topTag="PREPARATION" topLabel="2021–2023 R&D" bottomTag="CERTIFICATION" bottomLabel="ISO 9001:2015 Verified" reducedMotion={reducedMotion} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-[32px] bg-white border border-slate-200 p-8 space-y-3 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">OUR VISION</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">The engineering of <span className="italic text-[#056368]">optimism.</span></h2>
                  <p className="text-sm text-slate-600 leading-relaxed">To be the global architectural benchmark for the digital age—engineering resilient infrastructures that bridge technical precision with human warmth.</p>
                </div>
                <div className="rounded-[32px] bg-white border border-slate-200 p-8 space-y-3 shadow-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9B7228]">OUR MISSION</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Eliminating the <span className="italic text-[#9B7228]">invisible friction.</span></h2>
                  <p className="text-sm text-slate-600 leading-relaxed">We build scalable, autonomous ecosystems to democratize innovation and simplify complexity for visionaries worldwide.</p>
                </div>
              </div>
              <div className="space-y-4">
                {STORY_MILESTONES.map((m) => (
                  <div key={m.year} className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 grid md:grid-cols-12 gap-4 items-center shadow-xs">
                    <div className="md:col-span-3 space-y-1">
                      <div className="text-3xl font-extrabold text-[#056368] font-mono">{m.year}</div>
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px] font-extrabold">{m.tag}</span>
                    </div>
                    <div className="md:col-span-7 space-y-1.5">
                      <h3 className="text-lg font-extrabold text-slate-900">{m.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                    </div>
                    <div className="md:col-span-2 md:text-right">
                      <span className="inline-flex px-3 py-1 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold">{m.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {['BITELEVATE', 'CYNBIT STUDIO', 'TENANTEASE', 'AI AGENTS'].map((pill) => (
                  <button key={pill} type="button" onClick={() => navigate(pill === 'BITELEVATE' ? 'bitelevate' : 'products')} className="px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-[#056368] text-xs font-extrabold text-slate-700 hover:text-[#056368] shadow-xs transition">
                    {pill}
                  </button>
                ))}
              </div>
            </main>
          )}

          {/* ==================== 3. OUR TEAM PAGE ==================== */}
          {activePage === 'team' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">The Inner Circle</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0F172A]">
                    Meet the <span className="italic text-[#056368]">Architects</span> behind Cynbit
                  </h1>
                  <p className="text-base text-slate-600">At Cynbit, we assemble a board of digital architects selected for their technical rigor and commitment to a resilient, optimistic future.</p>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual centerTitle="SYNERGY CORE" centerSub="15+ Architects" topTag="STATUS" topLabel="Architects Active" bottomTag="DELIVERY" bottomLabel="100+ Projects Shipped" icon={Users} reducedMotion={reducedMotion} />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, title: 'RADICAL INTEGRITY', desc: 'Leadership bound by technical and ethical transparency.' },
                  { icon: CheckCircle2, title: 'PROVEN RIGOR', desc: 'A documented history of solving complex systemic challenges.' },
                  { icon: Users, title: 'COLLABORATIVE HUB', desc: 'A decentralized hub ensuring no single point of failure.' },
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.title} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2.5 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F9F9] text-[#056368] flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                      <h3 className="text-sm font-extrabold text-slate-900">{p.title}</h3>
                      <p className="text-xs text-slate-600">{p.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* BOARD OF ARCHITECTS — WITH HOVER LINKEDIN BADGES (Section 3) */}
              <section className="space-y-6">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#056368]">BOARD OF ARCHITECTS</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">The core leadership</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {CORE_LEADERSHIP.map((leader) => (
                    <div key={leader.name} className="group rounded-[30px] bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition duration-300">
                      <div className="relative h-72 overflow-hidden bg-slate-900">
                        <img
                          src={leader.img}
                          alt={leader.name}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[#056368] text-[10px] font-extrabold">{leader.role}</span>
                        <a
                          href={leader.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => { e.stopPropagation(); showToast(`Opening LinkedIn profile for ${leader.name}`); }}
                          aria-label={`${leader.name} LinkedIn`}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0A66C2] text-white font-extrabold text-xs flex items-center justify-center shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-110 transition"
                        >
                          in
                        </a>
                      </div>
                      <div className="p-6 space-y-1.5">
                        <h3 className="text-xl font-extrabold italic text-slate-900 group-hover:text-[#056368] transition">{leader.name}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{leader.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="rounded-3xl bg-[#0B1221] text-white p-7 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="text-2xl font-extrabold italic">EXPERTISE VERIFIED.</div>
                  <div className="text-xs text-slate-400">DELIVERING ARCHITECTURAL SOFTWARE RIGOR AT GLOBAL SCALE.</div>
                </div>
                <div className="flex gap-8">
                  <div><div className="text-3xl font-extrabold text-teal-400"><AnimatedCounter value="100+" reducedMotion={reducedMotion} /></div><div className="text-[10px] text-slate-400 uppercase">PROJECTS</div></div>
                  <div><div className="text-3xl font-extrabold text-white"><AnimatedCounter value="15+" reducedMotion={reducedMotion} /></div><div className="text-[10px] text-slate-400 uppercase">ARCHITECTS</div></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {TEAM_MEMBERS.map((t) => (
                  <div key={t.name} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs hover:border-[#056368]/40 transition">
                    <div className="flex items-center justify-between">
                      <div className="relative w-14 h-14 rounded-2xl bg-[#056368] text-white font-extrabold flex items-center justify-center text-sm overflow-hidden shadow-md ring-2 ring-[#056368]/15">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          t.initials
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px] font-extrabold">{t.exp}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{t.name}</h3>
                      <div className="text-xs font-bold text-[#056368]">{t.role}</div>
                      <p className="text-xs text-slate-500 mt-2">{t.focus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* ==================== 4. SOCIAL IMPACT PAGE ==================== */}
          {activePage === 'impact' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-14">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">OUR INITIATIVES</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">
                    Cynbit for <span className="italic text-[#056368]">Society</span>
                  </h1>
                  <p className="text-base text-slate-600">We believe technology is a lever for social progress. Our initiatives evolve alongside the student journey, moving from building raw skills to nurturing resilient individuals.</p>
                  <button type="button" onClick={() => navigate('bitelevate')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#056368] text-white text-xs font-extrabold">Explore BitElevate <ArrowRight className="w-4 h-4" /></button>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual bigStat="50K+" centerTitle="LIVES TOUCHED" topTag="PARTNERSHIP" topLabel="Manav Seva Trust" bottomTag="IMPACT" bottomLabel="1,000+ Students Trained" reducedMotion={reducedMotion} />
                </div>
              </div>

              <section className="space-y-4">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#056368]">FLAGSHIP INITIATIVE</span>
                <h2 className="text-3xl font-extrabold italic text-slate-900">BITELEVATE EVOLUTION</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="rounded-[30px] bg-white border border-slate-200 p-7 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-11 h-11 rounded-full bg-[#056368] text-white font-extrabold text-sm flex items-center justify-center">1.0</span>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">PHASE ONE • BUILD SKILLS</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">Technical capability &amp; career readiness.</h3>
                    <p className="text-xs text-slate-600">Helping students become professionally capable and industry-ready through practical workshops, technical training, and industry exposure.</p>
                    <div className="flex flex-wrap gap-2">
                      {['TECHNICAL TRAINING', 'CAREER READINESS', 'PRACTICAL LEARNING', 'INDUSTRY EXPOSURE'].map((t) => <span key={t} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700">{t}</span>)}
                    </div>
                  </div>
                  <div className="rounded-[30px] bg-[#056368] text-white p-7 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="w-11 h-11 rounded-full bg-white text-[#056368] font-extrabold text-sm flex items-center justify-center">2.0</span>
                      <span className="text-[10px] font-extrabold uppercase text-teal-200">PHASE TWO • BUILD STUDENTS</span>
                    </div>
                    <h3 className="text-2xl font-extrabold">Holistic well-being &amp; mental health.</h3>
                    <p className="text-xs text-teal-100">Addressing the emotional side of student life—mental health, stress management, and academic pressure—to build confident, resilient future leaders.</p>
                    <div className="flex flex-wrap gap-2">
                      {['MENTAL WELLNESS', 'EMOTIONAL HEALTH', 'SAFE ECOSYSTEM', 'CONFIDENCE'].map((t) => <span key={t} className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-bold">{t}</span>)}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[34px] bg-white border border-slate-200 p-7 sm:p-9 grid lg:grid-cols-12 gap-8 items-center shadow-sm">
                <div className="lg:col-span-5 relative rounded-3xl overflow-hidden bg-slate-900 h-64 group">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=85"
                    alt="Manav Seva Trust Community"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 rounded-2xl bg-[#9B7228] text-white p-4 shadow-xl max-w-[175px]">
                    <div className="text-2xl font-extrabold"><AnimatedCounter value="50K+" reducedMotion={reducedMotion} /></div>
                    <div className="text-[9px] font-bold uppercase leading-tight mt-0.5">Lives touched through tech-enabled community programs</div>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9B7228]">STRATEGIC PARTNERSHIP</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold italic text-slate-900">AFFILIATION WITH<br />MANAV SEVA TRUST.</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Through our collaboration with <strong>Manav Seva Trust</strong>, we provide foundational Computer and IT teaching to government schools and students in rural areas. We believe in providing the technical backbone and resources needed to improve lives and bridge the digital divide wherever we can.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['RURAL IT LITERACY', 'COMMUNITY WELLNESS', 'GOVT SCHOOL SUPPORT'].map((tag) => (
                      <span key={tag} className="px-3.5 py-1.5 rounded-full bg-[#F9F6F0] border border-[#D4A373]/40 text-[11px] font-extrabold text-[#6B3E0B]">{tag}</span>
                    ))}
                  </div>
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-5">
                {SOCIAL_IMPACT_PILLARS.map((p) => (
                  <div key={p.title} className="rounded-3xl bg-white border border-slate-200 p-7 space-y-3 shadow-xs">
                    <span className="inline-flex px-3 py-1 rounded-full bg-[#F0F9F9] text-[#056368] text-xs font-extrabold">{p.metric}</span>
                    <h3 className="text-xl font-extrabold text-slate-900">{p.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* ==================== 5. SERVICES HUB PAGE ==================== */}
          {activePage === 'services' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">Service Ecosystem</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">
                    Built for <span className="italic text-[#056368]">Scale</span><br />Designed for Performance
                  </h1>
                  <p className="text-base text-slate-600">AI automation, scalable software, dashboards, SaaS platforms, and digital infrastructure engineered for modern businesses.</p>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual centerTitle="SYSTEM READY" centerSub="Zero-Trust Cloud" topTag="INFRASTRUCTURE" topLabel="99.99% Uptime" bottomTag="RUNTIME" bottomLabel="Active • Auto-Scale" icon={Cpu} reducedMotion={reducedMotion} />
                </div>
              </div>

              <div className="space-y-8">
                {SERVICES_ECOSYSTEM.map((srv) => (
                  <div key={srv.id} className="rounded-[32px] bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-2xl space-y-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#056368]">{srv.badge}</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{srv.title}</h2>
                        <p className="text-xs sm:text-sm text-slate-600">{srv.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setServiceDrawer(srv)}
                        className="px-5 py-2.5 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold transition"
                      >
                        Inquire Service →
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {srv.cards.map(([t, d]) => (
                        <div key={t} className="rounded-2xl bg-[#F7FAFA] border border-slate-200/80 p-4 space-y-1.5">
                          <div className="text-[11px] font-extrabold text-[#056368]">{t}</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 9: Engagement Model & Pod Size Comparator */}
              <section className="rounded-[32px] bg-white border border-slate-200 p-7 sm:p-9 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">FLEXIBLE ENGAGEMENT MODELS</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">Engagement Model &amp; Pod Size Comparator ({currency})</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-[#F0F9F9] px-4 py-2.5 rounded-2xl border border-[#056368]/20">
                    <span className="text-xs font-extrabold text-[#056368]">Pod Size: {podSize} Engineers</span>
                    <input type="range" min={2} max={8} value={podSize} onChange={(e) => setPodSize(Number(e.target.value))} className="w-28 accent-[#056368]" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {ENGAGEMENT_MODELS.map((m) => {
                    const estTotalINR = m.baseINR + (podSize - 2) * m.perEngINR;
                    return (
                      <div key={m.id} className="rounded-3xl bg-[#F7FAFA] border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold">{m.timeline}</span>
                          <h3 className="text-lg font-extrabold text-slate-900">{m.name}</h3>
                          <div className="text-2xl font-extrabold text-[#056368]">{formatMoney(estTotalINR, currency)}</div>
                          <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                        </div>
                        <button type="button" onClick={() => navigate('studio')} className="w-full py-2.5 rounded-full bg-[#056368] text-white text-xs font-extrabold">Configure in Scope Studio →</button>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Production Tech Stack Matrix</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {TECH_STACK_GROUPS.map((g) => {
                    const Icon = g.icon;
                    return (
                      <div key={g.title} className="rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#056368]"><Icon className="w-4 h-4" /> {g.title}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {g.items.map((it) => <span key={it} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">{it}</span>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </main>
          )}

          {/* ==================== 6. PRODUCT SUITE PAGE ==================== */}
          {activePage === 'products' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-14">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">PROPRIETARY SOFTWARE SUITE</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">
                    The <span className="italic text-[#056368]">Cynbit Product</span> Ecosystem
                  </h1>
                  <p className="text-base text-slate-600">We build specialized SaaS ecosystems and AI-powered platforms designed to bridge the gap between individual potential and enterprise excellence.</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-4 py-2 rounded-full bg-[#056368] text-white text-xs font-extrabold">Cynbit Studio</span>
                    <span className="px-4 py-2 rounded-full bg-[#1D4ED8] text-white text-xs font-extrabold">TenantEase</span>
                    <span className="px-4 py-2 rounded-full bg-[#7C3AED] text-white text-xs font-extrabold">Revio</span>
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual centerTitle="3 CORE SAAS" centerSub="Studio • TenantEase • Revio" topTag="UPTIME" topLabel="99.99% Live" bottomTag="BILLING" bottomLabel="GST & INR Native" icon={Layers} reducedMotion={reducedMotion} />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {PRODUCTS_SUITE.map((p) => (
                  <div key={p.id} className="rounded-[30px] bg-white border border-slate-200 p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300">
                    <div className="space-y-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368] bg-[#F0F9F9] px-3 py-1 rounded-full">{p.tag}</span>
                      <h2 className="text-2xl font-extrabold text-slate-900">{p.name}</h2>
                      <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                      <ul className="space-y-2 pt-2">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-slate-700"><CheckCircle2 className="w-4 h-4 text-[#056368] shrink-0 mt-0.5" /><span>{f}</span></li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setDemoProduct(p.id); navigate('studio'); }}
                      className="w-full py-3 rounded-full bg-[#F0F9F9] hover:bg-[#056368] text-[#056368] hover:text-white text-xs font-extrabold uppercase transition"
                    >
                      Launch Live Sandbox →
                    </button>
                  </div>
                ))}
              </div>

              {/* Section 2: Live Interactive Product Charts (TenantEase Bar Chart, Revio Multi-Location Sentiment Bar, Cynbit Studio Mini Skill Radar) */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Cynbit Studio Mini Skill Radar + 4 Core USPs */}
                <div className="lg:col-span-6 rounded-[32px] bg-white border border-slate-200 p-7 space-y-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">CYNBIT STUDIO • TELEMETRY RADAR</span>
                      <h3 className="text-xl font-extrabold text-slate-900">Adaptive Learning &amp; Architecture Engine</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px] font-extrabold">91/100 Index</span>
                  </div>
                  <div className="grid sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-5">
                      <TealSkillRadarSVG compact scores={{ latency: 90, security: 94, scalability: 89, maintainability: 92 }} />
                    </div>
                    <div className="sm:col-span-7 grid gap-2.5 text-xs">
                      {[
                        ['USP 01', 'One Platform Ecosystem', 'Connects learning, proof of skill, and career documents.'],
                        ['USP 02', 'Adaptive Skill Journey', 'Placement tests personalize your path from day one.'],
                        ['USP 03', 'AI Quality Evaluation', 'Feedback on code quality instead of simple output matching.'],
                      ].map(([u, t, d]) => (
                        <div key={u} className="rounded-2xl bg-[#F7FAFA] border border-slate-200/80 p-3">
                          <div className="text-[9px] font-mono font-bold text-[#056368]">{u}</div>
                          <div className="font-extrabold text-slate-900">{t}</div>
                          <div className="text-[11px] text-slate-500">{d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TenantEase Monthly Collection Bar Chart + Revio Multi-Location Sentiment Bar */}
                <div className="lg:col-span-6 space-y-5">
                  {/* TenantEase Bar Chart */}
                  <div className="rounded-[32px] bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1D4ED8]">TENANTEASE COLLECTION ANALYTICS</span>
                        <h3 className="text-lg font-extrabold text-slate-900">Monthly Collection Efficiency (Jul–Dec)</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#1D4ED8] text-[10px] font-extrabold">100% TARGET</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2.5 items-end h-32 pt-4 px-2">
                      {TENANTEASE_MONTHLY_BARS.map((b) => (
                        <div
                          key={b.month}
                          onMouseEnter={() => setHoveredBarMonth(b.month)}
                          className="flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
                        >
                          <span className={`text-[9px] font-mono font-extrabold ${hoveredBarMonth === b.month ? 'text-[#056368]' : 'text-slate-400'}`}>
                            {b.pct}%
                          </span>
                          <div
                            className={`w-full rounded-t-xl transition-all duration-300 ${hoveredBarMonth === b.month ? 'bg-[#056368]' : 'bg-[#1D4ED8]/80 group-hover:bg-[#056368]'}`}
                            style={{ height: `${b.pct}%` }}
                          />
                          <span className="text-[10px] font-mono font-bold text-slate-500">{b.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 bg-slate-50 rounded-xl px-3.5 py-2 flex justify-between">
                      <span>Selected Month: <strong className="text-slate-900">{hoveredBarMonth}</strong></span>
                      <span>Settled Volume: <strong className="text-[#056368]">{formatMoney(TENANTEASE_MONTHLY_BARS.find((x) => x.month === hoveredBarMonth)?.volume || 2890000, currency)}</strong></span>
                    </div>
                  </div>

                  {/* Revio Multi-Location Sentiment Bar */}
                  <div className="rounded-[32px] bg-[#0B1221] text-white p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">REVIO MULTI-LOCATION SENTIMENT</span>
                        <h3 className="text-lg font-extrabold italic">BRANCH PULSE &amp; ACCESS HIERARCHY</h3>
                      </div>
                      <div className="flex gap-1">
                        {Object.keys(REVIO_BRANCH_DATA).map((br) => (
                          <button
                            key={br}
                            type="button"
                            onClick={() => setRevioBranch(br)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold transition ${revioBranch === br ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
                          >
                            {br}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{revioBranch} Positive Sentiment</span>
                        <span className="text-teal-300 font-mono">{REVIO_BRANCH_DATA[revioBranch].sentiment}% • {REVIO_BRANCH_DATA[revioBranch].reviews} Reviews ({REVIO_BRANCH_DATA[revioBranch].sla})</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-purple-400 to-teal-400 transition-all duration-500" style={{ width: `${REVIO_BRANCH_DATA[revioBranch].sentiment}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      {[['Admin', 'GOVERNANCE'], ['Manager', 'BRAND'], ['Advisor', 'BRANCH OPS']].map(([r, s]) => (
                        <div key={r} className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5 text-center">
                          <div className="text-xs font-extrabold">{r}</div>
                          <div className="text-[9px] font-mono text-slate-400">{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <section className="rounded-[32px] bg-white border border-slate-200 p-7 sm:p-9 space-y-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Book a Private Product Walkthrough</h3>
                    <p className="text-xs text-slate-500">Select a product and our Jaipur solution architects will configure a custom sandbox.</p>
                  </div>
                  <div className="flex gap-1.5">
                    {['STUDIO', 'TENANTEASE', 'REVIO'].map((id) => (
                      <button key={id} type="button" onClick={() => setDemoProduct(id)} className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${demoProduct === id ? 'bg-[#056368] border-[#056368] text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{id}</button>
                    ))}
                  </div>
                </div>
                <form
                  onSubmit={(e) => { e.preventDefault(); showToast(`${demoProduct} Demo Request Confirmed!`); logApi('POST', `/api/cynbit/demo/${demoProduct.toLowerCase()}`, 201, { product: demoProduct }); e.currentTarget.reset(); }}
                  className="grid sm:grid-cols-3 gap-3"
                >
                  <input required placeholder="Full Name" className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                  <input required type="email" placeholder="Work Email" className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                  <button type="submit" className="rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold uppercase px-6 py-3">Request {demoProduct} Demo</button>
                </form>
              </section>
            </main>
          )}

          {/* ==================== 7. CASE STUDIES PAGE (ALL 11 PROJECTS + SHORTLIST BOOKMARKING) ==================== */}
          {activePage === 'cases' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-3 max-w-2xl">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">SUCCESS BLUEPRINTS • 11 CASE STUDIES</span>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A]">From Challenge to <span className="italic text-[#056368]">Scalable Solutions.</span></h1>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['ALL', 'SOFTWARE DEV', 'AI AUTOMATION', 'CLOUD & SAAS'].map((cat) => (
                    <button key={cat} type="button" onClick={() => setCaseFilter(cat)} className={`px-4 py-2 rounded-full text-xs font-extrabold border ${caseFilter === cat ? 'bg-[#056368] border-[#056368] text-white' : 'bg-white border-slate-200 text-slate-600'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-12 gap-5">
                {filteredCases.map((cs) => {
                  const isSaved = shortlist.some((x) => x.id === cs.id);
                  return (
                    <div key={cs.id} className={`${cs.span} group rounded-[30px] bg-white border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-[#056368]/50 transition duration-300`}>
                      <div className="relative h-52 overflow-hidden bg-[#0B1221]">
                        <img
                          src={cs.img}
                          alt={cs.title}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/30 to-transparent" />
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 text-[10px] font-extrabold">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-[#056368] text-white">{cs.client}</span>
                            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white">{cs.category}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleShortlist({ id: cs.id, type: 'Case Study', title: cs.title, page: 'cases' })}
                            className={`p-2 rounded-full backdrop-blur-md transition ${isSaved ? 'bg-[#056368] text-white' : 'bg-white/20 text-white hover:bg-white/35'}`}
                            title={isSaved ? 'Saved in Shortlist' : 'Bookmark Case Study'}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 right-4 text-right">
                          <div className="text-lg font-extrabold italic text-teal-300 leading-none">Impact</div>
                          <div className="text-[9px] font-mono text-slate-300 uppercase">DELIVERED SUCCESS</div>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2.5">
                          <h2 className="text-xl font-extrabold text-slate-900">{cs.title}</h2>
                          <p className="text-xs text-slate-600">{cs.subtitle}</p>
                          <div className="rounded-2xl bg-[#F7FAFA] border border-slate-200/80 p-3.5 text-xs text-slate-700">
                            <strong className="text-[#056368]">Outcome:</strong> {cs.outcome}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-mono text-slate-400">Shipped: {cs.completion}</span>
                          <button type="button" onClick={() => { setCaseModalOps(2500); setActiveCaseModal(cs); }} className="text-xs font-extrabold text-[#056368] inline-flex items-center gap-1">Read Full Study <ArrowUpRight className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <section className="rounded-[34px] bg-[#0B1221] text-white p-7 sm:p-10 grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-2">
                  <h2 className="text-3xl font-extrabold italic">ENGINEERING GLOBAL SUCCESS.</h2>
                  <p className="text-xs text-slate-400 leading-relaxed">Our methodology isn’t just about code; it’s about business resilience. We integrate with your vision to build ecosystems that outlast trends.</p>
                </div>
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {[['99.9%', 'UPTIME'], ['2.4x', 'GROWTH'], ['100%', 'AGILE'], ['0.8s', 'PRECISION']].map(([v, l]) => (
                    <div key={l} className="rounded-2xl bg-white/[0.05] border border-white/10 p-4">
                      <div className="text-2xl font-extrabold text-teal-400">{v}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">{l}</div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          )}

          {/* ==================== 8. BITELEVATE ECOSYSTEM PAGE ==================== */}
          {activePage === 'bitelevate' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16">
              <div className="grid lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold uppercase tracking-widest">NOT ANOTHER INTERNSHIP. A REAL ENGINEERING EXPERIENCE.</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A] leading-tight">
                    Stop Watching Tutorials.<br /><span className="italic text-[#056368]">Start Doing the Work.</span>
                  </h1>
                  <p className="text-base text-slate-600">Learn software engineering by building real projects, solving engineering problems, fixing bugs, writing tests, and shipping code through actual development workflows.</p>
                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    {['100% Remote Opportunity', 'Real GitHub Repositories', 'Daily Senior PR Reviews', 'Flexible Asynchronous Hours', 'College Credit Approved'].map((p) => (
                      <span key={p} className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual centerTitle="60-DAY SPRINT" centerSub="1,000+ Graduated" topTag="PR #42 MERGED" topLabel="feat: redis-caching-layer" bottomTag="INCIDENT TRIAGE" bottomLabel="Day 18 War Room Solved" icon={GitPullRequest} reducedMotion={reducedMotion} />
                </div>
              </div>

              <div className="rounded-3xl bg-white border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368] mr-1">● TRUSTED BY ENGINEERS FROM:</span>
                  {['SKIT Jaipur', 'JECRC Foundation', 'Poornima University', 'Manipal University', 'Amity', 'Arya College'].map((c) => (
                    <span key={c} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700">{c}</span>
                  ))}
                </div>
                <div className="flex items-center gap-5 text-xs">
                  <div><strong className="text-lg font-extrabold text-[#056368]">1,000+</strong> <span className="text-[10px] text-slate-400 uppercase">Interns Graduated</span></div>
                  <div><strong className="text-lg font-extrabold text-slate-900">88%</strong> <span className="text-[10px] text-slate-400 uppercase">Placement Lift</span></div>
                </div>
              </div>

              <section className="space-y-8">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2 opacity-75">
                    <div className="text-lg font-extrabold text-slate-700">Recorded courses</div>
                    <p className="text-xs text-slate-500">You watch someone else build. There is no repo of yours, no review and nothing a recruiter can open.</p>
                    <div className="text-[10px] font-bold text-slate-400 pt-2">Passive video consumption</div>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2 opacity-75">
                    <div className="text-lg font-extrabold text-slate-700">Certificate-only internships</div>
                    <p className="text-xs text-slate-500">You get a letter at the end. The work behind it is hard to see and harder to check.</p>
                    <div className="text-[10px] font-bold text-slate-400 pt-2">Unverified credentials</div>
                  </div>
                  <div className="rounded-3xl bg-white border-2 border-[#056368] p-6 space-y-2 shadow-lg">
                    <div className="text-lg font-extrabold text-[#056368]">BitElevate</div>
                    <p className="text-xs text-slate-700 font-medium">A real repo, a pull request every day, mentor feedback on each one, and a certificate with a QR code anyone can scan.</p>
                    <div className="text-[10px] font-extrabold text-[#056368] pt-2">True software engineering proof →</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    ['01', 'Pick a lab', 'Choose one of six tracks, from Full Stack to UI/UX.', 'Step 1 • Track selection'],
                    ['02', 'Get your repo', 'Your portal account is created automatically. Fork and clone with git clone.', 'Step 2 • Automatic provisioning'],
                    ['03', 'Ship a PR a day', 'Branch, build, test, open a pull request and paste the link into your workbench.', 'Step 3 • Daily engineering habit'],
                    ['04', 'Get reviewed & certified', 'Mentors approve or request changes. Finish the roadmap and receive a verifiable certificate.', 'Step 4 • Tamper-proof outcome'],
                  ].map(([num, title, desc, foot]) => (
                    <div key={num} className="rounded-3xl bg-white border border-slate-200 p-5 space-y-2 shadow-xs">
                      <div className="text-2xl font-extrabold font-mono text-slate-200">{num}</div>
                      <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                      <div className="text-[10px] font-bold text-[#056368] pt-1">{foot}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* BITELEVATE 2.0: INTERACTIVE 3-STEP LAB MATCHER + PUBLIC QR CERTIFICATE VERIFIER */}
              <section className="rounded-[34px] bg-[#0B1221] text-white p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="inline-flex px-3.5 py-1 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold uppercase tracking-widest">REMOTE SOFTWARE INTERNSHIP</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">BitElevate <span className="italic text-teal-400">2.0</span></h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">Match into your practical specialization track and verify ISO 9001:2015 cohort credentials instantaneously.</p>
                  </div>
                  <div className="flex gap-6 text-xs">
                    <div><div className="text-2xl font-extrabold text-teal-400">60 Days</div><div className="text-[10px] text-slate-400 uppercase">Remote Sprints</div></div>
                    <div><div className="text-2xl font-extrabold text-white">1,000+</div><div className="text-[10px] text-slate-400 uppercase">Graduated</div></div>
                  </div>
                </div>
                <div className="grid lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 rounded-3xl bg-[#111B30] border border-slate-700/70 p-6 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-extrabold"><GraduationCap className="w-5 h-5 text-teal-400" /> Interactive 3-Step Lab Matcher</div>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase text-slate-400">1. Level</div>
                        {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                          <button key={l} type="button" onClick={() => setBeLevel(l)} className={`w-full text-left px-3 py-2 rounded-xl font-bold border ${beLevel === l ? 'bg-[#056368] border-teal-400 text-white' : 'bg-[#0B1221] border-slate-700 text-slate-300'}`}>{l}</button>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase text-slate-400">2. Specialization</div>
                        {['Full-Stack Web', 'AI Automation', 'Cloud & DevOps'].map((f) => (
                          <button key={f} type="button" onClick={() => setBeFocus(f)} className={`w-full text-left px-3 py-2 rounded-xl font-bold border ${beFocus === f ? 'bg-[#056368] border-teal-400 text-white' : 'bg-[#0B1221] border-slate-700 text-slate-300'}`}>{f}</button>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase text-slate-400">3. Weekly Hours</div>
                        {['6 hrs', '12 hrs', '20 hrs'].map((h) => (
                          <button key={h} type="button" onClick={() => setBeHours(h)} className={`w-full text-left px-3 py-2 rounded-xl font-bold border ${beHours === h ? 'bg-[#056368] border-teal-400 text-white' : 'bg-[#0B1221] border-slate-700 text-slate-300'}`}>{h} / week</button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#0B1221] border border-teal-500/30 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-teal-400">RECOMMENDED • {matchedBitElevate.weeks} WEEKS ({beHours}/WK)</span>
                          <h4 className="text-lg font-extrabold mt-0.5">{matchedBitElevate.title}</h4>
                          <p className="text-xs text-slate-400">{matchedBitElevate.stack}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-[10px] font-bold text-teal-300">{beLevel}</span>
                      </div>
                      <p className="text-xs text-slate-300"><strong className="text-white">Capstone:</strong> {matchedBitElevate.capstone}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {matchedBitElevate.timeline.map((t, i) => <div key={i} className="rounded-xl bg-[#111B30] border border-slate-700/80 p-3 text-xs text-slate-200">{t}</div>)}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 rounded-3xl bg-[#111B30] border border-slate-700/70 p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-extrabold"><Award className="w-5 h-5 text-teal-400" /> Public QR Certificate Verifier</div>
                      <p className="text-xs text-slate-400 mt-1">ISO 9001:2015 credential lookup accepted for university training credits.</p>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleVerifyCertificate(); }} className="flex gap-2">
                      <input value={certQuery} onChange={(e) => setCertQuery(e.target.value)} className="flex-1 rounded-full bg-[#0B1221] border border-slate-700 px-4 py-2 text-xs font-mono font-bold text-white" />
                      <button type="submit" className="px-5 py-2 rounded-full bg-[#056368] hover:bg-teal-600 text-white text-xs font-bold">Verify</button>
                    </form>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {Object.keys(CERTIFICATE_REGISTRY).map((cid) => (
                        <button key={cid} type="button" onClick={() => handleVerifyCertificate(cid)} className="px-2.5 py-1 rounded-full bg-[#0B1221] border border-slate-700 font-mono text-teal-300 hover:bg-[#056368] hover:text-white">{cid}</button>
                      ))}
                      <button type="button" onClick={() => handleVerifyCertificate('CYN-INVALID-999')} className="px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 font-mono text-rose-300">Test Invalid</button>
                    </div>
                    {certMissing && (
                      <div className="rounded-2xl bg-rose-950/50 border border-rose-500/40 p-4 text-xs text-rose-200">
                        <strong>Credential Not Found:</strong> No verified certificate matches <span className="font-mono">{certQuery}</span>.
                      </div>
                    )}
                    {certResult && (
                      <div className="rounded-2xl bg-white text-slate-900 p-5 space-y-4 shadow-xl">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0F9F9] text-[10px] font-extrabold text-[#056368]"><ShieldCheck className="w-3.5 h-3.5" /> {certResult.status}</span>
                            <h4 className="text-lg font-extrabold mt-2">{certResult.recipient}</h4>
                            <p className="text-xs font-bold text-[#056368]">{certResult.track}</p>
                            <p className="text-[11px] text-slate-500">{certResult.cohort}</p>
                          </div>
                          <DeterministicQRSVG seed={certResult.id} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                          <div className="rounded-xl bg-slate-50 p-2"><div className="font-extrabold">{certResult.completionDate}</div><div className="text-[10px] text-slate-500">Completed</div></div>
                          <div className="rounded-xl bg-slate-50 p-2"><div className="font-extrabold text-[#056368]">{certResult.capstoneScore}</div><div className="text-[10px] text-slate-500">Capstone</div></div>
                          <div className="rounded-xl bg-slate-50 p-2"><div className="font-extrabold">{certResult.prsMerged} PRs</div><div className="text-[10px] text-slate-500">Merged</div></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* PRODUCTION LABS EXPLORER + VIEW FULL 60-DAY SYLLABUS MODAL TRIGGER (Section 3) */}
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#056368]">100% REMOTE ENGINEERING TRACKS</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mt-1">6 Production GitHub Industry Labs</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSyllabusModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F0F9F9] hover:bg-[#056368] text-[#056368] hover:text-white border border-[#056368]/25 text-xs font-extrabold transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View Full 60-Day Syllabus
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {BITELEVATE_LABS.map((lab) => (
                    <button key={lab.id} type="button" onClick={() => setActiveLabId(lab.id)} className={`px-4 py-2 rounded-full text-xs font-extrabold border transition ${activeLabId === lab.id ? 'bg-[#056368] border-[#056368] text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:border-[#056368]'}`}>{lab.tab}</button>
                  ))}
                </div>
                <div className="rounded-[32px] bg-white border border-slate-200 p-7 grid lg:grid-cols-12 gap-6 items-start shadow-sm">
                  <div className="lg:col-span-6 space-y-3">
                    <div className="text-[11px] font-mono font-bold text-[#056368]">{activeLab.repo}</div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{activeLab.title}</h3>
                    <p className="text-xs font-bold text-[#056368]">{activeLab.subtitle}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{activeLab.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {activeLab.stack.map((st) => <span key={st} className="px-2.5 py-1 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px] font-bold">{st}</span>)}
                    </div>
                  </div>
                  <div className="lg:col-span-6 rounded-2xl bg-[#0B1221] text-slate-200 p-5 font-mono text-[11px] space-y-2 shadow-xl border border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
                      <div className="flex gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /></div>
                      <span>BASH — GIT SPRINT WORKFLOW</span>
                    </div>
                    <div className="text-slate-500"># 1. Clone your dedicated industry lab</div>
                    <div className="text-emerald-400">git clone https://{activeLab.repo}.git</div>
                    <div className="text-slate-500 pt-1"># 2. Create feature branch for today&apos;s sprint</div>
                    <div className="text-sky-300">git checkout -b {activeLab.branch}</div>
                    <div className="text-slate-500 pt-1"># 3. Run automated test suite</div>
                    <div className="text-amber-300">pytest tests/ --cov=app</div>
                    <div className="text-emerald-400">---&gt; 24 passed in 1.42s (100% coverage) ---&gt;</div>
                    <div className="text-slate-500 pt-1"># 4. Push and open Pull Request for mentor review</div>
                    <div className="text-purple-300">git push origin {activeLab.branch}</div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold">✓ PR opened: Ready for senior code review</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Passing</span>
                    </div>
                  </div>
                </div>

                {/* YOUR DAILY WORKBENCH */}
                <div className="rounded-[34px] bg-[#0B1221] text-white p-7 sm:p-9 space-y-6">
                  <div className="max-w-2xl">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">THE PRIVATE INTERN PORTAL</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">Your daily workbench. Engineered for momentum.</h3>
                    <p className="text-xs text-slate-400 mt-1">No chaotic WhatsApp groups or lost Google Drives—everything is built into a single engineering dashboard.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      ['Daily Sprint Tasks', 'Every day unlocks a clear deliverable specification with required file targets and git branch rules.', 'DAY 1 TO 60 JOURNEY'],
                      ['PR Code Review Loop', 'Submit your GitHub PR link. Senior evaluators provide constructive inline feedback before approving.', 'CONSTRUCTIVE MENTORSHIP'],
                      ['Daily War Room Challenges', 'Tackle 60 simulated staff-engineer scenarios: OOM kills, database deadlocks, and outage logs.', 'INCIDENT TRIAGE SKILLS'],
                      ['Exam Leave Freeze', 'College mid-terms or finals? Request an official emergency freeze without losing your sprint streak.', 'STUDENT-FRIENDLY FLEXIBILITY'],
                    ].map(([t, d, f]) => (
                      <div key={t} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-sm font-extrabold text-white">{t}</div>
                          <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{d}</p>
                        </div>
                        <div className="text-[9px] font-mono font-bold text-teal-400 pt-2 border-t border-white/10">{f}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-PHASE SOFTWARE ENGINEERING ROADMAP */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold italic text-slate-900">PHASED SOFTWARE ENGINEERING ROADMAP</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {[
                      ['PHASE 01 • WEEK 1', 'Environment & Setup', 'Forking repo, local dev server, authoring developer profile, and merging your first Git Pull Request.'],
                      ['PHASE 02 • WEEK 2', 'Bug Hunting & Tests', 'Reproducing real production error logs, fixing edge-case bugs, and ensuring 100% test pass rates.'],
                      ['PHASE 03 • WEEKS 3–4', 'Core Architecture', 'JWT authentication, RBAC authorization, relational database schemas, and clean API router contracts.'],
                      ['PHASE 04 • WEEKS 5–6', 'Speed & Concurrency', 'Redis caching layers, query profiling, index optimization, and handling high concurrent traffic.'],
                      ['PHASE 05 • WEEKS 7–8', 'Docker & Capstone', 'Multi-stage Docker containers, automated GitHub Actions CI/CD workflows, and final security audit.'],
                    ].map(([p, t, d]) => (
                      <div key={p} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2 shadow-xs">
                        <div className="text-[9px] font-mono font-extrabold text-[#056368]">{p}</div>
                        <div className="text-sm font-extrabold text-slate-900">{t}</div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sections 7 & 10: BitElevate Campus, Mentor & Recruiter Suite */}
                <BitElevateSuiteExtras logApi={logApi} showToast={showToast} currency={currency} soundOn={soundOn} />

                {/* VOICES OF REAL BITELEVATE ENGINEERS */}
                <div className="space-y-5 overflow-hidden">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#056368]">REAL CODE • REAL MENTORS • REAL OUTCOMES</span>
                      <h3 className="text-3xl font-extrabold italic text-slate-900 mt-1">VOICES OF REAL BITELEVATE ENGINEERS</h3>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 font-extrabold"><span className="text-amber-500">★★★★★</span> 4.9 / 5.0 <span className="text-[10px] text-slate-400 block font-normal">COHORT RATING</span></div>
                      <div className="px-4 py-2 rounded-2xl bg-[#F0F9F9] border border-[#056368]/20 font-extrabold text-[#056368]">100% Verifiable <span className="text-[10px] text-slate-500 block font-normal">GITHUB PR REGISTRY</span></div>
                    </div>
                  </div>
                  <div className="overflow-hidden py-1">
                    <div className="flex gap-4 w-max animate-marquee-left">
                      {[...BITELEVATE_ENGINEER_REVIEWS, ...BITELEVATE_ENGINEER_REVIEWS].map((rev, idx) => (
                        <div key={`${rev.name}-${idx}`} className="w-80 rounded-3xl bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-full bg-[#056368] text-white text-xs font-extrabold flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-[#056368]/20">
                                {rev.avatar ? (
                                  <img
                                    src={rev.avatar}
                                    alt={rev.name}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  rev.initials
                                )}
                              </div>
                              <div>
                                <div className="text-xs font-extrabold text-slate-900">{rev.name}</div>
                                <div className="text-[10px] text-[#056368] font-bold">{rev.role}</div>
                              </div>
                            </div>
                            <span className="text-amber-500 text-xs">★★★★★</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">“{rev.quote}”</p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368] font-bold">{rev.outcome}</span>
                            <span className="text-emerald-600 font-bold">✓ Verified Intern</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DIRECT COHORT REGISTRATION CARD WITH CHECKOUT & REFERRAL FLOW (Section 4) */}
                <div className="rounded-[32px] bg-white border border-slate-200 p-7 grid lg:grid-cols-12 gap-8 items-start shadow-sm">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">62% SUBSIDIZED • ONE-TIME FEE</span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-4xl font-extrabold text-[#056368]">{formatMoney(bitElevateFinalFee, currency)}</span>
                      <span className="text-base line-through text-slate-400">{formatMoney(3999, currency)}</span>
                    </div>
                    <p className="text-xs text-slate-600">All-inclusive enrollment covering all 60 days with automated repository provisioning, daily senior PR reviews, and ISO 9001:2015 QR certificate.</p>

                    {/* Referral Code Input (CYNBIT200) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">REFERRAL CODE (TRY: CYNBIT200)</div>
                      <div className="flex gap-2">
                        <input
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          placeholder="Enter CYNBIT200"
                          className="flex-1 rounded-full bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-mono uppercase"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (referralCode.trim().toUpperCase() === 'CYNBIT200') {
                              setReferralApplied(true);
                              playTactileTone(soundOn, 'success');
                              showToast('Referral code CYNBIT200 applied! ₹200 off unlocked.');
                            } else {
                              setReferralApplied(false);
                              showToast('Try referral code CYNBIT200 for ₹200 instant discount.');
                            }
                          }}
                          className="px-4 py-2 rounded-full bg-[#0B1221] text-white text-xs font-extrabold"
                        >
                          {referralApplied ? 'Applied ✓' : 'Apply'}
                        </button>
                      </div>
                    </div>

                    {/* Payment Method Pills */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">PAYMENT METHOD</div>
                      <div className="flex flex-wrap gap-1.5">
                        {['UPI / GPay', 'PhonePe', 'Debit / Credit Card'].map((pm) => (
                          <button
                            key={pm}
                            type="button"
                            onClick={() => setPaymentMethod(pm)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition ${paymentMethod === pm ? 'bg-[#056368] border-[#056368] text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                          >
                            {pm}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      playTactileTone(soundOn, 'success');
                      showToast(`Sprint Seat Reserved (${formatMoney(bitElevateFinalFee, currency)} via ${paymentMethod})!`);
                      logApi('POST', '/api/cynbit/bitelevate/enroll', 201, { lab: activeLab.title, feeINR: bitElevateFinalFee, paymentMethod, referral: referralApplied ? 'CYNBIT200' : 'NONE' });
                      e.currentTarget.reset();
                    }}
                    className="lg:col-span-7 grid sm:grid-cols-2 gap-3.5 rounded-2xl bg-[#F7FAFA] border border-slate-200 p-5"
                  >
                    <div className="sm:col-span-2 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-900">Direct Sprint Registration</span>
                      <span className="px-3 py-1 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-xs font-extrabold">{paymentMethod}</span>
                    </div>
                    <input required placeholder="Student Full Name" className="rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                    <input required type="email" placeholder="College / Personal Email" className="rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                    <input required placeholder="GitHub Profile URL" className="rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                    <input required placeholder="College / University Name" className="rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                    <button type="submit" className="sm:col-span-2 py-3 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold uppercase tracking-wider">
                      Reserve Seat in {activeLab.title} ({formatMoney(bitElevateFinalFee, currency)}) →
                    </button>
                  </form>
                </div>
              </section>

              {/* FAQs */}
              <section className="space-y-3">
                <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
                {BITELEVATE_FAQS.map((f, idx) => (
                  <div key={f.q} className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
                    <button type="button" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)} className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-extrabold text-slate-900">
                      <span>{f.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#056368] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === idx && <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed">{f.a}</div>}
                  </div>
                ))}
              </section>
            </main>
          )}

          {/* ==================== 9. LEARNING PATHS PAGE ==================== */}
          {activePage === 'paths' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
              <div className="grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <span className="inline-flex px-3.5 py-1 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold uppercase tracking-widest">UNSTRUCTURED LEARNING</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">Architect your <span className="italic text-[#056368]">own future.</span></h1>
                  <p className="text-sm text-slate-600 max-w-2xl">We’ve demolished the rigid curriculum. At BitElevate, your path is an evolving ecosystem tailored to your unique professional DNA.</p>
                </div>
                <div className="lg:col-span-4 text-left lg:text-right">
                  <div className="text-6xl font-extrabold text-slate-200 leading-none">16</div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#9B7228]">CORE DIMENSIONS</div>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-4">
                {CORE_DIMENSIONS_16.map((dim) => (
                  <button
                    key={dim.id}
                    type="button"
                    onClick={() => setPathDrawerOpen(true)}
                    className={`${dim.span} ${dim.style} rounded-[28px] p-6 text-left flex flex-col justify-between min-h-[130px] shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-75">
                      <span>{dim.tag}</span>
                      <span>{dim.id}</span>
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-extrabold leading-snug">{dim.title}</div>
                      {dim.sub && <div className="text-xs opacity-80 mt-1">{dim.sub}</div>}
                      {dim.avatars && (
                        <div className="flex -space-x-2 mt-3">
                          {dim.avatars.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt="Community Creator"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-xs"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="rounded-[32px] bg-white border border-slate-200 p-8 grid lg:grid-cols-12 gap-8 items-center shadow-sm">
                <div className="lg:col-span-6 space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#056368]">No two brains are alike.<br />Why should two curricula be?</h2>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div><strong className="text-slate-900 uppercase">Non-Linear Mastery:</strong> Jump between modules as your project demands. We focus on outcome, not sequence.</div>
                    <div><strong className="text-slate-900 uppercase">AI-Driven Customization:</strong> Our platform adapts to your pace, identifying gaps in real-time and adjusting content difficulty.</div>
                  </div>
                </div>
                <div className="lg:col-span-6 rounded-3xl bg-[#F7FAFA] border-2 border-[#056368]/25 p-6 space-y-3 font-mono text-xs">
                  <div className="text-[10px] text-slate-400 font-bold">SYSTEM LOG // ADAPTIVE PATH</div>
                  <div className="text-[#056368] font-bold">&gt; Initializing Learner Profile...</div>
                  <div className="text-slate-600">&gt; Skill Gap Detected: [Cloud Native Security]</div>
                  <div className="text-[#9B7228] font-bold">&gt; Action: Injecting Advanced Kubernetes Module</div>
                  <div className="text-slate-600">&gt; Est. Completion: 14 Days (Accelerated)</div>
                  <button type="button" onClick={() => setPathDrawerOpen(true)} className="w-full mt-2 py-3 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-sans font-extrabold uppercase transition">Generate My Custom Path →</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {LEARNING_PATHS.map((lp) => (
                  <div key={lp.id} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between text-[10px] font-extrabold">
                      <span className="px-2.5 py-1 rounded-full bg-[#F0F9F9] text-[#056368]">{lp.duration} • {lp.labs} Labs</span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{lp.level}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">{lp.title}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {lp.skills.map((s) => <span key={s} className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* ==================== 10. STUDENT DIARIES PAGE ==================== */}
          {activePage === 'diaries' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
              <div className="max-w-2xl space-y-3">
                <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">STUDENT DIARIES 2025–2026</span>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">
                  <span className="italic text-[#056368]">Student Diaries:</span><br />Unheard Stories
                </h1>
                <p className="text-sm text-slate-600">Raw, unfiltered stories from the next generation of software architects. Documenting the shift from theoretical learning to professional execution.</p>
              </div>

              <div className="grid md:grid-cols-12 gap-5">
                {UNHEARD_DIARIES_BENTO.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setActiveDiaryModal(entry)}
                    className={`${entry.span} ${entry.bg} rounded-[30px] p-7 text-left flex flex-col justify-between min-h-[210px] shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 relative overflow-hidden`}
                  >
                    <p className="text-xl sm:text-2xl font-extrabold leading-snug relative z-10">“{entry.quote}”</p>
                    <div className="flex items-center justify-between pt-6 relative z-10">
                      <div>
                        <div className="text-xs font-extrabold">{entry.author}</div>
                        <div className="text-[10px] opacity-70 font-bold uppercase">{entry.role}</div>
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest opacity-80">Read Entry →</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-start pt-4">
                <div className="lg:col-span-7 space-y-4">
                  <h2 className="text-xl font-extrabold text-slate-900">BitElevate Alumni Stories</h2>
                  {diaries.map((d) => (
                    <article key={d.id} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between text-[10px] font-extrabold">
                        <div className="flex items-center gap-2.5">
                          {d.avatar && (
                            <img
                              src={d.avatar}
                              alt={d.name}
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#056368]/20"
                            />
                          )}
                          <span className="text-[#056368]">{d.name} • {d.role}</span>
                        </div>
                        <span className="text-slate-400 font-mono">{d.date}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900">{d.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{d.story}</p>
                    </article>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!diaryForm.name.trim() || !diaryForm.story.trim()) return;
                    const next = { id: `d-${Date.now()}`, date: 'NOV 2026', ...diaryForm };
                    setDiaries((p) => [next, ...p]);
                    setDiaryForm({ name: '', role: '', title: '', story: '' });
                    logApi('POST', '/api/cynbit/diaries', 201, { author: next.name });
                    showToast('Your Builder Story has been published!');
                  }}
                  className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 space-y-3.5 shadow-sm"
                >
                  <h3 className="text-base font-extrabold text-slate-900">Share Your BitElevate Story</h3>
                  <input required value={diaryForm.name} onChange={(e) => setDiaryForm({ ...diaryForm, name: e.target.value })} placeholder="Your Name" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                  <input required value={diaryForm.role} onChange={(e) => setDiaryForm({ ...diaryForm, role: e.target.value })} placeholder="Current Role / Cohort" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                  <input required value={diaryForm.title} onChange={(e) => setDiaryForm({ ...diaryForm, title: e.target.value })} placeholder="Headline" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                  <textarea required rows={3} value={diaryForm.story} onChange={(e) => setDiaryForm({ ...diaryForm, story: e.target.value })} placeholder="What did you build or learn?" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs" />
                  <button type="submit" className="w-full py-3 rounded-full bg-[#056368] text-white text-xs font-extrabold uppercase">Publish Story</button>
                </form>
              </div>
            </main>
          )}

          {/* ==================== 11. BLOG PAGE (WITH PAGINATION & SHORTLIST BOOKMARKING) ==================== */}
          {activePage === 'blog' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">INSIGHTS &amp; ARCHIVES</span>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A]">Architecting <span className="italic text-[#056368]">knowledge.</span></h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input value={blogSearch} onChange={(e) => { setBlogSearch(e.target.value); setBlogPage(1); }} placeholder="Search blueprints..." className="rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-semibold" />
                  {['ALL INSIGHTS', 'AI AUTOMATION', 'ENGINEERING', 'BITELEVATE'].map((cat) => (
                    <button key={cat} type="button" onClick={() => { setBlogCat(cat); setBlogPage(1); }} className={`px-3.5 py-2 rounded-full text-[11px] font-extrabold border ${blogCat === cat ? 'bg-[#056368] border-[#056368] text-white' : 'bg-white border-slate-200 text-slate-600'}`}>{cat}</button>
                  ))}
                </div>
              </div>

              {filteredBlogs[0] && (
                <div className="rounded-[32px] bg-white border border-slate-200 overflow-hidden grid lg:grid-cols-12 shadow-sm hover:shadow-xl transition">
                  <div className="lg:col-span-6 h-64 lg:h-auto bg-[#0B1221] overflow-hidden">
                    <img src={filteredBlogs[0].img} alt={filteredBlogs[0].title} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover" />
                  </div>
                  <div className="lg:col-span-6 p-7 sm:p-9 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-extrabold">
                        <span className="px-3 py-1 rounded-full bg-[#056368] text-white">FEATURED INSIGHT</span>
                        <span className="text-slate-400 font-mono">{filteredBlogs[0].readTime}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{filteredBlogs[0].title}</h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{filteredBlogs[0].excerpt}</p>
                    </div>
                    <button type="button" onClick={() => { setBlogModalProgress(0); setActiveBlogModal(filteredBlogs[0]); }} className="self-start px-5 py-2.5 rounded-full bg-[#056368] text-white text-xs font-extrabold">Read Featured Blueprint →</button>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                {paginatedBlogs.map((post) => {
                  const isSaved = shortlist.some((x) => x.id === post.id);
                  return (
                    <article key={post.id} className="group rounded-3xl bg-white border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-[#056368]/50 transition duration-300">
                      <div className="relative h-44 bg-[#0B1221] overflow-hidden">
                        <img src={post.img} alt={post.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <button
                          type="button"
                          onClick={() => toggleShortlist({ id: post.id, type: 'Blog Article', title: post.title, page: 'blog' })}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${isSaved ? 'bg-[#056368] text-white' : 'bg-black/40 text-white hover:bg-black/65'}`}
                          title="Save Article to Shortlist"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-[10px] font-extrabold">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368]">{post.category}</span>
                            <span className="text-slate-400 font-mono">{post.readTime}</span>
                          </div>
                          <h2 className="text-lg font-extrabold text-slate-900 leading-snug">{post.title}</h2>
                          <p className="text-xs text-slate-600 leading-relaxed">{post.excerpt}</p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px]">
                          <span className="font-bold text-slate-400">{post.author} • {post.date}</span>
                          <button type="button" onClick={() => { setBlogModalProgress(0); setActiveBlogModal(post); }} className="font-extrabold text-[#056368] inline-flex items-center gap-1">Read <ArrowRight className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Section 3: Blog Pagination (1 2 ...) */}
              {totalBlogPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  {Array.from({ length: totalBlogPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setBlogPage(pageNum)}
                      className={`w-9 h-9 rounded-full text-xs font-mono font-extrabold border transition ${blogPage === pageNum ? 'bg-[#056368] border-[#056368] text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-[#056368]'}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <span className="text-xs font-mono text-slate-400 px-1">...</span>
                </div>
              )}
            </main>
          )}

          {/* ==================== 12. CAREERS PAGE ==================== */}
          {activePage === 'careers' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">Cynbit Talent Hub</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">
                    Careers &amp; <span className="italic text-[#056368]">Open Roles.</span>
                  </h1>
                  <p className="text-base text-slate-600 max-w-2xl">At Cynbit, we don’t just solve problems; we architect human-centric software solutions. We’re looking for thinkers who value growth and technical discipline.</p>
                  <button
                    type="button"
                    onClick={() => setAppsDrawerOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-[#056368] text-xs font-extrabold text-slate-900 shadow-xs"
                  >
                    <CheckSquare className="w-4 h-4 text-[#056368]" />
                    <span>My Submitted Applications</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#056368] text-white font-mono text-[10px]">{applications.length}</span>
                  </button>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual bigStat="20" centerTitle="LIVE OPENINGS" topTag="HYBRID / REMOTE" topLabel="Jaipur HQ & Global" bottomTag="TRACK" bottomLabel="Direct PPO Available" reducedMotion={reducedMotion} />
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: BookOpen, title: 'Continuous tech learning', desc: 'Unlimited access to certifications, conferences, and dedicated Research Fridays to explore new tech stacks.' },
                    { icon: Globe, title: 'Radical flexibility', desc: 'Our remote-first software development model balances deep focus with periodic team architectural syncs.' },
                    { icon: Rocket, title: 'High-impact ownership', desc: 'We don’t hire resources; we hire architects. Every team member has autonomy from day one.' },
                  ].map((b) => {
                    const Icon = b.icon;
                    return (
                      <div key={b.title} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2.5 shadow-xs">
                        <div className="w-10 h-10 rounded-xl bg-[#F0F9F9] text-[#056368] flex items-center justify-center"><Icon className="w-5 h-5" /></div>
                        <h3 className="text-base font-extrabold text-slate-900">{b.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="rounded-[32px] bg-white border border-slate-200 p-7 grid lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-4 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">THE METHODOLOGY</span>
                    <h2 className="text-3xl font-extrabold text-slate-900">Our operating <span className="italic text-[#056368]">model.</span></h2>
                    <p className="text-xs text-slate-600">High-fidelity execution framework that prioritizes deep work and technical excellence.</p>
                  </div>
                  <div className="lg:col-span-8 grid sm:grid-cols-2 gap-3.5">
                    {[
                      ['01', 'DOC-LED CULTURE', 'We value clear documentation over endless meetings. If it’s not in the blueprint, it doesn’t exist.'],
                      ['02', 'ASYNCHRONOUS SYNCS', 'We respect your flow state. Most communication happens asynchronously via engineering hubs.'],
                      ['03', 'OPTIMISTIC REVIEWS', 'Peer reviews are collaborative, not critical. We aim for the best architectural outcome together.'],
                      ['04', 'ITERATIVE SPRINTS', 'We ship fast, but we architect for the long-term with rigorous quality gates.'],
                    ].map(([n, t, d]) => (
                      <div key={n} className="rounded-2xl bg-[#F7FAFA] border border-slate-200/80 p-4">
                        <div className="text-xs font-mono font-bold text-[#056368]">{n}</div>
                        <div className="text-xs font-extrabold text-slate-900 mt-1">{t}</div>
                        <p className="text-[11px] text-slate-600 mt-1">{d}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white border border-slate-200 p-3.5 shadow-xs">
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Engineering', 'AI Systems', 'Design', 'Growth', 'Business'].map((d) => (
                    <button key={d} type="button" onClick={() => setCareerDept(d)} className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${careerDept === d ? 'bg-[#056368] text-white' : 'bg-slate-50 text-slate-600'}`}>{d}</button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  {['All', 'Internship', 'Full-Time'].map((f) => (
                    <button key={f} type="button" onClick={() => setCareerFilter(f)} className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition ${careerFilter === f ? 'bg-[#0B1221] text-white' : 'bg-slate-50 text-slate-600'}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCareers.map((role) => (
                  <div key={role.id} className="rounded-[28px] bg-white border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#056368] transition">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-extrabold">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368]">{role.dept}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B]">{role.type}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#0F172A]">{role.title}</h3>
                      <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#056368]" /> {role.loc}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{role.desc}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(role.stack || []).map((st) => <span key={st} className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-700">{st}</span>)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApplyRole(role)}
                      className="w-full py-3 rounded-full bg-[#F0F9F9] hover:bg-[#056368] text-[#056368] hover:text-white text-xs font-extrabold uppercase tracking-wider transition"
                    >
                      Quick Apply →
                    </button>
                  </div>
                ))}
              </div>
            </main>
          )}

          {/* ==================== 13. CONTACT PAGE (WITH JAIPUR COORDS, VOICE CALLBACK & IST CALENDAR) ==================== */}
          {activePage === 'contact' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-14">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[11px] font-extrabold uppercase tracking-widest">INQUIRY HUB</span>
                  <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F172A]">
                    Start Your Next <span className="italic text-[#056368]">Project</span> With Us
                  </h1>
                  <p className="text-base text-slate-600">Whether you’re building a product, automating operations, or scaling digitally, our architects are ready to design the solution.</p>
                </div>
                <div className="lg:col-span-5">
                  <ModuleOrbitalVisual centerTitle="INTELLIGENCE" centerSub="24H Response Sync" topTag="STATUS" topLabel="100% Trust" bottomTag="HQ HUB" bottomLabel="Jaipur, Rajasthan" icon={ShieldCheck} reducedMotion={reducedMotion} />
                </div>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      playTactileTone(soundOn, 'success');
                      showToast('Project Inquiry received! Our Jaipur architects will reply within 24H.');
                      logApi('POST', '/api/cynbit/contact-inquiry', 201, { status: 'queued' });
                      e.currentTarget.reset();
                    }}
                    className="rounded-[32px] bg-white border border-slate-200 p-7 sm:p-9 space-y-4 shadow-sm"
                  >
                    <h2 className="text-xl font-extrabold text-slate-900">Direct Architecture Brief</h2>
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      <input required placeholder="Full Name" className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                      <input required type="email" placeholder="Work Email" className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                    </div>
                    <input required placeholder="Company / Organization" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                    <textarea required rows={4} placeholder="Describe your technical goals, timeline, and integrations..." className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs" />
                    <button type="submit" className="w-full py-3.5 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold uppercase tracking-wider">Send Inquiry to Jaipur HQ →</button>
                  </form>

                  {/* Section 8: Built-In Discovery Call Calendar & IST Slot Scheduler */}
                  <div className="rounded-[32px] bg-white border border-slate-200 p-7 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">DIRECT CALENDAR BOOKING</span>
                        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mt-0.5"><Calendar className="w-4 h-4 text-[#056368]" /> Discovery Call &amp; IST Slot Scheduler</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px] font-mono font-bold">IST (UTC+5:30)</span>
                    </div>
                    <div className="grid sm:grid-cols-12 gap-3 items-center">
                      <input
                        type="date"
                        value={callDate}
                        onChange={(e) => setCallDate(e.target.value)}
                        className="sm:col-span-4 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono font-bold"
                      />
                      <div className="sm:col-span-8 flex flex-wrap gap-1.5">
                        {['11:00 AM IST', '03:00 PM IST', '06:30 PM IST'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setCallSlot(slot)}
                            className={`px-3.5 py-2 rounded-full text-xs font-extrabold border transition ${callSlot === slot ? 'bg-[#056368] border-[#056368] text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {confirmedCall ? (
                        <div className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
                          ✓ Locked: {confirmedCall.date} at {confirmedCall.slot} (Ref: {confirmedCall.ref})
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">30-min architecture discovery session with Mohak / Dhawan.</span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const ref = `CALL-${Math.floor(1000 + Math.random() * 8999)}`;
                          setConfirmedCall({ date: callDate, slot: callSlot, ref });
                          playTactileTone(soundOn, 'success');
                          logApi('POST', '/api/cynbit/discovery-call', 201, { date: callDate, slot: callSlot, ref });
                          showToast(`Discovery call locked for ${callDate} at ${callSlot}!`);
                        }}
                        className="px-5 py-2.5 rounded-full bg-[#0B1221] hover:bg-[#056368] text-white text-xs font-extrabold transition"
                      >
                        Lock IST Slot →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  {/* Section 4: Jaipur HQ Location Card & Instant Voice Callback */}
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#056368]">
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> JAIPUR HEADQUARTERS</span>
                      <span className="font-mono text-[10px] text-slate-400">{CYNBIT_COORDS}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{CYNBIT_HQ}</p>
                    <button
                      type="button"
                      onClick={() => {
                        playTactileTone(soundOn, 'success');
                        logApi('POST', '/api/cynbit/voice-callback', 201, { hq: CYNBIT_HQ, sla: '15m' });
                        showToast('Instant 15-Min Voice Callback requested from Jaipur HQ!');
                      }}
                      className="w-full py-2.5 rounded-full bg-[#F0F9F9] hover:bg-[#056368] text-[#056368] hover:text-white border border-[#056368]/20 text-xs font-extrabold transition"
                    >
                      Request Instant 15-Min Voice Callback
                    </button>
                  </div>

                  <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-3 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#056368]"><Mail className="w-4 h-4" /> DIRECT EMAIL</div>
                    <p className="text-sm font-bold text-slate-900">{CYNBIT_EMAIL}</p>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#056368]"><Phone className="w-4 h-4" /> ARCHITECT DESK</div>
                    {CYNBIT_PHONES.map((p) => <div key={p} className="text-sm font-mono font-bold text-slate-800">{p}</div>)}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-3xl bg-white border border-slate-200 p-5 text-center shadow-xs">
                      <div className="text-2xl font-extrabold text-[#056368]">24H</div>
                      <div className="text-[10px] font-bold uppercase text-slate-400">Response Sync</div>
                    </div>
                    <div className="rounded-3xl bg-[#1D74D8] text-white p-5 text-center shadow-xs">
                      <div className="text-xl font-extrabold">Global</div>
                      <div className="text-[10px] font-bold uppercase text-blue-100">Delivery Hub</div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-2 shadow-xs">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#056368]">● SPECIALIZED PORTALS</div>
                    <button type="button" onClick={() => navigate('bitelevate')} className="w-full flex items-center justify-between py-2 text-xs font-extrabold text-slate-800 hover:text-[#056368] border-b border-slate-100"><span>BITELEVATE PROGRAM</span><ArrowRight className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => navigate('careers')} className="w-full flex items-center justify-between py-2 text-xs font-extrabold text-slate-800 hover:text-[#056368]"><span>JOIN THE TEAM</span><ArrowRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>

              <section className="space-y-5 pt-4">
                <div className="text-center space-y-1.5">
                  <span className="inline-flex px-3.5 py-1 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold uppercase tracking-widest">TECHNICAL FAQ</span>
                  <h2 className="text-3xl font-extrabold italic text-slate-900">COMMON <span className="text-[#056368]">INQUIRIES.</span></h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {CONTACT_FAQS.map((f) => (
                    <div key={f.q} className="rounded-3xl bg-white border border-slate-200 p-6 space-y-2 shadow-xs">
                      <h3 className="text-sm font-extrabold text-slate-900">{f.q}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          )}

          {/* ==================== 14. CYNBIT AI SCOPE STUDIO & LIVE SANDBOXES ==================== */}
          {activePage === 'studio' && (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16">
              {/* PART A: AI ARCHITECTURE & SCOPE STUDIO */}
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="max-w-2xl">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">ARCHITECTURAL LIFECYCLE • CYNBIT AI + CLOUD SYNC</span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] mt-1">AI Architecture &amp; Scope Studio.</h1>
                    <p className="text-sm text-slate-600 mt-1.5">Configure your target systems to synthesize a live 4-layer architecture blueprint, investment band, and phased delivery roadmap.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => navigate('aitools')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-xs font-extrabold">
                      <Terminal className="w-3.5 h-3.5" /> Open 10 AI Tools Hub
                    </button>
                    <button type="button" onClick={handleLoadSamplePreset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F0F9F9] border border-[#056368]/30 text-[#056368] text-xs font-extrabold shadow-xs">
                      <Zap className="w-3.5 h-3.5" /> Load Sample Preset
                    </button>
                  </div>
                </div>

                {/* Section 5: Live Visual SVG System Architecture Diagram */}
                <LiveArchitectureDiagramSVG track={scopeTrack} modulesCount={scopeModules.length} />

                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  <form onSubmit={handleGenerateScopeBrief} className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
                    <div className="space-y-2">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">STEP 1 • SELECT PRIMARY TRACK</div>
                      {SCOPE_TRACKS.map((t) => (
                        <button key={t.id} type="button" onClick={() => setScopeTrack(t.id)} className={`w-full text-left rounded-2xl p-3.5 border transition ${scopeTrack === t.id ? 'bg-[#F0F9F9] border-[#056368] ring-1 ring-[#056368]' : 'border-slate-200'}`}>
                          <div className="flex items-center justify-between text-xs font-extrabold text-slate-900"><span>{t.id}</span>{scopeTrack === t.id && <CheckCircle2 className="w-4 h-4 text-[#056368]" />}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">STEP 2 • CAPABILITY MODULES ({scopeModules.length})</div>
                      <div className="flex flex-wrap gap-1.5">
                        {SCOPE_MODULES.map((m) => {
                          const sel = scopeModules.includes(m);
                          return (
                            <button key={m} type="button" onClick={() => setScopeModules((p) => sel ? p.filter((x) => x !== m) : [...p, m])} className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${sel ? 'bg-[#056368] border-[#056368] text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                              {sel ? '✓ ' : '+ '}{m}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <select value={scopeScale} onChange={(e) => setScopeScale(e.target.value)} className="rounded-xl bg-slate-50 border border-slate-200 p-2 font-semibold"><option>MVP / Pilot</option><option>Growth</option><option>Enterprise</option></select>
                      <select value={scopeBudget} onChange={(e) => setScopeBudget(e.target.value)} className="rounded-xl bg-slate-50 border border-slate-200 p-2 font-semibold"><option>₹1.5L – ₹4L</option><option>₹4L – ₹10L</option><option>₹10L+</option></select>
                      <select value={scopeWindow} onChange={(e) => setScopeWindow(e.target.value)} className="rounded-xl bg-slate-50 border border-slate-200 p-2 font-semibold"><option>4 Weeks</option><option>8 Weeks</option><option>12+ Weeks</option></select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <input required value={scopeOrg} onChange={(e) => setScopeOrg(e.target.value)} placeholder="Organization Name" className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                      <input required type="email" value={scopeEmail} onChange={(e) => setScopeEmail(e.target.value)} placeholder="Work Email" className="rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-semibold" />
                    </div>
                    <textarea rows={2} value={scopeContext} onChange={(e) => setScopeContext(e.target.value)} placeholder="Workflow context, ERP/CRM integrations..." className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs" />

                    <button type="submit" disabled={scopeLoading} className="w-full py-3.5 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 disabled:opacity-60">
                      {scopeLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing via Cynbit AI...</> : <><Sparkles className="w-4 h-4" /> Generate AI Blueprint &amp; Save</>}
                    </button>
                  </form>

                  <div className="lg:col-span-7 space-y-5">
                    {activeBrief && (
                      <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368]">{activeBrief.id}</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold">{activeBrief.status}</span>
                            </div>
                            <h3 className="text-xl font-extrabold mt-1.5">{activeBrief.organization}</h3>
                            <p className="text-xs text-slate-500">{activeBrief.track} • {activeBrief.scaleTier} • Target: {activeBrief.launchWindow}</p>
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleCopyText(JSON.stringify(activeBrief, null, 2), `Copied JSON for ${activeBrief.id}`)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"><Copy className="w-3.5 h-3.5" /> Copy JSON</button>
                            <button type="button" onClick={() => handleDownloadBriefMd(activeBrief)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F0F9F9] text-[#056368] border border-[#056368]/20 text-xs font-bold"><Download className="w-3.5 h-3.5" /> Export .md</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
                          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3"><div className="text-[10px] font-bold text-slate-400 uppercase">EST. DELIVERY</div><div className="text-base font-extrabold">~{activeBrief.estimatedWeeks} Weeks</div></div>
                          <div className="rounded-2xl bg-[#F0F9F9] border border-[#056368]/20 p-3"><div className="text-[10px] font-bold text-[#056368] uppercase">INVESTMENT BAND</div><div className="text-base font-extrabold text-[#056368]">{activeBrief.inrEstimate}</div></div>
                          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3"><div className="text-[10px] font-bold text-slate-400 uppercase">MODULES</div><div className="text-base font-extrabold text-emerald-700">{(activeBrief.modules || []).length} Active</div></div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 text-xs">
                          <div className="rounded-2xl bg-slate-50 p-3.5"><div className="font-extrabold text-[#056368]">01 • FRONTEND</div><p className="mt-1 text-slate-600">{activeBrief.layers?.frontend}</p></div>
                          <div className="rounded-2xl bg-slate-50 p-3.5"><div className="font-extrabold text-[#056368]">02 • API &amp; ORCHESTRATION</div><p className="mt-1 text-slate-600">{activeBrief.layers?.apiOrchestration}</p></div>
                          <div className="rounded-2xl bg-slate-50 p-3.5"><div className="font-extrabold text-[#056368]">03 • DATA &amp; PERSISTENCE</div><p className="mt-1 text-slate-600">{activeBrief.layers?.dataPersistence}</p></div>
                          <div className="rounded-2xl bg-slate-50 p-3.5"><div className="font-extrabold text-[#056368]">04 • SECURITY &amp; OBSERVABILITY</div><p className="mt-1 text-slate-600">{activeBrief.layers?.securityObservability}</p></div>
                        </div>
                        <div className="space-y-2">
                          {(activeBrief.roadmap || []).map((r, i) => (
                            <div key={i} className="flex items-start gap-2.5 rounded-2xl bg-slate-50 p-3 text-xs">
                              <span className="w-5 h-5 rounded-full bg-[#056368] text-white font-bold text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>
                              <div><div className="font-extrabold text-slate-900">{r.phase}</div><div className="text-slate-600">{r.detail}</div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-3">
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2"><Database className="w-4 h-4 text-[#056368]" /> Live Discovery Queue ({briefs.length})</div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {briefs.map((b) => (
                          <div key={b.id} className={`flex items-center justify-between gap-2 rounded-2xl p-3 border text-xs ${activeBrief?.id === b.id ? 'bg-[#F0F9F9] border-[#056368]/40' : 'bg-slate-50 border-slate-200'}`}>
                            <button type="button" onClick={() => setActiveBrief(b)} className="text-left flex-1">
                              <span className="font-mono font-bold text-[#056368] mr-2">{b.id}</span>
                              <span className="font-extrabold">{b.organization}</span>
                            </button>
                            <button type="button" onClick={() => setBriefs((p) => p.filter((x) => x.id !== b.id))} className="text-slate-400 hover:text-rose-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* PART B: LIVE CAPABILITY SANDBOXES */}
              <section className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#056368]">INTERACTIVE PROOF OF ENGINEERING</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mt-1">Live Capability Sandboxes.</h2>
                  </div>
                  <div className="inline-flex flex-wrap p-1.5 rounded-full bg-white border border-slate-200">
                    {[
                      ['triage', 'AI Support Triage', MessageSquare],
                      ['auditor', 'Code & Perf Auditor', Code2],
                      ['ledger', `Billing Ledger (${currency})`, Wallet],
                      ['agent', 'Autonomous Agent Graph', Workflow],
                    ].map(([id, lbl, Icon]) => (
                      <button key={id} type="button" onClick={() => setSandboxTab(id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition ${sandboxTab === id ? 'bg-[#056368] text-white' : 'text-slate-600'}`}>
                        <Icon className="w-3.5 h-3.5" /><span>{lbl}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {sandboxTab === 'triage' && (
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 grid lg:grid-cols-12 gap-6 shadow-sm">
                    <div className="lg:col-span-6 space-y-3.5">
                      <div><h3 className="text-base font-extrabold">Revio • AI Support &amp; Review Triage</h3><p className="text-xs text-slate-500">Live Cynbit AI sentiment scoring, urgency classification, and reply drafting.</p></div>
                      <div className="flex flex-wrap gap-1.5">
                        {SUPPORT_SAMPLES.map((s) => (
                          <button key={s.id} type="button" onClick={() => setTriageText(s.text)} className="px-3 py-1.5 rounded-full bg-slate-50 hover:bg-[#F0F9F9] border border-slate-200 text-xs font-semibold text-slate-700">{s.label}</button>
                        ))}
                      </div>
                      <textarea rows={4} value={triageText} onChange={(e) => setTriageText(e.target.value)} className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex gap-1.5">
                          {['Executive', 'Empathetic', 'Technical'].map((t) => (
                            <button key={t} type="button" onClick={() => setTriageTone(t)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${triageTone === t ? 'bg-[#F0F9F9] border-[#056368] text-[#056368]' : 'border-slate-200 text-slate-600'}`}>{t}</button>
                          ))}
                        </div>
                        <button type="button" onClick={handleRunTriage} disabled={triageLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#056368] text-white text-xs font-extrabold disabled:opacity-60">
                          {triageLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />} Analyze &amp; Draft Reply
                        </button>
                      </div>
                    </div>
                    <div className="lg:col-span-6 rounded-2xl bg-[#F7FAFA] border border-slate-200 p-5 space-y-4">
                      <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4">
                        <TealSentimentGaugeSVG score={triageOutput.score} />
                        <div className="flex-1 space-y-2">
                          <div className="text-xs font-bold">Urgency: <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">{triageOutput.urgency}</span></div>
                          <div className="flex flex-wrap gap-1.5">
                            {(triageOutput.issues || []).map((iss) => <span key={iss} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">{iss}</span>)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-[#056368]">
                          <span>DRAFTED REPLY ({triageTone.toUpperCase()})</span>
                          <button type="button" onClick={() => handleCopyText(triageOutput.reply, 'Reply copied!')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700"><Copy className="w-3 h-3" /> Copy</button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">{triageOutput.reply}</p>
                      </div>
                    </div>
                  </div>
                )}

                {sandboxTab === 'auditor' && (
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 grid lg:grid-cols-12 gap-6 shadow-sm">
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {CODE_SNIPPETS.map((sn) => (
                          <button key={sn.id} type="button" onClick={() => { setSelectedSnippetId(sn.id); setAuditCode(sn.code); }} className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${selectedSnippetId === sn.id ? 'bg-[#056368] border-[#056368] text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{sn.title} ({sn.lang})</button>
                        ))}
                      </div>
                      <textarea rows={9} value={auditCode} onChange={(e) => setAuditCode(e.target.value)} spellCheck={false} className="w-full rounded-2xl bg-[#F7FAFA] border border-slate-200 p-4 font-mono text-xs text-slate-800" />
                      <div className="flex justify-end">
                        <button type="button" onClick={handleRunCodeAudit} disabled={codeAuditLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#056368] text-white text-xs font-extrabold disabled:opacity-60">
                          {codeAuditLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Run Live Cynbit AI Audit
                        </button>
                      </div>
                    </div>
                    <div className="lg:col-span-5 rounded-2xl bg-[#F7FAFA] border border-slate-200 p-5 space-y-3">
                      <div className="text-xs font-extrabold uppercase text-[#056368]">4-Axis Quality Radar</div>
                      <TealSkillRadarSVG scores={codeAuditResult.scores} />
                      <div className="rounded-xl bg-white border border-slate-200 p-3 text-xs text-slate-700"><strong>Verdict:</strong> {codeAuditResult.summary}</div>
                      <div className="space-y-1.5">
                        {(codeAuditResult.suggestions || []).map((s, i) => <div key={i} className="flex items-start gap-2 rounded-xl bg-white border border-slate-200 p-2.5 text-xs text-slate-700"><CheckCircle2 className="w-3.5 h-3.5 text-[#056368] shrink-0 mt-0.5" /><span>{s}</span></div>)}
                      </div>
                    </div>
                  </div>
                )}

                {sandboxTab === 'ledger' && (
                  <div className="rounded-3xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div><h3 className="text-base font-extrabold">TenantEase • SaaS Billing Ledger ({currency})</h3><p className="text-xs text-slate-500">Collected: <strong className="text-[#056368]">{formatMoney(ledgerStats.paid, currency)}</strong> / {formatMoney(ledgerStats.total, currency)} ({ledgerStats.efficiency}%)</p></div>
                      <div className="flex gap-1.5">
                        {['All', 'Paid', 'Pending', 'Overdue'].map((st) => (
                          <button key={st} type="button" onClick={() => setInvoiceFilter(st)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${invoiceFilter === st ? 'bg-[#056368] border-[#056368] text-white' : 'border-slate-200 text-slate-600'}`}>{st}</button>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                          <tr><th className="py-3">Invoice</th><th>Client</th><th>Amount ({currency})</th><th>Status</th><th className="text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {invoices.filter((i) => invoiceFilter === 'All' || i.status === invoiceFilter).map((inv) => (
                            <tr key={inv.id}>
                              <td className="py-3 font-mono font-bold text-[#056368]">{inv.id}</td>
                              <td className="font-bold">{inv.client} <span className="text-slate-400 font-normal">({inv.city})</span></td>
                              <td className="font-extrabold">{formatMoney(inv.amount, currency)}</td>
                              <td><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{inv.status}</span></td>
                              <td className="text-right space-x-1.5">
                                {inv.status !== 'Paid' && (
                                  <>
                                    <button type="button" onClick={() => { setInvoices((p) => p.map((x) => x.id === inv.id ? { ...x, reminded: true } : x)); showToast(`Reminder sent to ${inv.client}`); }} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">{inv.reminded ? 'Reminded' : 'Remind'}</button>
                                    <button type="button" onClick={() => { setInvoices((p) => p.map((x) => x.id === inv.id ? { ...x, status: 'Paid' } : x)); showToast(`${inv.id} settled!`); }} className="px-3 py-1 rounded-full bg-[#056368] text-white text-[10px] font-bold">Settle</button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {sandboxTab === 'agent' && (
                  <div className="rounded-3xl bg-[#0B1221] text-white p-6 sm:p-8 space-y-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div><span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-400">REAL-TIME AGENTIC ORCHESTRATION</span><h3 className="text-xl font-extrabold mt-0.5">Autonomous Agent Workflow Visualizer</h3></div>
                      <button type="button" onClick={handleRunAgentSimulation} disabled={agentRunning} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#056368] hover:bg-teal-600 text-white text-xs font-extrabold disabled:opacity-60">
                        {agentRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} {agentRunning ? 'Executing...' : 'Run Live Agent Simulation'}
                      </button>
                    </div>
                    <div className="grid md:grid-cols-5 gap-3">
                      {AGENT_WORKFLOW_NODES.map((node, idx) => (
                        <div key={node.id} className={`rounded-2xl p-4 border transition-all ${agentStep === idx ? 'bg-[#056368] border-teal-300' : agentStep > idx ? 'bg-[#111F36] border-teal-500/50' : 'bg-[#111B30]/70 border-slate-800'}`}>
                          <div className="flex justify-between text-[10px] font-mono"><span className="text-teal-300 font-bold">0{idx + 1}</span><span className="text-slate-300">{node.ms}ms</span></div>
                          <div className="text-sm font-extrabold mt-2">{node.label}</div>
                          <div className="text-[10px] text-teal-200/80 mt-0.5">{node.sub}</div>
                          <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-slate-300">{agentStep >= idx ? node.detail : 'Waiting for signal...'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Sections 6, 8 & 12: Enterprise Proof, REST Playground, Readiness Grader & Executive Brief Exporter */}
              <EnterprisePlaygroundsSection logApi={logApi} showToast={showToast} handleCopyText={handleCopyText} soundOn={soundOn} />
            </main>
          )}

          {/* ==================== 15. CYNBIT AI TOOLS HUB (10 LIVE TOOLS) ==================== */}
          {activePage === 'aitools' && (
            <CynbitAiToolsHub logApi={logApi} showToast={showToast} handleCopyText={handleCopyText} soundOn={soundOn} />
          )}
        </div>

        {/* ==================== FOOTER (WITH SOCIAL BAR, TRUST CENTER & CLI TRIGGERS) ==================== */}
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-12 gap-8 text-xs">
            <div className="md:col-span-3 space-y-3">
              <CynbitLogo className="h-10 w-auto" showSub />
              <p className="text-slate-500 leading-relaxed">{CYNBIT_EMAIL}</p>
              <div className="space-y-0.5 font-mono text-[11px] text-slate-600">
                {CYNBIT_PHONES.map((ph) => <div key={ph}>{ph}</div>)}
              </div>
              {/* Section 3: Social Buttons & CLI Trigger */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {[
                  ['LinkedIn', 'https://www.linkedin.com'],
                  ['Instagram', 'https://www.instagram.com'],
                  ['Facebook', 'https://www.facebook.com'],
                  ['X', 'https://x.com'],
                ].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#056368] text-slate-700 hover:text-white text-[10px] font-extrabold transition"
                  >
                    {label}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => setCliOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-[#0B1221] text-teal-300 font-mono text-[10px] font-extrabold hover:bg-[#056368] hover:text-white transition"
                  title="Open Developer CLI (~)"
                >
                  CLI ~
                </button>
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="font-extrabold text-[#056368] uppercase">Explore</div>
              {[['story', 'About Us'], ['team', 'Core Team'], ['services', 'Our Services'], ['products', 'Product Suite'], ['bitelevate', 'Student Internship']].map(([id, l]) => (
                <button key={id} type="button" onClick={() => navigate(id)} className="block text-slate-500 hover:text-[#056368]">{l}</button>
              ))}
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="font-extrabold text-[#056368] uppercase">Impact &amp; Tools</div>
              {[['impact', 'Social Initiatives'], ['blog', 'Expert Blog'], ['cases', 'Case Studies (11)'], ['aitools', 'AI Tools Hub (10)'], ['studio', 'Cynbit AI Studio']].map(([id, l]) => (
                <button key={id} type="button" onClick={() => navigate(id)} className="block text-slate-500 hover:text-[#056368]">{l}</button>
              ))}
            </div>
            <div className="md:col-span-5 space-y-4">
              <div className="rounded-3xl bg-[#F7FAFA] border border-slate-200 p-5 space-y-3">
                <div className="text-sm font-extrabold text-slate-900">Subscribe to our Briefing</div>
                <p className="text-[11px] text-slate-500">Join 25k+ architects receiving our weekly technical and strategic deep-dives.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newsletterEmail.trim()) return;
                    logApi('POST', '/api/cynbit/newsletter/subscribe', 201, { email: newsletterEmail });
                    showToast(`Subscribed ${newsletterEmail} to Cynbit Weekly Briefing!`);
                    setNewsletterEmail('');
                  }}
                  className="flex gap-2"
                >
                  <input required type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="architect@company.com" className="flex-1 rounded-full bg-white border border-slate-200 px-4 py-2 text-xs" />
                  <button type="submit" className="px-5 py-2 rounded-full bg-[#056368] hover:bg-[#044C50] text-white text-[11px] font-extrabold uppercase shrink-0">Join →</button>
                </form>
              </div>
              <div className="rounded-2xl bg-[#F0F9F9] border border-[#056368]/15 px-4 py-3 flex items-center justify-between gap-2.5 text-[11px] text-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#056368] shrink-0" />
                  <span><strong>HEADQUARTERS:</strong> {CYNBIT_HQ}</span>
                </div>
                <button type="button" onClick={() => setTrustModalOpen(true)} className="text-[10px] font-extrabold text-[#056368] underline shrink-0">
                  Trust Center
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 py-4 text-center text-[11px] text-slate-400">
            © 2026 CYNBIT TECHNOLOGIES. ENGINEERED FOR OPTIMISM • ISO 9001:2015 CERTIFIED.
          </div>
        </footer>

        {/* ==================== MODALS, DRAWERS & OVERLAYS ==================== */}
        {/* Service Inquiry Slide-Over Drawer */}
        {serviceDrawer && (
          <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex justify-end" onClick={() => setServiceDrawer(null)}>
            <form
              onSubmit={(e) => { e.preventDefault(); showToast(`${serviceDrawer.drawerTitle} submitted!`); logApi('POST', `/api/cynbit/services/${serviceDrawer.id}`, 201, { service: serviceDrawer.title }); setServiceDrawer(null); }}
              className="w-full max-w-md bg-white h-full p-7 flex flex-col justify-between shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between"><h3 className="text-lg font-extrabold">{serviceDrawer.drawerTitle}</h3><button type="button" onClick={() => setServiceDrawer(null)}><X className="w-5 h-5 text-slate-400" /></button></div>
                <p className="text-xs text-slate-500">{serviceDrawer.desc}</p>
                <input required placeholder="Your Name" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                <input required type="email" placeholder="Work Email" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                <textarea required rows={4} placeholder="Project goals & target launch window..." className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-full bg-[#056368] text-white text-xs font-extrabold uppercase">Submit Brief</button>
            </form>
          </div>
        )}

        {/* Path Architecture Slide-Over Drawer */}
        {pathDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex justify-end" onClick={() => setPathDrawerOpen(false)}>
            <form
              onSubmit={(e) => { e.preventDefault(); showToast('Custom Adaptive Learning Path Initialized!'); setPathDrawerOpen(false); }}
              className="w-full max-w-md bg-white h-full p-7 flex flex-col justify-between shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between"><h3 className="text-xl font-extrabold">PATH ARCHITECTURE</h3><button type="button" onClick={() => setPathDrawerOpen(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
                <p className="text-xs text-slate-500">Map your unique learning journey with our Cynbit AI-driven curriculum engine.</p>
                <input required placeholder="Your Name" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold" />
                <select className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs font-semibold"><option>Full-Stack Systems</option><option>Applied AI &amp; Agents</option><option>Cloud &amp; DevOps</option></select>
                <textarea rows={3} placeholder="Current stack & career objective..." className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-full bg-[#056368] text-white text-xs font-extrabold uppercase">Initialize Path</button>
            </form>
          </div>
        )}

        {/* Quick Apply Modal */}
        {applyRole && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setApplyRole(null)}>
            <form onSubmit={handleApplySubmit} className="w-full max-w-md rounded-3xl bg-white p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-[#056368]">{applyRole.dept} • {applyRole.type}</div>
                  <h3 className="text-lg font-extrabold text-slate-900">{applyRole.title}</h3>
                </div>
                <button type="button" onClick={() => setApplyRole(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <input required value={applyForm.name} onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })} placeholder="Full Name" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold" />
              <input required type="email" value={applyForm.email} onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })} placeholder="Email Address" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold" />
              <input required value={applyForm.github} onChange={(e) => setApplyForm({ ...applyForm, github: e.target.value })} placeholder="GitHub / Portfolio URL" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-semibold" />
              <textarea rows={3} value={applyForm.pitch} onChange={(e) => setApplyForm({ ...applyForm, pitch: e.target.value })} placeholder="Brief note on systems you have shipped..." className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs" />
              <button type="submit" className="w-full py-3 rounded-full bg-[#056368] text-white text-xs font-extrabold uppercase">Submit Application</button>
            </form>
          </div>
        )}

        {/* Case Study Detail Modal (With Section 12 Interactive ROI Simulator) */}
        {activeCaseModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setActiveCaseModal(null)}>
            <div className="w-full max-w-xl rounded-3xl bg-white overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {activeCaseModal.img && (
                <div className="h-52 w-full bg-[#0B1221] overflow-hidden relative">
                  <img src={activeCaseModal.img} alt={activeCaseModal.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setActiveCaseModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-md"><X className="w-4 h-4" /></button>
                </div>
              )}
              <div className="p-7 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#056368] uppercase">{activeCaseModal.client} • {activeCaseModal.category}</span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{activeCaseModal.title}</h3>
                  </div>
                  {!activeCaseModal.img && <button type="button" onClick={() => setActiveCaseModal(null)}><X className="w-5 h-5 text-slate-400" /></button>}
                </div>
                <div className="space-y-3 text-xs text-slate-700">
                  <div className="rounded-2xl bg-slate-50 p-4"><strong className="text-slate-900">Challenge:</strong> {activeCaseModal.challenge}</div>
                  <div className="rounded-2xl bg-slate-50 p-4"><strong className="text-slate-900">Solution:</strong> {activeCaseModal.solution}</div>
                  <div className="rounded-2xl bg-[#F0F9F9] border border-[#056368]/20 p-4"><strong className="text-[#056368]">Measured Outcome:</strong> {activeCaseModal.outcome}</div>
                </div>

                {/* Section 12: Interactive ROI Simulator Inside Case Study Modal */}
                <div className="rounded-2xl bg-[#0B1221] text-white p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-teal-400">
                    <span>SIMULATE THIS OUTCOME FOR YOUR TEAM</span>
                    <span>{caseModalOps.toLocaleString('en-IN')} Monthly Ops</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={15000}
                    step={500}
                    value={caseModalOps}
                    onChange={(e) => setCaseModalOps(Number(e.target.value))}
                    className="w-full accent-[#14B8A6]"
                  />
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300">Projected Annual Efficiency Value:</span>
                    <strong className="text-base font-extrabold text-teal-300">{formatMoney(caseModalOps * (activeCaseModal.roiMultiplier || 1800), currency)} / yr</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Single Clean Blog Reader Modal (With Section 3 Reading Progress Bar & Copy/Share Link) */}
        {activeBlogModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setActiveBlogModal(null)}>
            <div
              onScroll={(e) => {
                const el = e.currentTarget;
                const max = el.scrollHeight - el.clientHeight;
                setBlogModalProgress(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100);
              }}
              className="w-full max-w-xl rounded-3xl bg-white overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Reading Progress Bar */}
              <div className="sticky top-0 left-0 right-0 h-1.5 bg-slate-100 z-20">
                <div className="h-full bg-[#056368] transition-all duration-150" style={{ width: `${Math.max(15, blogModalProgress)}%` }} />
              </div>

              {activeBlogModal.img && (
                <div className="h-52 w-full bg-[#0B1221] overflow-hidden relative">
                  <img src={activeBlogModal.img} alt={activeBlogModal.title} onError={(e) => { e.currentTarget.style.display = 'none'; }} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setActiveBlogModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-md"><X className="w-4 h-4" /></button>
                </div>
              )}
              <div className="p-7 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#056368] uppercase">{activeBlogModal.category} • {activeBlogModal.readTime}</span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{activeBlogModal.title}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">By {activeBlogModal.author} • {activeBlogModal.date}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(`https://cynbit.in/blog/${activeBlogModal.id}`, 'Article share link copied!')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F0F9F9] text-[#056368] text-[11px] font-extrabold shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{activeBlogModal.body}</p>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: BitElevate Full 60-Day Syllabus Modal */}
        {syllabusModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSyllabusModalOpen(false)}>
            <div className="w-full max-w-2xl rounded-3xl bg-white p-7 space-y-5 shadow-2xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#FBE5C8] text-[#6B3E0B] text-[10px] font-extrabold uppercase">ISO 9001:2015 CURRICULUM</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1.5">BitElevate Full 60-Day Engineering Syllabus</h3>
                  <p className="text-xs text-slate-500">Active Track: <strong className="text-[#056368]">{activeLab.title}</strong></p>
                </div>
                <button type="button" onClick={() => setSyllabusModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-3">
                {BITELEVATE_SYLLABUS_WEEKS.map((w) => (
                  <div key={w.week} className="rounded-2xl bg-[#F7FAFA] border border-slate-200 p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="text-xs font-mono font-extrabold text-[#056368]">{w.week}</span>
                      <span className="text-xs font-extrabold text-slate-900">{w.title}</span>
                    </div>
                    <ul className="space-y-1">
                      {w.items.map((it) => (
                        <li key={it} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#056368] shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 9: Security & Compliance Trust Center Modal */}
        {trustModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setTrustModalOpen(false)}>
            <div className="w-full max-w-xl rounded-3xl bg-white p-7 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#F0F9F9] text-[#056368] text-[10px] font-extrabold uppercase">ENTERPRISE GOVERNANCE</span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Security &amp; Compliance Trust Center</h3>
                </div>
                <button type="button" onClick={() => setTrustModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                {[
                  ['ISO 9001:2015 Certified', 'Audited quality management across software delivery and BitElevate training cohorts.'],
                  ['SOC2-Aligned Controls', 'Strict least-privilege IAM, encrypted secrets, and immutable audit trails across all APIs.'],
                  ['DPDP Act (India) Ready', 'Indian data residency (ap-south-1 Mumbai/Jaipur) with automated PII redaction before AI calls.'],
                  ['Zero-Trust Cloud Mesh', 'PostgreSQL Row-Level Security (RLS), HMAC-signed webhooks, and TLS 1.3 everywhere.'],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-2xl bg-[#F7FAFA] border border-slate-200 p-4 space-y-1.5">
                    <div className="font-extrabold text-[#056368] flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> {title}</div>
                    <p className="text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Hidden Developer CLI Terminal (~ Key or Footer Trigger) */}
        {cliOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setCliOpen(false)}>
            <div className="w-full max-w-xl rounded-3xl bg-[#0B1221] text-slate-100 border border-teal-500/40 shadow-2xl overflow-hidden font-mono" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-3.5 bg-[#070D19] border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-teal-400 font-extrabold">
                  <Terminal className="w-4 h-4" /> CYNBIT ARCHITECT CLI (~)
                </div>
                <button type="button" onClick={() => setCliOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-5 space-y-2 h-64 overflow-y-auto text-xs">
                {cliHistory.map((item, idx) => (
                  <div key={idx} className={item.type === 'cmd' ? 'text-teal-300 font-bold' : item.type === 'sys' ? 'text-amber-300' : 'text-slate-300'}>
                    {item.text}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-800 flex flex-wrap gap-1.5 text-[10px]">
                {['help', 'cynbit --stack', 'ping jaipur', 'bitelevate --tracks', 'team --founders'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => setCliInput(cmd)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#056368] text-teal-300 hover:text-white transition"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
              <form onSubmit={handleCliSubmit} className="p-3.5 bg-[#070D19] border-t border-slate-800 flex items-center gap-2">
                <span className="text-teal-400 font-bold text-xs">$</span>
                <input
                  autoFocus
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="Type a command (e.g., ping jaipur)..."
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                />
                <button type="submit" className="px-4 py-1.5 rounded-full bg-[#056368] text-white text-[11px] font-bold">Run</button>
              </form>
            </div>
          </div>
        )}

        {/* Section 12: Saved Bookmarks & Shortlist Drawer */}
        {shortlistDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-xs flex justify-end" onClick={() => setShortlistDrawerOpen(false)}>
            <aside className="w-full max-w-md bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold flex items-center gap-1.5"><Bookmark className="w-4 h-4 text-[#056368]" /> My Saved Shortlist</div>
                  <div className="text-[11px] text-slate-500">{shortlist.length} bookmarked blueprints &amp; insights</div>
                </div>
                <button type="button" onClick={() => setShortlistDrawerOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {shortlist.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 py-12">No bookmarked items yet. Click the bookmark icon on any Case Study or Blog post.</div>
                ) : (
                  shortlist.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-[#F7FAFA] border border-slate-200 p-4 flex items-start justify-between gap-3 text-xs">
                      <button type="button" onClick={() => { setShortlistDrawerOpen(false); navigate(item.page); }} className="text-left space-y-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#F0F9F9] text-[10px] font-extrabold text-[#056368]">{item.type}</span>
                        <div className="font-extrabold text-slate-900">{item.title}</div>
                      </button>
                      <button type="button" onClick={() => setShortlist((p) => p.filter((x) => x.id !== item.id))} className="text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </div>
        )}

        {/* Student Diary Full Editorial Reader Modal */}
        {activeDiaryModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setActiveDiaryModal(null)}>
            <div className="w-full max-w-2xl rounded-3xl bg-white p-7 sm:p-9 space-y-5 shadow-2xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FBE5C8] text-[#6B3E0B]">STUDENT DIARY</span>
                    <span className="text-slate-400 font-mono">{activeDiaryModal.date}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{activeDiaryModal.headline}</h3>
                  <div className="text-xs text-slate-500 font-bold">{activeDiaryModal.author} • {activeDiaryModal.role}</div>
                </div>
                <button type="button" onClick={() => setActiveDiaryModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(activeDiaryModal.tags || []).map((t) => <span key={t} className="text-[10px] font-mono font-bold text-[#056368] bg-[#F0F9F9] px-2.5 py-0.5 rounded-full">{t}</span>)}
              </div>
              <div className="space-y-3 border-l-4 border-[#056368] pl-4">
                {(activeDiaryModal.body || []).map((para, i) => (
                  <p key={i} className="text-sm text-slate-700 leading-relaxed">{para}</p>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="italic font-serif text-lg text-[#056368]">— anonymous</span>
                <button
                  type="button"
                  onClick={() => {
                    const idx = UNHEARD_DIARIES_BENTO.findIndex((x) => x.id === activeDiaryModal.id);
                    setActiveDiaryModal(UNHEARD_DIARIES_BENTO[(idx + 1) % UNHEARD_DIARIES_BENTO.length]);
                  }}
                  className="px-4 py-2 rounded-full bg-[#056368] text-white text-xs font-extrabold"
                >
                  Next Chapter →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Submitted Applications Slide-Over Drawer */}
        {appsDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-xs flex justify-end" onClick={() => setAppsDrawerOpen(false)}>
            <aside className="w-full max-w-md bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div><div className="text-sm font-extrabold">My Submitted Applications</div><div className="text-[11px] text-slate-500">Synced via {firebaseStatus}</div></div>
                <button type="button" onClick={() => setAppsDrawerOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="rounded-2xl bg-[#F7FAFA] border border-slate-200 p-4 space-y-1 text-xs">
                    <div className="flex justify-between"><span className="font-mono font-bold text-[#056368]">{app.id}</span><span className="px-2 py-0.5 rounded-full bg-[#F0F9F9] text-[10px] font-bold text-[#056368]">{app.status}</span></div>
                    <div className="font-extrabold text-sm">{app.role}</div>
                    <div className="text-slate-600">{app.name} • {app.email}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {/* Cmd+K Command Palette */}
        {cmdOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex items-start justify-center pt-20 p-4" onClick={() => setCmdOpen(false)}>
            <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#056368]" />
                <input autoFocus value={cmdQuery} onChange={(e) => setCmdQuery(e.target.value)} placeholder="Jump to any page, AI tool, sandbox, or CLI..." className="flex-1 text-xs font-semibold focus:outline-none" />
                <button type="button" onClick={() => setCmdOpen(false)} className="text-[10px] font-mono text-slate-400">ESC</button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredCmds.map((item) => (
                  <button key={item.label} type="button" onClick={item.run} className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-[#F0F9F9] text-left text-xs font-bold text-slate-800">
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono text-[#056368]">{item.group}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full-Stack API & Telemetry Inspector Drawer */}
        {inspectorOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-xs flex justify-end" onClick={() => setInspectorOpen(false)}>
            <aside className="w-full max-w-xl bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F7FAFA]">
                <div>
                  <div className="text-sm font-extrabold flex items-center gap-2"><Activity className="w-4 h-4 text-[#056368]" /> Full-Stack API &amp; Telemetry Inspector</div>
                  <div className="text-[11px] text-slate-500">Live Cloud CRUD, Cynbit AI &amp; validation logs.</div>
                </div>
                <button type="button" onClick={() => setInspectorOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-600">Captured Events: <strong className="text-slate-900">{apiLogs.length}</strong></span>
                <div className="flex gap-2">
                  <button type="button" onClick={handleExportAuditSummary} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F9F9] text-[#056368] text-xs font-bold"><Download className="w-3.5 h-3.5" /> Export Audit (.md)</button>
                  <button type="button" onClick={() => setApiLogs([])} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:text-rose-600 text-xs font-bold">Clear</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {apiLogs.map((l) => {
                  const open = expandedLogId === l.id;
                  return (
                    <div key={l.id} className="rounded-2xl border border-slate-200 overflow-hidden">
                      <button type="button" onClick={() => setExpandedLogId(open ? null : l.id)} className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 font-mono text-[11px]">
                        <span className="flex items-center gap-2 truncate"><span className="px-2 py-0.5 rounded-full bg-[#F0F9F9] text-[#056368] font-bold">{l.method}</span><span className={l.status >= 400 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>{l.status}</span><span className="text-slate-700 truncate">{l.path}</span></span>
                        <span className="text-slate-400 shrink-0 ml-2">{l.ms}ms</span>
                      </button>
                      {open && <pre className="text-[10px] font-mono bg-slate-50 p-3 border-t border-slate-100 overflow-x-auto text-slate-600">{JSON.stringify(l.data, null, 2)}</pre>}
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        )}

        {/* Section 2: Circular Scroll-to-Top Progress Ring (Bottom-Left) */}
        {scrollProgress > 6 && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
            aria-label="Scroll to top"
            className="fixed bottom-5 left-5 z-40 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-[#056368] hover:scale-105 transition"
          >
            <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#056368"
                strokeWidth="3"
                strokeDasharray={100.5}
                strokeDashoffset={100.5 - (scrollProgress / 100) * 100.5}
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="w-4 h-4 absolute" />
          </button>
        )}

        {/* Floating Aria Copilot (With Section 5 Voice Input & Section 12 English / Hinglish Mode) */}
        {!ariaOpen ? (
          <button
            type="button"
            onClick={() => setAriaOpen(true)}
            className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-white hover:bg-[#F0F9F9] border border-[#056368]/25 text-[#056368] shadow-xl text-xs font-extrabold transition hover:-translate-y-0.5"
          >
            <span className="w-7 h-7 rounded-full bg-[#056368] text-white flex items-center justify-center"><Sparkles className="w-3.5 h-3.5" /></span>
            <span>Aria • Cynbit AI</span>
          </button>
        ) : (
          <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[520px] animate-page-in">
            <div className="px-4 py-3.5 bg-[#056368] text-white flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-extrabold">Aria • Cynbit AI Assistant</div>
                <div className="text-[10px] text-teal-100">Powered by Cynbit AI • Voice &amp; {ariaLang}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex rounded-full bg-white/15 p-0.5 text-[9px] font-mono font-extrabold">
                  {['EN', 'HINGLISH'].map((lng) => (
                    <button
                      key={lng}
                      type="button"
                      onClick={() => { setAriaLang(lng); showToast(`Aria language switched to ${lng}`); }}
                      className={`px-2 py-0.5 rounded-full transition ${ariaLang === lng ? 'bg-white text-[#056368]' : 'text-teal-100'}`}
                    >
                      {lng}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setAriaOpen(false)}><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[#F7FAFA]">
              {ariaMsgs.map((m, i) => (
                <div key={i} className={`rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-line ${m.role === 'user' ? 'ml-10 bg-[#056368] text-white' : 'mr-6 bg-white border border-slate-200 text-slate-700'}`}>
                  {m.text}
                </div>
              ))}
              {ariaLoading && <div className="mr-10 rounded-2xl px-3.5 py-2.5 bg-white border border-slate-200 text-xs text-[#056368] font-bold">Aria is thinking...</div>}
            </div>
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
              {['Explain Product Suite', 'Estimate an AI automation MVP', 'BitElevate ₹1,499 details'].map((ch) => (
                <button key={ch} type="button" onClick={() => handleAriaSubmit(ch)} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 hover:text-[#056368]">{ch}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAriaSubmit(); }} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={handleStartAriaVoice}
                className={`p-2.5 rounded-full border transition ${ariaListening ? 'bg-rose-500 border-rose-500 text-white animate-pulse' : 'bg-slate-50 border-slate-200 text-[#056368]'}`}
                title="Speak to Aria (Voice Input)"
              >
                {ariaListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input value={ariaInput} onChange={(e) => setAriaInput(e.target.value)} placeholder={ariaLang === 'HINGLISH' ? 'Aria se Hinglish mein poochein...' : 'Ask Aria anything...'} className="flex-1 rounded-full bg-slate-50 border border-slate-200 px-4 py-2 text-xs focus:outline-none focus:border-[#056368]" />
              <button type="submit" disabled={ariaLoading} className="p-2.5 rounded-full bg-[#056368] text-white disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-20 left-5 z-50 rounded-full bg-[#0B1221] text-white px-5 py-3 text-xs font-bold shadow-2xl flex items-center gap-2 border border-teal-500/40 animate-page-in">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{toast}</span>
          </div>
        )}
      </div>
    </div>
  );
}