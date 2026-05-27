// GSAP horizontal scroll for section #abschnitt3

// Lenis removed for testing — use native browser scrolling and default ScrollTrigger behavior
// If you want to re-enable Lenis later, add the script tag in index.html and restore the scrollerProxy + RAF logic.
const horizontalSpeedFactor = 1.8; // Größer = langsameres horizontales Scrollen

// Unterstütze mehrere horizontale Bereiche (.abschnitt--horizontal) und ihre "reverse" Variante
function setupHorizontalSections() {
	const sections = gsap.utils.toArray('.abschnitt--horizontal, .abschnitt--horizontal-reverse');

	sections.forEach(section => {
		const container = section.querySelector('.abschnitt__horizontal');
		if (!container) return;

		const contents = gsap.utils.toArray(container.querySelectorAll('.content'));
		if (!contents.length) return;

		const isReverse = section.classList.contains('abschnitt--horizontal-reverse');
		const xPercentValue = isReverse ? 100 * (contents.length - 1) : -100 * (contents.length - 1);

		gsap.to(contents, {
			xPercent: xPercentValue,
			ease: 'none',
			scrollTrigger: {
				trigger: section,
				pin: true,
				scrub: 0.5,
				end: () => "+=" + (window.innerWidth * (contents.length - 1) * horizontalSpeedFactor)
			}
		});
	});

	// Simple fade-in reveal for elements with .reveal-type
	function setupRevealType() {
		if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

		const revealEls = document.querySelectorAll('.reveal-type');
		revealEls.forEach(el => {
			gsap.from(el, {
				autoAlpha: 0,
				duration: 3,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: el,
					start: 'top 50%',
					end: 'center',
					scrub: 0.5,
					toggleActions: 'play play reverse reverse',
					markers: false
				}
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setupRevealType);
	} else {
		setupRevealType();
	}

}

// New: class-based reveal for vertical text paragraphs
function setupVerticalClassReveal() {
	if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

	const els = gsap.utils.toArray('.reveal-vertical-text');
	els.forEach(el => {
		const section = el.closest('.abschnitt');
		if (!section) return;

		gsap.from(el, {
			y: 36,
			autoAlpha: 0,
			duration: 0.8,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				toggleActions: 'play none none reset',
				markers: false
			}
		});
	});
}

// New: Setup frame build animation and text fade-in
function setupFrameAndTextBuildAnimation() {
	if (typeof gsap === 'undefined') return;

	const frames = gsap.utils.toArray('.frame');
	const bigLeft = document.querySelector('.aeroVin');
	const bigRight = document.querySelector('.momentum');

	if (frames.length < 4 || !bigLeft || !bigRight) return;

	const tl = gsap.timeline();

	// Frame 1 (top horizontal) - grow width
	tl.from(frames[0], {
		width: 0,
		duration: 2,
		ease: 'power2.out'
	}, 0);

	// Frame 2 (right vertical) - grow height
	tl.from(frames[1], {
		height: 0,
		duration: 2,
		ease: 'power2.out'
	}, 0);

	// Frame 3 (bottom horizontal) - grow width
	tl.from(frames[2], {
		width: 0,
		duration: 2,
		ease: 'power2.out'
	}, 0);

	// Frame 4 (left vertical) - grow height
	tl.from(frames[3], {
		height: 0,
		duration: 2,
		ease: 'power2.out'
	}, 0);

	// After frames finish, fade in bigLeft and bigRight
	tl.from([bigLeft, bigRight], {
		autoAlpha: 0,
		duration: 1,
		ease: 'power2.out'
	}, 1.5);
}

// Initial run will be done after ScrollTrigger registration in DOMContentLoaded

/*
snap: {
			snapTo:	1 / (contentsRechts.length - 1),
			duration: 0.5,
			ease: "power1.in",
		},
		end: "+=3500",
 */



/*
snap: {
			snapTo:	1 / (contentsLinks.length - 1),
			duration: 0.5,
			ease: "power1.in",
		},
		end: "+=3500",
 */

document.addEventListener('DOMContentLoaded', function() {
	if (typeof gsap === 'undefined') {
		console.warn('GSAP nicht geladen — Animationen werden nicht ausgeführt.');
		return;
	}

		// --- Video thumbnail behaviour: load iframe only on click ---
		const videoThumbButtons = document.querySelectorAll('.video-thumb');
		videoThumbButtons.forEach(btn => {
			btn.addEventListener('click', function() {
				const videoBlock = btn.closest('.video');
				if (!videoBlock) return;
				const iframe = videoBlock.querySelector('iframe');
				if (!iframe) return;
				const baseSrc = iframe.getAttribute('data-src');
				if (!baseSrc) return;
				const joiner = baseSrc.includes('?') ? '&' : '?';
				const full = baseSrc + joiner + 'autoplay=1&playsinline=1&rel=0&mute=1';
				if (!iframe.getAttribute('src')) iframe.setAttribute('src', full);
							videoBlock.classList.add('is-playing');
				btn.setAttribute('aria-hidden', 'true');
				btn.setAttribute('tabindex', '-1');
			});
		});

		// register ScrollTrigger (safe to call even if already registered)
		if (gsap && gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger);

		// Setup animations
		if (typeof setupFrameAndTextBuildAnimation === 'function') setupFrameAndTextBuildAnimation();
		if (typeof setupHorizontalSections === 'function') setupHorizontalSections();
		if (typeof setupHorizontalTextReveal === 'function') setupHorizontalTextReveal();
		if (typeof setupVerticalClassReveal === 'function') setupVerticalClassReveal();

		// Reset video in #abschnitt1 when leaving the section (so thumbnail returns)
		(function setupResetOnLeave() {
			const abs1 = document.getElementById('abschnitt1');
			if (!abs1 || typeof ScrollTrigger === 'undefined') return;

			function resetVideo() {
				const videoBlock = abs1.querySelector('.video');
				if (!videoBlock) return;
				const iframe = videoBlock.querySelector('iframe');
				const thumb = videoBlock.querySelector('.video-thumb');
				// remove src to stop playback and free resources
				if (iframe && iframe.getAttribute('src')) {
					iframe.removeAttribute('src');
				}
				videoBlock.classList.remove('is-playing');
				if (thumb) {
					thumb.removeAttribute('aria-hidden');
					thumb.removeAttribute('tabindex');
				}
			}

			ScrollTrigger.create({
				trigger: abs1,
				start: 'top top',
				end: 'bottom top',
				onLeave: resetVideo,
				onLeaveBack: resetVideo // also reset if leaving upwards (edge cases)
			});
		})();


});




function createScrollDebugByVH(stepVH = 100) {

	// gespeicherter letzter Scrollwert
	let lastScrollY = window.scrollY;

	// aktuelle "Stufe" (0 = Start)
	let currentStep = 0;

	// 100dvh in Pixeln
	const getStepSize = () => {
		return window.innerHeight * (stepVH / 100);
	};

	window.addEventListener("scroll", () => {

		const scrollY = window.scrollY;
		const stepSize = getStepSize();

		// Differenz seit letztem Event
		const delta = scrollY - lastScrollY;

		// wenn nichts passiert → skip
		if (delta === 0) return;

		// neue absolute Step-Position berechnen
		const newStep = Math.round(scrollY / stepSize);

		// nur reagieren wenn sich Step wirklich ändert
		if (newStep !== currentStep) {

			// Richtung erkennen
			const direction = newStep > currentStep ? "↓ down" : "↑ up";

			currentStep = newStep;

			console.log(
				`Scroll Step: ${currentStep} (${direction})`
			);
		}

		lastScrollY = scrollY;
	});
}

createScrollDebugByVH(100);

// Smooth diagonal transition between video and image when entering #abschnitt2
// Single scrubbed timeline so both elements move in sync (feels like diagonal scroll).
gsap.registerPlugin(ScrollTrigger);

// Set sensible, less extreme start/end positions so image is fullframe before #abschnitt3
