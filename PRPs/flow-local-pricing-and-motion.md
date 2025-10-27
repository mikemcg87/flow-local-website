name: "Flow Local Web Refresh: Pricing Transparency & Animation Polish"
description: |

## Purpose
Introduce clear two-tier pricing, streamline the landing experience, and refine motion design so the Flow Local site reflects the finalized offer with a smooth, premium feel.

## Core Principles
1. **Context First** – Pull exact pricing/copy from `Flow-local Updated Summary.md:1` and keep narrative hierarchy intact.
2. **Animation with Intent** – Favor purposeful motion; ensure intro does not distort the logo and motion always respects `prefers-reduced-motion`.
3. **Clarity Before Cleverness** – Pricing cards must be scannable, mobile-first, and highlight “Setup waived for first 10 Belfast businesses.”
4. **Progressive Enhancement** – Ensure the page works without JS; animation layers on top.
5. **Obey Global Rules** – Follow CLAUDE/global rules plus repo conventions.

---

## Goal
Ship a refreshed Flow Local marketing page that:
- Surfaces Professional (£300/mo) and Premium (£450/mo) tiers with benefits and WhatsApp add-on.
- Replaces the current long logo-stroke intro (which currently “triples” the logo paths) with a concise reveal that preserves brand fidelity and gets visitors into content faster.
- Swaps the existing depth-scroll effect for a cleaner fade/translate pattern so previous sections don’t linger visibly once scrolled past.

## Why
- **Sales enablement**: Prospects demanded pricing transparency; aligns with Archon task `71419d45`.
- **Conversion impact**: Faster first paint and clearer motion reduce bounce/friction for Belfast trades target.
- **Maintainability**: Current ScrollTrigger stack is complex and leaves prior sections semi-visible; simplifying reduces future rework and mobile jank.

## What
- New pricing section after the “solution” narrative, including tier cards, add-on note, and urgency ribbon.
- Updated hero/CTA copy to mention transparent pricing + offer.
- Revised intro animation (short fade/scale with subtle accent pulse) that does not alter the logo geometry.
- Streamlined scroll animation (fade/translate with complete fade-out for prior sections) to eliminate overlapping text.
- Demo panel labels/straplines updated to reflect new pricing language.

### Success Criteria
- [ ] Pricing cards render correctly on mobile & desktop; tiers include “What’s included,” “Best for,” profit/margin note, and WhatsApp add-on.
- [ ] Intro animation completes in ≤1.5s, preserves logo appearance, and respects `prefers-reduced-motion`.
- [ ] Scroll experience keeps prior sections hidden once out of view, with smooth performance on iOS/Android.
- [ ] `npm run build` completes without errors; visual QA passes in Chrome + mobile emulation.
- [ ] All copy matches Obsidian summary (Professional £300, Premium £450, setup waived for first 10).

## All Needed Context

### Documentation & References
```yaml
- file: Flow-local Updated Summary.md:1
  why: Canonical pricing, positioning, urgency language.

- file: README.md:1
  why: Describes current features, TODOs, and tech stack expectations.

- file: src/main.js
  why: Houses intro animation, ScrollTrigger logic, demo CTA behavior.

- file: src/style.css
  why: Tailwind layers + custom classes for sections/animations.

- file: index.html
  why: Landing page structure; insert pricing section, adjust hero copy.

- doc: https://greensock.com/docs/v3/Plugins/ScrollTrigger
  why: Guidance for simplified ScrollTrigger usage, kill/remove patterns.

- doc: https://animejs.com/documentation/
  why: Reference for alternative intro animation sequencing.

- doc: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
  why: Maintain responsive typography when adding pricing cards.
```

### Current Codebase tree (key parts)
```bash
.
├── index.html
├── package.json
├── src/
│   ├── main.js
│   └── style.css
└── tailwind.config.js
```

### Desired Codebase tree (net-new/modified focus)
```bash
.
├── index.html                # +pricing section markup, copy updates
├── src/
│   ├── main.js              # +new intro timeline, simplified scroll logic
│   └── style.css            # +pricing card styles, motion tweaks
└── PRPs/
    └── flow-local-pricing-and-motion.md (this PRP)
```

### Known Gotchas & Library Quirks
```text
# Current intro animation manipulates strokeDashoffset, causing the logo to render triple-line artifacts — must be removed.
# ScrollTrigger depth effect uses 3D transforms; prior sections remain visible/legible even after scrolling past.
# Demo buttons rely on JS ripple injection—maintain position:relative boundaries.
# Tailwind directives are imported at top of style.css; custom classes must sit within appropriate @layer blocks if needed.
# Respect prefers-reduced-motion: reduce or skip animations entirely when true.
```

## Implementation Blueprint

### Ordered Task List
```yaml
Task 1: Update Hero Messaging
MODIFY index.html:
  - Section `.section-hero`: Mention transparent pricing and setup-waived offer near primary CTA.
  - Align headline/subtext with pricing narrative from Obsidian summary.

Task 2: Insert Pricing Section
MODIFY index.html:
  - Add `<section class="section section-pricing" data-section="X">` after the solution/features block.
  - Include tier cards for Professional (£300/mo) and Premium (£450/mo) with inclusions, “Best for,” WhatsApp add-on, and profit reassurance.
  - Add urgency banner: “Setup fee waived for first 10 Belfast businesses.”

Task 3: Style Pricing & Layout
MODIFY src/style.css:
  - Define `.section-pricing`, `.pricing-grid`, `.pricing-card`, `.pricing-badge`, `.pricing-meta`.
  - Use accent palette, responsive `clamp()` typography, and ensure cards stack on small screens.

Task 4: Replace Intro Animation
MODIFY src/main.js:
  - Remove strokeDashoffset preparation; implement concise fade/scale timeline that preserves logo appearance.
  - Skip animation entirely when `prefers-reduced-motion`.

Task 5: Simplify Scroll Effects
MODIFY src/main.js:
  - Replace depth/scale/z transforms with fade/translate triggers that fully hide previous sections (e.g., toggle `.section--visible`).
  - Ensure triggers are disabled when reduced-motion is set.

Task 6: Align Demo Panel Copy
MODIFY index.html & src/main.js (alerts/logs):
  - Update demo headings/subtext to reference the £300/£450 tiers.
  - Remove placeholder pricing from alerts.

Task 7: Accessibility & Motion Preferences
MODIFY src/style.css / src/main.js:
  - Guarantee intro overlay and section fade-ins respect reduced-motion.
  - Validate focus order now includes pricing section.

Task 8: Cleanup / Dead Code Removal
MODIFY src/main.js:
  - Remove unused imports if ScrollTrigger/GSAP no longer required.
  - Comment rationale if both anime.js and GSAP remain.
```

### Pseudocode Highlights
```javascript
// Intro replacement
function initIntroSequence() {
  const intro = document.getElementById('intro');
  const header = document.getElementById('header');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finalizeIntro(intro, header);
    return;
  }

  anime.timeline({ easing: 'easeOutQuad' })
    .add({ targets: '.intro-logo-container', opacity: [0, 1], scale: [0.85, 1], duration: 500 })
    .add({ targets: '#intro-logo', scale: [1, 1.05], duration: 300, direction: 'alternate', loop: 2 })
    .add({ targets: intro, opacity: [1, 0], duration: 400, complete: () => finalizeIntro(intro, header) });
}

function finalizeIntro(intro, header) {
  intro.style.display = 'none';
  header.classList.add('visible');
}

// Scroll fade
function initScrollEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.utils.toArray('.section').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      onEnter: () => section.classList.add('section--visible'),
      onLeaveBack: () => section.classList.remove('section--visible')
    });
  });
}
```

## Integration Points
```yaml
BUILD:
  - No Vite config changes expected; ensure new CSS stays within Tailwind pipeline.

ANIMATION LIBS:
  - If ScrollTrigger is removed, drop import/registration.
  - Otherwise, document the simplified usage.
```

## Validation Loop

### Level 1 – Build/Test
```bash
npm run build
```

### Level 2 – Visual QA
1. `npm run preview` → Chrome desktop: confirm intro timing, pricing section layout, scroll fade.
2. Chrome dev tools mobile emulation (iPhone SE, Pixel 7): verify cards stack, demo panel doesn’t obstruct.
3. Toggle OS/browser “Reduce motion”: ensure animations skip and content instantly visible.

### Level 3 – Regression Checks
- Confirm demo CTA buttons still fire ripple effect and open links.
- Scroll bottom/top repeatedly to ensure previous sections remain hidden when out of view.
- Optional Lighthouse snapshot to verify animation changes didn’t introduce regressions.

## Final Validation Checklist
- [ ] Copy matches `Flow-local Updated Summary.md`.
- [ ] Intro overlay hides within ≤1.5s and keeps logo visually identical.
- [ ] Scroll fade keeps prior sections from lingering onscreen.
- [ ] `npm run build` succeeds; visuals verified on desktop + mobile.
- [ ] CTAs (WhatsApp/Messenger/Instagram) confirmed post-refresh.
