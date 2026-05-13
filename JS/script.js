// GSAP horizontal scroll for section #abschnitt3
ScrollTrigger.config({
	limitCallbacks: true
});
const contentsRechts = gsap.utils.toArray("#horizontal .content");

gsap.to(contentsRechts, {
	xPercent: -100 * (contentsRechts.length - 1),
	ease: "none",
	scrollTrigger: {
		trigger: "#abschnitt3",
		pin: true,
		scrub: 2,
		snap: {
			snapTo:	1 / (contentsRechts.length - 1),
			duration: 0.5,
			ease: "power1.in",
		},
		end: "+=3500",
	}
});

const contentsLinks = gsap.utils.toArray("#horizontalLinks .content");

gsap.to(contentsLinks, {
	xPercent: 100 * (contentsLinks.length - 1),
	ease: "none",
	scrollTrigger: {
		trigger: "#abschnitt5",
		pin: true,
		scrub: 2,
		snap: {
			snapTo:	1 / (contentsLinks.length - 1),
			duration: 0.5,
			ease: "power1.in",
		},
		end: "+=3500",
	}
});

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


