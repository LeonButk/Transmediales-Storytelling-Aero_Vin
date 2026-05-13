// GSAP horizontal scroll for section #abschnitt3
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

		// Fade out current content
		gsap.to([titelEl, teaserEl], {
			duration: 0.5,
			autoAlpha: 0,
			...outPosition,
			ease: 'power2.in',
			onComplete: function() {
				// Update content
				if (newTitel) titelEl.innerHTML = newTitel;
				if (newTeaser) teaserEl.innerHTML = newTeaser;

				// Fade in new content with animation
				gsap.to([titelEl, teaserEl], {
					duration: 1,
					autoAlpha: 1,
					...inPosition,
					ease: 'power2.out'
				});
			}
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

// Animation für Video: verschiebt das Video nach links/oben beim betreten von abschnitt2
// toggleActions: "play reverse pause reverse" bedeutet:
// - play: Animation spielen wenn ScrollTrigger aktiviert wird
// - reverse: Animation rückwärts spielen beim Zurückscollen
// - pause: Animation pausieren wenn ScrollTrigger wieder verlassen wird
// - reverse: Animation rückwärts spielen wenn wieder zurückgescrollt wird
gsap.to(".video iframe",{
	duration: 0.5,
	scrollTrigger:{
		start: "-100 center",
		trigger:"#abschnitt2",
		toggleActions: "play reverse pause reverse"
	},
	x: "-50%",
	y: "-70%"
})

// Animation für Bild: verschiebt das Bild beim betreten von abschnitt2
// Die Reverse-Animation bringt das Bild zurück zu seiner ursprünglichen Position
gsap.to(".bild img",{
	duration: 0.5,
	scrollTrigger:{
		start: "-100 center",
		trigger:"#abschnitt2",
		toggleActions: "play reverse pause reverse"
	},
	x: 0,
	y: 0
})
