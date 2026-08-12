type TransitionDirection = "forward" | "backward";

/**
 * Smooth curtain-based page transition — zero-blink edition.
 *
 * Strategy:
 * 1. Curtain fades IN over 350ms (hides current page).
 * 2. Navigate while fully opaque.
 * 3. Wait until the browser's main thread is idle (new page fully painted).
 * 4. Curtain fades OUT over 600ms (smoothly reveals new page).
 *
 * The curtain colour matches the site background so there is zero contrast
 * flash even if the timing drifts slightly.
 */

const CURTAIN_ID = "fida-page-curtain";
const DURATION_IN  = 350;  // ms — fade-in speed
const DURATION_OUT = 600;  // ms — fade-out speed (slow = silky)
// How long we hold the curtain at full opacity before starting the fade-out.
// This is the key to zero-blink: the new page has time to fully paint.
const MIN_HOLD     = 400;  // ms — absolute minimum hold after navigation

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateOpacity(
  el: HTMLElement,
  from: number,
  to: number,
  duration: number,
  onDone?: () => void
) {
  const startTime = performance.now();
  function tick(now: number) {
    const raw   = Math.min((now - startTime) / duration, 1);
    const eased = easeInOutCubic(raw);
    el.style.opacity = String(from + (to - from) * eased);
    if (raw < 1) {
      requestAnimationFrame(tick);
    } else {
      onDone?.();
    }
  }
  requestAnimationFrame(tick);
}

/** Wait for the browser to be idle (page painted) then call fn. */
function afterPaint(fn: () => void) {
  if (typeof (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback === "function") {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(fn);
  } else {
    // Safari fallback: two rAFs to ensure at least one paint has occurred
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }
}

function getCurtain(): HTMLElement {
  let curtain = document.getElementById(CURTAIN_ID);
  if (!curtain) {
    curtain = document.createElement("div");
    curtain.id = CURTAIN_ID;
    // Match the public-theme background exactly so there is no colour contrast
    // if the curtain lingers a frame longer than expected.
    curtain.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:99999",
      "pointer-events:none",
      "opacity:0",
      "will-change:opacity",
      // Same gradient as .public-theme background
      "background:linear-gradient(135deg,#f0fafb 0%,#fff 48%,#e9fbfd 100%)",
    ].join(";");
    document.body.appendChild(curtain);
  }
  return curtain;
}

export function runDirectionalPageTransition({
  direction,
  destination,
  navigate,
}: {
  direction: TransitionDirection;
  destination: string;
  navigate: () => void;
}) {
  const curtain = getCurtain();

  // ── Step 1: Fade IN ────────────────────────────────────────────────────
  curtain.style.pointerEvents = "all";
  animateOpacity(curtain, 0, 1, DURATION_IN, () => {

    // ── Step 2: Navigate while fully hidden ───────────────────────────────
    const navStarted = performance.now();
    navigate();

    // Scroll the destination to the right position immediately while hidden
    const doScroll = () => {
      if (direction === "backward") {
        const el = document.querySelector<HTMLElement>(".home-fragmentation");
        if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    // Give Next.js / React a tick to mount the new page, then scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        doScroll();
      });
    });

    // ── Step 3: Wait for idle + MIN_HOLD, then fade OUT ───────────────────
    afterPaint(() => {
      const elapsed  = performance.now() - navStarted;
      const remaining = Math.max(0, MIN_HOLD - elapsed);

      setTimeout(() => {
        // One final rAF to make sure the browser has committed a frame of the
        // new page before we start pulling the curtain away.
        requestAnimationFrame(() => {
          animateOpacity(curtain, 1, 0, DURATION_OUT, () => {
            curtain.style.pointerEvents = "none";
          });
        });
      }, remaining);
    });
  });
}
