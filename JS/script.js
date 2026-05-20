// GSAP horizontal scroll for section #abschnitt3

// Lenis removed for testing — use native browser scrolling and default ScrollTrigger behavior
// If you want to re-enable Lenis later, add the script tag in index.html and restore the scrollerProxy + RAF logic.
const contentsRechts = gsap.utils.toArray("#horizontal .content");
const horizontalSpeedFactor = 1.8; // Größer = langsameres horizontales Scrollen

gsap.to(contentsRechts, {
	xPercent: -100 * (contentsRechts.length - 1),
	ease: "none",
	scrollTrigger: {
		trigger: "#abschnitt3",
		pin: true,
		scrub: 0.5,
		end: () => "+=" + (window.innerWidth * (contentsRechts.length - 1) * horizontalSpeedFactor)
	}
});

/*
snap: {
			snapTo:	1 / (contentsRechts.length - 1),
			duration: 0.5,
			ease: "power1.in",
		},
		end: "+=3500",
 */

const contentsLinks = gsap.utils.toArray("#horizontalLinks .content");

gsap.to(contentsLinks, {
	xPercent: 100 * (contentsLinks.length - 1),
	ease: "none",
	scrollTrigger: {
		trigger: "#abschnitt5",
		pin: true,
		scrub: 0.5,
		end: () => "+=" + (window.innerWidth * (contentsLinks.length - 1) * horizontalSpeedFactor)
	}
});

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

	var titelEl = document.getElementById('titel');
	var teaserEl = document.getElementById('teaser');

	if (!titelEl || !teaserEl) {
		console.warn('Titel oder Teaser Element nicht gefunden');
		return;
	}

	// Set initial state - invisible
	gsap.set([titelEl, teaserEl], {autoAlpha: 0, y: -40});

	// Helper function to animate text change with direction
	// Direction kann sein: "top" (von oben), "left" (von links), "right" (von rechts)
	function animateTextChange(newTitel, newTeaser, direction) {
		direction = direction || "top"; // Standard ist "top" wenn nichts angegeben

		// Position für die Eingangsanimation basierend auf Richtung
		var outPosition = {};
		var inPosition = {};

		if (direction === "top") {
			outPosition = { y: -20 };
			inPosition = { y: 0 };
		} else if (direction === "left") {
			outPosition = { x: -50 };
			inPosition = { x: 0 };
		} else if (direction === "right") {
			outPosition = { x: 50 };
			inPosition = { x: 0 };
		}

		// Fade out current content, update and fade in via timeline
		gsap.timeline()
			.to([titelEl, teaserEl], {
				duration: 0.5,
				autoAlpha: 0,
				...outPosition,
				ease: 'power2.in'
			})
			.call(function() {
				if (newTitel) titelEl.innerHTML = newTitel;
				if (newTeaser) teaserEl.innerHTML = newTeaser;
			})
			.to([titelEl, teaserEl], {
				duration: 1,
				autoAlpha: 1,
				...inPosition,
				ease: 'power2.out'
			});
	}

	// Create ScrollTrigger animations for each section
	const abschnitte = document.querySelectorAll('.abschnitt');

	abschnitte.forEach(function(section) {

		ScrollTrigger.create({
			trigger: section,

			start: "top 60%",
			end: "bottom 40%",

			onEnter: updateText,
			onEnterBack: updateText
		});

		function updateText() {

			const newTitel = section.getAttribute('data-titel');
			const newTeaser = section.getAttribute('data-teaser');
			const direction =
				section.getAttribute('data-animation-direction') || "top";

			animateTextChange(newTitel, newTeaser, direction);
		}
	});
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
