# Technical Report: Cynbit Technologies Website Architectural & UX Upgrade

**Candidate:** Tamiri Sai Vaibhav
**Role:** Full Stack Developer Intern
**Reference Code:** `cmwubpppx001107l9g90prbqu`
**Institution:** Raghu Engineering College, Visakhapatnam

---

## 1. Problem Statement & Audit Findings

An audit of Cynbit's baseline web experience, from both an end-user (founder / enterprise buyer / student) and a frontend-engineer perspective, found four main bottlenecks:

1. **Static value proposition:** Buyers could not test live product telemetry or model engagement costs dynamically.
2. **Low developer & student self-service:** BitElevate applicants lacked visibility into the 60-day curriculum, NOC generation and interview readiness.
3. **Navigation & modal friction:** No keyboard-first navigation, and stacked modals overlapped when reading long-form content.
4. **Disconnected AI capabilities:** Visitors had no hands-on workspace to experience Cynbit's generative workflows.

## 2. Technical Stack Choices

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| UI framework | React 18 + TypeScript | Deterministic state transitions across views, live currency conversion and real-time SVG/Canvas updates. |
| Styling | Tailwind CSS + embedded keyframe layer | Preserves the `#056368` palette with Mint-Light / Midnight-Teal dark mode. |
| Graphics | HTML5 canvas + inline SVG | Zero-dependency particle constellation, radars and architecture diagrams. |
| AI | Google Gemini API + fallback engine | Retry with backoff, structured JSON output, and offline fallback so demos never fail on rate limits. |
| Persistence | Firebase (optional) | Live sync when configured; automatic local-session fallback otherwise. |
| Deployment | GitHub → Vercel / Netlify | Atomic `vite build` with SPA rewrites and `VITE_` environment variables. |

## 3. Implementation Highlights

- **Resilient AI pipeline (`callCynbitAI`):** retries on 429/5xx with exponential delays, JSON-schema responses, and a graceful fallback.
- **Global currency engine:** INR / USD / EUR conversion applied across pricing and checkout.
- **Accessibility & polish:** Reduced-motion mode, scroll-reveal via `IntersectionObserver`, and Web Audio micro-sounds with no audio assets.
- **Secret handling:** the Gemini key is read from `VITE_GEMINI_API_KEY` and never committed.

## 4. Measurable Results & Impact

- Shorter time-to-action for prospects via the discovery-call scheduler and downloadable briefs.
- Deeper portfolio proof through interactive case studies and ROI calculators.
- Stronger developer engagement via the REST playground, status monitor and in-browser CLI.

## 5. Future Improvements

Move Gemini calls behind a serverless function so the API key is never exposed in the browser bundle.
