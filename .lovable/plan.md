# DuoSpace Cinematic Product Experience

## Goal
Rebuild the public release hub as a dark, cinematic, product-first DuoSpace experience centered on **“Two people. One private world.”** Preserve authentication, admin release management, real download data, and every verified preview interaction.

## What stays intact
- Existing `/auth` admin sign-in and protected `/admin/releases` workflow.
- APK validation/upload, published-release lookup, store/web/IPA links, and honest “Coming soon” states.
- Real interactive previews for chat, calls, gallery, shared music, private location, and personalization.
- Reduced-motion handling, keyboard access, native scrolling, and responsive device behavior.
- No fabricated testimonials, availability, metrics, certifications, or product features.

## Build plan

### 1. Design system and page atmosphere
- Replace the unfinished white pass with a near-black cinematic system using off-white type, quiet blue-violet DuoSpace accents, thin borders, restrained glass, subtle grain, and controlled ambient light.
- Keep Sora for high-impact display typography, Manrope for readable copy, and JetBrains Mono for technical release metadata.
- Consolidate spacing, radii, shadows, motion durations, and easing into shared tokens.
- Add a lightweight background atmosphere that changes subtly through major chapters without WebGL or scroll-jacking.

### 2. Floating navigation and cinematic hero
- Create the compact floating navigation: DuoSpace, Experience, Privacy, Release, and **Open app →**.
- Rebuild the first viewport around the real DuoSpace UI in two responsive devices.
- Use the approved copy: **“Your world. Just the two of you.”** with the actual product and download destinations.
- Add desktop-only cursor-responsive light/device depth; use lightweight scroll motion on touch devices and static equivalents for reduced motion.

### 3. Editorial brand story
- Add the large statement: **“The internet was built for everyone. DuoSpace wasn’t.”**
- Build a dedicated **“No audience.”** sequence that progressively removes public-social concepts until only **“You + them”** remains.
- Keep claims concise and grounded in the existing two-person product model.

### 4. One-space interactive product journey
- Replace duplicate feature grids and repeated alternating sections with one sticky, continuous product stage titled **“One space. Six ways to be together.”**
- Add accessible selectable modes for Chat, Calls, Gallery, Music, Location, and Personalization.
- Morph the existing real preview components in place with shared-layout transitions, subtle section-specific lighting, and synchronized copy.
- Preserve each preview’s current interaction: sending/replying, call controls, gallery favorites, music playback, map replay, and theme selection.
- Do not present Surprise as shipped because no verified Surprise implementation exists. The sixth verified surface remains Personalization, described accurately.

### 5. DuoSpace OS and privacy motifs
- Create an original editorial **DuoSpace OS** diagram connecting the six verified surfaces around **US** without resembling a dashboard.
- Rebuild privacy as Device A → protected connection → Device B, followed by verified privacy principles.
- Remove or soften any technical statement that cannot be verified from the current product implementation.

### 6. Lightweight guided demo
- Add an optional, non-blocking 20-second autoplay sequence through the six verified modes.
- Include pause/replay controls, stop autoplay after user interaction, and provide a complete static reduced-motion presentation.
- Reuse existing previews rather than loading duplicate media or inventing screens.

### 7. Release center and closing
- Redesign the live download section as a premium release center using the published version, date, file size, and only real platform URLs.
- Keep unavailable platforms clearly marked **Coming soon** and expose release notes only when real data exists.
- Finish with **“Your space is ready. Two people. One private world.”**, the real web-app CTA, minimal navigation, and the existing admin entry.

### 8. Metadata, performance, and validation
- Update the index title/description/Open Graph/Twitter metadata and canonical URL; remove generic fallback metadata from the document root.
- Lazy-mount below-fold product scenes, avoid duplicated previews, keep animation to transform/opacity, reduce blur on small screens, and retain content visibility optimizations.
- Test public, auth, and release routes; all CTAs/downloads; keyboard and touch operation; reduced motion; error/loading states; font/image loading; and console/type errors.
- Verify 320, 375, 390, 430, 768, 1024, 1440, and 1920 widths for overflow, legibility, target size, and composition.

## Technical details
- Continue with TanStack Start, Tailwind v4 tokens, Motion, and Lenis; add no new animation dependency.
- Keep release/business logic separate from the new presentation components.
- Introduce focused components for the brand statement, mode switcher/product stage, DuoSpace OS, privacy link, no-audience sequence, guided demo, and release center.
- Use semantic controls, ARIA state for mode selection/demo controls, visible focus styles, and `prefers-reduced-motion` throughout.
